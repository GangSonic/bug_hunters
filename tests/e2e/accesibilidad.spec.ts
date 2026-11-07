import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// RNF02: sin violaciones graves ni críticas de WCAG 2.2 AA en las pantallas principales.
// El contraste se excluye por ahora: la paleta es la de la primera versión y su ajuste
// está pendiente de decisión del equipo (ver docs/auditoria-base.md).
async function sinViolacionesGraves(page: import('@playwright/test').Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .disableRules(['color-contrast'])
    .analyze()
  const graves = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
  expect(graves.map((v) => `${v.id}: ${v.help}`)).toEqual([])
}

test('P1, P3, P4, P5 y P7 pasan la revisión de axe', async ({ page }) => {
  await page.goto('/')
  await sinViolacionesGraves(page)
  await page.getByRole('button', { name: 'Jugar' }).click()
  await sinViolacionesGraves(page)
  await page.getByRole('button', { name: 'Investigar el caso de Loopi' }).click()
  await sinViolacionesGraves(page)
  await page.getByRole('button', { name: 'Comenzar' }).click()
  await sinViolacionesGraves(page)
  await page.getByRole('button', { name: 'Volver' }).click()
  await page.getByRole('button', { name: 'BugDex' }).click()
  await sinViolacionesGraves(page)
})
