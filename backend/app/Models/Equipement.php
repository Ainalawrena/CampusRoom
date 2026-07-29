<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipement extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
    ];

    /**
     * Relation inverse de Salle::equipements() : un equipement peut
     * appartenir a plusieurs salles. Meme table pivot "equipement_salle"
     * utilisee dans les deux sens.
     */
    public function salles()
    {
        return $this->belongsToMany(Salle::class);
    }
}