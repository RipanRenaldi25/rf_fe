import { useEffect } from "react";
import { useState } from "react";

export const useDebounce = (value: string, delay: number = 300) => {
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setKeyword(value);
    }, 400);
  }, [value, delay]);

  return keyword;
};
