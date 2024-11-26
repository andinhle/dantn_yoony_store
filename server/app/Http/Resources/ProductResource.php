<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Lấy giá bán min và max từ các variant
        $minSalePrice = $this->variants->flatMap(function ($variant) {
            return $variant->pluck('price');
        })->min();

        $maxSalePrice = $this->variants->flatMap(function ($variant) {
            return $variant->pluck('price');
        })->max();

        // Lấy giá nhập min và max từ các variant
        $minImportPrice = $this->variants->flatMap(function ($variant) {
            return $variant->inventoryImports->pluck('import_price');
        })->min();

        $maxImportPrice = $this->variants->flatMap(function ($variant) {
            return $variant->inventoryImports->pluck('import_price');
        })->max();

        return [

            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            // Hiển thị price range của giá bán và giá nhập
            'price_range' => $minSalePrice . ' - ' . $maxSalePrice,
            'import_price_range' => $minImportPrice . ' - ' . $maxImportPrice,
            'images' => json_decode($this->images, associative: true),
            'category_id' => $this->category_id,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'is_featured' => $this->is_featured,
            'is_active' => $this->is_active,



            'variants' => VariantResource::collection($this->whenLoaded('variants')),
        ];
    }
}
