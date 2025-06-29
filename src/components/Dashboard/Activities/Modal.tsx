"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InventoryContext } from "@/context/InventoryContext";
import { ModalContext } from "@/context/Modal";
import { ShelfContext } from "@/context/ShelfContext";
import { addMaterial } from "@/lib/api/inventoryApi";
import { changeComaToDot } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlignVerticalDistributeStart, X } from "lucide-react";
import { memo, useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import CustomSelect from "./CustomSelect";
import { WeekSummaryContext } from "@/context/WeekSummaryContext";
import { usePathname } from "next/navigation";
import Decimal from "decimal.js";

const InputSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  detail: z.string().min(1, { message: "Detail is required" }),
  color: z
    .string()
    .min(7, { message: "Warna heksa minimal 7 karakter" })
    .max(7, { message: "Warna heksa maksimal 7 karakter" }),
  stock: z
    .string()
    .min(1, { message: "Stock minimum is greather than 10 gram" }),
  type: z
    .enum(["WASTE", "REUSE", "REUTILIZATION", ""], {
      message: "Only Waste, Reuse and Reutilization is accepted",
    })
    .default("REUSE"),
  shelf_id: z.number({ message: "shelf is required" }),
});

export const Modal = memo(
  ({ showModal, setShowModal }: { showModal: boolean; setShowModal: any }) => {
    const { inventoryData, setInventoryData } = useContext(InventoryContext);
    const form = useForm({
      resolver: zodResolver(InputSchema),
      defaultValues: {
        name: "",
        color: "",
        detail: "",
        stock: "",
        type: "",
      },
    });

    const pathName = usePathname();

    const { setSummary, summary } = useContext(WeekSummaryContext);

    const handleSubmit = async (values: z.infer<typeof InputSchema>) => {
      const stock = changeComaToDot(values.stock);
      if (values.type === "") {
        toast.error("Pilih kategori terlebih dahulu", { autoClose: 1000 });
        return;
      }
      const payload: IAddInventoryPayload = {
        ...values,
        stock,
        type: values.type,
      };

      const { message, success, data } = await addMaterial(payload);

      if (!success) {
        toast.error(message, { autoClose: 1000 });
        return;
      }

      const inventory =
        data.inventory_transactions[data.inventory_transactions.length - 1];

      const mappedInventoryData = {
        id: inventory.id,
        movement: inventory.movement,
        stock: inventory.stock,
        created_at: inventory.created_at,
        updated_at: inventory.updated_at,
        material: {
          name: data.name,
          detail: data.detail,
          color: data.color,
          type: data.type,
        },
        shelf: {
          id: inventory.shelf.id,
          number: inventory.shelf.number,
          rack: inventory.shelf.rack,
        },
      };

      setInventoryData((prevValue: ITransactionWithMaterial[]) => [
        mappedInventoryData,
        ...prevValue,
      ]);

      setShowModal(false);
      if (summary.length === 0) {
        setSummary((prevValue: ISummary[]) => [
          ...prevValue,
          {
            type: values.type,
            total: +values.stock,
          },
        ]);
      } else {
        setSummary((prevValue: ISummary[]) =>
          prevValue.map((val) => ({
            ...val,
            total:
              val.type === values.type
                ? new Decimal(val.total)
                    .plus(+stock)
                    .toDecimalPlaces(2)
                    .toNumber()
                : val.total,
          }))
        );
      }
      form.reset();
      setSelected(null);
      toast.success(message, {
        autoClose: 500,
      });
    };

    const { setShowAddRact } = useContext(ModalContext);
    const { shelfs } = useContext(ShelfContext);
    let setSelected: any = null;

    return (
      <section
        className={`fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2  border  w-2/3 bg-white z-95 p-10 py-8 transition-all rounded-lg border-black scale-0  duration-300 ${
          showModal && "scale-100"
        }`}
      >
        <header className="flex items-center justify-center mb-7 relative">
          <h1 className="text-black text-xl font-bold">DATA INPUT</h1>
          <Button
            type="button"
            variant={"ghost"}
            className="absolute right-0 cursor-pointer"
            onClick={() => setShowModal(false)}
          >
            <X />
          </Button>
        </header>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-10"
          >
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex-1 space-y-7">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <div className="w-full space-y-2">
                        <Label htmlFor="name">Jenis Bahan</Label>
                        <FormControl>
                          <Input
                            id="name"
                            type="text"
                            {...field}
                            placeholder="Katun"
                            className="w-full"
                          />
                        </FormControl>

                        <FormMessage />
                      </div>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="detail"
                  render={({ field }) => {
                    return (
                      <div className="w-full space-y-2">
                        <Label htmlFor="detail">Detail Bahan</Label>
                        <FormControl>
                          <Input
                            id="detail"
                            type="text"
                            {...field}
                            placeholder="Kombad 24s"
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => {
                    return (
                      <div className="w-full space-y-2">
                        <Label htmlFor="stock">Berat Bahan</Label>
                        <FormControl>
                          <div className="relative">
                            <Input
                              id="stock"
                              type="text"
                              {...field}
                              placeholder="5,4"
                              className="w-full"
                            />
                            <p className="absolute top-1/2 -translate-y-1/2 right-3 text-sm text-gray-400">
                              kg
                            </p>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </div>
                    );
                  }}
                />
              </div>
              <div className="flex-1 space-y-7">
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => {
                    return (
                      <div className="w-full space-y-2">
                        <Label htmlFor="color">Warna</Label>
                        <FormControl>
                          <Input
                            id="color"
                            type="text"
                            {...field}
                            placeholder="#ffffff"
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    );
                  }}
                />

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
                            <option value={""}>
                              <p className="text-gray-200">Pilih Kategori</p>
                            </option>
                            <option value={"REUSE"}>Reuse</option>
                            <option value={"REUTILIZATION"}>
                              Reutilization
                            </option>
                            <option value={"WASTE"}>Waste</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </div>
                    );
                  }}
                />
                <FormField
                  name="shelf_id"
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <div className="w-full space-y-2 ">
                        <Label htmlFor="ract">Rak</Label>
                        <FormControl>
                          <CustomSelect
                            setIsAddRact={setShowAddRact}
                            shelfOptions={shelfs}
                            {...field}
                            onChange={(val: any, setSelectedFunc: any) => {
                              console.log({ val, setSelectedFunc });
                              field.onChange(val);
                              setSelected = setSelectedFunc;
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    );
                  }}
                />
              </div>
            </div>

            <Button
              className="min-w-2/12 bg-[#99BC85]/50 text-black font-bold border-1 border-black hover:bg-[#99BC85]/10 cursor-pointer"
              type="submit"
            >
              INPUT
            </Button>
          </form>
        </Form>
      </section>
    );
  }
);
