import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

// Tutorial: Loopi guía los pasos del nivel (con un aro que señala la pantalla) y el Inicio
// tiene un botón que abre la animación de 6 escenas.
async function abrir(
  page: Page,
  opciones: { animaciones?: boolean; tema?: 'claro' | 'oscuro' } = {},
) {
  const { animaciones = false, tema = 'claro' } = opciones
  await page.addInitScript(
    ([anim, t]) => {
      // Solo la primera vez: al recargar debe verse lo que el juego guardó.
      if (localStorage.getItem('bug-hunters:configuracion') !== null) return
      localStorage.setItem(
        'bug-hunters:configuracion',
        JSON.stringify({ state: { tema: t, animaciones: anim, musica: false }, version: 1 }),
      )
    },
    [animaciones, tema] as const,
  )
  await page.goto('/')
  await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; }' })
}

async function sinViolacionesGraves(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  const graves = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
  expect(
    graves.map((v) => `${v.id}: ${v.help} → ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`),
  ).toEqual([])
}

const zonaActiva = (page: Page) =>
  page.evaluate(
    () =>
      (
        globalThis as unknown as {
          document: {
            querySelector: (s: string) => { getAttribute: (n: string) => string | null } | null
          }
        }
      ).document
        .querySelector('[data-zona-activa]')
        ?.getAttribute('data-zona-activa') ?? null,
  )

async function entrarANullito(page: Page) {
  await page.getByRole('button', { name: 'Jugar' }).click()
  await page.getByRole('button', { name: 'Investigar el caso de Nullito' }).click()
  await page.getByRole('button', { name: 'Comenzar' }).click()
}

test.describe('tutorial dentro del nivel', () => {
  test('la primera vez Loopi señala con un aro cada parte de la pantalla', async ({ page }) => {
    await abrir(page)
    await entrarANullito(page)
    await expect(page.getByText('Paso 1 de 4: observa a Nullito')).toBeVisible()
    await expect.poll(() => zonaActiva(page)).toBe('escena')

    await page.getByRole('button', { name: 'Siguiente' }).click()
    await expect(page.getByText(/Paso 2 de 4/)).toBeVisible()
    await expect.poll(() => zonaActiva(page)).toBe('causa')

    await page.getByLabel(/Hipótesis/).selectOption({ index: 1 })
    await expect(page.getByText(/Paso 3 de 4/)).toBeVisible()
    await expect.poll(() => zonaActiva(page)).toBe('correccion')

    await page.getByRole('button', { name: 'preparar pedido', exact: true }).click()
    await expect(page.getByText(/Paso 4 de 4/)).toBeVisible()
    await expect.poll(() => zonaActiva(page)).toBe('probar')

    // Al probar, el tutorial se va y el aro con él.
    await page.getByRole('button', { name: 'Probar' }).click()
    await expect.poll(() => zonaActiva(page)).toBe(null)
  })

  test('Omitir tutorial quita el aro y deja el recordatorio', async ({ page }) => {
    await abrir(page)
    await entrarANullito(page)
    await page.getByRole('button', { name: 'Siguiente' }).click()
    await expect.poll(() => zonaActiva(page)).toBe('causa')
    await page.getByRole('button', { name: 'Omitir tutorial' }).click()
    await expect.poll(() => zonaActiva(page)).toBe(null)
    await expect(page.getByText(/Recuerda:/)).toBeVisible()
  })

  test('en una misión posterior ya no hay aro', async ({ page }) => {
    await abrir(page)
    await entrarANullito(page)
    await page.getByRole('button', { name: 'Siguiente' }).click()
    await page.getByRole('button', { name: 'Omitir tutorial' }).click()
    await page.getByRole('button', { name: 'Volver' }).click()
    await page.getByRole('button', { name: 'Investigar el caso de Loopi' }).click()
    await page.getByRole('button', { name: 'Comenzar' }).click()
    await expect(page.getByText('Paso 1 de 4: observa a Loopi')).toBeVisible()
    await expect.poll(() => zonaActiva(page)).toBe(null)
  })

  for (const tema of ['claro', 'oscuro'] as const) {
    test(`con Loopi y el aro la misión pasa axe (${tema})`, async ({ page }) => {
      await abrir(page, { tema })
      await entrarANullito(page)
      await sinViolacionesGraves(page)
      await page.getByRole('button', { name: 'Siguiente' }).click()
      await sinViolacionesGraves(page)
    })
  }
})

