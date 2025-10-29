'use client';

import { DataTable } from '@/components/data-table/data-table';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import AppLayout from '@/layouts/app-layout';
import { create, index } from '@/routes/admin/categories';
import { BreadcrumbItem, Category, PageProps } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
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
import CategoryBulkActions from './partials/category-bulk-actions';
import CategoryHeader from './partials/category-header';
import ColumnVisibilityControl from './partials/column-visibility-controls';
import { columns } from './partials/columns';
import { DeleteCategoriesDialog } from './partials/delete-categories-dialog';
import { FiltersToolbar } from './partials/filters-toolbar';

interface CategoriesPageProps extends PageProps {
    datatableUrl: string;
    statusOptions: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Categories', href: index().url },
];

const Index: React.FC = () => {
    const { datatableUrl, statusOptions } = usePage<CategoriesPageProps>().props;

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
    const [showSingleDeleteDialog, setShowSingleDeleteDialog] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
        null,
    );

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

    const [filters, setFilters] = useState({
        search: '',
        status: '' as string | string[],
    });

    // Fetch Data
    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const apiFilters = {
                search: filters.search,
                status: Array.isArray(filters.status)
                    ? filters.status.join(',')
                    : filters.status,
            };

            const params = {
                page: pagination.pageIndex + 1,
                per_page: pagination.pageSize,
                sort_by: sorting[0]?.id ?? 'created_at',
                sort_dir: sorting[0]?.desc ? 'desc' : 'asc',
                ...apiFilters,
            };

            const { data } = await axios.get(datatableUrl, { params });
            setCategories(data.data);
            setTotalRows(data.pagination.total);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    }, [datatableUrl, pagination, sorting, filters]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        table.resetRowSelection();
    }, [pagination.pageIndex, pagination.pageSize, sorting, filters]);

    const resetColumnVisibility = useCallback(
        () => setColumnVisibility({}),
        [],
    );

    const tableColumns = useMemo(
        () =>
            columns({
                onEditClick: (category) => {
                    router.visit(`/admin/categories/${category.id}/edit`);
                },
                onSingleDeleteClick: (category) => {
                    setCategoryToDelete(category);
                    setShowSingleDeleteDialog(true);
                },
            }),
        [],
    );

    const table = useReactTable({
        data: categories,
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
    const selectedCategories = useMemo(
        () => selectedRows.map((row) => row.original),
        [selectedRows],
    );
    const selectedCount = selectedCategories.length;

    // Single Delete
    const handleSingleDelete = async () => {
        if (!categoryToDelete) return;
        setLoading(true);
        try {
            const { destroy: getDestroyRoute } = await import(
                '@/routes/admin/categories'
            );
            const deleteUrl = getDestroyRoute(categoryToDelete.id).url;
            await axios.delete(deleteUrl);
            toast.success('Category deleted successfully');
            await fetchCategories();
            setShowSingleDeleteDialog(false);
            setCategoryToDelete(null);
        } catch (error) {
            console.error('Failed to delete category:', error);
            toast.error('Failed to delete category');
        } finally {
            setLoading(false);
        }
    };

    // Bulk Delete
    const handleBulkDelete = async () => {
        setLoading(true);
        try {
            const ids = selectedCategories.map((c) => c.id);
            await axios.post('/admin/categories/bulk-delete', { ids });
            toast.success(
                `Deleted ${selectedCategories.length} categories successfully`,
            );
            table.resetRowSelection();
            await fetchCategories();
            setShowBulkDeleteDialog(false);
        } catch (error) {
            console.error('Failed to delete categories:', error);
            toast.error('Failed to delete categories');
        } finally {
            setLoading(false);
        }
    };

    // Export
    const handleBulkExport = async () => {
        try {
            const ids = selectedCategories.map((c) => c.id);
            const response = await axios.post(
                '/admin/categories/export',
                { ids },
                { responseType: 'blob' },
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute(
                'download',
                `categories-export-${new Date().toISOString().split('T')[0]}.csv`,
            );
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success(
                `Exported ${selectedCategories.length} categories successfully`,
            );
        } catch (error) {
            console.error('Failed to export categories:', error);
            toast.error('Failed to export categories');
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
            <Head title="Categories" />

            <div className="container mx-auto space-y-6 px-4 py-10 sm:px-0">
                {/* Header */}
                <CategoryHeader
                    onCreateClick={() => router.visit(create().url)}
                />

                {/* Filters Toolbar */}
                <FiltersToolbar
                    filters={filters}
                    setFilters={setFilters}
                    table={table}
                    statusOptions={statusOptions}
                />

                {/* Bulk Actions + Column Controls */}
                <div className="flex items-center justify-between">
                    <CategoryBulkActions
                        selectedCount={selectedCount}
                        selectedCategories={selectedCategories}
                        onExport={handleBulkExport}
                        onBulkDeleteTrigger={() =>
                            setShowBulkDeleteDialog(true)
                        }
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

            {/* Delete Dialogs */}
            <DeleteCategoriesDialog
                categories={selectedCategories}
                open={showBulkDeleteDialog}
                onOpenChange={setShowBulkDeleteDialog}
                onSuccess={handleBulkDelete}
                loading={loading}
                showTrigger={false}
            />

            <DeleteCategoriesDialog
                categories={categoryToDelete ? [categoryToDelete] : []}
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
