import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 360 } });
await page.goto("http://localhost:3001/", { waitUntil: "domcontentloaded" });

// Measure the opaque (non-transparent) bounding box of each bottle PNG so we
// can normalize displayed size to the actual bottle, not the canvas.
const files = ["lavender", "rosemary", "tea_tree"];
const results = {};
for (const f of files) {
  const url = `http://localhost:3001/images/${f}.png`;
  const box = await page.evaluate(async (src) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(0, 0, c.width, c.height);
    let minX = c.width, minY = c.height, maxX = 0, maxY = 0;
    for (let y = 0; y < c.height; y++) {
      for (let x = 0; x < c.width; x++) {
        if (data[(y * c.width + x) * 4 + 3] > 16) {
          if (x < minX) minX = x; if (x > maxX) maxX = x;
          if (y < minY) minY = y; if (y > maxY) maxY = y;
        }
      }
    }
    return { canvasW: c.width, canvasH: c.height, w: maxX - minX, h: maxY - minY };
  }, url);
  results[f] = box;
  console.log(f, JSON.stringify(box), "bottleH/canvasH=", (box.h / box.canvasH).toFixed(3));
}
await browser.close();
