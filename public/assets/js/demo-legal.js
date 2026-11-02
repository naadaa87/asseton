// 에셋온 체험판 · 법정점검 계산기
// 2026년 11월 조사 기준으로 단순화한 규칙입니다. 실제 서비스는 항목마다 근거 법령과 조사 시점을 저장합니다.
const form = document.querySelector('[data-legal]');
const out = document.querySelector('[data-legal-out]');

const v = (name) => {
  const el = form.elements[name];
  if (!el) return '';
  if (el instanceof RadioNodeList) return el.value;
  return el.value;
};
const n = (name) => {
  const x = parseFloat(String(v(name)).replace(/,/g, ''));
  return Number.isFinite(x) ? x : 0;
};
const yes = (name) => v(name) === 'y';
const fmt = (x) => Math.round(x).toLocaleString('ko-KR');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const today = new Date();
const curY = today.getFullYear();
const curM = today.getMonth() + 1;
const ym = (y, m) => `${y}년 ${m}월`;
const monthsSince = (y, m) => (curY - y) * 12 + (curM - m);

// 기준 월(m)에 맞춰 돌아오는 연간 기한: 이번 달이 기준 월이면 이번 달, 지났으면 내년
function nextAnnual(m) {
  const y = m >= curM ? curY : curY + 1;
  return { y, m, text: ym(y, m) + (y === curY && m === curM ? ' (이번 달)' : '') };
}
// 기준 연월에서 시작해 every년마다 돌아오는 기한 중 이번 달 이후 첫 번째
function nextEvery(y0, m0, every) {
  let y = y0;
  while (y < curY || (y === curY && m0 < curM)) y += every;
  return { y, m: m0, text: ym(y, m0) };
}
function addMonths(m, k) { return ((m - 1 + k) % 12 + 12) % 12 + 1; }

