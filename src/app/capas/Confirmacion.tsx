import { Boton, Capa } from '@/shared'
import estilos from './capas.module.css'

type Props = {
  /** Confirmar: abandona la misión y vuelve al mapa de casos. */
  onSalir: () => void
  /** Cancelar: cierra el aviso y sigue en la misión. */
  onCancelar: () => void
}

/** O4 Confirmación (HU15): avisa antes de salir con una corrección sin probar. */
export function Confirmacion({ onSalir, onCancelar }: Props) {
  return (
    <Capa titulo="¿Salir sin probar?" onCerrar={onCancelar}>
      <p className={estilos.texto}>
        Tienes una corrección elegida que todavía no probaste. Si sales ahora, se perderá.
      </p>
      <div className={estilos.acciones}>
        <Boton variante="primario" icono="atras" onClick={onCancelar}>
          Seguir en la misión
        </Boton>
        <Boton icono="salir" onClick={onSalir}>
          Salir de todos modos
        </Boton>
      </div>
    </Capa>
  )
}
