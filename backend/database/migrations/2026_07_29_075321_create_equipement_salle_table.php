<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equipement_salle', function (Blueprint $table) {
            // foreignId() cree une colonne salle_id de type entier,
            // ET une contrainte de cle etrangere vers salles.id en meme temps
            // (equivalent au SQL : salle_id BIGINT REFERENCES salles(id))
            $table->foreignId('salle_id')
                ->constrained()          // -> cree la contrainte vers la table "salles"
                ->cascadeOnDelete();     // -> si une salle est supprimee, ses lignes
                                          //    ici disparaissent automatiquement

            // Meme logique pour equipement_id, vers la table "equipements"
            $table->foreignId('equipement_id')
                ->constrained()
                ->cascadeOnDelete();

            // Cle primaire composite : la PAIRE (salle_id, equipement_id)
            // sert de cle primaire, au lieu d'un id() classique.
            // Consequence directe : impossible d'associer deux fois le meme
            // equipement a la meme salle (la base refuserait le doublon)
            $table->primary(['salle_id', 'equipement_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipement_salle');
    }
};