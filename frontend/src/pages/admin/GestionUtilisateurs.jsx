import {useEffect,useState} from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import ActionButtons from "../../components/actions/ActionButtons";
import FormUtilisateur from "./FormUtilisateur";
import {
    getUsers,
    deleteUser
} from "../../api/admin";
import "./GestionUtilisateurs.css";

export default function GestionUtilisateurs(){

    const [users,setUsers]=useState([]);
    const [loading,setLoading]=useState(true);

    const [search,setSearch]=useState("");

    const [openForm,setOpenForm]=useState(false);

    const [selectedUser,setSelectedUser]=useState(null);

    async function loadUsers(){

        try{

            setLoading(true);

            const {data}=await getUsers({

                recherche:search

            });

            setUsers(data);

        }catch(error){

            console.error(error);

        }finally{

            setLoading(false);

        }

    }

    useEffect(()=>{

        const timer=setTimeout(loadUsers,300);

        return()=>clearTimeout(timer);

    },[search]);

    function ajouterUtilisateur(){

        setSelectedUser(null);

        setOpenForm(true);

    }

    function modifierUtilisateur(user){

        setSelectedUser(user);

        setOpenForm(true);

    }

    async function supprimerUtilisateur(id){

        if(!window.confirm("Supprimer cet utilisateur ?")) return;

        try{

            await deleteUser(id);

            loadUsers();

        }catch(error){

            console.error(error);

        }

    }

    const columns=[

        {
            key:"nom",
            label:"Nom"
        },

        {
            key:"prenom",
            label:"Prénom"
        },

        {
            key:"email",
            label:"Email"
        },

        {
            key:"role",
            label:"Rôle"
        }

    ];

    return(

        <DashboardLayout>

            <div className="page-salles">

                <div className="page-header">

                    <h1 className="page-title">

                        Gestion des utilisateurs

                    </h1>

                    <Button
                        onClick={ajouterUtilisateur}
                    >

                        Ajouter un utilisateur

                    </Button>

                </div>

                <input

                    className="search-input"

                    placeholder="Rechercher un utilisateur..."

                    value={search}

                    onChange={e=>setSearch(e.target.value)}

                />

                <div className="table-container">

                    {

                        loading?

                        (

                            <p>Chargement...</p>

                        )

                        :

                        (

                            <Table

                                columns={columns}

                                data={users}

                                renderCell={(user,col)=>{

                                    if(col.key==="role"){

                                        const labels={

                                            administrateur:"Administrateur",

                                            logistique:"Logistique",

                                            enseignant:"Enseignant",

                                            etudiant:"Étudiant"

                                        };

                                        return(

                                            <Badge type="info">

                                                {

                                                    labels[user.role]

                                                }

                                            </Badge>

                                        );

                                    }

                                    return user[col.key];

                                }}

                                renderActions={(user)=>(

                                    <ActionButtons

                                        onEdit={()=>modifierUtilisateur(user)}

                                        onDelete={()=>supprimerUtilisateur(user.id)}

                                    />

                                )}

                            />

                        )

                    }

                </div>

            </div>

            <FormUtilisateur

                open={openForm}

                user={selectedUser}

                onClose={()=>setOpenForm(false)}

                onSuccess={()=>{

                    setOpenForm(false);

                    loadUsers();
                }}
            />
        </DashboardLayout>
    );
}