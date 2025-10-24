import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TaskHeaderProps {
    onCreateClick: () => void;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({ onCreateClick }) => (
    <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-semibold">Tasks</h1>
            <p className="mt-1 text-sm text-gray-600">
                Manage and track your team's tasks
            </p>
        </div>
        <Button onClick={onCreateClick}>
            <Plus className="mr-2 h-4 w-4" />
            Create Task
        </Button>
    </div>
);

export default TaskHeader;
