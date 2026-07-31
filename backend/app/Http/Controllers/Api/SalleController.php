<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Salle;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Reservation;

class SalleController extends Controller
{
    /**
     * GET /api/salles
     * Liste toutes les salles, avec possibilite de filtrer par nom
     * et par capacite minimum (utilise par la barre de recherche du wireframe).
     */
    public function index(Request $request)
    {
        $query = Salle::with('equipements');

        if ($request->filled('recherche')) {
            $query->where(
                'nom',
                'like',
                '%' . $request->recherche . '%'
            );
        }

        if ($request->filled('capacite')) {
            $query->where(
                'capacite',
                '>=',
                $request->capacite
            );
        }

        if ($request->filled('equipement')) {
            $query->whereHas('equipements', function ($q) use ($request) {
                $q->where('equipements.id', $request->equipement);
            });
        }

        return response()->json(
            $query->orderBy('nom')->get()
        );
    }

    /**
     * GET /api/salles/{salle}
     * Affiche le detail d'une salle precise (ecran "salle-detail" du wireframe).
     *
     * Route Model Binding : Laravel convertit automatiquement l'id
     * dans l'URL (ex: /api/salles/3) en une vraie instance Salle.
     * Si l'id n'existe pas, Laravel renvoie une 404 tout seul,
     * pas besoin de coder cette verification a la main.
     */
    public function show(Salle $salle)
    {
        return response()->json($salle->load('equipements'));
    }

    /**
     * POST /api/salles
     * Cree une nouvelle salle (ecran "Ajout d'une salle" du wireframe,
     * reserve a l'administrateur — verifie au niveau des routes).
     */
    public function store(Request $request)
{
    $data = $request->validate([
        'nom' => ['required','string','max:255'],
        'capacite' => ['required','integer','min:1'],
        'batiment' => ['nullable','string','max:255'],
        'statut' => ['required','in:disponible,maintenance,occupee'],
        'equipements' => ['nullable','array'],
        'equipements.*' => ['exists:equipements,id'],
    ]);

    $salle = Salle::create([
        'nom' => $data['nom'],
        'capacite' => $data['capacite'],
        'batiment' => $data['batiment'] ?? null,
        'statut' => $data['statut'],
    ]);

    $salle->equipements()->sync($data['equipements'] ?? []);

    return response()->json(
        $salle->load('equipements'),
        201
    );
}

    /**
     * PUT /api/salles/{salle}
     * Modifie une salle existante (bouton "Modifier" du wireframe admin).
     */
  public function update(Request $request, Salle $salle)
{
    $data = $request->validate([
        'nom' => ['sometimes','string','max:255'],
        'capacite' => ['sometimes','integer','min:1'],
        'batiment' => ['nullable','string','max:255'],
        'statut' => ['sometimes','in:disponible,maintenance,occupee'],
        'equipements' => ['nullable','array'],
        'equipements.*' => ['exists:equipements,id'],
    ]);

    $salle->update([
        'nom' => $data['nom'] ?? $salle->nom,
        'capacite' => $data['capacite'] ?? $salle->capacite,
        'batiment' => $data['batiment'] ?? $salle->batiment,
        'statut' => $data['statut'] ?? $salle->statut,
    ]);

    if(array_key_exists('equipements',$data)){
        $salle->equipements()->sync($data['equipements']);
    }

    return response()->json(
        $salle->load('equipements')
    );
}

    /**
     * DELETE /api/salles/{salle}
     * Supprime une salle (bouton "Supprimer" du wireframe admin).
     * cascadeOnDelete() defini dans les migrations supprime automatiquement
     * les reservations et les lignes pivot equipement_salle liees.
     */
    public function destroy(Salle $salle)
    {
        $salle->delete();

        // 204 = "No Content" : suppression reussie, rien a renvoyer
        return response()->json(null, 204);
    }

    public function disponibilites(Request $request, $id)
{
    $date = $request->query('date')
        ? Carbon::parse($request->query('date'))
        : Carbon::today();

    $debutSemaine = $date->copy()->startOfWeek(Carbon::MONDAY);
    $finSemaine = $date->copy()->endOfWeek(Carbon::SUNDAY);

    $reservations = Reservation::where('salle_id', $id)
        ->whereIn('statut', ['acceptee', 'en_attente'])
        ->whereBetween('date', [
            $debutSemaine->toDateString(),
            $finSemaine->toDateString()
        ])
        ->get([
            'date',
            'heure_debut',
            'heure_fin',
            'statut'
        ]);

    return response()->json([
        'debut_semaine' => $debutSemaine->toDateString(),
        'fin_semaine' => $finSemaine->toDateString(),
        'reservations' => $reservations
    ]);
}
}