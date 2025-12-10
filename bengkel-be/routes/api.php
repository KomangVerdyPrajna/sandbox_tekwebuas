<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\ProductController; 
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\CashierController;
use App\Http\Controllers\Api\PromotionController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ReviewController;

// ==================================
// 1. PUBLIC ROUTES (No Auth Required)
// ==================================
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Produk Public
Route::get('products', [ProductController::class, 'index']);
Route::get('products/{id}', [ProductController::class, 'show']);

// PROMOTION PUBLIC UNTUK MARKETPLACE USER
Route::get('promotions/public', [PromotionController::class, 'public']);

// *** Public hanya boleh melihat (index & show) ***
Route::apiResource('promotions', PromotionController::class)->only(['index','show']);


// ===========================================
// 2. USER AUTHENTICATED ROUTES
// ===========================================
Route::middleware('auth:sanctum')->group(function () {

    // Profile
    Route::get('auth/profile', [AuthController::class, 'profile']);
    Route::post('auth/logout', [AuthController::class, 'logout']);

    // === CART ===
    Route::get('cart', [CartController::class,'index']);
    Route::post('cart', [CartController::class,'store']);
    Route::put('cart/{id}', [CartController::class,'update']);
    Route::delete('cart/{id}', [CartController::class,'destroy']);

    // === ORDER, REVIEW, BOOKING ===
    Route::apiResource('orders', OrderController::class);
    Route::apiResource('reviews', ReviewController::class)->except(['destroy']);

    Route::apiResource('bookings', BookingController::class)
        ->only(['store','update','destroy','index','show']);
});


// =======================================================
// 3. ADMIN ONLY (CRUD PRODUCT & MANAGEMENT)
// =======================================================
Route::middleware(['auth:sanctum','role:admin,super_admin'])->group(function () {

    // === PRODUCT CRUD ADMIN ===
    Route::apiResource('products', ProductController::class)->except(['index','show']);
    Route::match(['put','post'], 'products/{product}', [ProductController::class,'update']);

    // === CATEGORY/PROMOTION/CASHIER ===
    Route::apiResource('categories', CategoryController::class);

    // PROMOTION CRUD ADMIN ONLY
    Route::apiResource('promotions', PromotionController::class)->except(['index','show']);

    Route::apiResource('cashier', CashierController::class);

    // BOOKING ADMIN PANEL
    Route::get('bookings/manage',[BookingController::class,'indexAdmin']);

    // DELETE REVIEW
    Route::delete('reviews/{review}', [ReviewController::class, 'destroy']);
});


// =======================================================
// 4. STAFF MANAGEMENT (Still Admin/Super Admin)
// =======================================================
Route::middleware(['auth:sanctum','role:admin,super_admin'])->group(function () {
    Route::get('staff', [AdminUserController::class,'index']);
    Route::post('staff/register',[AdminUserController::class,'storeStaff']);
    Route::put('staff/{id}',[AdminUserController::class,'update']);
    Route::delete('staff/{id}',[AdminUserController::class,'destroy']);
});