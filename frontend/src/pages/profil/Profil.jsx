import { useEffect,useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getMe } from "../../api/auth";
import "./Profil.css";

export default function Profil(){

    const [user,setUser]=useState(null);

    useEffect(()=>{
        loadProfile();
    },[]);

    async function loadProfile(){
        try{
            const response=await getMe();
            setUser(response.data);
        }catch(error){
            console.error(error);
        }
    }

    if(!user){
        return(
            <DashboardLayout>
                Chargement...
            </DashboardLayout>
        );
    }

    return(

        <DashboardLayout>

            <div className="profil-page">

                <div className="profil-card">

                    <div className="avatar">
                        {user.nom.charAt(0).toUpperCase()}
                    </div>

                    <div>

                        <h1>{user.nom}</h1>

                        <p>{user.email}</p>

                    </div>

                </div>

                <div className="infos-card">

                    <h2>Informations personnelles</h2>

                    <div className="infos-grid">

                        <div>
                            <span>Nom</span>
                            <strong>{user.nom}</strong>
                        </div>

                        <div>
                            <span>Email</span>
                            <strong>{user.email}</strong>
                        </div>

                        <div>
                            <span>Rôle</span>
                            <strong>{user.role.nom}</strong>
                        </div>

                        <div>
                            <span>Membre depuis</span>
                            <strong>
                                {new Date(user.created_at)
                                    .toLocaleDateString("fr-FR")}
                            </strong>
                        </div>

                    </div>

                </div>

                <div className="password-card">

                    <h2>Sécurité</h2>

                    <p>
                        Vous pourrez bientôt modifier votre mot de passe
                        directement depuis cette page.
                    </p>

                </div>

            </div>

        </DashboardLayout>

    );

}