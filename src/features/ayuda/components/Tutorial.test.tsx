import { act, fireEvent, render, screen } from '@testing-library/react'
import { obtenerExpediente } from '@/features/expedientes'
import { useProgreso } from '@/features/progreso'
import { Tutorial } from './Tutorial'

const caso = obtenerExpediente('cambion')

function contexto(cambios = {}) {
  return {
    caso,
    estado: 'E1',
    reproduciendo: false,
    primeraVez: true,
    omitirObservacion: vi.fn(),
    terminarObservacion: vi.fn(),
    ...cambios,
  }
}

describe('Tutorial', () => {
  beforeEach(() => {
    act(() => useProgreso.getState().reiniciar())
  })

  it('E1 mantiene el paso 1 y Siguiente pasa a investigar', () => {
    const props = contexto()
    render(<Tutorial {...props} />)
    expect(screen.getByText('Paso 1 de 4: observa a Cambión')).toBeDefined()
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }))
    expect(props.terminarObservacion).toHaveBeenCalledTimes(1)
  })

  it('E1 mientras corre la animación ofrece Omitir', () => {
    const props = contexto({ reproduciendo: true })
    render(<Tutorial {...props} />)
    expect(screen.queryByRole('button', { name: 'Siguiente' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Omitir' }))
    expect(props.omitirObservacion).toHaveBeenCalledTimes(1)
  })

  it('CA04.3 la primera vez muestra el paso de cada estado', () => {
    render(<Tutorial {...contexto({ estado: 'E2' })} />)
    expect(screen.getByText(/Paso 2 de 4/)).toBeDefined()
  })

  it('CA04.3 al llegar al último paso queda marcado como visto', () => {
    render(<Tutorial {...contexto({ estado: 'E4' })} />)
    expect(useProgreso.getState().tutorialVisto).toBe(true)
  })

  it('Omitir tutorial lo marca como visto', () => {
    render(<Tutorial {...contexto({ estado: 'E3' })} />)
    fireEvent.click(screen.getByRole('button', { name: 'Omitir tutorial' }))
    expect(useProgreso.getState().tutorialVisto).toBe(true)
  })

  it('CA04.3 después de la primera vez solo hay un recordatorio de una línea', () => {
    render(<Tutorial {...contexto({ estado: 'E2', primeraVez: false })} />)
    expect(screen.getByText(/Recuerda:/)).toBeDefined()
    expect(screen.queryByText(/Paso 2 de 4/)).toBeNull()
  })
})
