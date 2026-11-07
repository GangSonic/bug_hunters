import { Icono, type NombreIcono } from './Icono'
import estilos from './InsigniaEstado.module.css'

export type EstadoEjecucion = 'enEjecucion' | 'detenido' | 'resuelto' | 'listo'

const CONFIG: Record<EstadoEjecucion, { texto: string; icono: NombreIcono }> = {
  enEjecucion: { texto: 'En ejecución', icono: 'jugar' },
  detenido: { texto: 'Detenido', icono: 'detener' },
  resuelto: { texto: 'Resuelto', icono: 'check' },
  listo: { texto: 'Listo para probar', icono: 'pausa' },
}

/** Zona F: icono + texto + color (WCAG 1.4.1). Se anuncia al cambiar. */
export function InsigniaEstado({ estado }: { estado: EstadoEjecucion }) {
  const { texto, icono } = CONFIG[estado]
  return (
    <span className={`${estilos.insignia} ${estilos[estado]}`} role="status">
      <Icono nombre={icono} tamano={13} />
      <span>{texto}</span>
    </span>
  )
}
