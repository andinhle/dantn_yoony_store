<?php

use App\Http\Controllers\Admin\VoucherController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\CategoryController;
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

Route::apiResource('voucher', VoucherController::class);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::apiResource('category', CategoryController::class);
Route::patch('category/{id}/is-active', [CategoryController::class, 'updateIsActive'])->name('category.updateIsActive');


use App\Http\Controllers\Admin\BannerController;
Route::apiResource('banners', BannerController::class);


use App\Http\Controllers\Admin\BlogController;
Route::apiResource('blogs', BlogController::class);



use App\Http\Controllers\Admin\ProductController;
Route::apiResource('products', ProductController::class);