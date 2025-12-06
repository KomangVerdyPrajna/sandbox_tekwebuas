<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\ProductController; 
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\CashierController;
// Import semua controller API Anda yang lain

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Semua route di file ini otomatis diawali dengan prefix '/api'.
|
*/

// --- 1. ROUTE PUBLIK (Tidak Perlu Token) ---
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);


// --- 2. ROUTE TERPROTEKSI (Membutuhkan Token Bearer: auth:sanctum) ---
Route::group(['middleware' => ['auth:sanctum']], function () {
    
    // Auth & User Management
    Route::get('user', [AuthController::class, 'user']);
    Route::post('logout', [AuthController::class, 'logout']);
    
    // Admin Management (Perlu pengecekan role 'super_admin' di dalam controller)
    Route::post('staff/register', [AdminUserController::class, 'storeStaff']);
    Route::get('staff', [AdminUserController::class, 'index']);
    
    // Resourceful Routes
    Route::apiResource('products', ProductController::class);
    // Tambahkan resource lainnya di sini:
    Route::apiResource('categories', CategoryController::class);
    // Route::apiResource('orders', Api\OrderController::class);
    Route::apiResource('cashier',  CashierController::class);
    Route::apiResource('bookings', BookingController::class);
});