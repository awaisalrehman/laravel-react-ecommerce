<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\ProductRequest;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    // Render initial list with first data load (Inertia)
    public function index(Request $request)
    {
        [$items, $pagination] = $this->queryProducts($request);
        $categories = Category::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Admin/Products/Index', [
            'initialData' => $items,
            'initialPagination' => $pagination,
            'filters' => [
                'q' => $request->string('q')->toString(),
                'status' => $request->string('status')->toString(),
                'category_id' => $request->string('category_id')->toString(),
                'sort_by' => $request->string('sort_by')->toString(),
                'sort_dir' => $request->string('sort_dir')->toString(),
            ],
            'categories' => $categories,
            'datatableUrl' => route('admin.products.datatable'),
        ]);
    }

    public function datatableJson(Request $request)
    {
        [$items, $pagination] = $this->queryProducts($request);

        return response()->json([
            'data' => $items,
            'pagination' => $pagination,
            'echo' => [
                'q' => $request->string('q')->toString(),
                'status' => $request->string('status')->toString(),
                'category_id' => $request->string('category_id')->toString(),
                'sort_by' => $request->string('sort_by')->toString(),
                'sort_dir' => $request->string('sort_dir')->toString(),
            ],
        ]);
    }

    protected function queryProducts(Request $request): array
    {
        $q = $request->string('q')->toString();
        $status = $request->string('status')->toString();
        $categoryId = $request->string('category_id')->toString();
        $sortBy = $request->string('sort_by')->toString() ?: 'created_at';
        $sortDir = strtolower($request->string('sort_dir')->toString() ?: 'desc');
        $perPage = (int) $request->integer('per_page') ?: 10;

        $query = Product::with('category')
            ->when($q, fn($qry) => $qry->where(function($w) use ($q) {
                $w->where('name', 'like', "%{$q}%")
                  ->orWhere('description', 'like', "%{$q}%");
            }))
            ->when($status, fn($qry) => $qry->where('status', $status))
            ->when($categoryId, fn($qry) => $qry->where('category_id', $categoryId));

        // Allowlist sortable fields
        $sortable = ['name', 'price', 'status', 'created_at'];
        if (!in_array($sortBy, $sortable)) {
            $sortBy = 'created_at';
        }
        $sortDir = $sortDir === 'asc' ? 'asc' : 'desc';

        $paginator = $query->orderBy($sortBy, $sortDir)->paginate($perPage)->withQueryString();

        $items = $paginator->getCollection()->map(function (Product $p) {
            $firstImage = is_array($p->images) && count($p->images) ? $p->images[0] : null;
            return [
                'id' => $p->id,
                'name' => $p->name,
                'description' => $p->description,
                'price' => (string)$p->price,
                'status' => $p->status,
                'category' => $p->category?->name,
                'category_id' => $p->category_id,
                'image_url' => $firstImage ? (Str::startsWith($firstImage, ['http://', 'https://', '/']) ? $firstImage : Storage::url($firstImage)) : null,
                'created_at' => $p->created_at?->toDateTimeString(),
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
        $categories = Category::select('id', 'name')->orderBy('name')->get();
        return Inertia::render('Admin/Products/Create', [
            'mode' => 'create',
            'product' => null,
            'categories' => $categories,
            'submitUrl' => route('admin.products.store'),
        ]);
    }

    public function store(ProductRequest $request)
    {
        $data = $request->validated();

        $images = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('public/products');
                // Save relative path, Storage::url() will resolve to /storage/...
                $images[] = $path;
            }
        }

        $product = Product::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'price' => $data['price'],
            'category_id' => $data['category_id'],
            'status' => $data['status'],
            'images' => $images,
        ]);

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        $categories = Category::select('id', 'name')->orderBy('name')->get();
        return Inertia::render('Admin/Products/ProductForm', [
            'mode' => 'edit',
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => (string)$product->price,
                'category_id' => $product->category_id,
                'status' => $product->status,
                'images' => $product->images,
            ],
            'categories' => $categories,
            'submitUrl' => route('admin.products.update', $product),
        ]);
    }

    public function update(ProductRequest $request, Product $product)
    {
        $data = $request->validated();

        $existing = $data['existing_images'] ?? [];
        $newImages = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('public/products');
                $newImages[] = $path;
            }
        }

        $mergedImages = array_values(array_filter(array_merge($existing, $newImages)));

        $product->update([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'price' => $data['price'],
            'category_id' => $data['category_id'],
            'status' => $data['status'],
            'images' => $mergedImages,
        ]);

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    public function show(Product $product)
    {
        $firstImage = is_array($product->images) && count($product->images) ? $product->images[0] : null;
        return Inertia::render('Admin/Products/ProductShow', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => (string)$product->price,
                'status' => $product->status,
                'category' => $product->category?->name,
                'images' => $product->images,
                'image_url' => $firstImage ? Storage::url($firstImage) : null,
            ],
        ]);
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
    }
}
