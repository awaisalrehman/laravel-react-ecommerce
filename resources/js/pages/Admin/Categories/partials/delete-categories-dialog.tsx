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
import { Category } from '@/types';

interface DeleteCategoriesDialogProps {
    categories: Category[];
    showTrigger?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSuccess?: () => void;
    loading?: boolean;
}

export function DeleteCategoriesDialog({
    categories,
    showTrigger = true,
    open,
    onOpenChange,
    onSuccess,
    loading = false,
}: DeleteCategoriesDialogProps) {
    if (categories.length === 0) return null;

    const isBulkDelete = categories.length > 1;

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
                            ? `Delete ${categories.length} Categories`
                            : 'Delete Category'}
                    </DialogTitle>
                    <DialogDescription>
                        {isBulkDelete ? (
                            <>
                                Are you sure you want to delete{' '}
                                <strong>{categories.length} selected categories</strong>?
                                This action cannot be undone.
                            </>
                        ) : (
                            <>
                                Are you sure you want to delete{' '}
                                <strong>{categories[0]?.name ?? 'this category'}</strong>?
                                This action cannot be undone.
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
                              ? `Delete ${categories.length} Categories`
                              : 'Delete Category'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
