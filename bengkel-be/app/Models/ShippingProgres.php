<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingProgres extends Model
{
    use HasFactory;

    protected $table = 'shipping_progres';

    protected $fillable = [
        'order_id',
        'status',
        'location',
        'progres_time',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
