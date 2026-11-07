import type { Desenlace } from '@/features/expedientes'

/**
 * Estados de la misión dentro de P5 (Capítulo IV, Figura 8).
 * E0 es la presentación (P4) y E7–E9 ocurren en P6 y P7, fuera de este motor.
 */
export type EstadoId = 'E1' | 'E2' | 'E3' | 'E4' | 'E5a' | 'E5b' | 'E5c' | 'E6'

export const MAX_PISTAS = 3

export interface Intento {
  opcionId: string
  hipotesisId: string
  desenlace: Desenlace
  pistasUsadas: number
  hora: string
}

export interface EstadoMision {
  estado: EstadoId
  hipotesisId: string | null
  opcionId: string | null
  pistasVistas: number
  /** Se conservan al reiniciar: los usa el registro del piloto (HU18). */
  intentos: Intento[]
  /** Hay una opción elegida que todavía no se probó (para O4, HU15). */
  edicionSinProbar: boolean
}

export type Evento =
  | { tipo: 'OBSERVACION_TERMINADA' }
  | { tipo: 'ELEGIR_HIPOTESIS'; id: string }
  | { tipo: 'ELEGIR_OPCION'; id: string }
  | { tipo: 'PROBADO'; desenlace: Desenlace; hora: string }
  | { tipo: 'REVISAR' }
  | { tipo: 'PEDIR_PISTA' }
  | { tipo: 'CONTINUAR' }
  | { tipo: 'REINICIAR' }

export const ESTADO_INICIAL: EstadoMision = {
  estado: 'E1',
  hipotesisId: null,
  opcionId: null,
  pistasVistas: 0,
  intentos: [],
  edicionSinProbar: false,
}

const DESENLACE_A_ESTADO: Record<Desenlace, EstadoId> = {
  correcto: 'E5a',
  incompleto: 'E5b',
  sinCambio: 'E5c',
}

const INVESTIGANDO: EstadoId[] = ['E2', 'E3', 'E4', 'E5b', 'E5c']
const REPARABLE: EstadoId[] = ['E3', 'E4', 'E5b', 'E5c']
const PROBABLE: EstadoId[] = ['E4', 'E5b', 'E5c']
const REINICIABLE: EstadoId[] = ['E1', 'E2', 'E3', 'E4', 'E5a', 'E5b', 'E5c']

/** Transición pura: un evento no permitido en el estado actual devuelve el mismo estado. */
export function transicion(actual: EstadoMision, evento: Evento): EstadoMision {
  const { estado } = actual
  switch (evento.tipo) {
    case 'OBSERVACION_TERMINADA':
      return estado === 'E1' ? { ...actual, estado: 'E2' } : actual

    case 'ELEGIR_HIPOTESIS':
      if (!INVESTIGANDO.includes(estado)) return actual
      return {
        ...actual,
        hipotesisId: evento.id,
        estado: estado === 'E2' ? 'E3' : estado,
      }

    case 'ELEGIR_OPCION':
      if (!REPARABLE.includes(estado) || actual.hipotesisId === null) return actual
      return { ...actual, opcionId: evento.id, estado: 'E4', edicionSinProbar: true }

    case 'PROBADO': {
      if (!PROBABLE.includes(estado) || !actual.opcionId || !actual.hipotesisId) return actual
      const intento: Intento = {
        opcionId: actual.opcionId,
        hipotesisId: actual.hipotesisId,
        desenlace: evento.desenlace,
        pistasUsadas: actual.pistasVistas,
        hora: evento.hora,
      }
      return {
        ...actual,
        estado: DESENLACE_A_ESTADO[evento.desenlace],
        intentos: [...actual.intentos, intento],
        edicionSinProbar: false,
      }
    }

    case 'REVISAR':
      return estado === 'E5b' || estado === 'E5c' ? { ...actual, estado: 'E2' } : actual

    case 'PEDIR_PISTA':
      if (!INVESTIGANDO.includes(estado) || actual.pistasVistas >= MAX_PISTAS) return actual
      return { ...actual, pistasVistas: actual.pistasVistas + 1 }

    case 'CONTINUAR':
      return estado === 'E5a' ? { ...actual, estado: 'E6' } : actual

    case 'REINICIAR':
      if (!REINICIABLE.includes(estado)) return actual
      return { ...ESTADO_INICIAL, intentos: actual.intentos }
  }
}

/** ¿Se puede pulsar Probar? */
export const puedeProbar = (m: EstadoMision) =>
  PROBABLE.includes(m.estado) && m.opcionId !== null && m.hipotesisId !== null

/** ¿Están habilitadas la barra de reparación (zona D)? */
export const puedeReparar = (m: EstadoMision) =>
  REPARABLE.includes(m.estado) && m.hipotesisId !== null

export const puedePedirPista = (m: EstadoMision) =>
  INVESTIGANDO.includes(m.estado) && m.pistasVistas < MAX_PISTAS
