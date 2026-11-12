import { Icono, rutaPublica } from '@/shared'
import type { EfectoPaso, PropsEscena } from '../contrato'
import estilos from './EscenaBanda.module.css'

type Props = PropsEscena & {
  sprite: string
  criatura: string
  etiquetaDestino: string
  elementos: string[]
  /** Texto del contador que la criatura lleva encima. */
  contadorPecho: (contadores: Record<string, number>) => string
  /** Centro, en % del sprite, de la pantalla dibujada en la criatura, donde se muestra el contador. */
  pantalla: { izquierda: number; arriba: number }
  /** Describe cada efecto para el lector de pantalla. */
  describir?: Partial<Record<EfectoPaso, string>>
}

const DESCRIPCION_BASE: Record<EfectoPaso, string> = {
  ok: 'listo',
  mal: 'mal enviado',
  vacio: 'vuelta vacía',
  fallo: 'falló',
  aviso: 'avisado',
  omitido: 'sin respuesta',
}

const CLASE_EFECTO: Record<EfectoPaso, string | undefined> = {
  ok: estilos.done,
  mal: estilos.mal,
  vacio: undefined,
  fallo: estilos.fallo,
  aviso: estilos.aviso,
  omitido: estilos.omitido,
}

/**
 * Escenario de banda transportadora de la primera versión. La criatura parte en 3 %,
 * avanza a 46 % al ejecutarse y camina, se marea (ciclo sin fin) o salta (resuelto).
 */
export function EscenaBanda({
  pasos,
  reproduciendo,
  desenlace,
  sprite,
  criatura,
  etiquetaDestino,
  elementos,
  contadorPecho,
  pantalla,
  describir,
}: Props) {
  const efectos = new Map<number, EfectoPaso>()
  for (const paso of pasos) {
    if (paso.elemento !== null) efectos.set(paso.elemento, paso.efecto)
  }
  const cicloSinFin = pasos.some((p) => p.efecto === 'vacio')
  const animo =
    reproduciendo || desenlace === null
      ? estilos.walking
      : desenlace === 'correcto'
        ? estilos.happy
        : cicloSinFin
          ? estilos.dizzy
          : ''
  const contadores = pasos.at(-1)?.contadores ?? {}
  const textos = { ...DESCRIPCION_BASE, ...describir }

  return (
    <div className={estilos.area}>
      <div className={estilos.destino} aria-hidden="true">
        <span className={estilos.dl}>{etiquetaDestino}</span>
        <Icono nombre="flechaAbajo" />
      </div>
      <div
        className={[estilos.criatura, pasos.length > 0 && estilos.enCamino, animo]
          .filter(Boolean)
          .join(' ')}
      >
        <img src={rutaPublica(sprite)} alt={criatura} />
        <span
          className={estilos.contadorPantalla}
          style={{ left: `${pantalla.izquierda}%`, top: `${pantalla.arriba}%` }}
          aria-hidden="true"
        >
          {contadorPecho(contadores)}
        </span>
      </div>
      <ul className={estilos.pkgs} aria-label="Elementos de la escena">
        {elementos.map((etiqueta, i) => {
          const efecto = efectos.get(i)
          return (
            <li
              key={i}
              className={[estilos.pkg, efecto && CLASE_EFECTO[efecto]].filter(Boolean).join(' ')}
            >
              <span aria-hidden="true">{etiqueta}</span>
              <span
                className={estilos.oculto}
              >{`Elemento ${i + 1}: ${efecto ? textos[efecto] : 'pendiente'}`}</span>
            </li>
          )
        })}
      </ul>
      <div className={estilos.belt} aria-hidden="true" />
    </div>
  )
}
