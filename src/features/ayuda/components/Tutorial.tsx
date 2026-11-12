import { useEffect, useState } from 'react'
import type { Expediente } from '@/features/expedientes'
import { useProgreso } from '@/features/progreso'
import { Boton, Icono } from '@/shared'
import { PASO_DE_ESTADO, PASOS_TUTORIAL } from '../contenido'
import estilos from './Tutorial.module.css'

type Props = {
  caso: Expediente
  /** Uno de E1 a E4. */
  estado: string
  reproduciendo: boolean
  primeraVez: boolean
  omitirObservacion: () => void
  terminarObservacion: () => void
}

/**
 * Tutorial de la misión (HU16, CA04.3). Ocupa el lugar de la barra de resultado antes de probar.
 * La primera vez muestra los 4 pasos; después, solo un recordatorio de una línea.
 */
export function Tutorial({
  caso,
  estado,
  reproduciendo,
  primeraVez,
  omitirObservacion,
  terminarObservacion,
}: Props) {
  const marcarVisto = useProgreso((s) => s.marcarTutorialVisto)
  // Se fija al montar: al marcarlo como visto, el tutorial de esta misión no se encoge a mitad.
  const [completo] = useState(primeraVez)
  const numero = PASO_DE_ESTADO[estado] ?? 1
  const paso = PASOS_TUTORIAL[numero - 1] ?? PASOS_TUTORIAL[0]

  useEffect(() => {
    if (completo && estado === 'E4') marcarVisto()
  }, [completo, estado, marcarVisto])

  if (estado === 'E1') {
    return (
      <div className={estilos.barra} aria-live="polite" aria-atomic="true">
        <Icono nombre="ojo" />
        <div className={estilos.contenido}>
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
        </div>
      </div>
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
    <div className={estilos.barra} aria-live="polite" aria-atomic="true">
      <Icono nombre="ojo" />
      <div className={estilos.contenido}>
        <p className={estilos.titulo}>
          Paso {numero} de 4: {paso.titulo}
        </p>
        <p className={estilos.texto}>{paso.texto}</p>
        <div className={estilos.acciones}>
          <Boton onClick={marcarVisto}>Omitir tutorial</Boton>
        </div>
      </div>
    </div>
  )
}
