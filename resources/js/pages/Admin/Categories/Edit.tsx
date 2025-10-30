import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { edit, index, update } from '@/routes/admin/categories';
import { BreadcrumbItem, Category } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import CategoryForm, { type EditCategory } from './partials/category-form';

interface EditCategoryProps {
    category: Category;
}

export default function EditCategory({ category }: EditCategoryProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Categories', href: index().url },
        { title: 'Edit', href: edit(category.id).url },
    ];

    // Prepare form data for EditCategoryForm
    const formCategory: EditCategory = {
        id: category.id,
        name: category.name,
        description: category.description ?? null,
        image: category.image ?? null,
        status: String(category.status), // string because form expects string
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit: ${category.name}`} />

            <div className="p-4">
                <div className="mx-auto max-w-(--breakpoint-lg)">
                    <div className="flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-0">
                        <div className="flex items-center gap-4">
                            <Link href={index().url}>
                                <Button>
                                    <ArrowLeft /> Back
                                </Button>
                            </Link>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Edit Category
                            </h1>
                        </div>
                    </div>

                    <CategoryForm
                        category={formCategory}
                        submitUrl={update(category.id).url}
                        method="put"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
