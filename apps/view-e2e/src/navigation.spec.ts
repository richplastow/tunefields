import { test, expect } from '@playwright/test';

test('navigates from homepage to about and back again', async ({ page }) => {
  
  // Expect the <H1> of the homepage to contain the 'view' welcome message.
  await page.goto('/tunefields/view/');
  expect(await page.locator('h1').innerText()).toContain('Welcome view');

  // Expect clicking "‘view’ about page" to navigate to the about page.
  await page.getByText('‘view’ about page').click();
  await expect(page).toHaveURL(/.*\/tunefields\/view\/about\/$/);
  expect(await page.locator('h1').innerText()).toContain('Welcome to About!');

  // Expect clicking "‘view’ home" to return to the homepage.
  await page.getByText('‘view’ home').click();
  await expect(page).toHaveURL(/.*\/tunefields\/view\/$/);
  expect(await page.locator('h1').innerText()).toContain('Welcome view');
});
