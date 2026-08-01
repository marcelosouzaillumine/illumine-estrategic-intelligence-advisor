const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 10000 });
    await page.screenshot({ path: '/Users/marcelosouza/.gemini/antigravity-ide/brain/0afdaea8-b868-4548-812d-477b99576988/artifacts/screenshot.png' });
    console.log('Screenshot saved');
  } catch (e) {
    console.log('NAVIGATION ERROR:', e.message);
  }
  
  await browser.close();
})();
