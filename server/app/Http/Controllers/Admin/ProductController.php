<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\Variant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Lấy danh sách sản phẩm
        $products = Product::with('variants')->paginate(5);
        return ProductResource::collection($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        try {
            $product = Product::create([
                'name' => $request->name,
                'slug' => $request->slug,
                'description' => $request->description,
                'images' => json_encode($request->images), // Chuyển đổi mảng thành chuỗi JSON
                'category_id' => $request->category_id,
                'is_featured' => $request->is_featured ?? false,
                'is_good_deal' => $request->is_good_deal ?? false,
                'is_active' => $request->is_active ?? true,
            ]);

            foreach ($request->variants as $variantData) {
                $variant = Variant::create([
                    'price' => $variantData['price'],
                    'sale_price' => $variantData['sale_price'],
                    'quantity' => $variantData['quantity'],
                    'image' => $variantData['image'],
                    'product_id' => $product->id,
                ]);

                if (isset($variantData['attribute_values'])) {
                    foreach ($variantData['attribute_values'] as $attributeValueId) {
                        $variant->attributeValues()->attach($attributeValueId);
                    }
                }
            }

            return new ProductResource($product->load('variants.attributeValues'));
        } catch (\Exception $e) {
            return response()->json(['message' => 'Thêm Product thất bại', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::with('variants.attributeValues')->findOrFail($id);
        return new ProductResource($product);
    }


    public function update(UpdateProductRequest $request, string $id): JsonResponse
    {
        try {
            $product = Product::findOrFail($id);

            $product->update([
                'name' => $request->name,
                'slug' => $request->slug,
                'description' => $request->description,
                'images' => json_encode($request->images), // Chuyển đổi mảng thành chuỗi JSON
                'category_id' => $request->category_id,
                'is_featured' => $request->is_featured ?? false,
                'is_good_deal' => $request->is_good_deal ?? false,
                'is_active' => $request->is_active ?? true,
            ]);

            $variantIds = [];

            foreach ($request->variants as $variantData) {
                $variant = Variant::updateOrCreate(
                    ['id' => $variantData['id'] ?? null, 'product_id' => $product->id],
                    [
                        'price' => $variantData['price'],
                        'sale_price' => $variantData['sale_price'],
                        'quantity' => $variantData['quantity'],
                        'image' => $variantData['image'],
                    ]
                );

                if (isset($variantData['attribute_values'])) {

                    $variant->attributeValues()->sync($variantData['attribute_values']);
                }

                $variantIds[] = $variant->id;
            }

            $product->variants()->whereNotIn('id', $variantIds)->delete();

            return response()->json(new ProductResource($product->load('variants.attributeValues')), 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Có lỗi xảy ra: ' . $e->getMessage()], 500);
        }
    }





    public function findBySlug(string $slug): JsonResponse
    {
        try {
            $product = Product::with('variants.attributeValues')
                ->where('slug', $slug)
                ->firstOrFail();

            return response()->json(new ProductResource($product), 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Product not found.'], 404);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $product = Product::findOrFail($id);
            $product->delete();
            return response()->json(['message' => 'Product xóa thành công']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Xóa product thất bại', 'error' => $e->getMessage()], 500);
        }
    }
}
