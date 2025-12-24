import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { toast } from 'sonner';
import { Task } from '@/types';

interface TaskFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => Promise<void>;
    task?: Task | null;
}

const TaskFormDialog: React.FC<TaskFormDialogProps> = ({
    open,
    onOpenChange,
    onSuccess,
    task,
}) => {
    const [form, setForm] = useState({
        title: '',
        status: 'pending',
        priority: 'medium',
        due_date: '',
    });
    const [loading, setLoading] = useState(false);

    // Pre-fill form if editing
    useEffect(() => {
        if (task) {
            setForm({
                title: task.title || '',
                status: task.status || 'pending',
                priority: task.priority || 'medium',
                due_date: task.due_date || '',
            });
        } else {
            setForm({
                title: '',
                status: 'pending',
                priority: 'medium',
                due_date: '',
            });
        }
    }, [task]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (task) {
                const { update } = await import('@/routes/admin/tasks');
                await axios.put(update(task.id).url, form);
                toast.success('Task updated successfully');
            } else {
                const { store } = await import('@/routes/admin/tasks');
                await axios.post(store().url, form);
                toast.success('Task created successfully');
            }

            await onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Task save failed:', error);
            toast.error('Failed to save task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {task ? 'Edit Task' : 'Create Task'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="status">Status</Label>
                        <select
                            id="status"
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full rounded-md border border-gray-300 p-2"
                        >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="priority">Priority</Label>
                        <select
                            id="priority"
                            name="priority"
                            value={form.priority}
                            onChange={handleChange}
                            className="w-full rounded-md border border-gray-300 p-2"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="due_date">Due Date</Label>
                        <Input
                            type="date"
                            id="due_date"
                            name="due_date"
                            value={form.due_date ?? ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading
                                ? task
                                    ? 'Updating...'
                                    : 'Creating...'
                                : task
                                  ? 'Update Task'
                                  : 'Create Task'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default TaskFormDialog;
