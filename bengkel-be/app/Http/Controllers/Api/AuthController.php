<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\User; // <-- Pastikan ini di-import
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth; // <-- Perlu untuk login jika pakai Auth::attempt

class AuthController extends Controller
{
    // REGISTER
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6'
        ]);

        $user = User::create([ // <-- Menggunakan $user
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'customer' // default role
        ]);

        // Token bisa dibuat saat register jika Anda ingin user langsung login
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registrasi berhasil',
            'user' => $user, // <-- Mengembalikan $user
            'token' => $token // Opsional: Langsung kirim token
        ], 201);
    }

    // LOGIN
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email', // Tambahkan validasi email
            'password' => 'required'
        ]);

        // 1. Cari user di tabel 'users'
        $user = User::where('email', $request->email)->first(); // <-- Menggunakan User

        // 2. Verifikasi user dan password
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Email atau password salah'], 401);
        }

        // 3. Buat token Sanctum
        // Pastikan model User menggunakan trait HasApiTokens
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'token' => $token,
            'user' => $user // <-- Mengembalikan $user
        ]);
    }

    // PROFILE USER LOGIN
    public function profile(Request $request)
    {
        // Akses user yang sedang login melalui Sanctum
        return response()->json($request->user()); // <-- Menggunakan $request->user()
    }
}