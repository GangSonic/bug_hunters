import type { Dispatch } from 'react'
import type { Expediente } from '@/features/expedientes'
import type { EstadoMision, Evento } from '../logic/maquinaEstados'
import estilos from './PantallaMision.module.css'

type Props = {
  caso: Expediente
  mision: EstadoMision
  despachar: Dispatch<Evento>
  habilitada: boolean
}

/** Zona D: la barra de reparación. Solo una opción a la vez (E4). */
export function BarraReparacion({ caso, mision, despachar, habilitada }: Props) {
  const motivo =
    mision.estado === 'E1'
      ? 'Primero observa qué hace la criatura.'
      : mision.hipotesisId === null
        ? 'Primero registra una hipótesis.'
        : null

  return (
    <section className={estilos.panel} aria-labelledby="titulo-reparar">
      <h2 id="titulo-reparar" className={estilos.panelTitulo}>
        2. Repara: {caso.preguntaReparacion}
      </h2>
      {motivo && <p className={estilos.ayudaBloqueo}>{motivo}</p>}
      <div className={estilos.opciones} role="radiogroup" aria-labelledby="titulo-reparar">
        {caso.opciones.map((opcion) => (
          <button
            key={opcion.id}
            type="button"
            role="radio"
            aria-checked={mision.opcionId === opcion.id}
            className={estilos.opcion}
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
