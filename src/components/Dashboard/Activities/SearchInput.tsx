import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { Search } from "lucide-react";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { memo } from "react";

const SearchInput = ({ onSearchChange }: { onSearchChange: any }) => {
  const [search, setSearch] = useState<string>("");
  const keyword = useDebounce(search);

  useEffect(() => {
    onSearchChange(keyword);
  }, [keyword]);

  return (
    <div className="relative w-full">
      <Search className="absolute top-1/2 -translate-y-1/2 left-2 size-5 font-thin text-slate-400" />
      <Input
        type="text"
        className="px-10 rounded-full"
        placeholder="Cari bahan"
        value={search}
        onChange={(e: any) => {
          console.log(e.target.value);
          setSearch(e.target.value);
        }}
      />
    </div>
  );
};

export default memo(SearchInput);
