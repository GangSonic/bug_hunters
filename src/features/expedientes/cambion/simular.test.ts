import { evaluar } from '../logic/evaluar'
import { cambion } from './datos'
import { simularCambion } from './simular'

describe('Cambión: El inventario que pierde la cuenta', () => {
  it('CA12.1 total ← 1 deja el total en 1 (E5c)', () => {
    expect(simularCambion('asignar1').contadores.total).toBe(1)
    expect(evaluar(cambion, 'asignar1').desenlace).toBe('sinCambio')
  })

  it('CA12.2 total ← total + 2 duplica la cuenta: 8 (E5b)', () => {
    expect(simularCambion('mas2').contadores.total).toBe(8)
    expect(evaluar(cambion, 'mas2').desenlace).toBe('incompleto')
  })

  it('CA12.3 total ← total + 1 llega a 4 (E5a)', () => {
    const r = simularCambion('mas1')
    expect(r.contadores.total).toBe(4)
    expect(r.pasos.map((p) => p.contadores.total)).toEqual([1, 2, 3, 4])
    expect(evaluar(cambion, 'mas1').desenlace).toBe('correcto')
  })

  it('rechaza una opción desconocida', () => {
    expect(() => simularCambion('otra')).toThrow()
  })
})
