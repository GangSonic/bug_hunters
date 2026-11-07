import type { PasoSimulacion, ResultadoSimulacion } from '../contrato'

export const TOTAL_CAJAS = 4

const ACTUALIZACIONES: Record<string, (total: number) => number> = {
  asignar1: () => 1,
  mas2: (total) => total + 2,
  mas1: (total) => total + 1,
}

/** total ← 0; para cada caja: (actualización). */
export function simularCambion(opcionId: string): ResultadoSimulacion {
  const actualizar = ACTUALIZACIONES[opcionId]
  if (!actualizar) throw new Error(`Opción desconocida en Cambión: ${opcionId}`)

  let total = 0
  const pasos: PasoSimulacion[] = []
  for (let i = 0; i < TOTAL_CAJAS; i++) {
    total = actualizar(total)
    pasos.push({ elemento: i, efecto: 'ok', contadores: { total, cajas: i + 1 } })
  }
  return {
    pasos,
    contadores: { total, cajas: TOTAL_CAJAS },
    terminado: true,
    fallo: false,
    vueltas: TOTAL_CAJAS,
  }
}

export function cambionEsCorrecto(r: ResultadoSimulacion) {
  return r.contadores.total === TOTAL_CAJAS && r.contadores.cajas === TOTAL_CAJAS
}
