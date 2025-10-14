import React from "react";
import { Head, usePage } from "@inertiajs/react";
import axios from "axios";
import { PageProps, Task, BreadcrumbItem } from "@/types";
import AppLayout from "@/layouts/app-layout";
import { DataTable } from "@/components/data-table";
import { columns } from "./partials/columns";
import CreateTaskDialog from "./partials/CreateTaskDialog";
import { index } from "@/routes/admin/tasks";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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

const TasksIndex: React.FC = () => {
  const {
    initialData,
    initialPagination,
    filters: initialFilters,
    datatableUrl,
  } = usePage<TasksPageProps>().props;

  const [tasks, setTasks] = React.useState<Task[]>(initialData);
  const [loading, setLoading] = React.useState(false);
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
          <Button onClick={() => setShowCreateDialog(true)}><Plus/> Create Task</Button>
        </div>

        <DataTable
          columns={columns}
          data={tasks}
          loading={loading}
        />
      </div>

      <CreateTaskDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreated={() => fetchTasks()} // ✅ refresh after creation
      />
    </AppLayout>
  );
};

export default TasksIndex;
