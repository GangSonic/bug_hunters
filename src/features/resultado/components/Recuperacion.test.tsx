import { fireEvent, render, screen } from '@testing-library/react'
import { obtenerExpediente } from '@/features/expedientes'
import { Recuperacion } from './Recuperacion'

describe('Recuperacion', () => {
  it('CA08.1 muestra el estado final con texto y el botón Continuar', () => {
    const continuar = vi.fn()
    render(<Recuperacion caso={obtenerExpediente('cambion')} continuar={continuar} />)
    expect(screen.getByRole('status').textContent).toContain('Cambión se recuperó')
    fireEvent.click(screen.getByRole('button', { name: 'Continuar ›' }))
    expect(continuar).toHaveBeenCalledTimes(1)
  })
})