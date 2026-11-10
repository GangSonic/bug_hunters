import { readFileSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'

async function abrirPiloto(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem(
      'bug-hunters:configuracion',
      JSON.stringify({ state: { tema: 'claro', animaciones: false }, version: 1 }),
    )
    localStorage.removeItem('bug-hunters:piloto')
  })
  await page.goto('/?piloto=1')
}

test('HU18: con ?piloto=1 se registra el intento y se descarga el CSV', async ({ page }) => {
  await abrirPiloto(page)

  const barra = page.getByRole('region', { name: 'Modo piloto' })
  await expect(barra).toBeVisible()
  await barra.getByRole('textbox', { name: 'Código de participante' }).fill('P01')

  // Un intento completo de Loopi (hipótesis + corrección + Probar).
  await page.getByRole('button', { name: 'Jugar' }).click()
  await page.getByRole('button', { name: 'Investigar el caso de Loopi' }).click()
  await page.getByRole('button', { name: 'Comenzar' }).click()
  await page.getByRole('button', { name: 'Siguiente' }).click()
  await page.getByLabel(/Hipótesis/).selectOption({ label: 'La condición del ciclo es incorrecta' })
  await page.getByRole('button', { name: 'Hay paquetes pendientes' }).click()
  await page.getByRole('button', { name: 'Probar' }).click()

  await expect(barra).toContainText('1 intento')

  // El CSV se descarga en el navegador, con el código en la fila.
  const [descarga] = await Promise.all([
    page.waitForEvent('download'),
    barra.getByRole('button', { name: 'Descargar CSV' }).click(),
  ])
  expect(descarga.suggestedFilename()).toBe('piloto-P01.csv')
  const csv = readFileSync(await descarga.path(), 'utf8')
  expect(csv).toContain('codigo,caso,hipotesis,correccion,desenlace,pistas,hora')
  expect(csv).toContain('P01,loopi,')
})

test('HU18: sin ?piloto=1 la barra no aparece', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('region', { name: 'Modo piloto' })).toBeHidden()
})
