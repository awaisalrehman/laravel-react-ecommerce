"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Task } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

/**
 * Columns for the Tasks DataTable
 */
export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const { title } = row.original;
      return (
        <div className="flex items-center gap-2">
          <div className="font-medium capitalize text-foreground">
            {title || "Untitled Task"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status?.toLowerCase();

      const statusColor =
        status === "completed"
          ? "default"
          : status === "in_progress"
          ? "secondary"
          : "outline";

      const label =
        status === "completed"
          ? "Completed"
          : status === "in_progress"
          ? "In Progress"
          : "Pending";

      return (
        <Badge variant={statusColor} className="capitalize">
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.original.priority?.toLowerCase();
      const variant =
        priority === "high"
          ? "destructive"
          : priority === "medium"
          ? "secondary"
          : "outline";

      return (
        <Badge variant={variant} className="capitalize">
          {priority || "N/A"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
    cell: ({ row }) => {
      const dateValue = row.original.due_date
        ? new Date(row.original.due_date)
        : null;

      return (
        <span className="text-sm text-muted-foreground">
          {dateValue ? dateValue.toLocaleDateString() : "No due date"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "",
    enableHiding: false,
    cell: ({ row }) => {
      const task = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(String(task.id))
              }
            >
              Copy Task ID
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => alert(`Viewing ${task.title}`)}
            >
              View Details
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => alert(`Editing ${task.title}`)}
            >
              Edit Task
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-destructive"
              onClick={() => alert(`Deleting ${task.title}`)}
            >
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
