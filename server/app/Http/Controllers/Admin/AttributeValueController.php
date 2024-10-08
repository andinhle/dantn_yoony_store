<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AttributeValue;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;


class AttributeValueController extends Controller
{
    public function index()
    {
        try {
            $data = AttributeValue::with('attribute')
            ->latest('id')
            ->paginate(5);
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
    public function getByAttributeId(string $id): JsonResponse
    {
        try {
            $attributeValues = AttributeValue::where('attribute_id', $id)->get();

            if ($attributeValues->isEmpty()) {
                return response()->json([
                    'message' => 'Không tìm thấy thuộc tính với attribute_id này.',
                ], 404);
            }

            return response()->json([
                'attribute_id' => $id,
                'attribute_values' => $attributeValues,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi truy xuất thuộc tính.',
                'error' => $e->getMessage(),
            ], 500);
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

    public function update(Request $request, AttributeValue $attributeValue)
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


            $idExits = AttributeValue::where('id', $attributeValue->id)->exists();
            if(!$idExits){
                return response()->json([
                    'status' => 'error',
                    'messages' =>  'Vui lòng thử lại'
                ], Response::HTTP_NOT_FOUND);
            }
            $model = AttributeValue::query()->findOrFail($attributeValue->id);

            $model->delete();

            return response()->json([
                'messages' => 'Xóa attribute thành công',
                'status' => $model
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
