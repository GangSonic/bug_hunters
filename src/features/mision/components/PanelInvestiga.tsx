import { useState, type Dispatch } from 'react'
import type { Expediente } from '@/features/expedientes'
import { Boton, Icono } from '@/shared'
import type { EstadoMision, Evento } from '../logic/maquinaEstados'
import estilos from './PantallaMision.module.css'

type Props = {
  caso: Expediente
  mision: EstadoMision
  despachar: Dispatch<Evento>
  contadores: Record<string, number>
  bloqueado: boolean
}

/** Zona C: dispositivo de análisis (E2, E3) con regla, variables, hipótesis y pistas. */
export function PanelInvestiga({ caso, mision, despachar, contadores, bloqueado }: Props) {
  const [verRegla, setVerRegla] = useState(false)
  const [verVariables, setVerVariables] = useState(false)
  const opcionTexto = caso.opciones.find((o) => o.id === mision.opcionId)?.texto

  return (
    <section className={estilos.panel} aria-labelledby="titulo-investiga">
      <h2 id="titulo-investiga" className={estilos.panelTitulo}>
        <Icono nombre="lupa" /> Investiga
      </h2>

      <div className={estilos.inspeccion}>
        <Boton
          icono="libro"
          aria-expanded={verRegla}
          aria-controls="regla-caso"
          onClick={() => setVerRegla((v) => !v)}
        >
          Ver instrucciones
        </Boton>
        <Boton
          icono="datos"
          aria-expanded={verVariables}
          aria-controls="variables-caso"
          onClick={() => setVerVariables((v) => !v)}
        >
          Ver contador
        </Boton>
      </div>

      {verRegla && (
        <pre id="regla-caso" className={estilos.regla} aria-label="Instrucciones de la criatura">
          {caso.regla.map((linea, i) => {
            const [antes, despues] = linea.split('___')
            return (
              <span key={i}>
                {despues === undefined ? (
                  linea
                ) : (
                  <>
                    {antes}
                    <span className={estilos.hueco}>{opcionTexto ?? '___'}</span>
                    {despues}
                  </>
                )}
                {i < caso.regla.length - 1 ? '\n' : ''}
              </span>
            )
          })}
        </pre>
      )}

      {verVariables && (
        <dl id="variables-caso" className={estilos.variables}>
          {caso.contadores.map((c) => (
            <div key={c.id}>
              <dt style={{ display: 'inline' }}>{c.id} = </dt>
              <dd style={{ display: 'inline', margin: 0 }}>{contadores[c.id] ?? 0}</dd>
            </div>
          ))}
        </dl>
      )}

      <label className={estilos.campo} htmlFor="hipotesis">
        1. Hipótesis: {caso.preguntaHipotesis}
      </label>
      <select
        id="hipotesis"
        className={estilos.selector}
        value={mision.hipotesisId ?? ''}
        disabled={bloqueado}
        onChange={(e) =>
          e.target.value && despachar({ tipo: 'ELEGIR_HIPOTESIS', id: e.target.value })
        }
      >
        <option value="">Selecciona una causa…</option>
        {caso.hipotesis.map((h) => (
          <option key={h.id} value={h.id}>
            {h.texto}
          </option>
        ))}
      </select>

      {mision.pistasVistas > 0 && (
        <ul className={estilos.pistas} aria-label="Pistas recibidas">
          {caso.pistas.slice(0, mision.pistasVistas).map((pista, i) => (
            <li key={i} className={estilos.pista}>
              <strong>
                Pista {i + 1} de {caso.pistas.length}:
              </strong>{' '}
              {pista}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
