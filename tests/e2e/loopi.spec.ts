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
}

test('Loopi de principio a fin: intento incompleto, solución, explicación y ficha', async ({
  page,
}) => {
  await abrirSinAnimaciones(page)
  await irALoopi(page)

  // E1: la anomalía se ejecuta sola.
  await expect(page.getByText('Paso 1 de 4: observa a Loopi')).toBeVisible()
  await expect(page.getByRole('status').filter({ hasText: 'Detenido' })).toBeVisible()
  await page.getByRole('button', { name: 'Siguiente' }).click()

  // CA05.2: sin hipótesis, Probar avisa y no ejecuta.
  await page.getByRole('button', { name: 'Entregados < 2' }).click()
  await page.getByRole('button', { name: 'Probar' }).click()
  await expect(page.getByText('Primero registra una hipótesis (paso 1).')).toBeVisible()

  await page.getByLabel(/Hipótesis/).selectOption({ label: 'La condición del ciclo es incorrecta' })

  // Intento incompleto (E5b).
  await page.getByRole('button', { name: 'Probar' }).click()
  await expect(
    page.getByText('El reparto se detuvo, pero quedan 2 paquetes pendientes'),
  ).toBeVisible()

  // Pista graduada: queda visible bajo los botones.
  await page.getByRole('button', { name: 'Pista' }).click()
  await expect(page.getByRole('list', { name: 'Pistas' })).toContainText('Pista 1 de 3:')

  // Solución (E5a).
  await page.getByRole('button', { name: 'Hay paquetes pendientes' }).click()
  await page.getByRole('button', { name: 'Probar' }).click()
  await expect(page.getByText('¡Reparto completo! 4 de 4')).toBeVisible()
  await page.getByRole('button', { name: 'Continuar ›' }).click()

  // P6: explicación.
  await expect(page.getByRole('heading', { name: '¡Caso resuelto!' })).toBeVisible()
  await expect(page.getByText('Concepto aprendido:')).toBeVisible()

  // P7: la ficha de Loopi está desbloqueada; las demás no.
  await page.getByRole('button', { name: 'Ver ficha en BugDex' }).click()
  await expect(page.getByText('Fichas de los casos resueltos · 1 de 4')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Loopi' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '? ? ?' })).toHaveCount(3)
})

test('CA13.2 el progreso se conserva al recargar', async ({ page }) => {
  await abrirSinAnimaciones(page)
  await page.evaluate(() =>
    localStorage.setItem(
      'bug-hunters:progreso',
      JSON.stringify({
        state: { resueltos: { loopi: { fecha: '2026-11-07' } }, tutorialVisto: true },
        version: 1,
      }),
    ),
  )
  await page.reload()
  await expect(page.getByText('1 de 4 casos resueltos')).toBeVisible()
})

test('Configuración se abre y vuelve al inicio', async ({ page }) => {
  await abrirSinAnimaciones(page)
  await page.getByRole('button', { name: 'Configuración' }).click()
  await expect(page.getByRole('heading', { name: 'Configuración' })).toBeVisible()
  await page.getByRole('button', { name: 'Oscuro' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-tema', 'oscuro')
  await page.getByRole('button', { name: 'Inicio' }).click()
  await expect(page.getByRole('button', { name: 'Jugar' })).toBeVisible()
})

test('Salir pide confirmación y muestra la despedida', async ({ page }) => {
  await abrirSinAnimaciones(page)
  await page.getByRole('button', { name: 'Salir' }).click()
  await expect(page.getByRole('heading', { name: '¿Salir del laboratorio?' })).toBeVisible()
  await page.getByRole('button', { name: 'Salir' }).click()
  await expect(page.getByRole('heading', { name: '¡Gracias por jugar!' })).toBeVisible()
})
