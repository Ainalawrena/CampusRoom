import { useEffect,useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import { dashboardApi } from "../../api/dashboard";

import {
    FaCalendarCheck,
    FaCheckCircle,
    FaClock,
    FaTimesCircle
} from "react-icons/fa";

import "../enseignant/DashboardEnseignant.css";

export default function DashboardEtudiant(){

    const [dashboard,setDashboard]=useState(null);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{

        async function loadDashboard(){

            try{

                const response=await dashboardApi.etudiant();
                setDashboard(response.data);

            }catch(error){

                console.error(error);

            }finally{

                setLoading(false);

            }

        }

        loadDashboard();

    },[]);

    if(loading){

        return(
            <DashboardLayout>
                <h2>Chargement...</h2>
            </DashboardLayout>
        );

    }

    const stats=dashboard.stats;

    const columns=[
        {key:"salle",label:"Salle"},
        {key:"date",label:"Date"},
        {key:"heure",label:"Horaire"},
        {key:"statut",label:"Statut"}
    ];

    const data=dashboard.dernieres_reservations.map(r=>({

        salle:r.salle.nom,
        date:new Date(r.date).toLocaleDateString(),
        heure:`${r.heure_debut} - ${r.heure_fin}`,
        statut:r.statut

    }));

    return(

        <DashboardLayout>

            <div className="dashboard-title">

                <h1>Tableau de bord</h1>

                <p>
                    Bienvenue sur CampusRoom. Vos réservations seront validées par le service logistique.
                </p>

            </div>

            <div className="cards-grid">

                <Card
                    title="Mes réservations"
                    value={stats.total}
                    icon={<FaCalendarCheck/>}
                />

                <Card
                    title="Acceptées"
                    value={stats.acceptees}
                    icon={<FaCheckCircle/>}
                />

                <Card
                    title="En attente"
                    value={stats.en_attente}
                    icon={<FaClock/>}
                />

                <Card
                    title="Refusées"
                    value={stats.refusees}
                    icon={<FaTimesCircle/>}
                />

            </div>

            <div className="dashboard-section">

                <div className="section-header">

                    <h2>Mes dernières réservations</h2>

                </div>

                <Table
                    columns={columns}
                    data={data}
                />

            </div>

        </DashboardLayout>

    );

}