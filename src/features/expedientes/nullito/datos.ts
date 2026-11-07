import type { Expediente } from '../contrato'
import { EscenaNullito } from './Escena'
import { nullitoEsCorrecto, PEDIDOS, simularNullito } from './simular'

export const nullito: Expediente = {
  id: 'nullito',
  numero: '03',
  mundo: 'datos',
  criatura: 'Nullito',
  sprite: 'sprites/nullito.png',
  titulo: 'El pedido desaparecido',
  problema: 'Un pedido no aparece en los registros.',
  objetivo: 'Atiende los 4 pedidos sin que la cocina se detenga.',
  saludo: '¡Hola, Bug Hunter! La cafetería del laboratorio se detuvo.',
  intro:
    'Nullito prepara los pedidos de la lista, pero uno nunca se registró y, al llegar a él, todo se detiene. Hay que decidir qué hacer cuando un dato no existe.',
  regla: ['para cada pedido de la lista:', '    ___'],
  total: PEDIDOS.length,
  contadores: [
    { id: 'atendidos', etiqueta: 'Atendidos', deTotal: true },
    { id: 'sinAtender', etiqueta: 'Sin atender' },
  ],
  preguntaHipotesis: '¿Por qué se detiene la cocina?',
  hipotesis: [
    { id: 'revisar', texto: 'No se revisa si el pedido existe antes de prepararlo', esCausa: true },
    { id: 'pesado', texto: 'El pedido pesa demasiado', esCausa: false },
    { id: 'larga', texto: 'La lista es muy larga', esCausa: false },
  ],
  preguntaReparacion: '¿Qué debe hacer Nullito con cada pedido?',
  opciones: [
    { id: 'sinRevisar', texto: 'preparar pedido' },
    { id: 'siExiste', texto: 'si existe: preparar pedido' },
    { id: 'avisar', texto: 'si existe: preparar pedido · si no: avisar y seguir' },
  ],
  opcionAnomalia: 'sinRevisar',
  pistas: [
    'Fíjate en qué pedido se detiene la cocina.',
    'Ese pedido no tiene datos: no se puede preparar algo que no existe.',
    'Antes de usar un dato hay que revisar si existe, y decidir qué hacer cuando falta.',
  ],
  mensajes: {
    sinRevisar: {
      titulo: 'La cocina se detuvo en el pedido 3',
      cuerpo:
        'Nullito intentó preparar un pedido que no existe y todo se detuvo: solo se atendieron 2 de 4.',
    },
    siExiste: {
      titulo: 'Un pedido se quedó sin respuesta',
      cuerpo:
        'Ya no se detiene, pero el pedido ausente se ignoró sin avisar a nadie: 3 de 4 atendidos.',
    },
    avisar: {
      titulo: '¡Todos atendidos! 4 de 4',
      cuerpo:
        'Nullito revisó cada pedido: preparó los que existen y avisó del que falta, sin detener la cocina.',
    },
  },
  concepto: 'Valor ausente (nulo) y validación previa',
  terminoIngles: 'null',
  ficha: {
    senal: 'La cocina se detenía al llegar a un pedido inexistente.',
    causa:
      'Se usaba el pedido sin revisar si existía. Un valor nulo no es 0 ni un texto vacío: es la ausencia de dato.',
    solucion: 'Revisar si el pedido existe y, si no, avisar y seguir.',
  },
  simular: simularNullito,
  esCorrecto: nullitoEsCorrecto,
  Escena: EscenaNullito,
}
