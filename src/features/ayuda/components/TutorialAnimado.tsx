import { useEffect, useState, type CSSProperties } from 'react'
import { useConfiguracion } from '@/features/configuracion'
import { Boton, Icono, Marco, rutaPublica, useMovimientoReducido, useTecla } from '@/shared'
import { DURACION_ESCENA_MS, ESCENAS_ANIMACION, type EscenaId } from '../contenido'
import estilos from './TutorialAnimado.module.css'

type Props = {
  onCerrar: () => void
  /** Al terminar, lleva a elegir un caso. */
  onIrACasos: () => void
}

const ULTIMA = ESCENAS_ANIMACION.length - 1
const COMANDAS = [1, 2, 3, 4] as const

type EstadoComanda = 'pendiente' | 'hecha' | 'ausente'

function Comandas({ estados }: { estados: readonly EstadoComanda[] }) {
  return (
    <ul className={estilos.riel}>
      {COMANDAS.map((n, i) => {
        const estado = estados[i] ?? 'pendiente'
        return (
          <li
            key={n}
            className={`${estilos.comanda} ${estado === 'hecha' ? estilos.hecha : ''} ${
              estado === 'ausente' ? estilos.ausente : ''
            }`}
            style={{ '--d': `${i * 0.25}s` } as CSSProperties}
          >
            {estado === 'ausente' ? '∅' : n}
            {estado === 'hecha' && <Icono nombre="check" tamano={12} />}
          </li>
        )
      })}
    </ul>
  )
}

function Sprite({ nombre, clase }: { nombre: 'loopi' | 'nullito'; clase: string | undefined }) {
  return (
    <img
      className={[estilos.sprite, clase].filter(Boolean).join(' ')}
      src={rutaPublica(`sprites/${nombre}.png`)}
      alt=""
    />
  )
}

/** El dibujo de cada escena. Es decorativo: lo que dice la escena está en el subtítulo. */
function Dibujo({ id }: { id: EscenaId }) {
  switch (id) {
    case 'presentacion':
      return (
        <>
          <span className={`${estilos.interrogante} ${estilos.i1}`}>?</span>
          <span className={`${estilos.interrogante} ${estilos.i2}`}>?</span>
          <span className={`${estilos.interrogante} ${estilos.i3}`}>?</span>
          <Sprite nombre="loopi" clase={estilos.loopiGrande} />
        </>
      )
    case 'caso':
      return (
        <>
          <Comandas estados={['pendiente', 'pendiente', 'pendiente', 'pendiente']} />
          <div className={estilos.mesa} />
          <Sprite nombre="nullito" clase={estilos.nullitoEntra} />
          <Sprite nombre="loopi" clase={estilos.loopiChico} />
        </>
      )
    case 'observa':
      return (
        <>
          <Comandas estados={['hecha', 'hecha', 'ausente', 'pendiente']} />
          <div className={estilos.mesa} />
          <span className={`${estilos.etiqueta} ${estilos.detenido}`}>
            <Icono nombre="pausa" tamano={12} /> Detenido
          </span>
          <Sprite nombre="nullito" clase={estilos.nullitoAtascado} />
          <span className={estilos.contador}>2/4</span>
          <Sprite nombre="loopi" clase={estilos.loopiChico} />
        </>
      )
    case 'investiga':
      return (
        <>
          <div className={estilos.formulario}>
            <span className={estilos.campo}>
              1. Hipótesis <b>(¿cuál es la causa?)</b>
            </span>
            <span className={`${estilos.selector} ${estilos.resaltado}`}>
              No se revisa si el pedido existe antes de prepararlo
            </span>
          </div>
          <Sprite nombre="loopi" clase={estilos.loopiChico} />
        </>
      )
    case 'corrige':
      return (
        <>
          <div className={estilos.formulario}>
            <span className={estilos.opcion}>preparar pedido</span>
            <span className={estilos.opcion}>si existe: preparar pedido</span>
            <span className={`${estilos.opcion} ${estilos.elegida}`}>
              si existe: preparar pedido · si no: avisar y seguir
            </span>
            <span className={estilos.probar}>
              <Icono nombre="jugar" tamano={12} /> Probar
            </span>
          </div>
          <Sprite nombre="loopi" clase={estilos.loopiChico} />
        </>
      )
    case 'aprende':
      return (
        <>
          <Comandas estados={['hecha', 'hecha', 'hecha', 'hecha']} />
          <div className={estilos.mesa} />
          <span className={`${estilos.etiqueta} ${estilos.resuelto}`}>
            <Icono nombre="check" tamano={12} /> ¡Resuelto!
          </span>
          <Sprite nombre="nullito" clase={estilos.nullitoFeliz} />
          <span className={estilos.contador}>4/4</span>
          <span className={estilos.ficha}>
            <Icono nombre="libro" tamano={13} /> Ficha nueva: valor ausente (nulo)
          </span>
          <Sprite nombre="loopi" clase={estilos.loopiChico} />
        </>
      )
  }
}

