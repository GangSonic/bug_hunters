import { useEffect } from 'react'
import { useConfiguracion } from './store/configuracionStore'

/** Refleja tema y animaciones en <html> para que los tokens CSS respondan. */
export function useAplicarConfiguracion() {
  const tema = useConfiguracion((s) => s.tema)
  const animaciones = useConfiguracion((s) => s.animaciones)
  useEffect(() => {
    document.documentElement.dataset.tema = tema
    document.documentElement.dataset.animaciones = animaciones ? 'si' : 'no'
  }, [tema, animaciones])
}
