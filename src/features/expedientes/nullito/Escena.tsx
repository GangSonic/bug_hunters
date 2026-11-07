import type { PropsEscena } from '../contrato'
import { EscenaBanda } from '../comun/EscenaBanda'
import { PEDIDOS } from './simular'

// Pendiente (HU11, D-03): escena propia de cafetería con un pedido ausente.
export function EscenaNullito(props: PropsEscena) {
  return (
    <EscenaBanda
      {...props}
      sprite="sprites/nullito.png"
      criatura="Nullito"
      etiquetaDestino="COCINA"
      elementos={PEDIDOS.map((p) => (p === null ? '∅' : String(p)))}
      contadorPecho={(c) => `${c.atendidos ?? 0}/4`}
      describir={{
        ok: 'preparado',
        fallo: 'no existe y detuvo la cocina',
        aviso: 'no existe; se avisó',
        omitido: 'no existe; quedó sin respuesta',
      }}
    />
  )
}
