<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserController extends Controller
{
    /** ===========================================
     *  GET: Ambil semua user (super admin only)
     *  =========================================== */
    public function index(Request $request)
    {
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

    /** ===========================================
     *  POST: Tambah Staff
     *  =========================================== */
    public function storeStaff(Request $request)
    {
        if ($request->user()->role !== 'super_admin') {
            return response()->json([
                'message' => 'Anda tidak memiliki izin (Super Admin) untuk mendaftarkan staf.'
            ], 403);
        }

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'string', 'in:super_admin,admin,kasir'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        $token = $user->createToken('staff-token-' . $user->role)->plainTextToken;

        return response()->json([
            'message' => 'Staf baru (' . $user->role . ') berhasil didaftarkan.',
            'user' => $user->only(['id', 'name', 'email', 'role']),
            'token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    /** ===========================================
     *  PUT: Update Staff
     *  =========================================== */
    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'super_admin') {
            return response()->json([
                'message' => 'Anda tidak memiliki izin (Super Admin) untuk mengedit staf.'
            ], 403);
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $id],
            'role' => ['required', 'string', 'in:super_admin,admin,kasir'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->role = $request->role;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'message' => 'User berhasil diperbarui.',
            'user'    => $user->only(['id', 'name', 'email', 'role']),
        ]);
    }

    /** ===========================================
     *  DELETE: Hapus Staff
     *  =========================================== */
    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'super_admin') {
            return response()->json([
                'message' => 'Anda tidak memiliki izin (Super Admin) untuk menghapus staf.'
            ], 403);
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        // Super admin tidak boleh hapus diri sendiri
        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => 'Super Admin tidak boleh menghapus dirinya sendiri.'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'User berhasil dihapus.'
        ]);
    }
}
