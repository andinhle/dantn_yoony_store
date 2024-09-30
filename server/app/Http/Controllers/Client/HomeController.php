<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class HomeController extends Controller
{
    public function getOneProductBySlug(string $slug)
    {
        try {
            $product = Product::with('category', 'variants.attributeValues')->where('slug', $slug)->firstOrFail();

            $relatedProducts = Product::with('category', 'variants.attributeValues')
                ->where('category_id', $product->category_id)
                ->where('id', '!=', $product->id)
                ->limit(5)
                ->get();

            return response()->json([
                'product' => new ProductResource($product),
                'related_products' => ProductResource::collection($relatedProducts),
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy sản phẩm.'], 404);
        } catch (\Throwable $e) {
            Log::error('Lỗi khi tìm sản phẩm liên quan: ' . $e->getMessage(), ['slug' => $slug]);
            return response()->json(['error' => 'Đã xảy ra lỗi khi tìm các sản phẩm liên quan.'], 500);
        }
    }

    public function getProductsByCategory(int $categoryId)
    {
        try {
            $category = Category::with('product.variants.attributeValues')->findOrFail($categoryId);

            $products = Product::with('category', 'variants.attributeValues')
                ->where('category_id', $categoryId)
                ->paginate(10);

            return response()->json([
                'category' => new CategoryResource($category),
                'products' => ProductResource::collection($products),
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Không tìm thấy danh mục.'], 404);
        } catch (\Throwable $e) {
            Log::error('Lỗi khi lấy sản phẩm theo danh mục: ' . $e->getMessage(), ['category_id' => $categoryId]);
            return response()->json(['error' => 'Đã xảy ra lỗi khi lấy sản phẩm theo danh mục.'], 500);
        }
    }

}
