<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\SalleController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EquipementController;
use App\Http\Controllers\Api\EnseignantDashboardController;
use App\Http\Controllers\Api\EtudiantDashboardController;
use App\Http\Controllers\Api\LogistiqueDashboardController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AdminStatistiquesController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::middleware('role:enseignant')
        ->get('/enseignant/dashboard',[EnseignantDashboardController::class,'index']);

    Route::middleware('role:etudiant')
        ->get('/etudiant/dashboard',[EtudiantDashboardController::class,'index']);

    Route::middleware('role:logistique')
        ->get('/logistique/dashboard',[LogistiqueDashboardController::class,'index']);

    Route::middleware('role:administrateur')
        ->get('/admin/dashboard',[AdminDashboardController::class,'index']);

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

        // Gestion des utilisateurs
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);

        Route::get('/admin/statistiques', [AdminStatistiquesController::class, 'index']);
    });

    Route::middleware('role:logistique,administrateur')->group(function () {
        Route::patch('/reservations/{reservation}/statut', [ReservationController::class, 'updateStatut']);
    });
});