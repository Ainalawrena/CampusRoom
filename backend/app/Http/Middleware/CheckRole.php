<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Middleware qui verifie que l'utilisateur connecte a bien
     * un des roles autorises pour acceder a la route.
     *
     * Usage dans routes/api.php : ->middleware('role:administrateur')
     * ou ->middleware('role:logistique,administrateur') pour plusieurs roles
     *
     * $roles recupere tout ce qui suit les ":" dans 'role:administrateur',
     * separe par des virgules -> ['administrateur']
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // $request->user() : l'utilisateur authentifie via le token
        // (deja verifie par le middleware auth:sanctum AVANT celui-ci)
        // hasRole() : le helper qu'on avait defini dans le modele User
        if (! $request->user() || ! $request->user()->hasRole(...$roles)) {
            // abort(403, ...) : arrete tout de suite la requete et renvoie
            // une erreur "Forbidden" avec le message donne
            abort(403, "Vous n'avez pas les droits pour acceder a cette ressource.");
        }

        // Si la verification passe, on laisse la requete continuer
        // normalement vers le controller
        return $next($request);
    }
}