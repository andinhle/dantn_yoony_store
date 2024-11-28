<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventoryImportResource extends JsonResource
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
            'import_price' => $this->import_price,
            'quantity' => $this->quantity,
            'supplier' => new SupplierResource($this->whenLoaded('supplier')), 
        ];
    }
}
