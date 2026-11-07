# Auditoría de la base frente al Backlog v2

Actualizada el 7 de noviembre de 2026, después de igualar estilos, estructura y animaciones a la primera versión (`bughunters.html`).

**Resumen:** el flujo completo funciona con los cuatro casos y se ve como la primera versión. De 18 historias, 7 están completas, 9 parciales y 2 pendientes (HU15 y HU18, ambas P2). Igualar el HTML cambió varios criterios del backlog; la sección «Diferencias con el backlog» los lista para que el equipo decida qué se queda.

Estado: **Completa** cumple todos sus criterios; **Parcial** cumple algunos; **Pendiente** no está hecha.

## Historias

| ID   | Historia                             | Estado    | Qué falta o cambió                                                                                         |
| ---- | ------------------------------------ | --------- | ---------------------------------------------------------------------------------------------------------- |
| HU01 | Navegar por el laboratorio           | Completa  | La tabla de enlaces ya no tiene P2 (D-01)                                                                  |
| HU02 | Entrar y salir del juego             | Completa  | Salir pide confirmación y muestra la despedida, como en el HTML. Jugar ya no recibe el foco al cargar      |
| HU03 | Elegir mundo y expediente            | Completa  | Mundos y casos en una sola pantalla, como en el HTML                                                       |
| HU04 | Observar la anomalía                 | Parcial   | El tutorial solo tiene el paso 1 de 4. P4 ya no muestra saludo ni misión aparte (CA04.1)                   |
| HU05 | Investigar y registrar una hipótesis | Completa  | Se quitó «Ver contador»; los contadores siempre están a la vista                                           |
| HU06 | Reparar la regla y probar            | Completa  | Como en el HTML, se puede elegir la corrección antes de la hipótesis; Probar avisa si falta algo           |
| HU07 | Pedir pistas graduales               | Parcial   | Las pistas salen en un aviso flotante de 3 s, como en el HTML; CA07.2 pide que queden visibles en el panel |
| HU08 | Entender el concepto al resolver     | Parcial   | Falta la animación de recuperación (E6). P6 no muestra «Progreso guardado» (CA08.3)                        |
| HU09 | Resolver el caso de Loopi            | Parcial   | El sprite trae «3/5» dibujado                                                                              |
| HU10 | Resolver el caso de Confusín         | Parcial   | Usa la banda genérica; falta la bifurcación Norte y Sur (CA10.4)                                           |
| HU11 | Resolver el caso de Nullito          | Parcial   | Usa la banda genérica; falta la escena de cafetería (D-03)                                                 |
| HU12 | Resolver el caso de Cambión          | Completa  | El sprite trae «0» dibujado                                                                                |
| HU13 | Conservar mi progreso                | Parcial   | Con datos dañados arranca limpio, pero no lo informa (CA13.3)                                              |
| HU14 | Consultar la BugDex                  | Completa  | —                                                                                                          |
| HU15 | Pausar y confirmar antes de salir    | Pendiente | La máquina de estados ya marca `edicionSinProbar` para O4                                                  |
| HU16 | Consultar ayuda y tutorial           | Parcial   | El botón Ayuda de P5 muestra un aviso, como en el HTML; falta la capa O2                                   |
| HU17 | Ajustar la configuración             | Parcial   | Configuración es pantalla completa, como en el HTML. Reiniciar progreso no pide confirmación (CA17.4)      |
| HU18 | Registrar la sesión del piloto       | Pendiente | Los intentos ya se registran en `EstadoMision.intentos`; falta guardarlos por código Pxx y exportar el CSV |

## Diferencias con el backlog por igualar la primera versión

Hay que decidir en equipo si cada punto se queda como en el HTML (y se actualiza el backlog) o se ajusta al backlog.

| Tema                | Ahora (como el HTML)                               | Backlog v2                               | Afecta                      |
| ------------------- | -------------------------------------------------- | ---------------------------------------- | --------------------------- |
| Selección           | Una sola pantalla con los dos mundos               | P2 y P3 separadas (D-01)                 | Cap. IV Tabla 14 y Figura 7 |
| Paleta              | Colores originales                                 | WCAG AA: contraste de 4.5:1              | RNF02                       |
| Pistas              | Aviso flotante de 3 s                              | Visibles en el panel                     | CA07.2                      |
| Concepto            | Aparece en la barra de resultado al resolver       | Solo en P6 y en la BugDex                | RNF12                       |
| Estado de la zona F | Detenido (gris), En ejecución, Resuelto, Con error | Detenido en rojo para un intento fallido | Cap. IV Tabla 23            |
| Configuración       | Pantalla completa; reiniciar sin confirmación      | Capa O3; reiniciar con confirmación      | CA13.4, CA17.4              |
| Foco inicial        | Jugar no recibe el foco al cargar                  | Jugar recibe el foco                     | CA02.1                      |
| Botón Probar        | Siempre dice «Probar»                              | Cambia a «Probar otra vez»               | CA06.3                      |

