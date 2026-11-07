import { useAvisos } from '../lib/avisos'
import estilos from './Aviso.module.css'

/** Aviso flotante global. Se monta una vez en la app. */
export function Aviso() {
  const { mensaje, visible } = useAvisos()
  return (
    <div
      className={`${estilos.toast} ${visible ? estilos.visible : ''}`}
      role="status"
      aria-live="polite"
    >
      {mensaje}
    </div>
  )
}
