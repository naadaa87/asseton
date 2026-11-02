import { page, pageHero, sec, head, icon, ctaBand, table, breadcrumbLd } from '../lib/html.mjs';
import { reportSheet } from '../lib/mocks.mjs';

const privacy = '<p class="note">입력한 값은 이 브라우저 안에서만 계산되고 어디에도 저장되거나 전송되지 않습니다.</p>';
const tabsNav = (cur) => `<div class="tabs" style="margin-top:28px" aria-label="체험판">${[['/demo/legal', '법정점검 계산기'], ['/demo/fee', '관리비 배분과 고지서'], ['/demo/quote', 'FM 견적 계산'], ['/demo/report', '월간 보고서 샘플']].map(([h, t]) => `<a href="${h}" style="text-decoration:none;padding:14px 18px 13px;font-weight:600;font-size:var(--fs-15);border-bottom:2px solid ${h === cur ? 'var(--ink)' : 'transparent'};color:${h === cur ? 'var(--ink)' : 'var(--muted)'};white-space:nowrap;margin-bottom:-1px"${h === cur ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</div>`;

function hub() {
  const rows = [
    ['/demo/legal', 'calendar', '법정점검 계산기', '용도, 연면적, 층수, 설비를 고르면 의무 점검 항목과 주기, 다음 기한, 근거 법령을 정리해 드립니다.'],
    ['/demo/fee', 'receipt', '관리비 배분과 고지서', '항목별 총액과 배분 기준을 정하면 호실별 금액과 14개 항목 세부내역이 보이는 고지서가 만들어집니다.'],
    ['/demo/quote', 'calc', 'FM 견적 계산', '직책과 인원, 근무형태로 월 인건비와 견적 총액을 계산합니다. 실제 견적 엔진과 같은 코드입니다.'],
    ['/demo/report', 'report', '월간 보고서 샘플', '건물주가 매달 받는 보고서의 첫 장. 다섯 숫자와 NOI, 결정이 필요한 일.'],
  ];
  const body = `
${pageHero({ crumb: [['체험판']], title: '가입하지 않고 먼저 써 보세요', lede: '에셋온에 들어갈 계산 규칙을 그대로 쓰는 체험판입니다. 우리 건물 조건과 숫자를 넣어 보고, 지금 쓰는 엑셀과 결과를 비교해 보세요.' })}
${sec(`<div class="demo-rows">${rows.map(([h, ic, t, d]) => `<a class="demo-row" href="${h}"><span class="ico">${icon(ic)}</span><span><b>${t}</b><span>${d}</span></span></a>`).join('')}</div><div class="mt-3">${privacy}</div>`)}
${ctaBand()}`;
  return page({ path: '/demo/', title: '체험판 — 법정점검·관리비·견적·월간 보고서', description: '가입 없이 써 보는 에셋온 체험판. 법정점검 계산기, 관리비 배분과 14개 항목 고지서, FM 견적 계산, 월간 보고서 샘플.', active: 'demo', body, jsonld: [breadcrumbLd([['체험판', '/demo/']])] });
}

// ───────── 법정점검 계산기
function legal() {
  const sel = (id, label, opts, hint = '') => `<div class="field"><label for="${id}">${label}</label><select class="select" id="${id}" name="${id}">${opts.map(([v, t, s]) => `<option value="${v}"${s ? ' selected' : ''}>${t}</option>`).join('')}</select>${hint ? `<span class="hint">${hint}</span>` : ''}</div>`;
  const yn = (id, label, def = 'n', hint = '') => `<div class="field"><span class="label" id="${id}-l">${label}</span><div class="seg" role="radiogroup" aria-labelledby="${id}-l"><label><input type="radio" name="${id}" value="y"${def === 'y' ? ' checked' : ''}><span>있음</span></label><label><input type="radio" name="${id}" value="n"${def === 'n' ? ' checked' : ''}><span>없음</span></label></div>${hint ? `<span class="hint">${hint}</span>` : ''}</div>`;
  const body = `
${pageHero({ crumb: [['체험판', '/demo/'], ['법정점검 계산기']], title: '우리 건물의 법정점검, 무엇을 언제 해야 할까요', lede: '건물 조건을 고르면 소방·전기·승강기·건축물·기계설비·위생·가스·실내공기질·안전보건 분야의 의무 항목과 주기, 다음 기한을 정리합니다. 에셋온에서는 이 결과가 캘린더가 되고, 기한 전에 담당자에게 알림이 갑니다.' })}
<section class="section tight"><div class="wrap">${tabsNav('/demo/legal')}
<div class="tool mt-4"><div class="tool-grid">
  <div class="tool-in"><form class="form" data-legal>
    ${sel('use', '주 용도', [['office', '업무시설 (오피스)', 1], ['neighbor', '근린생활시설'], ['mixed', '복합 (업무 + 근린생활)'], ['retail', '판매시설'], ['medical', '의료시설'], ['lodging', '숙박시설'], ['warehouse', '창고·물류시설'], ['factory', '공장'], ['edu', '교육연구시설']])}
    <div class="row-2"><div class="field"><label for="area">연면적 (㎡)</label><input class="input" id="area" name="area" type="number" min="1" value="12480" inputmode="decimal"><span class="hint" data-pyeong></span></div>
    <div class="field"><label for="approval">사용승인 (연·월)</label><input class="input" id="approval" name="approval" type="month" value="2012-06"></div></div>
    <div class="row-2"><div class="field"><label for="floors">지상 층수</label><input class="input" id="floors" name="floors" type="number" min="1" max="120" value="16"></div>
    <div class="field"><label for="basement">지하 층수</label><input class="input" id="basement" name="basement" type="number" min="0" max="10" value="4"></div></div>
    ${yn('collective', '구분소유 (집합건물)', 'n', '호실마다 소유자가 다른 건물')}
    ${yn('sprinkler', '스프링클러', 'y')}
    ${yn('multiuse', '다중이용업소 입점', 'n', '음식점·노래방·학원·PC방 등')}
    <div class="row-2"><div class="field"><label for="elev">승강기 대수</label><input class="input" id="elev" name="elev" type="number" min="0" max="80" value="4"></div>
    ${sel('power', '수전 방식', [['high', '고압·특고압', 1], ['low', '저압']])}</div>
    <div class="field" data-lowkw hidden><label for="kw">저압 수전 용량 (kW)</label><input class="input" id="kw" name="kw" type="number" min="0" value="60"></div>
    ${yn('generator', '비상발전기', 'y')}
    ${yn('tank', '저수조 (물탱크)', 'y')}
    ${sel('gas', '도시가스 월 사용량', [['none', '사용하지 않음'], ['small', '2,000㎥ 미만', 1], ['large', '2,000㎥ 이상']])}
    ${yn('septic', '정화조 (개인하수처리시설)', 'n')}
    ${yn('workers', '관리 인력 상시 5명 이상', 'y', '시설·미화·보안 인력 포함')}
  </form></div>
  <div class="tool-out" aria-live="polite"><div data-legal-out></div></div>
</div></div>
<div class="mt-3">${privacy}<p class="note">2026년 11월 조사 기준으로 단순화한 안내입니다. 용도·규모·설비의 세부 조건과 지역에 따라 의무가 달라질 수 있으니 실제 이행 전에는 관할 기관과 점검 업체의 안내를 확인하세요. 에셋온은 항목마다 근거 법령과 조사 시점을 저장하고, 법이 바뀌면 기본값을 갱신합니다.</p></div>
</div></section>
${ctaBand('이 일정을 캘린더와 알림으로', '에셋온에서는 건물을 등록할 때 이 계산이 자동으로 돌고, 기한 60일·30일·7일 전에 담당자에게 알림이 갑니다. 결과 보고서를 붙이면 이행으로 바뀌고 월간 보고서에 들어갑니다.')}`;
  return page({ path: '/demo/legal', title: '법정점검 계산기 — 소방·전기·승강기·건축물·기계설비 점검 주기', description: '건물 용도·연면적·층수·설비를 고르면 소방시설 자체점검, 전기 정기검사, 승강기 자체점검, 건축물 정기점검, 기계설비 성능점검, 저수조 청소, 소독, 실내공기질 측정 등 의무 항목과 주기, 다음 기한을 정리합니다.', active: 'demo', body, scripts: ['/assets/js/demo-legal.js'], jsonld: [breadcrumbLd([['체험판', '/demo/'], ['법정점검 계산기', '/demo/legal']])] });
}

// ───────── 관리비
function fee() {
  const body = `
${pageHero({ crumb: [['체험판', '/demo/'], ['관리비 배분과 고지서']], title: '관리비 배분과 14개 항목 고지서', lede: '항목별 총액과 배분 기준을 정하면 호실별 금액이 계산되고, 임차인에게 보낼 고지서가 만들어집니다. 공실 호실의 몫은 건물주 부담으로 따로 모이고, 배분 끝수는 가장 큰 임대 호실에서 맞춥니다.' })}
<section class="section tight"><div class="wrap">${tabsNav('/demo/fee')}
<div class="tool mt-4"><div class="tool-out">
  <h3>1. 호실</h3>
  <div class="table-scroll mt-2"><table class="table" data-units><thead><tr><th>호실</th><th>전용면적 (㎡)</th><th>전기 검침 (kWh)</th><th>상태</th><th>임차인</th><th></th></tr></thead><tbody></tbody></table></div>
  <p class="mt-2"><button class="btn btn-line btn-sm" type="button" data-add-unit>호실 추가</button></p>
  <h3 class="mt-4">2. 이번 달 항목별 총액과 배분 기준</h3>
  <div class="table-scroll mt-2"><table class="table" data-items><thead><tr><th>법정 항목</th><th>총액 (원)</th><th>배분 기준</th></tr></thead><tbody></tbody></table></div>
</div></div>
<div class="tool mt-3"><div class="tool-grid">
  <div class="tool-in" aria-live="polite"><h3>호실별 결과</h3><div data-fee-out class="mt-2"></div></div>
  <div class="tool-out"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><h3>고지서 미리보기</h3><label class="field" style="display:flex;align-items:center;gap:8px"><span class="label" style="font-size:var(--fs-14)">호실</span><select class="select" style="height:38px;width:auto" data-bill-unit></select></label></div><div class="mt-2" data-bill></div></div>
</div></div>
<div class="mt-3">${privacy}<p class="note">금액은 공급가액 기준 예시이며 부가세는 표시하지 않았습니다. 실제 서비스에서는 항목별 과세·면세 구분과 부가세가 함께 계산됩니다.</p></div>
</div></section>
${ctaBand('검침에서 고지, 수납까지 한 번에', '에셋온에서는 현장이 올린 검침값이 바로 배분에 쓰이고, 확정하면 고지서가 알림톡으로 나가며, 가상계좌 입금이 자동으로 맞춰집니다.')}`;
  return page({ path: '/demo/fee', title: '관리비 배분 계산기와 14개 항목 고지서 미리보기', description: '상가건물 임대차보호법 14개 관리비 항목 기준으로 항목별 총액을 전용면적·검침·균등 기준으로 배분하고, 공실분 건물주 부담과 끝수 조정을 반영한 호실별 금액과 고지서를 만들어 봅니다.', active: 'demo', body, scripts: ['/assets/js/demo-fee.js'], jsonld: [breadcrumbLd([['체험판', '/demo/'], ['관리비 배분과 고지서', '/demo/fee']])] });
}

// ───────── 견적
function quote() {
  const body = `
${pageHero({ crumb: [['체험판', '/demo/'], ['FM 견적 계산']], title: '시설관리 견적, 인원과 근무형태만 넣어 보세요', lede: '에셋온의 견적 엔진 코드를 그대로 씁니다. 실제 오피스 견적서와 원 단위까지 같은 결과가 나오는지 검증한 계산 규칙입니다. 직책별 시급은 기존 견적서의 2024년 시급을 최저임금 인상률만큼 올린 값으로 시작합니다.' })}
<section class="section tight"><div class="wrap">${tabsNav('/demo/quote')}
<div class="tool mt-4"><div class="tool-out">
  <form class="form" data-quote>
    <div class="row-3">
      <div class="field"><label for="q-year">기준연도</label><select class="select" id="q-year" name="year"><option value="2026">2026년</option><option value="2027" selected>2027년</option></select></div>
      <div class="field"><label for="q-tpl">시작 구성</label><select class="select" id="q-tpl" name="tpl"><option value="small6" selected>중소형 건물 (6명)</option><option value="office16">중대형 오피스 (16명)</option></select></div>
      <div class="field"><span class="label">요율</span><span class="hint" data-rates style="font-size:var(--fs-14);line-height:1.6"></span></div>
    </div>
    <div class="mt-2">
      <div class="qrow qhead"><span>직책</span><span>인원</span><span>근무형태</span><span>시급 (원)</span><span></span></div>
      <div data-rows></div>
      <p class="mt-2"><select class="select" style="width:auto;height:38px" data-add-role aria-label="직책 추가"><option value="">직책 추가</option></select></p>
    </div>
  </form>
</div></div>
<div class="tool mt-3"><div class="tool-grid">
  <div class="tool-in" aria-live="polite"><h3>견적 요약</h3><div data-q-out class="mt-2"></div></div>
  <div class="tool-out"><h3>산출내역 (1인 기준)</h3><div class="field mt-2" style="max-width:320px"><select class="select" style="height:38px" data-detail-role aria-label="산출내역을 볼 직책"></select></div><div data-q-detail class="mt-2"></div></div>
</div></div>
<div class="mt-3">${privacy}<p class="note">복리후생비, 영업배상책임보험, 일반관리비율 1.5%, 기업이윤율 1.43%, 기타비용 10만원 미만 절사, 총액 1천원 미만 절사는 기존 견적서 기준값입니다. 실제 서비스에서는 회사 설정으로 바꿉니다. 2027년 장기요양·산재·장애인고용부담금 기초액은 고시 전이라 2026년 값을 씁니다.</p></div>
</div></section>
${ctaBand('견적서 엑셀과 PDF까지', '에셋온에서는 이 계산이 견적총괄·산출내역·근무시간표 엑셀과 PDF로 나가고, 보내기 전에 최저시급 미달과 연도 불일치를 잡아 줍니다.')}`;
  return page({ path: '/demo/quote', title: 'FM 시설관리 견적 계산기 — 인건비·4대보험·관리비·이윤', description: '직책·인원·근무형태(일근·3교대·맞교대)·시급으로 시설관리 용역 월 견적을 계산합니다. 2026·2027년 최저시급과 4대보험 요율, 퇴직충당, 복리후생, 일반관리비, 기업이윤, 절사 규칙 반영.', active: 'demo', body, scripts: ['/assets/js/demo-quote.js'], jsonld: [breadcrumbLd([['체험판', '/demo/'], ['FM 견적 계산', '/demo/quote']])] });
}

// ───────── 월간 보고서
function report() {
  const body = `
${pageHero({ crumb: [['체험판', '/demo/'], ['월간 보고서 샘플']], title: '건물주가 매달 받는 보고서의 첫 장', lede: '건물주가 가장 먼저 보는 것은 숫자 다섯 개와 이번 달 결정해야 할 일입니다. 에셋온의 월간 보고서는 그 순서로 시작하고, 아래에 근거가 이어집니다.' })}
<section class="section tight"><div class="wrap">${tabsNav('/demo/report')}
<div class="split-7-5 mt-4"><div>${reportSheet()}<p class="mock-note">예시 화면입니다. 건물명과 숫자는 실제 고객 데이터가 아닙니다.</p></div>
<div>${head('보고서가 만들어지는 방식')}
<ul class="checks" style="grid-template-columns:1fr">
  <li><div><b>다섯 숫자</b><span>임대율, 수납률, 관리비 부과액, 수선 건수, 민원 건수. 한 달 동안 시스템에 쌓인 기록에서 바로 계산됩니다.</span></div></li>
  <li><div><b>수입·지출과 NOI</b><span>임대료·관리비 수입과 운영비, 예산 대비 차이. 숫자를 누르면 원장으로 내려갑니다.</span></div></li>
  <li><div><b>임대차와 시설</b><span>만기 90일 이내 계약, 공실, 법정점검 이행, 주요 작업과 민원.</span></div></li>
  <li><div><b>결정이 필요한 일</b><span>승인 기한과 함께 맨 아래가 아니라 첫 장에 올립니다.</span></div></li>
  <li><div><b>발행과 열람</b><span>PM 담당자가 특이사항을 쓰고 승인하면 PDF와 링크로 발행되고, 건물주가 열어 본 시각이 남습니다.</span></div></li>
</ul></div></div>
</div></section>
${sec(`${head('보고서에 들어가는 항목', '거래처가 요구하는 양식에 따라 섹션을 켜고 끌 수 있습니다.')}${table(['섹션', '내용', '데이터가 오는 곳'], [
    ['요약', '다섯 숫자, NOI, 결정이 필요한 일', '임대차·관리비·작업·민원'],
    ['수입과 지출', '임대료·관리비·기타 수입, 운영비, 예산 대비', '관리비 산정, 수납, 지출 결의'],
    ['임대차', '임대율, 만기 일정, 갱신 협상, 공실', '임대차 계약, 만기 워크플로'],
    ['수납과 연체', '수납률, 연체 단계별 금액, 조치', '수납 매칭, 연체 관리'],
    ['시설', '점검 실적, 주요 작업, 법정점검 이행', '점검·작업지시·법정점검 캘린더'],
    ['민원', '건수, 카테고리, 평균 처리 시간, 만족도', '임차사 창구'],
    ['특이사항', '사고, 공사, 보험 청구', '사고 보고, 지출 결의'],
  ])}`, 'mist')}
${ctaBand()}`;
  return page({ path: '/demo/report', title: '건물 월간 보고서 샘플 — 다섯 숫자와 NOI', description: '건물주에게 매달 보내는 월간 운영 보고서 샘플. 임대율·수납률·관리비·수선·민원 다섯 숫자, 수입·지출과 NOI, 임대차와 시설 현황, 결정이 필요한 일.', active: 'demo', body, jsonld: [breadcrumbLd([['체험판', '/demo/'], ['월간 보고서 샘플', '/demo/report']])] });
}

export const ROUTES = [['/demo/', hub], ['/demo/legal', legal], ['/demo/fee', fee], ['/demo/quote', quote], ['/demo/report', report]];
