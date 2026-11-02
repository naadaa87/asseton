// 레이아웃·공통 컴포넌트
import { SITE, COMPANY, NAV, FOOT, LAUNCH } from '../site.mjs';

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------- 아이콘 (stroke 24) ----------
const P = {
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L4 16.8V20h3.2l5.3-5.3a4 4 0 0 0 5.2-5.4l-2.4 2.4-2.6-.6-.6-2.6z"/>',
  receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  quote: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 20a6 6 0 0 0-2.5-5"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12l2 2 4-4"/>',
  building: '<path d="M4 21V5l8-3v19M12 8h8v13M8 8h.01M8 12h.01M8 16h.01M16 12h.01M16 16h.01M2 21h20"/>',
  calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>',
  doc: '<path d="M6 3h9l4 4v14H6z"/><path d="M9 11h7M9 15h7"/>',
  bell: '<path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  db: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chev: '<path d="M6 9l6 6 6-6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  monitor: '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  flow: '<circle cx="5" cy="12" r="2.5"/><circle cx="19" cy="6" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M7.5 12h4l5-6M11.5 12l5 6"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/>',
  plug: '<path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0zM12 17v5"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  report: '<path d="M6 3h12v18H6z"/><path d="M9 15v2M12 11v6M15 8v9"/>',
  excel: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M4 15h16M10 3v18"/>',
};
export const icon = (name, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ''}</svg>`;

export const brandMark = (cls = 'brand-mark') => `<svg class="${cls}" viewBox="0 0 32 32" aria-hidden="true"><rect x="1" y="1" width="30" height="30" rx="8" fill="#0f1c36"/><circle cx="16" cy="16" r="7.2" fill="none" stroke="#2b3a59" stroke-width="2"/><circle cx="16" cy="16" r="4.4" fill="#17a35f"/><circle cx="14.6" cy="14.6" r="1.3" fill="#bdebd1"/></svg>`;

// ---------- 링크 ----------
export const abs = (path) => (SITE.url ? SITE.url + path : path);

// ---------- 헤더 ----------
function header(activeKey) {
  const items = NAV.map((n) => {
    if (n.items) {
      const id = `dd-${n.key}`;
      const links = n.items.map((it, i) => `${i === 1 && n.key === 'features' ? '<hr>' : ''}<a href="${it.href}"><b>${esc(it.title)}</b><span>${esc(it.desc)}</span></a>`).join('');
      return `<li><button class="menu" type="button" aria-expanded="false" aria-controls="${id}"${activeKey === n.key ? ' data-active="true"' : ''}>${esc(n.label)}${icon('chev')}</button><div class="dropdown" id="${id}">${links}</div></li>`;
    }
    return `<li><a href="${n.href}"${activeKey === n.key ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`;
  }).join('');
  const mobile = NAV.map((n) => {
    if (n.items) return `<div class="grp">${esc(n.label)}</div>` + n.items.map((it) => `<a href="${it.href}">${esc(it.title)}</a>`).join('');
    return `<a href="${n.href}">${esc(n.label)}</a>`;
  }).join('');
  return `<a class="skip" href="#main">본문으로 바로가기</a>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="/" aria-label="에셋온 홈">${brandMark()}<span class="brand-name">AssetOn<span>에셋온</span></span></a>
    <nav aria-label="주 메뉴"><ul class="gnb">${items}</ul></nav>
    <div class="header-cta">
      <a class="btn btn-ghost btn-sm" href="/demo/">체험판</a>
      <a class="btn btn-primary btn-sm" href="/signup">사전 신청</a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="mnav" aria-label="메뉴 열기">${icon('menu')}</button>
    </div>
  </div>
</header>
<nav class="mobile-nav" id="mnav" aria-label="모바일 메뉴">${mobile}<a href="/about">회사 소개</a><a href="/roadmap">출시 일정</a><a href="/help/">도움말</a><a class="btn btn-primary" href="/signup">사전 신청</a></nav>`;
}

// ---------- 푸터 ----------
function footer() {
  const cols = FOOT.map((c) => `<div><h4>${esc(c.title)}</h4><ul>${c.links.map(([t, h]) => `<li><a href="${h}">${esc(t)}</a></li>`).join('')}</ul></div>`).join('');
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="foot-top">
      <div class="foot-brand">
        <a class="brand" href="/" aria-label="에셋온 홈">${brandMark()}<span class="brand-name">AssetOn<span>에셋온</span></span></a>
        <p>Asset Management System ON(AMSO). FM·PM·AM 관리회사가 현장 기록부터 관리비, 월간 보고, 포트폴리오 숫자까지 한 흐름으로 관리하는 구독형 자산관리시스템입니다.</p>
        <p class="status-line mt-2"><span class="lamp"></span>${esc(LAUNCH.statusShort)}</p>
      </div>
      ${cols}
    </div>
    <div class="foot-biz">
      <dl>
        <div><dt>상호</dt><dd>${esc(COMPANY.name)}</dd></div>
        <div><dt>대표</dt><dd>${esc(COMPANY.ceo)}</dd></div>
        <div><dt>사업자등록번호</dt><dd>${esc(COMPANY.bizNo)}</dd></div>
        <div><dt>주소</dt><dd>${esc(COMPANY.address)}</dd></div>
        <div data-contact="email" hidden><dt>이메일</dt><dd></dd></div>
        <div data-contact="phone" hidden><dt>전화</dt><dd></dd></div>
        ${COMPANY.mailOrder ? `<div><dt>통신판매업</dt><dd>${esc(COMPANY.mailOrder)}</dd></div>` : ''}
      </dl>
      <div class="legal-links"><a href="/legal/privacy">개인정보처리방침</a><a href="/legal/terms">이용약관</a><a href="/legal/sla">서비스 수준</a></div>
      <p>© 2026 ${esc(COMPANY.name)}. 에셋온(AssetOn)은 ${esc(COMPANY.name)}가 개발·운영합니다.</p>
    </div>
  </div>
</footer>`;
}

