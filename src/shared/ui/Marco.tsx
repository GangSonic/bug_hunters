import { useEffect, useRef, type ReactNode } from 'react'
import estilos from './Marco.module.css'

type Props = {
  titulo?: string
  subtitulo?: string
  izquierda?: ReactNode
  derecha?: ReactNode
  children: ReactNode
}

/**
 * Marco de pantalla (.frame) con cabecera opcional (.scr-head).
 * Al montarse mueve el foco al título para que el lector de pantalla anuncie la pantalla.
 */
export function Marco({ titulo, subtitulo, izquierda, derecha, children }: Props) {
  const tituloRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    tituloRef.current?.focus()
  }, [titulo])

  return (
    <section className={estilos.frame} aria-labelledby={titulo ? 'titulo-pantalla' : undefined}>
      {titulo && (
        <header className={estilos.cabecera}>
          {izquierda ?? <span className={estilos.espaciador} />}
          <div className={estilos.mid}>
            <h1 id="titulo-pantalla" ref={tituloRef} tabIndex={-1} className={estilos.titulo}>
              {titulo}
            </h1>
            {subtitulo && <p className={estilos.subtitulo}>{subtitulo}</p>}
          </div>
          {derecha ?? <span className={estilos.espaciador} />}
        </header>
      )}
      {children}
    </section>
  )
}
