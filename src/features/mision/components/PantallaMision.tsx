import { obtenerExpediente, type CasoId } from '@/features/expedientes'
import { useProgreso } from '@/features/progreso'
import { Boton, InsigniaEstado, Marco } from '@/shared'
import { useMision } from '../hooks/useMision'
import { puedePedirPista, puedeProbar, puedeReparar, MAX_PISTAS } from '../logic/maquinaEstados'
import { AvisoMision } from './AvisoMision'
import { BarraReparacion } from './BarraReparacion'
import { PanelInvestiga } from './PanelInvestiga'
import estilos from './PantallaMision.module.css'

type Props = {
  casoId: CasoId
  onResuelto: () => void
  onVolver: () => void
}

/** P5 Escenario de misión: zonas A–G del Capítulo IV (Figura 23). */
export function PantallaMision({ casoId, onResuelto, onVolver }: Props) {
  const caso = obtenerExpediente(casoId)
  const {
    mision,
    despachar,
    reproduciendo,
    pasosMostrados,
    estadoEjecucion,
    desenlaceVisible,
    probar,
    reiniciar,
    omitirObservacion,
  } = useMision(caso)
  const tutorialVisto = useProgreso((s) => s.tutorialVisto)
  const marcarTutorialVisto = useProgreso((s) => s.marcarTutorialVisto)
  const contadores = pasosMostrados.at(-1)?.contadores ?? {}
  const { Escena } = caso
  const yaProbo = mision.intentos.length > 0

  return (
    <Marco
      titulo={caso.titulo}
      subtitulo={caso.objetivo}
      izquierda={
        <Boton variante="pill" icono="atras" onClick={onVolver}>
          Volver
        </Boton>
      }
    >
      <div className={estilos.cuerpo}>
        <div className={estilos.rejilla}>
          <div className={estilos.zonaB}>
            <div className={estilos.filaEstado}>
              <div className={estilos.contadores}>
                {caso.contadores.map((c) => (
                  <div key={c.id} className={estilos.contador}>
                    <div className={estilos.contadorNombre}>{c.etiqueta}</div>
                    <div className={estilos.contadorValor}>
                      {contadores[c.id] ?? 0}
                      {c.deTotal ? ` / ${caso.total}` : ''}
                    </div>
                  </div>
                ))}
              </div>
              <InsigniaEstado estado={estadoEjecucion} />
            </div>
            <Escena
              pasos={pasosMostrados}
              reproduciendo={reproduciendo}
              desenlace={desenlaceVisible}
            />
          </div>

          <PanelInvestiga
            caso={caso}
            mision={mision}
            despachar={despachar}
            contadores={contadores}
            bloqueado={mision.estado === 'E1' || reproduciendo}
          />
        </div>

        <BarraReparacion
          caso={caso}
          mision={mision}
          despachar={despachar}
          habilitada={puedeReparar(mision) && !reproduciendo}
        />

        <div className={estilos.controles}>
          <Boton
            variante="primario"
            icono="jugar"
            disabled={!puedeProbar(mision) || reproduciendo}
            onClick={probar}
          >
            {yaProbo ? 'Probar otra vez' : 'Probar'}
          </Boton>
          <Boton icono="reiniciar" onClick={reiniciar} disabled={mision.estado === 'E6'}>
            Reiniciar
          </Boton>
          <Boton
            icono="foco"
            disabled={!puedePedirPista(mision) || reproduciendo}
            onClick={() => despachar({ tipo: 'PEDIR_PISTA' })}
          >
            Pista ({mision.pistasVistas} de {MAX_PISTAS})
          </Boton>
        </div>

        <AvisoMision
          caso={caso}
          mision={mision}
          despachar={despachar}
          reproduciendo={reproduciendo}
          tutorialVisto={tutorialVisto}
          onOmitirObservacion={omitirObservacion}
          onTerminarObservacion={() => {
            marcarTutorialVisto()
            despachar({ tipo: 'OBSERVACION_TERMINADA' })
          }}
          onContinuar={() => {
            despachar({ tipo: 'CONTINUAR' })
            onResuelto()
          }}
        />
      </div>
    </Marco>
  )
}
