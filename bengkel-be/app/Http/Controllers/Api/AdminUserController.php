<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Gate; 
use Illuminate\Validation\ValidationException;

class AdminUserController extends Controller
{
    /**
     * Mengambil daftar semua pengguna (semua role). 
     * Endpoint ini harus dilindungi hanya untuk pengguna 'super_admin'.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // 1. Pengecekan Otorisasi (Hanya Super Admin yang diizinkan)
        if ($request->user()->role !== 'super_admin') {
            return response()->json([
                'message' => 'Anda tidak memiliki izin (Super Admin) untuk melihat daftar pengguna.'
            ], 403); // 403 Forbidden 🔒
        }
        
        // 2. Ambil Semua User dari Database
        $users = User::all();

        // 3. Kembalikan Respon dengan data yang aman
        return response()->json([
            'message' => 'Daftar semua pengguna berhasil diambil.',
            'total_users' => $users->count(),
            'users' => $users->map(function ($user) {
                // Jangan sertakan data sensitif seperti password/token
                return $user->only(['id', 'name', 'email', 'role', 'created_at']);
            }),
        ]);
    }

    /**
     * Mendaftarkan pengguna baru dengan peran staf (super_admin, admin, atau kasir).
     * Endpoint ini harus dilindungi hanya untuk pengguna 'super_admin'.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function storeStaff(Request $request)
    {
        // 1. Pengecekan Otorisasi (Hanya Super Admin yang diizinkan)
        if ($request->user()->role !== 'super_admin') {
            return response()->json([
                'message' => 'Anda tidak memiliki izin (Super Admin) untuk mendaftarkan staf.'
            ], 403); // 403 Forbidden 🔒
        }
        
        // 2. Validasi Input
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            // Memvalidasi bahwa role yang diinput HANYA diizinkan untuk staf
            'role' => ['required', 'string', 'in:super_admin,admin,kasir'], 
        ]);

        // 3. Buat User Baru
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => $request->role, 
        ]);

        // 4. Generate Token (Opsional, token ini lebih untuk Super Admin yang mendaftarkan)
        $token = $user->createToken('staff-token-' . $request->role, [$request->role])->plainTextToken;

        return response()->json([
            'message' => 'Staf baru (' . $user->role . ') berhasil didaftarkan.',
            'user' => $user->only(['id', 'name', 'email', 'role']),
            'token' => $token,
            'token_type' => 'Bearer',
        ], 201); // 201 Created ✨
    }
}