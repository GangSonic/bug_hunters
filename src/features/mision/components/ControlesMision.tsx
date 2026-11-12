import { Boton } from '@/shared'
import estilos from './ControlesMision.module.css'

type Props = {
  probarDeshabilitado: boolean
  /** Ya hubo un intento en esta ronda: el botón dice «Probar otra vez» (CA06.3). */
  probarOtraVez: boolean
  reiniciarDeshabilitado: boolean
  pistaDeshabilitada: boolean
  onProbar: () => void
  onReiniciar: () => void
  onPista: () => void
}

/** Zona E: los tres botones de la misión. Solo dibuja; las reglas viven en PantallaMision. */
export function ControlesMision({
  probarDeshabilitado,
  probarOtraVez,
  reiniciarDeshabilitado,
  pistaDeshabilitada,
  onProbar,
  onReiniciar,
  onPista,
}: Props) {
  return (
    <div className={estilos.controls} data-zona="probar">
      <Boton variante="primario" icono="jugar" onClick={onProbar} disabled={probarDeshabilitado}>
        {probarOtraVez ? 'Probar otra vez' : 'Probar'}
      </Boton>
      <Boton icono="reiniciar" onClick={onReiniciar} disabled={reiniciarDeshabilitado}>
        Reiniciar
      </Boton>
      <Boton icono="foco" onClick={onPista} disabled={pistaDeshabilitada}>
        Pista
      </Boton>
    </div>
  )
}
