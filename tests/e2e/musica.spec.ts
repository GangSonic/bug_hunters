import { expect, test, type Page } from '@playwright/test'

// La música: un botón siempre visible, una pista por pantalla y el ajuste guardado.
// Aún no hay archivos de audio en el repositorio, así que se anota qué pista se pide a cada
// pantalla (el src al llamar a play) y no si llegó a sonar.
async function abrir(page: Page, musica?: boolean) {
  await page.addInitScript((m) => {
    const g = globalThis as unknown as {
      __musica: string[]
      HTMLMediaElement: {
        prototype: { play: (this: { src: string }) => Promise<void>; pause: () => void }
      }
    }
    g.__musica = []
    const proto = g.HTMLMediaElement.prototype
    const play = proto.play
    proto.play = function (this: { src: string }) {
      g.__musica.push('play:' + this.src.split('/').pop())
      return play.call(this)
    }
    const pause = proto.pause
    proto.pause = function (this: unknown) {
      g.__musica.push('pause')
      return pause.call(this)
    }
    localStorage.setItem(
      'bug-hunters:progreso',
      JSON.stringify({ state: { resueltos: {}, tutorialVisto: true }, version: 1 }),
    )
    // Solo la primera vez: al recargar debe verse lo que el juego guardó.
    if (localStorage.getItem('bug-hunters:configuracion') !== null) return
    localStorage.setItem(
      'bug-hunters:configuracion',
      JSON.stringify({
        state: { tema: 'claro', animaciones: false, ...(m === undefined ? {} : { musica: m }) },
        version: 1,
      }),
    )
  }, musica)
  await page.goto('/')
}

const pedidas = (page: Page) =>
  page.evaluate(() => (globalThis as unknown as { __musica: string[] }).__musica)

test('la música está encendida de entrada y el botón se ve en toda la misión', async ({ page }) => {
  await abrir(page)
  const boton = page.getByRole('button', { name: 'Música' })
  await expect(boton).toHaveAttribute('aria-pressed', 'true')

  await page.getByRole('button', { name: 'Jugar' }).click()
  await expect(boton).toBeVisible()
  await page.getByRole('button', { name: 'Investigar el caso de Loopi' }).click()
  await page.getByRole('button', { name: 'Comenzar' }).click()
  await expect(boton).toBeVisible()
})

test('cada pantalla pide su pista: inicio, misterio y carrera', async ({ page }) => {
  await abrir(page)
  await expect.poll(() => pedidas(page)).toContain('play:inicio.mp3')

  await page.getByRole('button', { name: 'Jugar' }).click()
  await expect.poll(() => pedidas(page)).toContain('play:misterio.mp3')
  await page.getByRole('button', { name: 'Investigar el caso de Loopi' }).click()
  await page.getByRole('button', { name: 'Comenzar' }).click()
  await expect.poll(() => pedidas(page)).toContain('play:carrera.mp3')
})

test('apagar la música la pausa, no vuelve al cambiar de pantalla y se recuerda al recargar', async ({
  page,
}) => {
  await abrir(page)
  await page.getByRole('button', { name: 'Música' }).click()
  await expect(page.getByRole('button', { name: 'Música' })).toHaveAttribute(
    'aria-pressed',
    'false',
  )
  await expect.poll(() => pedidas(page)).toContain('pause')

  const antes = (await pedidas(page)).filter((e) => e.startsWith('play:')).length
  await page.getByRole('button', { name: 'Jugar' }).click()
  await page.getByRole('button', { name: 'Investigar el caso de Loopi' }).click()
  await page.waitForTimeout(300)
  expect((await pedidas(page)).filter((e) => e.startsWith('play:')).length).toBe(antes)

  await page.reload()
  await expect(page.getByRole('button', { name: 'Música' })).toHaveAttribute(
    'aria-pressed',
    'false',
  )
})

test('con la música apagada de antes, al abrir no se pide ninguna pista', async ({ page }) => {
  await abrir(page, false)
  await page.waitForTimeout(300)
  expect((await pedidas(page)).filter((e) => e.startsWith('play:'))).toEqual([])
})

test('el botón de música se maneja con teclado', async ({ page }) => {
  await abrir(page)
  const boton = page.getByRole('button', { name: 'Música' })
  await boton.focus()
  await page.keyboard.press('Enter')
  await expect(boton).toHaveAttribute('aria-pressed', 'false')
  await page.keyboard.press('Space')
  await expect(boton).toHaveAttribute('aria-pressed', 'true')
})
