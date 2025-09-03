// Optimize public/anzr-logo.png into smaller PNG and WebP using @squoosh/lib
// Runs in CI before build so optimized assets are copied from public/ to build/

const fs = require('fs');
const path = require('path');

async function optimize() {
  const inputPng = path.join('public', 'anzr-logo.png');
  if (!fs.existsSync(inputPng)) {
    // If the PNG hasn't been renamed yet, try old filename and copy
    const oldName = path.join('public', 'new ANZR Logo 05 2025.png');
    if (fs.existsSync(oldName)) {
      fs.copyFileSync(oldName, inputPng);
    } else {
      console.log('No logo found to optimize. Skipping.');
      return;
    }
  }

  // Lazy-require to avoid local env failure when not installed
  let ImagePool;
  try {
    ({ ImagePool } = require('@squoosh/lib'));
  } catch (e) {
    console.warn('Image optimizer not installed; skipping optimization.');
    return;
  }

  const imagePool = new ImagePool();
  const input = fs.readFileSync(inputPng);
  const image = imagePool.ingestImage(input);

  await image.preprocess({
    // Since header renders at 48px, keep a reasonable cap for future use
    resize: { enabled: true, width: 256 },
  });

  await image.encode({
    webp: { quality: 80 },
    oxipng: { level: 2 },
  });

  const webp = (await image.encodedWith.webp).binary;
  const oxipng = (await image.encodedWith.oxipng).binary;

  fs.writeFileSync(path.join('public', 'anzr-logo.webp'), webp);
  fs.writeFileSync(inputPng, oxipng);
  await imagePool.close();
  console.log('Optimized logo written to public/anzr-logo.(png|webp)');
}

optimize().catch((e) => {
  const msg = `Logo optimization skipped: ${e && e.message ? e.message : e}`;
  // Do not fail CI builds due to optional optimization issues
  if (process.env.CI) {
    console.warn(msg);
    process.exit(0);
  } else {
    console.warn(msg);
    process.exit(0);
  }
});
