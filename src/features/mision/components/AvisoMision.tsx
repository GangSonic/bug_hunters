import type { Dispatch } from 'react'
import type { Expediente } from '@/features/expedientes'
import { Boton, Icono } from '@/shared'
import type { EstadoMision, Evento } from '../logic/maquinaEstados'
import estilos from './PantallaMision.module.css'

type Props = {
  caso: Expediente
  mision: EstadoMision
  despachar: Dispatch<Evento>
  reproduciendo: boolean
  tutorialVisto: boolean
  onTerminarObservacion: () => void
  onOmitirObservacion: () => void
  onContinuar: () => void
}

/** Avisos de la misión: guía de E1 y resultado de cada prueba (E5a, E5b, E5c). Se anuncian. */
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
  despachar,
  reproduciendo,
  tutorialVisto,
  onTerminarObservacion,
  onOmitirObservacion,
  onContinuar,
}: Props) {
  if (mision.estado === 'E1') {
    return (
      <div className={estilos.aviso}>
        <Icono nombre="ojo" tamano={20} />
        <div>
          <p className={estilos.avisoTitulo}>Paso 1 de 4: observa a {caso.criatura}</p>
          {!tutorialVisto && (
            <p>
              Compara lo que hace con lo que pide la misión. Después investiga, elige una causa y
              repara la regla.
            </p>
          )}
          <div className={estilos.avisoAcciones}>
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
  if (!ultimo || !['E5a', 'E5b', 'E5c'].includes(mision.estado)) return null

  const mensaje = caso.mensajes[ultimo.opcionId]
  const hipotesis = caso.hipotesis.find((h) => h.id === ultimo.hipotesisId)
  const claseDesenlace = estilos[ultimo.desenlace]
  const icono =
    ultimo.desenlace === 'correcto'
      ? 'check'
      : ultimo.desenlace === 'incompleto'
        ? 'alerta'
        : 'error'

  return (
    <div className={`${estilos.aviso} ${claseDesenlace}`}>
      <Icono nombre={icono} tamano={20} />
      <div>
        <p className={estilos.avisoTitulo}>{mensaje?.titulo}</p>
        <p>{mensaje?.cuerpo}</p>
        {hipotesis && !hipotesis.esCausa && (
          <p className={estilos.nota}>
            Tu hipótesis («{hipotesis.texto}») no coincide con lo que muestra la evidencia. Revisa
            las instrucciones antes de probar otra vez.
          </p>
        )}
        <div className={estilos.avisoAcciones}>
          {mision.estado === 'E5a' ? (
            <Boton variante="primario" onClick={onContinuar}>
              Continuar
            </Boton>
          ) : (
            <Boton icono="lupa" onClick={() => despachar({ tipo: 'REVISAR' })}>
              Revisar la evidencia
            </Boton>
          )}
        </div>
      </div>
    </div>
  )
}
