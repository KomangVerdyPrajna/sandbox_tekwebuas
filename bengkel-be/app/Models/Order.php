<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'chart_items_id',
        'name',
        'no_tlp',
        'address',
        'delivery',
        'payment',
        'subtotal',
        'postage',
        'grandTotal',
        'create_at',
        'update_at'
    ];

    public function chartItem()
    {
        return $this->belongsTo(ChartItem::class, 'chart_items_id');
    }
}
