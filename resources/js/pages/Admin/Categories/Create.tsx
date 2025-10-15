import { Head, Link, useForm } from "@inertiajs/react"
import { create, index, store } from "@/routes/admin/categories"
import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem } from "@/types"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import React from "react"
import StatusSelect from "@/components/status-select"
import { ArrowLeft } from "lucide-react"

interface CategoryForm {
    name: string
    description: string
    image: File | null
    status: string // '0' or '1'
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Categories", href: index().url },
    { title: "Add New", href: create().url },
]

const statuses = [
    { value: "0", label: "Inactive", color: "bg-orange-500" },
    { value: "1", label: "Active", color: "bg-green-500" },
]

export default function CreateCategory() {
    const form = useForm<CategoryForm>({
        name: "",
        description: "",
        image: null,
        status: "1", // default active
    })

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        form.post(store().url)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Category" />

            <div className="p-4">
                <div className="mx-auto max-w-(--breakpoint-lg)">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-0">
                            <div className="flex items-center gap-4">
                                <Link href={index().url}><Button><ArrowLeft />Back</Button></Link>
                                <h1 className="text-2xl font-bold tracking-tight">Add Category</h1>
                            </div>
                            <div className="flex gap-2 hidden">
                                <Button type="button" variant="secondary">Discard</Button>
                                <Button type="button" variant="outline">Save Draft</Button>
                                <Button type="button" disabled={form.processing}>Publish</Button>
                            </div>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-6">
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
                                                value={form.data.name}
                                                onChange={(e) => form.setData("name", e.target.value)}
                                                placeholder="Enter category name"
                                            />
                                            {form.errors.name && <p className="text-sm text-destructive">{form.errors.name}</p>}
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2">
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                value={form.data.description}
                                                onChange={(e) => form.setData("description", e.target.value)}
                                                placeholder="Write a short description..."
                                                rows={4}
                                            />
                                            {form.errors.description && <p className="text-sm text-destructive">{form.errors.description}</p>}
                                        </div>

                                        {/* Image */}
                                        <div className="space-y-2">
                                            <Label htmlFor="image">Category Image</Label>
                                            <Input
                                                id="image"
                                                type="file"
                                                onChange={(e) => form.setData("image", e.target.files?.[0] || null)}
                                            />
                                            {form.errors.image && <p className="text-sm text-destructive">{form.errors.image}</p>}
                                        </div>
                                    </CardContent>

                                    {/* Submit */}
                                    <CardFooter className="flex justify-end">
                                        <Button type="submit" disabled={form.processing}> {form.processing ? "Saving..." : "Create Category"} </Button>
                                    </CardFooter>
                                </Card>
                            </div>

                            {/* Right column */}
                            <div className="space-y-4 lg:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Status</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <StatusSelect
                                            statuses={statuses}
                                            value={form.data.status}
                                            onChange={(value) => form.setData("status", value)}
                                        />
                                        <CardDescription>Set the category status.</CardDescription>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    )
}
