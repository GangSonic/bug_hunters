import { useEffect, useRef, useState } from 'react'
import { Boton, Capa } from '@/shared'
import { PASOS_TUTORIAL } from '../contenido'
import estilos from './Ayuda.module.css'

const CONTROLES = [
  { tecla: 'Tab y Shift + Tab', accion: 'Moverte entre los controles' },
  { tecla: 'Enter o Espacio', accion: 'Activar el botón enfocado' },
  { tecla: 'Esc', accion: 'Pausar la misión o cerrar esta ventana' },
  { tecla: 'Clic', accion: 'Elegir una opción o pulsar un botón con el ratón' },
]

const CICLO = [
  'Observa a la criatura y compara lo que hace con lo que pide la misión.',
  'Investiga y elige la causa del problema.',
  'Elige cómo corregirlo y pulsa Probar.',
  'Si no sale, pide una pista y vuelve a intentarlo.',
  'Cuando lo resuelvas, aprende el concepto y guarda la ficha en la BugDex.',
]

/** O2 Ayuda (HU16): controles, ciclo de una misión, BugDex y tutorial bajo demanda. */
export function Ayuda({ onCerrar }: { onCerrar: () => void }) {
  const [verTutorial, setVerTutorial] = useState(false)
  const [paso, setPaso] = useState(0)

  // Al cambiar de vista el botón pulsado desaparece: el foco pasa al contenido nuevo.
  const cuerpoRef = useRef<HTMLDivElement>(null)
  const primeraVez = useRef(true)
  useEffect(() => {
    if (primeraVez.current) {
      primeraVez.current = false
      return
    }
    cuerpoRef.current?.focus()
  }, [verTutorial, paso])

  const abrirTutorial = () => {
    setPaso(0)
    setVerTutorial(true)
  }

  if (verTutorial) {
     const actual = PASOS_TUTORIAL[paso] ?? PASOS_TUTORIAL[0]
    const ultimo = paso === PASOS_TUTORIAL.length - 1
    return (
      <Capa titulo="Tutorial" onCerrar={onCerrar}>
        <div ref={cuerpoRef} tabIndex={-1} className={estilos.cuerpo}>
          <p className={estilos.paso}>
            Paso {paso + 1} de {PASOS_TUTORIAL.length}: {actual.titulo}
          </p>
          <p className={estilos.texto}>{actual.texto}</p>
          <div className={estilos.acciones}>
            <Boton onClick={() => setPaso(paso - 1)} disabled={paso === 0}>
              Paso anterior
            </Boton>
            {ultimo ? (
              <Boton variante="primario" onClick={() => setVerTutorial(false)}>
                Listo
              </Boton>
            ) : (
              <Boton variante="primario" onClick={() => setPaso(paso + 1)}>
                Siguiente paso
              </Boton>
            )}
          </div>
        </div>
      </Capa>
    )
  }

  return (
    <Capa titulo="Ayuda" onCerrar={onCerrar}>
      <div ref={cuerpoRef} tabIndex={-1} className={estilos.cuerpo}>
        <section className={estilos.seccion}>
          <h3>Controles</h3>
          <dl className={estilos.controles}>
            {CONTROLES.map((c) => (
              <div key={c.tecla} className={estilos.fila}>
                <dt>{c.tecla}</dt>
                <dd>{c.accion}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={estilos.seccion}>
          <h3>Cómo es una misión</h3>
          <ol className={estilos.ciclo}>
            {CICLO.map((texto) => (
              <li key={texto}>{texto}</li>
            ))}
          </ol>
        </section>

        <section className={estilos.seccion}>
          <h3>La BugDex</h3>
          <p className={estilos.texto}>
            Es tu colección de fichas. Cada caso que resuelves desbloquea la ficha de su criatura.
          </p>
        </section>

        <div className={estilos.acciones}>
          <Boton onClick={abrirTutorial}>Ver tutorial</Boton>
          <Boton variante="primario" onClick={onCerrar}>
            Volver a la misión
          </Boton>
        </div>
      </div>
    </Capa>
  )
}