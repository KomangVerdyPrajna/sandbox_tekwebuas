<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',          // Foreign key ke User
        'jenis_kendaraan',
        'nama_kendaraan',
        'jenis_service',
        'booking_date',
        'no_wa',            // <-- DIPERTAHANKAN
        'notes',
        'status',
    ];

    /**
     * Relasi: Booking dimiliki oleh User (Pelanggan).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi: Booking merujuk ke Service.
     */
    public function service()
    {
        return $this->belongsTo(Service::class, 'services_id');
    }
}