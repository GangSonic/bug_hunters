import type { RegistroPiloto } from '../tipos'

const COLUMNAS = ['codigo', 'caso', 'hipotesis', 'correccion', 'desenlace', 'pistas', 'hora']

/** Entrecomilla un campo solo si contiene coma, comillas o salto de línea (formato CSV). */
function escapar(valor: string): string {
  return /[",\n]/.test(valor) ? `"${valor.replace(/"/g, '""')}"` : valor
}

/** Convierte los registros del piloto en un CSV, una fila por intento. */
export function aCsv(codigo: string, registros: RegistroPiloto[]): string {
  const filas = registros.map((r) =>
    [codigo, r.caso, r.hipotesisId, r.opcionId, r.desenlace, String(r.pistasUsadas), r.hora]
      .map(escapar)
      .join(','),
  )
  return [COLUMNAS.join(','), ...filas].join('\n')
}
