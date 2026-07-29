<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller
{
    /**
     * GET /api/users
     * Liste tous les utilisateurs (ecran "Utilisateurs" du wireframe admin).
     * Reserve a l'administrateur — verifie dans routes/api.php, pas ici.
     */
    public function index()
    {
        return response()->json(User::all());
    }

    /**
     * DELETE /api/users/{user}
     * Supprime un compte utilisateur.
     * cascadeOnDelete() defini sur reservations.user_id dans la migration
     * supprime automatiquement ses reservations liees en meme temps.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(null, 204);
    }
}