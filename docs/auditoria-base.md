# Auditoría de la base frente al Backlog v2

Fecha: 7 de noviembre de 2026. Compara el código de esta base con las historias, tareas y requisitos no funcionales del documento «Backlog de Bug Hunters — versión web».

**Resumen:** el flujo P1 → P7 funciona con los cuatro casos. De 18 historias, 7 están completas, 8 están parciales y 3 siguen pendientes (HU15, HU16 y HU18, todas P2). Lo que falta se concentra en las escenas propias de Confusín y Nullito, la animación de recuperación, el tutorial completo y las capas O1, O2 y O4.

Estado: **Completa** cumple todos sus criterios; **Parcial** cumple algunos; **Pendiente** no está hecha.

## Historias

| ID   | Historia                             | Estado    | Qué falta                                                                                                            |
| ---- | ------------------------------------ | --------- | -------------------------------------------------------------------------------------------------------------------- |
| HU01 | Navegar por el laboratorio           | Completa  | Las capas O1, O2 y O4 pertenecen a HU15 y HU16                                                                       |
| HU02 | Entrar y salir del juego             | Parcial   | CA02.4: Salir muestra la despedida sin pedir confirmación                                                            |
| HU03 | Elegir mundo y expediente            | Completa  | —                                                                                                                    |
| HU04 | Observar la anomalía                 | Parcial   | CA04.3: el tutorial solo tiene el paso 1 de 4                                                                        |
| HU05 | Investigar y registrar una hipótesis | Completa  | —                                                                                                                    |
| HU06 | Reparar la regla y probar            | Completa  | Las flechas del teclado no cambian de opción (ver RNF02)                                                             |
| HU07 | Pedir pistas graduales               | Parcial   | CA07.3: al llegar a 3 el botón se deshabilita, pero no muestra el mensaje «no hay más pistas»                        |
| HU08 | Entender el concepto al resolver     | Parcial   | CA08.1: falta la animación de recuperación (E6); Continuar va directo a P6                                           |
| HU09 | Resolver el caso de Loopi            | Parcial   | CA09.4: el sprite trae «3/5» dibujado y Loopi tapa los paquetes 1 y 2                                                |
| HU10 | Resolver el caso de Confusín         | Parcial   | CA10.4: usa la banda genérica; falta la bifurcación Norte y Sur                                                      |
| HU11 | Resolver el caso de Nullito          | Parcial   | Usa la banda genérica; falta la escena de cafetería (D-03)                                                           |
| HU12 | Resolver el caso de Cambión          | Completa  | El sprite trae «0» dibujado en la pantalla del pecho                                                                 |
| HU13 | Conservar mi progreso                | Parcial   | CA13.3: con datos dañados arranca limpio, pero no lo informa                                                         |
| HU14 | Consultar la BugDex                  | Completa  | —                                                                                                                    |
| HU15 | Pausar y confirmar antes de salir    | Pendiente | La máquina de estados ya marca `edicionSinProbar` para O4                                                            |
| HU16 | Consultar ayuda y tutorial           | Pendiente | Falta el botón Ayuda en la zona G y la capa O2                                                                       |
| HU17 | Ajustar la configuración             | Completa  | CA17.1 desde O1 llegará con HU15                                                                                     |
| HU18 | Registrar la sesión del piloto       | Pendiente | Los intentos ya se registran en memoria (`EstadoMision.intentos`); falta guardarlos por código Pxx y exportar el CSV |

## Tareas técnicas

| ID      | Tarea                                                            | Estado    | Nota                                                                                                                                                       |
| ------- | ---------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T01     | Repositorio con estructura por features                          | Completa  | Se usa **oxlint** (el linter que trae hoy la plantilla de Vite) en lugar de ESLint; la regla `no-restricted-imports` funciona igual. Actualizar el backlog |
| T02     | CI, protección de main y CODEOWNERS                              | Parcial   | El flujo de CI está listo. Falta activar la protección de `main` en GitHub y poner los usuarios en CODEOWNERS                                              |
| T03     | Publicación en GitHub Pages                                      | Parcial   | El flujo está listo; falta activarlo en Settings → Pages                                                                                                   |
| T04     | `shared/`: tokens, componentes y fuentes locales                 | Completa  | —                                                                                                                                                          |
| T05     | Sprites optimizados                                              | Parcial   | Faltan versiones sin contador dibujado (Loopi «3/5», Cambión «0»)                                                                                          |
| T06     | README y guía de contribución                                    | Completa  | —                                                                                                                                                          |
| T07     | Playwright y axe-core en CI                                      | Completa  | 4 recorridos: Loopi completo, recarga, capa de Configuración y accesibilidad                                                                               |
| T08–T11 | Revisión formativa, instrumentos, capítulos y versión del piloto | Pendiente | No son de código o dependen de historias pendientes                                                                                                        |

## Requisitos no funcionales

| ID                                | Estado   | Evidencia o pendiente                                                                                                                                        |
| --------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| RNF01 Usabilidad                  | Parcial  | Zonas A–G iguales en los 4 casos. A 1366 × 768 la P5 mide 814 px de alto y obliga a desplazar; hay que compactarla                                           |
| RNF02 Accesibilidad               | Parcial  | axe-core sin violaciones graves en P1–P5 y P7. Faltan: flechas en los grupos de opciones, foco atrapado dentro de las capas y revisar el tema oscuro con axe |
| RNF03 Movimiento                  | Completa | Respeta `prefers-reduced-motion` y el interruptor de animaciones                                                                                             |
| RNF04 Rendimiento                 | Parcial  | El build pesa 860 KB (meta: 2 MB). Falta medir la carga en una computadora de la facultad                                                                    |
| RNF05 Compatibilidad              | Parcial  | Probado solo en Chrome; falta agregar Firefox y Edge a Playwright                                                                                            |
| RNF06 Persistencia                | Completa | Almacenamiento seguro y migración de versión con pruebas                                                                                                     |
| RNF07 Privacidad                  | Completa | No se pide ni se guarda ningún dato personal                                                                                                                 |
| RNF08 Independencia               | Completa | Fuentes y sprites locales; no hay peticiones a terceros                                                                                                      |
| RNF09 Mantenibilidad              | Parcial  | TypeScript estricto y regla de imports activas; faltan los usuarios en CODEOWNERS                                                                            |
| RNF10 Escalabilidad del contenido | Completa | Un caso nuevo = una carpeta y una línea en `registro.ts`                                                                                                     |
| RNF11 Calidad                     | Completa | 41 pruebas unitarias, 100 % de líneas en la lógica, cada opción de cada caso probada                                                                         |
| RNF12 Lenguaje                    | Completa | Mensajes cortos; el término formal aparece solo en P6 y en la BugDex                                                                                         |

## Cambios de diseño que conviene revisar

- **Verde de los botones principales:** pasó de `#49B37E` a `#24784F`. Con el verde original, el texto blanco tenía un contraste de 2.6:1 y WCAG pide 4.5:1. El nuevo tiene 5.4:1.
- **Desenlace calculado, no escrito:** en la primera versión cada opción traía su resultado fijo (`bien: 2`). Ahora lo calcula la simulación de cada caso, y `esCorrecto` decide si se resolvió.
- **Opciones nuevas en Nullito y Cambión:** se alinearon con el Backlog v2. Nullito: «si existe: preparar» queda incompleto (3 de 4) porque ignora el pedido ausente. Cambión: `total ← total + 2` sube pero duplica la cuenta.
- **P2 y P3 separadas,** como en el Capítulo IV (D-01). La primera versión las tenía en una sola pantalla.
- **Configuración como capa (O3),** no como pantalla completa.
