// =====================================================
//
// Menu de navigation.
//
// Contient :
//
// - Logo CampusRoom
// - Tableau de bord
// - Mes réservations
// - Nouvelle réservation
// - Profil
// - Déconnexion
//
// Aucun contenu métier.
//
// Seulement la navigation.
//
// =====================================================
import { NavLink } from "react-router-dom";
import { FaUniversity, FaSignOutAlt } from "react-icons/fa";

import { useAuth } from "../../hooks/useAuth";
import { navLinks } from "./navLinks";

import "./Sidebar.css";

export default function Sidebar() {
    const { user, logout } = useAuth();

    // Récupère les liens correspondant au rôle
    const links = navLinks[user?.role] || [];

    return (
        <aside className="sidebar">

            {/* Logo */}
            <div className="sidebar-logo">
                <FaUniversity className="logo-icon" />
                <h2>CampusRoom</h2>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">

                {links.map((link) => {

                    const Icon = link.icon;

                    return (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className="sidebar-link"
                        >
                            <Icon />

                            <span>{link.label}</span>
                        </NavLink>
                    );

                })}

            </nav>

            

        </aside>
    );
}