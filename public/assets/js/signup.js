// 에셋온 사전 신청 양식 — POST /api/inquiry (worker/index.js)
(function () {
  const form = document.querySelector('[data-signup]');
  if (!form) return;
  const cfg = window.ASSETON_CONFIG || {};
  const statusBox = form.querySelector('[data-form-status]');
  const submitBtn = form.querySelector('[data-submit]');
  const params = new URLSearchParams(location.search);

  // 주소의 ?type=pilot, ?plan=standard 를 양식에 미리 반영
  const type = params.get('type');
  if (type) { const r = form.querySelector(`input[name="type"][value="${CSS.escape(type)}"]`); if (r) r.checked = true; }
  const plan = params.get('plan');
  const planField = form.querySelector('[data-plan-field]');
  if (plan && planField) { planField.hidden = false; form.elements.plan.value = plan; }
  const b = params.get('buildings');
  if (b && form.elements.buildings) {
    const n = parseInt(b, 10);
    const label = n <= 5 ? '1~5동' : n <= 10 ? '6~10동' : n <= 30 ? '11~30동' : n <= 100 ? '31~100동' : '100동 넘음';
    if (n > 0) form.elements.buildings.value = label;
  }

  // 사업자등록번호 000-00-00000
  form.elements.bizno.addEventListener('input', (e) => {
    const d = e.target.value.replace(/\D/g, '').slice(0, 10);
    e.target.value = d.length > 5 ? `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}` : d.length > 3 ? `${d.slice(0, 3)}-${d.slice(3)}` : d;
  });

  // 자동 입력 방지 (Cloudflare Turnstile) — site-config.js 에 키가 있을 때만
  let tsToken = '';
  if (cfg.turnstileSiteKey) {
    window.__tsReady = function () {
      window.turnstile.render(form.querySelector('[data-turnstile]'), {
        sitekey: cfg.turnstileSiteKey, language: 'ko',
        callback: (t) => { tsToken = t; }, 'expired-callback': () => { tsToken = ''; },
      });
    };
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=__tsReady&render=explicit';
    s.async = true; s.defer = true;
    document.head.appendChild(s);
  }

  const show = (kind, html) => { statusBox.hidden = false; statusBox.className = `form-status ${kind}`; statusBox.innerHTML = html; };
  const setInvalid = (el, bad) => el.setAttribute('aria-invalid', bad ? 'true' : 'false');

  function check() {
    const f = form.elements;
    const bad = [];
    const need = [['company', '회사명'], ['name', '담당자 이름'], ['phone', '휴대폰'], ['email', '이메일'], ['ctype', '회사 유형'], ['buildings', '관리하는 건물 수']];
    for (const [k, label] of need) { const empty = !String(f[k].value).trim(); setInvalid(f[k], empty); if (empty) bad.push(label); }
    const phoneDigits = f.phone.value.replace(/\D/g, '');
    if (f.phone.value.trim() && (phoneDigits.length < 9 || phoneDigits.length > 11)) { setInvalid(f.phone, true); bad.push('휴대폰 번호 형식'); }
    if (f.email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) { setInvalid(f.email, true); bad.push('이메일 형식'); }
    if (!f.consent.checked) bad.push('개인정보 수집·이용 동의');
    if (cfg.turnstileSiteKey && !tsToken) bad.push('자동 입력 방지 확인');
    return bad;
  }

  function fallback() {
    const email = cfg.contact && cfg.contact.email;
    const phone = cfg.contact && cfg.contact.phone;
    if (!email && !phone) return '잠시 후 다시 보내 주세요.';
    const f = form.elements;
    const text = `회사명: ${f.company.value}\n담당자: ${f.name.value}\n휴대폰: ${f.phone.value}\n이메일: ${f.email.value}\n회사 유형: ${f.ctype.value}\n건물 수: ${f.buildings.value}\n\n${f.message.value}`;
    const parts = [];
    if (email) parts.push(`<a href="mailto:${email}?subject=${encodeURIComponent('에셋온 사전 신청')}&body=${encodeURIComponent(text)}">이메일로 보내기</a>`);
    if (phone) parts.push(`전화 <a href="tel:${phone.replace(/[^0-9+]/g, '')}">${phone}</a>`);
    return `입력하신 내용으로 ${parts.join(' 또는 ')}를 이용해 주세요.`;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const bad = check();
    if (bad.length) { show('err', `다음 항목을 확인해 주세요. ${bad.join(', ')}`); const first = form.querySelector('[aria-invalid="true"]'); if (first) first.focus(); return; }
    const f = form.elements;
    const data = {
      type: (form.querySelector('input[name="type"]:checked') || {}).value || 'preorder',
      company: f.company.value.trim(), bizno: f.bizno.value.trim(), name: f.name.value.trim(), title: f.title.value.trim(),
      phone: f.phone.value.trim(), email: f.email.value.trim(), ctype: f.ctype.value, buildings: f.buildings.value,
      plan: f.plan ? f.plan.value : '', tools: [...form.querySelectorAll('input[name="tools"]:checked')].map((x) => x.value),
      message: f.message.value.trim(), consent: true, website: f.website.value, turnstile: tsToken, page: location.pathname + location.search,
    };
    submitBtn.disabled = true; submitBtn.textContent = '보내는 중';
    try {
      const res = await fetch('/api/inquiry', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
      const out = await res.json().catch(() => ({}));
      if (res.ok && out.ok) {
        form.innerHTML = `<div class="form-status ok" role="status"><b>신청을 받았습니다.</b><br>${data.name}님께 영업일 이틀 안에 연락드리겠습니다. 신청 내용은 담당자에게 바로 전달되었습니다.</div><p class="mt-3"><a class="btn btn-line" href="/demo/">기다리는 동안 체험판 써 보기</a></p>`;
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (res.status === 400 && out.error === 'invalid') { show('err', `다음 항목을 확인해 주세요. ${(out.fields || []).join(', ') || '입력값'}`); }
      else show('err', `신청을 보내지 못했습니다. ${fallback()}`);
    } catch (err) {
      show('err', `네트워크 연결을 확인해 주세요. ${fallback()}`);
    }
    submitBtn.disabled = false; submitBtn.textContent = '신청 보내기';
    if (window.turnstile && cfg.turnstileSiteKey) { try { window.turnstile.reset(); tsToken = ''; } catch (_) {} }
  });

  form.addEventListener('input', (e) => { if (e.target.getAttribute('aria-invalid') === 'true') setInvalid(e.target, false); });
})();
