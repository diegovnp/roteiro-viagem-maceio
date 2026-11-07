#!/usr/bin/env node
/**
 * Baixa as fotos listadas em `scripts/photo-sources.json` do Wikimedia Commons,
 * gera versões WebP otimizadas em `public/images/` e escreve
 * `src/data/photos.ts` com dimensões, cor média e créditos (autor + licença).
 *
 * Uso:  npm run images            (processa só as fotos que ainda não existem)
 *       npm run images -- --force (reprocessa todas)
 *       npm run images -- --local <pasta>
 *         usa arquivos já baixados: <pasta>/<id>.jpg + <pasta>/<id>.json
 *         ({ "author", "license", "source" }) em vez de baixar do Commons.
 *
 * Para trocar/adicionar uma foto: edite `scripts/photo-sources.json`
 * (id, título do arquivo no Commons, texto alternativo) e rode o comando.
 */
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'images');
const sourcesFile = path.join(root, 'scripts', 'photo-sources.json');
const metaFile = path.join(root, 'scripts', 'photo-meta.json');
const tsFile = path.join(root, 'src', 'data', 'photos.ts');
const force = process.argv.includes('--force');
const localIdx = process.argv.indexOf('--local');
const localDir = localIdx > -1 ? path.resolve(process.argv[localIdx + 1]) : null;

/** Link da licença Creative Commons a partir do nome curto (ex.: "CC BY-SA 4.0"). */
function ccUrl(license) {
  const m = /^CC ?(BY(?:-SA)?|0) ?([\d.]+)?$/i.exec(license.trim());
  if (!m) return license.toLowerCase().includes('public domain') ? 'https://creativecommons.org/publicdomain/mark/1.0/' : undefined;
  if (m[1] === '0') return 'https://creativecommons.org/publicdomain/zero/1.0/';
  return `https://creativecommons.org/licenses/${m[1].toLowerCase()}/${m[2] ?? '4.0'}/`;
}

const UA = 'RoteiroMaceioSite/1.0 (static travel itinerary; image optimisation script)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, as = 'json') {
  for (let attempt = 0; attempt < 8; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.status === 429 || res.status >= 500) {
      const wait = Number(res.headers.get('retry-after')) || 6 * (attempt + 1);
      console.log(`  …aguardando ${wait}s (HTTP ${res.status})`);
      await sleep(wait * 1000);
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} em ${url}`);
    await sleep(800);
    return as === 'json' ? res.json() : Buffer.from(await res.arrayBuffer());
  }
  throw new Error(`Muitas tentativas: ${url}`);
}

const strip = (html = '') =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

async function commonsInfo(title, width) {
  const params = new URLSearchParams({
    action: 'query',
    titles: title,
    prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata',
    iiurlwidth: String(width),
    format: 'json',
    formatversion: '2',
  });
  const data = await get(`https://commons.wikimedia.org/w/api.php?${params}`);
  const page = data.query.pages[0];
  if (!page || page.missing) throw new Error(`Arquivo não encontrado no Commons: ${title}`);
  const ii = page.imageinfo[0];
  const em = ii.extmetadata ?? {};
  const fixHost = (u) => u.split('?')[0].replace('thumb.wikimedia.org', 'upload.wikimedia.org');
  return {
    download: fixHost(ii.thumburl && ii.thumbwidth < ii.width ? ii.thumburl : ii.url),
    width: ii.width,
    height: ii.height,
    author: strip(em.Artist?.value) || 'Autor desconhecido',
    license: strip(em.LicenseShortName?.value) || 'ver página do arquivo',
    licenseUrl: em.LicenseUrl?.value || undefined,
    source: ii.descriptionurl,
  };
}

async function main() {
  const sources = JSON.parse(await readFile(sourcesFile, 'utf8'));
  const meta = existsSync(metaFile) ? JSON.parse(await readFile(metaFile, 'utf8')) : {};
  await mkdir(outDir, { recursive: true });

  for (const src of sources) {
    const widths = src.widths ?? [640, 1024, 1600];
    const max = Math.max(...widths);
    const done =
      !force &&
      meta[src.id]?.file === src.file &&
      widths.every((w) => existsSync(path.join(outDir, `${src.id}-${w}.webp`)));
    if (done) continue;

    console.log(`• ${src.id}  ←  ${src.file}`);
    let info;
    let buf;
    const localJpg = localDir && path.join(localDir, `${src.id}.jpg`);
    if (localJpg && existsSync(localJpg)) {
      info = JSON.parse(await readFile(path.join(localDir, `${src.id}.json`), 'utf8'));
      buf = await readFile(localJpg);
    } else {
      info = await commonsInfo(src.file, max >= 1600 ? 1920 : 1280);
      buf = await get(info.download, 'buffer');
    }
    const img = sharp(buf).rotate();
    const { width = 0, height = 0 } = await img.metadata();
    const usable = widths.filter((w) => w <= width);
    if (usable.length === 0) usable.push(width);

    for (const w of usable) {
      await sharp(buf)
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: w <= 640 ? 70 : 74, effort: 5 })
        .toFile(path.join(outDir, `${src.id}-${w}.webp`));
    }

    const { dominant } = await sharp(buf).resize(32).stats();
    const hex = (n) => n.toString(16).padStart(2, '0');

    meta[src.id] = {
      file: src.file,
      widths: usable,
      ratio: Number((width / height).toFixed(4)),
      color: `#${hex(dominant.r)}${hex(dominant.g)}${hex(dominant.b)}`,
      credit: {
        author: info.author,
        license: info.license,
        licenseUrl: info.licenseUrl || ccUrl(info.license),
        source: info.source,
      },
    };
    await writeFile(metaFile, JSON.stringify(meta, null, 2) + '\n');
  }

  const entries = sources
    .filter((s) => meta[s.id])
    .map((s) => {
      const m = meta[s.id];
      return {
        id: s.id,
        alt: s.alt,
        widths: m.widths,
        ratio: m.ratio,
        color: m.color,
        ...(s.focus ? { focus: s.focus } : {}),
        credit: m.credit,
      };
    });

  const ts = `// Arquivo gerado por scripts/fetch-images.mjs — não edite à mão.
// Para trocar fotos, edite scripts/photo-sources.json e rode \`npm run images\`.
import type { Photo } from '../types/itinerary';

const list: Photo[] = ${JSON.stringify(entries, null, 2)};

export const photos: Record<string, Photo> = Object.fromEntries(list.map((p) => [p.id, p]));
`;
  await writeFile(tsFile, ts);
  console.log(`\n✓ ${entries.length} fotos em public/images e src/data/photos.ts atualizado.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
