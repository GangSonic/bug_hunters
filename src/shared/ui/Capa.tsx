import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { useTecla } from '../hooks/useTecla'
import { Boton } from './Boton'
import estilos from './Capa.module.css'

type Props = {
  titulo: string
  onCerrar: () => void
  children: ReactNode
}

const ENFOCABLES = 'button:enabled, a[href], input:enabled, select:enabled, textarea:enabled'

/**
 * Capa superpuesta (O1–O4): la pantalla de fondo sigue montada debajo.
 * Esc cierra; el foco entra en la capa al abrirse, no sale de ella mientras está abierta
 * (Tab y Mayús+Tab dan la vuelta) y vuelve al control anterior al cerrarse.
 */
export function Capa({ titulo, onCerrar, children }: Props) {
  const capaRef = useRef<HTMLDivElement>(null)
  useTecla('Escape', onCerrar)

  useEffect(() => {
    const anterior = document.activeElement as HTMLElement | null
    capaRef.current?.focus()

    // Si algo enfoca un control del fondo (un clic con lector de pantalla, un foco
    // programático), el foco vuelve a la capa.
    const alEnfocar = (e: FocusEvent) => {
      const capa = capaRef.current
      if (capa && e.target instanceof Node && !capa.contains(e.target)) capa.focus()
    }
    document.addEventListener('focusin', alEnfocar)

    return () => {
      document.removeEventListener('focusin', alEnfocar)
      anterior?.focus()
    }
  }, [])

  // Tab y Mayús+Tab dan la vuelta dentro de la capa en lugar de pasar al fondo.
  const alPulsarTab = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return
    const controles = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(ENFOCABLES))
    const primero = controles[0]
    const ultimo = controles[controles.length - 1]
    if (!primero || !ultimo) return e.preventDefault()

    const activo = document.activeElement
    const enLaCapa = activo === e.currentTarget
    if (e.shiftKey && (activo === primero || enLaCapa)) {
      e.preventDefault()
      ultimo.focus()
    } else if (!e.shiftKey && activo === ultimo) {
      e.preventDefault()
      primero.focus()
    }
  }

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
        onKeyDown={alPulsarTab}
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
