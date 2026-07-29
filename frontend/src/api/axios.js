import axios from 'axios'

// Cree une instance Axios preconfiguree avec l'URL de base de l'API,
// pour ne pas avoir a la retaper dans chaque appel
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
})

// Intercepteur : s'execute AVANT chaque requete envoyee.
// Il va chercher le token stocke apres le login, et l'ajoute
// automatiquement dans l'en-tete Authorization -- comme on le faisait
// a la main avec "-H Authorization: Bearer ..." dans curl
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campusroom_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api