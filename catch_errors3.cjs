const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.message);
  });

  try {
    await page.goto('http://localhost:3001/centro-de-inteligencia', { waitUntil: 'networkidle0', timeout: 10000 });
    console.log('Loaded /centro-de-inteligencia');
  } catch (e) {
    console.log('NAVIGATION ERROR:', e.message);
  }
  
  await browser.close();
})();
