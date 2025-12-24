import React from 'react';
import {
    FacetedFilterOption,
    FacetedFilter,
} from '@/components/data-table/faceted-filter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Task } from '@/types';
import { Table } from '@tanstack/react-table';
import {
    AlertCircle,
    ArrowDown,
    ArrowRight,
    ArrowUp,
    CheckCircle2,
    CirclePlus,
    Clock,
    Search,
    X,
} from 'lucide-react';

// ----------------------------
// Props Interface
// ----------------------------
interface FiltersToolbarProps {
    filters: {
        search: string;
        status: string | string[];
        priority: string | string[];
    };
    setFilters: (filters: any) => void;
    table: Table<Task>;
    statusOptions: Record<string, string>;
    priorityOptions: Record<string, string>;
}

// ----------------------------
// Icon mappings
// ----------------------------
const statusIcons = {
    pending: Clock,
    in_progress: AlertCircle,
    completed: CheckCircle2,
};

const priorityIcons = {
    low: ArrowDown,
    medium: ArrowRight,
    high: ArrowUp,
};

// ----------------------------
// Component
// ----------------------------
export const FiltersToolbar: React.FC<FiltersToolbarProps> = ({
    filters,
    setFilters,
    statusOptions,
    priorityOptions,
}) => {
    // --- Handlers ---
    const handleSearch = (value: string) =>
        setFilters((prev: any) => ({ ...prev, search: value }));

    const handleStatusChange = (values: string[]) =>
        setFilters((prev: any) => ({
            ...prev,
            status: values.length > 0 ? values : '',
        }));

    const handlePriorityChange = (values: string[]) =>
        setFilters((prev: any) => ({
            ...prev,
            priority: values.length > 0 ? values : '',
        }));

    const clearAllFilters = () => setFilters({ search: '', status: '', priority: '' });

    const hasActiveFilters = filters.search || filters.status || filters.priority;

    // --- Transform backend options into FacetedFilterOptions ---
    const statusFilterOptions: FacetedFilterOption[] = Object.entries(statusOptions).map(
        ([key, label]) => ({
            value: key,
            label,
            icon: statusIcons[key as keyof typeof statusIcons],
        }),
    );

    const priorityFilterOptions: FacetedFilterOption[] = Object.entries(priorityOptions).map(
        ([key, label]) => ({
            value: key,
            label,
            icon: priorityIcons[key as keyof typeof priorityIcons],
        }),
    );

    // --- Normalize selected values ---
    const selectedStatusValues = Array.isArray(filters.status)
        ? filters.status
        : filters.status
          ? [filters.status]
          : [];

    const selectedPriorityValues = Array.isArray(filters.priority)
        ? filters.priority
        : filters.priority
          ? [filters.priority]
          : [];

    // --- Render ---
    return (
        <div className="flex flex-col items-start justify-between gap-4 rounded-lg border bg-gray-50 p-4 sm:flex-row sm:items-center">
            <div className="flex w-full flex-1 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                {/* Search Filter */}
                <div className="relative w-full sm:w-64">
                    <Input
                        placeholder="Filter tasks..."
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

                {/* Priority Filter */}
                <FacetedFilter
                    title="Priority"
                    options={priorityFilterOptions}
                    selectedValues={selectedPriorityValues}
                    onSelectedChange={handlePriorityChange}
                    triggerIcon={CirclePlus}
                    placeholder="Filter priority..."
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
