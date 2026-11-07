import type { PropsEscena } from '../contrato'
import { EscenaBanda } from '../comun/EscenaBanda'
import { PEDIDOS } from './simular'

// Pendiente (HU10, CA10.4): bifurcación con destinos Norte y Sur.
export function EscenaConfusin(props: PropsEscena) {
  return (
    <EscenaBanda
      {...props}
      sprite="sprites/confusin.png"
      criatura="Confusín"
      etiquetaDestino="NORTE / SUR"
      elementos={PEDIDOS.map((d) => d.charAt(0))}
      contadorPecho={(c) => `${c.bien ?? 0}/4`}
      describir={{ ok: 'llegó a su destino', mal: 'llegó al destino equivocado' }}
    />
  )
}
