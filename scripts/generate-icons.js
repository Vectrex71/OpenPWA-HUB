import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

// Standard Brand SVG Icon (512x512)
const brandSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0b0f19" />
      <stop offset="50%" stop-color="#111827" />
      <stop offset="100%" stop-color="#070a12" />
    </linearGradient>

    <!-- Border Gradient -->
    <linearGradient id="borderGrad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8" />
      <stop offset="40%" stop-color="#818cf8" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#c084fc" stop-opacity="0.8" />
    </linearGradient>

    <!-- Primary Ribbon Gradient -->
    <linearGradient id="ribbonCyan" x1="120" y1="120" x2="390" y2="390" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#2563eb" />
    </linearGradient>

    <!-- Secondary Ribbon Gradient -->
    <linearGradient id="ribbonViolet" x1="130" y1="380" x2="380" y2="130" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#a855f7" />
      <stop offset="60%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>

    <!-- Accent Glow -->
    <linearGradient id="coreGlow" x1="200" y1="200" x2="312" y2="312" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#f43f5e" />
      <stop offset="100%" stop-color="#fb923c" />
    </linearGradient>

    <!-- Lightning Spark -->
    <linearGradient id="sparkGrad" x1="230" y1="150" x2="280" y2="360" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="30%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#818cf8" />
    </linearGradient>

    <!-- Glow Filters -->
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <filter id="ambientLight" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="28" result="blur" />
    </filter>
  </defs>

  <!-- Squircle Base Canvas -->
  <rect x="8" y="8" width="496" height="496" rx="116" fill="url(#bgGrad)" />
  
  <!-- Subtle Internal Grid/Tech Accent -->
  <rect x="8" y="8" width="496" height="496" rx="116" stroke="url(#borderGrad)" stroke-width="4" fill="none" opacity="0.9" />

  <!-- Ambient Backdrop Glow behind Logo -->
  <circle cx="256" cy="256" r="130" fill="#38bdf8" opacity="0.22" filter="url(#ambientLight)" />
  <circle cx="280" cy="230" r="100" fill="#a855f7" opacity="0.22" filter="url(#ambientLight)" />

  <!-- Geometric Interconnected PWA Emblem (Isometric Hyper-Loop) -->
  <g filter="url(#softGlow)">
    <!-- Bottom Layer Ribbon -->
    <path d="M168 188 C168 140, 220 110, 268 126 L340 152 C376 165, 396 204, 384 240 L368 290 C352 336, 298 360, 252 344 L196 324 C162 312, 148 274, 164 242 Z" 
          fill="url(#ribbonViolet)" opacity="0.88" />

    <!-- Top Interlocking Loop Layer -->
    <path d="M344 324 C344 372, 292 402, 244 386 L172 360 C136 347, 116 308, 128 272 L144 222 C160 176, 214 152, 260 168 L316 188 C350 200, 364 238, 348 270 Z" 
          fill="url(#ribbonCyan)" />

    <!-- Central High-Tech Gateway Core Cutout -->
    <path d="M220 226 L292 250 C308 255, 314 274, 304 286 L284 310 C274 322, 252 324, 238 314 L204 290 C192 282, 190 264, 200 252 Z" 
          fill="#0f172a" opacity="0.95" />

    <!-- Core Lightning Spark / Modern PWA Symbol -->
    <polygon points="274,166 226,264 262,264 238,346 302,246 264,246" 
             fill="url(#sparkGrad)" filter="url(#softGlow)" />
  </g>

  <!-- Top Glass Highlight Rim -->
  <path d="M52 140 C80 60, 140 24, 236 18 C140 24, 60 76, 28 170 C24 182, 24 200, 28 220 C36 180, 42 160, 52 140 Z" 
        fill="#ffffff" opacity="0.25" />

  <!-- Tiny Corner Tech Indicator Rings -->
  <circle cx="96" cy="96" r="6" fill="#38bdf8" opacity="0.7" />
  <circle cx="416" cy="416" r="6" fill="#c084fc" opacity="0.7" />
</svg>`;

// Maskable Icon (Full bleed background, 15% safe margin around core glyph)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
  <defs>
    <linearGradient id="maskBg" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0b0f19" />
      <stop offset="50%" stop-color="#111827" />
      <stop offset="100%" stop-color="#070a12" />
    </linearGradient>
    <linearGradient id="mRibbonCyan" x1="140" y1="140" x2="370" y2="370" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#2563eb" />
    </linearGradient>
    <linearGradient id="mRibbonViolet" x1="140" y1="360" x2="360" y2="140" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#a855f7" />
      <stop offset="60%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
    <linearGradient id="mSparkGrad" x1="230" y1="150" x2="280" y2="360" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="30%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#818cf8" />
    </linearGradient>
    <filter id="mSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Full-bleed background with no rounded corners (Android handles mask) -->
  <rect width="512" height="512" fill="url(#maskBg)" />

  <!-- Outer concentric decorative ring within safe zone -->
  <circle cx="256" cy="256" r="195" stroke="#38bdf8" stroke-width="2" stroke-dasharray="8 8" opacity="0.3" />
  <circle cx="256" cy="256" r="175" stroke="#818cf8" stroke-width="1.5" opacity="0.2" />

  <!-- Scaled Emblem positioned safely within 80% circle (75% scale centered at 256, 256) -->
  <g transform="translate(64, 64) scale(0.75)" filter="url(#mSoftGlow)">
    <path d="M168 188 C168 140, 220 110, 268 126 L340 152 C376 165, 396 204, 384 240 L368 290 C352 336, 298 360, 252 344 L196 324 C162 312, 148 274, 164 242 Z" 
          fill="url(#mRibbonViolet)" opacity="0.88" />
    <path d="M344 324 C344 372, 292 402, 244 386 L172 360 C136 347, 116 308, 128 272 L144 222 C160 176, 214 152, 260 168 L316 188 C350 200, 364 238, 348 270 Z" 
          fill="url(#mRibbonCyan)" />
    <path d="M220 226 L292 250 C308 255, 314 274, 304 286 L284 310 C274 322, 252 324, 238 314 L204 290 C192 282, 190 264, 200 252 Z" 
          fill="#0f172a" opacity="0.95" />
    <polygon points="274,166 226,264 262,264 238,346 302,246 264,246" 
             fill="url(#mSparkGrad)" />
  </g>
</svg>`;

async function generateAllIcons() {
  console.log('🎨 Generating sleek PWA icons with Sharp...');

  // 1. Write public/icon.svg
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), brandSvg, 'utf8');
  console.log('✅ Generated public/icon.svg');

  // 2. Generate 512x512 PNG
  await sharp(Buffer.from(brandSvg))
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('✅ Generated public/pwa-512x512.png');

  // 3. Generate 192x192 PNG
  await sharp(Buffer.from(brandSvg))
    .resize(192, 192)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('✅ Generated public/pwa-192x192.png');

  // 4. Generate Maskable 512x512 PNG (Android safe-zone compliant)
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('✅ Generated public/pwa-maskable-512x512.png');

  // 5. Generate Apple Touch Icon 180x180 PNG (iOS Safari compliant)
  await sharp(Buffer.from(brandSvg))
    .resize(180, 180)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✅ Generated public/apple-touch-icon.png');

  // 6. Generate 64x64 favicon.png
  await sharp(Buffer.from(brandSvg))
    .resize(64, 64)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'favicon-64x64.png'));
  console.log('✅ Generated public/favicon-64x64.png');

  console.log('🚀 All PWA icons generated successfully!');
}

generateAllIcons().catch((err) => {
  console.error('❌ Error generating icons:', err);
  process.exit(1);
});
