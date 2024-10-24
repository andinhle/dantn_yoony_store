<?php

use App\Http\Controllers\Admin\AttributeController;
use App\Http\Controllers\Admin\AttributeValueController;
use App\Http\Controllers\Client\CartController;
use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\BlogController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\admin\EventController;
use App\Http\Controllers\Admin\ModelController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\QuestionController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\RoleHasModelController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Client\CouponUserController;
use App\Http\Controllers\Client\FilterController;
use App\Http\Controllers\Client\HomeController;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\Client\OderCheckController;
use App\Http\Controllers\Client\OrderController;
use App\Http\Controllers\client\ChatbotController;
use App\Http\Controllers\client\SpinController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Đăng ký đăng nhập
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Quên mật khẩu
Route::post('/auth/password/request-reset', [AuthController::class, 'requestPasswordReset'])->name('password.request');
Route::post('/auth/password/reset', [AuthController::class, 'resetPassword'])->name('password.reset');

// Đăng nhập mạng xã hội
Route::get('/auth/{provider}/redirect', [ProviderController::class, 'redirect']);
Route::get('/auth/{provider}/callback', [ProviderController::class, 'callback']);

// Sản phẩm
Route::get('home/product/{slug}', [HomeController::class, 'getOneProductBySlug']);
Route::get('home/products/featured', [HomeController::class, 'getFeaturedProducts']);
Route::get('home/products/good-deal', [HomeController::class, 'getGoodDealProducts']);
Route::get('home/product/category/{id}', [HomeController::class, 'getProductsByCategory']);

//filter
Route::get('products/filter', [FilterController::class, 'getFilter']);
Route::post('products/filter', [FilterController::class, 'filter']);

//Blog
Route::get('/list-blogs', [HomeController::class, 'listBlogs'])->name('blogs.listBlogs');
Route::get('/detailBlog/{slug}', [HomeController::class, 'detailBlog'])->name('blog.detailBlog');

//Checkoder
Route::get('check-order', [OderCheckController::class, 'checkOrder'])->name('order.check');

// Coupon
Route::get('/coupon-home', [HomeController::class, 'getCouponHome']);

// Chat bot
Route::get('/first-question', [HomeController::class, 'getListFirstQuestion']);
Route::get('/question-by-answer/{id}', [HomeController::class, 'getQuestionByAnswer']);
Route::get('/answer-by-question/{id}', [HomeController::class, 'getAnswerByQuestion']);

