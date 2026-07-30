<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Salle;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * GET /api/dashboard
     *
     * Retourne les informations nécessaires au tableau de bord
     * selon le rôle de l'utilisateur connecté.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        /*
        |--------------------------------------------------------------------------
        | Base des réservations
        |--------------------------------------------------------------------------
        |
        | Enseignant / Étudiant :
        |     uniquement leurs réservations
        |
        | Logistique / Administrateur :
        |     toutes les réservations
        |
        */

        $reservations = Reservation::with(['salle', 'user']);

        if ($user->hasRole('enseignant', 'etudiant')) {
            $reservations->where('user_id', $user->id);
        }

        /*
        |--------------------------------------------------------------------------
        | Statistiques
        |--------------------------------------------------------------------------
        */

        $stats = [
            'total' => (clone $reservations)->count(),

            'acceptees' => (clone $reservations)
                ->where('statut', 'acceptee')
                ->count(),

            'en_attente' => (clone $reservations)
                ->where('statut', 'en_attente')
                ->count(),

            'refusees' => (clone $reservations)
                ->where('statut', 'refusee')
                ->count(),

            'salles_disponibles' => Salle::where(
                'statut',
                'disponible'
            )->count(),
        ];

        /*
        |--------------------------------------------------------------------------
        | Dernières réservations
        |--------------------------------------------------------------------------
        */

        $dernieresReservations = (clone $reservations)
            ->latest()
            ->take(5)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Réponse
        |--------------------------------------------------------------------------
        */

        return response()->json([

            'stats' => $stats,

            'dernieres_reservations' => $dernieresReservations,

        ]);
    }
}