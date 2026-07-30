import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

import "./Header.css";

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <header className="header">

            {/* Partie gauche (vide pour l'instant) */}
            <div className="header-left"></div>

            {/* Partie droite */}
            <div className="header-right">

                {/* Notifications */}
                <button className="notification-btn">
                    <FaBell />
                </button>

                {/* Informations utilisateur */}
                <div className="user-info">
                    <h4>{user?.nom} {user?.prenom}</h4>
                    <span>{user?.role}</span>
                </div>

                {/* Avatar */}
                <div className="user-avatar">
                    {user?.prenom?.charAt(0)}
                </div>

                {/* Déconnexion */}
                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    Déconnexion
                </button>

            </div>

        </header>
    );
}