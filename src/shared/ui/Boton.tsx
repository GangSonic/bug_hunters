import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icono, type NombreIcono } from './Icono'
import estilos from './Boton.module.css'

type Variante = 'primario' | 'secundario' | 'pill'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: Variante
  icono?: NombreIcono
  grande?: boolean
  ancho?: boolean
  children: ReactNode
}

export function Boton({
  variante = 'secundario',
  icono,
  grande,
  ancho,
  className,
  children,
  type = 'button',
  ...resto
}: Props) {
  const clases = [
    estilos.boton,
    variante === 'primario' && estilos.primario,
    variante === 'pill' && estilos.pill,
    grande && estilos.grande,
    ancho && estilos.ancho,
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
