/**
 * Генерирует полный набор Android-иконок (адаптивные слои 108dp + legacy 48dp)
 * из assets/icon.png и assets/crown.png.
 *
 * Запуск: node scripts/make-android-icons.js
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const RES = path.join(ROOT, "android", "app", "src", "main", "res");
const ICON = path.join(ROOT, "assets", "icon.png");
const CROWN = path.join(ROOT, "assets", "crown.png");
const BG = path.join(ROOT, "assets", "icon-background.png");

const DENSITIES = [
  ["mdpi", 1],
  ["hdpi", 1.5],
  ["xhdpi", 2],
  ["xxhdpi", 3],
  ["xxxhdpi", 4],
];

function roundedMaskSvg(size, radiusPercent) {
  const r = Math.round((size * radiusPercent) / 100);
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="#fff"/>
    </svg>`,
  );
}

function circleMaskSvg(size) {
  const r = size / 2;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <circle cx="${r}" cy="${r}" r="${r}" fill="#fff"/>
    </svg>`,
  );
}

async function masked(src, size, maskSvg) {
  const base = await sharp(src).resize(size, size, { fit: "cover" }).png().toBuffer();
  const mask = await sharp(maskSvg).png().toBuffer();
  return sharp(base)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

async function adaptiveForeground(size) {
  const crownW = Math.round(size * 0.5);
  const meta = await sharp(CROWN).metadata();
  const crownH = Math.round((meta.height / meta.width) * crownW);
  const crown = await sharp(CROWN)
    .resize({ width: crownW, height: crownH, fit: "inside" })
    .png()
    .toBuffer();
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: crown,
        left: Math.round((size - crownW) / 2),
        top: Math.round((size - crownH) / 2),
      },
    ])
    .png()
    .toBuffer();
}

async function adaptiveBackground(size) {
  return sharp(BG).resize(size, size, { fit: "cover" }).png().toBuffer();
}

(async () => {
  for (const [density, scale] of DENSITIES) {
    const dir = path.join(RES, `mipmap-${density}`);
    if (!fs.existsSync(dir)) continue;

    const legacy = Math.round(48 * scale);
    const adaptive = Math.round(108 * scale);

    fs.writeFileSync(
      path.join(dir, "ic_launcher.png"),
      await masked(ICON, legacy, roundedMaskSvg(legacy, 20)),
    );
    fs.writeFileSync(
      path.join(dir, "ic_launcher_round.png"),
      await masked(ICON, legacy, circleMaskSvg(legacy)),
    );
    fs.writeFileSync(path.join(dir, "ic_launcher_foreground.png"), await adaptiveForeground(adaptive));
    fs.writeFileSync(path.join(dir, "ic_launcher_background.png"), await adaptiveBackground(adaptive));
  }

  // Слои адаптивной иконки уже с нужными отступами — никаких inset-ов.
  const anydpi = path.join(RES, "mipmap-anydpi-v26");
  fs.mkdirSync(anydpi, { recursive: true });
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background" />
    <foreground android:drawable="@mipmap/ic_launcher_foreground" />
</adaptive-icon>
`;
  fs.writeFileSync(path.join(anydpi, "ic_launcher.xml"), xml);
  fs.writeFileSync(path.join(anydpi, "ic_launcher_round.xml"), xml);

  console.log("Android-иконки обновлены");
})();
