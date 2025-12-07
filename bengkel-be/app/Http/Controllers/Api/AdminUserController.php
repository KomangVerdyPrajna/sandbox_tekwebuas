<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Gate; 
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Hash; // ⬅ Tambahan

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        // 1. Pengecekan Otorisasi (Hanya Super Admin)
        if ($request->user()->role !== 'super_admin') {
            return response()->json([
                'message' => 'Anda tidak memiliki izin (Super Admin) untuk melihat daftar pengguna.'
            ], 403);
        }

        $users = User::all();

        return response()->json([
            'message' => 'Daftar semua pengguna berhasil diambil.',
            'total_users' => $users->count(),
            'users' => $users->map(function ($user) {
                return $user->only(['id', 'name', 'email', 'role', 'created_at']);
            }),
        ]);
    }


    public function storeStaff(Request $request)
    {
        // 1. Pengecekan Otorisasi (Hanya Super Admin)
        if ($request->user()->role !== 'super_admin') {
            return response()->json([
                'message' => 'Anda tidak memiliki izin (Super Admin) untuk mendaftarkan staf.'
            ], 403);
        }

        // 2. Validasi Input
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'string', 'in:super_admin,admin,kasir'], 
        ]);

        // 3. Buat User Baru
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // ⬅ penting agar tidak plaintext
            'role' => $request->role,
        ]);

        // 4. Generate Token Staff (opsional)
        $token = $user->createToken('staff-token-' . $request->role, [$request->role])->plainTextToken;

        return response()->json([
            'message' => 'Staf baru (' . $user->role . ') berhasil didaftarkan.',
            'user' => $user->only(['id', 'name', 'email', 'role']),
            'token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }
}
