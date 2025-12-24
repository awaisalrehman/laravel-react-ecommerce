import React from 'react';
import {
    FacetedFilterOption,
    FacetedFilter,
} from '@/components/data-table/faceted-filter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Category } from '@/types';
import { Table } from '@tanstack/react-table';
import { Search, X, CirclePlus, CheckCircle, XCircle } from 'lucide-react';

// ----------------------------
// Props Interface
// ----------------------------
interface FiltersToolbarProps {
    filters: {
        search: string;
        status?: string | string[];
    };
    setFilters: (filters: any) => void;
    table: Table<Category>;
    statusOptions?: Record<string, string>;
}

// ----------------------------
// Icon mappings
// ----------------------------
const statusIcons = {
    in_active: XCircle,
    active: CheckCircle,
};

// ----------------------------
// Component
// ----------------------------
export const FiltersToolbar: React.FC<FiltersToolbarProps> = ({
    filters,
    setFilters,
    statusOptions,
}) => {
    // --- Handlers ---
    const handleSearch = (value: string) =>
        setFilters((prev: any) => ({ ...prev, search: value }));

    const handleStatusChange = (values: string[]) =>
        setFilters((prev: any) => ({
            ...prev,
            status: values.length > 0 ? values : '',
        }));

    const clearAllFilters = () => setFilters({ search: '', status: '' });

    const hasActiveFilters = filters.search || filters.status;

    // --- Transform backend options into FacetedFilterOptions ---
    const statusFilterOptions: FacetedFilterOption[] = Object.entries(statusOptions).map(
        ([key, label]) => ({
            value: key,
            label,
            icon: statusIcons[key as keyof typeof statusIcons],
        }),
    );

    // --- Normalize selected values ---
    const selectedStatusValues = Array.isArray(filters.status)
        ? filters.status
        : filters.status
          ? [filters.status]
          : [];

    // --- Render ---
    return (
        <div className="flex flex-col items-start justify-between gap-4 rounded-lg border bg-gray-50 p-4 sm:flex-row sm:items-center">
            <div className="flex w-full flex-1 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                {/* Search Filter */}
                <div className="relative w-full sm:w-64">
                    <Input
                        placeholder="Filter categories..."
                        value={filters.search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-9"
                    />
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
                </div>

                {/* Status Filter */}
                <FacetedFilter
                    title="Status"
                    options={statusFilterOptions}
                    selectedValues={selectedStatusValues}
                    onSelectedChange={handleStatusChange}
                    triggerIcon={CirclePlus}
                    placeholder="Filter status..."
                />

                {/* Clear All */}
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        onClick={clearAllFilters}
                        className="whitespace-nowrap"
                    >
                        <X className="mr-1 h-4 w-4" />
                        Clear All
                    </Button>
                )}
            </div>
        </div>
    );
};
