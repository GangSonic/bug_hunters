import { useState } from 'react'
import { BotonMusica, useMusica } from '@/features/audio'
import { Ayuda, Tutorial } from '@/features/ayuda'
import { BugDex } from '@/features/bugdex'
import { Configuracion, useAplicarConfiguracion, useConfiguracion } from '@/features/configuracion'
import { Inicio } from '@/features/inicio'
import { PantallaMision, Presentacion, type SalidaMision } from '@/features/mision'
import { BarraPiloto, esPilotoActivo } from '@/features/piloto'
import { Recuperacion, Resultado } from '@/features/resultado'
import { Seleccion } from '@/features/seleccion'
import { Aviso } from '@/shared'
import { Confirmacion } from './capas/Confirmacion'
import { Pausa } from './capas/Pausa'
import { useNavegacion } from './navegacion/navegacionStore'
import estilos from './App.module.css'
import { AvisoProgresoDescartado } from '@/features/progreso'
/** Alterna entre claro y oscuro según lo que se ve ahora, como el botón «Tema» original. */
function useAlternarTema() {
  const tema = useConfiguracion((s) => s.tema)
  const cambiarTema = useConfiguracion((s) => s.cambiarTema)
  return () => {
    const sistemaOscuro = window.matchMedia?.('(prefers-color-scheme: dark)').matches === true
    const oscuro = tema === 'oscuro' || (tema === 'auto' && sistemaOscuro)
    cambiarTema(oscuro ? 'claro' : 'oscuro')
  }
}

/**
 * Shell: barra superior, pantalla actual y avisos. Conecta los botones de cada feature
 * con la tabla de enlaces. No contiene reglas de juego.
 */
export function App() {
  useAplicarConfiguracion()
  const alternarTema = useAlternarTema()
  const { pantalla, casoId, capa, irA, abrirCapa, cerrarCapa } = useNavegacion()
  useMusica(pantalla)
  // HU18: la barra del piloto solo aparece con ?piloto=1 en la URL.
  const [piloto] = useState(esPilotoActivo)
  // HU15: recuerda si la misión tiene una corrección sin probar, para decidir si salir
  // directo o pedir confirmación (O4), tanto desde «Volver» como desde la pausa (O1).
  const [edicionSinProbar, setEdicionSinProbar] = useState(false)

  const salirDeMision = (salida: SalidaMision) => {
    if (salida.edicionSinProbar) {
      setEdicionSinProbar(true)
      abrirCapa('O4')
    } else {
      irA('P3')
    }
  }

  const salirDesdePausa = () => (edicionSinProbar ? abrirCapa('O4') : irA('P3'))

  return (
    <div className={estilos.wrap}>
      <div className={estilos.topbar}>
        <span className={estilos.marca}>Bug Hunters · Laboratorio de Bugs</span>
        <div className={estilos.acciones}>
          <BotonMusica className={estilos.botonTema} />
          <button
            type="button"
            className={estilos.botonTema}
            onClick={alternarTema}
            aria-label="Cambiar tema"
          >
            Tema
          </button>
        </div>
      </div>

      <main>
        {/* O3 se muestra en lugar de la pantalla, como en la primera versión. */}
        {capa === 'O3' ? (
          <Configuracion onCerrar={cerrarCapa} />
        ) : (
          <>
            {pantalla === 'P1' && (
              <Inicio onJugar={() => irA('P3')} onConfiguracion={() => abrirCapa('O3')} />
            )}
            {pantalla === 'P3' && (
              <Seleccion
                onInvestigar={(id) => irA('P4', { casoId: id })}
                onBugDex={() => irA('P7')}
                onInicio={() => irA('P1')}
              />
            )}
            {pantalla === 'P4' && (
              <Presentacion
                casoId={casoId}
                onComenzar={() => irA('P5')}
                onVolver={() => irA('P3')}
              />
            )}
            {pantalla === 'P5' && (
              <PantallaMision
                key={casoId}
                casoId={casoId}
                onResuelto={() => irA('P6')}
                onVolver={salirDeMision}
                onPausa={(salida) => {
                  // Con una capa abierta, Esc es de esa capa: no debe abrir además la pausa.
                  if (capa !== null) return
                  setEdicionSinProbar(salida.edicionSinProbar)
                  abrirCapa('O1')
                }}
                onAyuda={() => abrirCapa('O2')}
                renderTutorial={(contexto) => <Tutorial {...contexto} />}
                renderRecuperacion={(contexto) => <Recuperacion {...contexto} />}
              />
            )}
            {pantalla === 'P6' && (
              <Resultado
                casoId={casoId}
                onVerFicha={() => irA('P7')}
                onOtraMision={() => irA('P3')}
                onInicio={() => irA('P1')}
              />
            )}
            {pantalla === 'P7' && <BugDex onVolver={() => irA('P3')} onInicio={() => irA('P1')} />}
          </>
        )}
      </main>

      {capa === 'O1' && <Pausa onReanudar={cerrarCapa} onSalir={salirDesdePausa} />}
      {capa === 'O2' && <Ayuda onCerrar={cerrarCapa} />}
      {capa === 'O4' && <Confirmacion onSalir={() => irA('P3')} onCancelar={cerrarCapa} />}

      {piloto && <BarraPiloto />}
      <AvisoProgresoDescartado />
      <Aviso />
    </div>
  )
}
