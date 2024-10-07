<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Cart;
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
            ->where('user_id', Auth::id())
            ->get();

            foreach ($data as $item) {
                $this->totalAmount += $item['variant']['price'] * $item['quantity'];
                
            }
            

            return response()->json([
                'status' => 'success',
                'data' => $data,
                'totalPrice' => $this->totalAmount
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
            $data = $request->all();
            $data['user_id'] = Auth::id();
            $idExist = Cart::query()
                ->with(['variant.attributeValues.attribute', "user"])
                ->where('variant_id', $request->variant_id)
                ->where('user_id', Auth::id())
                ->first();
    
            if ($idExist) {
                if ($request->quantity > 1) {
                    $idExist->quantity += $request->quantity;
                } else {
                    $idExist->quantity++;
                }
                $idExist->save();
            } else {
                $idExist = Cart::query()->create($data);
            }
    
            // Eager load liên quan sau khi đã lưu
            $idExist->load(['variant.attributeValues.attribute', "user"]);
    
            return response()->json([
                'message' => 'Đã thêm sản phẩm vào giỏ hàng',
                'status' => 'success',
                'data' => $idExist,
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
    

    
    public function update(Request $request, $id, $operation = null)
    {
        try {
        
            $idExist = Cart::query()
            ->with(['variant.attributeValues.attribute', "user"])
            ->find($id);


            if ($idExist) {

                if($request->quantity>1){
                    $idExist->quantity += $request->quantity;
                    $idExist->save();
                }else{
                    if($operation){

                        if ($operation === 'increase') {

                            $idExist->quantity += 1; // Tăng số lượng

                        } elseif ($operation === 'decrease') {

                            if ($idExist->quantity >= 1) {
                                $idExist->quantity -= 1; // Giảm số lượng nếu lớn hơn 1
                            }
                            if ($idExist->quantity === 0) {
                                Cart::where('id', $id)->delete();
                            }
                        }
                        $idExist->save(); 
                    }
                }

                

            } 
    
            $data = Cart::query()
            ->with(['variant.product','variant.attributeValues.attribute'])
            ->where('user_id',Auth::id() )
            ->get();

            foreach ($data as $item) {
                $this->totalAmount += $item['variant']['price'] * $item['quantity'];
                
            }
            

            return response()->json([
                // 'dataCart' => $data,
                'status' => 'success',
                'totalPrice' => $this->totalAmount,
                'idExist' => $idExist

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
            $cartItem = Cart::where('id', $id)->where('user_id', $userId)->first();
            
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