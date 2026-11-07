import type { PasoSimulacion, ResultadoSimulacion } from '../contrato'

/** null = un pedido que nunca se registró. No es 0 ni un texto vacío. */
export const PEDIDOS: Array<number | null> = [1, 2, null, 4]

type Estrategia = 'sinRevisar' | 'siExiste' | 'avisar'

function esEstrategia(id: string): id is Estrategia {
  return id === 'sinRevisar' || id === 'siExiste' || id === 'avisar'
}

/** para cada pedido de la lista: (estrategia). */
export function simularNullito(opcionId: string): ResultadoSimulacion {
  if (!esEstrategia(opcionId)) throw new Error(`Opción desconocida en Nullito: ${opcionId}`)

  const total = PEDIDOS.length
  let atendidos = 0
  const pasos: PasoSimulacion[] = []
  const contadores = () => ({ atendidos, sinAtender: total - atendidos })

  for (const [i, pedido] of PEDIDOS.entries()) {
    if (pedido !== null) {
      atendidos++
      pasos.push({ elemento: i, efecto: 'ok', contadores: contadores() })
      continue
    }
    if (opcionId === 'sinRevisar') {
      pasos.push({ elemento: i, efecto: 'fallo', contadores: contadores() })
      return { pasos, contadores: contadores(), terminado: false, fallo: true, vueltas: i + 1 }
    }
    if (opcionId === 'avisar') {
      atendidos++
      pasos.push({ elemento: i, efecto: 'aviso', contadores: contadores() })
    } else {
      pasos.push({ elemento: i, efecto: 'omitido', contadores: contadores() })
    }
  }
  return { pasos, contadores: contadores(), terminado: true, fallo: false, vueltas: total }
}

export function nullitoEsCorrecto(r: ResultadoSimulacion) {
  return !r.fallo && r.contadores.atendidos === PEDIDOS.length
}
