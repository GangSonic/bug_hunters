import { Boton } from '@/shared'
import { aCsv } from '../logic/csv'
import { usePiloto } from '../store/pilotoStore'
import estilos from './BarraPiloto.module.css'

/** Genera y descarga un archivo de texto en el navegador, sin enviarlo a ningún lado. */
function descargar(nombre: string, contenido: string) {
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = nombre
  enlace.click()
  URL.revokeObjectURL(url)
}

/** Barra del modo piloto (HU18): código del participante y descarga del registro en CSV. */
export function BarraPiloto() {
  const codigo = usePiloto((s) => s.codigo)
  const registros = usePiloto((s) => s.registros)
  const cambiarCodigo = usePiloto((s) => s.cambiarCodigo)
  const limpiar = usePiloto((s) => s.limpiar)
  const sinDatos = registros.length === 0

  const descargarCsv = () =>
    descargar(`piloto-${codigo || 'sin-codigo'}.csv`, aCsv(codigo, registros))

  return (
    <div className={estilos.barra} role="region" aria-label="Modo piloto">
      <span className={estilos.etiqueta}>Modo piloto</span>
      <label className={estilos.campo}>
        Código
        <input
          className={estilos.input}
          value={codigo}
          onChange={(e) => cambiarCodigo(e.target.value)}
          placeholder="P01"
          aria-label="Código de participante"
        />
      </label>
      <span className={estilos.cuenta}>
        {registros.length} {registros.length === 1 ? 'intento' : 'intentos'}
      </span>
      <Boton
        className={estilos.separa}
        icono="flechaAbajo"
        onClick={descargarCsv}
        disabled={sinDatos}
      >
        Descargar CSV
      </Boton>
      <Boton variante="pill" icono="reiniciar" onClick={limpiar} disabled={sinDatos}>
        Limpiar
      </Boton>
    </div>
  )
}
