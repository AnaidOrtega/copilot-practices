import { test, expect } from '@playwright/test'

test.describe('Username Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/index.html') // Update with the correct path
  })

  test('should show error for empty username', async ({ page }) => {
    await page.fill('#username', '')
    await page.keyboard.press('Tab')
    const errorText = await page.textContent('#usernameError')
    expect(errorText).toBe('Username is required.')
  })

  test('should show error for username shorter than 4 characters', async ({
    page,
  }) => {
    await page.fill('#username', 'abc')
    await page.keyboard.press('Tab')
    const errorText = await page.textContent('#usernameError')
    expect(errorText).toBe('Username must be between 4 and 20 characters.')
  })

  test('should show error for username longer than 20 characters', async ({
    page,
  }) => {
    await page.fill('#username', 'abcdefghijklmnopqrstuvwxyz')
    await page.keyboard.press('Tab')
    const errorText = await page.textContent('#usernameError')
    expect(errorText).toBe('Username must be between 4 and 20 characters.')
  })

  test('should show error for username with numbers', async ({ page }) => {
    await page.fill('#username', 'user123')
    await page.keyboard.press('Tab')
    const errorText = await page.textContent('#usernameError')
    expect(errorText).toBe(
      'Username must contain letters only (no numbers or symbols).',
    )
  })

  test('should show error for username with symbols', async ({ page }) => {
    await page.fill('#username', 'user@name')
    await page.keyboard.press('Tab')
    const errorText = await page.textContent('#usernameError')
    expect(errorText).toBe(
      'Username must contain letters only (no numbers or symbols).',
    )
  })

  test('should validate a correct username', async ({ page }) => {
    await page.fill('#username', 'ValidUser')
    await page.keyboard.press('Tab')
    const errorText = await page.textContent('#usernameError')
    expect(errorText).toBe('')
    const isValid = await page.evaluate(() => {
      const input = document.getElementById('username')
      return input.classList.contains('is-valid')
    })
    expect(isValid).toBe(true)
  })
})