function rules(b) {
  const list = [];
  const add = (grp, t, c, law, next = '', kind = 'do') => list.push({ grp, t, c, law, next, kind });
  const { use, area, floors, basement, totalFloors, approvalY, approvalM } = b;

  // ── 소방
  const special = totalFloors >= 30 || area >= 100000;
  const first = !special && (floors >= 11 || area >= 15000);
  const second = !special && !first && (b.sprinkler || area >= 3000);
  const third = !special && !first && !second && area >= 600;
  const grade = special ? '특급' : first ? '1급' : second ? '2급' : third ? '3급' : '';
  const comprehensive = b.sprinkler || (b.multiuse && area >= 2000);

  if (comprehensive) {
    if (special) {
      const a = nextAnnual(approvalM), c = nextAnnual(addMonths(approvalM, 6));
      const nx = a.y * 12 + a.m < c.y * 12 + c.m ? a : c;
      add('소방', '소방시설 종합점검 (반기 1회)', `특급 소방안전관리대상물이라 종합점검을 반기마다 받습니다. 사용승인 월(${approvalM}월)과 그로부터 6개월 되는 달이 기준입니다.`, '소방시설 설치 및 관리에 관한 법률, 시행규칙 별표 3', nx.text);
    } else {
      add('소방', '소방시설 종합점검 (연 1회)', `${b.sprinkler ? '스프링클러가 설치되어' : '다중이용업소가 있는 연면적 2,000㎡ 이상 건물이라'} 종합점검 대상입니다. 사용승인 월(${approvalM}월)에 받습니다.`, '소방시설 설치 및 관리에 관한 법률, 시행규칙 별표 3', nextAnnual(approvalM).text);
      add('소방', '소방시설 작동점검 (연 1회)', `종합점검을 받은 달부터 6개월이 되는 달(${addMonths(approvalM, 6)}월)에 받습니다.`, '소방시설 설치 및 관리에 관한 법률, 시행규칙 별표 3', nextAnnual(addMonths(approvalM, 6)).text);
    }
  } else if (area >= 600 || b.multiuse) {
    add('소방', '소방시설 작동점검 (연 1회)', `종합점검 대상이 아니라 작동점검만 받습니다. 사용승인 월(${approvalM}월) 말일까지가 기한입니다.`, '소방시설 설치 및 관리에 관한 법률, 시행규칙 별표 3', nextAnnual(approvalM).text);
  }
  if (comprehensive || area >= 600 || b.multiuse) {
    add('소방', '자체점검 결과 보고', '점검을 마친 날부터 15일 이내에 실시 결과 보고서와 이행계획서를 소방서에 냅니다. 결과는 2년 보관하고, 보고 후 10일 안에 건물 출입구 쪽에 30일 이상 게시합니다.', '소방시설 설치 및 관리에 관한 법률', '점검 후 15일', 'note');
  }
  if (grade) {
    const why = special ? (totalFloors >= 30 ? '지하층을 포함해 30층 이상' : '연면적 10만㎡ 이상')
      : first ? (floors >= 11 ? '지상 11층 이상' : '연면적 15,000㎡ 이상')
      : second ? (b.sprinkler ? '스프링클러 설치 대상' : '옥내소화전 설치 대상(연면적 3,000㎡ 이상)')
      : '자동화재탐지설비 설치 대상(대개 연면적 600㎡ 이상)';
    add('소방', `소방안전관리자 선임 (${grade})`, `${why}이라 ${grade} 소방안전관리대상물입니다. 선임 후 14일 안에 소방서에 신고하고, 선임자 정보를 출입구에 게시합니다.`, '화재의 예방 및 안전관리에 관한 법률, 시행령 별표 4', '선임 유지', 'staff');
    add('소방', '소방훈련과 교육 (연 1회 이상)', `근무자를 대상으로 연 1회 이상 소방훈련과 교육을 합니다.${special || first ? ' 특급·1급은 실시 결과를 30일 안에 소방서에 내고 2년 보관합니다.' : ' 실시 결과는 2년 보관합니다.'}`, '화재의 예방 및 안전관리에 관한 법률', '연 1회');
  }

  // ── 전기
  const selfUse = b.power === 'high' || b.kw >= 75;
  if (b.power === 'high') {
    const heavy = ['medical', 'lodging', 'retail'].includes(use) && area >= 3000;
    const every = heavy ? 2 : 3;
    add('전기', `전기설비 정기검사 (${every}년마다)`, `고압 이상으로 받는 자가용 전기설비라 한국전기안전공사의 정기검사를 받습니다.${heavy ? ' 의료·숙박·대형판매처럼 사람이 많이 모이는 시설은 2년마다입니다.' : ''} 사용 전 검사 시점을 사용승인 월로 가정했습니다.`, '전기안전관리법, 시행규칙', nextEvery(approvalY + every, approvalM, every).text);
  }
  if (selfUse) {
    add('전기', '전기안전관리자 선임', b.power === 'high' ? '고압 이상 수전 설비는 전기안전관리자를 선임하거나 기준에 맞게 대행을 맡깁니다. 선임자는 용량에 따라 월 1~4회 설비를 점검하고 기록을 4년 보관합니다.' : '저압이라도 75kW 이상이면 자가용 전기설비로 보아 전기안전관리자를 선임하거나 대행을 맡깁니다.', '전기안전관리법', '선임 유지', 'staff');
  } else {
    add('전기', '일반용 전기설비 정기점검', '저압 75kW 미만 일반용 설비는 한국전기안전공사가 주기적으로 점검합니다. 점검 일정 안내를 받으면 출입을 협조합니다.', '전기안전관리법', '안내 시', 'note');
  }
  if (b.generator) {
    add('전기', '비상발전기 정기검사와 운전 점검', '자가용 비상발전설비는 정기검사를 받고, 평소에는 무부하 운전 점검 기록을 남깁니다. 소방 점검 때 비상전원 항목으로도 확인합니다.', '전기안전관리법, 소방시설 설치 및 관리에 관한 법률', '정기검사 주기에 맞춤');
  }

  // ── 승강기
  if (b.elev > 0) {
    const age = monthsSince(approvalY, approvalM) / 12;
    add('승강기', `승강기 자체점검 (월 1회, ${b.elev}대)`, '유지관리업체가 매월 점검하고, 결과를 점검 후 10일 안에 승강기안전종합정보망에 입력합니다.', '승강기 안전관리법', '매월');
    add('승강기', `승강기 정기검사 (${age >= 25 ? '6개월' : '1년'}마다)`, `설치검사를 받은 날을 기준으로 ${age >= 25 ? '설치 25년이 지나 6개월' : '1년'}마다 한국승강기안전공단의 검사를 받습니다. 설치 시점을 사용승인 월로 가정했습니다.`, '승강기 안전관리법, 시행규칙', age >= 25 ? nextAnnual(addMonths(approvalM, 6)).text : nextAnnual(approvalM).text);
    const d = nextEvery(approvalY + 15, approvalM, 3);
    add('승강기', '승강기 정밀안전검사', age >= 15 ? '설치 15년이 지나 3년마다 정밀안전검사를 받습니다.' : `설치 15년이 되는 ${approvalY + 15}년부터 3년마다 정밀안전검사를 받습니다.`, '승강기 안전관리법', d.text);
    add('승강기', '승강기 안전관리자 선임과 책임보험', '관리주체는 안전관리자를 선임해 3개월 안에 교육을 받게 하고, 승강기 사고배상책임보험을 유지합니다.', '승강기 안전관리법', '선임 유지', 'staff');
  }

  // ── 건축물
  const multiUseBldg = floors >= 16 || (['retail', 'medical', 'lodging'].includes(use) && area >= 5000);
  const bldgTarget = multiUseBldg || (b.collective && area >= 3000);
  if (bldgTarget) {
    const why = floors >= 16 ? '16층 이상 다중이용 건축물' : multiUseBldg ? '연면적 5,000㎡ 이상 판매·의료·숙박 시설' : '연면적 3,000㎡ 이상 집합건축물';
    add('건축물', '건축물 정기점검 (3년마다)', `${why}이라 정기점검 대상입니다. 사용승인 후 5년 안에 처음 받고, 그 뒤 3년마다 받습니다. 기한은 사용승인 월 기준 예상이며 실제 직전 점검일로 다시 맞춥니다.`, '건축물관리법', nextEvery(approvalY + 5, approvalM, 3).text);
  }

  // ── 기계설비
  if (area >= 10000 && use !== 'warehouse') {
    const g = area >= 60000 ? '특급' : area >= 30000 ? '고급' : area >= 15000 ? '중급' : '초급';
    add('기계설비', '기계설비 성능점검 (연 1회)', '연면적 10,000㎡ 이상이라 기계설비성능점검업자에게 연 1회 성능점검을 받고 결과를 보관합니다.', '기계설비법, 기계설비 유지관리기준', '연 1회');
    add('기계설비', '기계설비 유지관리점검 (연 2회)', '냉방과 난방을 시작하기 전에 한 번씩, 연 2회 유지관리점검을 하고 기록합니다.', '기계설비 유지관리기준', curM <= 4 ? `${curY}년 5월 전` : curM <= 10 ? `${curY}년 11월 전` : `${curY + 1}년 5월 전`);
    add('기계설비', `기계설비유지관리자 선임 (${g})`, `연면적에 따라 ${g} 책임자를 선임하고 30일 안에 신고합니다.`, '기계설비법, 시행령', '선임 유지', 'staff');
  }

  // ── 위생·환경
  if (b.tank && area >= 5000 && use !== 'warehouse') {
    add('위생·환경', '저수조 청소 (반기 1회)', '반기마다 저수조를 청소하고, 월 1회 위생상태를 점검해 기록합니다.', '수도법, 시행규칙', curM <= 6 ? `${curY}년 6월 전` : `${curY}년 12월 전`);
    add('위생·환경', '먹는물 수질검사 (연 1회)', '저수조 물을 연 1회 이상 검사하고 결과를 보관합니다.', '수도법, 시행규칙', '연 1회');
  }
  const disinfect = ((use === 'office' || use === 'mixed') && area >= 2000) ? 'office'
    : (use === 'retail' && area >= 3000) || use === 'medical' || use === 'lodging' ? 'busy' : '';
  if (disinfect) {
    add('위생·환경', '소독', disinfect === 'busy' ? '4~9월에는 매월, 10~3월에는 2개월에 한 번 이상 소독업체에 맡기고 소독증명서를 보관합니다.' : '4~9월에는 2개월에 한 번, 10~3월에는 3개월에 한 번 이상 소독업체에 맡기고 소독증명서를 보관합니다.', '감염병의 예방 및 관리에 관한 법률, 시행규칙', disinfect === 'busy' ? (curM >= 4 && curM <= 9 ? '매월' : '2개월마다') : (curM >= 4 && curM <= 9 ? '2개월마다' : '3개월마다'));
  }
  if (b.septic) add('위생·환경', '정화조 내부청소 (연 1회)', '개인하수처리시설은 연 1회 이상 내부청소를 하고 기록을 3년 보관합니다.', '하수도법', '연 1회');
  const iaq = (use === 'office' && area >= 3000) || (use === 'mixed' && area >= 2000) || (use === 'medical' && area >= 2000) || (use === 'retail' && area >= 3000);
  if (iaq) add('위생·환경', '실내공기질 측정 (연 1회)', '다중이용시설에 해당해 미세먼지, 이산화탄소, 폼알데하이드 같은 유지기준 항목을 연 1회 측정하고 기록을 10년 보관합니다. 관리자는 정해진 교육을 받습니다.', '실내공기질 관리법', '연 1회');

  // ── 가스
  if (b.gas === 'large') add('가스', '특정가스사용시설 정기검사 (연 1회)', '월 사용 예정량 2,000㎥ 이상이라 특정가스사용시설로 한국가스안전공사의 정기검사를 받고, 가스 안전관리자를 둡니다.', '도시가스사업법', '연 1회');
  else if (b.gas === 'small') add('가스', '가스시설 안전점검', '도시가스사가 정기적으로 안전점검을 합니다. 일정 안내에 맞춰 협조합니다.', '도시가스사업법', '안내 시', 'note');

  // ── 안전보건
  if (b.workers) {
    add('안전보건', '위험성평가 (매년)', '현장 작업의 위험요인을 찾고 줄이는 위험성평가를 하고, 매년 정기평가로 다시 봅니다.', '산업안전보건법, 사업장 위험성평가에 관한 지침', '매년');
    add('안전보건', '근로자 정기 안전보건교육', '사무직은 반기 6시간, 그 밖의 근로자는 반기 12시간 이상 교육하고 기록합니다. 관리감독자는 연 16시간입니다.', '산업안전보건법, 시행규칙', '반기마다');
    add('안전보건', '안전보건관리체계 점검 (반기 1회)', '상시 근로자 5명 이상 사업은 중대재해처벌법이 적용됩니다. 관리 인력의 고용 주체(관리회사 또는 건물주)가 체계를 갖추고 반기 1회 이상 점검합니다.', '중대재해 처벌 등에 관한 법률', '반기마다');
  }
  return { list, grade };
}

