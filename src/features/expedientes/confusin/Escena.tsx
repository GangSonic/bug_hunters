import { rutaPublica } from '@/shared'
import type { PropsEscena } from '../contrato'
import { PEDIDOS } from './simular'
import estilos from './escena.module.css'

type Rama = 'Norte' | 'Sur'

/** A dónde se envió el pedido, según su destino real y si la regla acertó. */
function ramaEnviada(destino: Rama, acerto: boolean): Rama {
  if (acerto) return destino
  return destino === 'Norte' ? 'Sur' : 'Norte'
}

/** Escena propia de Confusín: bifurcación con destinos Norte y Sur (HU10, CA10.4). */
export function EscenaConfusin({ pasos, reproduciendo, desenlace }: PropsEscena) {
  const efectos = new Map<number, 'ok' | 'mal'>()
  for (const paso of pasos) {
    if (paso.elemento !== null && (paso.efecto === 'ok' || paso.efecto === 'mal')) {
      efectos.set(paso.elemento, paso.efecto)
    }
  }
  const bien = pasos.at(-1)?.contadores.bien ?? 0

  const animo =
    reproduciendo || desenlace === null
      ? estilos.walking
      : desenlace === 'correcto'
        ? estilos.happy
        : estilos.dizzy

  const enRama: Record<Rama, { i: number; destino: Rama; ok: boolean }[]> = {
    Norte: [],
    Sur: [],
  }
  const pendientes: { i: number; destino: Rama }[] = []
  PEDIDOS.forEach((destino, i) => {
    const efecto = efectos.get(i)
    if (efecto) {
      const ok = efecto === 'ok'
      enRama[ramaEnviada(destino, ok)].push({ i, destino, ok })
    } else {
      pendientes.push({ i, destino })
    }
  })

  const rama = (nombre: Rama, pedidos: { i: number; destino: Rama; ok: boolean }[]) => (
    <div className={estilos.rama}>
      <span className={estilos.etiqueta}>{nombre.toUpperCase()}</span>
      <ul className={estilos.caja} aria-label={`Pedidos enviados al ${nombre}`}>
        {pedidos.map((p) => (
          <li key={p.i} className={`${estilos.pedido} ${p.ok ? estilos.ok : estilos.mal}`}>
            <span aria-hidden="true">{p.destino.charAt(0)}</span>
            <span className={estilos.oculto}>
              {`Pedido ${p.i + 1} con destino ${p.destino}: ${
                p.ok ? 'llegó bien' : 'llegó al lado equivocado'
              }`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <div className={estilos.area}>
      <div className={estilos.izq}>
        <div className={`${estilos.criatura} ${animo}`}>
          <img src={rutaPublica('sprites/confusin.png')} alt="Confusín" />
          <span className={estilos.contador} aria-hidden="true">{`${bien}/4`}</span>
        </div>
        <ul className={estilos.cola} aria-label="Pedidos por clasificar">
          {pendientes.map((p) => (
            <li key={p.i} className={estilos.pedido}>
              <span aria-hidden="true">{p.destino.charAt(0)}</span>
              <span className={estilos.oculto}>
                {`Pedido ${p.i + 1} con destino ${p.destino}: pendiente`}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className={estilos.der}>
        {rama('Norte', enRama.Norte)}
        {rama('Sur', enRama.Sur)}
      </div>
    </div>
  )
}
