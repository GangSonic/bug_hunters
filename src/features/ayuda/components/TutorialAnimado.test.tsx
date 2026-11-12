import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useConfiguracion } from '@/features/configuracion'
import { DURACION_ESCENA_MS, ESCENAS_ANIMACION } from '../contenido'
import { TutorialAnimado } from './TutorialAnimado'

function montar(animaciones = true) {
  act(() => useConfiguracion.setState({ animaciones }))
  const onCerrar = vi.fn()
  const onIrACasos = vi.fn()
  // Con temporizadores falsos userEvent necesita avanzar el reloj él mismo.
  const usuario = userEvent.setup({ advanceTimers: (ms) => vi.advanceTimersByTime(ms) })
  render(<TutorialAnimado onCerrar={onCerrar} onIrACasos={onIrACasos} />)
  return { usuario, onCerrar, onIrACasos }
}

/** Deja pasar `n` escenas completas, una a una: cada escena programa su propio temporizador al dibujarse. */
function dejarPasar(n: number) {
  for (let i = 0; i < n; i++) act(() => vi.advanceTimersByTime(DURACION_ESCENA_MS))
}

const escenaVisible = () => screen.getByText(/^Escena \d de 6/).textContent

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true })
})
afterEach(() => {
  vi.useRealTimers()
  act(() => useConfiguracion.setState({ animaciones: true }))
})

describe('TutorialAnimado', () => {
  it('empieza en la escena 1 con su subtítulo, que siempre se ve', () => {
    montar()
    expect(escenaVisible()).toBe('Escena 1 de 6: Conoce a Loopi')
    expect(screen.getByText(/Soy Loopi/)).toBeInTheDocument()
  })

  it('el dibujo es decorativo para los lectores de pantalla', () => {
    const { container } = render(<TutorialAnimado onCerrar={vi.fn()} onIrACasos={vi.fn()} />)
    for (const img of container.querySelectorAll('img')) expect(img.getAttribute('alt')).toBe('')
    expect(container.querySelector('[aria-hidden="true"] img')).not.toBeNull()
  })

  it('se reproduce sola: cada escena dura lo mismo y pasa a la siguiente', () => {
    montar()
    act(() => vi.advanceTimersByTime(DURACION_ESCENA_MS - 500))
    expect(escenaVisible()).toContain('Escena 1')
    act(() => vi.advanceTimersByTime(600))
    expect(escenaVisible()).toContain('Escena 2')
  })

  it('al terminar la última escena se detiene y ofrece Repetir', async () => {
    montar()
    dejarPasar(ESCENAS_ANIMACION.length)
    expect(escenaVisible()).toContain('Escena 6')
    expect(screen.getByRole('button', { name: 'Repetir' })).toBeInTheDocument()
    dejarPasar(3)
    expect(escenaVisible()).toContain('Escena 6')
  })

  it('Repetir vuelve a la escena 1 y la reproduce', async () => {
    const { usuario } = montar()
    dejarPasar(ESCENAS_ANIMACION.length)
    await usuario.click(screen.getByRole('button', { name: 'Repetir' }))
    expect(escenaVisible()).toContain('Escena 1')
    expect(screen.getByRole('button', { name: 'Pausar' })).toBeInTheDocument()
  })

  it('Pausar detiene el avance y Reproducir lo reanuda (WCAG 2.2.2)', async () => {
    const { usuario } = montar()
    await usuario.click(screen.getByRole('button', { name: 'Pausar' }))
    dejarPasar(3)
    expect(escenaVisible()).toContain('Escena 1')

    await usuario.click(screen.getByRole('button', { name: 'Reproducir' }))
    dejarPasar(1)
    expect(escenaVisible()).toContain('Escena 2')
  })

  it('Anterior y Siguiente mueven entre escenas y se desactivan en los extremos', async () => {
    const { usuario } = montar()
    const anterior = screen.getByRole('button', { name: 'Anterior' })
    const siguiente = screen.getByRole('button', { name: 'Siguiente' })
    expect(anterior).toBeDisabled()

    await usuario.click(siguiente)
    expect(escenaVisible()).toContain('Escena 2')
    await usuario.click(anterior)
    expect(escenaVisible()).toContain('Escena 1')

    for (let i = 0; i < ESCENAS_ANIMACION.length - 1; i++) await usuario.click(siguiente)
    expect(escenaVisible()).toContain('Escena 6')
    expect(siguiente).toBeDisabled()
  })

  it('cambiar de escena a mano reinicia el tiempo de la escena', async () => {
    const { usuario } = montar()
    act(() => vi.advanceTimersByTime(DURACION_ESCENA_MS - 500))
    await usuario.click(screen.getByRole('button', { name: 'Siguiente' }))
    act(() => vi.advanceTimersByTime(DURACION_ESCENA_MS - 500))
    expect(escenaVisible()).toContain('Escena 2')
    act(() => vi.advanceTimersByTime(600))
    expect(escenaVisible()).toContain('Escena 3')
  })

  it('los puntos llevan a cualquier escena y marcan la actual', async () => {
    const { usuario } = montar()
    await usuario.click(screen.getByRole('button', { name: /Ir a la escena 4: Investiga/ }))
    expect(escenaVisible()).toContain('Escena 4')
    expect(screen.getByRole('button', { name: /Ir a la escena 4/ })).toHaveAttribute(
      'aria-current',
      'step',
    )
    expect(screen.getByRole('button', { name: /Ir a la escena 1/ })).not.toHaveAttribute(
      'aria-current',
    )
  })

  it('con las animaciones apagadas empieza en pausa y no avanza sola', () => {
    montar(false)
    expect(screen.getByRole('button', { name: 'Reproducir' })).toBeInTheDocument()
    dejarPasar(3)
    expect(escenaVisible()).toContain('Escena 1')
  })

  it('con movimiento reducido en el sistema empieza en pausa', () => {
    const original = window.matchMedia
    window.matchMedia = ((consulta: string) => ({
      matches: consulta.includes('prefers-reduced-motion'),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia
    try {
      montar()
      expect(screen.getByRole('button', { name: 'Reproducir' })).toBeInTheDocument()
    } finally {
      window.matchMedia = original
    }
  })

  it('cuenta el caso de Nullito con los textos reales del juego', () => {
    const textos = ESCENAS_ANIMACION.map((e) => e.texto).join(' ')
    expect(textos).toContain('No se revisa si el pedido existe antes de prepararlo')
    expect(textos).toContain('si existe: preparar pedido · si no: avisar y seguir')
    expect(textos).toContain('valor ausente (nulo)')
  })

  it('Volver y Esc cierran; Ir a los casos sigue al juego', async () => {
    const { usuario, onCerrar, onIrACasos } = montar()
    await usuario.click(screen.getByRole('button', { name: 'Volver' }))
    expect(onCerrar).toHaveBeenCalledTimes(1)
    await usuario.keyboard('{Escape}')
    expect(onCerrar).toHaveBeenCalledTimes(2)
    await usuario.click(screen.getByRole('button', { name: 'Ir a los casos' }))
    expect(onIrACasos).toHaveBeenCalledTimes(1)
  })

  it('al cerrarse cancela su temporizador de avance', () => {
    act(() => useConfiguracion.setState({ animaciones: true }))
    const { unmount } = render(<TutorialAnimado onCerrar={vi.fn()} onIrACasos={vi.fn()} />)
    const conTutorial = vi.getTimerCount()
    unmount()
    // React deja otros temporizadores propios; el del tutorial es uno menos.
    expect(vi.getTimerCount()).toBe(conTutorial - 1)
  })
})
