import {useEffect,useState} from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import {dashboardApi} from "../../api/dashboard";

import{
    FaDoorOpen,
    FaCheckCircle,
    FaTools,
    FaChartPie
}from "react-icons/fa";

import "../enseignant/DashboardEnseignant.css";

export default function DashboardAdmin(){

    const[dashboard,setDashboard]=useState(null);
    const[loading,setLoading]=useState(true);

    useEffect(()=>{

        async function loadDashboard(){

            try{

                const{data}=await dashboardApi.admin();

                setDashboard(data);

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
        {key:"nom",label:"Salle"},
        {key:"statut",label:"Statut"},
        {key:"capacite",label:"Capacité"}
    ];

    return(

        <DashboardLayout>

            <div className="dashboard-title">

                <h1>Tableau de bord</h1>

                <p>Administration générale de CampusRoom.</p>

            </div>

            <div className="cards-grid">

                <Card
                    title="Total salles"
                    value={stats.total_salles}
                    icon={<FaDoorOpen/>}
                />

                <Card
                    title="Disponibles"
                    value={stats.salles_disponibles}
                    icon={<FaCheckCircle/>}
                />

                <Card
                    title="Maintenance"
                    value={stats.salles_maintenance}
                    icon={<FaTools/>}
                />

                <Card
                    title="Taux occupation"
                    value={`${stats.taux_occupation}%`}
                    icon={<FaChartPie/>}
                />

            </div>

            <div className="dashboard-section">

                <div className="section-header">

                    <h2>Dernières salles ajoutées</h2>

                </div>

                <Table
                    columns={columns}
                    data={dashboard.dernieres_salles}
                />

            </div>

        </DashboardLayout>

    );

}