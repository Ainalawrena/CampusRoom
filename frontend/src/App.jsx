// =====================================================
// Point d'entrée des routes de l'application.
//
// Pour l'instant :
//
// - Connexion
// - Dashboard Enseignant
//
// Les autres routes (Étudiant, Logistique,
// Administrateur...) seront ajoutées progressivement.
//
// =====================================================

import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import DashboardEnseignant from "./pages/enseignant/DashboardEnseignant";
import ListeSalles from "./pages/enseignant/ListeSalles";
import ProtectedRoute from "./routes/ProtectedRoute";
import DisponibiliteSalle from "./pages/enseignant/DisponibiliteSalle";
import MesReservations from "./pages/enseignant/MesReservations";
import Profil from "./pages/profil/Profil";
import DashboardEtudiant from "./pages/etudiant/DashboardEtudiant";
export default function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Connexion */}
                <Route
                    path="/"
                    element={<LoginPage />}
                />

               {/* Dashboard Enseignant */}
<Route
    path="/enseignant/dashboard"
    element={
        <ProtectedRoute roles={["enseignant"]}>
            <DashboardEnseignant />
        </ProtectedRoute>
    }
/>

{/* Liste des salles */}
<Route
    path="/enseignant/listeSalle"
    element={
        <ProtectedRoute roles={["enseignant"]}>
            <ListeSalles />
        </ProtectedRoute>
    }
/>

<Route
    path="/enseignant/salles/:id"
    element={
        <ProtectedRoute roles={["enseignant"]}>
            <DisponibiliteSalle />
        </ProtectedRoute>
    }
/>

<Route
    path="/enseignant/mes-reservations"
    element={
        <ProtectedRoute roles={["enseignant"]}>
            <MesReservations />
        </ProtectedRoute>
    }
/>

<Route
    path="/profil"
    element={
        <ProtectedRoute
            roles={["enseignant","logistique","administrateur"]}
        >
            <Profil />
        </ProtectedRoute>
    }
/>

<Route
    path="/etudiant/dashboard"
    element={
        <ProtectedRoute roles={["etudiant"]}>
            <DashboardEtudiant />
        </ProtectedRoute>
    }
/>

<Route
    path="/etudiant/listeSalle"
    element={
        <ProtectedRoute roles={["etudiant"]}>
            <ListeSalles />
        </ProtectedRoute>
    }
/>

<Route
    path="/etudiant/salles/:id"
    element={
        <ProtectedRoute roles={["etudiant"]}>
            <DisponibiliteSalle />
        </ProtectedRoute>
    }
/>

<Route
    path="/etudiant/mes-reservations"
    element={
        <ProtectedRoute roles={["etudiant"]}>
            <MesReservations />
        </ProtectedRoute>
    }
/>

            </Routes>
        </BrowserRouter>
    );
}