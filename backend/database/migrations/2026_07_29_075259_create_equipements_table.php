<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equipements', function (Blueprint $table) {
            // Cle primaire auto-incrementee (id_equipement dans le MCD)
            $table->id();

            // "Projecteur", "Tableau blanc", "Wifi"...
            // unique() : evite qu'on cree deux fois "Projecteur" par erreur
            // (une faute de frappe genererait "Projecteur" et "projecteur" quand meme,
            // mais ca empeche au moins les doublons exacts)
            $table->string('nom')->unique();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipements');
    }
};