import estilos from './ListaPistas.module.css'

type Props = {
  /** Pistas que el jugador ya pidió, en orden. */
  vistas: string[]
  /** Cuántas pistas tiene el caso. */
  total: number
}

/** Pistas ya vistas dentro del panel Investiga; quedan visibles hasta reiniciar el caso. */
export function ListaPistas({ vistas, total }: Props) {
  return (
    <div aria-live="polite">
      {vistas.length > 0 && (
        <ul className={estilos.pistas} aria-label="Pistas">
          {vistas.map((texto, i) => (
            <li key={texto} className={estilos.pista}>
              <strong>
                Pista {i + 1} de {total}:
              </strong>{' '}
              {texto}
            </li>
          ))}
        </ul>
      )}
      {vistas.length === total && (
        <p className={estilos.sinMas}>Ya viste las {total} pistas de este caso.</p>
      )}
    </div>
  )
}
