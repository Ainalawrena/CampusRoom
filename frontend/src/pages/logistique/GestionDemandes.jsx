import {useEffect,useState} from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {getDemandes} from "../../api/logistique";
import ReservationActions from "../../components/logistique/ReservationActions";
import "./GestionDemandes.css";

export default function GestionDemandes(){

    const[reservations,setReservations]=useState([]);
    const[loading,setLoading]=useState(true);
    const[searchLoading,setSearchLoading]=useState(false);

    const[search,setSearch]=useState("");
    const[statut,setStatut]=useState("tous");

    async function loadData(isSearch=false){

        try{

            if(isSearch){

                setSearchLoading(true);

            }

            const{data}=await getDemandes(search,statut);

            setReservations(data);

        }catch(error){

            console.error(error);

        }finally{

            if(loading){

                setLoading(false);

            }

            setSearchLoading(false);

        }

    }

    useEffect(()=>{

        loadData();

    },[]);

    useEffect(()=>{

        if(loading) return;

        const timer=setTimeout(()=>{

            loadData(true);

        },300);

        return()=>clearTimeout(timer);

    },[search,statut]);

    if(loading){

        return(

            <DashboardLayout>

                <h2>Chargement...</h2>

            </DashboardLayout>

        );

    }

    return(

        <DashboardLayout>

            <h1>Gestion des demandes</h1>

            <div className="toolbar">

                <div className="search-box">

                    <input
                        placeholder="Rechercher..."
                        value={search}
                        onChange={e=>setSearch(e.target.value)}
                    />

                    {searchLoading&&<span className="search-loading">...</span>}

                </div>

                <select
                    value={statut}
                    onChange={e=>setStatut(e.target.value)}
                >

                    <option value="tous">Tous</option>
                    <option value="en_attente">En attente</option>
                    <option value="acceptee">Acceptée</option>
                    <option value="refusee">Refusée</option>

                </select>

            </div>

            <div className="table-card">

                <table className="demandes-table">

                    <thead>

                        <tr>

                            <th>Utilisateur</th>
                            <th>Salle</th>
                            <th>Date</th>
                            <th>Créneau</th>
                            <th>Motif</th>
                            <th>Statut</th>
                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {reservations.map(r=>(

                            <tr key={r.id}>

                                <td>{r.user.nom}</td>

                                <td>{r.salle.nom}</td>

                                <td>{new Date(r.date).toLocaleDateString()}</td>

                                <td>{r.heure_debut.slice(0,5)} - {r.heure_fin.slice(0,5)}</td>

                                <td>{r.motif||"-"}</td>

                                <td>

                                    <span className={`badge ${r.statut}`}>
                                        {r.statut.replace("_"," ")}
                                    </span>

                                </td>

                                <td>

                                    <ReservationActions
                                        reservation={r}
                                        onSuccess={()=>loadData(true)}
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