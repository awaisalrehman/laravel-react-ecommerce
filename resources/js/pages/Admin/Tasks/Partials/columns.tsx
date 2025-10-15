import { ColumnDef } from "@tanstack/react-table";
import { Task } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Edit } from "lucide-react";
import { DeleteTasksDialog } from "./delete-tasks-dialog";

export const columns: ColumnDef<Task>[] = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
            <div className="font-medium text-gray-900">{row.original.title}</div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            const color =
                status === "completed"
                    ? "bg-green-100 text-green-700"
                    : status === "in_progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700";
            return (
                <Badge className={cn("capitalize", color)}>
                    {status.replace("_", " ")}
                </Badge>
            );
        },
    },
    {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => {
            const priority = row.original.priority;
            const color =
                priority === "high"
                    ? "bg-red-100 text-red-700"
                    : priority === "medium"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-blue-100 text-blue-700";
            return <Badge className={cn("capitalize", color)}>{priority}</Badge>;
        },
    },
    {
        accessorKey: "due_date",
        header: "Due Date",
        cell: ({ row }) =>
            row.original.due_date
                ? format(new Date(row.original.due_date), "MMM d, yyyy")
                : "-",
    },
    {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) =>
            row.original.created_at
                ? format(new Date(row.original.created_at), "MMM d, yyyy")
                : "-",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const task = row.original;
            return (
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alert(`Edit Task #${task.id}`)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>

                    {/* ✅ Single-task delete dialog */}
                    <DeleteTasksDialog tasks={[task]} showTrigger />
                </div>
            );
        },
    },
];
