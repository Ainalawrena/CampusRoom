<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Salle;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $totalSalles=Salle::count();

        $sallesDisponibles=Salle::where("statut","disponible")->count();

        $sallesMaintenance=Salle::where("statut","maintenance")->count();

        $reservations=Reservation::count();

        $tauxOccupation=$totalSalles>0
            ? round(($reservations/$totalSalles)*100)
            : 0;

        $dernieresSalles=Salle::latest()
            ->take(5)
            ->get([
                "id",
                "nom",
                "capacite",
                "statut"
            ]);

        return response()->json([

            "stats"=>[

                "total_salles"=>$totalSalles,

                "salles_disponibles"=>$sallesDisponibles,

                "salles_maintenance"=>$sallesMaintenance,

                "taux_occupation"=>$tauxOccupation

            ],

            "dernieres_salles"=>$dernieresSalles

        ]);
    }
}