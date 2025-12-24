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
import { Trash } from 'lucide-react';
import { Task } from '@/types';

interface DeleteTasksDialogProps {
    tasks: Task[];
    showTrigger?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSuccess?: () => void;
    loading?: boolean;
}

export function DeleteTasksDialog({
    tasks,
    showTrigger = true,
    open,
    onOpenChange,
    onSuccess,
    loading = false,
}: DeleteTasksDialogProps) {
    if (tasks.length === 0) return null;

    const isBulkDelete = tasks.length > 1;

    const handleConfirm = async () => {
        await onSuccess?.();
        onOpenChange?.(false);
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
                                <strong>{tasks[0]?.title ?? 'this task'}</strong>
                                ? This action cannot be undone.
                            </>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange?.(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading
                            ? 'Deleting...'
                            : isBulkDelete
                              ? `Delete ${tasks.length} Tasks`
                              : 'Delete Task'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
