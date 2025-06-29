"use client";
export const dynamic = "force-dynamic";
import Decimal from "decimal.js";

import { ActivitiesTable } from "@/components/Dashboard/Activities/ActivitiesTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { OutputColumn } from "@/components/Dashboard/Output/Column";
import {
  getInventoryTransactionsBelongToMaterial,
  releaseMaterial,
} from "@/lib/api/inventoryApi";
import { toast } from "react-toastify";
import { useContext } from "react";
import { InventoryContext } from "@/context/InventoryContext";
import { useRouter } from "next/navigation";
import { WeekSummaryContext } from "@/context/WeekSummaryContext";

const InputSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  detail: z.string().optional(),
  color: z.string().optional(),
  type: z.enum(["REUSE", "WASTE", "REUTILIZATION"], {
    message: "Type only REUSE | WASTE | REUTILIZATION",
  }),
});

const OutputPage = () => {
  const form = useForm({
    resolver: zodResolver(InputSchema),
    defaultValues: {
      color: "",
      detail: "",
      name: "",
      type: "REUSE",
    },
  });

  const [tableData, setTableData] = useState<ITransactionWithMaterial[]>([]);
  const { summary, setSummary } = useContext(WeekSummaryContext);

  const handleSubmit = async (values: z.infer<typeof InputSchema>) => {
    const { message, success, data } =
      await getInventoryTransactionsBelongToMaterial({
        name: values.name,
        type: values.type,
        color: values.color,
        detail: values.detail,
      });
    if (!success) {
      toast.error("Terjadi kesalahan saat mengambil data", { autoClose: 1000 });
      return;
    }

    setTableData(data);
  };

  const { inventoryData, setInventoryData } = useContext(InventoryContext);
  const router = useRouter();

  const releaseMaterialHandler = async (row: any) => {
    const { message, success, data } = await releaseMaterial(+row.id, {
      shelf_id: +row.shelf.id,
      stock: +row.stock,
    });

    if (!success) {
      toast.error("Terjadi kesalahan saat mengeluarkan data dari gudang", {
        autoClose: 1000,
      });
      return;
    }

    const mappedInventoryData = {
      id: data.id,
      movement: data.movement,
      stock: data.stock,
      created_at: data.created_at,
      updated_at: data.updated_at,
      material: {
        name: data.material.name,
        detail: data.material.detail,
        color: data.material.color,
        type: data.material.type,
      },
      shelf: {
        id: data.shelf.id,
        number: data.shelf.number,
        rack: data.shelf.rack,
      },
    };

    setTableData((prevValue: ITransactionWithMaterial[]) => [
      ...prevValue.filter((val) => val.id !== row.id),
    ]);

    setInventoryData((prevValue: ITransactionWithMaterial[]) => [
      ...prevValue.map((val) => ({
        ...val,
        stock: val.id === row.id ? 0 : val.stock,
      })),
      mappedInventoryData,
    ]);

    if (summary.length === 0) {
      setSummary((prevValue: ISummary[]) => [
        ...prevValue,
        {
          type: row.type,
          total: +row.stock,
        },
      ]);
    } else {
      setSummary((prevValue: ISummary[]) =>
        prevValue.map((val) => ({
          ...val,
          total:
            val.type === row.material?.type
              ? new Decimal(val.total)
                  .minus(+row.stock)
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
    <article className="space-y-6">
      <Card>
        <CardContent>
          <header className="flex items-center justify-center mb-7 relative">
            <h1 className="text-black text-xl font-bold">DATA OUTPUT</h1>
          </header>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex-1 space-y-7 flex gap-6">
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
                </div>
              </div>

              <Button
                className="w-full bg-[#99BC85]/50 text-black font-bold border-1 border-black hover:bg-[#99BC85]/10 cursor-pointer"
                type="submit"
              >
                Cari Bahan
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <section>
        <ActivitiesTable
          columns={OutputColumn({
            actions: { output: releaseMaterialHandler },
          })}
          data={tableData}
        />
      </section>
      {/* {tableData.length > 0 && (
        <section className="flex justify-end items">
          <Button className="cursor-pointer bg-[#BF3131] hover:bg-[#a43434]">
            Output
          </Button>
        </section>
      )} */}
    </article>
  );
};

export default OutputPage;
