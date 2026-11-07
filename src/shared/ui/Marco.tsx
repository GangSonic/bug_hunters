import { useEffect, useRef, type ReactNode } from 'react'
import estilos from './Marco.module.css'

type Props = {
  titulo?: string
  subtitulo?: string
  izquierda?: ReactNode
  derecha?: ReactNode
  children: ReactNode
  /** Mueve el foco al título al montarse, para que el lector de pantalla anuncie la pantalla. */
  enfocarTitulo?: boolean
}

/** Marco común de las pantallas P1–P7: cabecera con navegación y cuerpo. */
export function Marco({
  titulo,
  subtitulo,
  izquierda,
  derecha,
  children,
  enfocarTitulo = true,
}: Props) {
  const tituloRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (enfocarTitulo) tituloRef.current?.focus()
  }, [enfocarTitulo, titulo])

  return (
    <section className={estilos.marco} aria-labelledby={titulo ? 'titulo-pantalla' : undefined}>
      {titulo && (
        <header className={estilos.cabecera}>
          <div className={estilos.izquierda}>{izquierda}</div>
          <div className={estilos.centro}>
            <h1 id="titulo-pantalla" ref={tituloRef} tabIndex={-1} className={estilos.titulo}>
              {titulo}
            </h1>
            {subtitulo && <p className={estilos.subtitulo}>{subtitulo}</p>}
          </div>
          <div className={estilos.derecha}>{derecha}</div>
        </header>
      )}
      {children}
    </section>
  )
}
