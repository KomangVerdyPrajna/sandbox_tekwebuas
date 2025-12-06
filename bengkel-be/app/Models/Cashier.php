<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cashier extends Model
{
    use HasFactory;
    
    // Memberi tahu Laravel bahwa nama tabel adalah 'cashier' (bukan 'cashiers')
    protected $table = 'cashier';

    // Kolom yang dapat diisi secara massal
    protected $fillable = [
        'product_id',
        'booking_id',
        'payment_method',
        'total',
        'transaction_date',
    ];
    
    // Relasi (Opsional, tapi disarankan)
    
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}