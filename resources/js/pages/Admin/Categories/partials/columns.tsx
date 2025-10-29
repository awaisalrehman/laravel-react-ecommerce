import ImageCell from '@/components/data-table/image-cell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Category } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import React from 'react';

/**
 * Small presentational components for concise cells.
 */
const StatusBadge: React.FC<{ status: number }> = ({ status }) => {
    const isActive = status === 1;
    const color = isActive
        ? 'bg-green-100 text-green-700'
        : 'bg-gray-100 text-gray-700';
    return (
        <Badge className={cn('capitalize', color)}>
            {isActive ? 'Active' : 'Inactive'}
        </Badge>
    );
};

const ActionsCell: React.FC<{
    category: Category;
    onEditClick: (category: Category) => void;
    onSingleDeleteClick: (category: Category) => void;
}> = ({ category, onEditClick, onSingleDeleteClick }) => (
    <div className="flex items-center gap-2">
        <Button
            variant="outline"
            size="sm"
            onClick={() => onEditClick(category)}
        >
            <Edit className="h-4 w-4" />
        </Button>
        <Button
            variant="destructive"
            size="sm"
            onClick={() => onSingleDeleteClick(category)}
        >
            <Trash2 className="h-4 w-4" />
        </Button>
    </div>
);

export type ColumnsProps = {
    onEditClick: (category: Category) => void;
    onSingleDeleteClick: (category: Category) => void;
};

export const columns = ({
    onEditClick,
    onSingleDeleteClick,
}: ColumnsProps): ColumnDef<Category>[] => [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: 'Category Name',
        cell: ({ row }) => {
            const { name, image } = row.original;
            return (
                <div className="flex items-center gap-4">
                    <ImageCell src={image} alt={name} size={48} />
                    <div className="font-medium capitalize">{name}</div>
                </div>
            );
        },
    },
    {
        accessorKey: 'slug',
        header: 'Slug',
        cell: ({ row }) => (
            <div className="text-gray-700">{row.original.slug}</div>
        ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
        accessorKey: 'created_at',
        header: 'Created',
        cell: ({ row }) =>
            row.original.created_at
                ? format(new Date(row.original.created_at), 'MMM d, yyyy')
                : '-',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <ActionsCell
                category={row.original}
                onEditClick={onEditClick}
                onSingleDeleteClick={onSingleDeleteClick}
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
];
