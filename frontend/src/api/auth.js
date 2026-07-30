// Ce fichier regroupe TOUTES les fonctions qui parlent au backend Laravel
// concernant l'authentification (inscription, connexion, deconnexion,
// "qui suis-je"). Chaque fonction correspond exactement a une route
// qu'on a testee avec curl cote Laravel :
//   POST /api/register  -> register()
//   POST /api/login      -> login()
//   POST /api/logout     -> logout()
//   GET  /api/me          -> fetchMe()
//
// Pourquoi un fichier a part, plutot que d'appeler axios directement
// depuis les pages : si un jour l'URL ou la structure d'une route change,
// on corrige UN SEUL endroit ici, au lieu de chercher dans toutes les
// pages qui utilisent la connexion.

import api from './axios'

// Envoie email + mot de passe a POST /api/login.
// Renvoie une Promise qui contient { user, token } si succes
// (exactement la meme reponse JSON qu'on a vue avec curl).
export function login(email, password) {
  return api.post('/login', { email, password })
}

// Cree un nouveau compte. "payload" est un objet contenant
// { nom, prenom, email, password, role } -- les memes champs
// que le register() teste avec curl.
export function register(payload) {
  return api.post('/register', payload)
}

// Deconnecte l'utilisateur cote serveur (supprime son token actuel
// dans la base Laravel). Ne fait PAS le menage cote frontend
// (ca, c'est le role du AuthContext qu'on va faire juste apres).
export function logout() {
  return api.post('/logout')
}

// Demande au serveur "qui est connecte avec ce token ?".
// Utilise au demarrage de l'app : si un token existe deja dans
// localStorage (utilisateur pas encore deconnecte d'une session
// precedente), on verifie qu'il est toujours valide et on recupere
// les infos du compte, SANS demander de se reconnecter.
export function fetchMe() {
  return api.get('/me')
}

export function getMe(){
    return api.get("/me");
}