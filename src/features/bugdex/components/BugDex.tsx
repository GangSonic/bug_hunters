import { EXPEDIENTES, obtenerMundo, type CasoId } from '@/features/expedientes'
import { useProgreso } from '@/features/progreso'
import { Boton, Icono, Marco, rutaPublica } from '@/shared'
import estilos from './BugDex.module.css'

type Props = {
  /** Ficha que se resalta al llegar desde P6 («Ver ficha»). */
  casoResaltado?: CasoId
  onVolver: () => void
  onInicio: () => void
}

/** P7 BugDex (HU14): una ficha por caso; las no resueltas se ven bloqueadas. */
export function BugDex({ casoResaltado, onVolver, onInicio }: Props) {
  const resueltos = useProgreso((s) => s.resueltos)
  const cantidad = Object.keys(resueltos).length
  return (
    <Marco
      titulo="BugDex"
      subtitulo="Fichas de los bugs que has resuelto"
      izquierda={
        <Boton variante="pill" icono="atras" onClick={onVolver}>
          Volver al laboratorio
        </Boton>
      }
      derecha={
        <Boton variante="pill" icono="inicio" onClick={onInicio}>
          Inicio
        </Boton>
      }
    >
      <div className={estilos.cuerpo}>
        <p className={estilos.resumen}>{cantidad} de 4 fichas</p>
        <ul className={estilos.fichas}>
          {EXPEDIENTES.map((caso) => {
            const desbloqueada = Boolean(resueltos[caso.id])
            const clases = [
              estilos.ficha,
              !desbloqueada && estilos.bloqueada,
              casoResaltado === caso.id && estilos.resaltada,
            ]
              .filter(Boolean)
              .join(' ')
            return (
              <li key={caso.id} className={clases}>
                <div className={estilos.cabecera}>
                  <img src={rutaPublica(caso.sprite)} alt="" />
                  <div>
                    <h2 className={estilos.nombre}>{desbloqueada ? caso.criatura : '???'}</h2>
                    <p className={estilos.mundo}>{obtenerMundo(caso.mundo).nombre}</p>
                  </div>
                  <span className={estilos.numero}>N.º {caso.numero}</span>
                </div>
                {desbloqueada ? (
                  <>
                    <dl className={estilos.filas}>
                      <div>
                        <dt>Señal: </dt>
                        <dd>{caso.ficha.senal}</dd>
                      </div>
                      <div>
                        <dt>Causa: </dt>
                        <dd>{caso.ficha.causa}</dd>
                      </div>
                      <div>
                        <dt>Solución: </dt>
                        <dd>{caso.ficha.solucion}</dd>
                      </div>
                    </dl>
                    <p className={estilos.concepto}>
                      {caso.concepto} <span lang="en">({caso.terminoIngles})</span>
                    </p>
                  </>
                ) : (
                  <p className={estilos.pendiente}>
                    <Icono nombre="candado" tamano={12} /> Por descubrir. Resuelve el caso para
                    desbloquear su ficha.
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </Marco>
  )
}
