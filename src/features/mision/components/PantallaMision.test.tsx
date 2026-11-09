import type { ComponentProps } from 'react'
import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useConfiguracion } from '@/features/configuracion'
import { useProgreso } from '@/features/progreso'
import { useAvisos } from '@/shared'
import { PantallaMision } from './PantallaMision'

const HIPOTESIS_CAUSA = 'La condición del ciclo es incorrecta'
const OPCION_CORRECTA = 'Hay paquetes pendientes'

function montar(props: Partial<ComponentProps<typeof PantallaMision>> = {}) {
  const acciones = { onResuelto: vi.fn(), onVolver: vi.fn() }
  render(<PantallaMision casoId="loopi" {...acciones} {...props} />)
  return { ...acciones, usuario: userEvent.setup() }
}

/** Sin animaciones la observación y las pruebas terminan al instante. */
beforeEach(() => {
  act(() => {
    useConfiguracion.setState({ animaciones: false })
    useProgreso.getState().reiniciar()
    useAvisos.getState().ocultar()
  })
})

async function resolver(usuario: ReturnType<typeof userEvent.setup>) {
  await usuario.click(screen.getByRole('button', { name: 'Siguiente' }))
  await usuario.selectOptions(screen.getByLabelText(/Hipótesis/), HIPOTESIS_CAUSA)
  await usuario.click(screen.getByRole('button', { name: OPCION_CORRECTA }))
  await usuario.click(screen.getByRole('button', { name: 'Probar' }))
}

describe('PantallaMision: huecos para otras features', () => {
  it('sin huecos se comporta como siempre: Ayuda avisa y Continuar resuelve', async () => {
    const { usuario, onResuelto } = montar()
    await usuario.click(screen.getByRole('button', { name: 'Ayuda' }))
    expect(useAvisos.getState().mensaje).toMatch(/Observa a la criatura/)
    await resolver(usuario)
    await usuario.click(screen.getByRole('button', { name: /Continuar/ }))
    expect(onResuelto).toHaveBeenCalledOnce()
  })

  it('Ayuda llama a onAyuda cuando existe', async () => {
    const onAyuda = vi.fn()
    const { usuario } = montar({ onAyuda })
    await usuario.click(screen.getByRole('button', { name: 'Ayuda' }))
    expect(onAyuda).toHaveBeenCalledOnce()
  })

  it('Esc llama a onPausa', async () => {
    const onPausa = vi.fn()
    const { usuario } = montar({ onPausa })
    await usuario.keyboard('{Escape}')
    expect(onPausa).toHaveBeenCalledOnce()
  })

  it('sin onPausa, Esc no hace nada', async () => {
    const { usuario } = montar()
    await usuario.keyboard('{Escape}')
    expect(screen.getByRole('button', { name: 'Probar' })).toBeInTheDocument()
  })

  it('Volver informa si hay una edición sin probar (CA15.3)', async () => {
    const { usuario, onVolver } = montar()
    await usuario.click(screen.getByRole('button', { name: 'Volver' }))
    expect(onVolver).toHaveBeenLastCalledWith({ edicionSinProbar: false })

    await usuario.click(screen.getByRole('button', { name: 'Siguiente' }))
    await usuario.click(screen.getByRole('button', { name: OPCION_CORRECTA }))
    await usuario.click(screen.getByRole('button', { name: 'Volver' }))
    expect(onVolver).toHaveBeenLastCalledWith({ edicionSinProbar: true })
  })

  it('renderTutorial ocupa el lugar de la barra de resultado antes de probar', async () => {
    const renderTutorial = vi.fn(({ estado, terminarObservacion }) => (
      <button type="button" onClick={terminarObservacion}>
        Tutorial en {estado}
      </button>
    ))
    const { usuario } = montar({ renderTutorial })

    expect(screen.queryByText(/Paso 1 de 4/)).toBeNull()
    await usuario.click(screen.getByRole('button', { name: 'Tutorial en E1' }))
    expect(screen.getByRole('button', { name: 'Tutorial en E2' })).toBeInTheDocument()
    expect(renderTutorial.mock.calls[0]?.[0]).toMatchObject({ estado: 'E1', primeraVez: true })
  })

  it('renderTutorial deja de mostrarse después de la primera prueba', async () => {
    const renderTutorial = vi.fn(({ estado, terminarObservacion }) => (
      <button type="button" onClick={terminarObservacion}>
        Tutorial en {estado}
      </button>
    ))
    const { usuario } = montar({ renderTutorial })
    await usuario.click(screen.getByRole('button', { name: 'Tutorial en E1' }))
    await usuario.selectOptions(screen.getByLabelText(/Hipótesis/), HIPOTESIS_CAUSA)
    await usuario.click(screen.getByRole('button', { name: OPCION_CORRECTA }))
    await usuario.click(screen.getByRole('button', { name: 'Probar' }))

    expect(screen.queryByRole('button', { name: /Tutorial en/ })).toBeNull()
    expect(screen.getByText('¡Reparto completo! 4 de 4')).toBeInTheDocument()
  })

  it('renderRecuperacion reemplaza el botón Continuar al resolver (CA08.1)', async () => {
    const { usuario, onResuelto } = montar({
      renderRecuperacion: ({ continuar }) => (
        <button type="button" onClick={continuar}>
          Recuperación
        </button>
      ),
    })
    await resolver(usuario)

    expect(screen.queryByRole('button', { name: /Continuar/ })).toBeNull()
    await usuario.click(screen.getByRole('button', { name: 'Recuperación' }))
    expect(onResuelto).toHaveBeenCalledOnce()
  })
})

