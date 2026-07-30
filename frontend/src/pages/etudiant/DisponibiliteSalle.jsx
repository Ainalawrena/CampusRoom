import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import ReservationForm from "../../components/reservation/ReservationForm";
import { getRoom, getDisponibilites } from "../../api/salle";

import "./DisponibiliteSalle.css";

export default function DisponibiliteSalle() {

    const { id } = useParams();
    const [searchParams] = useSearchParams();

    const [room, setRoom] = useState(null);
    const [planning, setPlanning] = useState(null);
    const [loading, setLoading] = useState(true);

    const jours = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
    const heures = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00", "17:00"];

    async function loadData() {
        try {
            const [roomResponse, planningResponse] = await Promise.all([
                getRoom(id),
                getDisponibilites(id)
            ]);

            setRoom(roomResponse.data);
            setPlanning(planningResponse.data);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [id]);

    useEffect(() => {
        if (!loading && searchParams.get("focus") === "reservation") {
            document.getElementById("reservation")?.scrollIntoView({
                behavior: "smooth"
            });
        }
    }, [loading, searchParams]);

    function estOccupe(jour, heure) {

        if (!planning) return false;

        const mapJour = [
            "Lundi",
            "Mardi",
            "Mercredi",
            "Jeudi",
            "Vendredi",
            "Samedi"
        ];

        return planning.reservations.some((reservation) => {

            if (reservation.statut === "refusee") return false;

            const date = new Date(reservation.date);

            const jourReservation = mapJour[date.getDay()];

            return (
                jourReservation === jour &&
                heure >= reservation.heure_debut.slice(0,5) &&
                heure < reservation.heure_fin.slice(0,5)
            );

        });

    }

    if (loading) {
        return (
            <DashboardLayout>
                <p>Chargement...</p>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>

            <div className="disponibilite-page">

                <div className="room-card">

                    <div className="room-top">

                        <div>
                            <h1>{room.nom}</h1>
                            <p>{room.batiment}</p>
                        </div>

                        <span className={`badge ${room.statut}`}>
                            {room.statut}
                        </span>

                    </div>

                    <div className="room-grid">

                        <div>
                            <span>Capacité</span>
                            <strong>{room.capacite} places</strong>
                        </div>

                        <div>
                            <span>Équipements</span>

                            <div className="equipements">
                                {room.equipements.map(e => (
                                    <span
                                        key={e.id}
                                        className="equipement"
                                    >
                                        {e.nom}
                                    </span>
                                ))}
                            </div>

                        </div>

                    </div>

                </div>

                <div className="planning-card">

                    <div className="planning-header">

                        <div>
                            <h2>Disponibilité — Semaine en cours</h2>
                            <p>
                                Du {planning.debut_semaine} au {planning.fin_semaine}
                            </p>
                        </div>

                        <div className="legend">

                            <div>
                                <span className="square libre"></span>
                                Disponible
                            </div>

                            <div>
                                <span className="square occupee"></span>
                                Occupée
                            </div>

                        </div>

                    </div>

                    <table className="planning-table">

                        <thead>

                            <tr>
                                <th>Jour</th>

                                {heures.map(heure => (
                                    <th key={heure}>{heure}</th>
                                ))}

                            </tr>

                        </thead>

                        <tbody>

                            {jours.map(jour => (

                                <tr key={jour}>

                                    <td className="jour">
                                        {jour}
                                    </td>

                                    {heures.map(heure => (

                                        <td key={heure}>

                                            <div
                                                className={`cell ${
                                                    estOccupe(jour, heure)
                                                        ? "occupee"
                                                        : "libre"
                                                }`}
                                            />

                                        </td>

                                    ))}

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

                <ReservationForm
                    id="reservation"
                    salleId={room.id}
                    onSuccess={loadData}
                />

            </div>

        </DashboardLayout>
    );
}