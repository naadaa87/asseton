// 에셋온 체험판 · 관리비 배분과 14개 항목 고지서
const unitsBody = document.querySelector('[data-units] tbody');
const itemsBody = document.querySelector('[data-items] tbody');
const out = document.querySelector('[data-fee-out]');
const billSel = document.querySelector('[data-bill-unit]');
const billBox = document.querySelector('[data-bill]');
const addBtn = document.querySelector('[data-add-unit]');

const fmt = (x) => Math.round(x).toLocaleString('ko-KR');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const num = (s) => { const x = parseFloat(String(s).replace(/,/g, '')); return Number.isFinite(x) ? x : 0; };

const BASIS = { area: '전용면적 비율', meter: '전기 검침 비율', equal: '호실 균등', none: '부과하지 않음' };

const units = [
  { no: '201호', area: 412.5, kwh: 3980, vacant: false, tenant: '한빛세무회계' },
  { no: '301호', area: 412.5, kwh: 3700, vacant: false, tenant: '온누리치과' },
  { no: '502호', area: 498.0, kwh: 5470, vacant: false, tenant: '다온디자인랩' },
  { no: '701호', area: 286.4, kwh: 150, vacant: true, tenant: '' },
];
const items = [
  ['일반관리비', 2400000, 'area'],
  ['청소비', 1350000, 'area'],
  ['경비비', 1600000, 'area'],
  ['소독비', 120000, 'area'],
  ['승강기유지비', 380000, 'area'],
  ['냉난방비·급탕비', 640000, 'area'],
  ['수선유지비', 300000, 'area'],
  ['위탁관리수수료', 450000, 'area'],
  ['전기료', 2480000, 'meter'],
  ['수도료', 260000, 'area'],
  ['가스사용료', 0, 'none'],
  ['정화조오물처리수수료', 0, 'none'],
  ['폐기물처리수수료', 180000, 'equal'],
  ['건물전체보험료', 95000, 'area'],
].map(([name, total, basis]) => ({ name, total, basis }));

let billUnit = 0;

function drawUnits() {
  unitsBody.innerHTML = units.map((u, i) => `<tr data-i="${i}">
    <td><input class="input" style="height:38px;min-width:80px" data-k="no" value="${esc(u.no)}" aria-label="호실"></td>
    <td><input class="input" style="height:38px;min-width:96px" data-k="area" type="number" min="0" step="0.1" value="${u.area}" aria-label="${esc(u.no)} 전용면적"></td>
    <td><input class="input" style="height:38px;min-width:96px" data-k="kwh" type="number" min="0" value="${u.kwh}" aria-label="${esc(u.no)} 전기 검침"></td>
    <td><select class="select" style="height:38px;min-width:86px" data-k="vacant" aria-label="${esc(u.no)} 상태"><option value="n"${u.vacant ? '' : ' selected'}>임대</option><option value="y"${u.vacant ? ' selected' : ''}>공실</option></select></td>
    <td><input class="input" style="height:38px;min-width:120px" data-k="tenant" value="${esc(u.tenant)}" aria-label="${esc(u.no)} 임차인"${u.vacant ? ' disabled' : ''}></td>
    <td><button class="icon-btn" type="button" data-del aria-label="${esc(u.no)} 삭제"${units.length <= 1 ? ' disabled' : ''}>×</button></td>
  </tr>`).join('');
}
function drawItems() {
  itemsBody.innerHTML = items.map((it, i) => `<tr data-i="${i}">
    <td style="white-space:nowrap;font-weight:600;color:var(--ink)">${esc(it.name)}</td>
    <td><input class="input" style="height:38px;min-width:130px;text-align:right" data-k="total" inputmode="numeric" value="${fmt(it.total)}" aria-label="${esc(it.name)} 총액"></td>
    <td><select class="select" style="height:38px;min-width:150px" data-k="basis" aria-label="${esc(it.name)} 배분 기준">${Object.entries(BASIS).map(([k, t]) => `<option value="${k}"${it.basis === k ? ' selected' : ''}>${t}</option>`).join('')}</select></td>
  </tr>`).join('');
}

// 배분: 공실 호실 몫은 건물주 부담으로 모으고, 끝수는 가장 큰 임대 호실에서 맞춥니다.
function allocate() {
  const occupied = units.map((u, i) => (!u.vacant ? i : -1)).filter((i) => i >= 0);
  const largest = occupied.length ? occupied.reduce((a, i) => (units[i].area > units[a].area ? i : a), occupied[0]) : -1;
  const perUnit = units.map(() => items.map(() => 0));
  const owner = items.map(() => 0);
  const adjust = items.map(() => 0);
  items.forEach((it, j) => {
    if (it.basis === 'none' || !(it.total > 0)) return;
    const w = units.map((u) => (it.basis === 'area' ? u.area : it.basis === 'meter' ? u.kwh : 1));
    const sw = w.reduce((a, b) => a + b, 0);
    if (!(sw > 0)) return;
    let placed = 0;
    units.forEach((u, i) => {
      const share = Math.floor((it.total * w[i]) / sw);
      if (u.vacant) owner[j] += share; else perUnit[i][j] = share;
      placed += share;
    });
    const diff = it.total - placed;
    if (diff) {
      if (largest >= 0) { perUnit[largest][j] += diff; adjust[j] = diff; } else owner[j] += diff;
    }
  });
  return { perUnit, owner, adjust, largest };
}

// 고지서 하단 산정 방식: 기준별로 묶어서 한 줄씩
function basisLines() {
  const used = items.filter((it) => it.basis !== 'none' && it.total > 0);
  return ['area', 'meter', 'equal'].map((k) => {
    const names = used.filter((it) => it.basis === k).map((it) => it.name);
    if (!names.length) return '';
    const label = names.length > 3 ? `${names[0]} 등 ${names.length}개 항목` : names.join(', ');
    return `${BASIS[k]}: ${esc(label)}<br>`;
  }).join('');
}

