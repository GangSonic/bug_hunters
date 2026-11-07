import type { ComponentType } from 'react'

/** Contrato que cumple cada expediente. El motor de misión solo conoce este tipo (RNF10). */

export type CasoId = 'loopi' | 'confusin' | 'nullito' | 'cambion'
export type MundoId = 'control' | 'datos'

/** E5a, E5b y E5c del Capítulo IV. */
export type Desenlace = 'correcto' | 'incompleto' | 'sinCambio'

/** Qué le pasa a un elemento de la escena en una vuelta de la simulación. */
export type EfectoPaso = 'ok' | 'mal' | 'vacio' | 'fallo' | 'aviso' | 'omitido'

export interface PasoSimulacion {
  /** Índice del elemento afectado; null si la vuelta no toca ninguno (repetición vacía). */
  elemento: number | null
  efecto: EfectoPaso
  contadores: Record<string, number>
}

export interface ResultadoSimulacion {
  pasos: PasoSimulacion[]
  contadores: Record<string, number>
  /** El proceso terminó por sí solo. false = ciclo sin fin cortado o fallo. */
  terminado: boolean
  /** El proceso se detuvo por un error, por ejemplo al usar un dato ausente. */
  fallo: boolean
  vueltas: number
}

export interface Opcion {
  id: string
  texto: string
}

export interface Hipotesis {
  id: string
  texto: string
  esCausa: boolean
}

export interface Mensaje {
  titulo: string
  cuerpo: string
}

export interface DefContador {
  id: string
  etiqueta: string
  /** Muestra «n / total». */
  deTotal?: boolean
}

export interface PropsEscena {
  /** Pasos ya reproducidos de la simulación en curso. */
  pasos: PasoSimulacion[]
  reproduciendo: boolean
  desenlace: Desenlace | null
}

export interface Expediente {
  id: CasoId
  numero: string
  mundo: MundoId
  criatura: string
  /** Ruta dentro de public/. */
  sprite: string
  titulo: string
  /** Descripción de una línea para P3. */
  problema: string
  objetivo: string
  saludo: string
  intro: string
  /** Regla en pseudocódigo; '___' marca el hueco que repara el jugador. */
  regla: string[]
  total: number
  contadores: DefContador[]
  preguntaHipotesis: string
  hipotesis: [Hipotesis, Hipotesis, Hipotesis]
  preguntaReparacion: string
  /** Indicación breve bajo la pregunta de reparación (por ejemplo, «Elige la condición del ciclo.»). */
  indicacionReparacion: string
  /** Exactamente 3: la anomalía (regla inicial), una parcial y una correcta. */
  opciones: [Opcion, Opcion, Opcion]
  opcionAnomalia: string
  pistas: [string, string, string]
  /** Mensaje que ve el jugador tras probar cada opción, por id de opción. */
  mensajes: Record<string, Mensaje>
  concepto: string
  terminoIngles: string
  ficha: { senal: string; causa: string; solucion: string }
  simular: (opcionId: string) => ResultadoSimulacion
  /** Objetivo verificable de la misión (Backlog v2, 8.2). Detener la animación no basta. */
  esCorrecto: (resultado: ResultadoSimulacion) => boolean
  Escena: ComponentType<PropsEscena>
}

export interface Mundo {
  id: MundoId
  nombre: string
  descripcion: string
}
