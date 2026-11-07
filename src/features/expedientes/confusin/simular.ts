import type { PasoSimulacion, ResultadoSimulacion } from '../contrato'

type Destino = 'Norte' | 'Sur'

export const PEDIDOS: Destino[] = ['Norte', 'Sur', 'Norte', 'Sur']

const CONDICIONES: Record<string, (destino: Destino) => boolean> = {
  norte: (d) => d === 'Norte',
  verdadero: () => true,
  sur: (d) => d === 'Sur',
}

/** para cada pedido: si (condición) enviar al Norte, si no al Sur. */
export function simularConfusin(opcionId: string): ResultadoSimulacion {
  const condicion = CONDICIONES[opcionId]
  if (!condicion) throw new Error(`Opción desconocida en Confusín: ${opcionId}`)

  let bien = 0
  let mal = 0
  const pasos: PasoSimulacion[] = PEDIDOS.map((destino, i) => {
    const enviadoA: Destino = condicion(destino) ? 'Norte' : 'Sur'
    const acierto = enviadoA === destino
    if (acierto) bien++
    else mal++
    return { elemento: i, efecto: acierto ? 'ok' : 'mal', contadores: { bien, mal } }
  })
  return {
    pasos,
    contadores: { bien, mal },
    terminado: true,
    fallo: false,
    vueltas: PEDIDOS.length,
  }
}

export function confusinEsCorrecto(r: ResultadoSimulacion) {
  return r.contadores.bien === PEDIDOS.length
}
