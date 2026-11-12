import { Boton, Capa } from '@/shared'
import estilos from './capas.module.css'

type Props = {
  /** Reanudar: cierra la pausa y vuelve a la misión. */
  onReanudar: () => void
  /** Salir al mapa de casos (pasa por la confirmación O4 si hay una edición sin probar). */
  onSalir: () => void
}

/** O1 Pausa (HU15): detiene la misión y ofrece reanudar o salir. */
export function Pausa({ onReanudar, onSalir }: Props) {
  return (
    <Capa titulo="Misión en pausa" onCerrar={onReanudar}>
      <p className={estilos.texto}>La misión está detenida. ¿Qué quieres hacer?</p>
      <div className={estilos.acciones}>
        <Boton variante="primario" icono="jugar" onClick={onReanudar}>
          Reanudar
        </Boton>
        <Boton icono="salir" onClick={onSalir}>
          Salir al mapa
        </Boton>
      </div>
    </Capa>
  )
}
