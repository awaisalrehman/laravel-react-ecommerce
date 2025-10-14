"use client";

import { DataTable } from "@/components/ss-components/data-table-04";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Category, PageProps } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import { columns } from "./partials/columns";
import { useState } from "react";
import { index } from "@/routes/admin/categories";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Categories", href: index().url },
];

interface CategoriesPageProps extends PageProps {
    initialData: Category[];
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

const Index: React.FC = () => {
    const { initialData } = usePage<CategoriesPageProps>().props;

    const [categories, setCategories] = useState<Category[]>(initialData);
    const [loading, setLoading] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />

            <div className="container mx-auto py-10 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Categories</h1>
                    <Link href="/admin/categories/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Category
                        </Button>
                    </Link>
                </div>

                <DataTable columns={columns} data={categories} loading={loading} />
            </div>
        </AppLayout>
    );
};

export default Index;
