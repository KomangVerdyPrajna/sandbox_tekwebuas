<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'items',
        'name',
        'no_tlp',
        'address',
        'delivery',
        'payment',
        'total',
        'status'
    ];

    // <-- WAJIB ADA!
    protected $casts = [
        'items' => 'array'   // menyimpan & mengambil otomatis sebagai JSON
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
