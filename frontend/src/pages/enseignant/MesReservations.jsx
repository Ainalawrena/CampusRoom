// =====================================================
//
// Liste complète des réservations.
//
// Contient :
//
// Tableau
//
// Recherche
//
// Filtres
//
// Pagination
//
// Bouton Annuler
//
// =====================================================
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import { getMyReservations } from "../../api/reservation";
import "./MesReservations.css";

export default function MesReservations() {

    const [reservations,setReservations]=useState([]);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        loadReservations();
    },[]);

    async function loadReservations(){
        try{
            const response=await getMyReservations();
            setReservations(response.data);
        }catch(error){
            console.error(error);
        }finally{
            setLoading(false);
        }
    }

    const total=reservations.length;

    const acceptees=reservations.filter(
        r=>r.statut==="acceptee"
    ).length;

    const attente=reservations.filter(
        r=>r.statut==="en_attente"
    ).length;

    const refusees=reservations.filter(
        r=>r.statut==="refusee"
    ).length;

    const labels={
        acceptee:"Acceptée",
        en_attente:"En attente",
        refusee:"Refusée"
    };

    const columns=[
        {key:"salle",label:"Salle"},
        {key:"date",label:"Date"},
        {key:"heure",label:"Heure"},
        {key:"statut",label:"Statut"}
    ];

    return(
        <DashboardLayout>

            <div className="reservations-page">

                <h1 className="page-title">
                    Mes réservations du mois
                </h1>

                <div className="stats-grid">

                    <div className="stat-card">
                        <h2>{total}</h2>
                        <span>Total réservations</span>
                    </div>

                    <div className="stat-card">
                        <h2>{acceptees}</h2>
                        <span>Réservations acceptées</span>
                    </div>

                    <div className="stat-card">
                        <h2>{attente}</h2>
                        <span>Réservations en attente</span>
                    </div>

                    <div className="stat-card">
                        <h2>{refusees}</h2>
                        <span>Réservations refusées</span>
                    </div>

                </div>

                <div className="table-card">

                    <h2>Demandes récentes</h2>

                    {loading ? (

                        <p>Chargement...</p>

                    ) : (

                        <Table
                            columns={columns}
                            data={reservations}

                            renderCell={(row,col)=>{

                                if(col.key==="salle")
                                    return row.salle.nom;

                                if(col.key==="date")
                                    return new Date(row.date)
                                        .toLocaleDateString("fr-FR");

                                if(col.key==="heure")
                                    return `${row.heure_debut.slice(0,5)} - ${row.heure_fin.slice(0,5)}`;

                                if(col.key==="statut")
                                    return(
                                        <Badge type={row.statut}>
                                            {labels[row.statut]}
                                        </Badge>
                                    );

                                return row[col.key];

                            }}

                        />

                    )}

                </div>

            </div>

        </DashboardLayout>
    );

}