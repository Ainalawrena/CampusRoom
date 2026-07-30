<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\SalleController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EquipementController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::get('/salles', [SalleController::class, 'index']);
    Route::get('/salles/{salle}', [SalleController::class, 'show']);
    Route::get('/salles/{salle}/disponibilites', [SalleController::class, 'disponibilites']);

    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/mes-reservations', [ReservationController::class, 'mesReservations']);

    Route::get('/equipements', [EquipementController::class, 'index']);
 

    Route::middleware('role:administrateur')->group(function () {
        Route::post('/salles', [SalleController::class, 'store']);
        Route::put('/salles/{salle}', [SalleController::class, 'update']);
        Route::delete('/salles/{salle}', [SalleController::class, 'destroy']);

        // Gestion des utilisateurs : reservee a l'administrateur uniquement
        Route::get('/users', [UserController::class, 'index']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
    });

    Route::middleware('role:logistique,administrateur')->group(function () {
        Route::patch('/reservations/{reservation}/statut', [ReservationController::class, 'updateStatut']);
    });
});