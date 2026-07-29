// Point d'entree de toute l'application React.
// C'est ici que React "s'accroche" au HTML (index.html) et que
// tout le reste de l'app est monte a l'interieur.

import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* AuthProvider enveloppe TOUTE l'application : ca garantit
        que useAuth() fonctionnera dans n'importe quelle page,
        peu importe sa profondeur dans l'arborescence de composants */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)