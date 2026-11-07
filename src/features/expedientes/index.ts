export type {
  CasoId,
  Desenlace,
  Expediente,
  Hipotesis,
  Mundo,
  MundoId,
  Opcion,
  PasoSimulacion,
  ResultadoSimulacion,
} from './contrato'
export { evaluar, type Evaluacion } from './logic/evaluar'
export {
  EXPEDIENTES,
  MUNDOS,
  expedientesDelMundo,
  obtenerExpediente,
  obtenerMundo,
} from './registro'
