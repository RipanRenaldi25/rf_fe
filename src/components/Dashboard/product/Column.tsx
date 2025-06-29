"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical, Trash } from "lucide-react";

export const ProductColumn = ({
  actions = {},
}: {
  actions?: { [functionName: string]: any };
}): ColumnDef<IProduct>[] => {
  return [
    {
      header: "No",
      cell: ({ row }) => {
        return <span>{row.index + 1}</span>;
      },
    },
    {
      header: "Produk",
      accessorKey: "name",
    },
    {
      header: "Bahan per pcs",
      accessorKey: "weight_required",
    },
    {
      header: "Action",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="cursor-pointer h-8 w-8 p-0">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="shadow-md cursor-pointer rounded-md"
            >
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Button
                    type="button"
                    variant={"destructive"}
                    className="cursor-pointer bg-[#BF3131]"
                    onClick={() => {
                      actions.deleteProduct(row.original);
                    }}
                  >
                    <Trash className="text-white" />
                    Hapus Produk
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
