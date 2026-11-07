import type { PropsEscena } from '../contrato'
import { EscenaBanda } from '../comun/EscenaBanda'

export function EscenaLoopi(props: PropsEscena) {
  return (
    <EscenaBanda
      {...props}
      sprite="sprites/loopi.png"
      criatura="Loopi"
      etiquetaDestino="ENTREGA"
      elementos={['1', '2', '3', '4']}
      contadorPecho={(c) => `${c.entregados ?? 0}/4`}
      describir={{ ok: 'entregado' }}
    />
  )
}
