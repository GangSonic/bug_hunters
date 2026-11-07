import { useState } from 'react'
import { useCantidadResueltos } from '@/features/progreso'
import { Boton, Icono, Marco, rutaPublica } from '@/shared'
import estilos from './Inicio.module.css'

type Props = {
  onJugar: () => void
  onConfiguracion: () => void
}

/** P1 Inicio y despedida (HU02). */
export function Inicio({ onJugar, onConfiguracion }: Props) {
  const resueltos = useCantidadResueltos()
  const [despedida, setDespedida] = useState(false)

  if (despedida) {
    return (
      <Marco titulo="¡Gracias por jugar!">
        <div className={estilos.despedida}>
          <p>
            Cerraste el laboratorio. Tu progreso queda guardado en este navegador; ya puedes cerrar
            la pestaña o volver cuando quieras.
          </p>
          <Boton variante="primario" icono="inicio" onClick={() => setDespedida(false)}>
            Volver al inicio
          </Boton>
        </div>
      </Marco>
    )
  }

  return (
    <Marco>
      <div className={estilos.portada}>
        <div className={estilos.izquierda}>
          <h1 className={estilos.logo}>
            Bug
            <br />
            <span>Hunters</span>
          </h1>
          <p className={estilos.subtitulo}>
            <Icono nombre="bicho" tamano={18} /> Laboratorio de Bugs
          </p>
          <p className={estilos.lema}>Cada error es un misterio.</p>
          <div className={estilos.menu}>
            {/* oxlint-disable-next-line jsx-a11y/no-autofocus -- CA02.1: Jugar recibe el foco al abrir */}
            <Boton variante="primario" grande icono="jugar" onClick={onJugar} autoFocus>
              Jugar
            </Boton>
            <Boton icono="engrane" onClick={onConfiguracion}>
              Configuración
            </Boton>
            <Boton icono="salir" onClick={() => setDespedida(true)}>
              Salir
            </Boton>
          </div>
          <p className={estilos.avance}>
            {resueltos > 0 ? `${resueltos} de 4 casos resueltos` : '2 mundos · 4 casos'}
          </p>
        </div>
        <div className={estilos.derecha} aria-hidden="true">
          <span
            className={estilos.interrogacion}
            style={{ top: '14%', left: '14%', fontSize: '1.4rem' }}
          >
            ?
          </span>
          <span
            className={estilos.interrogacion}
            style={{ top: '20%', right: '16%', fontSize: '1.8rem' }}
          >
            ?
          </span>
          <span
            className={estilos.interrogacion}
            style={{ bottom: '18%', left: '22%', fontSize: '1.2rem' }}
          >
            ?
          </span>
          <img src={rutaPublica('sprites/loopi.png')} alt="" />
        </div>
      </div>
    </Marco>
  )
}
