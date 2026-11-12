import { act } from '@testing-library/react'
import { CLAVE_PROGRESO, useProgreso } from './store/progresoStore'

describe('progreso', () => {
  beforeEach(() => {
    act(() => useProgreso.getState().reiniciar())
    localStorage.clear()
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

  it('CA13.3 sin nada guardado arranca limpio y sin aviso', async () => {
    await act(() => useProgreso.persist.rehydrate())
    expect(useProgreso.getState().resueltos).toEqual({})
    expect(useProgreso.getState().progresoDescartado).toBe(false)
  })

  it('CA13.3 con datos dañados arranca sin progreso, avisa y borra el dato', async () => {
    localStorage.setItem(CLAVE_PROGRESO, '{esto no es json')
    await act(() => useProgreso.persist.rehydrate())
    expect(useProgreso.getState().resueltos).toEqual({})
    expect(useProgreso.getState().progresoDescartado).toBe(true)
    expect(localStorage.getItem(CLAVE_PROGRESO)).toBeNull()
  })

  it('CA13.3 con datos de otra versión del formato arranca sin progreso y avisa', async () => {
    localStorage.setItem(
      CLAVE_PROGRESO,
      JSON.stringify({ state: { resueltos: { loopi: { fecha: 'x' } } }, version: 99 }),
    )
    await act(() => useProgreso.persist.rehydrate())
    expect(useProgreso.getState().resueltos).toEqual({})
    expect(useProgreso.getState().progresoDescartado).toBe(true)
  })

  it('CA13.3 con la versión correcta pero otra forma de datos, descarta y avisa', async () => {
    localStorage.setItem(
      CLAVE_PROGRESO,
      JSON.stringify({ state: { resueltos: 5, tutorialVisto: 'si' }, version: 1 }),
    )
    await act(() => useProgreso.persist.rehydrate())
    expect(useProgreso.getState().resueltos).toEqual({})
    expect(useProgreso.getState().progresoDescartado).toBe(true)
  })

  it('CA13.3 el aviso sale una sola vez', async () => {
    localStorage.setItem(CLAVE_PROGRESO, '{esto no es json')
    await act(() => useProgreso.persist.rehydrate())
    expect(useProgreso.getState().progresoDescartado).toBe(true)

    act(() => useProgreso.getState().cerrarAvisoDescartado())
    await act(() => useProgreso.persist.rehydrate())
    expect(useProgreso.getState().progresoDescartado).toBe(false)
  })

  it('CA13.3 un caso desconocido en resueltos descarta el progreso y avisa', async () => {
    localStorage.setItem(
      CLAVE_PROGRESO,
      JSON.stringify({
        state: {
          resueltos: { inventado: { fecha: '2026-11-09T00:00:00.000Z' } },
          tutorialVisto: false,
        },
        version: 1,
      }),
    )
    await act(() => useProgreso.persist.rehydrate())
    expect(useProgreso.getState().resueltos).toEqual({})
    expect(useProgreso.getState().progresoDescartado).toBe(true)
  })

  it('CA13.3 un caso sin fecha válida descarta el progreso y avisa', async () => {
    localStorage.setItem(
      CLAVE_PROGRESO,
      JSON.stringify({
        state: { resueltos: { loopi: { fecha: 5 } }, tutorialVisto: false },
        version: 1,
      }),
    )
    await act(() => useProgreso.persist.rehydrate())
    expect(useProgreso.getState().resueltos).toEqual({})
    expect(useProgreso.getState().progresoDescartado).toBe(true)
  })

  it('un progreso válido se carga igual que antes, sin aviso', async () => {
    localStorage.setItem(
      CLAVE_PROGRESO,
      JSON.stringify({
        state: { resueltos: { loopi: { fecha: '2026-11-09T00:00:00.000Z' } }, tutorialVisto: true },
        version: 1,
      }),
    )
    await act(() => useProgreso.persist.rehydrate())
    expect(useProgreso.getState().resueltos.loopi).toBeDefined()
    expect(useProgreso.getState().progresoDescartado).toBe(false)
  })

  it('CA13.4 reiniciar borra los casos resueltos', () => {
    act(() => useProgreso.getState().marcarResuelto('cambion'))
    act(() => useProgreso.getState().reiniciar())
    expect(useProgreso.getState().resueltos).toEqual({})
  })
})
