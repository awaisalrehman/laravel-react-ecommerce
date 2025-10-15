"use client";

import {
  flexRender,
  Table as TableType,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface DataTableProps<TData> {
  table: TableType<TData>;
  loading?: boolean;
}

export function DataTable<TData>({ table, loading = false }: DataTableProps<TData>) {
  const columns = table.getAllColumns();

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSortable = header.column.getCanSort();
                  const sortDir = header.column.getIsSorted();
                  return (
                    <TableHead
                      key={header.id}
                      className={isSortable ? "cursor-pointer select-none" : ""}
                      onClick={
                        isSortable ? header.column.getToggleSortingHandler() : undefined
                      }
                    >
                      <div className="flex items-center">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {sortDir === "asc" && <span className="ml-1">↑</span>}
                        {sortDir === "desc" && <span className="ml-1">↓</span>}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="animate-spin h-5 w-5" />
                    Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
