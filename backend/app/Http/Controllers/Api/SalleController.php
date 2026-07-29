<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Salle;
use Illuminate\Http\Request;

class SalleController extends Controller
{
    /**
     * GET /api/salles
     * Liste toutes les salles, avec possibilite de filtrer par nom
     * et par capacite minimum (utilise par la barre de recherche du wireframe).
     */
    public function index(Request $request)
    {
        // with('equipements') : charge les equipements de chaque salle
        // EN MEME TEMPS que les salles (une seule requete groupee),
        // au lieu de faire une requete separee par salle (probleme classique
        // dit "N+1" — 1 requete pour les salles + N requetes, une par salle,
        // pour leurs equipements)
        $query = Salle::with('equipements');

        if ($recherche = $request->query('recherche')) {
            $query->where('nom', 'like', "%{$recherche}%");
        }

        if ($capacite = $request->query('capacite')) {
            $query->where('capacite', '>=', (int) $capacite);
        }

        return response()->json($query->get());
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
            'nom' => ['required', 'string', 'max:255'],
            'capacite' => ['required', 'integer', 'min:1'],
            'batiment' => ['nullable', 'string', 'max:255'],
            'statut' => ['nullable', 'in:disponible,maintenance'],
            // equipement_ids : tableau d'ids, ex: [1, 2, 3]
            // 'exists:equipements,id' verifie que CHAQUE id envoye
            // correspond bien a un equipement qui existe reellement
            'equipement_ids' => ['nullable', 'array'],
            'equipement_ids.*' => ['exists:equipements,id'],
        ]);

        $salle = Salle::create($data);

        // sync() remplit la table pivot equipement_salle avec les ids
        // envoyes. On l'appelle a part car "equipement_ids" n'est pas
        // une colonne de la table "salles" — Salle::create() l'ignorerait
        if (! empty($data['equipement_ids'])) {
            $salle->equipements()->sync($data['equipement_ids']);
        }

        return response()->json($salle->load('equipements'), 201);
    }

    /**
     * PUT /api/salles/{salle}
     * Modifie une salle existante (bouton "Modifier" du wireframe admin).
     */
    public function update(Request $request, Salle $salle)
    {
        // 'sometimes' : le champ n'est valide QUE s'il est present dans
        // la requete. Utile pour une modification partielle — pas obligatoire
        // de renvoyer tous les champs a chaque fois
        $data = $request->validate([
            'nom' => ['sometimes', 'string', 'max:255'],
            'capacite' => ['sometimes', 'integer', 'min:1'],
            'batiment' => ['nullable', 'string', 'max:255'],
            'statut' => ['nullable', 'in:disponible,maintenance'],
            'equipement_ids' => ['nullable', 'array'],
            'equipement_ids.*' => ['exists:equipements,id'],
        ]);

        $salle->update($data);

        // sync() ici remplace ENTIEREMENT la liste des equipements
        // par la nouvelle liste envoyee (ajoute les nouveaux, retire
        // ceux qui ne sont plus dans le tableau)
        if (array_key_exists('equipement_ids', $data)) {
            $salle->equipements()->sync($data['equipement_ids'] ?? []);
        }

        return response()->json($salle->load('equipements'));
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
}