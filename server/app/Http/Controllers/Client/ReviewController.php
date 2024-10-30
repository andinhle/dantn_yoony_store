<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Rate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReviewController extends Controller
{
    public function review(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'product_id' => 'required|exists:products,id',
                'user_id' => 'required|exists:users,id',
                'rating' => 'required|integer|min:1|max:5',
                'content' => 'nullable|string',
            ]);
    
            // Kiểm tra trạng thái đơn hàng
            $orderStatus = DB::table('orders')
                ->where('user_id', $validatedData['user_id'])
               // ->where('product_id', $validatedData['product_id'])
                ->value('status_order');
    
            if ($orderStatus !== 'delivered') {
                return response()->json(['message' => 'Bạn chỉ có thể đánh giá khi đơn hàng đã được giao.'], 403);
            }
    
            // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
            $existingReview = Rate::where('product_id', $validatedData['product_id'])
                ->where('user_id', $validatedData['user_id'])
                ->first();
    
            if ($existingReview) {
                return response()->json(['message' => 'Bạn chỉ có thể đánh giá sản phẩm này một lần.'], 403);
            }
    
            $rating = Rate::create([
                'product_id' => $validatedData['product_id'],
                'user_id' => $validatedData['user_id'],
                'rating' => $validatedData['rating'],
                'content' => $validatedData['content'],
            ]);
    
            return response()->json(['message' => 'Đánh giá đã được lưu thành công.', 'rating' => $rating], 201);
    
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Dữ liệu không hợp lệ.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error saving review: ' . $e->getMessage());
            return response()->json(['message' => 'Đã xảy ra lỗi trong quá trình lưu đánh giá.'], 500);
        }
    }
    

}
