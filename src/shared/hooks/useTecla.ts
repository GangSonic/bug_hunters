import { useEffect, useRef } from 'react'

/** Ejecuta `accion` cuando se pulsa `tecla` (por ejemplo, 'Escape'). */
export function useTecla(tecla: string, accion: () => void, activo = true) {
  const accionRef = useRef(accion)
  useEffect(() => {
    accionRef.current = accion
  })

  useEffect(() => {
    if (!activo) return
    const manejar = (e: KeyboardEvent) => {
      if (e.key === tecla) accionRef.current()
    }
    window.addEventListener('keydown', manejar)
    return () => window.removeEventListener('keydown', manejar)
  }, [tecla, activo])
}
