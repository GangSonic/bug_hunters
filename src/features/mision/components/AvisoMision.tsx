import type { Expediente } from '@/features/expedientes'
import { Boton, Icono, type NombreIcono } from '@/shared'
import type { EstadoMision } from '../logic/maquinaEstados'
import estilos from './PantallaMision.module.css'

type Props = {
  caso: Expediente
  mision: EstadoMision
  reproduciendo: boolean
  tutorialVisto: boolean
  onTerminarObservacion: () => void
  onOmitirObservacion: () => void
}

/** Barra de resultado (.resultbar): guía de E1 y desenlace de cada prueba. Se anuncia. */
export function AvisoMision(props: Props) {
  return (
    <div aria-live="polite" aria-atomic="true">
      <Contenido {...props} />
    </div>
  )
}

function Contenido({
  caso,
  mision,
  reproduciendo,
  tutorialVisto,
  onTerminarObservacion,
  onOmitirObservacion,
}: Props) {
  if (mision.estado === 'E1') {
    return (
      <div className={`${estilos.resultbar} ${estilos.info}`}>
        <Icono nombre="ojo" />
        <div style={{ minWidth: 0 }}>
          <p className={estilos.rt}>Paso 1 de 4: observa a {caso.criatura}</p>
          {!tutorialVisto && (
            <p className={estilos.rb}>
              Compara lo que hace con lo que pide la misión. Después investiga, elige una causa y
              prueba una corrección.
            </p>
          )}
          <div className={estilos.accionAviso}>
            {reproduciendo ? (
              <Boton onClick={onOmitirObservacion}>Omitir</Boton>
            ) : (
              <Boton variante="primario" onClick={onTerminarObservacion}>
                Siguiente
              </Boton>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (reproduciendo) return null
  const ultimo = mision.intentos.at(-1)
  if (!ultimo || !['E5a', 'E5b', 'E5c', 'E6'].includes(mision.estado)) return null

  const mensaje = caso.mensajes[ultimo.opcionId]
  const hipotesis = caso.hipotesis.find((h) => h.id === ultimo.hipotesisId)
  const variante =
    ultimo.desenlace === 'correcto'
      ? estilos.ok
      : ultimo.desenlace === 'incompleto'
        ? estilos.warn
        : estilos.err
  const icono: NombreIcono =
    ultimo.desenlace === 'correcto'
      ? 'check'
      : ultimo.desenlace === 'incompleto'
        ? 'alerta'
        : 'error'

  return (
    <div className={`${estilos.resultbar} ${variante}`}>
      <Icono nombre={icono} />
      <div style={{ minWidth: 0 }}>
        <p className={estilos.rt}>{mensaje?.titulo}</p>
        <p className={estilos.rb}>{mensaje?.cuerpo}</p>
        {hipotesis && !hipotesis.esCausa && (
          <p className={estilos.rb}>
            Tu hipótesis («{hipotesis.texto}») no coincide con la evidencia. Revisa las
            instrucciones.
          </p>
        )}
        {ultimo.desenlace === 'correcto' && (
          <div className={estilos.concepto}>
            <strong>Concepto:</strong> {caso.concepto}.
          </div>
        )}
      </div>
    </div>
  )
}
