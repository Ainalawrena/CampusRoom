import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { getRooms } from "../../api/salle";
import { getEquipements } from "../../api/equipement";
import "./ListeSalles.css";
import { useAuth } from "../../hooks/useAuth";
export default function ListeSalles() {

    const [rooms, setRooms] = useState([]);
    const [equipements, setEquipements] = useState([]);

    const [loading, setLoading] = useState(true);
    
    const [search, setSearch] = useState("");
    const [capacite, setCapacite] = useState("");
    const [equipement, setEquipement] = useState("");
    const navigate = useNavigate();
    const {user}=useAuth();

    const columns = [
        { key: "nom", label: "Salle" },
        { key: "capacite", label: "Capacité" },
        { key: "equipements", label: "Équipements" },
        { key: "statut", label: "Disponibilité" }
    ];

    useEffect(() => {

        async function loadEquipements() {

            try {

                const response = await getEquipements();

                setEquipements(response.data);

            } catch (error) {

                console.error(error);

            }

        }

        loadEquipements();

    }, []);

    useEffect(() => {

        const timer = setTimeout(async () => {

            try {

                setLoading(true);

                const response = await getRooms({

                    recherche: search,
                    capacite,
                    equipement

                });

                setRooms(response.data);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        }, 300);

        return () => clearTimeout(timer);

    }, [search, capacite, equipement]);

    return (

        <DashboardLayout>

            <div className="page-salles">

                <h1 className="page-title">
                    Liste des salles
                </h1>

                <div className="filters">

                    <input
                        type="text"
                        placeholder="Rechercher une salle"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <input
                        type="number"
                        placeholder="Capacité minimale"
                        value={capacite}
                        onChange={(e) => setCapacite(e.target.value)}
                    />

                    <select
                        value={equipement}
                        onChange={(e) => setEquipement(e.target.value)}
                    >

                        <option value="">
                            Tous les équipements
                        </option>

                        {equipements.map((eq) => (

                            <option
                                key={eq.id}
                                value={eq.id}
                            >
                                {eq.nom}
                            </option>

                        ))}

                    </select>

                </div>

                <div className="table-container">

                    {loading ? (

                        <p>Chargement...</p>

                    ) : (

                        <Table
                            columns={columns}
                            data={rooms}

                            renderCell={(room, col) => {

                                if (col.key === "equipements") {

                                    return (

                                        <div className="equipements">

                                            {room.equipements.map((e) => (

                                                <div key={e.id}>
                                                    {e.nom}
                                                </div>

                                            ))}

                                        </div>

                                    );

                                }

                                if (col.key === "statut") {

                                    const labels = {
                                        disponible: "Libre",
                                        occupee: "Occupée",
                                        maintenance: "Maintenance"
                                    };
                                    return (
                                        <Badge type={room.statut}>
                                            {labels[room.statut] || room.statut}
                                        </Badge>
                                    );
                                }
                                return room[col.key];

                            }}
                            renderActions={(room) => ( 
                                <div className="table-actions">
                                    <Button
                                        variant="secondary"
                                        onClick={() =>
                                            navigate(`/${user.role}/salles/${room.id}`)
                                        }
                                >
                                    Voir disponibilités
                                </Button>
                                    
                                    <Button
                                        disabled={room.statut !== "disponible"}
                                        onClick={() =>
                                            navigate(`/${user.role}/salles/${room.id}?focus=reservation`)
                                        }
                                    >
                                        {
                                            room.statut === "disponible"
                                                ? "Réserver"
                                                : "Indisponible"
                                        }
                                    </Button>
                                    
                                </div>

                            )}
                        />
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}