/**
 * O5 Tutorial animado: Loopi se presenta y explica un caso completo (el de Nullito) en 6 escenas
 * con subtítulos siempre visibles. Se puede pausar, retroceder, avanzar y saltar (WCAG 2.2.2).
 * Con las animaciones apagadas o con movimiento reducido empieza en pausa.
 */
export function TutorialAnimado({ onCerrar, onIrACasos }: Props) {
  const animaciones = useConfiguracion((s) => s.animaciones)
  const movimientoReducido = useMovimientoReducido()
  const [escena, setEscena] = useState(0)
  const [reproduciendo, setReproduciendo] = useState(animaciones && !movimientoReducido)

  useTecla('Escape', onCerrar)

  // Pasa sola a la siguiente escena; al terminar la última se detiene.
  useEffect(() => {
    if (!reproduciendo) return
    const espera = setTimeout(() => {
      if (escena < ULTIMA) setEscena(escena + 1)
      else setReproduciendo(false)
    }, DURACION_ESCENA_MS)
    return () => clearTimeout(espera)
  }, [escena, reproduciendo])

  const actual = ESCENAS_ANIMACION[escena] ?? ESCENAS_ANIMACION[0]
  const terminada = escena === ULTIMA && !reproduciendo

  const alAlternar = () => {
    if (terminada) {
      setEscena(0)
      setReproduciendo(true)
    } else {
      setReproduciendo(!reproduciendo)
    }
  }

  return (
    <Marco
      titulo="Tutorial"
      subtitulo="Loopi te enseña cómo se resuelve un caso"
      izquierda={
        <Boton variante="pill" icono="atras" onClick={onCerrar}>
          Volver
        </Boton>
      }
    >
      <div className={estilos.cuerpo}>
        <div className={estilos.escenario} aria-hidden="true">
          {/* La clave reinicia las animaciones CSS al cambiar de escena. */}
          <div key={actual.id} className={estilos.dibujo}>
            <Dibujo id={actual.id} />
          </div>
        </div>

        <div className={estilos.subtitulos} aria-live="polite" aria-atomic="true">
          <p className={estilos.escenaTitulo}>
            Escena {escena + 1} de {ESCENAS_ANIMACION.length}: {actual.titulo}
          </p>
          <p className={estilos.escenaTexto}>{actual.texto}</p>
        </div>

        <div className={estilos.controles}>
          <Boton icono="atras" onClick={() => setEscena(escena - 1)} disabled={escena === 0}>
            Anterior
          </Boton>
          <Boton
            icono={terminada ? 'reiniciar' : reproduciendo ? 'pausa' : 'jugar'}
            onClick={alAlternar}
          >
            {terminada ? 'Repetir' : reproduciendo ? 'Pausar' : 'Reproducir'}
          </Boton>
          <Boton onClick={() => setEscena(escena + 1)} disabled={escena === ULTIMA}>
            Siguiente
          </Boton>
        </div>

        <ol className={estilos.puntos} aria-label="Escenas del tutorial">
          {ESCENAS_ANIMACION.map((e, i) => (
            <li key={e.id}>
              <button
                type="button"
                className={`${estilos.punto} ${i === escena ? estilos.puntoActivo : ''}`}
                aria-label={`Ir a la escena ${i + 1}: ${e.titulo}`}
                aria-current={i === escena ? 'step' : undefined}
                onClick={() => setEscena(i)}
              />
            </li>
          ))}
        </ol>

        <div className={estilos.final}>
          <Boton variante="primario" icono="jugar" onClick={onIrACasos}>
            Ir a los casos
          </Boton>
        </div>
      </div>
    </Marco>
  )
}
