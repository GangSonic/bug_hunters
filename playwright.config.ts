import { defineConfig, devices } from '@playwright/test'

const VIEWPORT = { width: 1366, height: 768 }

// Recorridos E2E sobre el build de producción (npm run build && npm run preview).
export default defineConfig({
  testDir: './tests/e2e',
  // Los recorridos con axe son largos y en equipos lentos pasan de 30 s.
  timeout: 60_000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: VIEWPORT,
        // En local se puede usar el Chrome instalado: PW_CHANNEL=chrome npm run test:e2e
        channel: process.env.PW_CHANNEL || undefined,
      },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], viewport: VIEWPORT },
      // El recorrido largo de axe tumba la pestaña de Firefox (Page crashed);
      // axe revisa el mismo DOM en Chromium y Edge.
      testIgnore: /accesibilidad\.spec\.ts/,
    },
    {
      name: 'edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge', viewport: VIEWPORT },
    },
  ],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
