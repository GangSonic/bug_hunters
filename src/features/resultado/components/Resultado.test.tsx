import { act, render, screen } from '@testing-library/react'
import { useProgreso } from '@/features/progreso'
import { Resultado } from './Resultado'

const props = { onVerFicha: () => {}, onOtraMision: () => {}, onInicio: () => {} }

describe('Resultado', () => {
  beforeEach(() => {
    act(() => useProgreso.getState().reiniciar())
  })

  it('CA08.3 dice cuántos casos lleva guardados', () => {
    act(() => useProgreso.getState().marcarResuelto('loopi'))
    render(<Resultado casoId="loopi" {...props} />)
    expect(screen.getByText('Progreso guardado: 1 de 4')).toBeDefined()
  })
})