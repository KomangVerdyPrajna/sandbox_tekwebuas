<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    // ⬅️ WAJIB: sesuaikan dengan nama tabel di database
    protected $table = 'carts_items';

    protected $fillable = [
        'cart_id',
        'product_id',
        'quantity',
        'price'
    ];

    // ================= RELATIONS =================

    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
