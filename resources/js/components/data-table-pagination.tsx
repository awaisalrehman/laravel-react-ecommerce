"use client";

import type { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DataTablePaginationProps<TData> extends React.ComponentProps<"div"> {
  table: Table<TData>;
  totalRows: number;
  selectedCount?: number;
  pageSizeOptions?: number[];
}

export function DataTablePagination<TData>({
  table,
  totalRows,
  selectedCount = 0,
  pageSizeOptions = [5, 10, 20, 50, 100],
  className,
  ...props
}: DataTablePaginationProps<TData>) {
  const {
    pagination: { pageIndex, pageSize },
  } = table.getState();

  const totalPages = table.getPageCount();

  return (
    <div
      className={cn(
        "flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto border-t border-muted p-3 sm:flex-row sm:gap-8",
        className
      )}
      {...props}
    >
      {/* --- Left: selection info --- */}
      <div className="flex-1 whitespace-nowrap text-muted-foreground text-sm">
        {selectedCount} of {totalRows} row(s) selected
      </div>

      {/* --- Right: pagination controls --- */}
      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        {/* Rows per page */}
        <div className="flex items-center space-x-2">
          <p className="whitespace-nowrap font-medium text-sm">
            Rows per page
          </p>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[4.5rem]">
              <SelectValue placeholder={String(pageSize)} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page info */}
        <div className="flex items-center justify-center font-medium text-sm">
          Page {pageIndex + 1} of {totalPages}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center space-x-1">
          <Button
            aria-label="Go to first page"
            variant="outline"
            size="icon"
            className="size-8 hidden lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            aria-label="Go to previous page"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            aria-label="Go to next page"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            aria-label="Go to last page"
            variant="outline"
            size="icon"
            className="size-8 hidden lg:flex"
            onClick={() => table.setPageIndex(totalPages - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}