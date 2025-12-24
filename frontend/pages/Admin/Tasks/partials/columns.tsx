import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Task } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import React from 'react';

/**
 * Small presentational components extracted to keep each cell concise.
 * These are internal to the columns file and keep logic in one place.
 */
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const color =
        status === 'completed'
            ? 'bg-green-100 text-green-700'
            : status === 'in_progress'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-100 text-gray-700';

    return <Badge className={cn('capitalize', color)}>{status.replace('_', ' ')}</Badge>;
};

const PriorityBadge: React.FC<{ priority?: string }> = ({ priority = '' }) => {
    const color =
        priority === 'high'
            ? 'bg-red-100 text-red-700'
            : priority === 'medium'
              ? 'bg-orange-100 text-orange-700'
              : priority === 'low'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700';

    return <Badge className={cn('capitalize', color)}>{priority || '-'}</Badge>;
};

const ActionsCell: React.FC<{
    task: Task;
    onEditClick: (task: Task) => void;
    onSingleDeleteClick: (task: Task) => void;
}> = ({ task, onEditClick, onSingleDeleteClick }) => (
    <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onEditClick(task)}>
            <Edit className="h-4 w-4" />
        </Button>
        <Button
            variant="destructive"
            size="sm"
            onClick={() => onSingleDeleteClick(task)}
        >
            <Trash2 className="h-4 w-4" />
        </Button>
    </div>
);

export type ColumnsProps = {
    onEditClick: (task: Task) => void;
    onSingleDeleteClick: (task: Task) => void;
};

export const columns = ({
    onEditClick,
    onSingleDeleteClick,
}: ColumnsProps): ColumnDef<Task>[] => [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
            <div className="font-medium text-gray-900">
                {row.original.title}
            </div>
        ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
        accessorKey: 'priority',
        header: 'Priority',
        cell: ({ row }) => <PriorityBadge priority={row.original.priority} />,
    },
    {
        accessorKey: 'due_date',
        header: 'Due Date',
        cell: ({ row }) =>
            row.original.due_date
                ? format(new Date(row.original.due_date), 'MMM d, yyyy')
                : '-',
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
                task={row.original}
                onEditClick={onEditClick}
                onSingleDeleteClick={onSingleDeleteClick}
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
];
