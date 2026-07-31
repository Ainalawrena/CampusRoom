<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Salle;

class LogistiqueDashboardController extends Controller
{
    public function index()
    {
        $reservations=Reservation::with(["user","salle"]);

        return response()->json([

            "stats"=>[
                "en_attente"=>(clone $reservations)->where("statut","en_attente")->count(),
                "acceptees"=>(clone $reservations)->where("statut","acceptee")->count(),
                "refusees"=>(clone $reservations)->where("statut","refusee")->count(),
                "total_salles"=>Salle::count()
            ],

            "dernieres_reservations"=>(clone $reservations)
                ->latest()
                ->take(5)
                ->get()

        ]);
    }
}