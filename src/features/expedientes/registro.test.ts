import { EXPEDIENTES, MUNDOS, expedientesDelMundo, obtenerExpediente } from './registro'

describe('registro de expedientes', () => {
  it('tiene 2 mundos con 2 casos cada uno', () => {
    expect(MUNDOS).toHaveLength(2)
    for (const mundo of MUNDOS) expect(expedientesDelMundo(mundo.id)).toHaveLength(2)
  })

  it.each(EXPEDIENTES.map((e) => [e.id, e] as const))(
    '%s cumple el contrato: 3 opciones (anomalía, parcial, correcta) y una sola causa',
    (_id, exp) => {
      expect(exp.opciones.map((o) => o.id)).toContain(exp.opcionAnomalia)
      expect(exp.hipotesis.filter((h) => h.esCausa)).toHaveLength(1)
      for (const opcion of exp.opciones) expect(exp.mensajes[opcion.id]).toBeDefined()
      const correctas = exp.opciones.filter((o) => exp.esCorrecto(exp.simular(o.id)))
      expect(correctas).toHaveLength(1)
      expect(exp.regla.some((linea) => linea.includes('___'))).toBe(true)
    },
  )

  it('falla con un id desconocido', () => {
    // @ts-expect-error id inválido a propósito
    expect(() => obtenerExpediente('otro')).toThrow()
  })
})
