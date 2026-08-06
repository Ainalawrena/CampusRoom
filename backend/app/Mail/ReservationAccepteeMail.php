<?php

namespace App\Mail;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReservationAccepteeMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Réservation concernée.
     * Elle sera disponible dans la vue Blade.
     */
    public Reservation $reservation;

    /**
     * Constructeur.
     */
    public function __construct(Reservation $reservation)
    {
        $this->reservation = $reservation;
    }

    /**
     * Sujet de l'e-mail.
     */
    public function envelope(): Envelope
    {
        return new Envelope(

            subject: "CampusRoom - Réservation acceptée"

        );
    }

    /**
     * Vue utilisée pour générer l'e-mail.
     */
    public function content(): Content
    {
        return new Content(

            view: "emails.reservation_acceptee"

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