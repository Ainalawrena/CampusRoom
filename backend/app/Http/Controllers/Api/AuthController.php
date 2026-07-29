<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * POST /api/register
     * Cree un nouveau compte, puis connecte directement l'utilisateur
     * en lui renvoyant un token (pas besoin de se reconnecter juste apres).
     */
    public function register(Request $request)
    {
        // validate() verifie les donnees ET s'arrete automatiquement
        // avec une erreur 422 si un champ est invalide — pas besoin
        // d'ecrire de if/else pour chaque cas
        $data = $request->validate([
            'nom' => ['required', 'string', 'max:255'],
            'prenom' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'in:etudiant,enseignant,logistique,administrateur'],
        ]);

        // Grace au cast 'password' => 'hashed' dans le modele User,
        // pas besoin d'appeler Hash::make() ici — Laravel le fait tout seul
        $user = User::create($data);

        // Cree un token d'API unique pour cet utilisateur.
        // 'campusroom' est juste un nom donne au token (utile si on veut
        // un jour lister/revoquer les tokens d'un utilisateur precis)
        $token = $user->createToken('campusroom')->plainTextToken;

        // 201 = "Created", le code HTTP standard pour une creation reussie
        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    /**
     * POST /api/login
     * Verifie email + mot de passe, renvoie un token si c'est correct.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        // Hash::check() compare le mot de passe en clair envoye
        // avec le hash stocke en base — jamais de comparaison directe
        // de mots de passe en clair
        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            // ValidationException renvoie automatiquement une reponse 422
            // avec un message d'erreur au bon format pour le frontend
            throw ValidationException::withMessages([
                'email' => ['Ces identifiants ne correspondent a aucun compte.'],
            ]);
        }

        $token = $user->createToken('campusroom')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token]);
    }

    /**
     * POST /api/logout
     * Supprime UNIQUEMENT le token utilise pour cette requete
     * (l'utilisateur reste connecte sur ses autres appareils/onglets)
     */
    public function logout(Request $request)
    {
        // $request->user() : recupere automatiquement l'utilisateur
        // authentifie grace au token envoye dans le header Authorization
        // (fourni par le middleware auth:sanctum, voir routes/api.php)
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Deconnecte.']);
    }

    /**
     * GET /api/me
     * Renvoie les infos de l'utilisateur actuellement connecte.
     * Utilise par React au demarrage de l'app pour savoir "qui est connecte ?"
     * a partir du token stocke en localStorage.
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}