import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icono, type NombreIcono } from './Icono'
import estilos from './Boton.module.css'

type Variante = 'primario' | 'secundario' | 'pill'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: Variante
  icono?: NombreIcono
  children: ReactNode
}

/** Botón común: .btn, .btn.primary y .pill de la primera versión. */
export function Boton({
  variante = 'secundario',
  icono,
  className,
  children,
  type = 'button',
  ...resto
}: Props) {
  const clases = [
    variante === 'pill' ? estilos.pill : estilos.btn,
    variante === 'primario' && estilos.primario,
    className,
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <button type={type} className={clases} {...resto}>
      {icono && <Icono nombre={icono} />}
      {children}
    </button>
  )
}
