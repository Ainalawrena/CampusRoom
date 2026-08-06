<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Salle;

class AdminDashboardController extends Controller
{
    // Cette méthode est appelée lorsque le frontend demande
    // GET /api/admin/dashboard
    public function index()
    {
        // Compte le nombre total de salles
        // SQL :
        // SELECT COUNT(*) FROM salles;
        $totalSalles=Salle::count();

        // Compte uniquement les salles dont le statut est "disponible"
        // SQL :
        // SELECT COUNT(*) FROM salles
        // WHERE statut='disponible';
        $sallesDisponibles=Salle::where("statut","disponible")->count();

        // Compte uniquement les salles en maintenance
        // SQL :
        // SELECT COUNT(*) FROM salles
        // WHERE statut='maintenance';
        $sallesMaintenance=Salle::where("statut","maintenance")->count();

        // Compte le nombre total de réservations
        // SQL :
        // SELECT COUNT(*) FROM reservations;
        $reservations=Reservation::count();

        // Calcul du taux d'occupation.
        // Si aucune salle n'existe, on évite une division par zéro.
        // Sinon :
        // (nombre de réservations / nombre de salles) × 100
        $tauxOccupation=$totalSalles>0
            ? round(($reservations/$totalSalles)*100)
            : 0;

        // Récupère les 5 dernières salles créées.
        // latest() équivaut à :
        // ORDER BY created_at DESC
        //
        // take(5) équivaut à :
        // LIMIT 5
        //
        // get([...]) indique les colonnes à récupérer.
        // SQL :
        // SELECT id, nom, capacite, statut
        // FROM salles
        // ORDER BY created_at DESC
        // LIMIT 5;
        $dernieresSalles=Salle::latest()
            ->take(5)
            ->get([
                "id",
                "nom",
                "capacite",
                "statut"
            ]);

        // Retourne une réponse JSON au frontend.
        // response()->json() transforme automatiquement le tableau PHP
        // en objet JSON envoyé au navigateur.
        return response()->json([

            // Bloc des statistiques affichées sur le dashboard
            "stats"=>[

                "total_salles"=>$totalSalles,

                "salles_disponibles"=>$sallesDisponibles,

                "salles_maintenance"=>$sallesMaintenance,

                "taux_occupation"=>$tauxOccupation

            ],

            // Liste des 5 dernières salles créées
            "dernieres_salles"=>$dernieresSalles

        ]);
    }
}