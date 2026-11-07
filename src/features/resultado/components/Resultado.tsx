import { obtenerExpediente, type CasoId } from '@/features/expedientes'
import { useCantidadResueltos } from '@/features/progreso'
import { Boton, Icono, Marco, rutaPublica } from '@/shared'
import estilos from './Resultado.module.css'

type Props = {
  casoId: CasoId
  onVerFicha: () => void
  onOtraMision: () => void
  onInicio: () => void
}

/** P6 Resultado y explicación (E7, E9). El nombre formal aparece aquí por primera vez. */
export function Resultado({ casoId, onVerFicha, onOtraMision, onInicio }: Props) {
  const caso = obtenerExpediente(casoId)
  const resueltos = useCantidadResueltos()
  return (
    <Marco titulo="¡Caso resuelto!">
      <div className={estilos.cuerpo}>
        <div className={estilos.insignia} aria-hidden="true">
          <Icono nombre="check" tamano={30} />
        </div>
        <img
          className={estilos.criatura}
          src={rutaPublica(caso.sprite)}
          alt={`${caso.criatura} feliz`}
        />
        <p className={estilos.caso}>
          {caso.criatura}: {caso.titulo}
        </p>
        <div className={estilos.tarjeta}>
          <p>
            <b>¿Qué pasaba?</b> {caso.ficha.senal}
          </p>
          <p>
            <b>¿Por qué?</b> {caso.ficha.causa}
          </p>
          <p>
            <b>¿Cómo se arregló?</b> {caso.ficha.solucion}
          </p>
          <p className={estilos.concepto}>
            Descubriste: {caso.concepto} <span lang="en">({caso.terminoIngles})</span>
          </p>
        </div>
        <p className={estilos.guardado} role="status">
          Progreso guardado: {resueltos} de 4 casos resueltos
        </p>
        <div className={estilos.acciones}>
          <Boton variante="primario" icono="libro" onClick={onVerFicha}>
            Ver ficha
          </Boton>
          <Boton onClick={onOtraMision}>Otra misión</Boton>
          <Boton icono="inicio" onClick={onInicio}>
            Inicio
          </Boton>
        </div>
      </div>
    </Marco>
  )
}
