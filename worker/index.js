// 에셋온 홈페이지 Worker
// 정적 페이지는 public/ 에서 바로 나가고, /api/* 요청만 이 코드가 처리합니다.
//
// 환경 변수 (Cloudflare 대시보드 > Workers > asseton > 설정 > 변수 및 비밀)
//   RESEND_API_KEY   (비밀)  Resend API 키. 신청 내용을 이메일로 받습니다.
//   INQUIRY_TO       (변수)  신청을 받을 이메일 주소. 쉼표로 여러 개.
//   INQUIRY_FROM     (변수)  보내는 사람. 예: 에셋온 <hello@asseton.co.kr> (Resend에서 인증한 도메인)
//   TURNSTILE_SECRET (비밀, 선택) 자동 입력 방지. site-config.js 의 turnstileSiteKey 와 짝.
//   INQUIRIES        (KV 바인딩, 선택) 신청 내용을 1년간 보관. 이메일이 실패해도 남습니다.

const TYPES = { preorder: '사전 신청', demo: '데모 요청', pilot: '파일럿 참여', partner: '파트너 제휴' };
const CTYPES = ['FM 시설관리 회사', 'PM 자산운영 회사', 'FM·PM 함께 하는 회사', '자산운용사·AMC·리츠', '건물주·관리단', '점검·유지보수 협력업체', '기타'];
const BUILDINGS = ['1~5동', '6~10동', '11~30동', '31~100동', '100동 넘음'];
const PLANS = ['', 'starter', 'standard', 'pro', 'enterprise'];
const TOOLS = ['엑셀', '종이 양식', '카카오톡 단톡방', '다른 관리 프로그램', '회계 프로그램'];
const YEAR = 365 * 24 * 60 * 60;

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' },
});
const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/health') {
      return json({ ok: true, email: Boolean(env.RESEND_API_KEY && env.INQUIRY_TO), store: Boolean(env.INQUIRIES), turnstile: Boolean(env.TURNSTILE_SECRET) });
    }
    if (url.pathname === '/api/inquiry') {
      if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405);
      try {
        return await inquiry(request, env, ctx, url);
      } catch (err) {
        console.error('inquiry failed', err && err.stack ? err.stack : err);
        return json({ ok: false, error: 'server' }, 500);
      }
    }
    if (url.pathname.startsWith('/api/')) return json({ ok: false, error: 'not_found' }, 404);
    return env.ASSETS.fetch(request);
  },
};

async function inquiry(request, env, ctx, url) {
  // 같은 사이트에서 보낸 요청만 받습니다.
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== url.host) return json({ ok: false, error: 'origin' }, 403);
  if (!(request.headers.get('content-type') || '').includes('application/json')) return json({ ok: false, error: 'type' }, 415);
  const raw = await request.text();
  if (raw.length > 20000) return json({ ok: false, error: 'too_large' }, 413);
  let d;
  try { d = JSON.parse(raw); } catch { return json({ ok: false, error: 'json' }, 400); }

  // 숨긴 칸에 값이 있으면 자동 입력으로 보고 조용히 버립니다.
  if (str(d.website, 200)) return json({ ok: true });

  const f = {
    type: TYPES[d.type] ? d.type : 'preorder',
    company: str(d.company, 80),
    bizno: str(d.bizno, 12),
    name: str(d.name, 40),
    title: str(d.title, 40),
    phone: str(d.phone, 20),
    email: str(d.email, 120),
    ctype: CTYPES.includes(d.ctype) ? d.ctype : '',
    buildings: BUILDINGS.includes(d.buildings) ? d.buildings : '',
    plan: PLANS.includes(d.plan) ? d.plan : '',
    tools: Array.isArray(d.tools) ? d.tools.filter((t) => TOOLS.includes(t)).slice(0, TOOLS.length) : [],
    message: str(d.message, 2000),
    page: str(d.page, 200),
  };
  const bad = [];
  if (!f.company) bad.push('회사명');
  if (!f.name) bad.push('담당자 이름');
  const digits = f.phone.replace(/\D/g, '');
  if (digits.length < 9 || digits.length > 11) bad.push('휴대폰');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) bad.push('이메일');
  if (!f.ctype) bad.push('회사 유형');
  if (!f.buildings) bad.push('관리하는 건물 수');
  if (d.consent !== true) bad.push('개인정보 수집·이용 동의');
  if (bad.length) return json({ ok: false, error: 'invalid', fields: bad }, 400);

  const ip = request.headers.get('cf-connecting-ip') || '';
  if (env.TURNSTILE_SECRET) {
    const form = new FormData();
    form.append('secret', env.TURNSTILE_SECRET);
    form.append('response', str(d.turnstile, 4096));
    if (ip) form.append('remoteip', ip);
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    const v = await r.json().catch(() => ({}));
    if (!v.success) return json({ ok: false, error: 'invalid', fields: ['자동 입력 방지 확인'] }, 400);
  }

  const canEmail = Boolean(env.RESEND_API_KEY && env.INQUIRY_TO);
  if (!canEmail && !env.INQUIRIES) return json({ ok: false, error: 'not_configured' }, 503);

  const now = new Date();
  const id = `${now.toISOString().slice(0, 10)}-${crypto.randomUUID().slice(0, 8)}`;
  const record = { id, receivedAt: now.toISOString(), ...f, consent: true, ip, country: request.cf?.country || '', ua: str(request.headers.get('user-agent') || '', 300) };

  let stored = false;
  if (env.INQUIRIES) {
    try {
      await env.INQUIRIES.put(`inquiry:${id}`, JSON.stringify(record), { expirationTtl: YEAR });
      stored = true;
    } catch (err) {
      console.error('kv put failed', err);
    }
  }

  let sent = false;
  if (canEmail) {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: env.INQUIRY_FROM || '에셋온 홈페이지 <onboarding@resend.dev>',
        to: env.INQUIRY_TO.split(',').map((s) => s.trim()).filter(Boolean),
        reply_to: f.email,
        subject: `[에셋온 ${TYPES[f.type]}] ${f.company} ${f.name}`,
        text: mailText(record),
      }),
    });
    sent = r.ok;
    if (!r.ok) console.error('resend failed', r.status, await r.text().catch(() => ''));
  }

  if (!sent && !stored) return json({ ok: false, error: 'delivery' }, 502);
  return json({ ok: true, id });
}

function mailText(r) {
  const plan = { starter: '스타터', standard: '스탠다드', pro: '프로', enterprise: '엔터프라이즈' }[r.plan] || '정하지 않음';
  return [
    `에셋온 홈페이지로 ${TYPES[r.type]}이 들어왔습니다.`,
    '',
    `접수 번호  ${r.id}`,
    `접수 시각  ${new Date(r.receivedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`,
    '',
    `회사명     ${r.company}`,
    `사업자번호 ${r.bizno || '-'}`,
    `담당자     ${r.name}${r.title ? ` (${r.title})` : ''}`,
    `휴대폰     ${r.phone}`,
    `이메일     ${r.email}`,
    `회사 유형  ${r.ctype}`,
    `건물 수    ${r.buildings}`,
    `관심 플랜  ${plan}`,
    `지금 쓰는 방식  ${r.tools.length ? r.tools.join(', ') : '-'}`,
    '',
    '남긴 말',
    r.message || '-',
    '',
    `보낸 페이지 ${r.page || '-'}`,
    '',
    '개인정보 수집·이용 동의를 받았습니다. 문의일로부터 1년이 지나면 파기해 주세요.',
  ].join('\n');
}
