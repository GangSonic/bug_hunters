import { useCantidadResueltos, useProgreso } from '@/features/progreso'
import { Boton, Marco, mostrarAviso } from '@/shared'
import { useConfiguracion, type Tema } from '../store/configuracionStore'
import estilos from './Configuracion.module.css'

const TEMAS: { id: Tema; texto: string }[] = [
  { id: 'claro', texto: 'Claro' },
  { id: 'oscuro', texto: 'Oscuro' },
  { id: 'auto', texto: 'Auto' },
]

/** O3 Configuración (HU17), con el diseño de pantalla de la primera versión. */
export function Configuracion({ onCerrar }: { onCerrar: () => void }) {
  const { tema, animaciones, cambiarTema, cambiarAnimaciones } = useConfiguracion()
  const resueltos = useCantidadResueltos()
  const reiniciarProgreso = useProgreso((s) => s.reiniciar)

  return (
    <Marco
      titulo="Configuración"
      izquierda={
        <Boton variante="pill" icono="atras" onClick={onCerrar}>
          Inicio
        </Boton>
      }
    >
      <div className={estilos.cfgBody}>
        <div className={estilos.cfgRow}>
          <div className={estilos.cfgTxt}>
            <div className={estilos.cfgK} id="cfg-tema">
              Tema
            </div>
            <div className={estilos.cfgD}>Apariencia del juego</div>
          </div>
          <div className={estilos.seg} role="group" aria-labelledby="cfg-tema">
            {TEMAS.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={tema === t.id}
                onClick={() => cambiarTema(t.id)}
              >
                {t.texto}
              </button>
            ))}
          </div>
        </div>

        <div className={estilos.cfgRow}>
          <div className={estilos.cfgTxt}>
            <div className={estilos.cfgK} id="cfg-anim">
              Animaciones
            </div>
            <div className={estilos.cfgD}>Movimiento de las criaturas</div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={animaciones}
            aria-labelledby="cfg-anim"
            className={estilos.switch}
            onClick={() => cambiarAnimaciones(!animaciones)}
          >
            <span />
          </button>
        </div>

        <div className={estilos.cfgRow}>
          <div className={estilos.cfgTxt}>
            <div className={estilos.cfgK}>Progreso</div>
            <div className={estilos.cfgD}>Casos resueltos: {resueltos} de 4</div>
          </div>
          <Boton
            className={estilos.reiniciar}
            onClick={() => {
              reiniciarProgreso()
              mostrarAviso('Progreso reiniciado.')
            }}
          >
            Reiniciar
          </Boton>
        </div>
      </div>
    </Marco>
  )
}
