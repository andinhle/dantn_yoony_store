<?php

namespace App\Http\Controllers\Client;

use App\Events\CheckExpiredSalePrices;
use App\Http\Controllers\Controller;
use App\Http\Resources\BlogResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Answer;
use App\Models\Blog;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\CouponUser;
use App\Models\Product;
use App\Models\Question;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class HomeController extends Controller
{

    //get one getOneProductBySlug
    public function getOneProductBySlug(string $slug)
    {
        try {
            event(new CheckExpiredSalePrices());
            $product = Product::with('category', 'variants.attributeValues.attribute', 'variants.inventoryStock')->where('slug', $slug)->firstOrFail();
            $relatedProducts = Product::with('category', 'variants.attributeValues.attribute')
                ->where('category_id', $product->category_id)
                ->where('is_active', true) // Điều kiện kiểm tra sản phẩm phải active
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

    //get wishlists by user
    public function getWishlists()
    {
        if (auth()->check()) {
            $user = auth()->user();

            $wishlists = $user->wishlists()->with('product')->get();

            return response()->json([
                'wishlists' => $wishlists
            ], 200);
        } else {
            return response()->json(['error' => 'Tài khoản chưa đăng nhập.'], 401);
        }
    }
    //insert wishlists by user
    public function insertWishlists(Request $request)
    {
        if (auth()->check()) {
            $user = auth()->user();

            // Kiểm tra xem product_id đã được gửi lên chưa
            $validatedData = $request->validate([
                'product_id' => 'required|exists:products,id',
            ]);

            // Kiểm tra xem sản phẩm đã tồn tại trong wishlist CHƯA
            $exists = $user->wishlists()->where('product_id', $request->product_id)->exists();

            if ($exists) {
                return response()->json(['error' => 'Sản phẩm đã tồn tại trong danh sách yêu thích.'], 400);
            }

            $wishlist = $user->wishlists()->create([
                'product_id' => $request->product_id,
            ]);

            return response()->json([
                'message' => 'Sản phẩm đã được thêm vào danh sách yêu thích.',
                'wishlist' => $wishlist
            ], 201);
        } else {
            return response()->json(['error' => 'Tài khoản chưa đăng nhập.'], 401);
        }
    }



    //delete wishlists by user
    public function deleteWishlist($product_id)
    {
        if (auth()->check()) {
            $user = auth()->user();

            // Kiểm tra xem sản phẩm có trong danh sách yêu thích của người dùng không
            $wishlist = $user->wishlists()->where('product_id', $product_id)->first();

            if (!$wishlist) {
                return response()->json(['error' => 'Sản phẩm không tồn tại trong danh sách yêu thích.'], 404);
            }

            $wishlist->delete();

            return response()->json(['message' => 'Sản phẩm đã được xóa khỏi danh sách yêu thích.'], 200);
        } else {
            return response()->json(['error' => 'Tài khoản chưa đăng nhập.'], 401);
        }
    }


    // getProductsByCategory
    public function getProductsByCategory(int $categoryId)
    {
        try {
            $category = Category::with('product.variants.attributeValues.attribute')->findOrFail($categoryId);

            $products = Product::with('category', 'variants.attributeValues.attribute')
                ->where('category_id', $categoryId)
                ->where('is_active', true) // Điều kiện kiểm tra sản phẩm phải active
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

    // Lọc sản phẩm nổi bật
    public function getFeaturedProducts(): JsonResponse
    {
        try {
            $featuredProducts = Product::with('category', 'variants.attributeValues.attribute')
                ->where('is_featured', true)
                ->where('is_active', true) // Điều kiện kiểm tra sản phẩm phải active
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
                ->where('is_active', true) // Điều kiện kiểm tra sản phẩm phải active
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





    // blog home
    public function listBlogs()
    {
        $blogs = Blog::latest('id')->paginate(10);

        return BlogResource::collection($blogs);
    }
    // end blog home
    // detailBlog
    public function detailBlog($slug)
    {
        $blog = Blog::where('slug', $slug)->firstOrFail();

        $related_blogs = Blog::where('id', '!=', $blog->id)
            ->take(5)
            ->get();

        return response()->json([
            'blog' => new BlogResource($blog),
            'related_blogs' => BlogResource::collection($related_blogs),
        ]);
    }
    // end detailBlog


    //Coupon
    public function getCouponHome()
    {
        try {
            $data = Coupon::query()
            ->where('status', true)
            ->where('usage_limit','>' , 0)
            ->where('end_date', '>', Carbon::now())
            ->get();

            return response()->json([
                'status' => 'success',
                'data' => $data,
            ]);
        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [
                'line' => $th->getLine(),
                'message' => $th->getMessage()
            ]);

            return response()->json([
                'message' => 'Đã có lỗi. Vui lòng thử lại',
                'status' => 'error',

            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

    }
    
    public function getCouponCart(Request $request) 
    {
        try {
            // Lấy user id từ request
            $user = $request->user();
            
            // Lấy danh sách coupon_id đã được user sử dụng
            $usedCouponIds = CouponUser::where('user_id', $user->id)
                ->whereNotNull('used_at')
                ->pluck('coupon_id')
                ->toArray();
    
            $query = Coupon::query()
                ->where('status', true)
                ->where('usage_limit', '>', 0)
                ->where('start_date', '<', Carbon::now())
                ->where('end_date', '>', Carbon::now())
                ->whereNotIn('id', $usedCouponIds);
    
            // Xử lý điều kiện min và max order value
            $query->where(function($q) use ($request) {
                $q->where(function($subQuery) use ($request) {
                    // Trường hợp 1: Không có cả min và max (null)
                    $subQuery->whereNull('min_order_value')
                             ->whereNull('max_order_value');
                })->orWhere(function($subQuery) use ($request) {
                    // Trường hợp 2: Chỉ có min, không có max
                    $subQuery->where('min_order_value', '<=', $request->totalCart)
                             ->whereNull('max_order_value');
                })->orWhere(function($subQuery) use ($request) {
                    // Trường hợp 3: Có min, có max
                    $subQuery->where('min_order_value', '<=', $request->totalCart)
                             ->where('max_order_value', '>=', $request->totalCart);
                })->orWhere(function($subQuery) use ($request) {
                    // Trường hợp 4: Không có min, chỉ có max
                    $subQuery->whereNull('min_order_value')
                             ->where('max_order_value', '>=', $request->totalCart);
                });
            });
    
            // Debug query
            \Log::info($query->toSql());
            \Log::info($query->getBindings());
    
            $data = $query->get();
    
            return response()->json([
                'status' => 'success',
                'data' => $data,
            ]);
    
        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [
                'line' => $th->getLine(),
                'message' => $th->getMessage()
            ]);
    
            return response()->json([
                'message' => 'Đã có lỗi. Vui lòng thử lại',
                'status' => 'error',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // FAQ
    // Lấy ra các câu hỏi đầu tiên
    public function getListFirstQuestion()
    {
        $questions = Question::where('answer_id', null)->get();
        return response()->json($questions);
    }

    // Lấy ra câu hỏi theo câu trả lời
    public function getQuestionByAnswer(string $id)
    {
        $questions = Question::where('answer_id', $id)->get();
        return response()->json($questions);
    }

    // Lấy ra câu trả lời theo câu hỏi
    public function getAnswerByQuestion(string $id)
    {
        $answers = Answer::where('question_id', $id)->get();
        return response()->json($answers);
    }
}
