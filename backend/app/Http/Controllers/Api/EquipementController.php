<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipement;

class EquipementController extends Controller
{
    public function index()
    {
        return response()->json(
            Equipement::orderBy('nom')->get()
        );
    }
}