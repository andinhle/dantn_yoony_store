<?php

use App\Http\Controllers\Admin\AttributeController;
use App\Http\Controllers\Admin\AttributeValueController;
use App\Http\Controllers\Client\CartController;
use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\BlogController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Client\HomeController;
use App\Http\Controllers\ProviderController;
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

// Quyền khi đăng nhập
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Admin
    Route::middleware(['dynamic.permission'])->group(function () {
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

        // QL sản phẩm
        Route::get('/product/{slug}', [ProductController::class, 'findBySlug']);
        Route::apiResource('products', ProductController::class);
        Route::patch('product/{id}/is_featured', [ProductController::class, 'updateIsFeatured'])->name('category.updateIsFeatured');
        Route::patch('product/{id}/is_good_deal', [ProductController::class, 'updateIsGoodDeal'])->name('category.updateIsGoodDeal');
        Route::patch('product/{id}/is_active', [ProductController::class, 'updateIsActive'])->name('category.updateIsActive');
        Route::patch('product/restore/{id}', [ProductController::class, 'restore'])->name('product.restore');
        Route::delete('product/hard-delete/{id}', [ProductController::class, 'hardDelete'])->name('product.hardDelete');
    });

    //Client

    // Sản phẩm
    Route::get('home/product/{slug}', [HomeController::class, 'getOneProductBySlug']);
    Route::get('home/products/featured', [HomeController::class, 'getFeaturedProducts']);
    Route::get('home/products/good-deal', [HomeController::class, 'getGoodDealProducts']);
    Route::get('home/product/category/{id}', [HomeController::class, 'getProductsByCategory']);
    
    // Giỏ hàng
    Route::apiResource('cart', CartController::class);
    Route::patch('/cart/{id}/{operation?}', [CartController::class, 'update']);

    //Wishlist
    Route::middleware('auth:sanctum')->get('/list-wishlists', [HomeController::class, 'getWishlists']);
    Route::post('/insert-wishlists', [HomeController::class, 'insertWishlists']);
    Route::delete('/delete-wishlists/{product_id}', [HomeController::class, 'deleteWishlist']);

    //Blog
    Route::get('/list-blogs', [HomeController::class, 'listBlogs'])->name('blogs.listBlogs');
    Route::get('/detailBlog/{slug}', [HomeController::class, 'detailBlog'])->name('blog.detailBlog');
});
