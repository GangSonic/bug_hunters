import { create } from 'zustand'

interface EstadoAvisos {
  mensaje: string
  visible: boolean
  /** Muestra un aviso flotante (toast) durante 3 segundos, como en la primera versión. */
  mostrar: (mensaje: string) => void
  ocultar: () => void
}

let temporizador: ReturnType<typeof setTimeout> | undefined

export const useAvisos = create<EstadoAvisos>()((set) => ({
  mensaje: '',
  visible: false,
  mostrar: (mensaje) => {
    clearTimeout(temporizador)
    set({ mensaje, visible: true })
    temporizador = setTimeout(() => set({ visible: false }), 3000)
  },
  ocultar: () => set({ visible: false }),
}))

/** Atajo para usar fuera de componentes o en manejadores. */
export const mostrarAviso = (mensaje: string) => useAvisos.getState().mostrar(mensaje)
