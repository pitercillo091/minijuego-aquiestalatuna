'use strict';
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto('http://localhost:8765/tests/browser-integration.html', { waitUntil: 'load' });
  await page.locator('#run').click();
  await page.waitForFunction(() => document.body.dataset.passed !== undefined || document.body.dataset.failed !== undefined, null, { timeout: 120000 });
  const result = await page.locator('#results').innerText();
  const failed = await page.locator('body').getAttribute('data-failed');
  console.log(result.split('\n')[0]);
  if (Number(failed) || errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
  await browser.close();
})().catch(error => { console.error(error.message); process.exitCode = 1; });
