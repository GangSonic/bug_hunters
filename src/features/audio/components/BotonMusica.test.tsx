import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useConfiguracion } from '@/features/configuracion'
import { BotonMusica } from './BotonMusica'

describe('BotonMusica', () => {
  beforeEach(() => useConfiguracion.setState({ musica: true }))

  it('de entrada la música está encendida y el botón lo indica con aria-pressed', () => {
    render(<BotonMusica />)
    const boton = screen.getByRole('button', { name: 'Música' })
    expect(boton).toHaveAttribute('aria-pressed', 'true')
  })

  it('al pulsarlo apaga la música; al volver a pulsarlo la enciende', async () => {
    render(<BotonMusica />)
    await userEvent.click(screen.getByRole('button', { name: 'Música' }))
    expect(useConfiguracion.getState().musica).toBe(false)
    const apagado = screen.getByRole('button', { name: 'Música' })
    expect(apagado).toHaveAttribute('aria-pressed', 'false')

    await userEvent.click(apagado)
    expect(useConfiguracion.getState().musica).toBe(true)
  })
})
