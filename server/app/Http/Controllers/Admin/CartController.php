<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use App\Models\Variant;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;


class CartController extends Controller
{
    public $totalAmount = 0;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $data = Cart::query()
            ->with(['variant.product','variant.attributeValues.attribute'])
            ->where('user_id', 1
            // Auth::id()
            )
            ->get();

            foreach ($data as $item) {
                $this->totalAmount += $item['variant']['price'] * $item['quantity'];
                
            }
            

            return response()->json([
                // 'message' => '',
                'status' => 'success',
                'data' => $data,
                'tutalPrice' => $this->totalAmount
            ], Response::HTTP_OK);
        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [
                'line' => $th->getLine(),
                'message' => $th->getMessage()
            ]);

            return response()->json([
                'message' => 'Lỗi tải trang',
                'status' => 'error',

            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $userId = Auth::id();

            $data = $request->all();
            // $data['user_id'] = $userId;
            $idExist = Cart::query()
            ->where('variant_id', $request->variant_id)
            // ->where('user_id', Auth::id())
            ->first();

            if ($idExist) {
                $idExist->quantity++;
                $idExist->save();
            } else {
               Cart::query()->create($data);
            }

            // $cart = Cart::query()->create($data);

            return response()->json([
                'message' => 'Đã thêm sản phẩm vào giỏ hàng ',
                'status' => 'success',
            ], Response::HTTP_CREATED);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     

            
        } catch (\Throwable $th) {

            Log::error(__CLASS__ . '@' . __FUNCTION__, [
                'line' => $th->getLine(),
                'message' => $th->getMessage()
            ]);

            return response()->json([
                'message' => 'Đã xảy ra lỗi vui lòng thử lại',
                'status' => 'error',

            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    
    public function update($id)
    {
        try {
        
            $idExist = Cart::query()
            ->find($id);


            if ($idExist) {
                $idExist->quantity++;
                $idExist->save();
            } 
    
            $data = Cart::query()
            ->with(['variant.product','variant.attributeValues.attribute'])
            ->where('user_id', 1
            // Auth::id()
            )
            ->get();

            foreach ($data as $item) {
                $this->totalAmount += $item['variant']['price'] * $item['quantity'];
                
            }
            

            return response()->json([
                'data' => $idExist,
                'status' => 'success',
                'tutalPrice' => $this->totalAmount

            ], Response::HTTP_CREATED);
        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [
                'line' => $th->getLine(),
                'message' => $th->getMessage()
            ]);
            return response()->json([
                'messages' => 'Xảy ra lỗi. Vui lòng thử lại',
                'status' => 'error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {

            $userId = Auth::id(); // Lấy ID của người dùng đang đăng nhập
            $cartItem = Cart::where('id', $id)->where('user_id', 1)->first();
            
            if (!$cartItem) {
                return response()->json(['message' => 'Mặt hàng trong giỏ hàng không được tìm thấy'], 404);
            }

            $cartItem->delete();

            return response()->json([
                'status' => 'success',
                'data' => $cartItem
            ], Response::HTTP_OK);
        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [
                'line' => $th->getLine(),
                'message' => $th->getMessage()
            ]);
            return response()->json([
                'messages' => 'Lỗi',
                'status' => 'error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    
}