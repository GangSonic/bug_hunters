import { Icono, rutaPublica, type NombreIcono } from '@/shared'
import type { EfectoPaso, PropsEscena } from '../contrato'
import { PEDIDOS } from './simular'
import estilos from './escena.module.css'

const ICONO_EFECTO: Partial<Record<EfectoPaso, NombreIcono>> = {
  ok: 'check',
  aviso: 'campana',
  fallo: 'error',
}

const CLASE_EFECTO: Partial<Record<EfectoPaso, string>> = {
  ok: estilos.ok,
  aviso: estilos.aviso,
  fallo: estilos.fallo,
  omitido: estilos.omitido,
}

/** Lo que oye quien usa lector de pantalla; el color y el icono no lo reemplazan. */
const DESCRIPCION_EFECTO: Partial<Record<EfectoPaso, string>> = {
  ok: 'preparado',
  fallo: 'no existe y detuvo la cocina',
  aviso: 'no existe; se avisó',
  omitido: 'no existe; quedó sin respuesta',
}

/**
 * Escena propia de Nullito (HU11, D-03): las comandas cuelgan de un riel y Nullito se coloca
 * bajo la que atiende. La comanda del pedido que nunca se registró va punteada y con «∅».
 */
export function EscenaNullito({ pasos, reproduciendo, desenlace }: PropsEscena) {
  const efectos = new Map<number, EfectoPaso>()
  let actual = 0
  for (const paso of pasos) {
    if (paso.elemento === null) continue
    efectos.set(paso.elemento, paso.efecto)
    actual = paso.elemento
  }
  const atendidos = pasos.at(-1)?.contadores.atendidos ?? 0
  const cocinaDetenida = pasos.some((p) => p.efecto === 'fallo')
  const ultimo = actual === PEDIDOS.length - 1

  const animo =
    reproduciendo || desenlace === null
      ? estilos.walking
      : desenlace === 'correcto'
        ? estilos.happy
        : cocinaDetenida
          ? estilos.dizzy
          : ''
  const cocina =
    desenlace === 'correcto' ? estilos.cocinaOk : cocinaDetenida ? estilos.cocinaFallo : ''

  return (
    <div className={estilos.area}>
      <ul className={estilos.riel} aria-label="Pedidos de la cafetería">
        {PEDIDOS.map((pedido, i) => {
          const efecto = efectos.get(i)
          const icono = efecto && ICONO_EFECTO[efecto]
          return (
            <li
              key={i}
              className={[
                estilos.comanda,
                pedido === null && estilos.ausente,
                efecto && CLASE_EFECTO[efecto],
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className={estilos.etiqueta} aria-hidden="true">
                {pedido === null ? '∅' : pedido}
              </span>
              {icono && <Icono nombre={icono} tamano={12} />}
              <span className={estilos.oculto}>
                {`Pedido ${i + 1}: ${efecto ? DESCRIPCION_EFECTO[efecto] : pedido === null ? 'no existe' : 'pendiente'}`}
              </span>
            </li>
          )
        })}
      </ul>

      <div className={[estilos.cocina, cocina].filter(Boolean).join(' ')} aria-hidden="true">
        <span className={estilos.etiquetaCocina}>COCINA</span>
        <Icono
          nombre={desenlace === 'correcto' ? 'check' : cocinaDetenida ? 'error' : 'flechaAbajo'}
        />
      </div>

      <div className={estilos.pista}>
        <div
          className={estilos.criatura}
          style={{ left: `${(actual + 0.5) * (100 / PEDIDOS.length)}%` }}
          data-pedido-actual={actual}
        >
          <div className={animo}>
            <img src={rutaPublica('sprites/nullito.png')} alt="Nullito" />
          </div>
          <span
            className={[estilos.contador, ultimo && estilos.contadorIzquierda]
              .filter(Boolean)
              .join(' ')}
            aria-hidden="true"
          >
            {`${atendidos}/${PEDIDOS.length}`}
          </span>
        </div>
      </div>

      <div className={estilos.barra} aria-hidden="true" />
    </div>
  )
}
