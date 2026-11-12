import { useEffect } from 'react'
import { mostrarAviso } from '@/shared'
import { useProgreso } from '../store/progresoStore'

/** Avisa una sola vez que el progreso guardado se descartó (HU13, CA13.3). No dibuja nada. */
export function AvisoProgresoDescartado() {
  const descartado = useProgreso((s) => s.progresoDescartado)

  useEffect(() => {
    // Se lee el estado actual para que no avise dos veces en el modo estricto de desarrollo.
    if (!useProgreso.getState().progresoDescartado) return
    mostrarAviso('No se pudo leer tu progreso guardado, así que se reinició.')
    useProgreso.getState().cerrarAvisoDescartado()
  }, [descartado])

  return null
}
