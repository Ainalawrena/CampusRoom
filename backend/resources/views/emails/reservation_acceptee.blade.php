<!DOCTYPE html>
<html lang="fr">

<head>

    <meta charset="UTF-8">

    <title>Réservation acceptée</title>

</head>

<body style="margin:0;padding:40px;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">

<div style="max-width:650px;margin:auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">

    <!-- En-tête -->
    <div style="background:#2E7D32;color:white;padding:25px;text-align:center;">

        <h1>

            CampusRoom

        </h1>

    </div>

    <!-- Contenu -->
    <div style="padding:35px;">

        <h2>

            Bonjour {{ $reservation->user->prenom }},

        </h2>

        <p>

            Nous avons le plaisir de vous informer que votre demande de réservation a été <strong>acceptée</strong>.

        </p>

        <hr>

        <h3>

            Détails de la réservation

        </h3>

        <p>

            <strong>Salle :</strong>

            {{ $reservation->salle->nom }}

        </p>

        <p>

            <strong>Bâtiment :</strong>

            {{ $reservation->salle->batiment }}

        </p>

        <p>

            <strong>Date :</strong>

            {{ \Carbon\Carbon::parse($reservation->date)->format('d/m/Y') }}

        </p>

        <p>

            <strong>Horaire :</strong>

            {{ substr($reservation->heure_debut,0,5) }}

            -

            {{ substr($reservation->heure_fin,0,5) }}
        </p>
        <p>
            <strong>Statut :</strong>
            Acceptée
        </p>
    </div>
    <!-- Pied -->
    <div style="background:#f5f5f5;padding:20px;text-align:center;color:#777;font-size:13px;">
        Merci d'utiliser CampusRoom.
    </div>
</div>
</body>
</html>