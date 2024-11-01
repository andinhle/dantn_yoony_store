<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Rate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReviewController extends Controller
{
    public function review(Request $request)
    {
        try {
            // Xác thực dữ liệu đầu vào
            $validatedData = $request->validate([
                'order_id' => 'required|exists:orders,id',
                'review' => 'required|array',
                'review.*.product_id' => 'required|exists:products,id',
                'review.*.rating' => 'required|integer|min:1|max:5',
                'review.*.content' => 'nullable|string',
            ]);

            $userId = auth()->id();

            // Lấy trạng thái đơn hàng và kiểm tra xem đơn hàng có thuộc về người dùng không
            $order = Order::where('id', $validatedData['order_id'])
                ->where('user_id', $userId)
                ->with('items.variant') // Load các sản phẩm trong đơn hàng thông qua variant
                ->first();

            if (!$order) {
                return response()->json(['message' => 'Đơn hàng không tồn tại.'], 404);
            }

            // Kiểm tra trạng thái đơn hàng
            if ($order->status_order !== Order::STATUS_ORDER_DELIVERED) {
                return response()->json(['message' => 'Bạn chỉ có thể đánh giá khi đơn hàng đã được giao.'], 403);
            }

            // Khởi tạo mảng để lưu kết quả đánh giá
            $responses = [];

            // Lặp qua từng đánh giá trong mảng review
            foreach ($validatedData['review'] as $item) {
                // Kiểm tra xem sản phẩm có trong đơn hàng không thông qua variant_id
                $productInOrder = $order->items()->whereHas('variant', function ($query) use ($item) {
                    $query->where('product_id', $item['product_id']);
                })->exists();

                if (!$productInOrder) {
                    return response()->json(['message' => 'Sản phẩm không có trong đơn hàng.'], 403);
                }

                // Kiểm tra xem người dùng đã đánh giá sản phẩm này trong đơn hàng chưa
                $existingReview = Rate::where('product_id', $item['product_id'])
                    ->where('user_id', $userId)
                    ->where('order_id', $validatedData['order_id'])
                    ->first();

                if ($existingReview) {
                    $responses[] = [
                        'product_id' => $item['product_id'],
                        'message' => 'Bạn chỉ có thể đánh giá sản phẩm này một lần.'
                    ];
                    continue; // Bỏ qua nếu đã đánh giá
                }

                // Tạo đánh giá mới
                $rating = Rate::create([
                    'product_id' => $item['product_id'],
                    'user_id' => $userId,
                    'order_id' => $validatedData['order_id'],
                    'rating' => $item['rating'],
                    'content' => $item['content'],
                ]);

                $responses[] = [
                    'product_id' => $item['product_id'],
                    'message' => 'Đánh giá đã được lưu thành công.',
                    'rating' => $rating
                ];
            }

            return response()->json(['responses' => $responses], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Dữ liệu không hợp lệ.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error saving review: ' . $e->getMessage());
            return response()->json(['message' => 'Đã xảy ra lỗi trong quá trình lưu đánh giá.'], 500);
        }
    }


    public function getPendingReviews(Request $request)
    {
        $userId = auth()->id();
        
        if (!$userId) {
            return response()->json(['message' => 'Người dùng chưa đăng nhập.'], 401);
        }
        
        try {
            $orders = Order::where('user_id', $userId)
                ->where('status_order', Order::STATUS_ORDER_DELIVERED)
                ->with(['items.variant.product', 'rates'])
                ->get();
            
            // Giải mã images cho từng sản phẩm trong đơn hàng
            $pendingReviews = $orders->filter(function ($order) {
                foreach ($order->items as $item) {
                    $hasRated = $order->rates->contains('product_id', $item->variant->product_id);
                    
                    if (!$hasRated) {
                        // Kiểm tra và giải mã hình ảnh một cách an toàn
                        if ($item->variant->product->images) {
                            // Nếu đã là mảng thì giữ nguyên, nếu là chuỗi JSON thì giải mã
                            $item->variant->product->images = is_string($item->variant->product->images) 
                                ? json_decode($item->variant->product->images, true) 
                                : $item->variant->product->images;
                        }
                        return true;
                    }
                }
                return false;
            });
            
            return response()->json($pendingReviews);
        } catch (\Exception $e) {
            // Trả về lỗi nếu có ngoại lệ
            return response()->json(['message' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
        }
    }

    public function detailReview(string $code)
    {
        $userId = auth()->id();
    
        if (!$userId) {
            return response()->json(['message' => 'Người dùng chưa đăng nhập.'], 401);
        }
    
        try {
            $order = Order::with(['items.variant.product', 'items.variant.attributeValues.attribute', 'rates', 'items.variant.product.category'])
                ->where('code', $code)
                ->where('user_id', $userId)
                ->first();
    
            if (!$order) {
                return response()->json(['message' => 'Đơn hàng không tồn tại.'], 404);
            }
    
            foreach ($order->items as $item) {
                if (is_string($item->variant->product->images)) {
                    $item->variant->product->images = json_decode($item->variant->product->images, true);
                }
            }
    
            $reviews = [];
            foreach ($order->rates as $rate) {
                $reviews[$rate->product_id] = [
                    'rating' => $rate->rating,
                    'content' => $rate->content,
                ];
            }
    
            $groupedItems = [];
            foreach ($order->items as $item) {
                $productId = $item->variant->product_id;
    
                $review = isset($reviews[$productId]) ? $reviews[$productId] : null;
                if ($review === null) {
                    continue;
                }
    
                if (!isset($groupedItems[$productId])) {
                    $groupedItems[$productId] = [
                        'product' => $item->variant->product,
                        'variant_lists' => [],
                        'review' => $review,
                    ];
                }
    
                // Thêm item vào mảng items của sản phẩm
                $groupedItems[$productId]['variant_lists'][] = [
                    'id' => $item->id,
                    'order_id' => $item->order_id,
                    'variant_id' => $item->variant_id,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'total_price' => $item->total_price,
                    'variant' => $item->variant,
                ];
            }
    
            // Tạo cấu trúc JSON cần thiết
            $response = [
                'order_id' => $order->id,
                'user_id' => $order->user_id,
                'grand_total' => $order->grand_total,
                'final_total' => $order->final_total,
                'payment_method' => $order->payment_method,
                'status_order' => $order->status_order,
                'code' => $order->code,
                'notes' => $order->notes,
                'name' => $order->name,
                'tel' => $order->tel,
                'address' => $order->address,
                'items' => array_values($groupedItems), // Chuyển đổi mảng liên kết thành mảng số
            ];
    
            return response()->json($response, 200);
    
        } catch (\Exception $e) {
            // Trả về lỗi nếu có ngoại lệ
            return response()->json(['message' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
        }
    }
    
    public function getReviewedOrders(Request $request)
    {
        $userId = auth()->id();
    
        if (!$userId) {
            return response()->json(['message' => 'Người dùng chưa đăng nhập.'], 401);
        }
    
        try {
            // Lấy các đơn hàng đã giao và có đánh giá từ người dùng
            $orders = Order::where('user_id', $userId)
                ->where('status_order', Order::STATUS_ORDER_DELIVERED)
                ->with(['items.variant.product', 'rates'])
                ->get();
    
            // Giải mã hình ảnh cho từng sản phẩm trong các đơn hàng đã đánh giá và lọc các đơn hàng đã được đánh giá
            $reviewedOrders = $orders->filter(function ($order) {
                return $order->rates->isNotEmpty(); // Kiểm tra nếu có đánh giá
            })->map(function ($order) {
                foreach ($order->items as $item) {
                    // Chỉ giải mã nếu là chuỗi
                    if (is_string($item->variant->product->images)) {
                        $item->variant->product->images = json_decode($item->variant->product->images, true);
                    }
                }
                return $order;
            });
    
            return response()->json($reviewedOrders);
    
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
        }
    }
    

}
