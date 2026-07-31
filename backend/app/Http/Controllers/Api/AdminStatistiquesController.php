<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Salle;
use App\Models\Reservation;
use Illuminate\Support\Facades\DB;

class AdminStatistiquesController extends Controller
{
    public function index()
    {
        $totalUtilisateurs = User::count();
        $totalSalles = Salle::count();
        $totalReservations = Reservation::count();

        $occupation = $totalSalles > 0
        ? round(
            Reservation::where('statut', 'acceptee')
                ->distinct('salle_id')
                ->count('salle_id')
            / $totalSalles * 100
        )
        : 0;

        $reservationsParMois = Reservation::selectRaw("
                EXTRACT(MONTH FROM created_at) AS mois,
                COUNT(*) AS total
            ")
            ->groupBy("mois")
            ->orderBy("mois")
            ->get();

        // Comptage des utilisateurs par rôle
        $utilisateursParRole = User::select(
                "role",
                DB::raw("COUNT(*) AS total")
            )
            ->groupBy("role")
            ->get();

        $reservationsParStatut = Reservation::select(
                "statut",
                DB::raw("COUNT(*) AS total")
            )
            ->groupBy("statut")
            ->get();

        $topSalles = Reservation::join(
                "salles",
                "salles.id",
                "=",
                "reservations.salle_id"
            )
            ->select(
                "salles.nom",
                DB::raw("COUNT(*) AS total")
            )
            ->groupBy("salles.id", "salles.nom")
            ->orderByDesc("total")
            ->take(5)
            ->get();

        $reservationsParBatiment = Reservation::join(
                "salles",
                "salles.id",
                "=",
                "reservations.salle_id"
            )
            ->select(
                "salles.batiment",
                DB::raw("COUNT(*) AS total")
            )
            ->groupBy("salles.batiment")
            ->get();

        return response()->json([

            "kpis" => [
                "utilisateurs" => $totalUtilisateurs,
                "salles" => $totalSalles,
                "reservations" => $totalReservations,
                "occupation" => $occupation
            ],

            "reservations_par_mois" => $reservationsParMois,

            "utilisateurs_par_role" => $utilisateursParRole,

            "reservations_par_statut" => $reservationsParStatut,

            "top_salles" => $topSalles,

            "reservations_par_batiment" => $reservationsParBatiment

        ]);
    }
}