import type { PasoSimulacion, ResultadoSimulacion } from '../contrato'

export const TOTAL_PAQUETES = 4
/** Si el ciclo pasa de estas vueltas se corta y se marca como ciclo sin fin. */
export const LIMITE_VUELTAS = 12

type Condicion = (entregados: number, pendientes: number) => boolean

const CONDICIONES: Record<string, Condicion> = {
  verdadero: () => true,
  pendientes: (_entregados, pendientes) => pendientes > 0,
  menos2: (entregados) => entregados < 2,
}

/** repetir mientras (condición): entregar paquete. */
export function simularLoopi(opcionId: string): ResultadoSimulacion {
  const condicion = CONDICIONES[opcionId]
  if (!condicion) throw new Error(`Opción desconocida en Loopi: ${opcionId}`)

  let entregados = 0
  let vueltas = 0
  const pasos: PasoSimulacion[] = []
  const contadores = () => ({ entregados, pendientes: TOTAL_PAQUETES - entregados })

  while (condicion(entregados, TOTAL_PAQUETES - entregados)) {
    if (vueltas === LIMITE_VUELTAS) {
      return { pasos, contadores: contadores(), terminado: false, fallo: false, vueltas }
    }
    vueltas++
    if (entregados < TOTAL_PAQUETES) {
      entregados++
      pasos.push({ elemento: entregados - 1, efecto: 'ok', contadores: contadores() })
    } else {
      pasos.push({ elemento: null, efecto: 'vacio', contadores: contadores() })
    }
  }
  return { pasos, contadores: contadores(), terminado: true, fallo: false, vueltas }
}

export function loopiEsCorrecto(r: ResultadoSimulacion) {
  return r.terminado && r.contadores.entregados === TOTAL_PAQUETES && r.contadores.pendientes === 0
}
