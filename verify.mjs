import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3001/", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

// 1) Hover the centered card to trigger the liquid popup label
const cards = page.locator('[aria-roledescription="carousel"] button');
const count = await cards.count();
console.log("cards found:", count);
// centered card is the one with aria-current=true
const center = page.locator('[aria-roledescription="carousel"] button[aria-current="true"]').first();
await center.hover();
await page.waitForTimeout(700);
await page.screenshot({ path: "C:/tmp/hero_hover.png" });
console.log("hover shot done");

// 2) Click a side card -> it centers, background should change
await page.mouse.move(10, 10);
await page.waitForTimeout(400);
// click the first non-centered card
for (let i = 0; i < count; i++) {
  const c = cards.nth(i);
  const cur = await c.getAttribute("aria-current");
  if (cur !== "true") { await c.click(); break; }
}
await page.waitForTimeout(1800);
await page.screenshot({ path: "C:/tmp/hero_switched.png" });
console.log("switched shot done");
await browser.close();
