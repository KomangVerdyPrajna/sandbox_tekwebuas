<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $table = 'cart_items'; // opsional jika nama tabel benar
    public $timestamps = true; // supaya created_at & updated_at otomatis

    protected $fillable = [
        'product_id',
        'quantity',
    ];

    public function product() {
        return $this->belongsTo(Product::class);
    }
}
