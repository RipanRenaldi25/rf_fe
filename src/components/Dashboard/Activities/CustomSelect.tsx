import { ShelfContext } from "@/context/ShelfContext";
import { useContext, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

export default function CustomSelect({
  setIsAddRact,
  shelfOptions = [],
  onChange,
}: {
  setIsAddRact: any;
  shelfOptions: IShelf[];
  onChange: any;
}) {
  const [selected, setSelected] = useState<IShelf | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const { shelfs } = useContext(ShelfContext);

  return (
    <div>
      <div className="relative">
        {shelfs.length > 0 ? (
          <button
            onClick={() => setOpen(!open)}
            className="relative w-full  border rounded-md p-2 text-left bg-white "
            type="button"
          >
            <span className="absolute right-2 top-1/2 -translate-y-1/2">
              <MdKeyboardArrowDown />
            </span>
            {selected ? (
              `${selected.rack}${selected.number}`
            ) : (
              <p className="text-gray-400">Pilih Rak</p>
            )}
          </button>
        ) : (
          <button
            onClick={() => setOpen(!open)}
            className="relative w-full border rounded-md p-2 text-left bg-white"
            type="button"
          >
            <span className="absolute right-2 top-1/2 -translate-y-1/2">
              <MdKeyboardArrowDown />
            </span>
            <p className="text-sm text-gray-400">
              Tambahkan rak terlebih dahulu
            </p>
          </button>
        )}

        {open && (
          <div className="absolute h-40 w-full border rounded-md bg-white shadow mt-1 z-10">
            <div className="h-2/3 overflow-y-auto ">
              {shelfs.map((option) => {
                return (
                  <div
                    key={option.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    data-state={option.id}
                    onClick={(e: any) => {
                      setSelected(option);
                      setOpen(false);
                      onChange(Number(option.id));
                    }}
                  >
                    {option.rack} {option.number}
                  </div>
                );
              })}
            </div>
            <div
              className="p-2 text-center text-blue-600 hover:bg-blue-100 cursor-pointer border-t"
              onClick={() => {
                setIsAddRact(true);
              }}
            >
              Add +
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
