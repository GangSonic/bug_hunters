import { render, screen } from '@testing-library/react'
import { EscenaCambion } from '../cambion/Escena'
import { EscenaLoopi } from '../loopi/Escena'

const props = { pasos: [], reproduciendo: false, desenlace: null }

describe('EscenaBanda: contador de la criatura', () => {
  it('Loopi muestra el contador sobre la pantalla dibujada en su sprite', () => {
    render(<EscenaLoopi {...props} />)
    const contador = screen.getByText('0/4')
    expect(contador.style.left).toBe('83.2%')
    expect(contador.style.top).toBe('60.3%')
  })

  it('Cambión muestra el contador sobre la pantalla dibujada en su sprite', () => {
    render(<EscenaCambion {...props} />)
    const contador = screen.getByText('0')
    expect(contador.style.left).toBe('49.3%')
    expect(contador.style.top).toBe('66%')
  })
})
