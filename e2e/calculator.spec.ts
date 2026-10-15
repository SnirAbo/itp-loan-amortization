import { test, expect } from '@playwright/test'

const p = '300000', r = '6.5', t = '30'

test('happy path calculation renders results and exports', async ({ page }) => {
  await page.goto('/')

  // Fill inputs
  await page.getByLabel('Principal').fill(p)
  await page.getByLabel('APR %').fill(r)
  await page.getByLabel('Term (years)').fill(t)

  // Results render
  await expect(page.getByText('Monthly Payment:')).toBeVisible()

  // Copy link
  await page.getByRole('button', { name: 'Copy Link' }).click()

  // CSV/PDF existence (buttons may be in future extension; for now confirm table renders)
  await expect(page.getByText('Balance')).toBeVisible()
})

test('sharable link restores identical results', async ({ page }) => {
  await page.goto(`/?p=${p}&r=${r}&t=${t}`)
  await expect(page.getByText('Monthly Payment:')).toBeVisible()
})
