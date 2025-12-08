<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

use Illuminate\Http\Middleware\HandleCors;
use App\Http\Middleware\RoleMiddleware; // <-- tambahkan ini

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {

        // CORS untuk akses dari Next.js
        $middleware->append(HandleCors::class);

        // Registrasi middleware "role"
        $middleware->alias([
            'role' => RoleMiddleware::class, // <-- FIX PENTING
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
