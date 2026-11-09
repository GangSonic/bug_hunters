import { expect, test, type Page } from '@playwright/test'

// RNF01: la misión cabe sin desplazar en 1366 × 768 (el viewport del proyecto de Playwright).
// Se comprueba el recorrido normal: observar y probar una opción, sin pistas abiertas.
// La guía de la primera observación (tutorial, JESS-01) mide más y la reemplazará Jess,
// así que aquí el tutorial ya se vio.
const CASOS = [
  { nombre: 'Loopi', hipotesis: 'La condición del ciclo es incorrecta', opcion: 'Entregados < 2' },
  {
    nombre: 'Confusín',
    hipotesis: 'La condición que decide el destino está mal',
    opcion: 'Verdadero',
  },
  {
    nombre: 'Nullito',
    hipotesis: 'No se revisa si el pedido existe antes de prepararlo',
    opcion: 'si existe: preparar pedido',
  },
  {
    nombre: 'Cambión',
    hipotesis: 'El contador se reinicia en cada vuelta',
    opcion: 'total ← total + 2',
  },
]

async function abrirSinAnimaciones(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem(
      'bug-hunters:progreso',
      JSON.stringify({ state: { resueltos: {}, tutorialVisto: true }, version: 1 }),
    )
    localStorage.setItem(
      'bug-hunters:configuracion',
      JSON.stringify({ state: { tema: 'claro', animaciones: false }, version: 1 }),
    )
  })
  await page.goto('/')
}

async function sinDesplazar(page: Page) {
  const alto = await page.locator('html').evaluate((el) => el.scrollHeight)
  return alto <= (page.viewportSize()?.height ?? 0)
}

for (const caso of CASOS) {
  test(`${caso.nombre}: P5 cabe sin desplazar al observar y tras un intento (RNF01)`, async ({
    page,
  }) => {
    await abrirSinAnimaciones(page)
    await page.getByRole('button', { name: 'Jugar' }).click()
    await page.getByRole('button', { name: `Investigar el caso de ${caso.nombre}` }).click()
    await page.getByRole('button', { name: 'Comenzar' }).click()
    expect(await sinDesplazar(page), 'observación').toBe(true)

    await page.getByRole('button', { name: 'Siguiente' }).click()
    await page.getByLabel(/Hipótesis/).selectOption({ label: caso.hipotesis })
    await page.getByRole('button', { name: caso.opcion, exact: true }).click()
    await page.getByRole('button', { name: /^Probar/ }).click()
    await expect(page.locator('[class*=resultbar]')).toBeVisible()
    expect(await sinDesplazar(page), 'tras un intento').toBe(true)
  })
}