// Quyền khi đăng nhập
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Admin
    Route::middleware(['dynamic.permission'])->group(function () {
        //QL user
        // Lấy tất cả thông tin user
        Route::get('/users', [UserController::class, 'index']);
        // Cập nhật role của user
        Route::patch('/users/{id}/role', [UserController::class, 'updateRole']);
        // questions
        Route::apiResource('admin/questions', QuestionController::class);
        Route::apiResource('questions', QuestionController::class);

        // Câu trả lời
        Route::get('questions/{questionId}/answers', [QuestionController::class, 'getAnswers']);
        Route::post('questions/{questionId}/answers', [QuestionController::class, 'storeAnswer']);
        Route::put('answers/{id}', [QuestionController::class, 'updateAnswer']);
        Route::delete('answers/{id}', [QuestionController::class, 'destroyAnswer']);

        // QL danh mục
        Route::apiResource('category', CategoryController::class);
        Route::patch('category/{id}/is-active', [CategoryController::class, 'updateIsActive'])->name('category.updateIsActive');
        Route::post('category/delete-much', [CategoryController::class, 'deleteMuch'])->name('category.deleteMuch');
        Route::patch('category/restore/{id}', [CategoryController::class, 'restore'])->name('category.restore');
        Route::delete('category/hard-delete/{id}', [CategoryController::class, 'hardDelete'])->name('category.hardDelete');

        // QL mã giảm giá
        Route::apiResource('coupon', CouponController::class);
        Route::patch('coupon/{id}/status', [CouponController::class, 'updateStatus'])->name('coupon.updateStatus');
        Route::patch('coupon/{id}/is_featured', [CouponController::class, 'updateIsFeatured'])->name('coupon.updateIsFeatured');

        // QL thuộc tính
        Route::apiResource('attribute', AttributeController::class);
        Route::apiResource('attribute-value', AttributeValueController::class);
        Route::get('/attribute-values/{id}', [AttributeValueController::class, 'getByAttributeId']);

        // QL banner
        Route::apiResource('banners', BannerController::class);
        Route::patch('banners/{id}/is-active', [BannerController::class, 'updateIsActive'])->name('blogs.updateIsActive');

        // QL blog
        Route::apiResource('blogs', BlogController::class);
        Route::patch('blogs/{id}/is-active', [BlogController::class, 'updateIsActive'])->name('blogs.updateIsActive');

        // QL quyền
        Route::apiResource('roles', RoleController::class);

        // Route cho model
        Route::get('models', [ModelController::class, 'index']);       // Lấy danh sách tất cả các model
        Route::post('models', [ModelController::class, 'store']);      // Tạo mới một model
        Route::get('models/{id}', [ModelController::class, 'show']);   // Lấy thông tin chi tiết một model theo ID
        Route::put('models/{id}', [ModelController::class, 'update']); // Cập nhật thông tin model theo ID
        Route::delete('models/{id}', [ModelController::class, 'destroy']); // Xóa một model theo ID
        Route::get('models1', [ModelController::class, 'getModels']); // lấy path của model

        // Route cho gán model vào vai trò
        Route::get('role-assign-models', [RoleHasModelController::class, 'index']);        // Lấy danh sách các role và model đã gán
        Route::post('role-assign-model', [RoleHasModelController::class, 'store']);  // Gán một model vào vai trò
        Route::delete('role-assign-model/{roleId}', [RoleHasModelController::class, 'destroy']); // Gỡ tất cả models khỏi vai trò
        Route::get('all-models-by-role', [RoleHasModelController::class, 'getAllByRole'])->name('roles.get');

        // QL sản phẩm
        Route::get('/product/{slug}', [ProductController::class, 'findBySlug']);
        Route::apiResource('products', ProductController::class);
        Route::patch('product/{id}/is_featured', [ProductController::class, 'updateIsFeatured'])->name('category.updateIsFeatured');
        Route::patch('product/{id}/is_good_deal', [ProductController::class, 'updateIsGoodDeal'])->name('category.updateIsGoodDeal');
        Route::patch('product/{id}/is_active', [ProductController::class, 'updateIsActive'])->name('category.updateIsActive');
        Route::patch('product/restore/{id}', [ProductController::class, 'restore'])->name('product.restore');
        Route::delete('product/hard-delete/{id}', [ProductController::class, 'hardDelete'])->name('product.hardDelete');

        // QL FAQ
        Route::controller(FaqController::class)->prefix('faq/')->group(function (){
            Route::get('list-question', [FaqController::class, 'listQuestions']);
            Route::post('store-question', [FaqController::class, 'storeQuestions']);
            Route::delete('delete-question/{id}', [FaqController::class, 'deleteQuestion']);
            Route::get('list-answer', [FaqController::class, 'listAnswers']);
            Route::post('store-answer', [FaqController::class, 'storeAnswers']);
            Route::delete('delete-answer/{id}', [FaqController::class, 'deleteAnswer']);
        });
      
        //QL Event
        Route::get('/admin/events/coupons', [EventController::class, 'getEventCoupons']);

        Route::post('/admin/events', [EventController::class, 'createEvent']);
        Route::get('/admin/showEvent/{id}', [EventController::class, 'showEvent']);

        Route::put('/admin/updateEvent/{id}', [EventController::class, 'updateEvent']);
        Route::delete('/admin/events/{id}', [EventController::class, 'destroy']);
        //list danh sách các coupon type event
        Route::get('/admin/coupons/events', [EventController::class, 'getAllEventCoupons']);
      
        // Quản ly đơn hàng
        Route::get('admin/orders', [\App\Http\Controllers\Admin\OrderController::class, 'index']);
        Route::get('admin/order-detail/{id}', [\App\Http\Controllers\Admin\OrderController::class, 'orderDetail']);
        Route::patch('admin/order-detail/{id}', [\App\Http\Controllers\Admin\OrderController::class, 'updateOrderDetail']);
        Route::patch('admin/order-cancelation/{id}', [\App\Http\Controllers\Admin\OrderController::class, 'canceledOrder']);
        
    });

    // Giỏ hàng_user
    Route::apiResource('cart', CartController::class);
    Route::patch('/cart/{id}/{operation?}', [CartController::class, 'update']);
    Route::post('cart/delete-much', [CartController::class, 'deleteMuch'])->name('cart.deleteMuch');

    //Wishlist_user
    Route::get('/list-wishlists', [HomeController::class, 'getWishlists']);
    Route::post('/insert-wishlists', [HomeController::class, 'insertWishlists']);
    Route::delete('/delete-wishlists/{product_id}', [HomeController::class, 'deleteWishlist']);

    
    // Order 
    Route::get('/order-detail/{id}', [OrderController::class, 'getOrderDetail'])->name('order.getOrderDetail');
    Route::get('/order', [OrderController::class, 'getOrder'])->name('order.getOrder');
    Route::patch('/order-cancelation/{id}', [OrderController::class, 'canceledOrder']);


    // Order_user
    // Route::get('/order', [OrderController::class, 'getProduct'])->name('order.getProduct');
    Route::post('/order', [OrderController::class, 'store'])->name('order.store');

    //Coupon_user
    Route::apiResource('coupon-user', CouponUserController::class);
    Route::patch('coupon-user/{id}', [CouponUserController::class, 'update']);

    //Counpon_cart
    Route::post('/coupon-cart', [HomeController::class, 'getCouponCart']);

    //Event_user
    Route::post('/spin', [SpinController::class, 'spin']);
    Route::post('/reset-daily-spins', [SpinController::class, 'resetDailySpins']);
    Route::post('/claim-coupon/{eventId}/{couponId}', [CouponUserController::class, 'claimCoupon']);
    Route::get('/event-coupons', [OderCheckController::class, 'getEventCoupons']);
});