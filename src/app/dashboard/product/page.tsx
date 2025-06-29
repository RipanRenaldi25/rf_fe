"use client";
import { ActivitiesTable } from "@/components/Dashboard/Activities/ActivitiesTable";
import SearchInput from "@/components/Dashboard/Activities/SearchInput";
import { ProductColumn } from "@/components/Dashboard/product/Column";
import { PaginationTable } from "@/components/Dashboard/product/Pagination";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
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
import { ModalContext } from "@/context/Modal";
import { useDebounce } from "@/hooks/useDebounce";
import {
  addProduct,
  deleteProduct,
  searchProduct,
} from "@/lib/api/inventoryApi";
import { changeComaToDot } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";

const productSchema = z.object({
  name: z.string().min(1),
  required_weight: z.string().min(1),
});

export default function ProductPage() {
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      required_weight: "",
    },
  });

  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = async (values: z.infer<typeof productSchema>) => {
    const weight_required = changeComaToDot(values.required_weight);

    const { message, success, data } = await addProduct({
      name: values.name,
      weight_required,
    });
    if (!success) {
      toast.error("Terjadi kesalahan saat menambahkan data", {
        autoClose: 500,
      });
      return;
    }
    setOpen(false);
    toast.success(message, { autoClose: 500 });
  };
  const [products, setProducts] = useState<IProduct[]>([]);
  const [totalData, setTotalData] = useState<number>(0);

  const [searchKeyword, setSearchKeyword] = useState("");

  const keyword = useDebounce(searchKeyword);

  const deleteProductHandler = async (row: IProduct) => {
    console.log({ row });
    const { message, success, data } = await deleteProduct(row.id);
    if (!success) {
      toast.error("Terjadi kesalahan saat menghapus data", { autoClose: 500 });
      return;
    }

    setProducts((prevValue) => prevValue.filter((val) => val.id !== row.id));

    toast.success(message, { autoClose: 500 });
  };

  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      const { message, success, data } = await searchProduct({
        name: keyword,
        page: Number(searchParams.get("page")) ?? 1,
      });
      if (!success) {
        toast.error("Terjadi kesalahan saat mengambil data produk", {
          autoClose: 500,
        });
        return;
      }

      console.log({ data });

      setProducts(data.products);
      setTotalData(data.totalData);
    };
    fetchData();
  }, [keyword, searchParams.get("page")]);

  return (
    <Suspense>
      <Dialog open={open} onOpenChange={setOpen}>
        <div>
          <article className="py-8 relative space-y-10">
            <header className="flex justify-between items-center gap-10">
              <SearchInput onSearchChange={setSearchKeyword} />
              <div className="flex gap-3 items-center flex-1 justify-end ">
                {/* <Button type="button" className="cursor-pointer" variant={"ghost"}>
                  <Trash2 />
                  <p>Delete</p>
                </Button> */}
                <div>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      className="bg-[#0070FF] hover:bg-[#005cd5] cursor-pointer"
                    >
                      <Plus />
                      <p>Add New</p>
                    </Button>
                  </DialogTrigger>
                </div>
              </div>
            </header>

            <section>
              <ActivitiesTable
                columns={ProductColumn({
                  actions: { deleteProduct: deleteProductHandler },
                })}
                data={products}
              />
            </section>

            <DialogContent>
              <DialogTitle>Tambah Produk</DialogTitle>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <div className="space-y-2">
                          <Label htmlFor="name">Nama Produk</Label>
                          <FormControl>
                            <Input
                              id="name"
                              placeholder="Jaket V Neck"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      );
                    }}
                  />

                  <FormField
                    name="required_weight"
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <div className="space-y-2">
                          <Label htmlFor="required_weight">Bahan Per PCS</Label>
                          <FormControl>
                            <Input
                              id="required_weight"
                              placeholder="0,25"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      );
                    }}
                  />

                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </DialogContent>

            <section>
              <PaginationTable />
            </section>
          </article>
        </div>
      </Dialog>
    </Suspense>
  );
}
