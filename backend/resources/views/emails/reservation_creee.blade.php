<!DOCTYPE html>
<html lang="fr">

<head>

    <meta charset="UTF-8">

    <title>Confirmation de réservation</title>

</head>

<body
    style="
        margin:0;
        padding:40px;
        background:#f4f6f9;
        font-family:Arial, Helvetica, sans-serif;
    "
>

    <!--
        Carte principale contenant tout l'e-mail.
    -->
    <div
        style="
            max-width:650px;
            margin:auto;
            background:white;
            border-radius:10px;
            overflow:hidden;
            box-shadow:0 2px 8px rgba(0,0,0,.08);
        "
    >

        <!--
            En-tête de l'e-mail.
        -->
        <div
            style="
                background:#52796F;
                color:white;
                padding:25px;
                text-align:center;
            "
        >

            <h1>

                CampusRoom

            </h1>

        </div>

        <!--
            Corps du message.
        -->
        <div
            style="
                padding:35px;
            "
        >

            <h2>

                Bonjour {{ $reservation->user->prenom }},

            </h2>

            <p>

                Votre demande de réservation a bien été enregistrée.

            </p>

            <p>

                Elle sera prochainement examinée par le service logistique.

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

                <strong>Motif :</strong>

                {{ $reservation->motif }}

            </p>

            <p>

                <strong>Statut :</strong>

                En attente de validation

            </p>

        </div>

        <!--
            Pied de page.
        -->
        <div
            style="
                background:#f5f5f5;
                padding:20px;
                text-align:center;
                color:#777;
                font-size:13px;
            "
        >

            Cet e-mail a été envoyé automatiquement par CampusRoom.

            <br><br>

            Merci de ne pas y répondre.

        </div>

    </div>

</body>

</html>