<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    /**
     * Middleware ini mendukung multiple role
     * contoh pemakaian ->middleware("admin:admin,super_admin,kasir")
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        // Cek login
        if (!$request->user()) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        // Jika role cocok maka lolos
        if (in_array($request->user()->role, $roles)) {
            return $next($request);
        }

        return response()->json([
            'message' => 'Unauthorized access'
        ], 403);
    }
}
