"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Task } from "@/types";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "priority",
    header: "Priority",
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
  },
  {
    id: "actions",
    header: "Action",
    cell: () => (
      <div className="flex gap-2">
        <button className="text-blue-600 hover:underline">Edit</button>
        <button className="text-red-600 hover:underline">Delete</button>
      </div>
    ),
  },
];
