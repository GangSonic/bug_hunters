import { act, render } from '@testing-library/react'
import { useProgreso } from '../store/progresoStore'
import { AvisoProgresoDescartado } from './AvisoProgresoDescartado'

describe('AvisoProgresoDescartado', () => {
  it('CA13.3 avisa una vez y baja la bandera', () => {
    act(() => useProgreso.setState({ progresoDescartado: true }))
    render(<AvisoProgresoDescartado />)
    expect(useProgreso.getState().progresoDescartado).toBe(false)
  })

  it('no hace nada si no se descartó progreso', () => {
    act(() => useProgreso.setState({ progresoDescartado: false }))
    render(<AvisoProgresoDescartado />)
    expect(useProgreso.getState().progresoDescartado).toBe(false)
  })
})
