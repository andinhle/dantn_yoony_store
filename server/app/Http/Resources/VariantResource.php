<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VariantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        return [
            'id' => $this->id,
            'price' => $this->price,
            'sale_price' => $this->sale_price,
            'end_sale' => $this->end_sale,
            'quantity' => optional($this->inventoryStock)->quantity,
            'image' => $this->image,
            'attribute_values' => AttributeValueResource::collection($this->whenLoaded('attributeValues')),
            'updated_at'=>$this->updated_at,
            'inventoryImports' => new InventoryImportResource(resource: $this->inventoryImports->first()),            
            'has_inventory_imports' => $this->inventoryImports->isNotEmpty(), 

        ];
    }
}
