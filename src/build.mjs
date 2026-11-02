// 에셋온 홈페이지 생성기 — `node src/build.mjs`
// public/ 아래에 HTML, sitemap.xml, robots.txt 를 만듭니다. (CSS·JS·폰트·이미지는 public/assets 에 직접 있습니다)
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE } from './site.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const pages = [];
const out = (path, html, { sitemap = true, priority = '0.6' } = {}) => {
  // path: '/' | '/pricing' | '/features/' | '/features/fm'
  let file = path.endsWith('/') ? join(path, 'index.html') : `${path}.html`;
  const full = join(ROOT, file);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html);
  if (sitemap) pages.push({ path, priority });
};

const load = async (m) => import(`./pages/${m}.mjs`);

const { home } = await load('home');
out('/', home(), { priority: '1.0' });

const features = await load('features');
for (const [p, fn, pr] of features.ROUTES) out(p, fn(), { priority: pr });

const solutions = await load('solutions');
for (const [p, fn] of solutions.ROUTES) out(p, fn(), { priority: '0.8' });

const pricing = await load('pricing');
out('/pricing', pricing.pricing(), { priority: '0.9' });

const demo = await load('demo');
for (const [p, fn] of demo.ROUTES) out(p, fn(), { priority: '0.8' });

const misc = await load('misc');
for (const [p, fn, opt] of misc.ROUTES) out(p, fn(), opt || {});

const insights = await load('insights');
for (const [p, fn] of insights.ROUTES) out(p, fn(), { priority: '0.7' });

// sitemap · robots
if (SITE.url) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${SITE.url}${p.path}</loc><lastmod>${SITE.updated}</lastmod><priority>${p.priority}</priority></url>`).join('\n')}\n</urlset>\n`;
  writeFileSync(join(ROOT, 'sitemap.xml'), xml);
} else {
  rmSync(join(ROOT, 'sitemap.xml'), { force: true });
}
writeFileSync(join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\n${SITE.url ? `\nSitemap: ${SITE.url}/sitemap.xml\n` : ''}`);

console.log(`생성 완료: ${pages.length}개 페이지${SITE.url ? ` (도메인 ${SITE.url})` : ' (SITE_URL 미설정 — canonical·sitemap 생략)'}`);
