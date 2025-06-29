"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

export const PaginationTable = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = parseInt(searchParams.get("page") ?? "1", 10);

  const onClickHandler = (operation: "+" | "-") => {
    let nextPage = operation === "+" ? currentPage + 1 : currentPage - 1;

    if (nextPage < 1) nextPage = 1;

    const urlParams = new URLSearchParams(searchParams.toString());
    urlParams.set("page", nextPage.toString());

    router.push(`?${urlParams.toString()}`);
  };

  return (
    <Suspense>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => onClickHandler("-")} />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink href="#" isActive>
              {currentPage}
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>

          <PaginationItem>
            <PaginationNext onClick={() => onClickHandler("+")} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </Suspense>
  );
};
