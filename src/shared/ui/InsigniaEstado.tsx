import { Icono, type NombreIcono } from './Icono'
import estilos from './InsigniaEstado.module.css'

/** Estados de la zona F, con los textos e iconos de la primera versión. */
export type EstadoEjecucion = 'detenido' | 'enEjecucion' | 'resuelto' | 'conError'

const CONFIG: Record<EstadoEjecucion, { texto: string; icono: NombreIcono }> = {
  detenido: { texto: 'Detenido', icono: 'pausa' },
  enEjecucion: { texto: 'En ejecución', icono: 'jugar' },
  resuelto: { texto: 'Resuelto', icono: 'check' },
  conError: { texto: 'Con error', icono: 'error' },
}

type Props = {
  estado: EstadoEjecucion
  /** Icono alterno para «Con error» (alerta = incompleto, error = sin cambio). */
  iconoError?: 'alerta' | 'error'
  className?: string
}

/** Icono + texto + color (WCAG 1.4.1). Se anuncia al cambiar. */
export function InsigniaEstado({ estado, iconoError = 'error', className }: Props) {
  const { texto, icono } = CONFIG[estado]
  return (
    <span
      className={[estilos.insignia, estilos[estado], className].filter(Boolean).join(' ')}
      role="status"
    >
      <Icono nombre={estado === 'conError' ? iconoError : icono} />
      <span>{texto}</span>
    </span>
  )
}
