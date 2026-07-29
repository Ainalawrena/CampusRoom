// ProtectedRoute = un "videur a l'entree" pour une page.
// Avant d'afficher la page demandee, il verifie :
// 1. que l'utilisateur est bien connecte
// 2. (optionnel) que son role fait partie de ceux autorises
//
// Usage : <ProtectedRoute roles={['administrateur']}><AdminPage /></ProtectedRoute>

import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()

  // Tant qu'on verifie encore si un token existant est valide
  // (au tout premier chargement de l'app), on n'affiche rien
  // plutot que de rediriger trop vite vers la connexion par erreur
  if (loading) return null

  // Pas connecte du tout -> retour a la page de connexion
  if (!user) return <Navigate to="/" replace />

  // Connecte, mais avec le mauvais role pour cette page precise
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  // Tout est bon -> on affiche vraiment la page demandee
  return children
}