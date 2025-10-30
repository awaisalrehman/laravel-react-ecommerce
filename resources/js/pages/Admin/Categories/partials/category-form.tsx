import StatusSelect from '@/components/status-select';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import React from 'react';

export interface CreateCategory {
    name: string;
    description?: string | null;
    image?: File | string | null;
    status: string; // string for form select
}

export interface EditCategory extends CreateCategory {
    id: number;
}

interface CategoryFormProps {
    category?: CreateCategory | EditCategory;
    submitUrl: string;
    method?: 'post' | 'put';
}

const statuses = [
    { value: '0', label: 'Inactive', color: 'bg-orange-500' },
    { value: '1', label: 'Active', color: 'bg-green-500' },
];

export default function CategoryForm({
    category,
    submitUrl,
    method = 'post',
}: CategoryFormProps) {
    const form = useForm<Partial<EditCategory>>({
        id: (category as EditCategory)?.id,
        name: category?.name ?? '',
        description: category?.description ?? '',
        image: category?.image ?? null,
        status: category?.status ?? '1',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const options = { forceFormData: true };

        if (method === 'put') {
            form.put(submitUrl, options);
        } else {
            form.post(submitUrl, options);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 lg:grid-cols-6">
                {/* Left Column */}
                <div className="space-y-4 lg:col-span-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Category Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Category Name</Label>
                                <Input
                                    id="name"
                                    value={form.data.name ?? ''}
                                    onChange={(e) =>
                                        form.setData('name', e.target.value)
                                    }
                                    placeholder="Enter category name"
                                />
                                {form.errors.name && (
                                    <p className="text-sm text-destructive">
                                        {form.errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={form.data.description ?? ''}
                                    onChange={(e) =>
                                        form.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Write a short description..."
                                    rows={4}
                                />
                                {form.errors.description && (
                                    <p className="text-sm text-destructive">
                                        {form.errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Image */}
                            <div className="space-y-2">
                                <Label htmlFor="image">Category Image</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    onChange={(e) =>
                                        form.setData(
                                            'image',
                                            e.target.files?.[0] || null,
                                        )
                                    }
                                />
                                {category?.image &&
                                    typeof category.image === 'string' && (
                                        <img
                                            src={`/${category.image}`}
                                            alt="Category"
                                            className="mt-2 h-16 w-16 rounded-md border object-cover"
                                        />
                                    )}
                                {form.errors.image && (
                                    <p className="text-sm text-destructive">
                                        {form.errors.image}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button type="submit" disabled={form.processing}>
                                {form.processing
                                    ? 'Saving...'
                                    : method === 'post'
                                      ? 'Create Category'
                                      : 'Update Category'}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-4 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <StatusSelect
                                statuses={statuses}
                                value={form.data.status ?? '1'}
                                onChange={(value) =>
                                    form.setData('status', value)
                                }
                            />
                            <CardDescription>
                                Set the category status.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
