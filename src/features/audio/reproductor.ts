import { ARCHIVO_PISTA, type PistaId } from './pistas'

/** Lo mínimo que se usa de un <audio>; permite probar sin un navegador real. */
export interface ElementoAudio {
  src: string
  loop: boolean
  volume: number
  play: () => Promise<void>
  pause: () => void
}

export interface Reproductor {
  /** Qué debe sonar ahora y si la música está activada. Se llama cada vez que cambia algo. */
  ajustar: (pista: PistaId | null, activa: boolean) => void
  liberar: () => void
}

type Opciones = {
  crearAudio?: () => ElementoAudio
  resolverRuta?: (archivo: string) => string
  volumen?: number
  /** Duración del fundido, en milisegundos. 0 lo hace al instante. */
  fundidoMs?: number
}

const PASO_MS = 40

/** Gestos que el navegador acepta para dejar sonar el audio (Safari en iPhone solo acepta click y touchend). */
const GESTOS = ['pointerdown', 'keydown', 'click', 'touchend'] as const

/**
 * Un solo reproductor para toda la app. Cambia de pista con un fundido corto y se pausa cuando
 * la música se apaga o la pestaña se oculta. Los navegadores no dejan sonar nada antes de que
 * la persona toque la página, así que si `play()` se rechaza se reintenta con el primer clic
 * o tecla; si el archivo no existe, simplemente no suena.
 */
export function crearReproductor({
  crearAudio = () => new Audio(),
  resolverRuta = (archivo) => archivo,
  volumen = 0.3,
  fundidoMs = 400,
}: Opciones = {}): Reproductor {
  const audio = crearAudio()
  audio.loop = true
  audio.volume = 0

  let pistaActual: PistaId | null = null
  let pistaPedida: PistaId | null = null
  let activa = false
  let oculta = false
  let temporizador: ReturnType<typeof setInterval> | undefined
  let esperandoToque = false

  const quePasa = () => (activa && !oculta ? pistaPedida : null)

  const detenerFundido = () => {
    if (temporizador !== undefined) clearInterval(temporizador)
    temporizador = undefined
  }

  /** Lleva el volumen a `meta` poco a poco y avisa al terminar. */
  const fundir = (meta: number, alTerminar?: () => void) => {
    detenerFundido()
    if (fundidoMs === 0 || audio.volume === meta) {
      audio.volume = meta
      alTerminar?.()
      return
    }
    const paso = (volumen * PASO_MS) / fundidoMs
    temporizador = setInterval(() => {
      const siguiente = audio.volume + Math.sign(meta - audio.volume) * paso
      const llego = Math.abs(meta - siguiente) <= paso
      audio.volume = llego ? meta : Math.min(1, Math.max(0, siguiente))
      if (llego) {
        detenerFundido()
        alTerminar?.()
      }
    }, PASO_MS)
  }

  const alToque = () => {
    esperandoToque = false
    for (const gesto of GESTOS) window.removeEventListener(gesto, alToque)
    sincronizar()
  }

  const empezar = (pista: PistaId) => {
    audio.src = resolverRuta(ARCHIVO_PISTA[pista])
    pistaActual = pista
    audio.volume = 0
    // En jsdom play() no existe y devuelve undefined: Promise.resolve lo vuelve un caso más.
    Promise.resolve(audio.play())
      .then(() => {
        // Si mientras cargaba cambió lo que debe sonar, `sincronizar` ya se ocupó.
        if (quePasa() === pista) fundir(volumen)
      })
      .catch((error: unknown) => {
        pistaActual = null
        // NotAllowedError: aún no hubo un toque. Cualquier otro error (archivo ausente): silencio.
        if (error instanceof DOMException && error.name === 'NotAllowedError' && !esperandoToque) {
          esperandoToque = true
          for (const gesto of GESTOS) window.addEventListener(gesto, alToque)
        }
      })
  }

  function sincronizar() {
    const deseada = quePasa()
    if (deseada === pistaActual) {
      // Misma pista: solo hay que reanudarla si se había pausado.
      if (deseada !== null && audio.volume === 0) fundir(volumen)
      return
    }
    if (pistaActual === null) {
      if (deseada !== null) empezar(deseada)
      return
    }
    // Hay otra pista sonando: se baja, y al terminar se pausa o se cambia por la nueva.
    fundir(0, () => {
      audio.pause()
      pistaActual = null
      const ahora = quePasa()
      if (ahora !== null) empezar(ahora)
    })
  }

  const alCambiarVisibilidad = () => {
    oculta = document.visibilityState === 'hidden'
    if (oculta) {
      // Con la pestaña oculta los temporizadores se frenan: un fundido tardaría segundos en
      // silenciarla, así que se pausa de golpe.
      detenerFundido()
      audio.pause()
      audio.volume = 0
      pistaActual = null
      return
    }
    sincronizar()
  }
  document.addEventListener('visibilitychange', alCambiarVisibilidad)

  return {
    ajustar: (pista, estaActiva) => {
      pistaPedida = pista
      activa = estaActiva
      sincronizar()
    },
    liberar: () => {
      detenerFundido()
      audio.pause()
      pistaActual = null
      for (const gesto of GESTOS) window.removeEventListener(gesto, alToque)
      document.removeEventListener('visibilitychange', alCambiarVisibilidad)
    },
  }
}
