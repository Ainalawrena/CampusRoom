// Page de connexion. C'est la seule page accessible sans etre deja
// connecte -- elle correspond exactement a l'ecran "Connexion" du
// wireframe (index.html du prototype).
//
// Contrairement au prototype HTML statique, il n'y a plus de menu
// "Role" a choisir manuellement : le role vient directement du compte
// renvoye par l'API apres le login (voir AuthController::login cote
// Laravel), donc plus fiable.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './login.css'

// Selon le role renvoye par l'API, on redirige vers l'ecran d'accueil
// correspondant -- pour l'instant seule '/' existe vraiment, les autres
// routes seront ajoutees au fur et a mesure des prochaines etapes
const ROLE_HOME = {
  etudiant: '/salles',
  enseignant: '/salles',
  logistique: '/logistique',
  administrateur: '/admin',
}

export default function LoginPage() {
  // useState : garde en memoire ce que l'utilisateur tape dans les champs.
  // Chaque frappe au clavier declenche un re-rendu avec la nouvelle valeur
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Message d'erreur affiche si la connexion echoue (mauvais mot de passe...)
  const [error, setError] = useState(null)

  // Desactive le bouton pendant l'appel reseau, pour eviter un double-clic
  // qui enverrait deux requetes de connexion en meme temps
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    // Empeche le comportement par defaut du navigateur (recharger la page
    // au submit d'un formulaire) -- on gere l'envoi nous-memes en JS
    e.preventDefault()

    setError(null)
    setLoading(true)

    try {
      // login() vient du AuthContext : envoie la requete, stocke le token,
      // met a jour l'utilisateur global, ET renvoie l'utilisateur connecte
      const user = await login(email, password)

      // Redirige vers l'ecran d'accueil correspondant a son role
      navigate(ROLE_HOME[user.role] || '/')
    } catch (err) {
      // L'API renvoie une erreur 422 en cas de mauvais identifiants
      // (deja teste avec curl plus tot) -- on affiche un message generique
      setError('Email ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <aside className="brand-panel">
        <div className="brand-panel__content">
          <h1>Campus<span>Room</span></h1>
          <p className="tagline">La plateforme de reservation des salles de l'etablissement.</p>
        </div>
      </aside>

      <main className="form-panel">
        <div className="login-card">
          <div className="login-card__header">
            <span className="login-card__brand">CampusRoom</span>
          </div>

          {/* onSubmit sur le <form>, pas onClick sur le bouton :
              ca permet aussi de valider en appuyant sur Entree,
              pas seulement en cliquant */}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@etablissement.mg"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
              />
            </div>

            {/* Affiche seulement si error n'est pas null */}
            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}