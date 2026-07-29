<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('salles', function (Blueprint $table) {
            // Cle primaire auto-incrementee (id_salle dans le MCD)
            $table->id();

            // Nom affiche partout dans l'appli : "R231", "Grande Salle MISA"...
            $table->string('nom');

            // unsignedInteger : un entier qui ne peut jamais etre negatif.
            // Une capacite de -5 places n'aurait aucun sens, autant l'empecher
            // au niveau base plutot que de compter uniquement sur la validation cote code
            $table->unsignedInteger('capacite');

            // nullable() : certaines salles du wireframe (R231, NAS, R211)
            // n'ont pas de batiment precise, contrairement a la Grande Salle MISA
            // ("Batiment Physique - Etage 1"). Sans nullable(), Laravel refuserait
            // de creer une salle sans batiment.
            $table->string('batiment')->nullable();

            // Deux valeurs possibles cote metier : "disponible" ou "maintenance"
            // (vu dans l'ecran Gestion des salles / Statistique admin).
            // default() : une salle nouvellement creee est disponible par defaut,
            // pas besoin de le preciser a chaque fois
            $table->string('statut')->default('disponible');

            // created_at + updated_at automatiques
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('salles');
    }
};