function render() {
  const area = n('area');
  const ap = String(v('approval') || '').split('-');
  const approvalY = parseInt(ap[0], 10) || curY - 10;
  const approvalM = parseInt(ap[1], 10) || 1;
  const b = {
    use: v('use'), area, floors: n('floors'), basement: n('basement'), totalFloors: n('floors') + n('basement'),
    approvalY, approvalM, collective: yes('collective'), sprinkler: yes('sprinkler'), multiuse: yes('multiuse'),
    elev: n('elev'), power: v('power'), kw: v('power') === 'low' ? n('kw') : 0, generator: yes('generator'),
    tank: yes('tank'), gas: v('gas'), septic: yes('septic'), workers: yes('workers'),
  };
  const ph = form.querySelector('[data-pyeong]');
  if (ph) ph.textContent = area > 0 ? `약 ${fmt(area * 0.3025)}평` : '';
  const low = form.querySelector('[data-lowkw]');
  if (low) low.hidden = b.power !== 'low';

  if (!(area > 0) || !(b.floors > 0)) {
    out.innerHTML = '<p class="note">연면적과 지상 층수를 넣으면 결과가 나옵니다.</p>';
    return;
  }
  const { list } = rules(b);
  const tasks = list.filter((x) => x.kind === 'do');
  const staff = list.filter((x) => x.kind === 'staff');
  const groups = [...new Set(list.map((x) => x.grp))];
  const staffNames = staff.map((x) => x.t.replace(/ 선임(과 책임보험)?/, ''));

  let html = `<div class="result-head"><span class="count">${tasks.length}</span><span><b>개의 정기 의무</b><br><span class="note">${groups.length}개 분야, 선임·신고 의무 ${staff.length}건 별도</span></span></div>`;
  if (staffNames.length) html += `<p class="mt-2" style="display:flex;flex-wrap:wrap;gap:6px">${staffNames.map((s) => `<span class="chip ink">${esc(s)}</span>`).join('')}</p>`;
  html += '<ul class="oblig">';
  for (const g of groups) {
    html += `<li class="grp">${esc(g)}</li>`;
    for (const x of list.filter((y) => y.grp === g)) {
      const chip = x.kind === 'staff' ? '<span class="chip">선임</span>' : x.kind === 'note' ? '<span class="chip">참고</span>' : `<span class="next">${esc(x.next)}</span>`;
      html += `<li><span class="t">${esc(x.t)}</span>${chip}<span class="c">${esc(x.c)}</span><span class="law-ref">${esc(x.law)}</span></li>`;
    }
  }
  html += '</ul>';
  out.innerHTML = html;
}

if (form && out) {
  form.addEventListener('submit', (e) => e.preventDefault());
  form.addEventListener('input', render);
  form.addEventListener('change', render);
  render();
}
