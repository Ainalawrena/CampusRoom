<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;

class EnseignantDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user=$request->user();

        $reservations=Reservation::with('salle')
            ->where('user_id',$user->id);

        $stats=[
            'total'=>(clone $reservations)->count(),
            'acceptees'=>(clone $reservations)->where('statut','acceptee')->count(),
            'en_attente'=>(clone $reservations)->where('statut','en_attente')->count(),
            'refusees'=>(clone $reservations)->where('statut','refusee')->count(),
        ];

        $dernieresReservations=(clone $reservations)
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'stats'=>$stats,
            'dernieres_reservations'=>$dernieresReservations
        ]);
    }
}