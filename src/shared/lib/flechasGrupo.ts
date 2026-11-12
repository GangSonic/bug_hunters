import type { KeyboardEvent } from 'react'

/**
 * Manejador de teclado para un grupo de botones (las opciones de la regla, el tema):
 * las flechas mueven el foco de una opción a otra y Inicio/Fin saltan a los extremos.
 * No activa nada: elegir la opción sigue siendo Intro o Espacio, como en cualquier botón.
 * Se pone en el contenedor: `<div role="group" onKeyDown={flechasEnGrupo}>`.
 */
export function flechasEnGrupo(e: KeyboardEvent<HTMLElement>) {
  const opciones = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('button:enabled'))
  const actual = opciones.findIndex((o) => o === document.activeElement)
  if (actual === -1) return

  let destino: number
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') destino = (actual + 1) % opciones.length
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
    destino = (actual - 1 + opciones.length) % opciones.length
  else if (e.key === 'Home') destino = 0
  else if (e.key === 'End') destino = opciones.length - 1
  else return

  e.preventDefault()
  opciones[destino]?.focus()
}
