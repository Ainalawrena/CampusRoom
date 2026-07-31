import {useEffect,useState} from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import ReservationActions from "../../components/logistique/ReservationActions";
import {dashboardApi} from "../../api/dashboard";
import {FaClock,FaCheckCircle,FaTimesCircle,FaDoorOpen} from "react-icons/fa";
import "../enseignant/DashboardEnseignant.css";

export default function DashboardLogistique(){

    const[dashboard,setDashboard]=useState(null);
    const[loading,setLoading]=useState(true);

    async function loadData(){

        try{

            const{data}=await dashboardApi.logistique();
            setDashboard(data);

        }catch(error){

            console.error(error);

        }finally{

            setLoading(false);

        }

    }

    useEffect(()=>{

        loadData();

    },[]);

    if(loading) return(
        <DashboardLayout>
            <h2>Chargement...</h2>
        </DashboardLayout>
    );

    const s=dashboard.stats;

    return(

        <DashboardLayout>

            <div className="dashboard-title">
                <h1>Tableau de bord</h1>
                <p>Suivi des demandes de réservation.</p>
            </div>

            <div className="cards-grid">

                <Card title="En attente" value={s.en_attente} icon={<FaClock/>}/>

                <Card title="Acceptées" value={s.acceptees} icon={<FaCheckCircle/>}/>

                <Card title="Refusées" value={s.refusees} icon={<FaTimesCircle/>}/>

                <Card title="Salles" value={s.total_salles} icon={<FaDoorOpen/>}/>

            </div>

            <div className="dashboard-section">

                <div className="section-header">
                    <h2>Demandes récentes</h2>
                </div>

                <table className="demandes-table">

                    <thead>

                        <tr>

                            <th>Utilisateur</th>
                            <th>Salle</th>
                            <th>Date</th>
                            <th>Créneau</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dashboard.dernieres_reservations.map(r=>(
                            <tr key={r.id}>
                                <td>{r.user.nom}</td>
                                <td>{r.salle.nom}</td>
                                <td>{new Date(r.date).toLocaleDateString()}</td>
                                <td>
                                    {r.heure_debut.slice(0,5)} - {r.heure_fin.slice(0,5)}
                                </td>
                                <td>
                                    <ReservationActions
                                        reservation={r}
                                        onSuccess={loadData}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}