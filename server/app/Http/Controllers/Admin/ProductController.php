<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\AttributeValues;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $products = Product::with('variants.variantAttributeValues.attributeValue.attribute', 'category')->get();

            return response()->json($products);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Đã xảy ra lỗi khi lấy danh sách sản phẩm',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products',
            'images' => 'nullable|array',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'is_good_deal' => 'boolean',
            'variants' => 'required|array',
            'variants.*.price' => 'required|numeric',
            'variants.*.sale_price' => 'nullable|numeric',
            'variants.*.quantity' => 'required|integer',
            'variants.*.attribute_values' => 'required|array',
            'variants.*.attribute_values.*.attribute_id' => 'required|exists:attributes,id',
            'variants.*.attribute_values.*.value' => 'required|string'
        ]);

        $validated['images'] = $request->has('images') ? json_encode($request->images) : null;

        $product = Product::create($validated);

        foreach ($request->variants as $variantData) {
            // Tạo biến thể
            $variant = $product->variants()->create([
                'price' => $variantData['price'],
                'sale_price' => $variantData['sale_price'],
                'quantity' => $variantData['quantity']
            ]);

            foreach ($variantData['attribute_values'] as $attributeValueData) {
                // Kiểm tra và tạo mới thuộc tính giá trị nếu không tồn tại
                $attributeValue = AttributeValues::firstOrCreate([
                    'attribute_id' => $attributeValueData['attribute_id'],
                    'value' => $attributeValueData['value']
                ]);

                // Thêm thuộc tính giá trị vào bảng variant_attribute_value
                $variant->variantAttributeValues()->create([
                    'attribute_value_id' => $attributeValue->id
                ]);
            }
        }
        return response()->json($product->load('variants.variantAttributeValues.attributeValue.attribute'), 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::with('variants.variantAttributeValues.attributeValue.attribute')->findOrFail($id);

        return response()->json($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
{
    $product = Product::findOrFail($id);

    // Xóa tất cả các biến thể của sản phẩm
    foreach ($product->variants as $variant) {
        // Xóa tất cả các giá trị thuộc tính của biến thể
        $variant->variantAttributeValues()->delete();

        // Xóa biến thể
        $variant->delete();
    }

    // Xóa thuộc tính liên quan đến sản phẩm (nếu có liên kết)
    // Ví dụ: nếu bạn có mối liên kết giữa sản phẩm và thuộc tính

    // Xóa sản phẩm
    $product->delete();

    // Trả về phản hồi thành công
    return response()->json(['message' => 'Xóa thành công'], 200);
}


}
