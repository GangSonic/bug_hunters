import { evaluar } from '../logic/evaluar'
import { confusin } from './datos'
import { simularConfusin } from './simular'

describe('Confusín: Pedidos equivocados', () => {
  it('CA10.1 destino = "Sur" manda todo al revés: 0 de 4 (E5c)', () => {
    expect(simularConfusin('sur').contadores).toEqual({ bien: 0, mal: 4 })
    expect(evaluar(confusin, 'sur').desenlace).toBe('sinCambio')
  })

  it('CA10.2 «Verdadero» manda todo al Norte: 2 de 4 (E5b)', () => {
    expect(simularConfusin('verdadero').contadores).toEqual({ bien: 2, mal: 2 })
    expect(evaluar(confusin, 'verdadero').desenlace).toBe('incompleto')
  })

  it('CA10.3 destino = "Norte" acierta 4 de 4 (E5a)', () => {
    expect(simularConfusin('norte').contadores).toEqual({ bien: 4, mal: 0 })
    expect(evaluar(confusin, 'norte').desenlace).toBe('correcto')
  })

  it('rechaza una opción desconocida', () => {
    expect(() => simularConfusin('otra')).toThrow()
  })
})
