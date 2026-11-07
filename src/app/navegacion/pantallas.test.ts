import { act } from '@testing-library/react'
import { ENLACES, enlacePermitido } from './pantallas'
import { useNavegacion } from './navegacionStore'

/**
 * Tabla 14 del Capítulo IV ajustada por D-01 (P2 y P3 en una sola pantalla), copiada a mano:
 * si alguien cambia ENLACES, esta prueba avisa.
 */
const TABLA_14 = [
  ['P1', 'P3'],
  ['P3', 'P4'],
  ['P3', 'P7'],
  ['P3', 'P1'],
  ['P4', 'P5'],
  ['P4', 'P3'],
  ['P5', 'P6'],
  ['P5', 'P3'],
  ['P6', 'P7'],
  ['P6', 'P3'],
  ['P6', 'P1'],
  ['P7', 'P3'],
  ['P7', 'P1'],
] as const

describe('navegación (HU01)', () => {
  it('ENLACES coincide exactamente con la tabla de enlaces', () => {
    const enCodigo = Object.entries(ENLACES).flatMap(([o, ds]) => ds.map((d) => `${o}>${d}`))
    expect(enCodigo.sort()).toEqual(TABLA_14.map(([o, d]) => `${o}>${d}`).sort())
  })

  it('CA01.1 rechaza un enlace que no está en la tabla', () => {
    const aviso = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(enlacePermitido('P1', 'P5')).toBe(false)
    act(() => {
      useNavegacion.setState({ pantalla: 'P1' })
    })
    let resultado = true
    act(() => {
      resultado = useNavegacion.getState().irA('P5')
    })
    expect(resultado).toBe(false)
    expect(useNavegacion.getState().pantalla).toBe('P1')
    aviso.mockRestore()
  })

  it('navega y guarda el contexto del caso elegido', () => {
    act(() => {
      useNavegacion.setState({ pantalla: 'P3' })
      useNavegacion.getState().irA('P4', { casoId: 'nullito' })
    })
    expect(useNavegacion.getState()).toMatchObject({ pantalla: 'P4', casoId: 'nullito' })
  })

  it('CA01.2 una capa se abre sin cambiar la pantalla de fondo', () => {
    act(() => {
      useNavegacion.setState({ pantalla: 'P1', capa: null })
      useNavegacion.getState().abrirCapa('O3')
    })
    expect(useNavegacion.getState()).toMatchObject({ pantalla: 'P1', capa: 'O3' })
    act(() => useNavegacion.getState().cerrarCapa())
    expect(useNavegacion.getState().capa).toBeNull()
  })
})
