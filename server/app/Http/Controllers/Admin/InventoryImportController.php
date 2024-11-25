<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\InventoryImportRequest;
use App\Models\InventoryImport;
use App\Models\InventoryStock;
use App\Models\Variant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryImportController extends Controller 
{
    public function index()
    {
        $imports = InventoryImport::orderByDesc('id')->paginate(10);
        
        return response()->json([
            'message' => 'Danh sách nhập hàng',
            'data' => $imports
        ]);
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