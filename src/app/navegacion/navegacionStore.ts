import { create } from 'zustand'
import type { CasoId } from '@/features/expedientes'
import { enlacePermitido, type CapaId, type PantallaId } from './pantallas'

interface EstadoNavegacion {
  pantalla: PantallaId
  casoId: CasoId
  capa: CapaId | null
  /** Va a otra pantalla solo si el enlace existe en la tabla de enlaces (CA01.1). */
  irA: (destino: PantallaId, contexto?: { casoId?: CasoId }) => boolean
  abrirCapa: (capa: CapaId) => void
  cerrarCapa: () => void
}

export const useNavegacion = create<EstadoNavegacion>()((set, get) => ({
  pantalla: 'P1',
  casoId: 'loopi',
  capa: null,
  irA: (destino, contexto) => {
    const origen = get().pantalla
    if (!enlacePermitido(origen, destino)) {
      if (import.meta.env.DEV) console.warn(`Enlace no permitido: ${origen} → ${destino}`)
      return false
    }
    set({ pantalla: destino, capa: null, ...contexto })
    window.scrollTo?.(0, 0)
    return true
  },
  abrirCapa: (capa) => set({ capa }),
  cerrarCapa: () => set({ capa: null }),
}))
