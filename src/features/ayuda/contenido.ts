/** Los 4 pasos del tutorial (HU16, CA04.3). Los comparten la capa Ayuda y el tutorial de la misión. */
export const PASOS_TUTORIAL = [
  {
    titulo: 'Observa a la criatura',
    texto: 'Mira qué hace y compáralo con lo que pide la misión.',
  },
  {
    titulo: 'Elige una causa',
    texto: 'Investiga y escoge por qué crees que falla.',
  },
  {
    titulo: 'Elige una corrección',
    texto: 'Selecciona cómo arreglar el problema.',
  },
  {
    titulo: 'Prueba y aprende',
    texto: 'Pulsa Probar. Si no sale, pide una pista y vuelve a intentarlo.',
  },
] as const

/** Qué paso del tutorial corresponde a cada estado de la misión antes de probar. */
export const PASO_DE_ESTADO: Record<string, number> = { E1: 1, E2: 2, E3: 3, E4: 4 }

/** Parte de la pantalla que se resalta en cada paso (coincide con `data-zona` de la misión). */
export type ZonaTutorial = 'escena' | 'causa' | 'correccion' | 'probar'

export const ZONA_DE_ESTADO: Record<string, ZonaTutorial> = {
  E1: 'escena',
  E2: 'causa',
  E3: 'correccion',
  E4: 'probar',
}

/** Las 6 escenas de la animación del Inicio: Loopi se presenta y resuelve el caso de Nullito. */
export const ESCENAS_ANIMACION = [
  {
    id: 'presentacion',
    titulo: 'Conoce a Loopi',
    texto: '¡Hola, Bug Hunter! Soy Loopi. Cada error es un misterio y vamos a resolverlos juntos.',
  },
  {
    id: 'caso',
    titulo: 'El caso',
    texto:
      'Este es Nullito. Debe atender los 4 pedidos de la cafetería sin que la cocina se detenga.',
  },
  {
    id: 'observa',
    titulo: 'Observa',
    texto:
      'Observa: al llegar al pedido 3, que no existe, Nullito se atasca y la cocina se detiene. Solo se atienden 2 de 4.',
  },
  {
    id: 'investiga',
    titulo: 'Investiga',
    texto: 'Investiga y elige la causa: «No se revisa si el pedido existe antes de prepararlo».',
  },
  {
    id: 'corrige',
    titulo: 'Corrige y prueba',
    texto:
      'Elige la corrección «si existe: preparar pedido · si no: avisar y seguir» y pulsa Probar.',
  },
  {
    id: 'aprende',
    titulo: 'Aprende',
    texto:
      '¡Funciona! Los 4 pedidos quedan atendidos. Aprendiste qué es un valor ausente (nulo) y guardas la ficha en tu BugDex.',
  },
] as const

export type EscenaId = (typeof ESCENAS_ANIMACION)[number]['id']

/** Lo que dura cada escena cuando la animación se reproduce sola. */
export const DURACION_ESCENA_MS = 7000
