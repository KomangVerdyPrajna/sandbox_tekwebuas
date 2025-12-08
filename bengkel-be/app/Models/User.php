<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // <--- BARIS INI WAJIB DITAMBAHKAN!

class User extends Authenticatable
{
    // Pastikan urutan uses tidak menjadi masalah, tapi HasApiTokens harus dideklarasikan.
    use HasApiTokens, HasFactory, Notifiable; 

    protected $fillable = [
        'name',
        'email',
        'password',
        'role' 
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
}