<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FilterController extends Controller
{
    public function filter(Request $request)
    {
        $query = Product::query();

        // Ghi lại các tiêu chí lọc vào log
        Log::info('Lọc sản phẩm theo tiêu chí:', $request->all());

        // Lọc theo tên
        if ($request->has('name')) {
            $query->where('name', 'LIKE', '%' . $request->input('name') . '%');
        }

        // Lọc theo danh mục
        if ($request->has('category_id')) {
            $query->whereIn('category_id', $request->input('category_id'));
        }

        // Lọc theo giá
        if ($request->has('price')) {
            $price = $request->input('price');
            $query->whereHas('variants', function ($q) use ($price) {
                if (isset($price['min'])) {
                    $q->where('price', '>=', $price['min']);
                }
                if (isset($price['max'])) {
                    $q->where('price', '<=', $price['max']);
                }
            });
        }

        // Lọc theo thuộc tính
        if ($request->has('attributes')) {
            foreach ($request->input('attributes') as $attributeName => $values) {
                // Lọc theo từng giá trị thuộc tính
                $query->whereHas('variants.attributeValues', function ($q) use ($values) {
                    $q->whereIn('value', array_column($values, 'value'));
                });
            }
        }
        // Sắp xếp sản phẩm mới nhất
        if ($request->has('newest') && $request->input('newest')) {
            $query->orderBy('created_at', 'desc');
        }

        Log::info('Thông số truy vấn sql:', [$query->toSql(), $query->getBindings()]);

        // Lấy kết quả
        $products = $query->with(['category', 'variants.attributeValues'])->paginate(8);

        // Kiểm tra nếu không có sản phẩm nào
        if ($products->isEmpty()) {
            Log::warning('Không tìm thấy sản phẩm nào theo tiêu chí lọc nhất định.');
        }

        return response()->json($products);
    }

    public function getFilter()
    {
        Log::info('Đang gọi hàm getFilter');
    
        $categories = Category::all(); 
        $attributes = Attribute::with('attributeValues')->get(); 
    
        // Ghi log thông tin các dữ liệu
        Log::info('Thông tin categories:', [$categories]);
        Log::info('Thông tin attributes:', [$attributes]);
    
        return response()->json([
            'categories' => $categories,
            'attributes' => $attributes,
        ]);
    }
    
 
    
}
