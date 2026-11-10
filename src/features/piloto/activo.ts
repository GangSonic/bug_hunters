/** El modo piloto se activa solo con ?piloto=1 en la URL (HU18). */
export function esPilotoActivo(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('piloto') === '1'
}
