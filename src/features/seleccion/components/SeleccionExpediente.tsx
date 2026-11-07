import {
  expedientesDelMundo,
  obtenerMundo,
  type CasoId,
  type MundoId,
} from '@/features/expedientes'
import { useProgreso } from '@/features/progreso'
import { Boton, Icono, Marco, rutaPublica } from '@/shared'
import { BarraAvance } from './BarraAvance'
import estilos from './Seleccion.module.css'

type Props = {
  mundo: MundoId
  onInvestigar: (caso: CasoId) => void
  onBugDex: () => void
  onVolver: () => void
}

/** P3 Selección de expediente (HU03, CA03.2–CA03.4). Todos los casos están disponibles (D-02). */
export function SeleccionExpediente({ mundo, onInvestigar, onBugDex, onVolver }: Props) {
  const resueltos = useProgreso((s) => s.resueltos)
  const datosMundo = obtenerMundo(mundo)
  return (
    <Marco
      titulo="Elige tu próximo caso"
      subtitulo={datosMundo.nombre}
      izquierda={
        <Boton variante="pill" icono="atras" onClick={onVolver}>
          Volver
        </Boton>
      }
      derecha={
        <Boton variante="pill" icono="libro" onClick={onBugDex}>
          BugDex
        </Boton>
      }
    >
      <div className={estilos.cuerpo}>
        <div className={estilos.casos}>
          {expedientesDelMundo(mundo).map((caso) => {
            const hecho = Boolean(resueltos[caso.id])
            return (
              <article key={caso.id} className={estilos.caso}>
                <img src={rutaPublica(caso.sprite)} alt="" />
                <h2 className={estilos.nombreCaso}>
                  {caso.criatura}: {caso.titulo}
                </h2>
                <p className={estilos.problema}>{caso.problema}</p>
                <span className={`${estilos.estadoCaso} ${hecho ? estilos.completado : ''}`}>
                  <Icono nombre={hecho ? 'check' : 'lupa'} tamano={12} />
                  {hecho ? 'Completado' : 'Disponible'}
                </span>
                <Boton
                  variante="primario"
                  ancho
                  onClick={() => onInvestigar(caso.id)}
                  aria-label={`Investigar el caso de ${caso.criatura}`}
                >
                  Investigar
                </Boton>
              </article>
            )
          })}
        </div>
        <BarraAvance />
      </div>
    </Marco>
  )
}
