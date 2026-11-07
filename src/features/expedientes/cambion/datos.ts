import type { Expediente } from '../contrato'
import { EscenaCambion } from './Escena'
import { cambionEsCorrecto, simularCambion, TOTAL_CAJAS } from './simular'

export const cambion: Expediente = {
  id: 'cambion',
  numero: '04',
  mundo: 'datos',
  criatura: 'Cambión',
  sprite: 'sprites/cambion.png',
  titulo: 'El inventario que pierde la cuenta',
  problema: 'Pierde la cuenta.',
  objetivo: 'Cuenta las 4 cajas sin que el total se borre.',
  saludo: '¡Hola, Bug Hunter! El inventario no cuadra.',
  intro:
    'Cambión cuenta las cajas que llegan al almacén, pero el total siempre sale mal. El problema está en qué hace con el contador en cada vuelta.',
  regla: ['total ← 0', 'para cada caja que llega:', '    ___', 'mostrar total'],
  total: TOTAL_CAJAS,
  contadores: [
    { id: 'cajas', etiqueta: 'Cajas recibidas', deTotal: true },
    { id: 'total', etiqueta: 'Total contado' },
  ],
  preguntaHipotesis: '¿Por qué el total sale mal?',
  hipotesis: [
    { id: 'reinicia', texto: 'El contador se reinicia en cada vuelta', esCausa: true },
    { id: 'grandes', texto: 'Las cajas son muy grandes', esCausa: false },
    { id: 'falta', texto: 'Falta una caja', esCausa: false },
  ],
  preguntaReparacion: '¿Qué debe pasar con el total en cada caja?',
  indicacionReparacion: 'Elige cómo actualizar el total.',
  opciones: [
    { id: 'asignar1', texto: 'total ← 1' },
    { id: 'mas2', texto: 'total ← total + 2' },
    { id: 'mas1', texto: 'total ← total + 1' },
  ],
  opcionAnomalia: 'asignar1',
  pistas: [
    'Mira el contador de Cambión después de cada caja.',
    'Asignar un número fijo borra lo que ya llevabas contado.',
    'En cada vuelta el total debe crecer a partir de su valor anterior, una caja a la vez.',
  ],
  mensajes: {
    asignar1: {
      titulo: 'El total sigue en 1',
      cuerpo: 'En cada caja el total vuelve a valer 1: se borra lo que ya estaba contado.',
    },
    mas2: {
      titulo: 'El total sube, pero se duplica: 8',
      cuerpo:
        'Ahora el total acumula, pero suma 2 por cada caja. Llegaron 4 cajas y el inventario dice 8.',
    },
    mas1: {
      titulo: '¡Cuenta correcta! 4',
      cuerpo: 'En cada caja se sumó 1 al total anterior, así que el contador creció hasta 4.',
    },
  },
  concepto: 'Variables, asignación y acumulación',
  terminoIngles: 'accumulator',
  ficha: {
    senal: 'El inventario siempre daba un total equivocado.',
    causa: 'El contador se reasignaba en cada vuelta en lugar de acumular.',
    solucion: 'Sumar 1 al total anterior en cada caja.',
  },
  simular: simularCambion,
  esCorrecto: cambionEsCorrecto,
  Escena: EscenaCambion,
}