**Sobre el contraste:** con la paleta original, el texto blanco sobre el verde de los botones (`#49B37E`) tiene 2.6:1, y el ámbar y el morado sobre sus fondos claros también quedan por debajo de 4.5:1. La prueba de accesibilidad con axe sigue activa, pero sin la regla de contraste hasta que el equipo decida. Si se quiere cumplir, basta con oscurecer `--cta`, `--amber`, `--purple` y `--ok` en `shared/tokens/tokens.css`.

## Tareas técnicas

| ID      | Tarea                                                            | Estado    | Nota                                                                                                               |
| ------- | ---------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------ |
| T01     | Repositorio con estructura por features                          | Completa  | Se usa oxlint (el linter que trae hoy la plantilla de Vite) en lugar de ESLint; la regla de imports funciona igual |
| T02     | CI, protección de main y CODEOWNERS                              | Parcial   | Falta activar la protección de `main` y poner los usuarios en CODEOWNERS                                           |
| T03     | Publicación en GitHub Pages                                      | Parcial   | Falta activar Pages en Settings → Pages → Source: GitHub Actions                                                   |
| T04     | `shared/`: tokens, componentes y fuentes locales                 | Completa  | Tokens copiados del HTML; fuentes Baloo 2 y Nunito locales                                                         |
| T05     | Sprites optimizados                                              | Parcial   | Faltan versiones sin contador dibujado                                                                             |
| T06     | README y guía de contribución                                    | Completa  | —                                                                                                                  |
| T07     | Playwright y axe-core en CI                                      | Completa  | 5 recorridos: Loopi completo, recarga, Configuración, Salir y accesibilidad                                        |
| T08–T11 | Revisión formativa, instrumentos, capítulos y versión del piloto | Pendiente | —                                                                                                                  |

## Requisitos no funcionales

| ID                                | Estado   | Evidencia o pendiente                                                                                                  |
| --------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| RNF01 Usabilidad                  | Parcial  | Ancho de 720 px como el HTML. A 1366 × 768 la P5 obliga a desplazar                                                    |
| RNF02 Accesibilidad               | Parcial  | axe sin violaciones graves salvo contraste (ver arriba). Faltan flechas en grupos de opciones y foco atrapado en capas |
| RNF03 Movimiento                  | Completa | Interruptor de animaciones y `prefers-reduced-motion` en la criatura                                                   |
| RNF04 Rendimiento                 | Parcial  | Build de unos 860 KB (meta: 2 MB); falta medir la carga en la facultad                                                 |
| RNF05 Compatibilidad              | Parcial  | Probado solo en Chrome                                                                                                 |
| RNF06 Persistencia                | Completa | Almacenamiento seguro y migración de versión con pruebas                                                               |
| RNF07 Privacidad                  | Completa | No se pide ni se guarda ningún dato personal                                                                           |
| RNF08 Independencia               | Completa | Fuentes y sprites locales; ya no se usa Google Fonts                                                                   |
| RNF09 Mantenibilidad              | Parcial  | Faltan los usuarios en CODEOWNERS                                                                                      |
| RNF10 Escalabilidad del contenido | Completa | Un caso nuevo = una carpeta y una línea en `registro.ts`                                                               |
| RNF11 Calidad                     | Completa | 42 pruebas unitarias; cada opción de cada caso probada                                                                 |
| RNF12 Lenguaje                    | Parcial  | El concepto aparece en la barra de resultado antes de P6                                                               |

## Lo que se conserva de la arquitectura nueva

- El desenlace de cada opción lo calcula la simulación del caso, no un número fijo como en el HTML (`bien: 2`).
- E1: al entrar a la misión, la anomalía se ejecuta sola y una barra con el estilo del HTML guía el primer paso.
- La hipótesis que no coincide con la causa se señala en la barra de resultado.
- Las opciones de Nullito y Cambión siguen el Backlog v2.
