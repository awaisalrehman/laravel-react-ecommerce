import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, RotateCcw, Trash2 } from 'lucide-react';
import { Task } from '@/types';

interface TaskBulkActionsProps {
    selectedCount: number;
    selectedTasks: Task[];
    onExport: () => Promise<void>;
    onBulkDeleteTrigger: () => void;
    hasHiddenColumns: boolean;
    onResetColumns: () => void;
}

const TaskBulkActions: React.FC<TaskBulkActionsProps> = ({
    selectedCount,
    selectedTasks,
    onExport,
    onBulkDeleteTrigger,
    hasHiddenColumns,
    onResetColumns,
}) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                {selectedCount > 0 && (
                    <>
                        <span className="text-sm text-gray-600">
                            {selectedCount} selected
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onExport}
                        >
                            <Download className="mr-1 h-4 w-4" />
                            Export
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={onBulkDeleteTrigger}
                        >
                            <Trash2 className="mr-1 h-4 w-4" />
                            Delete
                        </Button>
                    </>
                )}
            </div>

            <div className="flex items-center gap-2">
                {hasHiddenColumns && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onResetColumns}
                        title="Reset to show all columns"
                    >
                        <RotateCcw className="mr-1 h-4 w-4" />
                        Reset Columns
                    </Button>
                )}
            </div>
        </div>
    );
};

export default TaskBulkActions;
