import { act } from '@testing-library/react'
import { CLAVE_PROGRESO, useProgreso } from './store/progresoStore'

describe('progreso', () => {
  beforeEach(() => {
    act(() => useProgreso.getState().reiniciar())
  })

  it('CA13.1 guarda el caso resuelto con su fecha en el navegador', () => {
    act(() => useProgreso.getState().marcarResuelto('loopi'))
    expect(useProgreso.getState().resueltos.loopi?.fecha).toBeTypeOf('string')
    const guardado = JSON.parse(localStorage.getItem(CLAVE_PROGRESO) ?? '{}')
    expect(guardado.state.resueltos.loopi).toBeDefined()
  })

  it('no duplica un caso ya resuelto', () => {
    act(() => useProgreso.getState().marcarResuelto('loopi'))
    const primera = useProgreso.getState().resueltos.loopi?.fecha
    act(() => useProgreso.getState().marcarResuelto('loopi'))
    expect(useProgreso.getState().resueltos.loopi?.fecha).toBe(primera)
  })

  it('CA13.3 con datos dañados arranca sin progreso y sin errores', async () => {
    localStorage.setItem(CLAVE_PROGRESO, '{esto no es json')
    await act(() => useProgreso.persist.rehydrate())
    expect(useProgreso.getState().resueltos).toEqual({})
  })

  it('CA13.3 con datos de otra versión del formato arranca sin progreso', async () => {
    localStorage.setItem(
      CLAVE_PROGRESO,
      JSON.stringify({ state: { resueltos: { loopi: { fecha: 'x' } } }, version: 99 }),
    )
    await act(() => useProgreso.persist.rehydrate())
    expect(useProgreso.getState().resueltos).toEqual({})
  })

  it('CA13.4 reiniciar borra los casos resueltos', () => {
    act(() => useProgreso.getState().marcarResuelto('cambion'))
    act(() => useProgreso.getState().reiniciar())
    expect(useProgreso.getState().resueltos).toEqual({})
  })
})
