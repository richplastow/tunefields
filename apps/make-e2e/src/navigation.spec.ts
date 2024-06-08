import { test, expect } from '@playwright/test';

test('navigates from homepage to about and back again', async ({ page }) => {

  // Expect the <H1> of the 'en' and 'pt' homepages to contain the 'make'
  // welcome message in the correct language.
  await page.goto('/tunefields/make/en/');
  expect(await page.locator('h1').innerText()).toContain('Hello make!');
  await page.goto('/tunefields/make/pt/');
  expect(await page.locator('h1').innerText()).toContain('Oi make!');

/*
  // Expect clicking "‘make’ about page" to navigate to the about page.
  await page.getByText('‘make’ about page').click();
  await expect(page).toHaveURL(/.*\/tunefields\/make\/pt\/about\/$/);
  expect(await page.locator('h1').innerText()).toContain('Oi About!');

  // Expect clicking "‘make’ home" to return to the homepage.
  await page.getByText('‘make’ home').click();
  await expect(page).toHaveURL(/.*\/tunefields\/make\/pt\/$/);
  expect(await page.locator('h1').innerText()).toContain('Oi make!');

  // TODO better test of multilingual navigation
*/
});