describe('PantallaMision: pistas bajo los botones', () => {
  it('Pista está deshabilitada mientras se observa la anomalía', () => {
    montar()
    expect(screen.getByRole('button', { name: 'Pista' })).toBeDisabled()
  })

  it('pedir una pista la deja visible y no abre el aviso flotante (CA07.2)', async () => {
    const { usuario } = montar()
    await usuario.click(screen.getByRole('button', { name: 'Siguiente' }))
    await usuario.click(screen.getByRole('button', { name: 'Pista' }))

    expect(screen.getByRole('list', { name: 'Pistas' })).toHaveTextContent('Pista 1 de 3:')
    expect(useAvisos.getState().visible).toBe(false)
  })

  it('después de la tercera avisa que no hay más y desactiva el botón', async () => {
    const { usuario } = montar()
    await usuario.click(screen.getByRole('button', { name: 'Siguiente' }))
    for (let i = 0; i < 3; i++) await usuario.click(screen.getByRole('button', { name: 'Pista' }))

    expect(
      within(screen.getByRole('list', { name: 'Pistas' })).getAllByRole('listitem'),
    ).toHaveLength(3)
    expect(screen.getByText('Ya viste las 3 pistas de este caso.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pista' })).toBeDisabled()
  })

  it('Reiniciar vuelve a empezar sin pistas', async () => {
    const { usuario } = montar()
    await usuario.click(screen.getByRole('button', { name: 'Siguiente' }))
    await usuario.click(screen.getByRole('button', { name: 'Pista' }))
    await usuario.click(screen.getByRole('button', { name: 'Reiniciar' }))

    expect(screen.queryByRole('list', { name: 'Pistas' })).toBeNull()
  })
})

describe('PantallaMision: Probar otra vez (CA06.3)', () => {
  const OPCION_INCOMPLETA = 'Entregados < 2'

  async function probarIncompleto(usuario: ReturnType<typeof userEvent.setup>) {
    await usuario.click(screen.getByRole('button', { name: 'Siguiente' }))
    await usuario.selectOptions(screen.getByLabelText(/Hipótesis/), HIPOTESIS_CAUSA)
    await usuario.click(screen.getByRole('button', { name: OPCION_INCOMPLETA }))
    await usuario.click(screen.getByRole('button', { name: 'Probar' }))
  }

  it('el botón dice «Probar» hasta que hay un intento', () => {
    montar()
    expect(screen.getByRole('button', { name: 'Probar' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Probar otra vez' })).toBeNull()
  })

  it('tras un intento dice «Probar otra vez», también al elegir otra corrección', async () => {
    const { usuario } = montar()
    await probarIncompleto(usuario)
    expect(screen.getByRole('button', { name: 'Probar otra vez' })).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: OPCION_CORRECTA }))
    expect(screen.getByRole('button', { name: 'Probar otra vez' })).toBeInTheDocument()
  })

  it('Reiniciar vuelve a «Probar»', async () => {
    const { usuario } = montar()
    await probarIncompleto(usuario)

    await usuario.click(screen.getByRole('button', { name: 'Reiniciar' }))

    expect(screen.getByRole('button', { name: 'Probar' })).toBeInTheDocument()
  })

  it('un intento sin hipótesis no cuenta: sigue diciendo «Probar»', async () => {
    const { usuario } = montar()
    await usuario.click(screen.getByRole('button', { name: 'Siguiente' }))
    await usuario.click(screen.getByRole('button', { name: OPCION_INCOMPLETA }))
    await usuario.click(screen.getByRole('button', { name: 'Probar' }))

    expect(screen.getByRole('button', { name: 'Probar' })).toBeInTheDocument()
  })
})

describe('PantallaMision: concepto solo en P6 y la BugDex (decisión D, RNF12)', () => {
  it('al resolver, la barra de resultado no nombra el concepto', async () => {
    const { usuario } = montar()
    await resolver(usuario)

    expect(screen.getByText('¡Reparto completo! 4 de 4')).toBeInTheDocument()
    expect(screen.queryByText(/Concepto/)).toBeNull()
  })
})
