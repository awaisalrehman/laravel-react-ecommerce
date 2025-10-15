"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Category } from "@/types";
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

export const columns: ColumnDef<Category>[] = [
    {
        accessorKey: "name",
        header: "Category Name",
        cell: ({ row }) => {
            const { name, image } = row.original;
            const imagePath = image ? `/${image}` : '/images/placeholder.png';
            return (
                <div className="flex items-center gap-4">
                    <figure className="rounded-lg border overflow-hidden">
                        <img
                            src={imagePath}
                            alt={name}
                            width={48}
                            height={48}
                            loading="lazy"
                            className="object-cover w-12 h-12"
                        />
                    </figure>
                    <div className="capitalize font-medium">{name}</div>
                </div>
            );
        },
    },
    {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => (
            <span className="text-muted-foreground text-sm">
                {row.original.slug}
            </span>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = Number(row.original.status);
            return (
                <Badge
                    variant={status === 1 ? "default" : "destructive"}
                >
                    {status === 1 ? "Active" : "Inactive"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            return (
                <span className="text-sm text-muted-foreground">
                    {date.toLocaleDateString()}
                </span>
            );
        },
    },
    {
        id: "actions",
        header: "",
        enableHiding: false,
        cell: ({ row }) => {
            const category = row.original;

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
                            onClick={() => navigator.clipboard.writeText(String(category.id))}
                        >
                            Copy Category ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => alert(`Viewing ${category.name}`)}>
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
