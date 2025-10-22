'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface DeleteTasksDialogProps {
    tasks: { id: number; title?: string }[];
    showTrigger?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSuccess?: () => void;
}

export function DeleteTasksDialog({
    tasks,
    showTrigger = true,
    open,
    onOpenChange,
    onSuccess,
}: DeleteTasksDialogProps) {
    const [loading, setLoading] = useState(false);
    const { delete: destroy } = useForm();

    const isBulkDelete = tasks.length > 1;

    const handleDelete = () => {
        if (!tasks.length) return;

        setLoading(true);

        if (isBulkDelete) {
            // Use onSuccess callback for bulk delete
            onSuccess?.();
        } else {
            // Single delete using Inertia
            destroy(route('tasks.destroy', tasks[0].id), {
                onSuccess: () => {
                    toast.success('Task deleted successfully');
                    onSuccess?.();
                },
                onError: () => toast.error('Failed to delete task'),
                onFinish: () => {
                    setLoading(false);
                    onOpenChange?.(false);
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {showTrigger && (
                <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                        <Trash className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isBulkDelete
                            ? `Delete ${tasks.length} Tasks`
                            : 'Delete Task'}
                    </DialogTitle>
                    <DialogDescription>
                        {isBulkDelete ? (
                            <>
                                Are you sure you want to delete{' '}
                                <strong>{tasks.length} selected tasks</strong>?
                                This action cannot be undone.
                            </>
                        ) : (
                            <>
                                Are you sure you want to delete{' '}
                                <strong>
                                    {tasks[0]?.title ?? 'this task'}
                                </strong>
                                ? This action cannot be undone.
                            </>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange?.(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading
                            ? 'Deleting...'
                            : `Delete ${isBulkDelete ? `${tasks.length} Tasks` : 'Task'}`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}