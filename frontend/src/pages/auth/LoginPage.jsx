// Page de connexion/inscription. Reproduit fidelement le prototype
// HTML/CSS (panneau de marque a gauche, carte avec onglets a droite),
// mais avec un vrai comportement : appels API reels, gestion d'erreurs,
// redirection selon le role REEL renvoye par le serveur.
//
// Difference volontaire avec le prototype : pas de select "Role" sur
// l'onglet Connexion (le role vient du compte en base, pas d'un choix
// manuel factice) -- decide explicitement avec l'utilisateur.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './login.css'

const ROLE_HOME = {
  enseignant: "/enseignant/dashboard",
  etudiant: "/etudiant/dashboard",
  logistique: "/logistique/dashboard",
  administrateur: "/admin/dashboard",
}

export default function LoginPage() {
  const { login, register } = useAuth()
  const navigate = useNavigate()

  // 'connexion' | 'inscription' -- remplace le JS vanilla du prototype
  // qui basculait les classes CSS a la main
  const [activeTab, setActiveTab] = useState('connexion')

  // ---- Etat du formulaire de connexion ----
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState(null)
  const [loginLoading, setLoginLoading] = useState(false)

  // ---- Etat du formulaire d'inscription ----
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [role, setRole] = useState('')
  const [registerError, setRegisterError] = useState(null)
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerSuccess, setRegisterSuccess] = useState(false)

  async function handleLoginSubmit(e) {
    e.preventDefault()
    setLoginError(null)
    setLoginLoading(true)
    try {
      const user = await login(loginEmail, loginPassword)
      navigate(ROLE_HOME[user.role] || '/')
    } catch (err) {
      setLoginError('Email ou mot de passe incorrect.')
    } finally {
      setLoginLoading(false)
    }
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault()
    setRegisterError(null)
    setRegisterLoading(true)
    try {
      const user = await register({
        nom,
        prenom,
        email: registerEmail,
        password: registerPassword,
        role,
      })

      // Reprend le feedback visuel du prototype (message de succes),
      // puis redirige vraiment vers l'espace du role choisi -- au lieu
      // de juste revenir sur l'onglet Connexion comme le faisait la
      // version factice
      setRegisterSuccess(true)
      setTimeout(() => {
        navigate(ROLE_HOME[user.role] || '/')
      }, 1200)
    } catch (err) {
      // 'email' deja pris -> Laravel renvoie une erreur de validation 422
      setRegisterError("Cette adresse email est deja utilisee, ou une information est invalide.")
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <div className="page">
      {/* ---- Panneau de marque (gauche) ---- */}
      <aside className="brand-panel">
        <div className="brand-panel__content">
          <div className="brand-mark">
            <svg viewBox="0 0 24 24" width="34" height="34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
              <path d="M15 10h4a1 1 0 0 1 1 1v10" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
              <path d="M8 7h2M8 11h2M8 15h2M17 14h1.5M17 17h1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              <path d="M2 21h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              <path d="M9 21v-4a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1>Campus<span>Room</span></h1>
          <p className="tagline">La plateforme de reservation des salles de l'etablissement.</p>

          <ul className="pitch-list">
            <li><span className="pitch-list__icon">&#10003;</span>Consultez les disponibilites en temps reel</li>
            <li><span className="pitch-list__icon">&#10003;</span>Reservez ou demandez une salle en quelques clics</li>
            <li><span className="pitch-list__icon">&#10003;</span>Recevez une notification des la validation</li>
          </ul>
        </div>

        <p className="brand-panel__footer">&copy; 2026 CampusRoom &mdash; Etablissement scolaire</p>
      </aside>

      {/* ---- Formulaire (droite) ---- */}
      <main className="form-panel">
        <div className="login-card">

          <div className="login-card__header">
            <div className="login-card__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                <path d="M15 10h4a1 1 0 0 1 1 1v10" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                <path d="M8 7h2M8 11h2M8 15h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="login-card__brand">CampusRoom</span>
          </div>

          <div className="tabs" role="tablist">
            <button
              type="button"
              className={'tabs__item' + (activeTab === 'connexion' ? ' tabs__item--active' : '')}
              onClick={() => setActiveTab('connexion')}
            >
              Connexion
            </button>
            <button
              type="button"
              className={'tabs__item' + (activeTab === 'inscription' ? ' tabs__item--active' : '')}
              onClick={() => setActiveTab('inscription')}
            >
              Inscription
            </button>
          </div>

          {/* ================= Connexion ================= */}
          {activeTab === 'connexion' && (
            <div className="panel-form">
              <form onSubmit={handleLoginSubmit}>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="nom@etablissement.mg"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="password">Mot de passe</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="********"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>

                {loginError && <p className="form-error">{loginError}</p>}

                <button type="submit" className="btn-primary" disabled={loginLoading}>
                  {loginLoading ? 'Connexion...' : 'Se connecter'}
                </button>

                <a href="#" className="forgot-link">Mot de passe oublie ?</a>
              </form>
            </div>
          )}

          {/* ================= Inscription ================= */}
          {activeTab === 'inscription' && (
            <div className="panel-form">
              <form onSubmit={handleRegisterSubmit}>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="nom">Nom</label>
                    <input
                      type="text"
                      id="nom"
                      placeholder="ex : Lawrena"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="prenom">Prenom</label>
                    <input
                      type="text"
                      id="prenom"
                      placeholder="ex : Aina"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="reg-email">Email</label>
                  <input
                    type="email"
                    id="reg-email"
                    placeholder="nom@etablissement.mg"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="reg-password">Mot de passe</label>
                  <input
                    type="password"
                    id="reg-password"
                    placeholder="********"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>

                <div className="field">
                  <label htmlFor="reg-role">Role</label>
                  <select
                    id="reg-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="" disabled>Selectionner un role</option>
                    <option value="enseignant">Enseignant / Responsable d'association</option>
                    <option value="etudiant">Etudiant</option>
                    <option value="logistique">Service logistique</option>
                    <option value="administrateur">Administrateur</option>
                  </select>
                </div>

                {registerError && <p className="form-error">{registerError}</p>}

                <button type="submit" className="btn-primary" disabled={registerLoading}>
                  {registerLoading ? 'Creation...' : "S'inscrire"}
                </button>

                {registerSuccess && (
                  <p className="form-success form-success--visible">
                    &#10003; Compte cree avec succes. Redirection...
                  </p>
                )}
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}