function render() {
  const { perUnit, owner, adjust, largest } = allocate();
  const total = items.reduce((a, it) => a + (it.basis === 'none' ? 0 : it.total), 0);
  const sumU = perUnit.map((r) => r.reduce((a, b) => a + b, 0));
  const ownerSum = owner.reduce((a, b) => a + b, 0);
  const adjSum = adjust.reduce((a, b) => a + b, 0);
  const areaSum = units.reduce((a, u) => a + u.area, 0);

  let rows = units.map((u, i) => `<tr><td>${esc(u.no)}${u.vacant ? ' <span class="chip">공실</span>' : ''}</td><td class="r">${(areaSum ? (u.area / areaSum) * 100 : 0).toFixed(1)}%</td><td class="r"><b>${u.vacant ? '-' : fmt(sumU[i])}</b></td></tr>`).join('');
  rows += `<tr><td>건물주 부담 (공실분)</td><td class="r"></td><td class="r"><b>${fmt(ownerSum)}</b></td></tr>`;
  rows += `<tr><td><b>합계</b></td><td class="r">100%</td><td class="r"><b>${fmt(sumU.reduce((a, b) => a + b, 0) + ownerSum)}</b></td></tr>`;
  const okTotal = sumU.reduce((a, b) => a + b, 0) + ownerSum === total;
  out.innerHTML = `<div class="table-scroll"><table class="table"><thead><tr><th>호실</th><th class="r">면적 비율</th><th class="r">이번 달 관리비 (원)</th></tr></thead><tbody>${rows}</tbody></table></div>
  <p class="note mt-2">${okTotal ? `항목별 총액 ${fmt(total)}원이 호실과 건물주 부담에 1원도 남김없이 나뉘었습니다.` : '합계가 맞지 않습니다. 입력값을 확인하세요.'}${adjSum && largest >= 0 ? ` 배분 끝수 ${fmt(adjSum)}원은 가장 큰 임대 호실(${esc(units[largest].no)})에 더했습니다.` : ''}</p>`;

  // 고지서
  const occ = units.map((u, i) => [u, i]).filter(([u]) => !u.vacant);
  if (!occ.find(([, i]) => i === billUnit)) billUnit = occ.length ? occ[0][1] : -1;
  billSel.innerHTML = occ.map(([u, i]) => `<option value="${i}"${i === billUnit ? ' selected' : ''}>${esc(u.no)}</option>`).join('');
  if (billUnit < 0) { billBox.innerHTML = '<p class="note">임대 중인 호실이 없어 고지서를 만들 수 없습니다.</p>'; return; }
  const u = units[billUnit];
  const lines = items.map((it, j) => `<tr><td>${esc(it.name)}</td><td>${perUnit[billUnit][j] ? fmt(perUnit[billUnit][j]) : '0'}</td></tr>`).join('');
  billBox.innerHTML = `<div class="bill"><div class="bh"><b>${esc(u.no)} ${esc(u.tenant || '')}</b><span>3월분 관리비</span></div>
  <table><tbody>${lines}<tr class="sum"><td>합계</td><td>${fmt(sumU[billUnit])}원</td></tr></tbody></table>
  <div class="bf">전용면적 ${u.area.toLocaleString('ko-KR')}㎡, 전기 ${fmt(u.kwh)}kWh 기준. <br>${basisLines()}납부기한 4월 10일, 호실 전용 가상계좌로 입금하시면 자동으로 확인됩니다.</div></div>
  <p class="mock-note">예시 화면입니다. 호실과 임차인 이름은 실제 고객 데이터가 아닙니다.</p>`;
}

unitsBody.addEventListener('input', (e) => {
  const tr = e.target.closest('tr'); if (!tr) return;
  const u = units[+tr.dataset.i]; const k = e.target.dataset.k;
  if (k === 'area' || k === 'kwh') u[k] = Math.max(0, num(e.target.value));
  else if (k === 'no' || k === 'tenant') u[k] = e.target.value;
  render();
});
unitsBody.addEventListener('change', (e) => {
  const tr = e.target.closest('tr'); if (!tr) return;
  if (e.target.dataset.k === 'vacant') { units[+tr.dataset.i].vacant = e.target.value === 'y'; drawUnits(); render(); }
});
unitsBody.addEventListener('click', (e) => {
  const b = e.target.closest('[data-del]'); if (!b || units.length <= 1) return;
  units.splice(+b.closest('tr').dataset.i, 1); drawUnits(); render();
});
addBtn.addEventListener('click', () => {
  units.push({ no: `${units.length + 2}01호`, area: 300, kwh: 2500, vacant: false, tenant: '' });
  drawUnits(); render();
  const last = unitsBody.querySelector('tr:last-child input'); if (last) last.focus();
});
itemsBody.addEventListener('input', (e) => {
  const tr = e.target.closest('tr'); if (!tr) return;
  if (e.target.dataset.k === 'total') { items[+tr.dataset.i].total = Math.max(0, Math.round(num(e.target.value))); render(); }
});
itemsBody.addEventListener('change', (e) => {
  const tr = e.target.closest('tr'); if (!tr) return;
  const it = items[+tr.dataset.i];
  if (e.target.dataset.k === 'basis') { it.basis = e.target.value; render(); }
  if (e.target.dataset.k === 'total') e.target.value = fmt(it.total);
});
billSel.addEventListener('change', () => { billUnit = +billSel.value; render(); });

drawUnits(); drawItems(); render();
