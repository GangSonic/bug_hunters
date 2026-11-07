import { obtenerExpediente, obtenerMundo, type CasoId } from '@/features/expedientes'
import { Boton, Icono, Marco, rutaPublica } from '@/shared'
import estilos from './Presentacion.module.css'

type Props = {
  casoId: CasoId
  onComenzar: () => void
  onVolver: () => void
}

/** P4 Presentación de la misión (E0), con la estructura de la primera versión. */
export function Presentacion({ casoId, onComenzar, onVolver }: Props) {
  const caso = obtenerExpediente(casoId)
  return (
    <Marco
      titulo="Expediente"
      izquierda={
        <Boton variante="pill" icono="atras" onClick={onVolver}>
          Volver
        </Boton>
      }
    >
      <div className={estilos.presBody}>
        <img className={estilos.presImg} src={rutaPublica(caso.sprite)} alt={caso.criatura} />
        <h2 className={estilos.presTitle}>
          {caso.criatura} — {caso.titulo}
        </h2>
        <p className={estilos.presSub}>{obtenerMundo(caso.mundo).nombre}</p>
        <p className={estilos.presText}>{caso.intro}</p>
        <ul className={estilos.presSteps} aria-label="Pasos">
          <li className={estilos.presChip}>
            <Icono nombre="ojo" /> Observa
          </li>
          <li className={estilos.presChip}>
            <Icono nombre="lupa" /> Investiga
          </li>
          <li className={estilos.presChip}>
            <Icono nombre="llave" /> Repara
          </li>
        </ul>
        <Boton variante="primario" className={estilos.comenzar} onClick={onComenzar}>
          Comenzar
        </Boton>
      </div>
    </Marco>
  )
}
