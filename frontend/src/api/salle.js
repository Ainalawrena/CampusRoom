// =====================================================
//
// Toutes les requêtes concernant
// les salles.
//
// Liste
//
// Disponibilités
//
// Détails
//
// =====================================================
import axios from "./axios";

export const getRooms = (params = {}) =>
    axios.get("/salles", { params });

export const getRoom = (id) =>
    axios.get(`/salles/${id}`);

export const getDisponibilites = (id, date = null) =>
    axios.get(`/salles/${id}/disponibilites`, {
        params: { date }
    });