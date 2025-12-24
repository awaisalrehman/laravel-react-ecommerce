import AppLayout from '@/layouts/app-layout';
import { create, index } from '@/routes/admin/products';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: index().url,
    },
    {
        title: 'Create',
        href: create().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product" />
        </AppLayout>
    );
}

