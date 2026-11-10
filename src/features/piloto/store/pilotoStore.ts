import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { almacenSeguro } from '@/shared'
import type { RegistroPiloto } from '../tipos'

export const CLAVE_PILOTO = 'bug-hunters:piloto'
export const VERSION_PILOTO = 1

interface DatosPiloto {
  codigo: string
  registros: RegistroPiloto[]
}

interface EstadoPiloto extends DatosPiloto {
  registrar: (registro: RegistroPiloto) => void
  cambiarCodigo: (codigo: string) => void
  limpiar: () => void
}

const INICIAL: DatosPiloto = { codigo: '', registros: [] }

/** Registro de la sesión del piloto, guardado en el navegador (HU18, RNF07: nada sale solo). */
export const usePiloto = create<EstadoPiloto>()(
  persist(
    (set) => ({
      ...INICIAL,
      registrar: (registro) => set((e) => ({ registros: [...e.registros, registro] })),
      cambiarCodigo: (codigo) => set({ codigo }),
      limpiar: () => set({ registros: [] }),
    }),
    {
      name: CLAVE_PILOTO,
      version: VERSION_PILOTO,
      storage: createJSONStorage(() => almacenSeguro),
      partialize: ({ codigo, registros }) => ({ codigo, registros }),
    },
  ),
)
