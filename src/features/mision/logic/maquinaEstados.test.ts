import {
  ESTADO_INICIAL,
  MAX_PISTAS,
  puedePedirPista,
  puedeProbar,
  puedeReparar,
  transicion,
  type EstadoMision,
  type Evento,
} from './maquinaEstados'

const aplicar = (eventos: Evento[], desde: EstadoMision = ESTADO_INICIAL) =>
  eventos.reduce(transicion, desde)

const HORA = '2026-11-07T10:00:00.000Z'

describe('máquina de estados de la misión', () => {
  it('E1 → E2 al terminar la observación', () => {
    expect(aplicar([{ tipo: 'OBSERVACION_TERMINADA' }]).estado).toBe('E2')
  })

  it('CA05.2 sin hipótesis se puede elegir la corrección, pero no probar', () => {
    const m = aplicar([{ tipo: 'OBSERVACION_TERMINADA' }, { tipo: 'ELEGIR_OPCION', id: 'a' }])
    expect(m.estado).toBe('E2')
    expect(m.opcionId).toBe('a')
    expect(puedeReparar(m)).toBe(true)
    expect(puedeProbar(m)).toBe(false)
    const conHipotesis = transicion(m, { tipo: 'ELEGIR_HIPOTESIS', id: 'h' })
    expect(conHipotesis.estado).toBe('E4')
    expect(puedeProbar(conHipotesis)).toBe(true)
  })

  it('en E1 no se puede reparar', () => {
    expect(puedeReparar(ESTADO_INICIAL)).toBe(false)
    expect(transicion(ESTADO_INICIAL, { tipo: 'ELEGIR_OPCION', id: 'a' })).toBe(ESTADO_INICIAL)
  })

  it('recorre E2 → E3 → E4 → E5a → E6', () => {
    const m = aplicar([
      { tipo: 'OBSERVACION_TERMINADA' },
      { tipo: 'ELEGIR_HIPOTESIS', id: 'h' },
      { tipo: 'ELEGIR_OPCION', id: 'a' },
      { tipo: 'PROBADO', desenlace: 'correcto', hipotesisEsCausa: true, hora: HORA },
      { tipo: 'CONTINUAR' },
    ])
    expect(m.estado).toBe('E6')
    expect(m.intentos).toHaveLength(1)
  })

  it('CA06.3 cada desenlace lleva a su estado', () => {
    const base = aplicar([
      { tipo: 'OBSERVACION_TERMINADA' },
      { tipo: 'ELEGIR_HIPOTESIS', id: 'h' },
      { tipo: 'ELEGIR_OPCION', id: 'a' },
    ])
    expect(
      transicion(base, {
        tipo: 'PROBADO',
        desenlace: 'incompleto',
        hipotesisEsCausa: true,
        hora: HORA,
      }).estado,
    ).toBe('E5b')
    expect(
      transicion(base, {
        tipo: 'PROBADO',
        desenlace: 'sinCambio',
        hipotesisEsCausa: true,
        hora: HORA,
      }).estado,
    ).toBe('E5c')
  })

  it('desde E5b se revisa (E2) o se prueba otra opción (E4), sin límite de intentos', () => {
    let m = aplicar([
      { tipo: 'OBSERVACION_TERMINADA' },
      { tipo: 'ELEGIR_HIPOTESIS', id: 'h' },
      { tipo: 'ELEGIR_OPCION', id: 'a' },
      { tipo: 'PROBADO', desenlace: 'incompleto', hipotesisEsCausa: true, hora: HORA },
    ])
    expect(transicion(m, { tipo: 'REVISAR' }).estado).toBe('E2')
    for (let i = 0; i < 10; i++) {
      m = aplicar(
        [
          { tipo: 'ELEGIR_OPCION', id: 'b' },
          { tipo: 'PROBADO', desenlace: 'incompleto', hipotesisEsCausa: true, hora: HORA },
        ],
        m,
      )
    }
    expect(m.intentos).toHaveLength(11)
  })

  it('CA06.4 reiniciar vuelve a E1 y conserva los intentos', () => {
    const m = aplicar([
      { tipo: 'OBSERVACION_TERMINADA' },
      { tipo: 'ELEGIR_HIPOTESIS', id: 'h' },
      { tipo: 'PEDIR_PISTA' },
      { tipo: 'ELEGIR_OPCION', id: 'a' },
      { tipo: 'PROBADO', desenlace: 'sinCambio', hipotesisEsCausa: true, hora: HORA },
      { tipo: 'REINICIAR' },
    ])
    expect(m.estado).toBe('E1')
    expect(m.hipotesisId).toBeNull()
    expect(m.pistasVistas).toBe(0)
    expect(m.intentos).toHaveLength(1)
  })

  it('CA07.3 no entrega más de 3 pistas y no hay pistas en E1', () => {
    expect(transicion(ESTADO_INICIAL, { tipo: 'PEDIR_PISTA' }).pistasVistas).toBe(0)
    let m = aplicar([{ tipo: 'OBSERVACION_TERMINADA' }])
    for (let i = 0; i < 5; i++) m = transicion(m, { tipo: 'PEDIR_PISTA' })
    expect(m.pistasVistas).toBe(MAX_PISTAS)
    expect(puedePedirPista(m)).toBe(false)
  })

  it('CA07.4 el intento registra las pistas usadas', () => {
    const m = aplicar([
      { tipo: 'OBSERVACION_TERMINADA' },
      { tipo: 'PEDIR_PISTA' },
      { tipo: 'PEDIR_PISTA' },
      { tipo: 'ELEGIR_HIPOTESIS', id: 'h' },
      { tipo: 'ELEGIR_OPCION', id: 'a' },
      { tipo: 'PROBADO', desenlace: 'incompleto', hipotesisEsCausa: true, hora: HORA },
    ])
    expect(m.intentos[0]?.pistasUsadas).toBe(2)
  })

  it('marca la edición sin probar hasta que se prueba', () => {
    const m = aplicar([
      { tipo: 'OBSERVACION_TERMINADA' },
      { tipo: 'ELEGIR_HIPOTESIS', id: 'h' },
      { tipo: 'ELEGIR_OPCION', id: 'a' },
    ])
    expect(m.edicionSinProbar).toBe(true)
    expect(
      transicion(m, { tipo: 'PROBADO', desenlace: 'correcto', hipotesisEsCausa: true, hora: HORA })
        .edicionSinProbar,
    ).toBe(false)
  })

  it('ignora eventos fuera de lugar', () => {
    expect(transicion(ESTADO_INICIAL, { tipo: 'CONTINUAR' })).toBe(ESTADO_INICIAL)
    expect(transicion(ESTADO_INICIAL, { tipo: 'REVISAR' })).toBe(ESTADO_INICIAL)
    expect(
      transicion(ESTADO_INICIAL, {
        tipo: 'PROBADO',
        desenlace: 'correcto',
        hipotesisEsCausa: true,
        hora: HORA,
      }),
    ).toBe(ESTADO_INICIAL)
    const e6 = { ...ESTADO_INICIAL, estado: 'E6' as const }
    expect(transicion(e6, { tipo: 'REINICIAR' })).toBe(e6)
    expect(transicion(e6, { tipo: 'ELEGIR_HIPOTESIS', id: 'h' })).toBe(e6)
  })
})

