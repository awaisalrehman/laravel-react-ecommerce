'use client';

import { DataTable } from '@/components/data-table/data-table';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
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
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { columns } from './partials/columns';
import TaskFormDialog from './partials/task-form-dialog';
import { DeleteTasksDialog } from './partials/delete-tasks-dialog';
import { FiltersToolbar } from './partials/filters-toolbar';
import TaskHeader from './partials/task-header';
import TaskBulkActions from './partials/task-bulk-actions';
import ColumnVisibilityControl from './partials/column-visibility-controls';

interface TasksPageProps extends PageProps {
    datatableUrl: string;
    statusOptions: Record<string, string>;
    priorityOptions: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Tasks', href: index().url }];

const Index: React.FC = () => {
    const { datatableUrl, statusOptions, priorityOptions } =
        usePage<TasksPageProps>().props;

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
    const [showSingleDeleteDialog, setShowSingleDeleteDialog] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    // Table States
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [totalRows, setTotalRows] = useState<number>(0);

    // Filters
    const [filters, setFilters] = useState({
        search: '',
        status: '' as string | string[],
        priority: '' as string | string[],
    });

    // Reset pageIndex when filters change
    const handleFiltersChange = (newFilters: typeof filters) => {
        setFilters(newFilters);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    // Fetch Data
    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
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

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    useEffect(() => {
        table.resetRowSelection();
    }, [pagination.pageIndex, pagination.pageSize, sorting, filters]);

    const resetColumnVisibility = useCallback(() => setColumnVisibility({}), []);

    const tableColumns = useMemo(
        () =>
            columns({
                onEditClick: (task) => {
                    setEditingTask(task);
                    setShowCreateDialog(true);
                },
                onSingleDeleteClick: (task) => {
                    setTaskToDelete(task);
                    setShowSingleDeleteDialog(true);
                },
            }),
        [],
    );

    const table = useReactTable({
        data: tasks,
        columns: tableColumns,
        manualPagination: true,
        manualSorting: true,
        pageCount: Math.ceil(totalRows / pagination.pageSize),
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: { pagination, sorting, rowSelection, columnVisibility },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
    });

    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedTasks = useMemo(
        () => selectedRows.map((row) => row.original),
        [selectedRows],
    );
    const selectedCount = selectedTasks.length;

    // Single Task Delete
    const handleSingleDelete = async () => {
        if (!taskToDelete) return;
        setLoading(true);
        try {
            const { destroy: getDestroyRoute } = await import(
                '@/routes/admin/tasks'
            );
            const deleteUrl = getDestroyRoute(taskToDelete.id).url;
            await axios.delete(deleteUrl);
            toast.success('Task deleted successfully');
            await fetchTasks();
            setShowSingleDeleteDialog(false);
            setTaskToDelete(null);
        } catch (error) {
            console.error('Failed to delete task:', error);
            toast.error('Failed to delete task');
        } finally {
            setLoading(false);
        }
    };

    // Bulk Delete
    const handleBulkDelete = async () => {
        setLoading(true);
        try {
            const taskIds = selectedTasks.map((task) => task.id);
            await axios.post('/admin/tasks/bulk-delete', { ids: taskIds });
            toast.success(`Deleted ${selectedTasks.length} tasks successfully`);
            table.resetRowSelection();
            await fetchTasks();
            setShowBulkDeleteDialog(false);
        } catch (error) {
            console.error('Failed to delete tasks:', error);
            toast.error('Failed to delete tasks');
        } finally {
            setLoading(false);
        }
    };

    // Export
    const handleBulkExport = async () => {
        try {
            const taskIds = selectedTasks.map((task) => task.id);
            const response = await axios.post(
                '/admin/tasks/export',
                { ids: taskIds },
                { responseType: 'blob' },
            );

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

    const hasHiddenColumns = useMemo(
        () =>
            table
                .getAllColumns()
                .some(
                    (column) =>
                        typeof column.accessorFn !== 'undefined' &&
                        column.getCanHide() &&
                        !column.getIsVisible(),
                ),
        [table],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />

            <div className="container mx-auto space-y-6 px-4 py-10 sm:px-0">
                {/* Header */}
                <TaskHeader onCreateClick={() => setShowCreateDialog(true)} />

                {/* Filters Toolbar */}
                <FiltersToolbar
                    filters={filters}
                    setFilters={handleFiltersChange}
                    table={table}
                    statusOptions={statusOptions}
                    priorityOptions={priorityOptions}
                />

                {/* Bulk Actions + Column Controls */}
                <div className="flex items-center justify-between">
                    <TaskBulkActions
                        selectedCount={selectedCount}
                        selectedTasks={selectedTasks}
                        onExport={handleBulkExport}
                        onBulkDeleteTrigger={() => setShowBulkDeleteDialog(true)}
                        hasHiddenColumns={hasHiddenColumns}
                        onResetColumns={resetColumnVisibility}
                    />

                    <div className="flex items-center gap-2">
                        <ColumnVisibilityControl
                            table={table}
                            resetColumnVisibility={resetColumnVisibility}
                            hasHiddenColumns={hasHiddenColumns}
                        />
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
            <TaskFormDialog
                open={showCreateDialog}
                onOpenChange={(open) => {
                    setShowCreateDialog(open);
                    if (!open) setEditingTask(null);
                }}
                onSuccess={async () => {
                    await fetchTasks();
                    setShowCreateDialog(false);
                }}
                task={editingTask}
            />

            {/* Bulk Delete */}
            <DeleteTasksDialog
                tasks={selectedTasks}
                open={showBulkDeleteDialog}
                onOpenChange={setShowBulkDeleteDialog}
                onSuccess={handleBulkDelete}
                loading={loading}
                showTrigger={false}
            />

            {/* Single Delete */}
            <DeleteTasksDialog
                tasks={taskToDelete ? [taskToDelete] : []}
                open={showSingleDeleteDialog}
                onOpenChange={setShowSingleDeleteDialog}
                onSuccess={handleSingleDelete}
                loading={loading}
                showTrigger={false}
            />
        </AppLayout>
    );
};

export default Index;
