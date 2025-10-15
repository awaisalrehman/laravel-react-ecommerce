"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Task } from "@/types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

export const columns: ColumnDef<Task>[] = [
    {
        accessorKey: "title",
        header: "Title",
        enableSorting: true, // ✅ server-side sorting
        cell: ({ row }) => (
            <div className="font-medium text-gray-900">{row.original.title}</div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        enableSorting: true,
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
        enableSorting: true,
        cell: ({ row }) => {
            const priority = row.original.priority;
            const color =
                priority === "high"
                    ? "bg-red-100 text-red-700"
                    : priority === "medium"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-blue-100 text-blue-700";
            return (
                <Badge className={cn("capitalize", color)}>
                    {priority}
                </Badge>
            );
        },
    },
    {
        accessorKey: "due_date",
        header: "Due Date",
        enableSorting: true,
        cell: ({ row }) =>
            row.original.due_date
                ? format(new Date(row.original.due_date), "MMM d, yyyy")
                : "-",
    },
    {
        accessorKey: "created_at",
        header: "Created",
        enableSorting: true,
        cell: ({ row }) =>
            row.original.created_at
                ? format(new Date(row.original.created_at), "MMM d, yyyy")
                : "-",
    },
    {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert(`Edit Task #${row.original.id}`)}
                >
                    <Edit className="h-4 w-4" />
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => alert(`Delete Task #${row.original.id}`)}
                >
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
        ),
    },
];
