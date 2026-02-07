import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });
  
  // Wait for 3D to load
  await page.waitForTimeout(3000);
  
  // Screenshot hero section
  const heroElement = await page.$('.hero');
  await heroElement.screenshot({ path: 'hero-helmet.png' });
  
  // Scroll to helmets gallery
  await page.evaluate(() => {
    document.querySelector('.helmets').scrollIntoView({ behavior: 'smooth' });
  });
  await page.waitForTimeout(2000);
  
  const helmetsElement = await page.$('.helmets');
  await helmetsElement.screenshot({ path: 'helmets-gallery.png' });
  
  // Full page screenshot
  await page.screenshot({ path: 'full-page.png', fullPage: true });
  
  await browser.close();
  console.log('Screenshots saved!');
})();
