<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
        'price', // <--- WAJIB TAMBAHKAN INI
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
