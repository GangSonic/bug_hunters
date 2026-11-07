import type { Dispatch } from 'react'
import type { Expediente } from '@/features/expedientes'
import { Icono } from '@/shared'
import type { EstadoMision, Evento } from '../logic/maquinaEstados'
import estilos from './PantallaMision.module.css'

type Props = {
  caso: Expediente
  mision: EstadoMision
  despachar: Dispatch<Evento>
  habilitada: boolean
}

/** Zona D: la barra de reparación (.repair). Solo una opción a la vez. */
export function BarraReparacion({ caso, mision, despachar, habilitada }: Props) {
  const elegida = caso.opciones.find((o) => o.id === mision.opcionId)
  return (
    <section className={estilos.repair} aria-labelledby="titulo-reparar">
      <h2 id="titulo-reparar">
        <Icono nombre="llave" /> 2. {caso.preguntaReparacion}
      </h2>
      <p className={estilos.rh}>{caso.indicacionReparacion}</p>
      <div className={estilos.rline}>
        <span className={estilos.lbl}>Elegido:</span>
        <span className={elegida ? estilos.elegidoActivo : estilos.elegido}>
          ( {elegida?.texto ?? '…'} )
        </span>
      </div>
      <div className={estilos.opts} role="group" aria-labelledby="titulo-reparar">
        {caso.opciones.map((opcion) => (
          <button
            key={opcion.id}
            type="button"
            aria-pressed={mision.opcionId === opcion.id}
            className={estilos.opt}
            disabled={!habilitada}
            onClick={() => despachar({ tipo: 'ELEGIR_OPCION', id: opcion.id })}
          >
            {opcion.texto}
          </button>
        ))}
      </div>
    </section>
  )
}
