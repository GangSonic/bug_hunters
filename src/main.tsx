import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/baloo-2/latin-600.css'
import '@fontsource/baloo-2/latin-700.css'
import '@fontsource/nunito/latin-400.css'
import '@fontsource/nunito/latin-700.css'
import '@fontsource/nunito/latin-800.css'
import './shared/tokens/tokens.css'
import './app/estilos/global.css'
import { App } from './app/App'

const raiz = document.getElementById('root')
if (!raiz) throw new Error('No se encontró el elemento #root')

createRoot(raiz).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
