import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Inicio } from './Inicio'

function montar() {
  render(<Inicio onJugar={vi.fn()} onConfiguracion={vi.fn()} />)
  return userEvent.setup()
}

describe('Inicio · foco inicial (CA02.1)', () => {
  it('Jugar recibe el foco al cargar', () => {
    montar()
    expect(screen.getByRole('button', { name: 'Jugar' })).toHaveFocus()
  })

  it('Jugar vuelve a recibir el foco al regresar de la confirmación de Salir', async () => {
    const usuario = montar()
    await usuario.click(screen.getByRole('button', { name: 'Salir' }))
    expect(screen.getByRole('heading', { name: '¿Salir del laboratorio?' })).toHaveFocus()

    await usuario.click(screen.getByRole('button', { name: 'Seguir jugando' }))

    expect(screen.getByRole('button', { name: 'Jugar' })).toHaveFocus()
  })
})
