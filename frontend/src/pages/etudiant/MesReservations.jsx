import { useEffect,useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import { getMyReservations } from "../../api/reservation";
import "./MesReservations.css";

export default function MesReservations(){

    const[reservations,setReservations]=useState([]);
    const[loading,setLoading]=useState(true);

    useEffect(()=>{
        loadReservations();
    },[]);

    async function loadReservations(){

        try{

            const{data}=await getMyReservations();

            setReservations(

                data.map(r=>({

                    id:r.id,

                    salle:r.salle.nom,

                    date:new Date(r.date).toLocaleDateString("fr-FR"),

                    heure:`${r.heure_debut.slice(0,5)} - ${r.heure_fin.slice(0,5)}`,

                    statut:(
                        <Badge type={r.statut}>
                            {{
                                acceptee:"Acceptée",
                                en_attente:"En attente",
                                refusee:"Refusée"
                            }[r.statut]}
                        </Badge>
                    )

                }))

            );

        }catch(error){

            console.error(error);

        }finally{

            setLoading(false);

        }

    }

    const total=reservations.length;

    const acceptees=reservations.filter(
        r=>r.statut.props.type==="acceptee"
    ).length;

    const attente=reservations.filter(
        r=>r.statut.props.type==="en_attente"
    ).length;

    const refusees=reservations.filter(
        r=>r.statut.props.type==="refusee"
    ).length;

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
                        />

                    )}

                </div>

            </div>

        </DashboardLayout>

    );

}