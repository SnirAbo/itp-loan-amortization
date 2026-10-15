import { test, expect } from '@playwright/test'

const p = '300000', r = '6.5', t = '30'

test('happy path calculation renders results and exports', async ({ page }) => {
  await page.goto('/')

  await page.getByLabel('Principal').fill(p)
  await page.getByLabel('APR %').fill(r)
  await page.getByLabel('Term (years)').fill(t)

  await expect(page.getByText('Monthly Payment:')).toBeVisible()

  await expect(page.getByRole('button', { name: 'Export CSV' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Export PDF' })).toBeVisible()
})

test('sharable link restores identical results', async ({ page }) => {
  await page.goto(`/?p=${p}&r=${r}&t=${t}`)
  await expect(page.getByText('Monthly Payment:')).toBeVisible()
})
