import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { flechasEnGrupo } from './flechasGrupo'

function Grupo({ segundoDeshabilitado = false }: { segundoDeshabilitado?: boolean }) {
  return (
    <div role="group" aria-label="Opciones" onKeyDown={flechasEnGrupo}>
      <button type="button">Uno</button>
      <button type="button" disabled={segundoDeshabilitado}>
        Dos
      </button>
      <button type="button">Tres</button>
    </div>
  )
}

describe('flechasEnGrupo', () => {
  it('derecha y abajo avanzan el foco, y desde la última vuelve a la primera', async () => {
    const usuario = userEvent.setup()
    render(<Grupo />)
    screen.getByRole('button', { name: 'Uno' }).focus()

    await usuario.keyboard('{ArrowRight}')
    expect(screen.getByRole('button', { name: 'Dos' })).toHaveFocus()
    await usuario.keyboard('{ArrowDown}')
    expect(screen.getByRole('button', { name: 'Tres' })).toHaveFocus()
    await usuario.keyboard('{ArrowRight}')
    expect(screen.getByRole('button', { name: 'Uno' })).toHaveFocus()
  })

  it('izquierda y arriba retroceden el foco, y desde la primera van a la última', async () => {
    const usuario = userEvent.setup()
    render(<Grupo />)
    screen.getByRole('button', { name: 'Uno' }).focus()

    await usuario.keyboard('{ArrowLeft}')
    expect(screen.getByRole('button', { name: 'Tres' })).toHaveFocus()
    await usuario.keyboard('{ArrowUp}')
    expect(screen.getByRole('button', { name: 'Dos' })).toHaveFocus()
  })

  it('Inicio y Fin saltan a la primera y a la última opción', async () => {
    const usuario = userEvent.setup()
    render(<Grupo />)
    screen.getByRole('button', { name: 'Dos' }).focus()

    await usuario.keyboard('{End}')
    expect(screen.getByRole('button', { name: 'Tres' })).toHaveFocus()
    await usuario.keyboard('{Home}')
    expect(screen.getByRole('button', { name: 'Uno' })).toHaveFocus()
  })

  it('salta las opciones deshabilitadas', async () => {
    const usuario = userEvent.setup()
    render(<Grupo segundoDeshabilitado />)
    screen.getByRole('button', { name: 'Uno' }).focus()

    await usuario.keyboard('{ArrowRight}')
    expect(screen.getByRole('button', { name: 'Tres' })).toHaveFocus()
  })

  it('mover el foco no activa la opción: eso lo hace Intro o Espacio', async () => {
    const usuario = userEvent.setup()
    let pulsados = 0
    render(
      <div role="group" aria-label="Opciones" onKeyDown={flechasEnGrupo}>
        <button type="button" onClick={() => pulsados++}>
          Uno
        </button>
        <button type="button" onClick={() => pulsados++}>
          Dos
        </button>
      </div>,
    )
    screen.getByRole('button', { name: 'Uno' }).focus()
    await usuario.keyboard('{ArrowRight}')
    expect(pulsados).toBe(0)
    await usuario.keyboard('{Enter}')
    expect(pulsados).toBe(1)
  })

  it('no hace nada con otras teclas ni cuando el foco no está en una opción', async () => {
    const usuario = userEvent.setup()
    render(<Grupo />)
    screen.getByRole('button', { name: 'Uno' }).focus()
    await usuario.keyboard('a')
    expect(screen.getByRole('button', { name: 'Uno' })).toHaveFocus()

    screen.getByRole('button', { name: 'Uno' }).blur()
    await usuario.keyboard('{ArrowRight}')
    expect(document.body).toHaveFocus()
  })
})
