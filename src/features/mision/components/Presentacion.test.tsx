import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { obtenerExpediente, type CasoId } from '@/features/expedientes'
import { Presentacion } from './Presentacion'

const CASOS: CasoId[] = ['loopi', 'confusin', 'nullito', 'cambion']

describe('Presentacion (P4, CA04.1)', () => {
  it.each(CASOS)('%s muestra criatura, título, saludo, misión y los tres pasos', (id) => {
    const caso = obtenerExpediente(id)
    render(<Presentacion casoId={id} onComenzar={vi.fn()} onVolver={vi.fn()} />)

    expect(screen.getByRole('img', { name: caso.criatura })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: `${caso.criatura} — ${caso.titulo}` }),
    ).toBeInTheDocument()
    expect(screen.getByText(caso.saludo)).toBeInTheDocument()
    expect(screen.getByText('Misión')).toBeInTheDocument()
    expect(screen.getByText(caso.objetivo)).toBeInTheDocument()
    const pasos = within(screen.getByRole('list', { name: 'Pasos' })).getAllByRole('listitem')
    expect(pasos.map((p) => p.textContent?.trim())).toEqual(['Observa', 'Investiga', 'Repara'])
  })

  it('Comenzar y Volver avisan a quien usa la pantalla', async () => {
    const onComenzar = vi.fn()
    const onVolver = vi.fn()
    const usuario = userEvent.setup()
    render(<Presentacion casoId="loopi" onComenzar={onComenzar} onVolver={onVolver} />)

    await usuario.click(screen.getByRole('button', { name: 'Comenzar' }))
    await usuario.click(screen.getByRole('button', { name: 'Volver' }))

    expect(onComenzar).toHaveBeenCalledOnce()
    expect(onVolver).toHaveBeenCalledOnce()
  })
})
