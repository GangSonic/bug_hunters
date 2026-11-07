import { Icono, rutaPublica } from '@/shared'
import type { EfectoPaso, PropsEscena } from '../contrato'
import estilos from './EscenaBanda.module.css'

type Props = PropsEscena & {
  sprite: string
  criatura: string
  etiquetaDestino: string
  elementos: string[]
  /** Texto del contador que la criatura lleva en el pecho. */
  contadorPecho: (contadores: Record<string, number>) => string
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

/**
 * Escena compartida de banda transportadora. Cada expediente la configura en su Escena.tsx.
 * Pendiente (ver auditoría): Confusín y Nullito necesitan escenas propias.
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
  describir,
}: Props) {
  const efectos = new Map<number, EfectoPaso>()
  let ultimoElemento = -1
  for (const paso of pasos) {
    if (paso.elemento !== null) {
      efectos.set(paso.elemento, paso.efecto)
      ultimoElemento = Math.max(ultimoElemento, paso.elemento)
    }
  }
  const vueltasVacias = pasos.filter((p) => p.efecto === 'vacio').length
  const contadores = pasos.at(-1)?.contadores ?? {}
  const animo = reproduciendo
    ? estilos.caminando
    : desenlace === 'correcto'
      ? estilos.feliz
      : desenlace
        ? estilos.mareado
        : ''
  const avance = elementos.length > 0 ? (ultimoElemento + 1) / elementos.length : 0
  const textos = { ...DESCRIPCION_BASE, ...describir }

  return (
    <div className={estilos.escena}>
      {vueltasVacias > 0 && (
        <span className={estilos.vueltas}>Vueltas sin paquete: {vueltasVacias}</span>
      )}
      <div className={estilos.destino} aria-hidden="true">
        <span className={estilos.etiquetaDestino}>{etiquetaDestino}</span>
        <Icono nombre="check" />
      </div>
      <div className={`${estilos.criatura} ${animo}`} style={{ left: `${3 + avance * 42}%` }}>
        <img src={rutaPublica(sprite)} alt={criatura} />
        <span className={estilos.contadorPecho} aria-hidden="true">
          {contadorPecho(contadores)}
        </span>
      </div>
      <ul className={estilos.elementos} aria-label="Elementos de la escena">
        {elementos.map((etiqueta, i) => {
          const efecto = efectos.get(i)
          return (
            <li key={i} className={`${estilos.elemento} ${efecto ? estilos[efecto] : ''}`}>
              <span aria-hidden="true">{etiqueta}</span>
              <span className={estilos.oculto}>
                {`Elemento ${i + 1}: ${efecto ? textos[efecto] : 'pendiente'}`}
              </span>
            </li>
          )
        })}
      </ul>
      <div className={estilos.banda} aria-hidden="true" />
    </div>
  )
}
