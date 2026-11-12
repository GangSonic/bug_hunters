import { render, screen } from '@testing-library/react'
import type { PropsEscena } from '../contrato'
import { EscenaNullito } from './Escena'
import { simularNullito } from './simular'

const vacio: PropsEscena = { pasos: [], reproduciendo: false, desenlace: null }

/** Columna (0 a 3) bajo la que está Nullito, leída de su posición en la pista. */
function posicion() {
  const criatura = screen.getByAltText('Nullito').closest('[data-pedido-actual]') as HTMLElement
  return { indice: criatura.dataset.pedidoActual, izquierda: criatura.style.left }
}

describe('EscenaNullito', () => {
  it('al observar muestra las cuatro comandas, la tercera como pedido que no existe', () => {
    render(<EscenaNullito {...vacio} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
    expect(screen.getByText('Pedido 3: no existe')).toBeInTheDocument()
    expect(screen.getByText('Pedido 1: pendiente')).toBeInTheDocument()
    expect(screen.getByText('∅')).toBeInTheDocument()
    expect(screen.getByText('0/4')).toBeInTheDocument()
    expect(posicion()).toEqual({ indice: '0', izquierda: '12.5%' })
  })

  it('sin revisar, la cocina se detiene en la comanda 3 y Nullito se queda ahí', () => {
    const { pasos } = simularNullito('sinRevisar')
    render(<EscenaNullito pasos={pasos} reproduciendo={false} desenlace="incompleto" />)
    expect(screen.getByText('Pedido 2: preparado')).toBeInTheDocument()
    expect(screen.getByText('Pedido 3: no existe y detuvo la cocina')).toBeInTheDocument()
    expect(screen.getByText('Pedido 4: pendiente')).toBeInTheDocument()
    expect(screen.getByText('2/4')).toBeInTheDocument()
    expect(posicion()).toEqual({ indice: '2', izquierda: '62.5%' })
  })

  it('si solo revisa, el pedido ausente queda sin respuesta', () => {
    const { pasos } = simularNullito('siExiste')
    render(<EscenaNullito pasos={pasos} reproduciendo={false} desenlace="incompleto" />)
    expect(screen.getByText('Pedido 3: no existe; quedó sin respuesta')).toBeInTheDocument()
    expect(screen.getByText('3/4')).toBeInTheDocument()
  })

  it('al avisar y seguir atiende los cuatro y Nullito llega a la última comanda', () => {
    const { pasos } = simularNullito('avisar')
    render(<EscenaNullito pasos={pasos} reproduciendo={false} desenlace="correcto" />)
    expect(screen.getByText('Pedido 3: no existe; se avisó')).toBeInTheDocument()
    expect(screen.getByText('Pedido 4: preparado')).toBeInTheDocument()
    expect(screen.getByText('4/4')).toBeInTheDocument()
    expect(posicion()).toEqual({ indice: '3', izquierda: '87.5%' })
  })

  it('el estado de cada comanda también se dice con texto, no solo con color', () => {
    const { pasos } = simularNullito('avisar')
    render(<EscenaNullito pasos={pasos} reproduciendo={false} desenlace="correcto" />)
    const comandas = screen.getAllByRole('listitem')
    expect(comandas.map((c) => c.textContent)).toEqual([
      '1Pedido 1: preparado',
      '2Pedido 2: preparado',
      '∅Pedido 3: no existe; se avisó',
      '4Pedido 4: preparado',
    ])
  })
})
