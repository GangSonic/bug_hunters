import { useState, type Dispatch, type ReactNode } from 'react'
import type { Expediente } from '@/features/expedientes'
import { Icono } from '@/shared'
import type { EstadoMision, Evento } from '../logic/maquinaEstados'
import estilos from './PantallaMision.module.css'

type Props = {
  caso: Expediente
  mision: EstadoMision
  despachar: Dispatch<Evento>
  bloqueado: boolean
  error: string
  /** Muestra el hueco en verde cuando el caso ya se resolvió. */
  resuelto: boolean
}

const PALABRA_CLAVE = /^(\s*)(repetir mientras|para cada|si no|si|mostrar)\b/

/** Resalta la palabra clave al inicio de la línea, como en la primera versión. */
function resaltar(texto: string, clave: string): ReactNode {
  const m = PALABRA_CLAVE.exec(texto)
  if (!m) return texto
  const [completo, espacio = '', palabra] = m
  return (
    <>
      {espacio}
      <span key={clave} className={estilos.kw}>
        {palabra}
      </span>
      {texto.slice(completo.length)}
    </>
  )
}

/** Zona C: dispositivo de análisis (.analiza) con instrucciones e hipótesis. */
export function PanelInvestiga({ caso, mision, despachar, bloqueado, error, resuelto }: Props) {
  const [verRegla, setVerRegla] = useState(false)
  const opcionTexto = caso.opciones.find((o) => o.id === mision.opcionId)?.texto

  return (
    <section className={estilos.analiza} aria-labelledby="titulo-investiga">
      <h2 id="titulo-investiga">
        <Icono nombre="lupa" /> Investiga
      </h2>
      <div className={estilos.insp}>
        <button
          type="button"
          aria-expanded={verRegla}
          aria-controls="regla-caso"
          onClick={() => setVerRegla((v) => !v)}
        >
          <Icono nombre="portapapeles" /> Ver instrucciones
        </button>
      </div>

      {verRegla && (
        <pre id="regla-caso" className={estilos.code} aria-label="Instrucciones de la criatura">
          {caso.regla.map((linea, i) => {
            const [antes = '', despues] = linea.split('___')
            return (
              <span key={i}>
                {despues === undefined ? (
                  resaltar(linea, `kw-${i}`)
                ) : (
                  <>
                    {resaltar(antes, `kw-${i}`)}
                    <span className={`${estilos.cd} ${resuelto ? estilos.cdGood : ''}`}>
                      {opcionTexto ?? '___'}
                    </span>
                    {despues}
                  </>
                )}
                {i < caso.regla.length - 1 ? '\n' : ''}
              </span>
            )
          })}
        </pre>
      )}

      <label className={estilos.fld} htmlFor="hipotesis">
        1. Hipótesis <b>(¿cuál es la causa?)</b>
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
      <div className={estilos.errMsg} role="alert">
        {error}
      </div>
    </section>
  )
}
