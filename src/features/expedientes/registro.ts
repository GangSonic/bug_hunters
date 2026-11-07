import { cambion } from './cambion/datos'
import { confusin } from './confusin/datos'
import type { CasoId, Expediente, Mundo, MundoId } from './contrato'
import { loopi } from './loopi/datos'
import { nullito } from './nullito/datos'

/** Agregar un caso nuevo = una carpeta más y una línea aquí (RNF10). */
export const EXPEDIENTES: readonly Expediente[] = [loopi, confusin, nullito, cambion]

export const MUNDOS: readonly Mundo[] = [
  { id: 'control', nombre: 'Zona de Control', descripcion: 'Gestión de paquetes y entregas.' },
  { id: 'datos', nombre: 'Laboratorio de Datos', descripcion: 'Información, conteos y registros.' },
]

export function obtenerExpediente(id: CasoId): Expediente {
  const expediente = EXPEDIENTES.find((e) => e.id === id)
  if (!expediente) throw new Error(`Expediente desconocido: ${id}`)
  return expediente
}

export function expedientesDelMundo(mundo: MundoId): Expediente[] {
  return EXPEDIENTES.filter((e) => e.mundo === mundo)
}

export function obtenerMundo(id: MundoId): Mundo {
  const mundo = MUNDOS.find((m) => m.id === id)
  if (!mundo) throw new Error(`Mundo desconocido: ${id}`)
  return mundo
}
