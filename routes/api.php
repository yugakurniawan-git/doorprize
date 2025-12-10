<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::middleware('api_key')->group(function () {
  Route::post('/login', [AuthController::class, 'login'])->name('login');
  Route::middleware('auth')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile'])->name('profile');
  });
});
