<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ce qui se passe quand on lance "php artisan migrate"
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            // Cle primaire auto-incrementee (id_utilisateur dans le MCD)
            $table->id();

            // Champs directement issus du MCD
            $table->string('nom');
            $table->string('prenom');

            // unique() : empeche deux comptes avec le meme email
            // au niveau de la base elle-meme, pas juste cote formulaire
            $table->string('email')->unique();

            // Le mot de passe hashe (jamais stocke en clair).
            // Note : le nom de colonne reste "password" (convention interne
            // Laravel/Sanctum), meme si le MCD l'appelle "mot_de_passe"
            $table->string('password');

            // Le role determine l'ecran d'accueil et les droits.
            // default() : si jamais on oublie de le preciser a la creation,
            // on tombe sur "etudiant" plutot que sur une valeur vide (NULL)
            $table->string('role')->default('etudiant');

            // Utilise par Laravel pour la fonctionnalite "se souvenir de moi"
            // (pas dans ton MCD, mais standard Laravel, inoffensif si inutilise)
            $table->rememberToken();

            // Cree automatiquement deux colonnes : created_at et updated_at
            $table->timestamps();
        });
    }

    /**
     * Ce qui se passe si on annule cette migration
     * (php artisan migrate:rollback)
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};