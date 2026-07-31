import {
    FaHome,
    FaCalendarAlt,
    FaPlusCircle,
    FaUser,
    FaClipboardList,
    FaDoorOpen,
    FaUsers,
    FaChartBar,
} from "react-icons/fa";

export const navLinks = {
    etudiant: [
        {
            label: "Tableau de bord",
            path: "/etudiant/dashboard",
            icon: FaHome,
        },
        {
            label: "Liste des salles",
            path: "/etudiant/listeSalle",
            icon: FaCalendarAlt,
        },
        {
            label: "Mes réservations",
            path: "/etudiant/mes-reservations",
            icon: FaCalendarAlt,
        },
        {
            label: "Profil",
            path: "/profil",
            icon: FaUser,
        },
    ],

    enseignant: [
        {
            label: "Tableau de bord",
            path: "/enseignant/dashboard",
            icon: FaHome,
        },
        {
            label: "Liste des salles",
            path: "/enseignant/listeSalle",
            icon: FaCalendarAlt,
        },
        {
            label: "Mes réservations",
            path: "/enseignant/mes-reservations",
            icon: FaCalendarAlt,
        },
        {
            label: "Profil",
            path: "/profil",
            icon: FaUser,
        },
    ],

    logistique: [
        {
            label: "Tableau de bord",
            path: "/logistique/dashboard",
            icon: FaHome,
        },
        {
            label: "Demandes",
            path: "/logistique/demandes",
            icon: FaClipboardList,
        },
        {
            label: "Profil",
            path: "/profil",
            icon: FaUser,
        },
    ],

    administrateur: [
        {
            label: "Tableau de bord",
            path: "/admin/dashboard",
            icon: FaHome,
        },
        {
            label: "Utilisateurs",
            path: "/admin/utilisateurs",
            icon: FaUsers,
        },
        {
            label: "Salles",
            path: "/admin/salles",
            icon: FaDoorOpen,
        },
        {
            label: "Statistiques",
            path: "/admin/statistiques",
            icon: FaChartBar,
        },
        {
            label: "Profil",
            path: "/profil",
            icon: FaUser,
        },
    ],
};