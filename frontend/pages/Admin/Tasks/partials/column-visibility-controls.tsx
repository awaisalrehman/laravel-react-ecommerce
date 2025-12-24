import React from 'react';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, RotateCcw } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { Task } from '@/types';

interface ColumnVisibilityControlProps {
    table: Table<Task>;
    resetColumnVisibility: () => void;
    hasHiddenColumns: boolean;
}

const ColumnVisibilityControl: React.FC<ColumnVisibilityControlProps> = ({ table, resetColumnVisibility, hasHiddenColumns }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    <RotateCcw className="mr-1 h-4 w-4" />
                    View
                    <ChevronsUpDown className="ml-1 h-4 w-4 text-gray-400" />
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
                    .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
                    .map((column) => (
                        <DropdownMenuCheckboxItem
                            key={column.id}
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                            onSelect={(e) => e.preventDefault()}
                            className="capitalize"
                        >
                            {column.id.replace('_', ' ')}
                        </DropdownMenuCheckboxItem>
                    ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={resetColumnVisibility}
                    onSelect={(e) => e.preventDefault()}
                    className="cursor-pointer"
                >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset to default
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ColumnVisibilityControl;
