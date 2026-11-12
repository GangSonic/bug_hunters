import { useEffect, useState, type ReactNode } from 'react'
import type { Expediente } from '@/features/expedientes'
import { useProgreso } from '@/features/progreso'
import { Boton, rutaPublica } from '@/shared'
import { PASO_DE_ESTADO, PASOS_TUTORIAL, ZONA_DE_ESTADO, type ZonaTutorial } from '../contenido'
import estilos from './Tutorial.module.css'

type Props = {
  caso: Expediente
  /** Uno de E1 a E4. */
  estado: string
  reproduciendo: boolean
  primeraVez: boolean
  omitirObservacion: () => void
  terminarObservacion: () => void
  /** Resalta con un aro la parte de la pantalla que explica el paso. */
  enfocar: (zona: ZonaTutorial | null) => void
}

/** Loopi guía el tutorial: decorativo, el texto del globo es lo que se lee. */
function Guia({ children }: { children: ReactNode }) {
  return (
    <div className={estilos.guia} aria-live="polite" aria-atomic="true">
      <img className={estilos.loopi} src={rutaPublica('sprites/loopi.png')} alt="" />
      <div className={estilos.globo}>{children}</div>
    </div>
  )
}

/**
 * Tutorial de la misión (HU16, CA04.3). Ocupa el lugar de la barra de resultado antes de probar.
 * La primera vez Loopi muestra los 4 pasos y señala con un aro la parte de la pantalla de cada
 * uno; después, solo un recordatorio de una línea.
 */
export function Tutorial({
  caso,
  estado,
  reproduciendo,
  primeraVez,
  omitirObservacion,
  terminarObservacion,
  enfocar,
}: Props) {
  const marcarVisto = useProgreso((s) => s.marcarTutorialVisto)
  // Se fija al montar: al marcarlo como visto, el tutorial de esta misión no se encoge a mitad.
  const [completoAlEmpezar] = useState(primeraVez)
  // «Omitir tutorial» sí lo encoge y quita el aro desde ese momento.
  const [omitido, setOmitido] = useState(false)
  const completo = completoAlEmpezar && !omitido
  const numero = PASO_DE_ESTADO[estado] ?? 1
  const paso = PASOS_TUTORIAL[numero - 1] ?? PASOS_TUTORIAL[0]

  useEffect(() => {
    if (completoAlEmpezar && estado === 'E4') marcarVisto()
  }, [completoAlEmpezar, estado, marcarVisto])

  useEffect(() => {
    enfocar(completo ? (ZONA_DE_ESTADO[estado] ?? null) : null)
    return () => enfocar(null)
  }, [completo, estado, enfocar])

  const omitirTutorial = () => {
    setOmitido(true)
    marcarVisto()
  }

  if (estado === 'E1') {
    return (
      <Guia>
        <p className={estilos.titulo}>Paso 1 de 4: observa a {caso.criatura}</p>
        {completo && (
          <p className={estilos.texto}>
            {paso.texto} Después investiga, elige una causa y prueba una corrección.
          </p>
        )}
        <div className={estilos.acciones}>
          {reproduciendo ? (
            <Boton onClick={omitirObservacion}>Omitir</Boton>
          ) : (
            <Boton variante="primario" onClick={terminarObservacion}>
              Siguiente
            </Boton>
          )}
        </div>
      </Guia>
    )
  }

  if (!completo) {
    return (
      <p className={estilos.recordatorio} aria-live="polite">
        Recuerda: elige una causa, elige una corrección y prueba. ¿Dudas? Pulsa Ayuda.
      </p>
    )
  }

  return (
    <Guia>
      <p className={estilos.titulo}>
        Paso {numero} de 4: {paso.titulo}
      </p>
      <p className={estilos.texto}>{paso.texto}</p>
      <div className={estilos.acciones}>
        <Boton onClick={omitirTutorial}>Omitir tutorial</Boton>
      </div>
    </Guia>
  )
}
