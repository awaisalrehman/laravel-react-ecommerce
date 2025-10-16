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
import { Head, usePage } from "@inertiajs/react";
import { columns } from "./partials/columns";
import { BreadcrumbItem, Task, PageProps } from "@/types";
import { index } from "@/routes/admin/tasks";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateTaskDialog from "./partials/CreateTaskDialog";
import { DataTable } from "@/components/data-table";
import { DataTablePagination } from "@/components/data-table-pagination";
import FiltersToolbar from "./partials/filters-toolbar";

interface TasksPageProps extends PageProps {
    datatableUrl: string;
    statusOptions: string[];
    priorityOptions: string[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: "Tasks", href: index().url }];

const Index: React.FC = () => {
    const { datatableUrl, statusOptions, priorityOptions } =
        usePage<TasksPageProps>().props;

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    // --- Table States ---
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [searchQuery, setSearchQuery] = useState<string>('');
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
    const fetchTasks = useCallback(async () => {
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
            setTasks(data.data);
            setTotalRows(data.pagination.total);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        } finally {
            setLoading(false);
        }
    }, [datatableUrl, pagination, sorting, filters]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // --- React Table (moved here) ---
    const table = useReactTable({
        data: tasks,
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
            <Head title="Tasks" />

            <div className="container mx-auto py-10 space-y-6 px-4 sm:px-0">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Tasks</h1>
                    <Button onClick={() => setShowCreateDialog(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Task
                    </Button>
                </div>

                {/* Filters Toolbar */}
                <FiltersToolbar
                    filters={filters}
                    setFilters={setFilters}
                    table={table}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    statusOptions={statusOptions}
                    priorityOptions={priorityOptions}
                />

                {/* ✅ Data Table */}
                <div className="px-0 sm:px-0">
                    <DataTable table={table} loading={loading} />
                    <DataTablePagination
                        table={table}
                        totalRows={totalRows}
                        selectedCount={selectedCount}
                    />
                </div>
            </div>

            <CreateTaskDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
                onCreated={() => fetchTasks()}
            />
        </AppLayout>
    );
};

export default Index;
