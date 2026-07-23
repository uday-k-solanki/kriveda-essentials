import { chromium } from "playwright";
const url = "http://localhost:3001/";
const browser = await chromium.launch();
for (const [w, h, tag] of [
  [1440, 900, "desktop"],
  [1366, 640, "laptop"],
  [390, 844, "mobile"],
]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(2600);
  await page.screenshot({ path: `C:/tmp/hero_${tag}.png` });
  console.log(`shot ${tag} done`);
}
await browser.close();
