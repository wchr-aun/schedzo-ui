import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

// Reuse Next.js's image dependency; no extra package is needed for this asset.
const require = createRequire(import.meta.url);
const nextRequire = createRequire(require.resolve("next/package.json"));
const sharp = nextRequire("sharp");
const root = new URL("../", import.meta.url);
const css = await readFile(new URL("app/globals.css", root), "utf8");
const lightTokens = css.match(/:root\s*\{([^}]+)\}/)?.[1];
if (!lightTokens) throw new Error("Could not read the canonical light-theme tokens.");
const tokens = new Map([...lightTokens.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]));
function color(name) {
  const value = tokens.get(name);
  if (!value) throw new Error(`Missing design token: ${name}`);
  const reference = value.match(/^var\((--[\w-]+)\)$/);
  return reference ? color(reference[1]) : value;
}
const background = color("--color-background");
const surface = color("--color-surface");
const heading = color("--color-heading");
const text = color("--color-text");
const muted = color("--color-text-muted");
const primary = color("--color-primary");
const accent = color("--color-status-completed-background");
const border = color("--color-border");
const logo = (await readFile(new URL("public/logo.png", root))).toString("base64");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${background}"/>
  <rect x="0" y="0" width="1200" height="12" fill="${primary}"/>
  <image x="64" y="55" width="58" height="58" xlink:href="data:image/png;base64,${logo}"/>
  <g font-family="Arial, Helvetica, sans-serif">
    <text x="138" y="88" fill="${heading}" font-size="29" font-weight="700">Schedzo</text>
    <text x="138" y="110" fill="${muted}" font-size="16">On schedule.</text>
    <text x="64" y="187" fill="${muted}" font-size="17" font-weight="700" letter-spacing="2">A PRACTICAL GUIDE</text>
    <text x="60" y="263" fill="${heading}" font-size="61" font-weight="700" letter-spacing="-2">Schedule withdrawals</text>
    <text x="60" y="337" fill="${primary}" font-size="61" font-weight="700" letter-spacing="-2">from Monzo savings</text>
    <text x="64" y="388" fill="${text}" font-size="26">Instant Access Savings Pots</text>
    <rect x="64" y="431" width="433" height="57" rx="12" fill="${surface}" stroke="${border}" stroke-width="2"/>
    <text x="87" y="467" fill="${heading}" font-size="24" font-weight="700">Manual · IFTTT · Free Schedzo</text>
    <text x="64" y="571" fill="${muted}" font-size="19">Monthly withdrawals, compared and explained.</text>
    <rect x="806" y="166" width="330" height="352" rx="24" fill="${surface}" stroke="${border}" stroke-width="2"/>
    <rect x="830" y="191" width="282" height="55" rx="12" fill="${accent}"/>
    <text x="850" y="226" fill="${primary}" font-size="20" font-weight="700">Monthly withdrawal</text>
    <text x="830" y="311" fill="${heading}" font-size="43" font-weight="700">£2,273.00</text>
    <text x="830" y="351" fill="${muted}" font-size="22">14th · 09:00 UK</text>
    <path d="M830 377 H1112" stroke="${border}" stroke-width="2"/>
    <text x="830" y="416" fill="${text}" font-size="21">Rent savings</text>
    <path d="M846 432 V462 M837 453 L846 462 L855 453" fill="none" stroke="${primary}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="830" y="493" fill="${primary}" font-size="21" font-weight="700">Main balance</text>
  </g>
</svg>`;
const output = new URL("app/schedule-monzo-savings-pot-withdrawals/opengraph-image.png", root);
await sharp(Buffer.from(svg)).png().toFile(fileURLToPath(output));
await writeFile(new URL("app/schedule-monzo-savings-pot-withdrawals/opengraph-image.alt.txt", root), "Schedule Monzo Instant Access Savings withdrawals: compare manual withdrawals, IFTTT and Schedzo.\n");
console.log(`Generated ${output.pathname} (1200 × 630) using the existing brand tokens.`);
