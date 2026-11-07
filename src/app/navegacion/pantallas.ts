/**
 * Pantallas y enlaces del diagrama de hipertexto (Capítulo IV, Figura 7 y Tabla 14).
 * D-01: como en la primera versión, la selección de mundo y de expediente es una sola
 * pantalla (P3), así que P2 ya no existe y P1 lleva directo a P3.
 * Solo app/ conoce esta tabla; las features reciben la navegación como props.
 */
export const PANTALLAS = {
  P1: 'Inicio',
  P3: 'Selección de expediente',
  P4: 'Presentación de la misión',
  P5: 'Escenario de misión',
  P6: 'Resultado y explicación',
  P7: 'BugDex',
} as const

export type PantallaId = keyof typeof PANTALLAS

export const ENLACES: Record<PantallaId, readonly PantallaId[]> = {
  P1: ['P3'],
  P3: ['P1', 'P4', 'P7'],
  P4: ['P3', 'P5'],
  P5: ['P3', 'P6'],
  P6: ['P1', 'P3', 'P7'],
  P7: ['P1', 'P3'],
}

export const CAPAS = {
  O1: 'Pausa',
  O2: 'Ayuda',
  O3: 'Configuración',
  O4: 'Confirmación',
} as const

export type CapaId = keyof typeof CAPAS

export function enlacePermitido(origen: PantallaId, destino: PantallaId) {
  return ENLACES[origen].includes(destino)
}
