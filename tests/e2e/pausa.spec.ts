import { expect, test, type Page } from '@playwright/test'

// Animaciones apagadas: los recorridos no dependen de tiempos.
async function abrirSinAnimaciones(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem(
      'bug-hunters:configuracion',
      JSON.stringify({ state: { tema: 'claro', animaciones: false }, version: 1 }),
    )
  })
  await page.goto('/')
}

async function irALoopi(page: Page) {
  await page.getByRole('button', { name: 'Jugar' }).click()
  await page.getByRole('button', { name: 'Investigar el caso de Loopi' }).click()
  await page.getByRole('button', { name: 'Comenzar' }).click()
  await page.getByRole('button', { name: 'Siguiente' }).click()
}

test('HU15: Esc abre la pausa y Reanudar vuelve a la misión', async ({ page }) => {
  await abrirSinAnimaciones(page)
  await irALoopi(page)

  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'Misión en pausa' })).toBeVisible()
  await page.getByRole('button', { name: 'Reanudar' }).click()
  await expect(page.getByRole('dialog', { name: 'Misión en pausa' })).toBeHidden()
  await expect(page.getByRole('button', { name: 'Probar' })).toBeVisible()
})

test('HU15: salir sin probar pide confirmación; cancelar se queda, confirmar sale', async ({
  page,
}) => {
  await abrirSinAnimaciones(page)
  await irALoopi(page)

  // Elegir una corrección sin probarla deja una edición pendiente (edicionSinProbar).
  await page.getByRole('button', { name: 'Hay paquetes pendientes' }).click()

  // Volver pide confirmación (O4).
  await page.getByRole('button', { name: 'Volver' }).click()
  await expect(page.getByRole('dialog', { name: '¿Salir sin probar?' })).toBeVisible()

  // Cancelar mantiene la misión.
  await page.getByRole('button', { name: 'Seguir en la misión' }).click()
  await expect(page.getByRole('dialog', { name: '¿Salir sin probar?' })).toBeHidden()
  await expect(page.getByRole('button', { name: 'Probar' })).toBeVisible()

  // Confirmar sí abandona y vuelve al mapa de casos (P3).
  await page.getByRole('button', { name: 'Volver' }).click()
  await page.getByRole('button', { name: 'Salir de todos modos' }).click()
  await expect(page.getByRole('button', { name: 'Investigar el caso de Loopi' })).toBeVisible()
})

test('HU15: sin edición pendiente, Volver sale directo sin confirmación', async ({ page }) => {
  await abrirSinAnimaciones(page)
  await irALoopi(page)

  await page.getByRole('button', { name: 'Volver' }).click()
  await expect(page.getByRole('dialog', { name: '¿Salir sin probar?' })).toBeHidden()
  await expect(page.getByRole('button', { name: 'Investigar el caso de Loopi' })).toBeVisible()
})
