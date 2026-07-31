import { accepterReservation,refuserReservation } from "../../api/logistique";
import "./ReservationActions.css";

export default function ReservationActions({reservation,onSuccess}){

    async function update(action){

        try{

            action==="accepter"
                ? await accepterReservation(reservation.id)
                : await refuserReservation(reservation.id);

            onSuccess?.();

        }catch(error){

            console.error(error);

        }

    }

    if(reservation.user.role==="enseignant")
        return <span className="status auto">Auto-validée</span>;

    if(reservation.statut==="acceptee")
        return <span className="status ok">Acceptée</span>;

    if(reservation.statut==="refusee")
        return <span className="status no">Refusée</span>;

    return(

        <div className="reservation-actions">

            <button
                className="accept"
                onClick={()=>update("accepter")}
            >
                ✓ Accepter
            </button>

            <button
                className="reject"
                onClick={()=>update("refuser")}
            >
                ✕ Refuser
            </button>

        </div>

    );

}