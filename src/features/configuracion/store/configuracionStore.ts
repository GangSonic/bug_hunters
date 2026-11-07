import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { almacenSeguro } from '@/shared'

export type Tema = 'claro' | 'oscuro' | 'auto'

interface EstadoConfiguracion {
  tema: Tema
  animaciones: boolean
  cambiarTema: (tema: Tema) => void
  cambiarAnimaciones: (activas: boolean) => void
}

/** Ajustes del jugador; independientes del progreso (CA13.4). */
export const useConfiguracion = create<EstadoConfiguracion>()(
  persist(
    (set) => ({
      tema: 'auto',
      animaciones: true,
      cambiarTema: (tema) => set({ tema }),
      cambiarAnimaciones: (animaciones) => set({ animaciones }),
    }),
    {
      name: 'bug-hunters:configuracion',
      version: 1,
      storage: createJSONStorage(() => almacenSeguro),
      partialize: ({ tema, animaciones }) => ({ tema, animaciones }),
    },
  ),
)
