# Cómo trabajar en Bug Hunters

## Flujo

1. Toma una historia o tarea de Linear (por ejemplo, HU06 o T02).
2. Actualiza `main` y crea tu rama con su ID:
   ```bash
   git switch main
   git pull
   git switch -c hu-06-reparar-y-probar
   ```
3. Trabaja dentro de la carpeta de tu feature. Haz commits pequeños y sube tu rama al menos una vez al día.
4. Antes de abrir el PR corre `npm run check` y, si cambiaste pantallas, `npm run test:e2e`.
5. Abre un pull request a `main` con el ID en el título: `HU06 Reparar la regla y probar`. Llena la plantilla.
6. Otra integrante revisa y aprueba. GitHub Actions debe estar en verde.
7. Al integrar, GitHub Pages publica la nueva versión sola.

## Commits

Mensajes cortos en español, en presente, con el ID al inicio:

```
HU06 agrega el desenlace incompleto a la barra de resultado
T02 configura la protección de main
```

## Definición de terminado

- El código está en `main` mediante un PR aprobado por otra integrante.
- Lint, tipos y pruebas pasan en GitHub Actions.
- La lógica nueva tiene pruebas unitarias.
- Se cumplen los criterios de aceptación en la versión publicada.
- Funciona solo con teclado y el foco se ve.
- Ningún estado depende solo del color.
- El ticket de Linear se cierra con evidencia: captura, video corto o enlace.

## Evitar conflictos

- Cada carpeta tiene responsable en `.github/CODEOWNERS`. Si necesitas cambiar otra feature, avísale y pide su revisión.
- Si tu cambio necesita algo nuevo de otra feature, pídelo como export de su `index.ts` en lugar de importar sus archivos internos.
- Haz `git pull` de `main` en tu rama con frecuencia para no acumular diferencias.