// ---------- 페이지 ----------
export function page({ path, title, description, active = '', body, scripts = [], jsonld = [], noindex = false, ogType = 'website' }) {
  const fullTitle = title.includes('AssetOn') || title.includes('에셋온') ? title : `${title} | 에셋온 AssetOn`;
  const canonical = SITE.url ? `<link rel="canonical" href="${SITE.url}${path}">` : '';
  const ogUrl = SITE.url ? `<meta property="og:url" content="${SITE.url}${path}">` : '';
  const ogImg = SITE.url ? `${SITE.url}/assets/img/og.png` : '/assets/img/og.png';
  const ld = jsonld.length ? jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`).join('\n') : '';
  const js = ['/assets/js/site-config.js', '/assets/js/site.js', ...scripts].map((s) => s.endsWith('.mjs') || s.includes('/demo-') ? `<script type="module" src="${s}"></script>` : `<script src="${s}" defer></script>`).join('\n');
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">' : ''}
${canonical}
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="에셋온 AssetOn">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
${ogUrl}
<meta property="og:image" content="${ogImg}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="ko_KR">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0f1c36">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/asseton-sans-kr-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/asseton-sans-kr-600.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css">
${ld}
</head>
<body>
${header(active)}
<main id="main">
${body}
</main>
${footer()}
${js}
</body>
</html>
`;
}

// ---------- 컴포넌트 ----------
export const crumbs = (items) => `<p class="crumb"><a href="/">홈</a>${items.map(([t, h]) => ` / ${h ? `<a href="${h}">${esc(t)}</a>` : esc(t)}`).join('')}</p>`;

export function pageHero({ crumb = [], title, lede, actions = '', art = '' }) {
  const inner = `<div>${crumbs(crumb)}<h1>${title}</h1>${lede ? `<p class="lede">${lede}</p>` : ''}${actions ? `<div class="actions">${actions}</div>` : ''}</div>`;
  return `<section class="page-hero${art ? ' with-art' : ''}"><div class="wrap">${inner}${art ? `<div>${art}</div>` : ''}</div></section>`;
}

export const btn = (label, href, kind = 'primary', extra = '') => `<a class="btn btn-${kind} ${extra}" href="${href}">${esc(label)}</a>`;

export function faq(items) {
  return `<div class="faq">${items.map(([q, a]) => `<details><summary>${esc(q)}</summary><div class="a">${a}</div></details>`).join('')}</div>`;
}
export const faqLd = (items) => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })),
});

export function table(head, rows, cls = 'table') {
  return `<div class="table-scroll"><table class="${cls}"><thead><tr>${head.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td${i === 0 ? ' class="k"' : ''}>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

export function ctaBand(title = '첫 관리회사들과 함께 만들고 있습니다', text = `에셋온은 ${LAUNCH.pilot} 파일럿 관리회사의 현장에서 먼저 운영합니다. 사전 신청을 남기시면 파일럿 참여 조건과 출시 일정을 가장 먼저 안내드립니다.`) {
  return `<section class="cta-band"><div class="wrap"><div><h2>${title}</h2><p>${text}</p></div><div class="actions"><a class="btn btn-on btn-lg" href="/signup">사전 신청하기</a><a class="btn btn-line btn-lg" href="/demo/">체험판 써 보기</a></div></div></section>`;
}

export const sec = (inner, cls = '', id = '') => `<section class="section ${cls}"${id ? ` id="${id}"` : ''}><div class="wrap">${inner}</div></section>`;
export const head = (h, p = '', cls = '') => `<div class="sec-head ${cls}"><h2>${h}</h2>${p ? `<p>${p}</p>` : ''}</div>`;

export const orgLd = () => ({
  '@context': 'https://schema.org', '@type': 'Organization', name: COMPANY.name, alternateName: COMPANY.nameEn,
  ...(SITE.url ? { url: SITE.url, logo: SITE.url + '/assets/img/apple-touch-icon.png' } : {}),
  address: { '@type': 'PostalAddress', addressCountry: 'KR', addressRegion: '경기도', addressLocality: '화성시', streetAddress: '병점구 경기대로 1014, 6층' },
});
export const appLd = () => ({
  '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: '에셋온 AssetOn', alternateName: 'AMSO — Asset Management System ON',
  applicationCategory: 'BusinessApplication', applicationSubCategory: '부동산 자산관리·시설관리 SaaS', operatingSystem: 'Web',
  description: 'FM·PM·AM 관리회사를 위한 구독형 자산관리시스템. 점검·작업·법정점검·근무·민원, 임대차·관리비·수납·월간 보고, 포트폴리오·NOI·예산을 한 흐름으로 관리합니다.',
  publisher: { '@type': 'Organization', name: COMPANY.name },
  ...(SITE.url ? { url: SITE.url } : {}),
});
export const breadcrumbLd = (items) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [['홈', '/'], ...items].map(([n, p], i) => ({ '@type': 'ListItem', position: i + 1, name: n, ...(SITE.url && p ? { item: SITE.url + p } : {}) })),
});
