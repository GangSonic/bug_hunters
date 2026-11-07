# Bug Hunters: Laboratorio de Bugs

Juego educativo 2D para aprender a diagnosticar y corregir errores de programación. El jugador observa una anomalía, formula una hipótesis, repara una regla y comprueba el resultado en cuatro expedientes repartidos en dos mundos.

Proyecto de la materia Diseño de la Interacción, FCC BUAP, agosto–diciembre de 2026.

## Requisitos

- Node.js 20.19 o superior (recomendado: 22 LTS)
- Git

## Empezar

```bash
npm install
npm run dev
```

Abre la dirección que muestra la terminal (normalmente http://localhost:5173).

## Comandos

| Comando                 | Qué hace                                                   |
| ----------------------- | ---------------------------------------------------------- |
| `npm run dev`           | Servidor local con recarga instantánea                     |
| `npm run build`         | Revisa tipos y genera el build estático en `dist/`         |
| `npm run preview`       | Sirve el build de `dist/` para probarlo                    |
| `npm run lint`          | Revisa el código con oxlint, incluida la regla de imports  |
| `npm run typecheck`     | Revisa los tipos de TypeScript                             |
| `npm run format`        | Da formato con Prettier                                    |
| `npm test`              | Pruebas unitarias con Vitest                               |
| `npm run test:coverage` | Pruebas unitarias con cobertura (mínimo 80 % en la lógica) |
| `npm run test:e2e`      | Recorridos E2E y accesibilidad con Playwright              |
| `npm run check`         | Lint + tipos + pruebas: córrelo antes de abrir un PR       |

La primera vez que corras las pruebas E2E instala el navegador con `npx playwright install chromium`. Si ya tienes Chrome, puedes usarlo: `PW_CHANNEL=chrome npm run test:e2e`.

## Estructura

El código se organiza por funcionalidades (Backlog v2, sección 4). Cada feature es una carpeta con su interfaz, su lógica, sus pruebas y una responsable.

```
src/
├─ app/            # shell: pantallas, capas y enlaces de la Tabla 14
├─ shared/         # componentes base, tokens de diseño, hooks y utilidades
└─ features/
   ├─ inicio/          # P1 y despedida
   ├─ seleccion/       # P3: mundos y casos en una sola pantalla
   ├─ mision/          # P4, P5 y la máquina de estados E1–E6
   ├─ expedientes/     # contrato, registro y los 4 casos
   ├─ resultado/       # P6
   ├─ bugdex/          # P7
   ├─ progreso/        # avance guardado en el navegador
   ├─ configuracion/   # O3
   ├─ ayuda/           # O2 (pendiente)
   └─ piloto/          # modo piloto (pendiente)
```

Reglas que revisa el linter:

1. Otra feature solo se importa por su `index.ts`: `import { useProgreso } from '@/features/progreso'`. Dentro de tu propia feature usa rutas relativas.
2. `shared/` no importa nada de `features/` ni de `app/`.
3. Las features no importan de `app/`: reciben la navegación como props (`onVolver`, `onJugar`…).

## Agregar un expediente

1. Crea `src/features/expedientes/<caso>/` con `datos.ts`, `simular.ts`, `Escena.tsx` y `simular.test.ts`, copiando la forma de `loopi/`.
2. Cumple el contrato de `contrato.ts`: 3 opciones (la anomalía, una parcial y una correcta) y `esCorrecto` con el objetivo de la misión.
3. Agrégalo a la lista de `registro.ts`. El motor de misión no cambia.

## Publicación

Cada integración a `main` publica el juego en GitHub Pages (`.github/workflows/pages.yml`). La primera vez hay que activarlo en **Settings → Pages → Source: GitHub Actions**.

## Documentación

- Backlog, requisitos y especificaciones: documento «Backlog de Bug Hunters — versión web».
- Estado de la base frente al backlog: [docs/auditoria-base.md](docs/auditoria-base.md).
- Cómo trabajar en equipo: [CONTRIBUTING.md](CONTRIBUTING.md).
