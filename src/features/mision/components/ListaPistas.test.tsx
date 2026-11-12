import { render, screen } from '@testing-library/react'
import { ListaPistas } from './ListaPistas'

const PISTAS = ['Primera pista', 'Segunda pista', 'Tercera pista']

describe('ListaPistas', () => {
  it('no muestra nada mientras no se haya pedido ninguna pista', () => {
    render(<ListaPistas vistas={[]} total={3} />)
    expect(screen.queryByRole('list', { name: 'Pistas' })).toBeNull()
    expect(screen.queryByText(/Ya viste/)).toBeNull()
  })

  it('numera cada pista vista sobre el total del caso', () => {
    render(<ListaPistas vistas={PISTAS.slice(0, 2)} total={3} />)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('Pista 1 de 3: Primera pista')
    expect(items[1]).toHaveTextContent('Pista 2 de 3: Segunda pista')
    expect(screen.queryByText(/Ya viste/)).toBeNull()
  })

  it('al llegar a la última avisa que ya no quedan más', () => {
    render(<ListaPistas vistas={PISTAS} total={3} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByText('Ya viste las 3 pistas de este caso.')).toBeInTheDocument()
  })

  it('se anuncia a lectores de pantalla cuando aparece una pista', () => {
    const { container } = render(<ListaPistas vistas={[]} total={3} />)
    expect(container.firstElementChild).toHaveAttribute('aria-live', 'polite')
  })
})
