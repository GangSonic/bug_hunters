import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Capa } from './Capa'

/** Un control de fondo antes de la capa, para comprobar que el foco no se escapa hacia él. */
function Escena({ onCerrar = () => {} }: { onCerrar?: () => void }) {
  return (
    <>
      <button type="button">Fondo</button>
      <Capa titulo="Misión en pausa" onCerrar={onCerrar}>
        <button type="button">Uno</button>
        <button type="button">Dos</button>
      </Capa>
    </>
  )
}

/** Como en la app: un botón abre la capa y al cerrarla el foco debe volver a él. */
function ConApertura() {
  const [abierta, setAbierta] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setAbierta(true)}>
        Abrir
      </button>
      {abierta && (
        <Capa titulo="Misión en pausa" onCerrar={() => setAbierta(false)}>
          <button type="button">Uno</button>
        </Capa>
      )}
    </>
  )
}

describe('Capa · foco', () => {
  it('al abrirse, el foco entra en el diálogo', () => {
    render(<Escena />)
    expect(screen.getByRole('dialog', { name: 'Misión en pausa' })).toHaveFocus()
  })

  it('Tab desde el último control vuelve al primero, sin salir de la capa', async () => {
    const usuario = userEvent.setup()
    render(<Escena />)
    screen.getByRole('button', { name: 'Dos' }).focus()

    await usuario.tab()

    expect(screen.getByRole('button', { name: 'Cerrar' })).toHaveFocus()
  })

  it('Mayús+Tab desde el primer control va al último, sin salir de la capa', async () => {
    const usuario = userEvent.setup()
    render(<Escena />)
    screen.getByRole('button', { name: 'Cerrar' }).focus()

    await usuario.tab({ shift: true })

    expect(screen.getByRole('button', { name: 'Dos' })).toHaveFocus()
  })

  it('Mayús+Tab desde el propio diálogo también va al último control', async () => {
    const usuario = userEvent.setup()
    render(<Escena />)

    await usuario.tab({ shift: true })

    expect(screen.getByRole('button', { name: 'Dos' })).toHaveFocus()
  })

  it('si algo intenta enfocar un control del fondo, el foco vuelve a la capa', () => {
    render(<Escena />)

    screen.getByRole('button', { name: 'Fondo' }).focus()

    expect(
      screen.getByRole('dialog', { name: 'Misión en pausa' }).contains(document.activeElement),
    ).toBe(true)
  })

  it('al cerrarse, el foco vuelve al control que la abrió', async () => {
    const usuario = userEvent.setup()
    render(<ConApertura />)
    await usuario.click(screen.getByRole('button', { name: 'Abrir' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await usuario.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.getByRole('button', { name: 'Abrir' })).toHaveFocus()
  })
})

describe('Capa · cierre', () => {
  it('Esc y Cerrar llaman a onCerrar', async () => {
    const usuario = userEvent.setup()
    const onCerrar = vi.fn()
    render(<Escena onCerrar={onCerrar} />)

    await usuario.keyboard('{Escape}')
    await usuario.click(screen.getByRole('button', { name: 'Cerrar' }))

    expect(onCerrar).toHaveBeenCalledTimes(2)
  })

  it('hacer clic fuera cierra y hacer clic dentro no', async () => {
    const usuario = userEvent.setup()
    const onCerrar = vi.fn()
    render(<Escena onCerrar={onCerrar} />)

    await usuario.click(screen.getByRole('button', { name: 'Uno' }))
    expect(onCerrar).not.toHaveBeenCalled()

    const fondo = screen.getByRole('dialog').parentElement as HTMLElement
    await usuario.pointer({ keys: '[MouseLeft]', target: fondo })
    expect(onCerrar).toHaveBeenCalledOnce()
  })
})
