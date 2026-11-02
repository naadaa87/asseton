/* 요금 페이지 — 플랜 추천과 (요금 공개 시) 월 예상 금액 */
(function () {
  const cfg = (window.ASSETON_CONFIG || {}).pricing || {};
  const won = (n) => Math.round(n).toLocaleString('ko-KR') + '원';
  const form = document.querySelector('[data-finder]');
  const out = document.querySelector('[data-finder-out]');
  if (!form || !out) return;

  // 요금 공개 시 플랜 카드에 금액 표시
  if (cfg.published && cfg.plans) {
    document.querySelectorAll('[data-plan]').forEach((el) => {
      const p = cfg.plans[el.getAttribute('data-plan')];
      if (!p || !(p.base > 0)) return;
      el.querySelector('[data-price]').innerHTML = `월 <b>${p.base.toLocaleString('ko-KR')}</b>원<small>건물 ${p.includedBuildings}동 포함, 추가 동당 ${(p.extraBuilding || 0).toLocaleString('ko-KR')}원 · 부가세 별도</small>`;
    });
    const note = document.querySelector('[data-estimate-note]');
    if (note) note.textContent = '월 예상 금액은 부가세 별도이며, 건당 과금 항목은 예시 사용량으로 계산했습니다.';
  }

  const NAMES = { starter: '스타터', standard: '스탠다드', pro: '프로', enterprise: '엔터프라이즈' };

  function recommend(b, u, level) {
    if (b > 100) return 'enterprise';
    if (level >= 3 || b > 30) return 'pro';
    if (level >= 2 || b > 5 || u > 100) return 'standard';
    return 'starter';
  }

  function render() {
    const fd = new FormData(form);
    const b = Math.max(1, parseInt(fd.get('buildings'), 10) || 1);
    const u = Math.max(0, parseInt(fd.get('units'), 10) || 0);
    const needs = [...form.querySelectorAll('input[name="need"]:checked')];
    const level = needs.reduce((m, x) => Math.max(m, +x.dataset.level), 1);
    const plan = recommend(b, u, level);
    const why = [];
    if (b > 100) why.push('관리 건물이 100동을 넘습니다');
    else if (b > 30) why.push('관리 건물이 30동을 넘습니다');
    else if (b > 5) why.push('관리 건물이 5동을 넘습니다');
    if (u > 100 && plan === 'standard' && b <= 5) why.push('호실 수가 스타터 상한(100실)을 넘습니다');
    const needWhy = needs.filter((x) => +x.dataset.level === level && level > 1).map((x) => x.parentElement.textContent.trim());
    if (needWhy.length) why.push(`${needWhy.join(', ')} 기능이 ${NAMES[plan]}부터 들어 있습니다`);

    let price = '';
    if (cfg.published && cfg.plans && cfg.plans[plan] && cfg.plans[plan].base > 0) {
      const p = cfg.plans[plan];
      const extra = Math.max(0, b - (p.includedBuildings || 0)) * (p.extraBuilding || 0);
      const monthly = p.base + extra;
      const msgs = u * 2; // 호실당 월 2건(고지 + 안내) 가정
      const addon = msgs * (cfg.addons?.alimtalk || 0) + u * (cfg.addons?.taxInvoice || 0);
      price = `<div class="sum-box"><div><span>기본료</span><b>${won(p.base)}</b></div><div><span>추가 건물 ${Math.max(0, b - p.includedBuildings)}동</span><b>${won(extra)}</b></div><div><span>월 예상 (알림톡·세금계산서 포함)</span><b>${won(monthly + addon)}</b></div></div><p class="note mt-2">알림톡은 호실당 월 2건, 세금계산서는 호실당 월 1건으로 가정했습니다. 연 결제 시 ${Math.round((cfg.yearlyDiscount || 0) * 100)}% 할인됩니다.</p>`;
    }

    out.innerHTML = `<div class="callout"><b>${NAMES[plan]} 플랜이 맞습니다.</b><br>${why.length ? why.join('. ') + '.' : '건물 5동 이하, 현장 기록과 관리비 중심이면 스타터로 충분합니다.'}</div>${price}<p class="mt-2"><a class="btn btn-primary btn-sm" href="/signup?plan=${plan}&buildings=${b}">${NAMES[plan]}로 사전 신청</a></p>`;
  }
  form.addEventListener('submit', (e) => e.preventDefault());
  form.addEventListener('input', render);
  render();
})();
