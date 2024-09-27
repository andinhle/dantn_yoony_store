<?php

use App\Http\Controllers\Admin\AttributeController;
use App\Http\Controllers\Admin\AttributeValueController;
use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\BlogController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\RoleController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('coupon', CouponController::class);
Route::patch('coupon/{id}/status', [CouponController::class, 'updateStatus'])->name('coupon.updateStatus');
Route::patch('coupon/{id}/is_featured', [CouponController::class, 'updateIsFeatured'])->name('coupon.updateIsFeatured');

Route::apiResource('attribute', AttributeController::class);
Route::apiResource('attribute-value', AttributeValueController::class);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
});


Route::post('/auth/password/request-reset', [AuthController::class, 'requestPasswordReset'])->name('password.request');
Route::post('/auth/password/reset', [AuthController::class, 'resetPassword'])->name('password.reset');


//category
Route::apiResource('category', CategoryController::class);
Route::patch('category/{id}/is-active', [CategoryController::class, 'updateIsActive'])->name('category.updateIsActive');
Route::post('category/delete-much', [CategoryController::class, 'deleteMuch'])->name('category.deleteMuch');
Route::patch('category/restore/{id}', [CategoryController::class, 'restore'])->name('category.restore');
Route::delete('category/hard-delete/{id}', [CategoryController::class, 'hardDelete'])->name('category.hardDelete');


Route::apiResource('banners', BannerController::class);
Route::patch('banners/{id}/is-active', [BannerController::class, 'updateIsActive'])->name('blogs.updateIsActive');

Route::apiResource('blogs', BlogController::class);
Route::patch('blogs/{id}/is-active', [BlogController::class, 'updateIsActive'])->name('blogs.updateIsActive');


Route::apiResource('roles', RoleController::class);

Route::get('/product/{slug}', [ProductController::class, 'findBySlug']);

Route::apiResource('products', ProductController::class);

Route::get('/attribute-values/{id}', [AttributeValueController::class, 'getByAttributeId']);



