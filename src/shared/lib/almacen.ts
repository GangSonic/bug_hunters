import type { StateStorage } from 'zustand/middleware'

/**
 * localStorage que nunca rompe el juego: si el navegador lo bloquea o el dato
 * está dañado, se comporta como si no hubiera nada guardado (RNF06).
 */
export const almacenSeguro: StateStorage = {
  getItem: (clave) => {
    try {
      const valor = localStorage.getItem(clave)
      if (valor === null) return null
      JSON.parse(valor)
      return valor
    } catch {
      return null
    }
  },
  setItem: (clave, valor) => {
    try {
      localStorage.setItem(clave, valor)
    } catch {
      // Sin espacio o bloqueado: el juego sigue, solo no se guarda.
    }
  },
  removeItem: (clave) => {
    try {
      localStorage.removeItem(clave)
    } catch {
      // Ignorado a propósito.
    }
  },
}
