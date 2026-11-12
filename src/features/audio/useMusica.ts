import { useEffect, useRef } from 'react'
import { useConfiguracion } from '@/features/configuracion'
import { rutaPublica } from '@/shared'
import { pistaDePantalla } from './pistas'
import { crearReproductor, type Reproductor } from './reproductor'

/** Hace sonar la pista de la pantalla actual mientras la música esté activada (ajuste guardado). */
export function useMusica(pantalla: string) {
  const activa = useConfiguracion((s) => s.musica)
  const reproductor = useRef<Reproductor | null>(null)

  useEffect(() => {
    reproductor.current = crearReproductor({ resolverRuta: rutaPublica })
    return () => {
      reproductor.current?.liberar()
      reproductor.current = null
    }
  }, [])

  const pista = pistaDePantalla(pantalla)
  useEffect(() => {
    reproductor.current?.ajustar(pista, activa)
  }, [pista, activa])
}
