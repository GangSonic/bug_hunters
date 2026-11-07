import { useEffect, useRef, useState } from 'react'
import { useCantidadResueltos } from '@/features/progreso'
import { Boton, Icono, Marco, rutaPublica } from '@/shared'
import estilos from './Inicio.module.css'

type Props = {
  onJugar: () => void
  onConfiguracion: () => void
}

type Vista = 'portada' | 'confirmarSalida' | 'despedida'

/** P1 Inicio, con la confirmación de Salir y la despedida (HU02). */
export function Inicio({ onJugar, onConfiguracion }: Props) {
  const resueltos = useCantidadResueltos()
  const [vista, setVista] = useState<Vista>('portada')

  if (vista === 'confirmarSalida') {
    return (
      <Marco>
        <div className={estilos.salirBody}>
          <div className={estilos.salirIco} aria-hidden="true">
            <Icono nombre="salir" />
          </div>
          <TituloEnfocado>¿Salir del laboratorio?</TituloEnfocado>
          <p>Tu progreso queda guardado en este navegador; puedes volver cuando quieras.</p>
          <div className={estilos.salirActions}>
            <Boton variante="primario" onClick={() => setVista('despedida')}>
              Salir
            </Boton>
            <Boton onClick={() => setVista('portada')}>Seguir jugando</Boton>
          </div>
        </div>
      </Marco>
    )
  }

  if (vista === 'despedida') {
    return (
      <Marco>
        <div className={estilos.salirBody}>
          <div className={estilos.salirIco} aria-hidden="true">
            <Icono nombre="check" />
          </div>
          <TituloEnfocado>¡Gracias por jugar!</TituloEnfocado>
          <p>
            Cerraste el laboratorio. Ya puedes cerrar la pestaña, o volver a empezar cuando quieras.
          </p>
          <Boton
            variante="primario"
            onClick={() => setVista('portada')}
            style={{ maxWidth: 220, margin: '0 auto' }}
          >
            Volver al inicio
          </Boton>
        </div>
      </Marco>
    )
  }

  return (
    <Marco>
      <div className={estilos.hero}>
        <div className={estilos.heroLeft}>
          <h1 className={estilos.logo}>
            Bug
            <br />
            <span>Hunters</span>
          </h1>
          <p className={estilos.sub}>
            <Icono nombre="bicho" tamano={18} /> Laboratorio de Bugs
          </p>
          <p className={estilos.tag}>Cada error es un misterio.</p>
          <div className={estilos.menu}>
            {/* oxlint-disable-next-line jsx-a11y/no-autofocus -- CA02.1: Jugar recibe el foco al abrir */}
            <button
              type="button"
              className={`${estilos.mbtn} ${estilos.play}`}
              onClick={onJugar}
              autoFocus
            >
              <Icono nombre="jugar" /> Jugar
            </button>
            <button type="button" className={estilos.mbtn} onClick={onConfiguracion}>
              <Icono nombre="engrane" /> Configuración
            </button>
            <button
              type="button"
              className={estilos.mbtn}
              onClick={() => setVista('confirmarSalida')}
            >
              <Icono nombre="salir" /> Salir
            </button>
          </div>
          <p className={estilos.foot}>
            {resueltos > 0 ? `${resueltos} de 4 casos resueltos` : '2 mundos · 4 casos'}
          </p>
        </div>
        <div className={estilos.heroRight} aria-hidden="true">
          <span className={estilos.qb} style={{ top: '14%', left: '14%', fontSize: '1.4rem' }}>
            ?
          </span>
          <span className={estilos.qb} style={{ top: '20%', right: '16%', fontSize: '1.8rem' }}>
            ?
          </span>
          <span className={estilos.qb} style={{ bottom: '18%', left: '22%', fontSize: '1.2rem' }}>
            ?
          </span>
          <img src={rutaPublica('sprites/loopi.png')} alt="" />
        </div>
      </div>
    </Marco>
  )
}

/** Título de la vista de Salir que recibe el foco al aparecer. */
function TituloEnfocado({ children }: { children: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  useEffect(() => ref.current?.focus(), [children])
  return (
    <h1 ref={ref} tabIndex={-1} className={estilos.salirTitulo}>
      {children}
    </h1>
  )
}
