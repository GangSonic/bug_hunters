import { BugDex } from '@/features/bugdex'
import { Configuracion, useAplicarConfiguracion } from '@/features/configuracion'
import { Inicio } from '@/features/inicio'
import { PantallaMision, Presentacion } from '@/features/mision'
import { Resultado } from '@/features/resultado'
import { SeleccionExpediente, SeleccionMundo } from '@/features/seleccion'
import { useNavegacion } from './navegacion/navegacionStore'

/**
 * Shell: decide qué pantalla y qué capa se ven, y conecta los botones de cada feature
 * con los enlaces de la Tabla 14. No contiene reglas de juego.
 */
export function App() {
  useAplicarConfiguracion()
  const { pantalla, mundo, casoId, capa, irA, abrirCapa, cerrarCapa } = useNavegacion()

  return (
    <div className="app">
      <main>
        {pantalla === 'P1' && (
          <Inicio onJugar={() => irA('P2')} onConfiguracion={() => abrirCapa('O3')} />
        )}
        {pantalla === 'P2' && (
          <SeleccionMundo
            onElegirMundo={(m) => irA('P3', { mundo: m })}
            onVolver={() => irA('P1')}
          />
        )}
        {pantalla === 'P3' && (
          <SeleccionExpediente
            mundo={mundo}
            onInvestigar={(id) => irA('P4', { casoId: id })}
            onBugDex={() => irA('P7')}
            onVolver={() => irA('P2')}
          />
        )}
        {pantalla === 'P4' && (
          <Presentacion casoId={casoId} onComenzar={() => irA('P5')} onVolver={() => irA('P3')} />
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
        {pantalla === 'P7' && (
          <BugDex casoResaltado={casoId} onVolver={() => irA('P3')} onInicio={() => irA('P1')} />
        )}
      </main>

      {capa === 'O3' && <Configuracion onCerrar={cerrarCapa} />}
    </div>
  )
}
