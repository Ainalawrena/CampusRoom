<?php
/**Représente une salle réservable. Il fait deux choses :

Il connaît ses réservations (comme User, dans l'autre sens) :
 $salle->reservations te donne tout l'historique de réservations de cette salle.
Il connaît ses équipements, mais différemment — pas via une simple colonne, 
mais via la table de liaison equipement_salle qu'on a créée. $salle->equipements va chercher, via cette table intermédiaire, la liste des équipements associés. C'est Eloquent qui gère la jointure SQL complexe derrière ce simple appel. */
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salle extends Model
{
    use HasFactory;

    /**
     * Champs autorises via Salle::create([...]) ou $salle->update([...])
     * Correspond exactement aux colonnes de la migration create_salles_table
     */
    protected $fillable = [
        'nom',
        'capacite',
        'batiment',
        'statut',
    ];

    /**
     * Relation : une salle peut avoir plusieurs reservations.
     * Correspond au "1,N" entre SALLE et RESERVATION (relation CONCERNER) dans le MCD.
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    /**
     * Relation many-to-many : une salle peut avoir plusieurs equipements,
     * et un equipement peut appartenir a plusieurs salles.
     * Correspond au "0,N <-> 0,N" (relation POSSEDER) dans le MCD.
     *
     * belongsToMany devine automatiquement le nom de la table pivot
     * ("equipement_salle") a partir des noms des deux modeles lies,
     * dans l'ordre alphabetique (Equipement + Salle) — c'est pour ca
     * qu'on avait nomme la migration exactement comme ca.
     */
    public function equipements()
    {
        return $this->belongsToMany(Equipement::class);
    }
}
