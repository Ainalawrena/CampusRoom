import api from "./axios";

export const dashboardApi={

    enseignant:()=>api.get("/enseignant/dashboard"),

    etudiant:()=>api.get("/etudiant/dashboard"),

    logistique:()=>api.get("/logistique/dashboard"),

    admin:()=>api.get("/admin/dashboard")

};