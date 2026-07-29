// AuthContext = "l'etat global de connexion" de toute l'application.
// C'est ici qu'on garde en memoire : qui est connecte actuellement,
// et les fonctions pour se connecter/deconnecter DEPUIS N'IMPORTE
// QUELLE PAGE, sans avoir a repasser l'info manuellement de composant
// en composant.
//
// Analogie avec Laravel : c'est un peu l'equivalent cote frontend
// de "$request->user()" -- une facon centralisee de savoir qui est
// l'utilisateur courant, accessible partout dans l'app.

import { createContext, useEffect, useState } from 'react'
import * as authApi from '../api/auth'

// createContext() cree un "conteneur" vide au depart. N'importe quel
// composant enfant de <AuthProvider> pourra lire ce qu'il contient.
export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // user : les infos de l'utilisateur connecte (null si personne connecte)
  const [user, setUser] = useState(null)

  // loading : true tant qu'on n'a pas fini de verifier si un token
  // deja stocke est encore valide (evite d'afficher "pas connecte"
  // une fraction de seconde avant de savoir la vraie reponse)
  const [loading, setLoading] = useState(true)

  // useEffect avec un tableau vide [] : s'execute UNE SEULE FOIS,
  // au tout premier chargement de l'application (equivalent d'un
  // "au demarrage, fais ceci" une bonne fois pour toutes)
  useEffect(() => {
    const token = localStorage.getItem('campusroom_token')

    // Pas de token stocke -> personne n'etait connecte avant,
    // pas besoin d'appeler l'API, on arrete le chargement direct
    if (!token) {
      setLoading(false)
      return
    }

    // Un token existe (session precedente) -> on verifie aupres
    // de Laravel qu'il est toujours valide, via GET /api/me
    authApi
      .fetchMe()
      .then((res) => setUser(res.data)) // token valide -> on recupere l'utilisateur
      .catch(() => {
        // token invalide/expire -> on nettoie ce qui restait en local
        localStorage.removeItem('campusroom_token')
      })
      .finally(() => setLoading(false))
  }, [])

  // Fonction appelee depuis la page de connexion.
  // async/await : on attend la reponse du serveur avant de continuer
  async function login(email, password) {
    const res = await authApi.login(email, password)

    // On garde le token en localStorage : il survit meme si l'utilisateur
    // ferme l'onglet ou rafraichit la page (contrairement a une simple
    // variable en memoire, qui serait perdue au refresh)
    localStorage.setItem('campusroom_token', res.data.token)

    // On met a jour l'etat global : TOUTE l'app sait maintenant
    // qui est connecte, sans avoir a re-appeler l'API ailleurs
    setUser(res.data.user)

    // On renvoie l'utilisateur pour que la page de connexion puisse
    // savoir vers quel ecran rediriger selon son role
    return res.data.user
  }

  async function logout() {
    // .catch(() => {}) : meme si l'appel serveur echoue (ex: token deja
    // expire), on veut quand meme deconnecter localement -- pas bloquant
    await authApi.logout().catch(() => {})
    localStorage.removeItem('campusroom_token')
    setUser(null)
  }

  // Provider : rend "value" disponible a tous les composants enfants.
  // {children} = tout ce qu'on mettra a l'interieur de <AuthProvider>...</AuthProvider>
  // dans main.jsx (c'est-a-dire TOUTE l'application)
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}