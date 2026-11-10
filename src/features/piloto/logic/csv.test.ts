import { describe, expect, it } from 'vitest'
import type { RegistroPiloto } from '../tipos'
import { aCsv } from './csv'

const base: RegistroPiloto = {
  caso: 'loopi',
  hipotesisId: 'condicion',
  opcionId: 'pendientes',
  desenlace: 'correcto',
  pistasUsadas: 1,
  hora: '2026-11-08T18:00:00.000Z',
}

describe('aCsv', () => {
  it('empieza con la fila de encabezados', () => {
    expect(aCsv('P01', []).split('\n')).toEqual([
      'codigo,caso,hipotesis,correccion,desenlace,pistas,hora',
    ])
  })

  it('escribe una fila por intento, con el código en cada una', () => {
    const csv = aCsv('P01', [base, { ...base, caso: 'confusin', pistasUsadas: 0 }])
    const filas = csv.split('\n')
    expect(filas).toHaveLength(3)
    expect(filas[1]).toBe('P01,loopi,condicion,pendientes,correcto,1,2026-11-08T18:00:00.000Z')
    expect(filas[2]).toBe('P01,confusin,condicion,pendientes,correcto,0,2026-11-08T18:00:00.000Z')
  })

  it('entrecomilla los campos con coma o comillas', () => {
    // El código con coma y comillas se entrecomilla y las comillas internas se duplican.
    expect(aCsv('P,0"1', [base])).toContain('"P,0""1",loopi')
    // Sin registros no hay filas de datos, solo el encabezado.
    expect(aCsv('P,0"1', []).split('\n')).toHaveLength(1)
  })
})
