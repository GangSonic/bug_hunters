import { useState } from 'react'
import { useCantidadResueltos, useProgreso } from '@/features/progreso'
import { Boton, Capa } from '@/shared'
import { useConfiguracion, type Tema } from '../store/configuracionStore'
import estilos from './Configuracion.module.css'

const TEMAS: { id: Tema; texto: string }[] = [
  { id: 'claro', texto: 'Claro' },
  { id: 'oscuro', texto: 'Oscuro' },
  { id: 'auto', texto: 'Auto' },
]

/** O3 Configuración (HU17). */
export function Configuracion({ onCerrar }: { onCerrar: () => void }) {
  const { tema, animaciones, cambiarTema, cambiarAnimaciones } = useConfiguracion()
  const resueltos = useCantidadResueltos()
  const reiniciarProgreso = useProgreso((s) => s.reiniciar)
  const [confirmando, setConfirmando] = useState(false)

  return (
    <Capa titulo="Configuración" onCerrar={onCerrar}>
      <div className={estilos.fila}>
        <div className={estilos.texto}>
          <div className={estilos.nombre} id="cfg-tema">
            Tema
          </div>
          <div className={estilos.descripcion}>Apariencia del juego</div>
        </div>
        <div className={estilos.segmentos} role="radiogroup" aria-labelledby="cfg-tema">
          {TEMAS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={tema === t.id}
              className={estilos.segmento}
              onClick={() => cambiarTema(t.id)}
            >
              {t.texto}
            </button>
          ))}
        </div>
      </div>

      <div className={estilos.fila}>
        <div className={estilos.texto}>
          <div className={estilos.nombre} id="cfg-anim">
            Animaciones
          </div>
          <div className={estilos.descripcion}>Movimiento de las criaturas y la escena</div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={animaciones}
          aria-labelledby="cfg-anim"
          className={estilos.interruptor}
          onClick={() => cambiarAnimaciones(!animaciones)}
        >
          <span />
        </button>
      </div>

      <div className={estilos.fila}>
        <div className={estilos.texto}>
          <div className={estilos.nombre}>Progreso</div>
          <div className={estilos.descripcion}>Casos resueltos: {resueltos} de 4</div>
          {confirmando && (
            <div className={estilos.confirmacion} role="alert">
              <span>¿Borrar los casos resueltos y las fichas? No se puede deshacer.</span>
              <Boton
                variante="primario"
                onClick={() => {
                  reiniciarProgreso()
                  setConfirmando(false)
                }}
              >
                Sí, reiniciar
              </Boton>
              <Boton onClick={() => setConfirmando(false)}>Cancelar</Boton>
            </div>
          )}
        </div>
        {!confirmando && (
          <Boton icono="reiniciar" onClick={() => setConfirmando(true)} disabled={resueltos === 0}>
            Reiniciar
          </Boton>
        )}
      </div>
    </Capa>
  )
}
