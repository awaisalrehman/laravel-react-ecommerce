import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { create, index, store } from '@/routes/admin/categories';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import CategoryForm from './partials/category-form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Categories', href: index().url },
    { title: 'Add New', href: create().url },
];

export default function CreateCategory() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Category" />

            <div className="p-4">
                <div className="mx-auto max-w-(--breakpoint-lg)">
                    <div className="flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-0">
                        <div className="flex items-center gap-4">
                            <Link href={index().url}>
                                <Button>
                                    <ArrowLeft />
                                    Back
                                </Button>
                            </Link>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Add Category
                            </h1>
                        </div>
                    </div>

                    <CategoryForm submitUrl={store().url} method="post" />
                </div>
            </div>
        </AppLayout>
    );
}
