// =====================================================
// DashboardLayout
//
// Layout commun à tous les espaces de l'application.
//
// Contient uniquement :
// - Sidebar
// - Header
// - Zone de contenu
//
// Les pages (Dashboard, Profil, Réservations, etc.)
// sont injectées via {children}.
//
// Aucune logique métier ici.
// =====================================================

// src/layouts/DashboardLayout.jsx

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import "./DashboardLayout.css";

export default function DashboardLayout({ children }) {
    return (
        <div className="dashboard-layout">

            <Sidebar />

            <main className="dashboard-main">

                <Header />

                <section className="dashboard-content">
                    {children}
                </section>

            </main>

        </div>
    );
}