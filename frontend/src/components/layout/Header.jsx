import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import NotificationBell from "../notifications/NotificationBell";

import "./Header.css";

export default function Header(){

    const{user,logout}=useAuth();

    const navigate=useNavigate();

    function handleLogout(){

        logout();

        navigate("/");

    }

    return(

        <header className="header">

            <div className="header-left"></div>

            <div className="header-right">

                <NotificationBell/>

                <div className="user-info">

                    <h4>

                        {user?.nom} {user?.prenom}

                    </h4>

                    <span>

                        {user?.role}

                    </span>

                </div>

                <div className="user-avatar">

                    {user?.prenom?.charAt(0)}

                </div>

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