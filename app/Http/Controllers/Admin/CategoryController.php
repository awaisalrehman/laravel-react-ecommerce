<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display the categories page.
     */
    public function index(Request $request)
    {
        $statusOptions = [
            'in_active' => 'In Active',
            'active' => 'Active',
        ];

        return Inertia::render('Admin/Categories/Index', [
            'datatableUrl' => route('admin.categories.datatable'),
            'statusOptions'  => $statusOptions,
        ]);
    }

    /**
     * Datatable JSON endpoint.
     */
    public function datatableJson(Request $request)
    {
        [$items, $pagination] = $this->queryCategories($request);

        return response()->json([
            'data' => $items,
            'pagination' => $pagination,
        ]);
    }

    /**
     * Central query builder for reusable filtering, sorting, pagination.
     */
    protected function queryCategories(Request $request): array
    {
        $search   = $request->string('search')->toString();
        $status   = $request->string('status')->toString();
        $sortBy   = $request->string('sort_by')->toString() ?: 'created_at';
        $sortDir  = strtolower($request->string('sort_dir')->toString() ?: 'desc');
        $perPage  = (int) $request->integer('per_page') ?: 10;

        $statusMap = [
            'active' => 1,
            'in_active' => 0,
        ];

        $query = Category::query()
            ->when($search, fn($q) =>
                $q->where(function ($w) use ($search) {
                    $w->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
                })
            )
            ->when($status, function ($q) use ($status, $statusMap) {
                $statuses = explode(',', $status);
                $statuses = array_map(fn($s) => $statusMap[$s] ?? null, $statuses);
                $statuses = array_filter($statuses, fn($s) => !is_null($s));

                if (!empty($statuses)) {
                    $q->whereIn('status', $statuses);
                }
            });

        $sortable = ['name', 'slug', 'created_at'];
        if (!in_array($sortBy, $sortable)) {
            $sortBy = 'created_at';
        }

        $sortDir = $sortDir === 'asc' ? 'asc' : 'desc';

        $paginator = $query->orderBy($sortBy, $sortDir)
            ->paginate($perPage)
            ->withQueryString();

        $items = $paginator->getCollection()->map(function (Category $category) {
            return [
                'id'          => $category->id,
                'name'        => $category->name,
                'slug'        => $category->slug,
                'description' => $category->description,
                'image'       => $category->image,
                'status'      => $category->status,
                'created_at'  => $category->created_at?->toDateTimeString(),
            ];
        })->values();

        $pagination = [
            'current_page' => $paginator->currentPage(),
            'per_page'     => $paginator->perPage(),
            'total'        => $paginator->total(),
            'last_page'    => $paginator->lastPage(),
        ];

        return [$items, $pagination];
    }

    public function create()
    {
        return Inertia::render('Admin/Categories/Create');
    }

    /**
     * Store a newly created category.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'slug'        => 'nullable|string|max:255|unique:categories,slug',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|max:2048',
            'status'      => 'required|in:0,1',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $validated['status'] = (int) $validated['status'];

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('categories', 'public');
        }

        Category::create($validated);

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'Category created successfully.');
    }

    public function edit(Category $category)
    {
        return inertia('Admin/Categories/Edit', [
            'category' => $category
        ]);
    }

    /**
     * Update an existing category.
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'slug'        => 'nullable|string|max:255|unique:categories,slug,' . $category->id,
            'description' => 'nullable|string',
            'image'       => 'nullable|image|max:2048',
            'status'      => 'required|in:0,1',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('categories', 'public');
        }

        $category->update($validated);

        return redirect()
            ->back()
            ->with('success', 'Category updated successfully.');
    }

    /**
     * Delete a single category.
     */
    public function destroy(Category $category)
    {
        $category->delete();

        return response()->noContent();
    }

    /**
     * Bulk delete categories.
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:categories,id',
        ]);

        try {
            Category::whereIn('id', $request->ids)->delete();

            return response()->json([
                'message' => 'Categories deleted successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete categories.',
            ], 500);
        }
    }

    /**
     * Export categories as CSV.
     */
    public function export(Request $request)
    {
        $request->validate([
            'ids' => 'sometimes|array',
            'ids.*' => 'exists:categories,id',
        ]);

        $categories = Category::when($request->has('ids'), function ($query) use ($request) {
            $query->whereIn('id', $request->ids);
        })->get();

        $fileName = 'categories-' . now()->format('Y-m-d') . '.csv';

        return response()->streamDownload(function () use ($categories) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, ['ID', 'Name', 'Slug', 'Description', 'Created At']);

            foreach ($categories as $cat) {
                fputcsv($handle, [
                    $cat->id,
                    $cat->name,
                    $cat->slug,
                    $cat->description,
                    $cat->created_at?->toDateTimeString(),
                ]);
            }

            fclose($handle);
        }, $fileName, [
            'Content-Type' => 'text/csv',
        ]);
    }
}
