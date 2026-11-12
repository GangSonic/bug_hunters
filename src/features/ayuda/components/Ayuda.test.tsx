import { fireEvent, render, screen } from '@testing-library/react'
import { Ayuda } from './Ayuda'

describe('Ayuda', () => {
  it('CA16.1 explica controles, ciclo de misión y BugDex', () => {
    render(<Ayuda onCerrar={() => {}} />)
    expect(screen.getByRole('dialog')).toBeDefined()
    expect(screen.getByRole('heading', { name: 'Controles' })).toBeDefined()
    expect(screen.getByRole('heading', { name: 'Cómo es una misión' })).toBeDefined()
    expect(screen.getByRole('heading', { name: 'La BugDex' })).toBeDefined()
  })

  it('CA16.2 Esc y Volver a la misión cierran la ayuda', () => {
    const onCerrar = vi.fn()
    render(<Ayuda onCerrar={onCerrar} />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onCerrar).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('button', { name: 'Volver a la misión' }))
    expect(onCerrar).toHaveBeenCalledTimes(2)
  })

  it('CA16.3 Ver tutorial repite los 4 pasos y regresa a la ayuda', () => {
    render(<Ayuda onCerrar={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'Ver tutorial' }))
    expect(screen.getByText(/Paso 1 de 4/)).toBeDefined()
    for (let i = 0; i < 3; i++) {
      fireEvent.click(screen.getByRole('button', { name: 'Siguiente paso' }))
    }
    expect(screen.getByText(/Paso 4 de 4/)).toBeDefined()
    fireEvent.click(screen.getByRole('button', { name: 'Listo' }))
    expect(screen.getByRole('heading', { name: 'Controles' })).toBeDefined()
  })
})
