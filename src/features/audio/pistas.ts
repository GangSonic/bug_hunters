export type PistaId = 'inicio' | 'misterio' | 'carrera'

/** Archivo de cada pista, dentro de public/audio/. */
export const ARCHIVO_PISTA: Record<PistaId, string> = {
  inicio: 'audio/inicio.mp3',
  misterio: 'audio/misterio.mp3',
  carrera: 'audio/carrera.mp3',
}

/**
 * Qué suena en cada pantalla (storyboard del equipo): el ambiente de Inicio, el de misterio al
 * elegir y presentar el caso, y el de carrera durante la misión. El resto va en silencio.
 */
const PISTA_POR_PANTALLA: Record<string, PistaId | undefined> = {
  P1: 'inicio',
  P3: 'misterio',
  P4: 'misterio',
  P5: 'carrera',
}

export function pistaDePantalla(pantalla: string): PistaId | null {
  return PISTA_POR_PANTALLA[pantalla] ?? null
}
