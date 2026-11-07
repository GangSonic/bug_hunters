import { useEffect, useState } from 'react'

const CONSULTA = '(prefers-reduced-motion: reduce)'

/** true si el sistema pide reducir el movimiento. */
export function useMovimientoReducido() {
  const [reducido, setReducido] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.(CONSULTA).matches === true,
  )
  useEffect(() => {
    const mq = window.matchMedia?.(CONSULTA)
    if (!mq) return
    const manejar = () => setReducido(mq.matches)
    mq.addEventListener('change', manejar)
    return () => mq.removeEventListener('change', manejar)
  }, [])
  return reducido
}
