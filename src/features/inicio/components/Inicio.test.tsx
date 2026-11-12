import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Inicio } from './Inicio'

function montar() {
  const onTutorial = vi.fn()
  render(<Inicio onJugar={vi.fn()} onTutorial={onTutorial} onConfiguracion={vi.fn()} />)
  return { usuario: userEvent.setup(), onTutorial }
}

describe('Inicio · foco inicial (CA02.1)', () => {
  it('Jugar recibe el foco al cargar', () => {
    montar()
    expect(screen.getByRole('button', { name: 'Jugar' })).toHaveFocus()
  })

  it('Jugar vuelve a recibir el foco al regresar de la confirmación de Salir', async () => {
    const { usuario } = montar()
    await usuario.click(screen.getByRole('button', { name: 'Salir' }))
    expect(screen.getByRole('heading', { name: '¿Salir del laboratorio?' })).toHaveFocus()

    await usuario.click(screen.getByRole('button', { name: 'Seguir jugando' }))

    expect(screen.getByRole('button', { name: 'Jugar' })).toHaveFocus()
  })
})

describe('Inicio · Tutorial', () => {
  it('el botón Tutorial abre el tutorial animado, sin quitar el foco inicial a Jugar', async () => {
    const { usuario, onTutorial } = montar()
    expect(screen.getByRole('button', { name: 'Jugar' })).toHaveFocus()
    await usuario.click(screen.getByRole('button', { name: 'Tutorial' }))
    expect(onTutorial).toHaveBeenCalledTimes(1)
  })
})
