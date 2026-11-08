import { useEffect, useRef, type ReactNode } from 'react'
import { Icono, type NombreIcono } from './Icono'
import estilos from './MensajeCentrado.module.css'

type Props = {
  icono: NombreIcono
  titulo: string
  /** Texto breve bajo el título. */
  children: ReactNode
  /** Botones de la pantalla; se centran en una fila. */
  acciones: ReactNode
}

/**
 * Pantalla de mensaje con un ícono, un título, un texto y botones: confirmaciones
 * (Salir, Reiniciar progreso) y despedidas. El foco entra en el título al aparecer,
 * así un lector de pantalla anuncia la pregunta antes que los botones.
 */
export function MensajeCentrado({ icono, titulo, children, acciones }: Props) {
  const tituloRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => tituloRef.current?.focus(), [titulo])

  return (
    <div className={estilos.cuerpo}>
      <div className={estilos.icono} aria-hidden="true">
        <Icono nombre={icono} />
      </div>
      <h1 ref={tituloRef} tabIndex={-1} className={estilos.titulo}>
        {titulo}
      </h1>
      <p>{children}</p>
      <div className={estilos.acciones}>{acciones}</div>
    </div>
  )
}
