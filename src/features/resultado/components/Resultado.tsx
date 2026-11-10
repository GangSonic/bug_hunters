import { useEffect, useRef } from 'react'
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

/** P6 Resultado y explicación (E7, E9), con el diseño de la primera versión. */
export function Resultado({ casoId, onVerFicha, onOtraMision, onInicio }: Props) {
  const caso = obtenerExpediente(casoId)
  const cantidad = useCantidadResueltos()
  const tituloRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => tituloRef.current?.focus(), [])

  return (
    <Marco>
      <div className={estilos.resBody}>
        <div className={estilos.resBadge} aria-hidden="true">
          <Icono nombre="check" />
        </div>
        <h1 ref={tituloRef} tabIndex={-1} className={estilos.titulo}>
          ¡Caso resuelto!
        </h1>
        <p className={estilos.resCase}>
          {caso.criatura} — {caso.titulo}
        </p>
        <img className={estilos.resImg} src={rutaPublica(caso.sprite)} alt={caso.criatura} />
        <div className={estilos.resCard}>
          <p>
            <b>¿Qué pasaba?</b> {caso.ficha.senal}
          </p>
          <p>
            <b>¿Por qué?</b> {caso.ficha.causa}
          </p>
          <p>
            <b>¿Cómo se arregló?</b> {caso.ficha.solucion}
          </p>
          <p className={estilos.resConcept}>
            <b>Concepto aprendido:</b> {caso.concepto} <span lang="en">({caso.terminoIngles})</span>
            .
          </p>
        </div>
        <p className={estilos.guardado}>Progreso guardado: {cantidad} de 4</p>
        <div className={estilos.resActions}>
          <Boton variante="primario" onClick={onVerFicha}>
            Ver ficha en BugDex
          </Boton>
          <Boton onClick={onOtraMision}>Otra misión</Boton>
          <Boton onClick={onInicio}>Inicio</Boton>
        </div>
      </div>
    </Marco>
  )
}