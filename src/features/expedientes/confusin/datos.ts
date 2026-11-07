import type { Expediente } from '../contrato'
import { EscenaConfusin } from './Escena'
import { confusinEsCorrecto, PEDIDOS, simularConfusin } from './simular'

export const confusin: Expediente = {
  id: 'confusin',
  numero: '02',
  mundo: 'control',
  criatura: 'Confusín',
  sprite: 'sprites/confusin.png',
  titulo: 'Pedidos equivocados',
  problema: 'Los paquetes llegan al lugar incorrecto.',
  objetivo: 'Haz que cada pedido llegue a su destino: Norte o Sur.',
  saludo: '¡Hola, Bug Hunter! Los pedidos se están perdiendo.',
  intro:
    'Confusín reparte pedidos al Norte o al Sur, pero los manda al lado equivocado. El problema está en la condición que decide a dónde va cada uno.',
  regla: [
    'para cada pedido:',
    '    si ( ___ ):',
    '        enviar al Norte',
    '    si no:',
    '        enviar al Sur',
  ],
  total: PEDIDOS.length,
  contadores: [
    { id: 'bien', etiqueta: 'Bien enviados', deTotal: true },
    { id: 'mal', etiqueta: 'Mal enviados' },
  ],
  preguntaHipotesis: '¿Por qué llegan mal los pedidos?',
  hipotesis: [
    { id: 'condicion', texto: 'La condición que decide el destino está mal', esCausa: true },
    { id: 'direccion', texto: 'Los pedidos vienen sin dirección', esCausa: false },
    { id: 'muchos', texto: 'Hay demasiados pedidos', esCausa: false },
  ],
  preguntaReparacion: '¿Qué condición manda un pedido al Norte?',
  opciones: [
    { id: 'sur', texto: 'destino = "Sur"' },
    { id: 'verdadero', texto: 'Verdadero' },
    { id: 'norte', texto: 'destino = "Norte"' },
  ],
  opcionAnomalia: 'sur',
  pistas: [
    'Compara a dónde fue cada pedido con a dónde debía ir.',
    'Si la condición siempre es verdadera, todos los pedidos toman el mismo camino.',
    'El «si» decide quién va al Norte: revisa con qué destino se compara cada pedido.',
  ],
  mensajes: {
    sur: {
      titulo: 'Todo sigue al revés',
      cuerpo:
        'Los pedidos del Norte se fueron al Sur y viceversa: la comparación usa el valor equivocado. Ninguno llegó bien.',
    },
    verdadero: {
      titulo: 'Todos al mismo lado: 2 de 4',
      cuerpo:
        'Con una condición siempre verdadera, Confusín mandó todo al Norte. Los pedidos del Sur quedaron mal.',
    },
    norte: {
      titulo: '¡Todo en su lugar! 4 de 4',
      cuerpo:
        'Cada pedido se comparó con su destino real: los del Norte fueron al Norte y los del Sur, al Sur.',
    },
  },
  concepto: 'Condiciones (si / si no) y operadores de comparación',
  terminoIngles: 'if / else, comparison operators',
  ficha: {
    senal: 'Los pedidos llegaban al destino equivocado.',
    causa: 'La condición del «si» comparaba con el valor incorrecto.',
    solucion: 'Comparar el destino del pedido con «Norte».',
  },
  simular: simularConfusin,
  esCorrecto: confusinEsCorrecto,
  Escena: EscenaConfusin,
}
