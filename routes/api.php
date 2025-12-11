<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
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

    // Roles
    Route::get('/roles', [RoleController::class, 'index'])->middleware('can:view list roles');
    Route::post('/roles', [RoleController::class, 'store'])->middleware('can:create role');
    Route::get('/roles/{role}', [RoleController::class, 'show'])->middleware('can:view role');
    Route::delete ('/roles/{role}', [RoleController::class, 'destroy'])->middleware('can:delete role');

    // Permissions
    Route::get('/permissions', [PermissionController::class, 'index'])->middleware('can:view list permissions');
    Route::post('/permissions', [PermissionController::class, 'store'])->middleware('can:create permission');
    Route::get('/permissions/{permission}', [PermissionController::class, 'show'])->middleware('can:view permission');
    Route::delete ('/permissions/{permission}', [PermissionController::class, 'destroy'])->middleware('can:delete permission');

  });
});
