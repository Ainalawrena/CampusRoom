// Petit raccourci : au lieu d'ecrire "useContext(AuthContext)" a chaque
// fois dans chaque page, on ecrit juste "useAuth()". Ajoute aussi une
// verification de securite (voir plus bas).

import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export function useAuth() {
  const ctx = useContext(AuthContext)

  // Si jamais un composant utilise useAuth() SANS etre a l'interieur
  // de <AuthProvider>, ctx vaudrait null -- on prefere planter tout
  // de suite avec un message clair, plutot que d'avoir un bug etrange
  // plus tard du genre "Cannot read property 'user' of null"
  if (!ctx) {
    throw new Error("useAuth doit etre utilise a l'interieur de <AuthProvider>")
  }

  return ctx
}