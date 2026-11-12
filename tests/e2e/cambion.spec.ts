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

async function irACambion(page: Page) {
  await page.getByRole('button', { name: 'Jugar' }).click()
  await page.getByRole('button', { name: 'Investigar el caso de Cambión' }).click()
  await page.getByRole('button', { name: 'Comenzar' }).click()
}

test('Cambión de principio a fin: intento parcial, solución, explicación y ficha', async ({
  page,
}) => {
  await abrirSinAnimaciones(page)
  await irACambion(page)

  // E1: la anomalía se ejecuta sola y se muestra el tutorial de la primera misión.
  await expect(page.getByText(/Paso 1 de 4/)).toBeVisible()
  await page.getByRole('button', { name: 'Siguiente' }).click()

  // CA05.2: sin hipótesis, Probar avisa y no ejecuta.
  await page.getByRole('button', { name: 'total ← total + 2', exact: true }).click()
  await page.getByRole('button', { name: 'Probar' }).click()
  await expect(page.getByText('Primero registra una hipótesis (paso 1).')).toBeVisible()

  await page
    .getByLabel(/Hipótesis/)
    .selectOption({ label: 'El contador se reinicia en cada vuelta' })

  // CA12.2 intento parcial: el total sube, pero duplica la cuenta y termina en 8.
  await page.getByRole('button', { name: 'Probar' }).click()
  await expect(page.getByText('El total sube, pero se duplica: 8')).toBeVisible()

  // Pista graduada: queda visible en el panel.
  await page.getByRole('button', { name: 'Pista' }).click()
  await expect(page.getByRole('list', { name: 'Pistas' })).toContainText('Pista 1 de 3:')

  // CA12.3 solución (E5a): sumar 1 al total anterior termina en 4.
  await page.getByRole('button', { name: 'total ← total + 1', exact: true }).click()
  await page.getByRole('button', { name: 'Probar' }).click()
  await expect(page.getByText('¡Cuenta correcta! 4')).toBeVisible()
  await page.getByRole('button', { name: 'Continuar ›' }).click()

  // P6: explicación.
  await expect(page.getByRole('heading', { name: '¡Caso resuelto!' })).toBeVisible()
  await expect(page.getByText('Concepto aprendido:')).toBeVisible()

  // P7: la ficha de Cambión queda desbloqueada; las demás no.
  await page.getByRole('button', { name: 'Ver ficha en BugDex' }).click()
  await expect(page.getByText('Fichas de los casos resueltos · 1 de 4')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Cambión' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '? ? ?' })).toHaveCount(3)
})

test('Cambión: el estado del caso se lee con texto en la selección (CA03.2)', async ({ page }) => {
  await abrirSinAnimaciones(page)
  await page.getByRole('button', { name: 'Jugar' }).click()

  // Sin progreso, los 4 casos están disponibles y lo dicen con texto.
  await expect(page.getByText('Disponible')).toHaveCount(4)
  await expect(page.getByText('Completado')).toHaveCount(0)
})