describe('DAAF-01: la hipótesis debe ser la causa (Decisión A)', () => {
  const hasta04 = (): EstadoMision =>
    aplicar([
      { tipo: 'OBSERVACION_TERMINADA' },
      { tipo: 'ELEGIR_HIPOTESIS', id: 'h' },
      { tipo: 'ELEGIR_OPCION', id: 'a' },
    ])

  it('corrección correcta CON la causa correcta resuelve (E5a) y no queda por revisar', () => {
    const m = transicion(hasta04(), {
      tipo: 'PROBADO',
      desenlace: 'correcto',
      hipotesisEsCausa: true,
      hora: HORA,
    })
    expect(m.estado).toBe('E5a')
    expect(m.hipotesisPorRevisar).toBe(false)
  })

  it('corrección correcta con hipótesis equivocada NO resuelve: queda en E5b y por revisar', () => {
    const m = transicion(hasta04(), {
      tipo: 'PROBADO',
      desenlace: 'correcto',
      hipotesisEsCausa: false,
      hora: HORA,
    })
    expect(m.estado).toBe('E5b')
    expect(m.hipotesisPorRevisar).toBe(true)
  })

  it('al revisar desde E5b se limpia la marca de hipótesis por revisar', () => {
    const conMarca = transicion(hasta04(), {
      tipo: 'PROBADO',
      desenlace: 'correcto',
      hipotesisEsCausa: false,
      hora: HORA,
    })
    const revisado = transicion(conMarca, { tipo: 'REVISAR' })
    expect(revisado.estado).toBe('E2')
    expect(revisado.hipotesisPorRevisar).toBe(false)
  })
})
