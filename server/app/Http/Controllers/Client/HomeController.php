<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Database\Eloquent\ModelNotFoundException;
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

}
