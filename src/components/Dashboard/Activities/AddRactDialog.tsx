import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InventoryContext } from "@/context/InventoryContext";
import { ShelfContext } from "@/context/ShelfContext";
import { addRact } from "@/lib/api/inventoryApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const ractSchema = z.object({
  ract: z.string().min(1, {
    message: "Ract is required",
  }),
  number: z.string().min(1),
});

export function AddRakDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: any;
}) {
  const form = useForm({
    resolver: zodResolver(ractSchema),
    defaultValues: {
      ract: "",
      number: "",
    },
  });

  const { setShelfs, shelfs } = useContext(ShelfContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddRact = async (values: z.infer<typeof ractSchema>) => {
    setIsLoading(true);
    const isExists = shelfs.some(
      (shelf) =>
        shelf.rack === values.ract.toUpperCase() &&
        +shelf.number === +values.number
    );
    if (isExists) {
      toast.error(`Rak ${values.ract}${values.number} sudah ada`, {
        autoClose: 1000,
      });
      setIsLoading(false);
      return;
    }
    const { message, success, data } = await addRact({
      rack: values.ract,
      number: +values.number,
    });
    if (success) {
      setShelfs((prevVal: IShelf[]) => [
        ...prevVal,
        {
          id: data.id,
          rack: data.rack,
          number: data.number,
        },
      ]);
      toast.success(message, { autoClose: 300 });
    }
    setIsLoading(false);
    onOpenChange(false);
  };

  return (
    <div className="relative">
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="fixed  left-1/2 -translate-x-1/2 bg-white py-6 px-10 space-y-4 border-1 z-[97] rounded-md">
          <DialogHeader className="flex justify-between  ">
            <DialogTitle>Masukkan Rak</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              method="POST"
              onSubmit={form.handleSubmit(handleAddRact)}
              className="space-y-4"
            >
              <FormField
                name="ract"
                control={form.control}
                render={({ field }) => {
                  return (
                    <div className="space-y-2">
                      <Label htmlFor="ract">Rak</Label>
                      <FormControl>
                        <Input {...field} placeholder="A" />
                      </FormControl>
                      <FormMessage />
                    </div>
                  );
                }}
              />

              <FormField
                name="number"
                control={form.control}
                render={({ field }) => {
                  return (
                    <div className="space-y-2">
                      <Label htmlFor="number">Nomor Rak</Label>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="1"
                          id="number"
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  );
                }}
              />

              <Button
                type="submit"
                className="cursor-pointer"
                disabled={isLoading}
              >
                <Plus />
                {isLoading ? "Menambah rak..." : "Tambah Rak"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
