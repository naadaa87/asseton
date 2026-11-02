// 에셋온 체험판 · FM 견적 계산 (실제 견적 엔진 코드 사용)
import { calcQuote, calcRole } from './quote/engine.js';
import { RATE_PRESETS, makeRates, ROLE_LIBRARY, TEMPLATES, createRole, SHIFT_DEFAULTS, SHIFT_TYPES, LIB_WAGE_YEAR, GROUPS } from './quote/presets.js';

const form = document.querySelector('[data-quote]');
const rowsBox = form.querySelector('[data-rows]');
const addSel = form.querySelector('[data-add-role]');
const ratesBox = form.querySelector('[data-rates]');
const out = document.querySelector('[data-q-out]');
const detailSel = document.querySelector('[data-detail-role]');
const detailBox = document.querySelector('[data-q-detail]');

const fmt = (x) => Math.round(x).toLocaleString('ko-KR');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pct = (x) => `${+(x * 100).toFixed(3)}%`;

// 라이브러리 시급(2024년 견적서 기준)을 최저임금 인상률만큼 올리되, 해당 연도 최저시급 아래로는 내려가지 않게
function scaleWage(wage, to) {
  const from = RATE_PRESETS[LIB_WAGE_YEAR].minWage;
  const toMin = RATE_PRESETS[to].minWage;
  return Math.max(Math.round(wage * (toMin / from)), toMin);
}
const libOf = (role) => ROLE_LIBRARY.find((l) => l.key === role.libKey);
const roleName = (r) => `${r.title}${r.subtitle ? ` (${r.subtitle})` : ''}`;

let year = Number(form.elements.year.value);
let roles = [];
let detailId = '';

function loadTemplate(key) {
  const t = TEMPLATES.find((x) => x.key === key) || TEMPLATES[0];
  roles = t.roles().map((r) => ({ ...r, hourlyWage: scaleWage(libOf(r).wage, year), wageEdited: false }));
  detailId = roles[0]?.id || '';
}

const dayBaseOf = (group) => ({ facility: 'facilityDay', security: 'securityDay', cleaning: 'cleaningDay' }[group] || 'securityDay');
function applyShift(role, shift) {
  const base = shift === 'shift3' ? 'facility3' : shift === 'shift2' ? 'security24' : dayBaseOf(role.group);
  const d = SHIFT_DEFAULTS[base];
  const lib = libOf(role);
  Object.assign(role, {
    shift: d.shift, hoursText: d.hoursText, dayHours: d.dayHours, dayBreak: d.dayBreak, nightHours: d.nightHours, nightBreak: d.nightBreak,
    overtimeHours: shift === 'day5' ? (lib.overtimeHours ?? d.overtimeHours) : d.overtimeHours,
    nightCheck: shift === 'day5' ? (role.group === 'security' && !!lib.nightCheck) : true,
    laborDay: shift === 'day5' ? (role.group === 'security' && !!lib.laborDay) : true,
  });
}

function drawRates() {
  const r = makeRates(year);
  const p = RATE_PRESETS[year];
  ratesBox.innerHTML = `최저시급 ${fmt(r.minWage)}원, 국민연금 ${pct(r.pension)}, 건강보험 ${pct(r.health)}, 장기요양 건보료의 ${pct(r.ltcRatio)}, 산재 ${pct(r.injury)}, 고용 ${pct(r.employment + r.employmentStab)}${p.pending.length ? '<br>일부 요율은 고시 전이라 전년 값을 씁니다.' : ''}`;
}

