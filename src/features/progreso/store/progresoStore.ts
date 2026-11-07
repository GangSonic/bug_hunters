import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { CasoId } from '@/features/expedientes'
import { almacenSeguro } from '@/shared'

export const CLAVE_PROGRESO = 'bug-hunters:progreso'
export const VERSION_PROGRESO = 1

interface DatosProgreso {
  resueltos: Partial<Record<CasoId, { fecha: string }>>
  tutorialVisto: boolean
}

interface EstadoProgreso extends DatosProgreso {
  marcarResuelto: (id: CasoId) => void
  marcarTutorialVisto: () => void
  reiniciar: () => void
}

const INICIAL: DatosProgreso = { resueltos: {}, tutorialVisto: false }

/** Progreso del jugador guardado en el navegador (HU13). */
export const useProgreso = create<EstadoProgreso>()(
  persist(
    (set) => ({
      ...INICIAL,
      marcarResuelto: (id) =>
        set((estado) =>
          estado.resueltos[id]
            ? estado
            : { resueltos: { ...estado.resueltos, [id]: { fecha: new Date().toISOString() } } },
        ),
      marcarTutorialVisto: () => set({ tutorialVisto: true }),
      reiniciar: () => set({ ...INICIAL }),
    }),
    {
      name: CLAVE_PROGRESO,
      version: VERSION_PROGRESO,
      storage: createJSONStorage(() => almacenSeguro),
      partialize: ({ resueltos, tutorialVisto }) => ({ resueltos, tutorialVisto }),
      // Un formato de otra versión se descarta sin error (CA13.3).
      migrate: () => ({ ...INICIAL }),
    },
  ),
)

export const useCantidadResueltos = () =>
  useProgreso((estado) => Object.keys(estado.resueltos).length)

export const useEstaResuelto = (id: CasoId) =>
  useProgreso((estado) => Boolean(estado.resueltos[id]))
