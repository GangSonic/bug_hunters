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
