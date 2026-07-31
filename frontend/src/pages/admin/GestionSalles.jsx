import {useEffect,useState} from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import ActionButtons from "../../components/actions/ActionButtons";
import FormSalle from "./FormSalle";
import {getSalles,deleteSalle} from "../../api/admin";
import "./GestionSalles.css";

export default function GestionSalles(){

    const[salles,setSalles]=useState([]);
    const[loading,setLoading]=useState(true);
    const[search,setSearch]=useState("");
    const[openForm,setOpenForm]=useState(false);
    const[selectedSalle,setSelectedSalle]=useState(null);

    async function loadSalles(){

        try{

            setLoading(true);

            const{data}=await getSalles({
                recherche:search
            });

            setSalles(data);

        }catch(error){

            console.error(error);

        }finally{

            setLoading(false);

        }

    }

    useEffect(()=>{

        const timer=setTimeout(loadSalles,300);

        return()=>clearTimeout(timer);

    },[search]);

    function ajouterSalle(){

        setSelectedSalle(null);

        setOpenForm(true);

    }

    function modifierSalle(salle){

        setSelectedSalle(salle);

        setOpenForm(true);

    }

    async function supprimer(id){

        if(!window.confirm("Supprimer cette salle ?")) return;

        try{

            await deleteSalle(id);

            loadSalles();

        }catch(error){

            console.error(error);

        }

    }

    const columns=[
        {key:"nom",label:"Nom"},
        {key:"capacite",label:"Capacité"},
        {key:"equipements",label:"Équipements"},
        {key:"statut",label:"Statut"}
    ];

    return(

        <DashboardLayout>

            <div className="page-salles">

                <div className="page-header">

                    <h1 className="page-title">
                        Gestion des salles
                    </h1>

                    <Button onClick={ajouterSalle}>
                        Ajouter une salle
                    </Button>

                </div>

                <input
                    className="search-input"
                    placeholder="Rechercher une salle..."
                    value={search}
                    onChange={e=>setSearch(e.target.value)}
                />

                <div className="table-container">

                    {loading?(
                        <p>Chargement...</p>
                    ):(
                        <Table

                            columns={columns}

                            data={salles}

                            renderCell={(room,col)=>{

                                if(col.key==="equipements"){

                                    return(

                                        <div className="equipements">

                                            {room.equipements.map(e=>(

                                                <div key={e.id}>
                                                    {e.nom}
                                                </div>

                                            ))}

                                        </div>

                                    );

                                }

                                if(col.key==="statut"){

                                    const labels={
                                        disponible:"Disponible",
                                        maintenance:"Maintenance",
                                        occupee:"Occupée"
                                    };

                                    return(

                                        <Badge type={room.statut}>
                                            {labels[room.statut]||room.statut}
                                        </Badge>

                                    );

                                }

                                return room[col.key];

                            }}

                            renderActions={(room)=>(

                                <ActionButtons

                                    onEdit={()=>modifierSalle(room)}

                                    onDelete={()=>supprimer(room.id)}

                                />

                            )}

                        />
                    )}

                </div>

            </div>

            <FormSalle

                open={openForm}

                salle={selectedSalle}

                onClose={()=>setOpenForm(false)}

                onSuccess={()=>{
                    setOpenForm(false);
                    loadSalles();
                }}

            />

        </DashboardLayout>

    );

}