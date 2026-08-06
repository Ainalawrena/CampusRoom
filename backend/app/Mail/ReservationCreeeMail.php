<?php

namespace App\Mail;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReservationCreeeMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * La réservation qui sera envoyée à la vue Blade.
     * Elle sera accessible dans le template avec :
     * $reservation
     */
    public Reservation $reservation;

    /**
     * Constructeur.
     *
     * Lorsque l'on fera :
     *
     * new ReservationCreeeMail($reservation)
     *
     * Laravel stockera automatiquement cette réservation
     * afin qu'elle soit disponible dans l'e-mail.
     */
    public function __construct(Reservation $reservation)
    {
        $this->reservation = $reservation;
    }

    /**
     * Objet de l'e-mail.
     */
    public function envelope(): Envelope
    {
        return new Envelope(

            subject: "CampusRoom - Demande de réservation enregistrée"

        );
    }

    /**
     * Vue Blade utilisée pour générer le contenu
     * de l'e-mail.
     */
    public function content(): Content
    {
        return new Content(

            view: "emails.reservation_creee"

        );
    }

    /**
     * Aucune pièce jointe.
     */
    public function attachments(): array
    {
        return [];
    }
}