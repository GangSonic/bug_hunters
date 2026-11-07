import { create } from 'zustand'
import type { CasoId, MundoId } from '@/features/expedientes'
import { enlacePermitido, type CapaId, type PantallaId } from './pantallas'

interface EstadoNavegacion {
  pantalla: PantallaId
  mundo: MundoId
  casoId: CasoId
  capa: CapaId | null
  /** Va a otra pantalla solo si el enlace existe en la Tabla 14 (CA01.1). */
  irA: (destino: PantallaId, contexto?: { mundo?: MundoId; casoId?: CasoId }) => boolean
  abrirCapa: (capa: CapaId) => void
  cerrarCapa: () => void
}

export const useNavegacion = create<EstadoNavegacion>()((set, get) => ({
  pantalla: 'P1',
  mundo: 'control',
  casoId: 'loopi',
  capa: null,
  irA: (destino, contexto) => {
    const origen = get().pantalla
    if (!enlacePermitido(origen, destino)) {
      if (import.meta.env.DEV) console.warn(`Enlace no permitido: ${origen} → ${destino}`)
      return false
    }
    set({ pantalla: destino, capa: null, ...contexto })
    return true
  },
  abrirCapa: (capa) => set({ capa }),
  cerrarCapa: () => set({ capa: null }),
}))
