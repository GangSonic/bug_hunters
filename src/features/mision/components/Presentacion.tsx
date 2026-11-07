import { obtenerExpediente, obtenerMundo, type CasoId } from '@/features/expedientes'
import { Boton, Icono, Marco, rutaPublica } from '@/shared'
import estilos from './Presentacion.module.css'

type Props = {
  casoId: CasoId
  onComenzar: () => void
  onVolver: () => void
}

/** P4 Presentación de la misión (E0). */
export function Presentacion({ casoId, onComenzar, onVolver }: Props) {
  const caso = obtenerExpediente(casoId)
  return (
    <Marco
      titulo={`${caso.criatura}: ${caso.titulo}`}
      izquierda={
        <Boton variante="pill" icono="atras" onClick={onVolver}>
          Volver
        </Boton>
      }
    >
      <div className={estilos.cuerpo}>
        <img className={estilos.criatura} src={rutaPublica(caso.sprite)} alt={caso.criatura} />
        <p className={estilos.mundo}>{obtenerMundo(caso.mundo).nombre}</p>
        <p className={estilos.saludo}>{caso.saludo}</p>
        <p className={estilos.texto}>{caso.intro}</p>
        <p className={estilos.mision}>Misión: {caso.objetivo}</p>
        <ul className={estilos.pasos} aria-label="Pasos">
          <li className={estilos.paso}>
            <Icono nombre="ojo" /> Observa
          </li>
          <li className={estilos.paso}>
            <Icono nombre="lupa" /> Investiga
          </li>
          <li className={estilos.paso}>
            <Icono nombre="llave" /> Repara
          </li>
        </ul>
        <Boton variante="primario" grande icono="jugar" onClick={onComenzar}>
          Comenzar
        </Boton>
      </div>
    </Marco>
  )
}
