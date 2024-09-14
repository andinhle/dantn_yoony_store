<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AttributeValue;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;


class AttributeValueController extends Controller
{
    public function index()
    {
        try {
            $data = AttributeValue::query()->latest('id')->paginate(5);
            return response()->json([
                'message' => 'Danh sách' . request('page', 1),
                'status' => 'success',
                'data' => $data
            ]);
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

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'value' => 'required',
                'attribute_id' => 'required'
            ]);

            // $data = $request->all();

            AttributeValue::query()->create($data);

            return response()->json([
                'message' => 'Thêm mới Attribute value thành công',
                'status' => 'success',
                'data' => $data
            ], Response::HTTP_CREATED);
        } catch (\Throwable $th) {

            Log::error(__CLASS__ . '@' . __FUNCTION__, [
                'line' => $th->getLine(),
                'message' => $th->getMessage()
            ]);

            return response()->json([
                'message' => 'Thêm attribute value thất bại',
                'status' => 'error',

            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(Request  $request, AttributeValue $attributeValue)
    {
        try {
            $idExits = AttributeValue::query()->where('id', $attributeValue->id)->exists();
            if(!$idExits){
                return response()->json([
                    'status' => 'error',
                    'messages' =>  'Không tìm thấy'
                ], Response::HTTP_NOT_FOUND);
            }
            $model = AttributeValue::query()->findOrFail($attributeValue->id);


            $data = $request->all();

            $model->update($data);

            return response()->json([
                'data' => $model,
                'status' => 'success',
                'messages' =>  'Cập nhật attribute thành công'
            ], Response::HTTP_CREATED);
        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [
                'line' => $th->getLine(),
                'message' => $th->getMessage()
            ]);
            return response()->json([
                'messages' => 'Cập nhật attribute thất bại',
                'status' => 'error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy(AttributeValue $attributeValue)
    {
        try {
            $model = AttributeValue::findOrFail($attributeValue->id);
            $model->delete();

            return response()->json([
                'messages' => 'Xóa attribute thành công',
                'status' => 'success'
            ], Response::HTTP_OK);
        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [
                'line' => $th->getLine(),
                'message' => $th->getMessage()
            ]);
            return response()->json([
                'messages' => 'Xóa attribute thất bại',
                'status' => 'error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

}
