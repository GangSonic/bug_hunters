import { crearReproductor, type ElementoAudio } from './reproductor'

function audioFalso(impl: () => Promise<void> = () => Promise.resolve()) {
  return {
    src: '',
    loop: false,
    volume: 1,
    play: vi.fn<() => Promise<void>>(impl),
    pause: vi.fn<() => void>(),
  } satisfies ElementoAudio
}

const soltar = () => new Promise((r) => setTimeout(r, 0))

function visibilidad(estado: 'hidden' | 'visible') {
  vi.spyOn(document, 'visibilityState', 'get').mockReturnValue(estado)
  document.dispatchEvent(new Event('visibilitychange'))
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('crearReproductor', () => {
  const nuevo = (audio: ElementoAudio, fundidoMs = 0) =>
    crearReproductor({ crearAudio: () => audio, volumen: 0.3, fundidoMs })

  it('con la música activa suena la pista pedida, en bucle y a volumen bajo', async () => {
    const audio = audioFalso()
    const r = nuevo(audio)
    r.ajustar('inicio', true)
    await soltar()
    expect(audio.src).toBe('audio/inicio.mp3')
    expect(audio.loop).toBe(true)
    expect(audio.volume).toBe(0.3)
    expect(audio.play).toHaveBeenCalledTimes(1)
    r.liberar()
  })

  it('con la música apagada no suena nada', async () => {
    const audio = audioFalso()
    const r = nuevo(audio)
    r.ajustar('inicio', false)
    await soltar()
    expect(audio.play).not.toHaveBeenCalled()
    r.liberar()
  })

  it('al apagarla se pausa, y al encenderla vuelve a sonar', async () => {
    const audio = audioFalso()
    const r = nuevo(audio)
    r.ajustar('carrera', true)
    await soltar()
    r.ajustar('carrera', false)
    expect(audio.pause).toHaveBeenCalledTimes(1)
    r.ajustar('carrera', true)
    await soltar()
    expect(audio.play).toHaveBeenCalledTimes(2)
    r.liberar()
  })

  it('al cambiar de pantalla cambia de pista, pero no reinicia la misma', async () => {
    const audio = audioFalso()
    const r = nuevo(audio)
    r.ajustar('misterio', true)
    await soltar()
    r.ajustar('misterio', true)
    await soltar()
    expect(audio.play).toHaveBeenCalledTimes(1)

    r.ajustar('carrera', true)
    await soltar()
    expect(audio.src).toBe('audio/carrera.mp3')
    expect(audio.play).toHaveBeenCalledTimes(2)
    r.liberar()
  })

  it('una pantalla sin pista deja de sonar', async () => {
    const audio = audioFalso()
    const r = nuevo(audio)
    r.ajustar('inicio', true)
    await soltar()
    r.ajustar(null, true)
    expect(audio.pause).toHaveBeenCalled()
    r.liberar()
  })

  it('si el navegador bloquea el sonido, reintenta con el primer toque', async () => {
    const bloqueo = new DOMException('bloqueado', 'NotAllowedError')
    const play = vi
      .fn<() => Promise<void>>()
      .mockRejectedValueOnce(bloqueo)
      .mockResolvedValue(undefined)
    const audio = audioFalso(play)
    const r = nuevo(audio)
    r.ajustar('inicio', true)
    await soltar()
    expect(audio.play).toHaveBeenCalledTimes(1)

    window.dispatchEvent(new Event('pointerdown'))
    await soltar()
    expect(audio.play).toHaveBeenCalledTimes(2)
    expect(audio.volume).toBe(0.3)

    // El aviso de toque es de una sola vez.
    window.dispatchEvent(new Event('pointerdown'))
    await soltar()
    expect(audio.play).toHaveBeenCalledTimes(2)
    r.liberar()
  })

  it('también acepta un clic o un toque en pantalla táctil para desbloquear el sonido', async () => {
    for (const gesto of ['click', 'touchend']) {
      const play = vi
        .fn<() => Promise<void>>()
        .mockRejectedValueOnce(new DOMException('bloqueado', 'NotAllowedError'))
        .mockResolvedValue(undefined)
      const audio = audioFalso(play)
      const r = nuevo(audio)
      r.ajustar('inicio', true)
      await soltar()
      window.dispatchEvent(new Event(gesto))
      await soltar()
      expect(audio.play, gesto).toHaveBeenCalledTimes(2)
      r.liberar()
    }
  })

  it('el reintento usa la pista de la pantalla donde está la persona al tocar', async () => {
    const play = vi
      .fn<() => Promise<void>>()
      .mockRejectedValueOnce(new DOMException('bloqueado', 'NotAllowedError'))
      .mockResolvedValue(undefined)
    const audio = audioFalso(play)
    const r = nuevo(audio)
    r.ajustar('inicio', true)
    await soltar()
    r.ajustar('misterio', true)
    window.dispatchEvent(new Event('keydown'))
    await soltar()
    expect(audio.src).toBe('audio/misterio.mp3')
    r.liberar()
  })

  it('si el archivo no existe no suena y no se queda reintentando', async () => {
    const audio = audioFalso(() => Promise.reject(new Error('archivo no encontrado')))
    const r = nuevo(audio)
    r.ajustar('inicio', true)
    await soltar()
    window.dispatchEvent(new Event('pointerdown'))
    await soltar()
    expect(audio.play).toHaveBeenCalledTimes(1)
    r.liberar()
  })

  it('con la pestaña oculta se pausa de golpe y al volver sigue sonando', async () => {
    const audio = audioFalso()
    const r = nuevo(audio, 400)
    vi.useFakeTimers()
    r.ajustar('inicio', true)
    await vi.advanceTimersByTimeAsync(500)

    visibilidad('hidden')
    expect(audio.pause).toHaveBeenCalledTimes(1)
    expect(audio.volume).toBe(0)

    visibilidad('visible')
    await vi.advanceTimersByTimeAsync(500)
    expect(audio.play).toHaveBeenCalledTimes(2)
    expect(audio.volume).toBeCloseTo(0.3)
    r.liberar()
  })

  it('sube y baja el volumen poco a poco en lugar de cortar', async () => {
    const audio = audioFalso()
    const r = nuevo(audio, 400)
    vi.useFakeTimers()
    r.ajustar('inicio', true)
    await vi.advanceTimersByTimeAsync(0)
    await vi.advanceTimersByTimeAsync(200)
    expect(audio.volume).toBeGreaterThan(0)
    expect(audio.volume).toBeLessThan(0.3)
    await vi.advanceTimersByTimeAsync(300)
    expect(audio.volume).toBeCloseTo(0.3)

    r.ajustar('inicio', false)
    await vi.advanceTimersByTimeAsync(200)
    expect(audio.pause).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(300)
    expect(audio.pause).toHaveBeenCalledTimes(1)
    r.liberar()
  })
})
