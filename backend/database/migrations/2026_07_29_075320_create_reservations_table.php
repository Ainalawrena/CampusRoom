<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            // Cle primaire auto-incrementee (id_reservation dans le MCD)
            $table->id();

            // Relation "EFFECTUER" du MCD : 1 utilisateur -> N reservations,
            // 1 reservation -> 1 seul utilisateur.
            // foreignId() cree la colonne user_id ET la contrainte de cle
            // etrangere vers users.id en une seule ligne.
            $table->foreignId('user_id')
                ->constrained()         // -> lie vers la table "users"
                ->cascadeOnDelete();    // -> si l'utilisateur est supprime,
                                         //    ses reservations le sont aussi

            // Relation "CONCERNER" du MCD : 1 reservation -> 1 seule salle,
            // 1 salle -> N reservations.
            $table->foreignId('salle_id')
                ->constrained()         // -> lie vers la table "salles"
                ->cascadeOnDelete();    // -> si la salle est supprimee, les
                                         //    reservations qui la concernent
                                         //    disparaissent aussi

            // Date du jour reserve (ex: 2026-07-14)
            $table->date('date');

            // Heures de debut et de fin du creneau (ex: 08:00 / 10:00)
            $table->time('heure_debut');
            $table->time('heure_fin');

            // Champ ajoute par rapport au MCD de base (valide ensemble) :
            // le texte libre du formulaire "Motif de la reservation"
            // ("ex : Cours de maths"). nullable() car pas toujours rempli.
            $table->string('motif')->nullable();

            // en_attente / acceptee / refusee (colonne "statut" du MCD).
            // default() : une reservation vient de naitre "en_attente",
            // sauf cas particulier gere plus tard dans le controller
            // (ex : l'enseignant n'a pas besoin de validation)
            $table->string('statut')->default('en_attente');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};