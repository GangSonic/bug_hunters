import { act } from '@testing-library/react'
import { useConfiguracion } from './configuracionStore'

const CLAVE = 'bug-hunters:configuracion'

describe('configuración: música', () => {
  beforeEach(() => {
    // Estado de una primera visita: valores de fábrica y nada guardado.
    useConfiguracion.setState({ tema: 'auto', animaciones: true, musica: true })
    localStorage.clear()
  })

  it('una persona nueva la tiene encendida', async () => {
    await act(() => useConfiguracion.persist.rehydrate())
    expect(useConfiguracion.getState().musica).toBe(true)
  })

  it('la elección de apagarla se conserva al volver a abrir el juego', async () => {
    act(() => useConfiguracion.getState().cambiarMusica(false))
    const guardado = localStorage.getItem(CLAVE) ?? '{}'
    expect(JSON.parse(guardado).state.musica).toBe(false)

    // Se vuelve a abrir el juego: el estado en memoria parte de cero y lee lo guardado.
    useConfiguracion.setState({ musica: true })
    localStorage.setItem(CLAVE, guardado)
    await act(() => useConfiguracion.persist.rehydrate())
    expect(useConfiguracion.getState().musica).toBe(false)
  })

  it('los ajustes guardados antes de que existiera la música no la apagan', async () => {
    localStorage.setItem(
      CLAVE,
      JSON.stringify({ state: { tema: 'oscuro', animaciones: false }, version: 1 }),
    )
    await act(() => useConfiguracion.persist.rehydrate())
    expect(useConfiguracion.getState()).toMatchObject({
      tema: 'oscuro',
      animaciones: false,
      musica: true,
    })
  })
})
