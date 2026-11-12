import { useConfiguracion } from '@/features/configuracion'
import { Icono } from '@/shared'
import estilos from './BotonMusica.module.css'

type Props = { className?: string }

/**
 * Enciende o apaga la música desde la barra superior, en cualquier pantalla (WCAG 1.4.2).
 * El nombre es siempre «Música»; el estado lo dan aria-pressed y, a la vista, el icono y el tachado.
 */
export function BotonMusica({ className }: Props) {
  const activa = useConfiguracion((s) => s.musica)
  const cambiarMusica = useConfiguracion((s) => s.cambiarMusica)

  return (
    <button
      type="button"
      className={[className, estilos.boton, !activa && estilos.apagada].filter(Boolean).join(' ')}
      aria-pressed={activa}
      onClick={() => cambiarMusica(!activa)}
    >
      <Icono nombre={activa ? 'musica' : 'silencio'} tamano={13} />
      <span>Música</span>
    </button>
  )
}