function drawRows() {
  const r = makeRates(year);
  rowsBox.innerHTML = roles.map((role) => {
    const g = GROUPS[role.group]?.short || '';
    const wage = role.minLinked ? r.minWage : role.hourlyWage;
    const low = !role.minLinked && wage < r.minWage;
    return `<div class="qrow" data-id="${role.id}">
      <span class="q-title" style="min-width:0"><b style="color:var(--ink);font-weight:600">${esc(roleName(role))}</b><span class="note" style="display:block;font-size:var(--fs-13)">${esc(g)}${role.license ? `, ${esc(role.license)}` : ''}</span></span>
      <input class="input q-count" type="number" min="0" max="99" value="${role.count}" data-k="count" aria-label="${esc(roleName(role))} 인원">
      <select class="select shift q-shift" data-k="shift" aria-label="${esc(roleName(role))} 근무형태">${['day5', 'shift3', 'shift2'].map((s) => `<option value="${s}"${role.shift === s ? ' selected' : ''}>${SHIFT_TYPES[s].label}</option>`).join('')}</select>
      <input class="input q-wage" type="number" min="0" step="1" value="${wage}" data-k="wage" aria-label="${esc(roleName(role))} 시급"${role.minLinked ? ' disabled title="최저시급과 연동"' : ''}${low ? ' aria-invalid="true"' : ''}>
      <button class="icon-btn q-del" type="button" data-del aria-label="${esc(roleName(role))} 삭제">×</button>
    </div>`;
  }).join('') || '<p class="note" style="padding:14px 0">직책을 추가하세요.</p>';
}

function render() {
  const rates = makeRates(year);
  const q = calcQuote({ rates, roles, extras: { maintenance: [], depreciation: [] } });
  const lowWage = roles.filter((r) => !r.minLinked && r.hourlyWage < rates.minWage);

  let html = `<div class="sum-box rows" style="margin-top:0"><div><span>인원</span><b>${q.headcount}명</b></div><div><span>연간 (부가세 별도)</span><b>${fmt(q.grandAnnual)}원</b></div><div><span>월 견적 (부가세 별도)</span><b>${fmt(q.grand)}원</b></div></div>`;
  if (lowWage.length) html += `<p class="form-status err mt-2">${lowWage.map((r) => esc(roleName(r))).join(', ')}의 시급이 ${year}년 최저시급 ${fmt(rates.minWage)}원보다 낮습니다. 실제 서비스에서는 이 상태로 견적서를 보낼 수 없습니다.</p>`;
  html += `<div class="table-scroll mt-3"><table class="table"><thead><tr><th>구분</th><th class="r">인원</th><th class="r">월 금액 (원)</th></tr></thead><tbody>`;
  for (const g of q.groups) html += `<tr><td>${esc(g.label)}</td><td class="r">${g.count}</td><td class="r">${fmt(g.summaryMonthly)}</td></tr>`;
  html += `<tr><td><b>인건비 소계</b></td><td class="r">${q.headcount}</td><td class="r"><b>${fmt(q.laborTotal)}</b></td></tr>
    <tr><td>영업배상책임보험</td><td></td><td class="r">${fmt(q.liability)}</td></tr>
    <tr><td>일반관리비 (${pct(rates.adminRate)})</td><td></td><td class="r">${fmt(q.admin)}</td></tr>
    <tr><td>기업이윤 (${pct(rates.profitRate)})</td><td></td><td class="r">${fmt(q.profit)}</td></tr>
    <tr><td>10만원 미만 절사</td><td></td><td class="r">${q.cutAdjust ? '−' + fmt(-q.cutAdjust) : '0'}</td></tr>
    <tr><td><b>월 합계</b></td><td></td><td class="r"><b>${fmt(q.grand)}</b></td></tr>
    <tr><td>부가세 10%</td><td></td><td class="r">${fmt(q.vat)}</td></tr>
  </tbody></table></div>`;
  out.innerHTML = html;

  // 산출내역
  if (!roles.find((r) => r.id === detailId)) detailId = roles[0]?.id || '';
  detailSel.innerHTML = roles.map((r) => `<option value="${r.id}"${r.id === detailId ? ' selected' : ''}>${esc(roleName(r))}</option>`).join('');
  const role = roles.find((r) => r.id === detailId);
  if (!role) { detailBox.innerHTML = ''; return; }
  const c = calcRole({ ...role, count: 1 }, rates);
  const p = c.per;
  const line = (t, val, strong) => `<tr${strong ? ' style="background:var(--mist)"' : ''}><td>${strong ? `<b>${t}</b>` : t}</td><td class="r">${strong ? `<b>${fmt(val)}</b>` : fmt(val)}</td></tr>`;
  const opt = (t, val) => (val ? line(t, val) : '');
  detailBox.innerHTML = `<p class="note">시급 ${fmt(c.wage)}원, 월 근로시간 ${c.hours.monthly.toFixed(2)}시간${c.hours.nightMonthly ? `, 야간 ${c.hours.nightMonthly.toFixed(2)}시간` : ''}, 월 급여 ${fmt(c.monthlySalary)}원</p>
  <div class="table-scroll mt-2"><table class="table"><tbody>
    ${line('기본급', p.basePay)}${opt('연장근로수당', p.otPay)}${opt('야간근로수당', p.nightPay)}${line('연차수당', p.leavePay)}${opt('직책수당', p.allowPosition)}${opt('자격수당', p.allowLicense)}${line('퇴직급여 충당금', p.severance)}
    ${line('인건비 소계', p.laborSub, true)}
    ${line('국민연금', p.pension)}${line('건강보험', p.health)}${line('장기요양보험', p.ltc)}${line('산재보험', p.injury)}${line('고용보험', p.employment)}${opt('야간 특수건강진단', p.nightCheck)}${opt('근로자의 날 수당', p.laborDay)}${opt('장애인고용부담금', p.disability)}
    ${line('보험 등 소계', p.insSub, true)}
    ${opt('식대', p.meal)}${line('명절 선물', p.gift)}${line('피복비', p.uniform)}${line('안전교육', p.safetyEdu)}${line('운영비', p.opsCost)}
    ${line('복리후생비 소계', p.welfareSub, true)}
    ${line('영업배상책임보험', p.liability)}${line('일반관리비', p.admin)}${line('기업이윤', p.profit)}
    ${line('1인 월 합계', p.total, true)}
  </tbody></table></div>`;
}

