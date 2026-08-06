<?php

namespace App\Mail;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReservationRefuseeMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Réservation concernée.
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
     * Sujet du mail.
     */
    public function envelope(): Envelope
    {
        return new Envelope(

            subject: "CampusRoom - Réservation refusée"

        );
    }

    /**
     * Vue Blade utilisée.
     */
    public function content(): Content
    {
        return new Content(

            view: "emails.reservation_refusee"

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