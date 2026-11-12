import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MensajeCentrado } from './MensajeCentrado'

describe('MensajeCentrado', () => {
  it('muestra título, texto y acciones', () => {
    render(
      <MensajeCentrado icono="salir" titulo="¿Salir?" acciones={<button>Salir</button>}>
        Tu progreso queda guardado.
      </MensajeCentrado>,
    )
    expect(screen.getByRole('heading', { name: '¿Salir?' })).toBeInTheDocument()
    expect(screen.getByText('Tu progreso queda guardado.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salir' })).toBeInTheDocument()
  })

  it('manda el foco al título al aparecer', () => {
    render(
      <MensajeCentrado icono="salir" titulo="¿Salir?" acciones={<button>Salir</button>}>
        Texto
      </MensajeCentrado>,
    )
    expect(screen.getByRole('heading', { name: '¿Salir?' })).toHaveFocus()
  })
})
