import { Fragment } from 'react'
import { expedientesDelMundo, MUNDOS, type CasoId } from '@/features/expedientes'
import { useProgreso } from '@/features/progreso'
import { Boton, Icono, Marco, rutaPublica } from '@/shared'
import estilos from './Seleccion.module.css'

type Props = {
  onInvestigar: (caso: CasoId) => void
  onBugDex: () => void
  onInicio: () => void
}

/** P3 Selección: los dos mundos con sus casos en una sola pantalla (HU03, D-01). */
export function Seleccion({ onInvestigar, onBugDex, onInicio }: Props) {
  const resueltos = useProgreso((s) => s.resueltos)
  const cantidad = Object.keys(resueltos).length

  return (
    <Marco
      titulo="Elige tu próximo caso"
      izquierda={
        <Boton variante="pill" icono="atras" onClick={onInicio}>
          Inicio
        </Boton>
      }
      derecha={
        <Boton variante="pill" icono="libro" onClick={onBugDex}>
          BugDex
        </Boton>
      }
    >
      <div className={estilos.selBody}>
        <div className={estilos.worlds}>
          {MUNDOS.map((mundo) => (
            <section key={mundo.id} className={`${estilos.world} ${estilos[mundo.id]}`}>
              <div className={estilos.whead}>
                <div className={estilos.wi} aria-hidden="true">
                  <Icono nombre={mundo.id === 'control' ? 'caja' : 'datos'} tamano={24} />
                </div>
                <div className={estilos.wtxt}>
                  <h2>{mundo.nombre}</h2>
                  <p>{mundo.descripcion}</p>
                </div>
              </div>
              <div className={estilos.cases}>
                {expedientesDelMundo(mundo.id).map((caso) => {
                  const hecho = Boolean(resueltos[caso.id])
                  return (
                    <article key={caso.id} className={estilos.case}>
                      <div className={estilos.mini}>
                        <img src={rutaPublica(caso.sprite)} alt={caso.criatura} />
                      </div>
                      <h3 className={estilos.cname}>{caso.criatura}</h3>
                      <p className={estilos.cdesc}>{caso.problema}</p>
                      {/* CA03.2: el estado se dice con icono y texto, no solo con color. */}
                      <p className={`${estilos.estado} ${hecho ? estilos.estadoHecho : ''}`}>
                        {hecho && <Icono nombre="check" tamano={12} />}
                        {hecho ? 'Completado' : 'Disponible'}
                      </p>
                      <button
                        type="button"
                        className={estilos.inv}
                        onClick={() => onInvestigar(caso.id)}
                        aria-label={`Investigar el caso de ${caso.criatura}`}
                      >
                        Investigar
                      </button>
                    </article>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        <div className={estilos.progress}>
          <Icono nombre="grafica" tamano={18} />
          <span className={estilos.ptxt}>{cantidad} de 4 casos resueltos</span>
          <div className={estilos.dots} aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <Fragment key={i}>
                <div className={`${estilos.dot} ${i < cantidad ? estilos.dotDone : ''}`} />
                {i < 3 && <div className={estilos.dotline} />}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </Marco>
  )
}