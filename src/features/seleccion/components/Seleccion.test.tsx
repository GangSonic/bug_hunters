import { act, render, screen } from '@testing-library/react'
import { useProgreso } from '@/features/progreso'
import { Seleccion } from './Seleccion'

const props = { onInvestigar: () => {}, onBugDex: () => {}, onInicio: () => {} }

describe('Seleccion', () => {
  beforeEach(() => {
    act(() => useProgreso.getState().reiniciar())
  })

  it('CA03.2 sin progreso, los 4 casos dicen Disponible con texto', () => {
    render(<Seleccion {...props} />)
    expect(screen.getAllByText('Disponible')).toHaveLength(4)
    expect(screen.queryByText('Completado')).toBeNull()
  })

  it('CA03.2 un caso resuelto dice Completado con texto', () => {
    act(() => useProgreso.getState().marcarResuelto('cambion'))
    render(<Seleccion {...props} />)
    expect(screen.getAllByText('Completado')).toHaveLength(1)
    expect(screen.getAllByText('Disponible')).toHaveLength(3)
    expect(screen.getByText('1 de 4 casos resueltos')).toBeDefined()
  })
})