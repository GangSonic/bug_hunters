import type { Expediente } from '../contrato'
import { EscenaLoopi } from './Escena'
import { loopiEsCorrecto, simularLoopi, TOTAL_PAQUETES } from './simular'

export const loopi: Expediente = {
  id: 'loopi',
  numero: '01',
  mundo: 'control',
  criatura: 'Loopi',
  sprite: 'sprites/loopi.png',
  titulo: 'El reparto interminable',
  problema: 'El reparto no logra detenerse.',
  objetivo: 'Entrega los 4 paquetes y haz que el reparto termine.',
  saludo: '¡Hola, Bug Hunter! Hoy el laboratorio tiene un problema.',
  intro:
    'Loopi reparte paquetes sin parar y nunca termina. Observa qué sale mal, revisa sus instrucciones y prueba un cambio para recuperarlo.',
  regla: [
    'entregados ← 0',
    'repetir mientras ( ___ ):',
    '    entregar paquete',
    '    entregados ← entregados + 1',
  ],
  total: TOTAL_PAQUETES,
  contadores: [
    { id: 'entregados', etiqueta: 'Entregados', deTotal: true },
    { id: 'pendientes', etiqueta: 'Pendientes' },
  ],
  preguntaHipotesis: '¿Por qué sigue repitiendo?',
  hipotesis: [
    { id: 'condicion', texto: 'La condición del ciclo es incorrecta', esCausa: true },
    { id: 'paquete', texto: 'El paquete está dañado', esCausa: false },
    { id: 'lento', texto: 'Loopi camina demasiado lento', esCausa: false },
  ],
  preguntaReparacion: '¿Con qué condición debe repetirse?',
  opciones: [
    { id: 'verdadero', texto: 'Verdadero' },
    { id: 'pendientes', texto: 'Hay paquetes pendientes' },
    { id: 'menos2', texto: 'Entregados < 2' },
  ],
  opcionAnomalia: 'verdadero',
  pistas: [
    'Observa el contador: ¿qué hace Loopi cuando ya no quedan paquetes?',
    'El ciclo se repite mientras su condición sea verdadera. «Verdadero» siempre lo es.',
    'La condición debe dejar de cumplirse justo cuando ya no queda nada por entregar.',
  ],
  mensajes: {
    verdadero: {
      titulo: 'Loopi sigue repitiendo',
      cuerpo:
        'Entregó todo y siguió repartiendo cajas vacías. La condición nunca deja de cumplirse, así que el ciclo no termina.',
    },
    menos2: {
      titulo: 'El reparto se detuvo, pero quedan 2 paquetes pendientes',
      cuerpo:
        'La condición dejó de cumplirse demasiado pronto. Revisa la condición y prueba otra vez.',
    },
    pendientes: {
      titulo: '¡Reparto completo! 4 de 4',
      cuerpo:
        'El ciclo se detuvo justo al entregar el último paquete: la condición dejó de cumplirse cuando ya no quedaban pendientes.',
    },
  },
  concepto: 'Ciclo infinito y condición de salida',
  terminoIngles: 'infinite loop',
  ficha: {
    senal: 'El reparto se repetía sin parar.',
    causa: 'La condición del ciclo nunca dejaba de cumplirse.',
    solucion: 'Repetir solo mientras haya paquetes pendientes.',
  },
  simular: simularLoopi,
  esCorrecto: loopiEsCorrecto,
  Escena: EscenaLoopi,
}
