<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class HomeController extends Controller
{
    public function getOneProductBySlug(string $slug)
    {
        try {
            $product = Product::with('variants.attributeValues')
                ->where('slug', $slug)
                ->firstOrFail();

            return response()->json(new ProductResource($product), 200);
        } catch (ModelNotFoundException $e) {
            return $this->handleNotFound($e);
        } catch (\Throwable $e) {
            Log::error('Lỗi tìm sản phẩm bằng slug: ' . $e->getMessage(), ['slug' => $slug]);
            return response()->json(['error' => 'Đã xảy ra lỗi khi tìm sản phẩm.'], 500);
        }
    }

    private function handleNotFound(ModelNotFoundException $e)
    {
        Log::warning('Sản phẩm không được tìm thấy bởi slug: ' . request()->route('slug'));
        return response()->json(['error' => 'Không tìm thấy sản phẩm.'], 404);
    }

  // Lọc sản phẩm nổi bật
public function getFeaturedProducts(): JsonResponse
{
    try {
        $featuredProducts = Product::with('category', 'variants.attributeValues.attribute')
            ->where('is_featured', true)
            ->limit(10)
            ->get();
        if ($featuredProducts->isEmpty()) {
            return response()->json([
                'message' => 'Không có sản phẩm nổi bật nào.',
            ], 404);
        }

        return response()->json(ProductResource::collection($featuredProducts), 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Có lỗi xảy ra khi truy xuất sản phẩm nổi bật.',
            'error' => $e->getMessage(),
        ], 500);
    }
}

  // Lọc sản phẩm đang sale
public function getGoodDealProducts(): JsonResponse
{
    try {
        $goodDealProducts = Product::with('category', 'variants.attributeValues.attribute')
            ->where('is_good_deal', true)
            ->limit(10)
            ->get();

        if ($goodDealProducts->isEmpty()) {
            return response()->json([
                'message' => 'Không có sản phẩm đang sale nào.',
            ], 404);
        }

        return response()->json(ProductResource::collection($goodDealProducts), 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Có lỗi xảy ra khi truy xuất sản phẩm sale.',
            'error' => $e->getMessage(),
        ], 500);
    }
}

}
