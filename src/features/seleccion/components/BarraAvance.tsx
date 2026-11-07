import { useCantidadResueltos } from '@/features/progreso'
import estilos from './Seleccion.module.css'

export function BarraAvance() {
  const resueltos = useCantidadResueltos()
  return (
    <div className={estilos.progreso}>
      <span>{resueltos} de 4 casos resueltos</span>
      <div
        className={estilos.barra}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={resueltos}
        aria-label="Casos resueltos"
      >
        <span style={{ width: `${(resueltos / 4) * 100}%` }} />
      </div>
    </div>
  )
}
