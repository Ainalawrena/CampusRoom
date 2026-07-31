import api from "./axios";

export const getDemandes=(recherche="",statut="tous")=>
    api.get("/reservations",{
        params:{
            recherche,
            ...(statut!=="tous"&&{statut})
        }
    });

export const accepterReservation=id=>
    api.patch(`/reservations/${id}/statut`,{
        statut:"acceptee"
    });

export const refuserReservation=id=>
    api.patch(`/reservations/${id}/statut`,{
        statut:"refusee"
    });