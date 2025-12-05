<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    public $timestamps = false; // karena pakai create_at & update_at

    protected $table = 'products';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'stock',
        'img_url',
        'category_id',
        'create_at',
        'update_at',
    ];

    protected $dates = ['create_at', 'update_at'];

    // Relasi ke Category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
