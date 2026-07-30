// =====================================================
//
// Toutes les requêtes concernant
// les réservations.
//
// GET
//
// POST
//
// PUT
//
// DELETE
//
// Rien concernant React.
//
// Seulement Axios.
//
// =====================================================
import api from "./axios";

export function getReservations() {
    return api.get("/reservations");
}

export function createReservation(data) {
    return api.post("/reservations", data);
}

export function updateReservationStatus(id, statut) {
    return api.patch(`/reservations/${id}/statut`, {
        statut,
    });
}

export function getMyReservations() {
    return api.get("/mes-reservations");
}