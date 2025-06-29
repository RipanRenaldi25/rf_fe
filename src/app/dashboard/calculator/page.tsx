"use client";
export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InventoryContext } from "@/context/InventoryContext";
import { WeekSummaryContext } from "@/context/WeekSummaryContext";
import { calculate, releaseMaterial } from "@/lib/api/inventoryApi";
import { changeComaToDot } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Decimal from "decimal.js";

import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { MdInventory } from "react-icons/md";
import { toast } from "react-toastify";
import z from "zod";

const calculateSchema = z.object({
  name: z.string().min(1),
  detail: z.string().min(1),
  color: z.string().min(1),
  pcs: z.string().min(1),
  requirementInPcs: z.string().min(1),
  type: z.enum(["WASTE", "REUSE", "REUTILIZATION", ""], {
    message: "Only Waste, Reuse and Reutilization is accepted",
  }),
});

const CalculatorPage = () => {
  const [fetchedData, setFetchedData] = useState<ICalculateResponse | null>(
    null
  );
  const [selectedData, setSelectedData] = useState({});

  const form = useForm<z.infer<typeof calculateSchema>>({
    resolver: zodResolver(calculateSchema),
    defaultValues: {
      color: "",
      detail: "",
      name: "",
      pcs: "",
      requirementInPcs: "",
      type: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof calculateSchema>) => {
    if (values.type === "") {
      toast.error("Pilih kategori terlebih dahulu", { autoClose: 1000 });
      return;
    }
    setOpen(false);
    setFetchedData(null);
    const pcs = changeComaToDot(values.pcs);
    const requirementInPcs = changeComaToDot(values.requirementInPcs);

    const { success, message, data } = await calculate({
      color: values.color,
      detail: values.detail,
      name: values.name,
      pcs,
      requirementInPcs,
      type: values.type,
    });

    if (!data) {
      toast.error("Tidak ada bahan di gudang", { autoClose: 300 });
      return;
    }

    setFetchedData({
      ...data,
      filtered_inventory_transactions:
        data.filtered_inventory_transactions.filter(
          (val: any) => val.stock > 0
        ),
    });
  };

  const [open, setOpen] = useState<boolean>(false);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { inventoryData, setInventoryData } = useContext(InventoryContext);
  const { setSummary, summary } = useContext(WeekSummaryContext);

  const releaseMaterialHandler = async (payload: any) => {
    const { message, success, data } = await releaseMaterial(+payload.id, {
      shelf_id: +payload.shelf.id,
      stock: +payload.stock,
    });
    if (!success) {
      toast.error("Terjadi kesalahan saat mengeluarkan barang  dari gudang", {
        autoClose: 300,
      });
      return;
    }
    setFetchedData((prevValue: any) => ({
      ...prevValue,
      filtered_inventory_transactions:
        prevValue?.filtered_inventory_transactions?.filter(
          (inventory: any) => +inventory.id !== +payload.id
        ) ?? [],
    }));

    setInventoryData((prevValue: any) => [
      ...prevValue.map((val: ITransactionWithMaterial) => ({
        ...val,
        stock: val.id === payload.id ? 0 : val.stock,
      })),
      {
        ...payload,
        movement: "OUT",
      },
    ]);

    if (summary.length === 0) {
      setSummary((prevValue: ISummary[]) => [
        ...prevValue,
        {
          type: payload.material?.type,
          total: +payload.stock,
        },
      ]);
    } else {
      setSummary((prevValue: ISummary[]) =>
        prevValue.map((val) => ({
          ...val,
          total:
            val.type === payload.material?.type
              ? new Decimal(val.total)
                  .minus(+payload.stock)
                  .toDecimalPlaces(2)
                  .toNumber()
              : val.total,
        }))
      );
    }

    toast.success(message, {
      autoClose: 300,
    });
  };

  return (
    <article className="relative space-y-10">
      <Card>
        <CardContent className="space-y-4">
          <CardHeader>
            <h1 className="text-xl font-semibold text-center">Calculator</h1>
            <div className="flex items-center justify-center w-full rounded-lg"></div>
          </CardHeader>

          <section>
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(handleSubmit)}
              >
                <div className="flex flex-col w-full gap-3 lg:flex-row">
                  <div className="space-y-6 flex-1">
                    <FormField
                      name="name"
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <div className="space-y-2">
                            <Label htmlFor="name">Nama Bahan</Label>
                            <FormControl>
                              <Input {...field} placeholder="Katun" id="name" />
                            </FormControl>
                            <FormMessage />
                          </div>
                        );
                      }}
                    />

                    <FormField
                      name="detail"
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <div className="space-y-2">
                            <Label htmlFor="detail">Detail Bahan</Label>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="kombad 24s"
                                id="detail"
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        );
                      }}
                    />

                    <FormField
                      name="color"
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <div className="space-y-2">
                            <Label htmlFor="color">Warna</Label>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="#ffffff"
                                id="color"
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        );
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-6">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => {
                        return (
                          <div className="w-full space-y-2">
                            <Label htmlFor="type">Kategori</Label>
                            <FormControl>
                              <select
                                id="type"
                                className="w-full p-2 border rounded-md"
                                {...field}
                              >
                                <option value={""}>Pilih Kategori</option>
                                <option value={"REUSE"}>Reuse</option>
                                <option value={"REUTILIZATION"}>
                                  Reutilization
                                </option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </div>
                        );
                      }}
                    />
                    <FormField
                      name="pcs"
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <div className="space-y-2">
                            <Label htmlFor="pcs">Berapa pcs baju</Label>
                            <FormControl>
                              <Input {...field} placeholder="100" id="pcs" />
                            </FormControl>
                            <FormMessage />
                          </div>
                        );
                      }}
                    />

                    <FormField
                      name="requirementInPcs"
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <div className="space-y-2">
                            <Label htmlFor="requirementInPcs">
                              Bahan yang dibutuhkan per baju
                            </Label>
                            <div className="relative">
                              <FormControl>
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="0,25"
                                  id="requirementInPcs"
                                />
                              </FormControl>
                              <p className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400">
                                Kg
                              </p>
                            </div>
                            <FormMessage />
                          </div>
                        );
                      }}
                    />
                  </div>
                </div>
                <Button type="submit">Cari bahan</Button>
              </form>
            </Form>
          </section>
        </CardContent>
      </Card>

      {fetchedData && (
        <Dialog
          open={open}
          onOpenChange={(val) => {
            setOpen(val);
            if (!val) {
              setSelectedIndex(null);
            }
          }}
        >
          <Card>
            <CardContent className="flex px-4 rounded-full justify-between ">
              <div className="w-full relative">
                <div>
                  <div className="flex items-center gap-2">
                    <h1>Total Bahan Yang Dibutuhkan </h1>
                    <p className="font-bold">
                      {fetchedData.totalNeededMaterialInKg ?? 0} Kg
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <h1>Barang yang tersedia di gudang: </h1>
                    <p className="font-bold">
                      {fetchedData.stockInInventory ?? 0} Kg
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1>Sisa Bahan Yang Dibutuhkan: </h1>
                    <p className="font-bold">
                      {fetchedData.neededMaterialInKg ?? 0} Kg
                    </p>
                  </div>
                </div>
              </div>

              <DialogTrigger asChild>
                <Button>Lihat Bahan</Button>
              </DialogTrigger>
            </CardContent>
          </Card>

          <DialogContent className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full z-95 bg-white h-[75%]">
            <DialogHeader>
              <DialogTitle asChild>
                <div className="flex justify-between">
                  <p>Daftar Sisa Bahan di Gudang</p>
                </div>
              </DialogTitle>
              <DialogDescription>
                Pilih sisa bahan yang ingin dikeluarkan dari gudang
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto p-2 space-y-4 h-[80%]">
              {fetchedData?.filtered_inventory_transactions?.length > 0 ? (
                fetchedData.filtered_inventory_transactions.map(
                  (inventory, i) => {
                    return (
                      <Card
                        className={clsx("space-y-4 cursor-pointer", {
                          "outline-2 outline-[#2AB675]": i === selectedIndex,
                        })}
                        onClick={() => {
                          setSelectedIndex(i);
                          setSelectedData(inventory);
                        }}
                      >
                        <CardContent>
                          <div className="flex gap-3 items-center justify-between">
                            <div className="space-y-2">
                              <div className="space-y-1">
                                <CardTitle>
                                  {inventory?.material?.name ?? "Nama Bahan"}
                                </CardTitle>
                                <CardDescription className="flex gap-3">
                                  <div className="flex gap-2 items-center">
                                    <div className="size-3 rounded-full bg-green-400"></div>
                                    <p>
                                      {inventory?.material?.type ??
                                        "Kategori Bahan"}{" "}
                                      ({inventory?.material?.color ?? "#ffffff"}
                                      )
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="size-2 border-1 rounded-full bg-black"></div>
                                    <p>{inventory?.stock ?? 0} Kg</p>
                                  </div>
                                </CardDescription>
                              </div>
                              <div className="flex gap-2 items-center">
                                <MdInventory />
                                <p className="text-sm">
                                  Rak {inventory?.shelf?.rack ?? "A"}
                                  {inventory?.shelf?.number ?? 0}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 cursor-pointer items-center border py-2 px-5 rounded-md">
                              <div
                                className={clsx(
                                  "border-1 rounded-full size-6 relative",
                                  {
                                    "bg-[#2AB675]": i === selectedIndex,
                                  }
                                )}
                              >
                                <div className="size-2 rounded-full bg-white top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 absolute"></div>
                              </div>
                              <p>Select</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }
                )
              ) : (
                <Card className={clsx("space-y-4 ")}>
                  <CardContent>
                    <h1>Tidak ditemukan sisa bahan di gudang</h1>
                  </CardContent>
                </Card>
              )}
            </div>
            <DialogFooter className="flex  justify-between items-center">
              <Button
                className="bg-[#2AB675]"
                onClick={(e) => {
                  releaseMaterialHandler(selectedData);
                  setSelectedIndex(null);
                }}
              >
                Keluarkan dari gudang
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </article>
  );
};

export default CalculatorPage;
