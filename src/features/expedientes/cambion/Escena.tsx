import type { PropsEscena } from '../contrato'
import { EscenaBanda } from '../comun/EscenaBanda'

export function EscenaCambion(props: PropsEscena) {
  return (
    <EscenaBanda
      {...props}
      sprite="sprites/cambion.png"
      criatura="Cambión"
      etiquetaDestino="ALMACÉN"
      elementos={['□', '□', '□', '□']}
      contadorPecho={(c) => String(c.total ?? 0)}
      describir={{ ok: 'caja recibida' }}
    />
  )
}
