import { useState } from 'react'
import { obtenerExpediente, type CasoId } from '@/features/expedientes'
import { useProgreso } from '@/features/progreso'
import { Boton, InsigniaEstado, Marco, mostrarAviso } from '@/shared'
import { useMision } from '../hooks/useMision'
import { MAX_PISTAS, puedeReparar } from '../logic/maquinaEstados'
import { AvisoMision } from './AvisoMision'
import { BarraReparacion } from './BarraReparacion'
import { PanelInvestiga } from './PanelInvestiga'
import estilos from './PantallaMision.module.css'

type Props = {
  casoId: CasoId
  onResuelto: () => void
  onVolver: () => void
}

/** P5 Escenario de misión, con la estructura de la primera versión (zonas A–G). */
export function PantallaMision({ casoId, onResuelto, onVolver }: Props) {
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
  const contadores = pasosMostrados.at(-1)?.contadores ?? {}
  const resuelto = mision.estado === 'E5a' || mision.estado === 'E6'
  const enObservacion = mision.estado === 'E1'
  const { Escena } = caso

  const alProbar = () => {
    if (reproduciendo) return
    if (!mision.hipotesisId) return setError('Primero registra una hipótesis (paso 1).')
    if (!mision.opcionId) return setError('Elige una corrección (paso 2).')
    setError('')
    probar()
  }

  const alPedirPista = () => {
    if (mision.pistasVistas >= MAX_PISTAS)
      return mostrarAviso('Ya viste todas las pistas de este caso.')
    mostrarAviso(
      `Pista ${mision.pistasVistas + 1}/${MAX_PISTAS}: ${caso.pistas[mision.pistasVistas]}`,
    )
    despachar({ tipo: 'PEDIR_PISTA' })
  }

  const alReiniciar = () => {
    setError('')
    reiniciar()
  }

  return (
    <Marco
      titulo={caso.titulo}
      subtitulo={caso.objetivo}
      izquierda={
        <Boton variante="pill" icono="atras" onClick={onVolver}>
          Volver
        </Boton>
      }
      derecha={
        <Boton
          variante="pill"
          icono="ayuda"
          onClick={() =>
            mostrarAviso('Observa a la criatura, elige una causa y prueba una corrección.')
          }
        >
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

        <div className={estilos.controls}>
          <Boton
            variante="primario"
            icono="jugar"
            onClick={alProbar}
            disabled={reproduciendo || enObservacion || mision.estado === 'E6'}
          >
            Probar
          </Boton>
          <Boton
            icono="reiniciar"
            onClick={alReiniciar}
            disabled={reproduciendo || mision.estado === 'E6'}
          >
            Reiniciar
          </Boton>
          <Boton icono="foco" onClick={alPedirPista} disabled={reproduciendo || enObservacion}>
            Pista
          </Boton>
        </div>

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

        {mision.estado === 'E5a' && !reproduciendo && (
          <Boton
            variante="primario"
            className={estilos.continuar}
            onClick={() => {
              despachar({ tipo: 'CONTINUAR' })
              onResuelto()
            }}
          >
            Continuar ›
          </Boton>
        )}
      </div>
    </Marco>
  )
}
