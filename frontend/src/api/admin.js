import api from "./axios";

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export const getDashboard = () =>
    api.get("/admin/dashboard");

/*
|--------------------------------------------------------------------------
| Gestion des salles
|--------------------------------------------------------------------------
*/

export const getSalles = (params = {}) =>
    api.get("/salles", { params });

export const createSalle = (data) =>
    api.post("/salles", data);

export const updateSalle = (id, data) =>
    api.put(`/salles/${id}`, data);

export const deleteSalle = (id) =>
    api.delete(`/salles/${id}`);

/*
|--------------------------------------------------------------------------
| Gestion des utilisateurs
|--------------------------------------------------------------------------
*/

export const getUsers = (params = {}) =>
    api.get("/users", { params });

export const createUser = (data) =>
    api.post("/users", data);

export const updateUser = (id, data) =>
    api.put(`/users/${id}`, data);

export const deleteUser = (id) =>
    api.delete(`/users/${id}`);

/*
|--------------------------------------------------------------------------
| Statistiques
|--------------------------------------------------------------------------
*/

export const getStatistiques = () =>
    api.get("/admin/statistiques");