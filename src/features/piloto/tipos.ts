import type { CasoId, Desenlace } from '@/features/expedientes'

/** Una fila del registro del piloto: un intento de un caso, con el código del participante aparte. */
export type RegistroPiloto = {
  caso: CasoId
  hipotesisId: string
  opcionId: string
  desenlace: Desenlace
  pistasUsadas: number
  hora: string
}
