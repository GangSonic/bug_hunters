import { useEffect, useRef, type ReactNode } from 'react'
import { useTecla } from '../hooks/useTecla'
import { Boton } from './Boton'
import estilos from './Capa.module.css'

type Props = {
  titulo: string
  onCerrar: () => void
  children: ReactNode
}

/**
 * Capa superpuesta (O1–O4): la pantalla de fondo sigue montada debajo.
 * Esc cierra; el foco entra en la capa al abrirse y vuelve al control anterior al cerrarse.
 */
export function Capa({ titulo, onCerrar, children }: Props) {
  const capaRef = useRef<HTMLDivElement>(null)
  useTecla('Escape', onCerrar)

  useEffect(() => {
    const anterior = document.activeElement as HTMLElement | null
    capaRef.current?.focus()
    return () => anterior?.focus()
  }, [])

  return (
    <div
      className={estilos.fondo}
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onCerrar()}
    >
      <div
        ref={capaRef}
        className={estilos.capa}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-capa"
        tabIndex={-1}
      >
        <div className={estilos.cabecera}>
          <h2 id="titulo-capa" className={estilos.titulo}>
            {titulo}
          </h2>
          <Boton variante="pill" icono="cerrar" onClick={onCerrar} aria-label="Cerrar">
            Cerrar
          </Boton>
        </div>
        <div className={estilos.cuerpo}>{children}</div>
      </div>
    </div>
  )
}
