<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\ProductController; 
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\CashierController;


// ====================
// ROUTE PUBLIC (NO TOKEN)
// ====================
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);


// ====================
// ROUTE DENGAN TOKEN (ROLE CHECK)
// ====================
Route::group(['middleware' => ['auth:sanctum']], function () {

    // 🔹 USER PROFILE & LOGOUT
    Route::get('user', [AuthController::class, 'user']);
    Route::post('logout', [AuthController::class, 'logout']);


    // 🔥 SUPER ADMIN ONLY
    Route::middleware(['admin:super_admin'])->group(function () {
        Route::post('staff/register', [AdminUserController::class, 'storeStaff']);
        Route::get('staff', [AdminUserController::class, 'index']);
    });


    // 🔥 ADMIN & SUPER ADMIN — Manage Products & Category
    Route::middleware(['admin:admin,super_admin'])->group(function () {
        Route::apiResource('products', ProductController::class);

        // 🔥 Tambahkan route category CRUD disini
        Route::apiResource('categories', CategoryController::class);
    });


    // 🔥 ADMIN/KASIR/SUPER ADMIN — Kasir & Booking
    Route::middleware(['admin:kasir,admin,super_admin'])->group(function () {
        Route::apiResource('cashier', CashierController::class);
        Route::apiResource('bookings', BookingController::class);
    });

});
