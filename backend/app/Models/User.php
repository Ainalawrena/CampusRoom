<?php

/** 
 * User.php

*Représente un utilisateur (peu importe son rôle — étudiant, enseignant, logistique, admin, c'est la même table). Trois choses importantes qu'il fait :

*Il sait s'authentifier : en étendant Authenticatable et en utilisant HasApiTokens, 
*ce fichier donne à chaque utilisateur la capacité de "recevoir" un token d'API après connexion — c'est ce qui permettra plus tard à AuthController::login() de faire $user->createToken(...).
*Il protège les données sensibles : le $hidden fait que si tu renvoies un utilisateur 
*en JSON au frontend (par exemple dans /api/me), le mot de passe hashé ne sera jamais inclus dans la réponse, même par erreur.
*Il connaît ses réservations : la méthode reservations() permet d'écrire $user->reservations n'importe où dans le code pour récupérer automatiquement toutes les réservations de cet utilisateur — Eloquent fait la requête SQL (SELECT * FROM reservations WHERE user_id = ...) tout seul derrière.
*/

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Notification;

class User extends Authenticatable
{
    // HasApiTokens : donne acces aux methodes Sanctum (createToken, etc.)
    //                necessaire pour l'authentification API
    // HasFactory   : permet de generer des faux utilisateurs de test facilement
    // Notifiable   : permet d'envoyer des notifications/emails a cet utilisateur
    //                (pas utilise tout de suite, mais standard Laravel)
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Les champs qu'on autorise a remplir via User::create([...]).
     * Securite : sans cette liste, n'importe quel champ envoye dans une
     * requete pourrait etre ecrit en base (ex: quelqu'un qui glisse
     * "role: administrateur" dans un formulaire d'inscription).
     */
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'password',
        'role',
    ];

    /**
     * Les champs qui ne doivent JAMAIS apparaitre quand on convertit
     * un User en JSON pour l'envoyer au frontend (ex: reponse de /api/me).
     * Sans ca, le mot de passe hashe partirait dans chaque reponse API.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Convertit certains champs automatiquement.
     * 'password' => 'hashed' : quand on fait User::create(['password' => 'texte']),
     * Laravel hash automatiquement le mot de passe avant de l'enregistrer.
     * Plus besoin d'appeler Hash::make() a chaque fois manuellement.
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    /**
     * Relation : un utilisateur peut avoir plusieurs reservations.
     * Correspond au "1,N" entre UTILISATEUR et RESERVATION dans le MCD.
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    /**
     * Petit helper pratique : $user->hasRole('administrateur')
     * ou $user->hasRole('logistique', 'administrateur') pour plusieurs roles.
     * Utilise plus tard dans le middleware de verification des droits.
     */
    public function hasRole(string ...$roles): bool
    {
        return in_array($this->role, $roles, true);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class)
            ->latest();
    }
}