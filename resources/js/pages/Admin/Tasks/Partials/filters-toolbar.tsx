// resources/js/pages/Admin/Tasks/partials/filters-toolbar.tsx
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Task } from '@/types';
import { Table } from '@tanstack/react-table';
import { ChevronDown, Filter, X } from 'lucide-react';
import React from 'react';

interface FiltersToolbarProps {
    filters: {
        search: string;
        status: string | string[];
        priority: string | string[];
    };
    setFilters: (filters: any) => void;
    table: Table<Task>;
    statusOptions: string[];
    priorityOptions: string[];
}

export const FiltersToolbar: React.FC<FiltersToolbarProps> = ({
    filters,
    setFilters,
    table,
    statusOptions,
    priorityOptions,
}) => {
    const handleSearch = (value: string) => {
        setFilters((prev: any) => ({ ...prev, search: value }));
    };

    const handleStatusFilter = (value: string) => {
        setFilters((prev: any) => ({ ...prev, status: value }));
    };

    const handlePriorityFilter = (value: string) => {
        setFilters((prev: any) => ({ ...prev, priority: value }));
    };

    const handleMultiSelectFilter = (
        type: 'status' | 'priority',
        value: string,
        checked: boolean,
    ) => {
        setFilters((prev: any) => {
            const currentValues = Array.isArray(prev[type])
                ? prev[type]
                : prev[type]
                  ? [prev[type]]
                  : [];

            if (checked) {
                return { ...prev, [type]: [...currentValues, value] };
            } else {
                return {
                    ...prev,
                    [type]: currentValues.filter((v: string) => v !== value),
                };
            }
        });
    };

    const clearFilters = () => {
        setFilters({ search: '', status: '', priority: '' });
    };

    const hasActiveFilters =
        filters.search || filters.status || filters.priority;

    const getSelectedLabels = (
        type: 'status' | 'priority',
        options: string[],
    ) => {
        const values = Array.isArray(filters[type])
            ? filters[type]
            : filters[type]
              ? [filters[type]]
              : [];
        return values
            .map((value) => options.find((opt) => opt === value) || value)
            .join(', ');
    };

    return (
        <div className="flex flex-col items-start justify-between gap-4 rounded-lg border bg-gray-50 p-4 sm:flex-row sm:items-center">
            <div className="flex w-full flex-1 flex-col gap-3 sm:w-auto sm:flex-row">
                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                    <Input
                        placeholder="Search tasks..."
                        value={filters.search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-9"
                    />
                    <Filter className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
                </div>

                {/* Status Multi-select Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-between sm:w-40"
                        >
                            <span className="truncate">
                                {filters.status
                                    ? `Status: ${getSelectedLabels('status', statusOptions)}`
                                    : 'All Status'}
                            </span>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {statusOptions.map((status) => {
                            const isSelected = Array.isArray(filters.status)
                                ? filters.status.includes(status)
                                : filters.status === status;

                            return (
                                <DropdownMenuCheckboxItem
                                    key={status}
                                    checked={isSelected}
                                    onCheckedChange={(checked) =>
                                        handleMultiSelectFilter(
                                            'status',
                                            status,
                                            checked,
                                        )
                                    }
                                >
                                    <span className="capitalize">
                                        {status.replace('_', ' ')}
                                    </span>
                                </DropdownMenuCheckboxItem>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Priority Multi-select Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-between sm:w-40"
                        >
                            <span className="truncate">
                                {filters.priority
                                    ? `Priority: ${getSelectedLabels('priority', priorityOptions)}`
                                    : 'All Priority'}
                            </span>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>
                            Filter by Priority
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {priorityOptions.map((priority) => {
                            const isSelected = Array.isArray(filters.priority)
                                ? filters.priority.includes(priority)
                                : filters.priority === priority;

                            return (
                                <DropdownMenuCheckboxItem
                                    key={priority}
                                    checked={isSelected}
                                    onCheckedChange={(checked) =>
                                        handleMultiSelectFilter(
                                            'priority',
                                            priority,
                                            checked,
                                        )
                                    }
                                >
                                    <span className="capitalize">
                                        {priority}
                                    </span>
                                </DropdownMenuCheckboxItem>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="whitespace-nowrap"
                    >
                        <X className="mr-1 h-4 w-4" />
                        Clear
                    </Button>
                )}
            </div>
        </div>
    );
};
