import { obtenerExpediente } from '@/features/expedientes'
import { Boton, Icono, rutaPublica, useMovimientoReducido } from '@/shared'
import estilos from './Recuperacion.module.css'

type Props = {
  caso: ReturnType<typeof obtenerExpediente>
  continuar: () => void
}

/**
 * Recuperación (E6, CA08.1): animación breve cuando el caso se resuelve, en una sola fila
 * para no agrandar P5. Con movimiento reducido o animaciones apagadas se ve solo el estado final.
 */
export function Recuperacion({ caso, continuar }: Props) {
  const reducido = useMovimientoReducido()

  return (
    <div className={estilos.recuperacion}>
      <img
        className={`${estilos.sprite} ${reducido ? '' : estilos.anima}`}
        src={rutaPublica(caso.sprite)}
        alt=""
      />
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
