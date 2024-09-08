<?php

namespace App\Http\Requests\Coupon;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

class StoreCouponRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'code' => 'required|max:255|unique:coupons', 
            'discount' => 'required',
            'discount_type' => 'required',
            'usage_limit' => 'required',
            'start_date' => 'date|date_format:Y-m-d',
            'end_date' => 'date|date_format:Y-m-d|after_or_equal:start_date',
            'status' => [Rule::in([0, 1])],
            'is_featured' => [Rule::in([0, 1])],
            'min_order_value' => 'required|min:0|numeric',
            'max_order_value'   => 'required|numeric|gt:min_order_value'
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'Yêu cầu nhập', 
            'code.max' => 'Không nhập quá 255 ký tự', 
            'code.unique' => 'Mã này đã tồn tại', 
            'discount.required' => 'Yêu cầu nhập',
            'discount_type.required' => 'Yêu cầu nhập',
            'usage_limit.required' => 'Yêu cầu nhập',
            'min_order_value.required' => 'Yêu cầu nhập',
            'min_order_value.min' => 'Giá trị phải là số ',
            'min_order_value.numeric' => 'Vui lòng nhập số',
            'max_order_value.required' => 'Yêu cầu nhập',
            'max_order_value.numeric' => 'Vui lòng nhập số',
            'max_order_value.gt:min_order_value' => 'Giá trị phải lớn hơn giá trị đơn hàng thấp nhất'
            // 'status'.[Rule::in([0, 1])],
            // 'is_featured'.[Rule::in([0, 1])],
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        $errors = $validator->errors();

        $response = response()->json([
            'errors' => $errors->messages()
        ], Response::HTTP_BAD_REQUEST);

        throw new HttpResponseException($response);
    }
}