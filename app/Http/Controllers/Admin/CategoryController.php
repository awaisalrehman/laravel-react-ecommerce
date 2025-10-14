<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        [$items, $pagination] = $this->queryCategories($request);

        return Inertia::render('Admin/Categories/Index', [
            'initialData' => $items,
            'initialPagination' => $pagination,
            'filters' => [
                'q' => $request->string('q')->toString(),
                'status' => $request->string('status')->toString(),
                'sort_by' => $request->string('sort_by')->toString(),
                'sort_dir' => $request->string('sort_dir')->toString(),
            ],
            'datatableUrl' => route('admin.categories.datatable'),
        ]);
    }

    public function datatableJson(Request $request)
    {
        [$items, $pagination] = $this->queryCategories($request);

        return response()->json([
            'data' => $items,
            'pagination' => $pagination,
            'echo' => [
                'q' => $request->string('q')->toString(),
                'status' => $request->string('status')->toString(),
                'sort_by' => $request->string('sort_by')->toString(),
                'sort_dir' => $request->string('sort_dir')->toString(),
            ],
        ]);
    }

    protected function queryCategories(Request $request): array
    {
        $q = $request->string('q')->toString();
        $status = $request->string('status')->toString();
        $sortBy = $request->string('sort_by')->toString() ?: 'created_at';
        $sortDir = strtolower($request->string('sort_dir')->toString() ?: 'desc');
        $perPage = (int) $request->integer('per_page') ?: 10;

        $query = Category::query()
            ->when($q, fn($qry) => $qry->where(function($w) use ($q) {
                $w->where('name', 'like', "%{$q}%")
                  ->orWhere('slug', 'like', "%{$q}%");
            }))
            ->when($status, fn($qry) => $qry->where('status', $status));

        $sortable = ['name', 'slug', 'status', 'created_at'];
        if (!in_array($sortBy, $sortable)) {
            $sortBy = 'created_at';
        }
        $sortDir = $sortDir === 'asc' ? 'asc' : 'desc';

        $paginator = $query->orderBy($sortBy, $sortDir)->paginate($perPage)->withQueryString();

        $items = $paginator->getCollection()->map(function (Category $c) {
            return [
                'id' => $c->id,
                'name' => $c->name,
                'slug' => $c->slug,
                'image' => $c->image,
                'status' => $c->status,
                'created_at' => $c->created_at?->toDateTimeString(),
            ];
        })->values();

        $pagination = [
            'current_page' => $paginator->currentPage(),
            'per_page' => $paginator->perPage(),
            'total' => $paginator->total(),
            'last_page' => $paginator->lastPage(),
        ];

        return [$items, $pagination];
    }

    public function create()
    {
        return Inertia::render('Admin/Categories/Create', [
            'mode' => 'create',
            'category' => null,
            'submitUrl' => route('admin.categories.store'),
        ]);
    }

    public function store(CategoryRequest $request)
    {
        $data = $request->validated();
        $slug = $data['slug'] ?? Str::slug($data['name']);

        // Ensure slug uniqueness
        $base = $slug;
        $i = 1;
        while (Category::where('slug', $slug)->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        Category::create([
            'name' => $data['name'],
            'slug' => $slug,
            'status' => $data['status'],
        ]);

        return redirect()->route('categories.index')->with('success', 'Category created successfully.');
    }

    public function edit(Category $category)
    {
        return Inertia::render('Admin/Categories/Edit', [
            'mode' => 'edit',
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'status' => $category->status,
            ],
            'submitUrl' => route('categories.update', $category),
        ]);
    }

    public function update(CategoryRequest $request, Category $category)
    {
        $data = $request->validated();
        $slug = $data['slug'] ?: Str::slug($data['name']);

        if ($slug !== $category->slug) {
            $base = $slug;
            $i = 1;
            while (Category::where('slug', $slug)->where('id', '<>', $category->id)->exists()) {
                $slug = "{$base}-{$i}";
                $i++;
            }
        }

        $category->update([
            'name' => $data['name'],
            'slug' => $slug,
            'status' => $data['status'],
        ]);

        return redirect()->route('categories.index')->with('success', 'Category updated successfully.');
    }

    public function show(Category $category)
    {
        return Inertia::render('Admin/Categories/Show', [
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'status' => $category->status,
            ],
        ]);
    }

    public function destroy(Category $category)
    {
        $category->delete();
        return redirect()->route('categories.index')->with('success', 'Category deleted successfully.');
    }
}
