<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReservationCreeeMail;
use App\Mail\ReservationAccepteeMail;
use App\Mail\ReservationRefuseeMail;

class ReservationController extends Controller
{
    /**
     * GET /api/reservations
     *
     * Le contenu renvoye depend du role de celui qui demande :
     * - etudiant/enseignant : voit UNIQUEMENT ses propres reservations
     *   (ecran "Mes reservations" du wireframe)
     * - logistique/administrateur : voit TOUTES les reservations,
     *   avec filtre optionnel par statut et recherche par nom d'utilisateur
     *   (ecran "Gestion des demandes" du wireframe)
     */
    public function index(Request $request)
    {
        $user=$request->user();

        // with(['user', 'salle']) : charge en une seule requete groupee
        // l'utilisateur ET la salle de chaque reservation, evite le
        // probleme N+1 (comme pour equipements() dans SalleController)
        $query=Reservation::with(['user','salle']);

        if($user->hasRole('etudiant','enseignant')){
            // Un etudiant/enseignant ne doit voir QUE ses propres demandes,
            // jamais celles des autres
            $query->where('user_id',$user->id);
        }

        // Filtre optionnel par statut : /api/reservations?statut=en_attente
        // Utile pour les onglets "en attente / confirmee / refusee" du wireframe
        if($statut=$request->query('statut')){
            $query->where('statut',$statut);
        }

        // Recherche optionnelle par nom d'utilisateur (ecran Gestion des
        // demandes cote logistique). whereHas() filtre les reservations
        // en regardant a l'interieur de la relation "user" liee
        if($recherche=$request->query("recherche")){

            $query->where(function($q)use($recherche){

                $q->where("motif","like","%{$recherche}%")
                    ->orWhere("date","like","%{$recherche}%")
                    ->orWhere("heure_debut","like","%{$recherche}%")
                    ->orWhere("heure_fin","like","%{$recherche}%")
                    ->orWhere("statut","like","%{$recherche}%")

                    ->orWhereHas("user",function($user)use($recherche){

                        $user->where("nom","like","%{$recherche}%")
                            ->orWhere("prenom","like","%{$recherche}%");

                    })

                    ->orWhereHas("salle",function($salle)use($recherche){

                        $salle->where("nom","like","%{$recherche}%");

                    });

            });

        }

        // latest() : trie par date de creation, la plus recente en premier
        return response()->json($query->latest()->get());
    }

    /**
     * POST /api/reservations
     * Cree une nouvelle demande de reservation (formulaire "Envoyer la
     * demande" du wireframe, accessible a l'etudiant et l'enseignant).
     */
    public function store(Request $request)
    {
        $data=$request->validate([
            'salle_id'=>['required','exists:salles,id'],
            'date'=>['required','date'],
            'heure_debut'=>['required','date_format:H:i'],
            'heure_fin'=>['required','date_format:H:i','after:heure_debut'],
            'motif'=>['nullable','string','max:255'],
        ]);

        $chevauchement=Reservation::where('salle_id',$data['salle_id'])
            ->whereDate('date',$data['date'])
            ->whereIn('statut',['en_attente','acceptee'])
            ->where(function($query)use($data){

                $query->where('heure_debut','<',$data['heure_fin'])
                    ->where('heure_fin','>',$data['heure_debut']);

            })
            ->exists();

        if($chevauchement){

            return response()->json([
                'message'=>'Cette salle est déjà réservée sur ce créneau.'
            ],409);

        }

        $reservation=Reservation::create([
            ...$data,

            // On force user_id nous-mêmes
            'user_id'=>$request->user()->id,

            // Enseignant : réservation acceptée directement
            // Étudiant : en attente de validation
            'statut'=>$request->user()->hasRole('enseignant')
                ?'acceptee'
                :'en_attente',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Notification des logisticiens
        |--------------------------------------------------------------------------
        */

        $logisticiens=User::where('role','logistique')->get();

        foreach($logisticiens as $logisticien){

            Notification::create([
                'user_id'=>$logisticien->id,
                'titre'=>'Nouvelle réservation',
                'message'=>$request->user()->prenom.' '.$request->user()->nom.' a effectué une réservation.',
                'type'=>'reservation',
                'lien'=>'/logistique/reservations'
            ]);

        }

        /*
        |--------------------------------------------------------------------------
        | Envoi d'un e-mail de confirmation
        |--------------------------------------------------------------------------
        |
        | L'étudiant ou l'enseignant reçoit un e-mail indiquant
        | que sa demande a bien été enregistrée.
        |
        */

        Mail::to($reservation->user->email)
            ->send(
                new ReservationCreeeMail(
                    $reservation->load([
                        'user',
                        'salle'
                    ])
                )
            );
        return response()->json(
            $reservation->load(['user','salle']),
            201
        );
    }

    /**
     * PATCH /api/reservations/{reservation}/statut
     * Accepte ou refuse une demande (boutons "Accepter"/"Refuser" du
     * wireframe cote logistique/administrateur — protection par role
     * geree dans routes/api.php, pas ici).
     */
    public function updateStatut(Request $request,Reservation $reservation)
    {
        $data=$request->validate([
            // in: limite les valeurs possibles a exactement ces deux options.
            // On n'autorise pas de repasser a "en_attente" ici volontairement —
            // seule une creation initiale peut avoir ce statut
            'statut'=>['required','in:acceptee,refusee'],
        ]);

        $reservation->update($data);

        /*
        |--------------------------------------------------------------------------
        | Notification de l'utilisateur
        |--------------------------------------------------------------------------
        */

        Notification::create([
            'user_id'=>$reservation->user_id,
            'titre'=>$reservation->statut==='acceptee'
                ?'Réservation acceptée'
                :'Réservation refusée',
            'message'=>$reservation->statut==='acceptee'
                ?'Votre réservation a été acceptée.'
                :'Votre réservation a été refusée.',
            'type'=>'reservation',
            'lien'=>'/reservations'
        ]);

        /*
        |--------------------------------------------------------------------------
        | Envoi d'un e-mail suivant le nouveau statut
        |--------------------------------------------------------------------------
        |
        | L'utilisateur reçoit automatiquement un e-mail
        | lorsqu'un logisticien accepte ou refuse sa demande.
        |
        */
            
        $reservation->load([
            'user',
            'salle'
        ]);
        
        if($reservation->statut==='acceptee'){
        
            Mail::to($reservation->user->email)
                ->send(
                    new ReservationAccepteeMail($reservation)
                );
            
        }else{
        
            Mail::to($reservation->user->email)
                ->send(
                    new ReservationRefuseeMail($reservation)
                );
            
        }
        return response()->json($reservation->load(['user','salle']));
    }

    public function mesReservations(Request $request)
    {
        return Reservation::with('salle')
            ->where('user_id',$request->user()->id)
            ->latest()
            ->get();
    }
}