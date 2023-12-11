import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByRole('grid')).toContainText('1–2 of 2');
  await page.getByRole('textbox', { name: 'First Name' }).click();
  await page.getByRole('textbox', { name: 'First Name' }).fill('idmm');
  await expect(page.getByRole('grid')).toContainText('0–0 of 0');
  await page.getByRole('textbox', { name: 'First Name' }).click();
  await page.getByRole('textbox', { name: 'First Name' }).fill('');
  await page.getByRole('textbox', { name: 'Last Name' }).click();
  await page.getByRole('textbox', { name: 'Last Name' }).fill('eng');
  await expect(page.getByRole('grid')).toContainText('1–1 of 1');
  await expect(page.getByRole('grid')).toContainText('ENG');
  await page.getByRole('textbox', { name: 'Last Name' }).click();
  await page.getByRole('textbox', { name: 'Last Name' }).fill('');
  await page.getByLabel('E-Mail').click();
  await page.getByLabel('E-Mail').fill('idm.test@idm.com');
  await expect(page.getByRole('grid')).toContainText('1–1 of 1');
  await expect(page.getByRole('grid')).toContainText('idm.test@idm.com');
  await page.getByLabel('E-Mail').click();
  await page.getByLabel('E-Mail').fill('idmm.com');
  await page.getByLabel('E-Mail').click();
  await page.getByLabel('E-Mail').fill('');
  await page.getByPlaceholder('1234567890').click();
  await page.getByPlaceholder('1234567890').fill('123456789');
  await expect(page.getByRole('grid')).toContainText('1–1 of 1');
  await expect(page.getByRole('grid')).toContainText('123456789');
});