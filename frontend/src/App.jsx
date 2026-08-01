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
import MesReservations from "./pages/common/MesReservations";
import Profil from "./pages/profil/Profil";
import DashboardLogistique from "./pages/logistique/DashboardLogistique";
import DashboardEtudiant from "./pages/etudiant/DashboardEtudiant";
import GestionDemandes from "./pages/logistique/GestionDemandes";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import GestionSalles from "./pages/admin/GestionSalles";
import GestionUtilisateurs from "./pages/admin/GestionUtilisateurs";
import Statistiques from "./pages/admin/Statistiques";
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
            roles={["etudiant","enseignant","logistique","administrateur"]}
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

<Route
    path="/logistique/dashboard"
    element={
        <ProtectedRoute roles={["logistique"]}>
            <DashboardLogistique />
        </ProtectedRoute>
    }
/>

<Route
    path="/logistique/demandes"
    element={
        <ProtectedRoute roles={["logistique"]}>
            <GestionDemandes />
        </ProtectedRoute>
    }
/>

{/* ================= ADMINISTRATEUR ================= */}

<Route
    path="/admin/dashboard"
    element={
        <ProtectedRoute roles={["administrateur"]}>
            <DashboardAdmin/>
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/salles"
    element={
        <ProtectedRoute roles={["administrateur"]}>
            <GestionSalles/>
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/utilisateurs"
    element={
        <ProtectedRoute roles={["administrateur"]}>
            <GestionUtilisateurs/>
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/statistiques"
    element={
        <ProtectedRoute roles={["administrateur"]}>
            <Statistiques/>
        </ProtectedRoute>
    }
/>
            </Routes>
        </BrowserRouter>
    );
}