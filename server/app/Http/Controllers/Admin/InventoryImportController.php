<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\InventoryImportRequest;
use App\Http\Resources\ProductResource;
use App\Models\InventoryImport;
use App\Models\InventoryStock;
use App\Models\Product;
use App\Models\Variant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryImportController extends Controller
{

    // public function index()
    // {
    //     $imports = InventoryImport::with(['variant.product.category', 'supplier'])
    //         ->orderByDesc('id')
    //         ->paginate(10);

    //     // Map lại dữ liệu để decode
    //     $mappedImports = $imports->getCollection()->map(function ($import) {
    //         return [
    //             'id' => $import->id,
    //             'quantity' => $import->quantity,
    //             'import_price' => $import->import_price,
    //             'variant_id' => $import->variant_id,
    //             'supplier_id' => $import->supplier_id,
    //             'created_at' => $import->created_at,
    //             'updated_at' => $import->updated_at,
    //             'variant' => $import->variant ? [
    //                 'id' => $import->variant->id,
    //                 'price' => $import->variant->price,
    //                 'sale_price' => $import->variant->sale_price,
    //                 'end_sale' => $import->variant->end_sale,
    //                 'image' => $import->variant->image,
    //                 'product_id' => $import->variant->product_id,
    //                 'created_at' => $import->variant->created_at,
    //                 'updated_at' => $import->variant->updated_at,
    //                 'product' => $import->variant->product ? [
    //                     'id' => $import->variant->product->id,
    //                     'name' => $import->variant->product->name,
    //                     'slug' => $import->variant->product->slug,
    //                     'images' => json_decode($import->variant->product->images, true),
    //                     'description' => $import->variant->product->description,
    //                     'category_id' => $import->variant->product->category_id,
    //                     'is_featured' => $import->variant->product->is_featured,
    //                     'is_active' => $import->variant->product->is_active,
    //                     'deleted_at' => $import->variant->product->deleted_at,
    //                     'created_at' => $import->variant->product->created_at,
    //                     'updated_at' => $import->variant->product->updated_at,
    //                     'category' => $import->variant->product->category ? [
    //                         'id' => $import->variant->product->category->id,
    //                         'name' => $import->variant->product->category->name,
    //                         'slug' => $import->variant->product->category->slug,
    //                         'image' => $import->variant->product->category->image,
    //                     ] : null,
    //                 ] : null,
    //             ] : null,
    //             'supplier' => $import->supplier ? [
    //                 'id' => $import->supplier->id,
    //                 'name' => $import->supplier->name,
    //                 'phone' => $import->supplier->phone,
    //                 'email' => $import->supplier->email,
    //                 'address' => $import->supplier->address,
    //                 'created_at' => $import->supplier->created_at,
    //                 'updated_at' => $import->supplier->updated_at,
    //             ] : null,
    //         ];
    //     });

    //     $imports->setCollection($mappedImports);

    //     return response()->json([
    //         'message' => 'Danh sách nhập hàng',
    //         'data' => $imports,
    //     ], 200);
    // }
    public function index()
    {
        $products = Product::with(['category', 'variants.attributeValues.attribute', 'variants.inventoryStock', 'variants.inventoryImports.supplier'])->paginate(5);

        return ProductResource::collection($products);
    }

    public function productsWithInventoryImports()
    {
        $products = Product::with([
            'category',
            'variants.inventoryImports',
            'variants.attributeValues.attribute',
            'variants.inventoryStock'
        ])->get(); // Lấy tất cả để xử lý lọc

        // Lọc chỉ các sản phẩm mà tất cả variants đều có inventoryImports
        $filteredProducts = $products->filter(function ($product) {
            return $product->variants->every(function ($variant) {
                return $variant->inventoryImports->isNotEmpty(); // Tất cả variants có inventoryImports
            });
        });

        return ProductResource::collection($filteredProducts);
    }

    public function getAllProductNoImport(){

    $products = Product::with([
        'category',
        'variants.attributeValues.attribute',
        'variants.inventoryStock',
        'variants.inventoryImports'
    ])->get(); // Lấy tất cả để xử lý lọc

    $filteredProducts = $products->filter(function ($product) {
        return $product->variants->contains(function ($variant) {
            return $variant->inventoryImports->isEmpty(); // Variant chưa có inventoryImports
        });
    });

    return ProductResource::collection($filteredProducts);

    }


    public function import(InventoryImportRequest $request)
    {
        try {
            DB::beginTransaction();

            $imports = [];
            $stocks = [];

            foreach ($request->variants as $variantData) {
                // 1. Cập nhật thông tin variant (giá bán, giá sale, end_sale)
                $variant = Variant::find($variantData['variant_id']);

                if (isset($variantData['price'])) {
                    $variant->price = $variantData['price'];
                }
                if (isset($variantData['sale_price'])) {
                    $variant->sale_price = $variantData['sale_price'];
                }
                if (isset($variantData['end_sale'])) {
                    $variant->end_sale = $variantData['end_sale'];
                }
                $variant->save();

                // 2. Tạo bản ghi nhập hàng
                $import = InventoryImport::create([
                    'quantity' => $variantData['quantity'],
                    'import_price' => $variantData['import_price'],
                    'variant_id' => $variantData['variant_id'],
                    'supplier_id' => $request->supplier_id
                ]);

                // 3. Cập nhật hoặc tạo mới stock
                $stock = InventoryStock::firstOrNew([
                    'variant_id' => $variantData['variant_id']
                ]);

                $stock->quantity = ($stock->quantity ?? 0) + $variantData['quantity'];
                $stock->save();

                $imports[] = $import;
                $stocks[] = $stock;
            }

            DB::commit();

            return response()->json([
                'message' => 'Nhập hàng thành công!',
                'imports' => $imports,
                'stocks' => $stocks
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'error' => 'Có lỗi xảy ra.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function importMultiple(InventoryImportRequest $request)
    {
        $validatedData = $request->validated();

        try {
            DB::beginTransaction();

            $importResults = [];

            foreach ($validatedData as $importData) {
                // 1. Tạo bản ghi nhập hàng
                $import = InventoryImport::create([
                    'quantity' => $importData['quantity'],
                    'import_price' => $importData['import_price'],
                    'variant_id' => $importData['variant_id'],
                    'supplier_id' => $importData['supplier_id']
                ]);

                // 2. Cập nhật hoặc tạo mới stock
                $stock = InventoryStock::firstOrNew([
                    'variant_id' => $importData['variant_id']
                ]);

                $stock->quantity = ($stock->quantity ?? 0) + $importData['quantity'];
                $stock->save();

                $importResults[] = [
                    'import' => $import,
                    'stock' => $stock
                ];
            }

            DB::commit();

            return response()->json([
                'message' => 'Nhập hàng thành công!',
                'imports' => $importResults
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'error' => 'Có lỗi xảy ra.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