function refresh() { drawRows(); render(); }

addSel.innerHTML = '<option value="">직책 추가</option>' + Object.keys(GROUPS).filter((g) => ROLE_LIBRARY.some((l) => l.group === g)).map((g) => `<optgroup label="${GROUPS[g].label}">${ROLE_LIBRARY.filter((l) => l.group === g).map((l) => `<option value="${l.key}">${esc(roleName(l))}</option>`).join('')}</optgroup>`).join('');

form.elements.year.addEventListener('change', () => {
  year = Number(form.elements.year.value);
  for (const r of roles) if (!r.wageEdited) r.hourlyWage = scaleWage(libOf(r).wage, year);
  drawRates(); refresh();
});
form.elements.tpl.addEventListener('change', () => { loadTemplate(form.elements.tpl.value); refresh(); });
addSel.addEventListener('change', () => {
  if (!addSel.value) return;
  const r = createRole(addSel.value);
  roles.push({ ...r, hourlyWage: scaleWage(libOf(r).wage, year), wageEdited: false });
  detailId = r.id; addSel.value = ''; refresh();
});
rowsBox.addEventListener('input', (e) => {
  const row = e.target.closest('.qrow'); if (!row) return;
  const role = roles.find((r) => r.id === row.dataset.id); if (!role) return;
  const k = e.target.dataset.k;
  if (k === 'count') role.count = Math.max(0, Math.min(99, Math.round(Number(e.target.value) || 0)));
  if (k === 'wage') {
    role.hourlyWage = Math.max(0, Math.round(Number(e.target.value) || 0)); role.wageEdited = true;
    e.target.setAttribute('aria-invalid', role.hourlyWage < makeRates(year).minWage ? 'true' : 'false');
  }
  render();
});
rowsBox.addEventListener('change', (e) => {
  const row = e.target.closest('.qrow'); if (!row) return;
  const role = roles.find((r) => r.id === row.dataset.id); if (!role) return;
  if (e.target.dataset.k === 'shift') { applyShift(role, e.target.value); render(); }
});
rowsBox.addEventListener('click', (e) => {
  const b = e.target.closest('[data-del]'); if (!b) return;
  roles = roles.filter((r) => r.id !== b.closest('.qrow').dataset.id); refresh();
});
detailSel.addEventListener('change', () => { detailId = detailSel.value; render(); });

form.addEventListener('submit', (e) => e.preventDefault());
loadTemplate(form.elements.tpl.value);
drawRates();
refresh();
