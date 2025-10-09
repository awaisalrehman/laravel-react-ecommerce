<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of the products
     */
    public function index()
    {
        $products = Product::with('category')->latest()->paginate(10);

        return inertia('Admin/Products/Index', [
            'products' => $products
        ]);
    }

    /**
     * Show the form for creating a new product
     */
    public function create()
    {
        $categories = Category::where('status', true)->get();

        return inertia('Admin/Products/Create', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created product
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
            'gallery' => 'nullable|array',
            'gallery.*' => 'image|max:2048',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        // Generate slug
        $validated['slug'] = Str::slug($validated['name']);

        // Handle main image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        // Handle gallery images upload
        if ($request->hasFile('gallery')) {
            $gallery = [];

            foreach ($request->file('gallery') as $image) {
                $gallery[] = $image->store('products/gallery', 'public');
            }

            $validated['gallery'] = $gallery;
        }

        Product::create($validated);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully');
    }

    /**
     * Show the specified product
     */
    public function show(Product $product)
    {
        $product->load('category');

        return inertia('Admin/Products/Show', [
            'product' => $product
        ]);
    }

    /**
     * Show the form for editing the product
     */
    public function edit(Product $product)
    {
        $categories = Category::where('status', true)->get();

        return inertia('Admin/Products/Edit', [
            'product' => $product,
            'categories' => $categories
        ]);
    }

    /**
     * Update the product
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
            'gallery' => 'nullable|array',
            'gallery.*' => 'image|max:2048',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        // Generate slug if name changed
        if ($validated['name'] !== $product->name) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Handle main image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }

            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        // Handle gallery images upload
        if ($request->hasFile('gallery')) {
            // Delete old gallery images if exist
            if ($product->gallery) {
                foreach ($product->gallery as $image) {
                    Storage::disk('public')->delete($image);
                }
            }

            $gallery = [];

            foreach ($request->file('gallery') as $image) {
                $gallery[] = $image->store('products/gallery', 'public');
            }

            $validated['gallery'] = $gallery;
        }

        $product->update($validated);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully');
    }

    /**
     * Remove the product
     */
    public function destroy(Product $product)
    {
        // Delete main image if exists
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        // Delete gallery images if exist
        if ($product->gallery) {
            foreach ($product->gallery as $image) {
                Storage::disk('public')->delete($image);
            }
        }

        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully');
    }

    /**
     * Get dashboard data
     */
    public function dashboard()
    {
        $totalProducts = Product::count();
        $totalCategories = Category::count();
        $featuredProducts = Product::where('is_featured', true)->count();
        $outOfStockProducts = Product::where('stock', 0)->count();

        $recentProducts = Product::with('category')
            ->latest()
            ->take(5)
            ->get();

        return inertia('Admin/Dashboard', [
            'stats' => [
                'totalProducts' => $totalProducts,
                'totalCategories' => $totalCategories,
                'featuredProducts' => $featuredProducts,
                'outOfStockProducts' => $outOfStockProducts,
            ],
            'recentProducts' => $recentProducts
        ]);
    }
}
