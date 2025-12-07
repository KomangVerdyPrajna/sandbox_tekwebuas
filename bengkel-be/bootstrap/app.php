<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

// Tambahkan ini
use Illuminate\Http\Middleware\HandleCors;
use App\Http\Middleware\AdminMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {

        // --- CORS agar fetch Next.js bisa masuk ---
        $middleware->append(HandleCors::class);

        // --- Registrasi Middleware role Admin (wajib untuk role akses) ---
        $middleware->alias([
            'admin' => AdminMiddleware::class, // biar bisa pakai ->middleware('admin:admin,super_admin')
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
