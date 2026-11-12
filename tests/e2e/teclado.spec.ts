import { expect, test, type Page } from '@playwright/test'

// RNF02 / WCAG 2.1.1 (todo es operable con teclado) y 2.4.3 (orden del foco).
async function irALoopi(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem(
      'bug-hunters:configuracion',
      JSON.stringify({ state: { tema: 'claro', animaciones: false }, version: 1 }),
    )
  })
  await page.goto('/')
  await page.getByRole('button', { name: 'Jugar' }).click()
  await page.getByRole('button', { name: 'Investigar el caso de Loopi' }).click()
  await page.getByRole('button', { name: 'Comenzar' }).click()
  await page.getByRole('button', { name: 'Siguiente' }).click()
}

/** El foco está en el diálogo o en alguno de sus controles. */
const focoEnElDialogo = (page: Page) =>
  expect(page.locator('[role="dialog"]:focus, [role="dialog"] :focus')).toHaveCount(1)

test('con la pausa abierta, Tab y Mayús+Tab no sacan el foco del diálogo', async ({ page }) => {
  await irALoopi(page)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'Misión en pausa' })).toBeFocused()

  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab')
    await focoEnElDialogo(page)
  }
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Shift+Tab')
    await focoEnElDialogo(page)
  }
})

test('Tab no llega a «Probar» detrás de la pausa', async ({ page }) => {
  await irALoopi(page)
  await page.getByLabel(/Hipótesis/).selectOption({ label: 'La condición del ciclo es incorrecta' })
  await page.getByRole('button', { name: 'Hay paquetes pendientes' }).click()
  await page.keyboard.press('Escape')

  // Sin el foco atrapado, Tab recorría la misión de fondo y con Intro ejecutaba la prueba.
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: /^Probar/ })).not.toBeFocused()
  }
})

test('al cerrar la pausa, el foco vuelve al control que lo tenía', async ({ page }) => {
  await irALoopi(page)
  await page.getByRole('button', { name: 'Hay paquetes pendientes' }).focus()
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Reanudar' }).click()
  await expect(page.getByRole('button', { name: 'Hay paquetes pendientes' })).toBeFocused()
})

test('las flechas mueven el foco entre las condiciones y Intro elige una', async ({ page }) => {
  await irALoopi(page)
  const verdadero = page.getByRole('button', { name: 'Verdadero' })
  const pendientes = page.getByRole('button', { name: 'Hay paquetes pendientes' })
  const menorQueDos = page.getByRole('button', { name: 'Entregados < 2' })

  await verdadero.focus()
  await page.keyboard.press('ArrowRight')
  await expect(pendientes).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(menorQueDos).toBeFocused()
  await page.keyboard.press('ArrowLeft')
  await expect(pendientes).toBeFocused()

  await expect(pendientes).toHaveAttribute('aria-pressed', 'false')
  await page.keyboard.press('Enter')
  await expect(pendientes).toHaveAttribute('aria-pressed', 'true')
})
