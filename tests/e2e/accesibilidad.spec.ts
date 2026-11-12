import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

// RNF02: sin violaciones graves ni críticas de WCAG 2.2 AA, contraste incluido,
// en las pantallas y capas principales y en los dos temas (claro y oscuro).
async function sinViolacionesGraves(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  const graves = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
  // El mensaje incluye los elementos afectados para que la falla se pueda ubicar sin depurar.
  expect(
    graves.map((v) => `${v.id}: ${v.help} → ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`),
  ).toEqual([])
}

async function abrir(page: Page, tema: 'claro' | 'oscuro') {
  // Animaciones apagadas: los recorridos no dependen de tiempos.
  await page.addInitScript((t) => {
    localStorage.setItem(
      'bug-hunters:configuracion',
      JSON.stringify({ state: { tema: t, animaciones: false }, version: 1 }),
    )
  }, tema)
  await page.goto('/')
  // Sin transiciones: axe mide el color calculado en ese instante, y a mitad de una
  // transición (0.15 s en los botones) daría un tono intermedio que nadie ve en reposo.
  await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; }' })
}

for (const tema of ['claro', 'oscuro'] as const) {
  test.describe(`tema ${tema}`, () => {
    test('P1, P3, P4 y P7 pasan la revisión de axe', async ({ page }) => {
      await abrir(page, tema)
      await sinViolacionesGraves(page)
      await page.getByRole('button', { name: 'Jugar' }).click()
      await sinViolacionesGraves(page)
      await page.getByRole('button', { name: 'Investigar el caso de Loopi' }).click()
      await sinViolacionesGraves(page)
      await page.getByRole('button', { name: 'Volver' }).click()
      await page.getByRole('button', { name: 'BugDex' }).click()
      await sinViolacionesGraves(page)
    })

    test('Configuración y sus confirmaciones pasan la revisión de axe', async ({ page }) => {
      await abrir(page, tema)
      await page.getByRole('button', { name: 'Configuración' }).click()
      await sinViolacionesGraves(page)
      await page.getByRole('button', { name: 'Reiniciar' }).click()
      await sinViolacionesGraves(page)
    })

    test('P5, sus estados, P6 y las capas O1 y O4 pasan la revisión de axe', async ({ page }) => {
      await abrir(page, tema)
      await page.getByRole('button', { name: 'Jugar' }).click()
      await page.getByRole('button', { name: 'Investigar el caso de Loopi' }).click()
      await page.getByRole('button', { name: 'Comenzar' }).click()
      await sinViolacionesGraves(page) // P5, observación
      await page.getByRole('button', { name: 'Siguiente' }).click()
      await sinViolacionesGraves(page) // P5, investigación

      // Intento incorrecto con una pista a la vista.
      await page.getByRole('button', { name: 'Entregados < 2' }).click()
      await page
        .getByLabel(/Hipótesis/)
        .selectOption({ label: 'La condición del ciclo es incorrecta' })
      await page.getByRole('button', { name: 'Probar' }).click()
      await page.getByRole('button', { name: 'Pista' }).click()
      await sinViolacionesGraves(page)

      // Capa O1: pausa.
      await page.keyboard.press('Escape')
      await expect(page.getByRole('dialog', { name: 'Misión en pausa' })).toBeVisible()
      await sinViolacionesGraves(page)
      await page.getByRole('button', { name: 'Reanudar' }).click()

      // Capa O4: confirmación al salir con una corrección sin probar.
      await page.getByRole('button', { name: 'Hay paquetes pendientes' }).click()
      await page.getByRole('button', { name: 'Volver' }).click()
      await expect(page.getByRole('dialog', { name: '¿Salir sin probar?' })).toBeVisible()
      await sinViolacionesGraves(page)
      await page.getByRole('button', { name: 'Seguir en la misión' }).click()

      // Resuelto y resultado (P6).
      await page.getByRole('button', { name: 'Probar' }).click()
      await sinViolacionesGraves(page)
      await page.getByRole('button', { name: 'Continuar ›' }).click()
      await sinViolacionesGraves(page)
    })
  })
}
