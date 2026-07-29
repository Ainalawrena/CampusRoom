// Definit toutes les URLs de l'application et quelle page s'affiche
// pour chacune. Pour l'instant, seule la connexion existe -- on ajoutera
// les autres pages au fur et a mesure, une par une, comme convenu.

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}