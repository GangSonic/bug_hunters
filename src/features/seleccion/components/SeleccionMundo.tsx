import { expedientesDelMundo, MUNDOS, type MundoId } from '@/features/expedientes'
import { useProgreso } from '@/features/progreso'
import { Boton, Icono, Marco, rutaPublica } from '@/shared'
import { BarraAvance } from './BarraAvance'
import estilos from './Seleccion.module.css'

type Props = {
  onElegirMundo: (mundo: MundoId) => void
  onVolver: () => void
}

/** P2 Selección de mundo (HU03, CA03.1). */
export function SeleccionMundo({ onElegirMundo, onVolver }: Props) {
  const resueltos = useProgreso((s) => s.resueltos)
  return (
    <Marco
      titulo="Elige un mundo"
      izquierda={
        <Boton variante="pill" icono="atras" onClick={onVolver}>
          Inicio
        </Boton>
      }
    >
      <div className={estilos.cuerpo}>
        <div className={estilos.mundos}>
          {MUNDOS.map((mundo) => {
            const casos = expedientesDelMundo(mundo.id)
            const hechos = casos.filter((c) => resueltos[c.id]).length
            return (
              <article key={mundo.id} className={`${estilos.tarjeta} ${estilos[mundo.id]}`}>
                <div className={estilos.cabeceraMundo}>
                  <span className={estilos.iconoMundo} aria-hidden="true">
                    <Icono nombre={mundo.id === 'control' ? 'caja' : 'datos'} />
                  </span>
                  <div>
                    <h2 className={estilos.nombreMundo}>{mundo.nombre}</h2>
                    <p className={estilos.descripcion}>{mundo.descripcion}</p>
                  </div>
                </div>
                <div className={estilos.criaturas}>
                  {casos.map((c) => (
                    <img key={c.id} src={rutaPublica(c.sprite)} alt={c.criatura} />
                  ))}
                </div>
                <div className={estilos.pie}>
                  <p className={estilos.descripcion}>
                    {hechos} de {casos.length} casos resueltos
                  </p>
                  <Boton variante="primario" onClick={() => onElegirMundo(mundo.id)}>
                    Elegir {mundo.nombre}
                  </Boton>
                </div>
              </article>
            )
          })}
        </div>
        <BarraAvance />
      </div>
    </Marco>
  )
}