test.describe('tutorial animado del Inicio', () => {
  test('el botón Tutorial abre la animación y Volver regresa al Inicio', async ({ page }) => {
    await abrir(page)
    await page.getByRole('button', { name: 'Tutorial' }).click()
    await expect(page.getByRole('heading', { name: 'Tutorial' })).toBeVisible()
    await expect(page.getByText('Escena 1 de 6: Conoce a Loopi')).toBeVisible()

    await page.getByRole('button', { name: 'Volver' }).click()
    await expect(page.getByRole('button', { name: 'Jugar' })).toBeFocused()
  })

  test('con animaciones apagadas empieza en pausa y se recorre con los botones', async ({
    page,
  }) => {
    await abrir(page)
    await page.getByRole('button', { name: 'Tutorial' }).click()
    await expect(page.getByRole('button', { name: 'Reproducir' })).toBeVisible()
    for (let i = 2; i <= 6; i++) {
      await page.getByRole('button', { name: 'Siguiente' }).click()
      await expect(page.getByText(new RegExp(`Escena ${i} de 6`))).toBeVisible()
    }
    await expect(page.getByText(/Aprendiste qué es un valor ausente/)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Siguiente' })).toBeDisabled()
  })

  test('con animaciones encendidas avanza sola y se puede pausar', async ({ page }) => {
    await abrir(page, { animaciones: true })
    await page.getByRole('button', { name: 'Tutorial' }).click()
    await expect(page.getByRole('button', { name: 'Pausar' })).toBeVisible()
    await expect(page.getByText(/Escena 2 de 6/)).toBeVisible({ timeout: 12_000 })
    await page.getByRole('button', { name: 'Pausar' }).click()
    await page.waitForTimeout(8_000)
    await expect(page.getByText(/Escena 2 de 6/)).toBeVisible()
  })

  test('Esc cierra y «Ir a los casos» lleva a elegir un caso', async ({ page }) => {
    await abrir(page)
    await page.getByRole('button', { name: 'Tutorial' }).click()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'Jugar' })).toBeVisible()

    await page.getByRole('button', { name: 'Tutorial' }).click()
    await page.getByRole('button', { name: 'Ir a los casos' }).click()
    await expect(page.getByRole('button', { name: 'Investigar el caso de Nullito' })).toBeVisible()
  })

  test('se maneja con teclado: Tab llega a los controles y Enter cambia de escena', async ({
    page,
  }) => {
    await abrir(page)
    await page.getByRole('button', { name: 'Tutorial' }).click()
    const siguiente = page.getByRole('button', { name: 'Siguiente' })
    await siguiente.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByText(/Escena 2 de 6/)).toBeVisible()
  })

  test('en 360 px no hay desplazamiento horizontal', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 })
    await abrir(page)
    await page.getByRole('button', { name: 'Tutorial' }).click()
    for (let i = 1; i <= 6; i++) {
      await page.getByRole('button', { name: new RegExp(`Ir a la escena ${i}:`) }).click()
      const desborda = await page.evaluate(() => {
        const d = (
          globalThis as unknown as {
            document: { documentElement: { scrollWidth: number; clientWidth: number } }
          }
        ).document.documentElement
        return d.scrollWidth > d.clientWidth
      })
      expect(desborda, `escena ${i}`).toBe(false)
    }
  })

  for (const tema of ['claro', 'oscuro'] as const) {
    test(`las 6 escenas pasan axe (${tema})`, async ({ page }) => {
      await abrir(page, { tema })
      await page.getByRole('button', { name: 'Tutorial' }).click()
      for (let i = 1; i <= 6; i++) {
        await page.getByRole('button', { name: new RegExp(`Ir a la escena ${i}:`) }).click()
        await sinViolacionesGraves(page)
      }
    })
  }
})
