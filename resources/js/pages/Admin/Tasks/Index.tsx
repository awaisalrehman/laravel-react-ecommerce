'use client';

import { DataTable } from '@/components/data-table';
import { DataTablePagination } from '@/components/data-table-pagination';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/admin/tasks';
import { BreadcrumbItem, PageProps, Task } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
    getCoreRowModel,
    getSortedRowModel,
    PaginationState,
    RowSelectionState,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import axios from 'axios';
import { Columns, Download, Plus, RotateCcw, Trash2 } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { columns } from './partials/columns';
import CreateTaskDialog from './partials/create-task-dialog';
import { DeleteTasksDialog } from './partials/delete-tasks-dialog';
import { FiltersToolbar } from './partials/filters-toolbar';

interface TasksPageProps extends PageProps {
    datatableUrl: string;
    statusOptions: string[];
    priorityOptions: string[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Tasks', href: index().url }];

const Index: React.FC = () => {
    const { datatableUrl, statusOptions, priorityOptions } =
        usePage<TasksPageProps>().props;

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

    // Table States
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );
    const [totalRows, setTotalRows] = useState<number>(0);

    // Filters
    const [filters, setFilters] = useState({
        search: '',
        status: '' as string | string[],
        priority: '' as string | string[],
    });

    // Fetch Data
    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            // Convert array filters to comma-separated strings for API
            const apiFilters = {
                search: filters.search,
                status: Array.isArray(filters.status)
                    ? filters.status.join(',')
                    : filters.status,
                priority: Array.isArray(filters.priority)
                    ? filters.priority.join(',')
                    : filters.priority,
            };

            const params = {
                page: pagination.pageIndex + 1,
                per_page: pagination.pageSize,
                sort_by: sorting[0]?.id ?? 'created_at',
                sort_dir: sorting[0]?.desc ? 'desc' : 'asc',
                ...apiFilters,
            };

            const { data } = await axios.get(datatableUrl, { params });
            setTasks(data.data);
            setTotalRows(data.pagination.total);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    }, [datatableUrl, pagination, sorting, filters]);

    // Initial fetch and when dependencies change
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Reset column visibility to show all columns
    const resetColumnVisibility = useCallback(() => {
        setColumnVisibility({});
    }, []);

    // React Table
    const table = useReactTable({
        data: tasks,
        columns,
        manualPagination: true,
        pageCount: Math.ceil(totalRows / pagination.pageSize),
        manualSorting: true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            pagination,
            sorting,
            rowSelection,
            columnVisibility,
        },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
    });

    // Bulk Actions
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedCount = selectedRows.length;
    const selectedTasks = useMemo(
        () => selectedRows.map((row) => row.original),
        [selectedRows],
    );

    const handleBulkDelete = async () => {
        try {
            const taskIds = selectedTasks.map((task) => task.id);
            await axios.post('/admin/tasks/bulk-delete', { ids: taskIds });
            toast.success(`Deleted ${selectedTasks.length} tasks successfully`);
            table.resetRowSelection();
            fetchTasks();
            setShowBulkDeleteDialog(false);
        } catch (error) {
            console.error('Failed to delete tasks:', error);
            toast.error('Failed to delete tasks');
        }
    };

    const handleBulkExport = async () => {
        try {
            const taskIds = selectedTasks.map((task) => task.id);
            const response = await axios.post(
                '/admin/tasks/export',
                { ids: taskIds },
                { responseType: 'blob' },
            );

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute(
                'download',
                `tasks-export-${new Date().toISOString().split('T')[0]}.csv`,
            );
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success(
                `Exported ${selectedTasks.length} tasks successfully`,
            );
        } catch (error) {
            console.error('Failed to export tasks:', error);
            toast.error('Failed to export tasks');
        }
    };

    // Check if any columns are hidden
    const hasHiddenColumns = useMemo(() => {
        return table
            .getAllColumns()
            .some(
                (column) =>
                    typeof column.accessorFn !== 'undefined' &&
                    column.getCanHide() &&
                    !column.getIsVisible(),
            );
    }, [table]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />

            <div className="container mx-auto space-y-6 px-4 py-10 sm:px-0">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Tasks</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage and track your team's tasks
                        </p>
                    </div>
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
                    statusOptions={statusOptions}
                    priorityOptions={priorityOptions}
                />

                {/* Bulk Actions & Column Toggling */}
                <div className="flex items-center justify-between">
                    {/* Bulk Actions - LEFT SIDE */}
                    <div className="flex items-center gap-2">
                        {selectedCount > 0 && (
                            <>
                                <span className="text-sm text-gray-600">
                                    {selectedCount} selected
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleBulkExport}
                                >
                                    <Download className="mr-1 h-4 w-4" />
                                    Export
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                        setShowBulkDeleteDialog(true)
                                    }
                                >
                                    <Trash2 className="mr-1 h-4 w-4" />
                                    Delete
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Column Visibility - RIGHT SIDE */}
                    <div className="flex items-center gap-2">
                        {/* Reset Visibility Button */}
                        {hasHiddenColumns && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={resetColumnVisibility}
                                title="Reset to show all columns"
                            >
                                <RotateCcw className="mr-1 h-4 w-4" />
                                Reset Columns
                            </Button>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Columns className="mr-1 h-4 w-4" />
                                    Columns
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel className="flex items-center justify-between">
                                    <span>Toggle Columns</span>
                                    {hasHiddenColumns && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                resetColumnVisibility();
                                            }}
                                            className="h-6 px-2 text-xs"
                                        >
                                            <RotateCcw className="mr-1 h-3 w-3" />
                                            Reset
                                        </Button>
                                    )}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {table
                                    .getAllColumns()
                                    .filter(
                                        (column) =>
                                            typeof column.accessorFn !==
                                                'undefined' &&
                                            column.getCanHide(),
                                    )
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) => {
                                                    column.toggleVisibility(
                                                        !!value,
                                                    );
                                                    // Don't close the dropdown
                                                }}
                                                className="capitalize"
                                                onSelect={(e) =>
                                                    e.preventDefault()
                                                } // This prevents dropdown from closing
                                            >
                                                {column.id.replace('_', ' ')}
                                            </DropdownMenuCheckboxItem>
                                        );
                                    })}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={resetColumnVisibility}
                                    className="cursor-pointer"
                                    onSelect={(e) => e.preventDefault()} // This prevents dropdown from closing
                                >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Reset to default
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Data Table */}
                <div className="px-0 sm:px-0">
                    <DataTable table={table} loading={loading} />
                    <DataTablePagination
                        table={table}
                        totalRows={totalRows}
                        selectedCount={selectedCount}
                    />
                </div>
            </div>

            {/* Dialogs */}
            <CreateTaskDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
                onCreated={async () => {
                    await fetchTasks();
                    setShowCreateDialog(false);
                }}
            />

            {/* Bulk Delete Confirmation Dialog */}
            <DeleteTasksDialog
                tasks={selectedTasks}
                open={showBulkDeleteDialog}
                onOpenChange={setShowBulkDeleteDialog}
                onSuccess={handleBulkDelete}
                showTrigger={false}
            />
        </AppLayout>
    );
};

export default Index;
