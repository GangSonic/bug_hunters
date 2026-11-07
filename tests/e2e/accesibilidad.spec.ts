import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// RNF02: sin violaciones graves ni críticas de WCAG 2.2 AA en las pantallas principales.
async function sinViolacionesGraves(page: import('@playwright/test').Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  const graves = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
  expect(graves.map((v) => `${v.id}: ${v.help}`)).toEqual([])
}

test('P1, P2, P3, P4, P5 y P7 pasan la revisión de axe', async ({ page }) => {
  await page.goto('/')
  await sinViolacionesGraves(page)
  await page.getByRole('button', { name: 'Jugar' }).click()
  await sinViolacionesGraves(page)
  await page.getByRole('button', { name: 'Elegir Zona de Control' }).click()
  await sinViolacionesGraves(page)
  await page.getByRole('button', { name: 'Investigar el caso de Loopi' }).click()
  await sinViolacionesGraves(page)
  await page.getByRole('button', { name: 'Comenzar' }).click()
  await sinViolacionesGraves(page)
  await page.getByRole('button', { name: 'Volver' }).click()
  await page.getByRole('button', { name: 'BugDex' }).click()
  await sinViolacionesGraves(page)
})
