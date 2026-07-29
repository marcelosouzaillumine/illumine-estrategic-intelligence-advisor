const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:4178?scenario=healthy');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'debug-screenshot.png' });
  const html = await page.content();
  require('fs').writeFileSync('debug-html.txt', html);
  await browser.close();
})();
