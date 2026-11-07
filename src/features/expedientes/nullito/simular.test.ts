import { evaluar } from '../logic/evaluar'
import { nullito } from './datos'
import { simularNullito } from './simular'

describe('Nullito: El pedido desaparecido', () => {
  it('CA11.1 «preparar sin revisar» falla en el pedido ausente: 2 de 4 (E5c)', () => {
    const r = simularNullito('sinRevisar')
    expect(r.fallo).toBe(true)
    expect(r.contadores.atendidos).toBe(2)
    expect(evaluar(nullito, 'sinRevisar').desenlace).toBe('sinCambio')
  })

  it('CA11.2 «si existe, preparar» no falla pero deja uno sin respuesta: 3 de 4 (E5b)', () => {
    const r = simularNullito('siExiste')
    expect(r.fallo).toBe(false)
    expect(r.contadores).toEqual({ atendidos: 3, sinAtender: 1 })
    expect(evaluar(nullito, 'siExiste').desenlace).toBe('incompleto')
  })

  it('CA11.3 «si no, avisar y seguir» atiende los 4 (E5a)', () => {
    const r = simularNullito('avisar')
    expect(r.contadores).toEqual({ atendidos: 4, sinAtender: 0 })
    expect(r.pasos.some((p) => p.efecto === 'aviso')).toBe(true)
    expect(evaluar(nullito, 'avisar').desenlace).toBe('correcto')
  })

  it('rechaza una opción desconocida', () => {
    expect(() => simularNullito('otra')).toThrow()
  })
})
