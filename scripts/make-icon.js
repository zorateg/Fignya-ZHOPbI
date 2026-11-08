/**
 * Собирает "полноформатную" иконку приложения и сплэш из assets/icon-raw.png:
 * вырезает корону, убирает белую карточку по краям и кладёт всё на градиент бренда.
 *
 * Запуск: node scripts/make-icon.js
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const RAW = path.join(ROOT, "assets", "icon-raw.png");
const OUT = path.join(ROOT, "assets");

const SIZE = 1024;

function gradientSvg(size, { vignette = true } = {}) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#6d28d9"/>
        <stop offset="34%" stop-color="#8b5cf6"/>
        <stop offset="68%" stop-color="#c026d3"/>
        <stop offset="100%" stop-color="#f97316"/>
      </linearGradient>
      <radialGradient id="v" cx="50%" cy="48%" r="62%">
        <stop offset="0%" stop-color="#0b0817" stop-opacity="${vignette ? 0.92 : 0.35}"/>
        <stop offset="65%" stop-color="#0b0817" stop-opacity="${vignette ? 0.45 : 0.1}"/>
        <stop offset="100%" stop-color="#0b0817" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <rect width="100%" height="100%" fill="url(#v)"/>
  </svg>`);
}

async function extractCrown() {
  const { data, info } = await sharp(RAW)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  // 1. Границы "карточки" (всё, что не белая рамка вокруг).
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const min = Math.min(data[i], data[i + 1], data[i + 2]);
      if (min < 228) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // 1b. Белая рамка/скруглённые углы: заливаем "снаружи" от границ картинки,
  //     чтобы они не попали в маску короны.
  const outside = new Uint8Array(width * height);
  const isWhite = (x, y) => {
    const i = (y * width + x) * channels;
    return Math.min(data[i], data[i + 1], data[i + 2]) > 200;
  };
  const stackX = [];
  const stackY = [];
  for (let x = 0; x < width; x++) {
    if (isWhite(x, 0)) { stackX.push(x); stackY.push(0); }
    if (isWhite(x, height - 1)) { stackX.push(x); stackY.push(height - 1); }
  }
  for (let y = 0; y < height; y++) {
    if (isWhite(0, y)) { stackX.push(0); stackY.push(y); }
    if (isWhite(width - 1, y)) { stackX.push(width - 1); stackY.push(y); }
  }
  while (stackX.length) {
    const x = stackX.pop();
    const y = stackY.pop();
    const key = y * width + x;
    if (outside[key]) continue;
    if (!isWhite(x, y)) continue;
    outside[key] = 1;
    if (x > 0) { stackX.push(x - 1); stackY.push(y); }
    if (x < width - 1) { stackX.push(x + 1); stackY.push(y); }
    if (y > 0) { stackX.push(x); stackY.push(y - 1); }
    if (y < height - 1) { stackX.push(x); stackY.push(y + 1); }
  }

  // 2. Внутри карточки вырезаем белую корону (остальное — градиентный фон).
  const out = Buffer.alloc(width * height * 4, 0);
  let cx0 = width;
  let cy0 = height;
  let cx1 = 0;
  let cy1 = 0;

  for (let y = minY + 6; y <= maxY - 6; y++) {
    for (let x = minX + 6; x <= maxX - 6; x++) {
      const i = (y * width + x) * channels;
      if (outside[y * width + x]) continue;
      const min = Math.min(data[i], data[i + 1], data[i + 2]);
      let alpha = Math.max(0, Math.min(1, (min - 185) / 55));
      if (alpha <= 0) continue;
      const o = (y * width + x) * 4;
      out[o] = 255;
      out[o + 1] = 255;
      out[o + 2] = 255;
      out[o + 3] = Math.round(alpha * 255);
      if (x < cx0) cx0 = x;
      if (x > cx1) cx1 = x;
      if (y < cy0) cy0 = y;
      if (y > cy1) cy1 = y;
    }
  }

  const pad = 8;
  const left = Math.max(0, cx0 - pad);
  const top = Math.max(0, cy0 - pad);
  const wCrop = Math.min(width - left, cx1 - cx0 + pad * 2);
  const hCrop = Math.min(height - top, cy1 - cy0 + pad * 2);

  const crown = await sharp(out, { raw: { width, height, channels: 4 } })
    .extract({ left, top, width: wCrop, height: hCrop })
    .png()
    .toBuffer();

  return { crown, width: wCrop, height: hCrop };
}

async function buildIcon(crown, crownBox, size, contentScale) {
  const bg = await sharp(gradientSvg(size)).png().toBuffer();
  const targetW = Math.round(size * contentScale);
  const targetH = Math.round((crownBox.height / crownBox.width) * targetW);
  const scaled = await sharp(crown)
    .resize({ width: targetW, height: targetH, fit: "inside" })
    .png()
    .toBuffer();

  return sharp(bg)
    .composite([
      {
        input: scaled,
        left: Math.round((size - targetW) / 2),
        top: Math.round((size - targetH) / 2),
      },
    ])
    .png()
    .toBuffer();
}

async function buildSplash(crown, crownBox, size) {
  const bg = await sharp(
    Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <defs>
        <radialGradient id="s" cx="50%" cy="42%" r="70%">
          <stop offset="0%" stop-color="#1a1030"/>
          <stop offset="55%" stop-color="#0b0817"/>
          <stop offset="100%" stop-color="#070510"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#s)"/>
    </svg>`),
  )
    .png()
    .toBuffer();

  const logoW = Math.round(size * 0.26);
  const logoH = Math.round((crownBox.height / crownBox.width) * logoW);
  const logo = await sharp(crown)
    .resize({ width: logoW, height: logoH, fit: "inside" })
    .png()
    .toBuffer();

  const text = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="380">
    <text x="50%" y="150" text-anchor="middle" font-family="DejaVu Sans, sans-serif"
      font-size="150" font-weight="bold" fill="#ffffff">Фигня</text>
    <text x="50%" y="245" text-anchor="middle" font-family="DejaVu Sans, sans-serif"
      font-size="46" letter-spacing="10" fill="#a855f7">ЖОРА КРУТОЙ</text>
  </svg>`);

  return sharp(bg)
    .composite([
      {
        input: logo,
        left: Math.round((size - logoW) / 2),
        top: Math.round(size * 0.30),
      },
      {
        input: text,
        left: 0,
        top: Math.round(size * 0.56),
      },
    ])
    .png()
    .toBuffer();
}

(async () => {
  if (!fs.existsSync(RAW)) throw new Error("Нет assets/icon-raw.png");

  const { crown, width, height } = await extractCrown();
  const crownBox = { width, height };
  fs.writeFileSync(path.join(OUT, "crown.png"), crown);

  fs.writeFileSync(
    path.join(OUT, "icon.png"),
    await buildIcon(crown, crownBox, SIZE, 0.66),
  );

  // Android adaptive icon: фон + передний план с запасом по краям (safe zone).
  fs.writeFileSync(
    path.join(OUT, "icon-foreground.png"),
    await buildIcon(crown, crownBox, SIZE, 0.42),
  );
  fs.writeFileSync(
    path.join(OUT, "icon-background.png"),
    await sharp(gradientSvg(SIZE)).png().toBuffer(),
  );

  fs.writeFileSync(
    path.join(OUT, "splash.png"),
    await buildSplash(crown, crownBox, 2732),
  );
  fs.writeFileSync(
    path.join(OUT, "splash-dark.png"),
    await buildSplash(crown, crownBox, 2732),
  );

  // Иконки для PWA/сайта
  const pub = path.join(ROOT, "public");
  const app = path.join(ROOT, "src", "app");
  const icon = fs.readFileSync(path.join(OUT, "icon.png"));
  for (const [file, size] of [
    [path.join(pub, "icon-192.png"), 192],
    [path.join(pub, "icon-512.png"), 512],
    [path.join(pub, "apple-touch-icon.png"), 180],
    [path.join(app, "icon.png"), 512],
  ]) {
    fs.writeFileSync(file, await sharp(icon).resize(size, size).png().toBuffer());
  }
  fs.writeFileSync(
    path.join(pub, "icon-maskable-512.png"),
    await buildIcon(crown, crownBox, 512, 0.5),
  );

  console.log("Готово: assets/icon.png, splash.png, public/icon-*.png");
})();
