<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Izinkan Next.js kamu
    'allowed_origins' => [
    'http://localhost:3000',
    'https://sandboxtekwebuas-production.up.railway.app',
    
],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => false,

    'max_age' => 0,

    'supports_credentials' => true,
];
