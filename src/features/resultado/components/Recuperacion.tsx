import { obtenerExpediente } from '@/features/expedientes'
import { Boton, Icono, rutaPublica, useMovimientoReducido } from '@/shared'
import estilos from './Recuperacion.module.css'

type Props = {
  caso: ReturnType<typeof obtenerExpediente>
  continuar: () => void
}

/**
 * Recuperación (E6, CA08.1): animación breve cuando el caso se resuelve.
 * Con movimiento reducido o animaciones apagadas se ve solo el estado final.
 */
export function Recuperacion({ caso, continuar }: Props) {
  const reducido = useMovimientoReducido()

  return (
    <div className={estilos.recuperacion}>
      <div className={`${estilos.escena} ${reducido ? '' : estilos.anima}`}>
        <span className={estilos.halo} aria-hidden="true" />
        <img className={estilos.sprite} src={rutaPublica(caso.sprite)} alt="" />
      </div>
      <p className={estilos.mensaje} role="status">
        <Icono nombre="check" tamano={14} />
        {caso.criatura} se recuperó
      </p>
      <Boton variante="primario" onClick={continuar}>
        Continuar ›
      </Boton>
    </div>
  )
}
