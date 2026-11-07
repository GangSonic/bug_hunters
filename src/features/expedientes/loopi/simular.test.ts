import { evaluar } from '../logic/evaluar'
import { loopi } from './datos'
import { LIMITE_VUELTAS, simularLoopi } from './simular'

describe('Loopi: El reparto interminable', () => {
  it('CA09.1 «Verdadero» repite sin fin y se corta a las 12 vueltas (E5c)', () => {
    const r = simularLoopi('verdadero')
    expect(r.terminado).toBe(false)
    expect(r.vueltas).toBe(LIMITE_VUELTAS)
    expect(r.pasos.filter((p) => p.efecto === 'vacio')).toHaveLength(LIMITE_VUELTAS - 4)
    expect(evaluar(loopi, 'verdadero').desenlace).toBe('sinCambio')
  })

  it('CA09.2 «Entregados < 2» se detiene con 2 de 4 (E5b)', () => {
    const r = simularLoopi('menos2')
    expect(r.contadores).toEqual({ entregados: 2, pendientes: 2 })
    expect(r.terminado).toBe(true)
    expect(evaluar(loopi, 'menos2').desenlace).toBe('incompleto')
  })

  it('CA09.3 «Hay paquetes pendientes» entrega 4 de 4 y termina (E5a)', () => {
    const r = simularLoopi('pendientes')
    expect(r.contadores).toEqual({ entregados: 4, pendientes: 0 })
    expect(r.terminado).toBe(true)
    expect(evaluar(loopi, 'pendientes').desenlace).toBe('correcto')
  })

  it('rechaza una opción desconocida', () => {
    expect(() => simularLoopi('otra')).toThrow()
  })
})
