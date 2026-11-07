import { EXPEDIENTES, obtenerMundo } from '@/features/expedientes'
import { useProgreso } from '@/features/progreso'
import { Boton, Marco, rutaPublica } from '@/shared'
import estilos from './BugDex.module.css'

type Props = {
  onVolver: () => void
  onInicio: () => void
}

/** P7 BugDex (HU14), con el diseño de la primera versión. */
export function BugDex({ onVolver, onInicio }: Props) {
  const resueltos = useProgreso((s) => s.resueltos)
  const cantidad = Object.keys(resueltos).length
  return (
    <Marco
      titulo="BugDex"
      subtitulo={`Fichas de los casos resueltos · ${cantidad} de 4`}
      izquierda={
        <Boton variante="pill" icono="atras" onClick={onVolver}>
          Volver
        </Boton>
      }
      derecha={
        <Boton variante="pill" icono="inicio" onClick={onInicio}>
          Inicio
        </Boton>
      }
    >
      <ul className={estilos.dexBody}>
        {EXPEDIENTES.map((caso) => {
          const resuelto = Boolean(resueltos[caso.id])
          return (
            <li key={caso.id} className={`${estilos.dexCard} ${resuelto ? '' : estilos.locked}`}>
              <div className={estilos.dexTop}>
                <img
                  src={rutaPublica(caso.sprite)}
                  alt={resuelto ? caso.criatura : 'Criatura por descubrir'}
                />
                <div>
                  <h2 className={estilos.dexName}>{resuelto ? caso.criatura : '? ? ?'}</h2>
                  <p className={estilos.dexWorld}>{obtenerMundo(caso.mundo).nombre}</p>
                </div>
                <span className={estilos.dexNum}>N.º {caso.numero}</span>
              </div>
              {resuelto ? (
                <>
                  <dl className={estilos.dexRows}>
                    <div>
                      <dt>Señal:</dt> <dd>{caso.ficha.senal}</dd>
                    </div>
                    <div>
                      <dt>Causa:</dt> <dd>{caso.ficha.causa}</dd>
                    </div>
                    <div>
                      <dt>Corrección:</dt> <dd>{caso.ficha.solucion}</dd>
                    </div>
                  </dl>
                  <p className={estilos.dexConcept}>
                    {caso.concepto} <span lang="en">({caso.terminoIngles})</span>
                  </p>
                </>
              ) : (
                <p className={estilos.dexPending}>
                  Por resolver. Completa el caso para desbloquear su ficha.
                </p>
              )}
            </li>
          )
        })}
      </ul>
    </Marco>
  )
}
