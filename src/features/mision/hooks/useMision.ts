import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { useConfiguracion } from '@/features/configuracion'
import {
  evaluar,
  type Desenlace,
  type Expediente,
  type PasoSimulacion,
  type ResultadoSimulacion,
} from '@/features/expedientes'
import { useProgreso } from '@/features/progreso'
import { useMovimientoReducido, type EstadoEjecucion } from '@/shared'
import { ESTADO_INICIAL, transicion } from '../logic/maquinaEstados'

export const MS_POR_PASO = 480

interface Reproduccion {
  origen: 'observacion' | 'prueba'
  resultado: ResultadoSimulacion
  desenlace: Desenlace
  opcionId: string
  /** Pasos ya mostrados en la escena. */
  mostrados: number
}

function crearReproduccion(
  expediente: Expediente,
  origen: Reproduccion['origen'],
  opcionId: string,
  instantaneo: boolean,
): Reproduccion {
  const { resultado, desenlace } = evaluar(expediente, opcionId)
  return {
    origen,
    resultado,
    desenlace,
    opcionId,
    mostrados: instantaneo ? resultado.pasos.length : 0,
  }
}

/**
 * Une la máquina de estados (lógica pura) con la reproducción animada de la escena.
 * El componente que lo usa se monta con key={casoId}, así cada caso empieza limpio.
 */
export function useMision(expediente: Expediente) {
  const [mision, despachar] = useReducer(transicion, ESTADO_INICIAL)
  const animacionesConfig = useConfiguracion((s) => s.animaciones)
  const movimientoReducido = useMovimientoReducido()
  const marcarResuelto = useProgreso((s) => s.marcarResuelto)
  const instantaneo = !animacionesConfig || movimientoReducido
  const temporizador = useRef<number | undefined>(undefined)

  // E1: al entrar, la escena ejecuta sola la anomalía (CA04.2).
  const [reproduccion, setReproduccion] = useState<Reproduccion | null>(() =>
    crearReproduccion(expediente, 'observacion', expediente.opcionAnomalia, instantaneo),
  )

  const iniciar = useCallback(
    (origen: Reproduccion['origen'], opcionId: string) => {
      setReproduccion(crearReproduccion(expediente, origen, opcionId, instantaneo))
    },
    [expediente, instantaneo],
  )

  // Avanza un paso cada MS_POR_PASO mientras quede animación.
  const reproduciendo =
    reproduccion !== null && reproduccion.mostrados < reproduccion.resultado.pasos.length
  useEffect(() => {
    if (!reproduciendo) return
    temporizador.current = window.setTimeout(() => {
      setReproduccion((r) => (r ? { ...r, mostrados: r.mostrados + 1 } : r))
    }, MS_POR_PASO)
    return () => window.clearTimeout(temporizador.current)
  }, [reproduciendo, reproduccion?.mostrados])

  // Al terminar una prueba, la máquina de estados recibe su desenlace.
  const yaNotificado = useRef<Reproduccion | null>(null)
  useEffect(() => {
    if (!reproduccion || reproduciendo || yaNotificado.current === reproduccion) return
    yaNotificado.current = reproduccion
    if (reproduccion.origen === 'prueba') {
      // DAAF-01 (Decisión A): la hipótesis elegida debe ser la causa para que el caso resuelva.
      const hipotesisEsCausa =
        expediente.hipotesis.find((h) => h.id === mision.hipotesisId)?.esCausa ?? false
      despachar({
        tipo: 'PROBADO',
        desenlace: reproduccion.desenlace,
        hipotesisEsCausa,
        hora: new Date().toISOString(),
      })
      if (reproduccion.desenlace === 'correcto' && hipotesisEsCausa) marcarResuelto(expediente.id)
    }
  }, [reproduccion, reproduciendo, expediente, mision.hipotesisId, marcarResuelto])

  const probar = useCallback(() => {
    if (mision.opcionId) iniciar('prueba', mision.opcionId)
  }, [mision.opcionId, iniciar])

  const reiniciar = useCallback(() => {
    window.clearTimeout(temporizador.current)
    despachar({ tipo: 'REINICIAR' })
    iniciar('observacion', expediente.opcionAnomalia)
  }, [expediente.opcionAnomalia, iniciar])

  const omitirObservacion = useCallback(() => {
    setReproduccion((r) => (r ? { ...r, mostrados: r.resultado.pasos.length } : r))
  }, [])

  const pasosMostrados: PasoSimulacion[] = reproduccion
    ? reproduccion.resultado.pasos.slice(0, reproduccion.mostrados)
    : []

  // Zona F con los estados de la primera versión: Detenido, En ejecución, Resuelto, Con error.
  const estadoEjecucion: EstadoEjecucion = (() => {
    if (reproduciendo) return 'enEjecucion'
    if (mision.estado === 'E5a' || mision.estado === 'E6') return 'resuelto'
    if (reproduccion?.origen === 'prueba' && reproduccion.desenlace !== 'correcto')
      return 'conError'
    return 'detenido'
  })()
  const iconoError: 'alerta' | 'error' =
    reproduccion?.desenlace === 'incompleto' ? 'alerta' : 'error'

  return {
    mision,
    despachar,
    reproduccion,
    reproduciendo,
    pasosMostrados,
    estadoEjecucion,
    iconoError,
    probar,
    reiniciar,
    omitirObservacion,
    /** Desenlace que la escena refleja: null mientras corre y durante la observación (camina). */
    desenlaceVisible:
      reproduciendo || reproduccion?.origen !== 'prueba' ? null : reproduccion.desenlace,
  }
}
