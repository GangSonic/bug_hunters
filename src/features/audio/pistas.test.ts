import { pistaDePantalla } from './pistas'

describe('pistaDePantalla', () => {
  it('Inicio tiene su ambiente, elegir y presentar el caso comparten el de misterio y la misión la de carrera', () => {
    expect(pistaDePantalla('P1')).toBe('inicio')
    expect(pistaDePantalla('P3')).toBe('misterio')
    expect(pistaDePantalla('P4')).toBe('misterio')
    expect(pistaDePantalla('P5')).toBe('carrera')
  })

  it('resultado, BugDex y pantallas desconocidas van en silencio', () => {
    expect(pistaDePantalla('P6')).toBeNull()
    expect(pistaDePantalla('P7')).toBeNull()
    expect(pistaDePantalla('P99')).toBeNull()
  })
})
