"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  RowSelectionState,
} from "@tanstack/react-table";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, usePage } from "@inertiajs/react";
import { columns } from "./partials/columns";
import { BreadcrumbItem, Category, PageProps } from "@/types";
import { index } from "@/routes/admin/categories";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/data-table";
import { DataTablePagination } from "@/components/data-table-pagination";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Categories", href: index().url },
];

interface CategoriesPageProps extends PageProps {
  datatableUrl: string;
  statusOptions: string[];
  priorityOptions: string[];
}

const Index: React.FC = () => {
  const { datatableUrl, statusOptions, priorityOptions } =
    usePage<CategoriesPageProps>().props;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // --- Table States ---
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [totalRows, setTotalRows] = useState<number>(0);

  // --- Filters ---
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
  });

  // --- Fetch Data ---
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        sort_by: sorting[0]?.id ?? "created_at",
        sort_dir: sorting[0]?.desc ? "desc" : "asc",
        search: filters.search,
        status: filters.status,
        priority: filters.priority,
      };
      const { data } = await axios.get(datatableUrl, { params });
      setCategories(data.data);
      setTotalRows(data.pagination.total);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  }, [datatableUrl, pagination, sorting, filters]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // --- React Table Setup ---
  const table = useReactTable({
    data: categories,
    columns,
    manualPagination: true,
    pageCount: Math.ceil(totalRows / pagination.pageSize),
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { pagination, sorting, rowSelection },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
  });

  const selectedCount = useMemo(
    () => Object.keys(rowSelection).length,
    [rowSelection]
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Categories" />

      <div className="container mx-auto py-10 space-y-6">
        {/* --- Header --- */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Categories</h1>
          <Link href="/admin/categories/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Category
            </Button>
          </Link>
        </div>

        {/* --- Filters --- */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <Input
            placeholder="Search categories..."
            value={filters.search}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value }))
            }
            className="max-w-sm"
          />
          <Select
            value={filters.status || "all"}
            onValueChange={(v) =>
              setFilters((f) => ({ ...f, status: v === "all" ? "" : v }))
            }
          >
            <SelectTrigger className="w-[160px]">
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
          <Select
            value={filters.priority || "all"}
            onValueChange={(v) =>
              setFilters((f) => ({ ...f, priority: v === "all" ? "" : v }))
            }
          >
            <SelectTrigger className="w-[160px]">
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

        {/* --- Data Table --- */}
        <DataTable table={table} loading={loading} />

        {/* --- Pagination --- */}
        <DataTablePagination
          table={table}
          totalRows={totalRows}
          selectedCount={selectedCount}
        />
      </div>
    </AppLayout>
  );
};

export default Index;
