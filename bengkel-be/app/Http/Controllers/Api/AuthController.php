<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Menangani permintaan registrasi pengguna baru. Role otomatis 'customer'.
     */
    public function register(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        // 2. Buat User Baru dengan Role Default 'customer'
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password, 
            'role' => 'customer', 
        ]);

        // 3. Generate Token
        $token = $user->createToken('register-token', ['customer'])->plainTextToken;

        return response()->json([
            'message' => 'Registrasi customer berhasil!',
            'user' => $user->only(['id', 'name', 'email', 'role']),
            'token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    /**
     * Menangani permintaan login dan menghasilkan Bearer Token Sanctum.
     */
    public function login(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // 2. Cari User dan Verifikasi Kredensial
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Kredensial yang diberikan salah.'],
            ]);
        }

        // 3. Hapus Token Lama dan Generate Token Baru
        $user->tokens()->delete();
        $token = $user->createToken('AuthToken', [$user->role])->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil!',
            'user' => $user->only(['id', 'name', 'email', 'role']),
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Mengambil detail pengguna yang sedang login (Membutuhkan Token).
     */
    public function user(Request $request)
    {
        // $request->user() berisi data user karena sudah melalui middleware auth:sanctum
        return response()->json([
            'user' => $request->user()->only(['id', 'name', 'email', 'role']),
        ]);
    }

    /**
     * Menangani permintaan logout (Mencabut token yang sedang digunakan).
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil. Token dicabut.',
        ]);
    }
}