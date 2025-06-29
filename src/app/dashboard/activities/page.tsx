"use client";
export const dynamic = "force-dynamic";

import { ActivitiesTable } from "@/components/Dashboard/Activities/ActivitiesTable";
import { ActivitiesColumn } from "@/components/Dashboard/Activities/Column";
import SearchInput from "@/components/Dashboard/Activities/SearchInput";
import { Button } from "@/components/ui/button";
import { InventoryContext } from "@/context/InventoryContext";
import { ModalContext } from "@/context/Modal";
import { ShelfContext } from "@/context/ShelfContext";
import { WeekSummaryContext } from "@/context/WeekSummaryContext";
import { getAllInventories, releaseMaterial } from "@/lib/api/inventoryApi";
import Decimal from "decimal.js";
import { Plus } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

export default function ActivitiesPage() {
  const { inventoryData, setInventoryData } = useContext(InventoryContext);
  const { showModal, setShowModal } = useContext(ModalContext);

  const { setShelfs, shelfs } = useContext(ShelfContext);

  // AMAN
  const [searchKeyword, setSearchKeyword] = useState("");
  const filteredData = useMemo(() => {
    return inventoryData.filter(
      (val) =>
        val.material.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        val.material.detail
          .toLowerCase()
          .includes(searchKeyword.toLowerCase()) ||
        val.material.detail
          .toLowerCase()
          .includes(searchKeyword.toLowerCase()) ||
        val.material.type.toLowerCase().includes(searchKeyword.toLowerCase())
    ) as any;
  }, [searchKeyword, inventoryData]);

  const { setSummary, summary } = useContext(WeekSummaryContext);

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

    setInventoryData((prevValue: ITransactionWithMaterial[]) => [
      ...prevValue.map((val) => ({
        ...val,
        stock: val.id === row.id ? 0 : val.stock,
      })),
      mappedInventoryData,
    ]);

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

    toast.success(message, {
      autoClose: 1000,
    });
  };

  return (
    <article className="py-8 relative space-y-10">
      <header className="flex justify-between items-center gap-10">
        <SearchInput onSearchChange={setSearchKeyword} />
        <div className="flex gap-3 items-center flex-1 justify-end ">
          <div>
            <Button
              type="button"
              className="bg-[#0070FF] hover:bg-[#005cd5] cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              <Plus />
              <p>Add New</p>
            </Button>
          </div>
        </div>
      </header>

      <section>
        <ActivitiesTable
          columns={ActivitiesColumn({
            actions: { output: releaseMaterialHandler },
          })}
          data={filteredData.length > 0 ? filteredData : inventoryData}
        />
      </section>
    </article>
  );
}
