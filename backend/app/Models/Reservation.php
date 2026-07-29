<?php
/**Représente une réservation précise. C'est le "lien" entre un utilisateur et une salle à une date/heure donnée. Il fait :

Il sait à qui il appartient : $reservation->user te donne l'utilisateur qui a fait cette réservation (requête automatique SELECT * FROM users WHERE id = reservation.user_id).
Il sait quelle salle il concerne : $reservation->salle pareil, mais vers la table salles.
Il convertit automatiquement la date : le casts() fait que quand tu lis $reservation->date, tu reçois un vrai objet manipulable (tu peux faire $reservation->date->format('d-m-Y')) plutôt qu'un simple texte brut sorti de la base.
*/
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'salle_id',
        'date',
        'heure_debut',
        'heure_fin',
        'motif',
        'statut',
    ];

    /**
     * Convertit automatiquement la colonne 'date' (texte en base)
     * en objet Carbon (date manipulable en PHP) quand on la lit.
     */
    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }

    /**
     * Relation inverse de User::reservations() :
     * une reservation appartient a un seul utilisateur.
     * Eloquent cherche automatiquement la colonne user_id sur CETTE table.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation inverse de Salle::reservations() :
     * une reservation concerne une seule salle.
     */
    public function salle()
    {
        return $this->belongsTo(Salle::class);
    }
}