<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('api_key')->group(function () {
  Route::post('/login', [AuthController::class, 'login'])->name('login');
  Route::middleware('auth')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile'])->name('profile');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Users
    Route::get('/users', [UserController::class, 'index'])->middleware('can:view list users');
    Route::post('/users', [UserController::class, 'store'])->middleware('can:create user');
    Route::get('/users/{user}', [UserController::class, 'show'])->middleware('can:view user');
    Route::delete ('/users/{user}', [UserController::class, 'destroy'])->middleware('can:delete user');

  });
});
