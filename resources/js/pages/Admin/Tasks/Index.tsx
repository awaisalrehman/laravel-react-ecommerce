"use client";

import React from "react";
import axios from "axios";
import { DataTable } from "@/components/ss-components/data-table-04";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Task, PageProps } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import { columns } from "./partials/columns";
import { useState } from "react";
import { index } from "@/routes/admin/tasks";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateTaskDialog from "./partials/CreateTaskDialog";

interface TasksPageProps extends PageProps {
    initialData: Task[];
    initialPagination: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
    filters: {
        search?: string;
        status?: string;
        priority?: string;
        sort_by?: string;
        sort_dir?: string;
    };
    datatableUrl: string;
    statusOptions: string[];
    priorityOptions: string[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: "Tasks", href: index().url }];

const Index: React.FC = () => {
    const {
        initialData,
        initialPagination,
        filters: initialFilters,
        datatableUrl,
    } = usePage<TasksPageProps>().props;

    const [tasks, setTasks] = useState<Task[]>(initialData);
    const [loading, setLoading] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = React.useState(false);

    // --- Fetch tasks ---
    const fetchTasks = React.useCallback(
        async (params: Record<string, any> = {}) => {
            setLoading(true);
            try {
                const { data } = await axios.get(datatableUrl, { params });
                setTasks(data.data);
            } finally {
                setLoading(false);
            }
        },
        [datatableUrl]
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />

            <div className="container mx-auto py-10 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Tasks</h1>
                    <Button onClick={() => setShowCreateDialog(true)}><Plus /> Create Task</Button>
                </div>

                <DataTable columns={columns} data={tasks} loading={loading} />
            </div>

            <CreateTaskDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
                onCreated={() => fetchTasks()} // ✅ refresh after creation
            />
        </AppLayout>
    );
};

export default Index;
