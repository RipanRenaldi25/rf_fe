"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getDate, getHour, makeCapitalizeText } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { MoreVertical, Trash } from "lucide-react";

export const ActivitiesColumn = ({
  actions = {},
}: {
  actions?: { [functionName: string]: any };
}): ColumnDef<ITransactionWithMaterial>[] => {
  return [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && "indeterminate")
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    // },
    {
      header: "No",
      cell: ({ row }) => {
        return <span>{row.index + 1}</span>;
      },
    },
    {
      header: "Bahan",
      accessorKey: "material.name",
    },
    {
      header: "Detail Bahan",
      accessorKey: "material.detail",
    },
    {
      header: "Warna",
      accessorKey: "material.color",
    },

    {
      header: "Rak",
      cell: ({ row }) => {
        return (
          <span>
            {row?.original?.shelf?.rack ?? 0}
            {row?.original?.shelf?.number ?? 0}
          </span>
        );
      },
    },
    {
      header: "Berat",
      cell: ({ row }) => <span>{row.original.stock} kg</span>,
    },
    {
      header: "Tanggal",
      cell: ({ row }) => {
        return <span>{getDate(new Date(row.original.created_at))}</span>;
      },
    },
    {
      header: "Waktu",
      cell: ({ row }) => {
        return <span>{getHour(new Date(row.original.created_at))}</span>;
      },
    },
    {
      header: "Kategory",
      accessorKey: "material.type",
      cell: ({ row }) => {
        return (
          <div
            className={clsx(
              "flex items-center gap-2 rounded-full py-1 px-2 w-min text-sm",
              {
                "bg-[#DD00FF]/10":
                  row.original.material.type === "REUTILIZATION",
                "bg-[#1488BA]/10": row.original.material.type === "REUSE",
                "bg-[#667085]/10": row.original.material.type === "WASTE",
              }
            )}
          >
            <span
              className={clsx("size-2 rounded-full", {
                "bg-[#DD00FF]": row.original.material.type === "REUTILIZATION",
                "bg-[#1488BA]": row.original.material.type === "REUSE",
                "bg-[#667085]": row.original.material.type === "WASTE",
              })}
            ></span>
            <p>{makeCapitalizeText(row.original.material.type)}</p>
          </div>
        );
      },
    },
    {
      header: "Keterangan",
      cell: ({ row }) => {
        return (
          <div
            className={clsx("flex items-center gap-2 px-2 py-1 rounded-full", {
              "bg-[#14BA6D]/10": row.original.movement === "IN",
              "bg-[#BF3131]/10": row.original.movement === "OUT",
            })}
          >
            <span
              className={clsx("size-2 rounded-full", {
                "bg-[#14BA6D]": row.original.movement === "IN",
                "bg-[#BF3131]": row.original.movement === "OUT",
              })}
            ></span>
            <p>{row.original.movement === "IN" ? "Input" : "Output"}</p>
          </div>
        );
      },
    },
    {
      header: "Action",
      cell: ({ row }) => {
        if (row.original.movement !== "IN" || row.original.stock === 0) {
          return;
        }
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="cursor-pointer h-8 w-8 p-0">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="cursor-pointer rounded-md"
            >
              <DropdownMenuGroup className="py-4">
                <DropdownMenuItem>
                  <Button
                    type="button"
                    variant={"destructive"}
                    className="cursor-pointer bg-[#BF3131]"
                    onClick={() => {
                      actions.output(row.original);
                    }}
                  >
                    <Trash className="text-white" />
                    Keluarkan dari gudang
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

export const columns: ColumnDef<ITransactionWithMaterial>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    header: "No",
    cell: ({ row }) => {
      return <span>{row.index + 1}</span>;
    },
  },
  {
    header: "Bahan",
    accessorKey: "material.name",
  },
  {
    header: "Detail Bahan",
    accessorKey: "material.detail",
  },
  {
    header: "Warna",
    accessorKey: "material.color",
  },

  {
    header: "Rak",
    cell: ({ row }) => {
      return (
        <span>
          {row.original.shelf.rack}
          {row.original.shelf.number}
        </span>
      );
    },
  },
  {
    header: "Berat",
    cell: ({ row }) => <span>{row.original.stock} kg</span>,
  },
  {
    header: "Tanggal",
    cell: ({ row }) => {
      return <span>{getDate(new Date(row.original.created_at))}</span>;
    },
  },
  {
    header: "Waktu",
    cell: ({ row }) => {
      return <span>{getHour(new Date(row.original.created_at))}</span>;
    },
  },
  {
    header: "Kategory",
    accessorKey: "material.type",
    cell: ({ row }) => {
      return (
        <div
          className={clsx(
            "flex items-center gap-2 rounded-full py-1 px-2 w-min text-sm",
            {
              "bg-[#DD00FF]/10": row.original.material.type === "REUTILIZATION",
              "bg-[#1488BA]/10": row.original.material.type === "REUSE",
              "bg-[#667085]/10": row.original.material.type === "WASTE",
            }
          )}
        >
          <span
            className={clsx("size-2 rounded-full", {
              "bg-[#DD00FF]": row.original.material.type === "REUTILIZATION",
              "bg-[#1488BA]": row.original.material.type === "REUSE",
              "bg-[#667085]": row.original.material.type === "WASTE",
            })}
          ></span>
          <p>{makeCapitalizeText(row.original.material.type)}</p>
        </div>
      );
    },
  },
  {
    header: "Keterangan",
    cell: ({ row }) => {
      return (
        <div
          className={clsx("flex items-center gap-2 px-2 py-1 rounded-full", {
            "bg-[#14BA6D]/10": row.original.movement === "IN",
            "bg-[#BF3131]/10": row.original.movement === "OUT",
          })}
        >
          <span
            className={clsx("size-2 rounded-full", {
              "bg-[#14BA6D]": row.original.movement === "IN",
              "bg-[#BF3131]": row.original.movement === "OUT",
            })}
          ></span>
          <p>{row.original.movement === "IN" ? "Input" : "Output"}</p>
        </div>
      );
    },
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
            className="bg-white shadow-md cursor-pointer rounded-md"
          >
            <DropdownMenuGroup className="py-4">
              <DropdownMenuItem>
                <Button
                  type="button"
                  variant={"destructive"}
                  className="cursor-pointer"
                >
                  <Trash />
                  Keluarkan dari gudang
                </Button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
