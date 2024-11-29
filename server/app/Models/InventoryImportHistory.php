<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryImportHistory extends Model
{
    use HasFactory;

    protected $table = 'inventory_import_history';

    protected $fillable = [
        'variant_id',
        'supplier_id',
        'quantity',
        'import_price',
        'price',
        'sale_price',
        'end_sale',
        'image',
        'supplier_name',
        'supplier_phone',
        'supplier_email',
        'supplier_address',
    ];
    public function variant()
    {
        return $this->belongsTo(Variant::class);
    }

    // Quan hệ với bảng suppliers
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
}
