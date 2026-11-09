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

async function irAConfusin(page: Page) {
  await page.getByRole('button', { name: 'Jugar' }).click()
  await page.getByRole('button', { name: 'Investigar el caso de Confusín' }).click()
  await page.getByRole('button', { name: 'Comenzar' }).click()
}

test('Confusín de principio a fin: intento incompleto, solución, explicación y ficha', async ({
  page,
}) => {
  await abrirSinAnimaciones(page)
  await irAConfusin(page)

  // E1: la anomalía se ejecuta sola.
  await expect(page.getByText('Paso 1 de 4: observa a Confusín')).toBeVisible()
  await expect(page.getByRole('status').filter({ hasText: 'Detenido' })).toBeVisible()
  await page.getByRole('button', { name: 'Siguiente' }).click()

  // CA05.2: sin hipótesis, Probar avisa y no ejecuta.
  await page.getByRole('button', { name: 'Verdadero' }).click()
  await page.getByRole('button', { name: 'Probar' }).click()
  await expect(page.getByText('Primero registra una hipótesis (paso 1).')).toBeVisible()

  await page
    .getByLabel(/Hipótesis/)
    .selectOption({ label: 'La condición que decide el destino está mal' })

  // Intento incompleto: todos al mismo lado, 2 de 4.
  await page.getByRole('button', { name: 'Probar' }).click()
  await expect(page.getByText('Todos al mismo lado: 2 de 4')).toBeVisible()

  // Pista graduada: queda visible bajo los botones.
  await page.getByRole('button', { name: 'Pista' }).click()
  await expect(page.getByRole('list', { name: 'Pistas' })).toContainText('Pista 1 de 3:')

  // Solución (E5a): la comparación correcta manda cada pedido a su destino.
  await page.getByRole('button', { name: 'destino = "Norte"' }).click()
  await page.getByRole('button', { name: 'Probar' }).click()
  await expect(page.getByText('¡Todo en su lugar! 4 de 4')).toBeVisible()
  await page.getByRole('button', { name: 'Continuar ›' }).click()

  // P6: explicación.
  await expect(page.getByRole('heading', { name: '¡Caso resuelto!' })).toBeVisible()
  await expect(page.getByText('Concepto aprendido:')).toBeVisible()

  // P7: la ficha de Confusín queda desbloqueada; las demás no.
  await page.getByRole('button', { name: 'Ver ficha en BugDex' }).click()
  await expect(page.getByText('Fichas de los casos resueltos · 1 de 4')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Confusín' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '? ? ?' })).toHaveCount(3)
})
