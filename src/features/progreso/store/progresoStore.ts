import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { StateStorage } from 'zustand/middleware'
import type { CasoId } from '@/features/expedientes'
import { almacenSeguro } from '@/shared'

export const CLAVE_PROGRESO = 'bug-hunters:progreso'
export const VERSION_PROGRESO = 1

interface DatosProgreso {
  resueltos: Partial<Record<CasoId, { fecha: string }>>
  tutorialVisto: boolean
}

interface EstadoProgreso extends DatosProgreso {
  /** true si al arrancar se descartó un progreso dañado o de otra versión (CA13.3). */
  progresoDescartado: boolean
  marcarResuelto: (id: CasoId) => void
  marcarTutorialVisto: () => void
  cerrarAvisoDescartado: () => void
  reiniciar: () => void
}

const INICIAL: DatosProgreso = { resueltos: {}, tutorialVisto: false }

// Se activa durante la lectura y se consume en `merge`, que es donde se decide.
let descartarAlHidratar = false

/** almacenSeguro devuelve null si el dato está dañado; aquí lo distinguimos de "no hay nada". */
const almacenProgreso: StateStorage = {
  ...almacenSeguro,
  getItem: (clave) => {
    // almacenSeguro es síncrono, por eso el cast.
    const valor = almacenSeguro.getItem(clave) as string | null
    if (valor === null && existeDato(clave)) descartarAlHidratar = true
    return valor
  },
}

function existeDato(clave: string): boolean {
  try {
    return localStorage.getItem(clave) !== null
  } catch {
    return false
  }
}

function esProgresoValido(dato: unknown): dato is DatosProgreso {
  if (typeof dato !== 'object' || dato === null) return false
  const { resueltos, tutorialVisto } = dato as Record<string, unknown>
  return (
    typeof tutorialVisto === 'boolean' &&
    typeof resueltos === 'object' &&
    resueltos !== null &&
    !Array.isArray(resueltos)
  )
}

/** Progreso del jugador guardado en el navegador (HU13). */
export const useProgreso = create<EstadoProgreso>()(
  persist(
    (set) => ({
      ...INICIAL,
      progresoDescartado: false,
      marcarResuelto: (id) =>
        set((estado) =>
          estado.resueltos[id]
            ? estado
            : { resueltos: { ...estado.resueltos, [id]: { fecha: new Date().toISOString() } } },
        ),
      marcarTutorialVisto: () => set({ tutorialVisto: true }),
      cerrarAvisoDescartado: () => set({ progresoDescartado: false }),
      reiniciar: () => set({ ...INICIAL, progresoDescartado: false }),
    }),
    {
      name: CLAVE_PROGRESO,
      version: VERSION_PROGRESO,
      storage: createJSONStorage(() => almacenProgreso),
      partialize: ({ resueltos, tutorialVisto }) => ({ resueltos, tutorialVisto }),
      // Un formato de otra versión se descarta sin error (CA13.3).
      migrate: () => {
        descartarAlHidratar = true
        return { ...INICIAL }
      },
      merge: (guardado, actual) => {
        const descartar =
          descartarAlHidratar || (guardado !== undefined && !esProgresoValido(guardado))
        descartarAlHidratar = false
        if (descartar) {
          // Se borra el dato para que el aviso salga una sola vez.
          almacenProgreso.removeItem(CLAVE_PROGRESO)
          return { ...actual, ...INICIAL, progresoDescartado: true }
        }
        return guardado === undefined ? actual : { ...actual, ...(guardado as DatosProgreso) }
      },
    },
  ),
)

export const useCantidadResueltos = () =>
  useProgreso((estado) => Object.keys(estado.resueltos).length)

export const useEstaResuelto = (id: CasoId) =>
  useProgreso((estado) => Boolean(estado.resueltos[id]))
