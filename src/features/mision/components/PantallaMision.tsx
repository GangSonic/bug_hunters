import { useState, type ReactNode } from 'react'
import { obtenerExpediente, type CasoId } from '@/features/expedientes'
import { useProgreso } from '@/features/progreso'
import { Boton, InsigniaEstado, Marco, mostrarAviso, useTecla } from '@/shared'
import { useMision } from '../hooks/useMision'
import { MAX_PISTAS, puedePedirPista, puedeReparar, type EstadoId } from '../logic/maquinaEstados'
import { AvisoMision } from './AvisoMision'
import { BarraReparacion } from './BarraReparacion'
import { ControlesMision } from './ControlesMision'
import { ListaPistas } from './ListaPistas'
import type { ContextoRecuperacion, ContextoTutorial, SalidaMision } from './huecos'
import { PanelInvestiga } from './PanelInvestiga'
import estilos from './PantallaMision.module.css'

type Props = {
  casoId: CasoId
  onResuelto: () => void
  onVolver: (salida: SalidaMision) => void
  /** Esc en la misión (HU15). Sin esta prop, Esc no hace nada. */
  onPausa?: (salida: SalidaMision) => void
  /** Botón Ayuda (HU16). Sin esta prop se muestra el aviso breve de siempre. */
  onAyuda?: () => void
  /** Tutorial: reemplaza la barra de resultado mientras no se haya probado nada (E1 a E4). */
  renderTutorial?: (contexto: ContextoTutorial) => ReactNode
  /** Recuperación: reemplaza el botón Continuar cuando se resuelve el caso (E5a). */
  renderRecuperacion?: (contexto: ContextoRecuperacion) => ReactNode
}

const ANTES_DE_PROBAR: EstadoId[] = ['E1', 'E2', 'E3', 'E4']

/** P5 Escenario de misión, con la estructura de la primera versión (zonas A–G). */
export function PantallaMision({
  casoId,
  onResuelto,
  onVolver,
  onPausa,
  onAyuda,
  renderTutorial,
  renderRecuperacion,
}: Props) {
  const caso = obtenerExpediente(casoId)
  const {
    mision,
    despachar,
    reproduciendo,
    pasosMostrados,
    estadoEjecucion,
    iconoError,
    desenlaceVisible,
    probar,
    reiniciar,
    omitirObservacion,
  } = useMision(caso)
  const tutorialVisto = useProgreso((s) => s.tutorialVisto)
  const marcarTutorialVisto = useProgreso((s) => s.marcarTutorialVisto)
  const [error, setError] = useState('')
  // Solo para el texto del botón: se apaga al reiniciar, cuando la ronda empieza de nuevo.
  const [yaProbo, setYaProbo] = useState(false)
  const contadores = pasosMostrados.at(-1)?.contadores ?? {}
  const resuelto = mision.estado === 'E5a' || mision.estado === 'E6'
  const enObservacion = mision.estado === 'E1'
  const { Escena } = caso

  useTecla(
    'Escape',
    () => onPausa?.({ edicionSinProbar: mision.edicionSinProbar }),
    onPausa !== undefined,
  )

  const alProbar = () => {
    if (reproduciendo) return
    if (!mision.hipotesisId) return setError('Primero registra una hipótesis (paso 1).')
    if (!mision.opcionId) return setError('Elige una corrección (paso 2).')
    setError('')
    setYaProbo(true)
    probar()
  }

  const alPedirPista = () => despachar({ tipo: 'PEDIR_PISTA' })

  const alReiniciar = () => {
    setError('')
    setYaProbo(false)
    reiniciar()
  }

  const continuar = () => {
    despachar({ tipo: 'CONTINUAR' })
    onResuelto()
  }

  const alAyudar = () =>
    onAyuda
      ? onAyuda()
      : mostrarAviso('Observa a la criatura, elige una causa y prueba una corrección.')

  return (
    <Marco
      titulo={caso.titulo}
      subtitulo={caso.objetivo}
      izquierda={
        <Boton
          variante="pill"
          icono="atras"
          onClick={() => onVolver({ edicionSinProbar: mision.edicionSinProbar })}
        >
          Volver
        </Boton>
      }
      derecha={
        <Boton variante="pill" icono="ayuda" onClick={alAyudar}>
          Ayuda
        </Boton>
      }
    >
      <div className={estilos.misBody}>
        <div className={estilos.counters}>
          {caso.contadores.map((c) => (
            <div key={c.id} className={estilos.ctr}>
              <div className={estilos.ctrK}>{c.etiqueta}</div>
              <div className={estilos.ctrV}>
                {contadores[c.id] ?? 0}
                {c.deTotal ? ` / ${caso.total}` : ''}
              </div>
            </div>
          ))}
        </div>

        <div className={estilos.misGrid}>
          <div className={estilos.stage}>
            <InsigniaEstado
              estado={estadoEjecucion}
              iconoError={iconoError}
              className={estilos.estadoBadge}
            />
            <Escena
              pasos={pasosMostrados}
              reproduciendo={reproduciendo}
              desenlace={desenlaceVisible}
            />
          </div>
          <PanelInvestiga
            caso={caso}
            mision={mision}
            despachar={(evento) => {
              setError('')
              despachar(evento)
            }}
            bloqueado={enObservacion || reproduciendo}
            error={error}
            resuelto={resuelto}
          />
        </div>

        <BarraReparacion
          caso={caso}
          mision={mision}
          despachar={(evento) => {
            setError('')
            despachar(evento)
          }}
          habilitada={puedeReparar(mision) && !reproduciendo}
        />

        <ControlesMision
          probarDeshabilitado={reproduciendo || enObservacion || mision.estado === 'E6'}
          probarOtraVez={yaProbo}
          reiniciarDeshabilitado={reproduciendo || mision.estado === 'E6'}
          pistaDeshabilitada={reproduciendo || !puedePedirPista(mision)}
          onProbar={alProbar}
          onReiniciar={alReiniciar}
          onPista={alPedirPista}
        />
        <ListaPistas vistas={caso.pistas.slice(0, mision.pistasVistas)} total={MAX_PISTAS} />

        {renderTutorial && ANTES_DE_PROBAR.includes(mision.estado) ? (
          renderTutorial({
            caso,
            estado: mision.estado,
            reproduciendo,
            primeraVez: !tutorialVisto,
            omitirObservacion,
            terminarObservacion: () => despachar({ tipo: 'OBSERVACION_TERMINADA' }),
          })
        ) : (
          <AvisoMision
            caso={caso}
            mision={mision}
            reproduciendo={reproduciendo}
            tutorialVisto={tutorialVisto}
            onOmitirObservacion={omitirObservacion}
            onTerminarObservacion={() => {
              marcarTutorialVisto()
              despachar({ tipo: 'OBSERVACION_TERMINADA' })
            }}
          />
        )}

        {mision.estado === 'E5a' &&
          !reproduciendo &&
          (renderRecuperacion ? (
            renderRecuperacion({ caso, continuar })
          ) : (
            <Boton variante="primario" className={estilos.continuar} onClick={continuar}>
              Continuar ›
            </Boton>
          ))}
      </div>
    </Marco>
  )
}
