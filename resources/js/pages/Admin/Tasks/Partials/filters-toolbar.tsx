"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  SearchIcon,
  DownloadIcon,
  Columns3Icon,
  FileTextIcon,
  FileSpreadsheetIcon,
  RefreshCcwIcon,
  ChevronDownIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { Task } from "@/types";

interface FiltersToolbarProps {
  filters: {
    search: string;
    status: string;
    priority: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      search: string;
      status: string;
      priority: string;
    }>
  >;
  table: Table<Task>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  statusOptions: string[];
  priorityOptions: string[];
}

const FiltersToolbar: React.FC<FiltersToolbarProps> = ({
  filters,
  setFilters,
  table,
  searchQuery,
  setSearchQuery,
  statusOptions,
  priorityOptions,
}) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4 mb-4 sm:flex-nowrap">
      {/* Left side — Filters */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 w-full sm:w-auto px-0 sm:px-0">
        {/* Search */}
        <div className="relative basis-full sm:basis-auto sm:w-[240px]">
          <Input
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value }))
            }
            className="peer pl-9 w-full"
          />
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
            <SearchIcon size={16} />
          </div>
        </div>

        {/* Status */}
        <div className="basis-full sm:basis-auto sm:w-[160px]">
          <Select
            value={filters.status || "all"}
            onValueChange={(v) =>
              setFilters((f) => ({ ...f, status: v === "all" ? "" : v }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Priority */}
        <div className="basis-full sm:basis-auto sm:w-[160px]">
          <Select
            value={filters.priority || "all"}
            onValueChange={(v) =>
              setFilters((f) => ({ ...f, priority: v === "all" ? "" : v }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {priorityOptions.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Right side — Actions */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 w-full sm:w-auto px-0 sm:px-0">
        {/* Export */}
        <div className="flex flex-wrap items-center justify-between w-full sm:w-auto space-x-2">
          {table.getSelectedRowModel().rows.length > 0 && (
            <div className="text-muted-foreground text-sm">
              {table.getSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <DownloadIcon className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => alert("Exporting as CSV...")}>
                <FileTextIcon className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert("Exporting as Excel...")}>
                <FileSpreadsheetIcon className="mr-2 h-4 w-4" />
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => alert("Exporting as JSON...")}>
                <FileTextIcon className="mr-2 h-4 w-4" />
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Columns */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto justify-between"
            >
              <span className="flex items-center gap-2">
                <Columns3Icon />
                Columns
              </span>
              <ChevronDownIcon className="ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="relative">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
                placeholder="Search"
                onKeyDown={(e) => e.stopPropagation()}
              />
              <SearchIcon className="absolute inset-y-0 left-2 my-auto h-4 w-4" />
            </div>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                if (
                  searchQuery &&
                  !column.id.toLowerCase().includes(searchQuery.toLowerCase())
                ) {
                  return null;
                }
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                    onSelect={(e) => e.preventDefault()}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                table.resetColumnVisibility();
                setSearchQuery("");
              }}
            >
              <RefreshCcwIcon /> Reset
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default FiltersToolbar;
