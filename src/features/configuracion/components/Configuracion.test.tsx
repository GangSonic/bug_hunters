import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useProgreso } from '@/features/progreso'
import { useAvisos } from '@/shared'
import { Configuracion } from './Configuracion'

function montar() {
  const onCerrar = vi.fn()
  render(<Configuracion onCerrar={onCerrar} />)
  return { onCerrar, usuario: userEvent.setup() }
}

beforeEach(() => {
  act(() => {
    useProgreso.getState().reiniciar()
    useAvisos.getState().ocultar()
  })
})

describe('Configuración · reiniciar progreso (CA17.4)', () => {
  it('Reiniciar pide confirmación y no borra nada todavía', async () => {
    act(() => useProgreso.getState().marcarResuelto('loopi'))
    const { usuario } = montar()

    await usuario.click(screen.getByRole('button', { name: 'Reiniciar' }))

    expect(screen.getByRole('heading', { name: '¿Reiniciar el progreso?' })).toHaveFocus()
    expect(screen.getByText(/Se borrará tu caso resuelto/)).toBeInTheDocument()
    expect(Object.keys(useProgreso.getState().resueltos)).toEqual(['loopi'])
  })

  it('el texto cuenta los casos que se pierden', async () => {
    act(() => {
      useProgreso.getState().marcarResuelto('loopi')
      useProgreso.getState().marcarResuelto('cambion')
    })
    const { usuario } = montar()
    await usuario.click(screen.getByRole('button', { name: 'Reiniciar' }))
    expect(screen.getByText(/Se borrarán tus 2 casos resueltos/)).toBeInTheDocument()
  })

  it('sin casos resueltos avisa que no se perderá nada', async () => {
    const { usuario } = montar()
    await usuario.click(screen.getByRole('button', { name: 'Reiniciar' }))
    expect(screen.getByText(/no se perderá nada/)).toBeInTheDocument()
  })

  it('Cancelar conserva el progreso y devuelve el foco a Reiniciar', async () => {
    act(() => useProgreso.getState().marcarResuelto('loopi'))
    const { usuario } = montar()
    await usuario.click(screen.getByRole('button', { name: 'Reiniciar' }))

    await usuario.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(screen.getByRole('heading', { name: 'Configuración' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reiniciar' })).toHaveFocus()
    expect(Object.keys(useProgreso.getState().resueltos)).toEqual(['loopi'])
    expect(useAvisos.getState().visible).toBe(false)
  })

  it('Esc cancela la confirmación', async () => {
    act(() => useProgreso.getState().marcarResuelto('loopi'))
    const { usuario } = montar()
    await usuario.click(screen.getByRole('button', { name: 'Reiniciar' }))

    await usuario.keyboard('{Escape}')

    expect(screen.getByRole('heading', { name: 'Configuración' })).toBeInTheDocument()
    expect(Object.keys(useProgreso.getState().resueltos)).toEqual(['loopi'])
  })

  it('confirmar borra el progreso, avisa y vuelve a Configuración', async () => {
    act(() => useProgreso.getState().marcarResuelto('loopi'))
    const { usuario } = montar()
    await usuario.click(screen.getByRole('button', { name: 'Reiniciar' }))

    await usuario.click(screen.getByRole('button', { name: 'Sí, reiniciar' }))

    expect(useProgreso.getState().resueltos).toEqual({})
    expect(useAvisos.getState().mensaje).toBe('Progreso reiniciado.')
    expect(screen.getByText('Casos resueltos: 0 de 4')).toBeInTheDocument()
  })
})

describe('Configuración · flechas entre los temas (RNF02)', () => {
  it('las flechas mueven el foco entre Claro, Oscuro y Auto, y Intro elige', async () => {
    const { usuario } = montar()
    const grupo = screen.getByRole('group', { name: 'Tema' })
    const claro = within(grupo).getByRole('button', { name: 'Claro' })
    const oscuro = within(grupo).getByRole('button', { name: 'Oscuro' })

    claro.focus()
    await usuario.keyboard('{ArrowRight}')
    expect(oscuro).toHaveFocus()
    expect(oscuro).toHaveAttribute('aria-pressed', 'false')

    await usuario.keyboard('{Enter}')
    expect(oscuro).toHaveAttribute('aria-pressed', 'true')
  })
})
