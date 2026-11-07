import { BugDex } from '@/features/bugdex'
import { Configuracion, useAplicarConfiguracion, useConfiguracion } from '@/features/configuracion'
import { Inicio } from '@/features/inicio'
import { PantallaMision, Presentacion } from '@/features/mision'
import { Resultado } from '@/features/resultado'
import { Seleccion } from '@/features/seleccion'
import { Aviso } from '@/shared'
import { useNavegacion } from './navegacion/navegacionStore'
import estilos from './App.module.css'

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

  return (
    <div className={estilos.wrap}>
      <div className={estilos.topbar}>
        <span className={estilos.marca}>Bug Hunters · Laboratorio de Bugs</span>
        <button
          type="button"
          className={estilos.botonTema}
          onClick={alternarTema}
          aria-label="Cambiar tema"
        >
          Tema
        </button>
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
                onVolver={() => irA('P3')}
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

      <Aviso />
    </div>
  )
}
