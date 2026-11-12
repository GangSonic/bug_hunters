import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { almacenSeguro } from '@/shared'

export type Tema = 'claro' | 'oscuro' | 'auto'

interface EstadoConfiguracion {
  tema: Tema
  animaciones: boolean
  /** Música de fondo; encendida de entrada, la persona la apaga desde la barra superior. */
  musica: boolean
  cambiarTema: (tema: Tema) => void
  cambiarAnimaciones: (activas: boolean) => void
  cambiarMusica: (activa: boolean) => void
}

/** Ajustes del jugador; independientes del progreso (CA13.4). */
export const useConfiguracion = create<EstadoConfiguracion>()(
  persist(
    (set) => ({
      tema: 'auto',
      animaciones: true,
      musica: true,
      cambiarTema: (tema) => set({ tema }),
      cambiarAnimaciones: (animaciones) => set({ animaciones }),
      cambiarMusica: (musica) => set({ musica }),
    }),
    {
      name: 'bug-hunters:configuracion',
      version: 1,
      storage: createJSONStorage(() => almacenSeguro),
      partialize: ({ tema, animaciones, musica }) => ({ tema, animaciones, musica }),
    },
  ),
)
