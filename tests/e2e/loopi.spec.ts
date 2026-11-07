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
  await page.getByRole('button', { name: 'Elegir Zona de Control' }).click()
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
  await expect(page.getByRole('status').filter({ hasText: 'En ejecución' })).toBeVisible()
  await page.getByRole('button', { name: 'Siguiente' }).click()

  // CA05.2: sin hipótesis no se puede probar.
  await expect(page.getByText('Primero registra una hipótesis.')).toBeVisible()
  await expect(page.getByRole('button', { name: /^Probar/ })).toBeDisabled()

  await page.getByLabel(/Hipótesis/).selectOption({ label: 'La condición del ciclo es incorrecta' })

  // Intento incompleto (E5b).
  await page.getByRole('radio', { name: 'Entregados < 2' }).click()
  await page.getByRole('button', { name: 'Probar' }).click()
  await expect(
    page.getByText('El reparto se detuvo, pero quedan 2 paquetes pendientes'),
  ).toBeVisible()

  // Pista graduada.
  await page.getByRole('button', { name: /Pista \(0 de 3\)/ }).click()
  await expect(page.getByText('Pista 1 de 3:')).toBeVisible()

  // Solución (E5a).
  await page.getByRole('radio', { name: 'Hay paquetes pendientes' }).click()
  await page.getByRole('button', { name: 'Probar otra vez' }).click()
  await expect(page.getByText('¡Reparto completo! 4 de 4')).toBeVisible()
  await page.getByRole('button', { name: 'Continuar' }).click()

  // P6: explicación y progreso guardado.
  await expect(page.getByRole('heading', { name: '¡Caso resuelto!' })).toBeVisible()
  await expect(page.getByText('Progreso guardado: 1 de 4 casos resueltos')).toBeVisible()

  // P7: la ficha de Loopi está desbloqueada; las demás no.
  await page.getByRole('button', { name: 'Ver ficha' }).click()
  await expect(page.getByText('1 de 4 fichas')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Loopi' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '???' })).toHaveCount(3)
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

test('CA01.2 Configuración se abre como capa y Esc la cierra', async ({ page }) => {
  await abrirSinAnimaciones(page)
  await page.getByRole('button', { name: 'Configuración' }).click()
  await expect(page.getByRole('dialog', { name: 'Configuración' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Jugar' })).toBeVisible()
})
