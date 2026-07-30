// =====================================================
//
// Tableau de bord principal.
//
// Affiche :
//
// Cartes statistiques
//
// Dernières réservations
//
// Notifications
//
// Accès rapide
//
// Cette page utilise EnseignantLayout.
//
// =====================================================
import { useEffect, useState } from "react";

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

import "./DashboardEnseignant.css";

export default function DashboardEnseignant() {

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadDashboard() {

            try {

                const response = await dashboardApi.index();

                setDashboard(response.data);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        }

        loadDashboard();

    }, []);

    if (loading) {

        return (

            <DashboardLayout>

                <h2>Chargement...</h2>

            </DashboardLayout>

        );

    }

    const stats = dashboard.stats;

    const reservations = dashboard.dernieres_reservations;

    const columns = [

        {
            key: "salle",
            label: "Salle"
        },

        {
            key: "date",
            label: "Date"
        },

        {
            key: "heure",
            label: "Horaire"
        },

        {
            key: "statut",
            label: "Statut"
        }

    ];

    const data = reservations.map(r => ({

        salle: r.salle.nom,

        date: new Date(r.date).toLocaleDateString(),

        heure: `${r.heure_debut} - ${r.heure_fin}`,

        statut: r.statut

    }));

    return (

        <DashboardLayout>

            <h1>Tableau de bord</h1>

            <p>Bienvenue sur CampusRoom.</p>

            <div className="cards-grid">

                <Card
                    title="Réservations"
                    value={stats.total}
                    icon={<FaCalendarCheck />}
                />

                <Card
                    title="Acceptées"
                    value={stats.acceptees}
                    icon={<FaCheckCircle />}
                />

                <Card
                    title="En attente"
                    value={stats.en_attente}
                    icon={<FaClock />}
                />

                <Card
                    title="Refusées"
                    value={stats.refusees}
                    icon={<FaTimesCircle />}
                />

            </div>

            <h2>Dernières réservations</h2>

            <Table

                columns={columns}

                data={data}

            />

        </DashboardLayout>

    );

}