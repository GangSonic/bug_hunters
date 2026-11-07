import type { Desenlace, Expediente, ResultadoSimulacion } from '../contrato'

export interface Evaluacion {
  resultado: ResultadoSimulacion
  desenlace: Desenlace
}

function mismoComportamiento(a: ResultadoSimulacion, b: ResultadoSimulacion) {
  if (a.terminado !== b.terminado || a.fallo !== b.fallo) return false
  const claves = new Set([...Object.keys(a.contadores), ...Object.keys(b.contadores)])
  for (const clave of claves) {
    if (a.contadores[clave] !== b.contadores[clave]) return false
  }
  return true
}

/**
 * Simula una opción y decide su desenlace:
 * correcto si cumple el objetivo, sinCambio si se comporta igual que la anomalía
 * y incompleto en cualquier otro caso.
 */
export function evaluar(expediente: Expediente, opcionId: string): Evaluacion {
  const resultado = expediente.simular(opcionId)
  if (expediente.esCorrecto(resultado)) return { resultado, desenlace: 'correcto' }
  const anomalia = expediente.simular(expediente.opcionAnomalia)
  return {
    resultado,
    desenlace: mismoComportamiento(resultado, anomalia) ? 'sinCambio' : 'incompleto',
  }
}
