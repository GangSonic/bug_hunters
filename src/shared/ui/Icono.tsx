import type { SVGProps } from 'react'

const TRAZOS = {
  jugar: <path d="M7 5l12 7-12 7z" fill="currentColor" stroke="none" />,
  pausa: (
    <>
      <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" />
      <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" />
    </>
  ),
  detener: <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none" />,
  check: <path d="M5 13l4 4L19 7" strokeWidth="3" />,
  alerta: (
    <>
      <path d="M12 3L2 20h20z" />
      <path d="M12 10v5M12 17.5v.3" />
    </>
  ),
  error: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6M12 16.5v.3" />
    </>
  ),
  atras: <path d="M15 18l-6-6 6-6" strokeWidth="2.4" />,
  inicio: <path d="M3 11l9-8 9 8M5 10v10h14V10" />,
  libro: (
    <>
      <path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2z" />
      <path d="M8 7h7M8 11h7" />
    </>
  ),
  engrane: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19 12a7 7 0 0 0-.1-1l2-1.6-2-3.4-2.4 1a7 7 0 0 0-1.7-1l-.4-2.5h-4l-.4 2.5a7 7 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7 7 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.4 2.5h4l.4-2.5a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6c.1-.3.1-.7.1-1z" />
    </>
  ),
  salir: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
  lupa: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4-4" />
    </>
  ),
  ojo: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  llave: <path d="M14 7l3 3M5 19l9-9 1-4 4-1 1 4-4 1-9 9-2 2-3 1 1-3z" />,
  foco: (
    <path d="M9 18h6M10 21h4M12 3a6 6 0 0 1 4 10c-.7.7-1 1.3-1 2H9c0-.7-.3-1.3-1-2a6 6 0 0 1 4-10z" />
  ),
  reiniciar: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </>
  ),
  caja: (
    <>
      <path d="M21 16V8l-9-5-9 5v8l9 5 9-5z" />
      <path d="M3.3 7L12 12l8.7-5M12 22V12" />
    </>
  ),
  datos: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </>
  ),
  ayuda: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 0 1 4.5 1.5c0 1.5-2 2-2 3M12 17h.01" />
    </>
  ),
  candado: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  bicho: (
    <>
      <path d="M9 3h6M10 3v4M14 3v4M7 11a5 5 0 0 1 10 0v5a5 5 0 0 1-10 0z" />
      <path d="M5 13h2M17 13h2M5 17h2M17 17h2" />
    </>
  ),
  cerrar: <path d="M6 6l12 12M18 6L6 18" />,
  portapapeles: (
    <>
      <path d="M8 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
    </>
  ),
  grafica: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  flechaAbajo: <path d="M12 5v14M6 13l6 6 6-6" strokeWidth="2.4" />,
} as const

export type NombreIcono = keyof typeof TRAZOS

type Props = SVGProps<SVGSVGElement> & { nombre: NombreIcono; tamano?: number }

/** Icono decorativo; el texto visible al lado es el que da el significado. */
export function Icono({ nombre, tamano = 16, ...resto }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={tamano}
      height={tamano}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...resto}
    >
      {TRAZOS[nombre]}
    </svg>
  )
}
