import type { Expediente } from '@/features/expedientes'
import type { EstadoId } from '../logic/maquinaEstados'

/**
 * Huecos de PantallaMision. Otras features (ayuda, resultado) conectan sus componentes
 * desde `App.tsx` sin que `mision` las importe. Todos son opcionales: sin ellos la pantalla
 * se comporta como hasta ahora.
 */

/** Lo que PantallaMision informa cuando se pulsa Volver (HU15, CA15.3). */
export type SalidaMision = {
  /** Hay una opción elegida que todavía no se probó. */
  edicionSinProbar: boolean
}

/** Parte de la pantalla de misión que el tutorial puede resaltar con un aro. */
export type ZonaTutorial = 'escena' | 'causa' | 'correccion' | 'probar'

/** Qué recibe el tutorial (HU16, CA04.3). Ocupa el lugar de la barra de resultado antes de la primera prueba. */
export type ContextoTutorial = {
  caso: Expediente
  /** Uno de E1 a E4: el tutorial se muestra mientras no se haya probado nada. */
  estado: EstadoId
  reproduciendo: boolean
  /** Todavía no se terminó el tutorial en ninguna misión. */
  primeraVez: boolean
  /** Termina de golpe la animación de la anomalía. */
  omitirObservacion: () => void
  /** Pasa de E1 a E2. No marca el tutorial como visto: eso lo decide quien lo muestra. */
  terminarObservacion: () => void
  /** Resalta una parte de la pantalla; `null` quita el aro. El tutorial lo apaga al desmontarse. */
  enfocar: (zona: ZonaTutorial | null) => void
}

/** Qué recibe la recuperación (HU08, CA08.1). Ocupa el lugar del botón Continuar en E5a. */
export type ContextoRecuperacion = {
  caso: Expediente
  /** Pasa a E6 y abre la pantalla de resultado. */
  continuar: () => void
}
