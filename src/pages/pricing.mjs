import { page, pageHero, sec, head, faq, faqLd, ctaBand, table, breadcrumbLd } from '../lib/html.mjs';
import { LAUNCH } from '../site.mjs';

const PRICE_FAQ = [
  ['건물 수는 어떻게 세나요?', '건축물대장의 한 동을 한 건물로 셉니다. 같은 대지에 동이 여러 개면 동마다 셉니다. 관리 계약이 끝난 건물은 보관 상태로 돌리면 다음 달부터 요금에서 빠지고, 기록은 그대로 남습니다.'],
  ['사용자를 더 늘리면 요금이 오르나요?', '오르지 않습니다. 본사 직원, 관리소장, 현장 근무자 계정은 수에 상관없이 쓸 수 있습니다. 스타터 플랜만 본사 사용자 10명을 포함하고, 현장 근무자 계정은 플랜과 관계없이 제한이 없습니다.'],
  ['무료로 먼저 써 볼 수 있나요?', '정식 공개 뒤에는 카드 등록 없이 30일 동안 건물 2동까지 써 볼 수 있습니다. 체험이 끝나도 자동으로 결제되지 않고, 플랜을 고르실 때만 청구가 시작됩니다. 지금은 체험판 페이지에서 주요 계산을 먼저 해 볼 수 있습니다.'],
  ['결제는 어떻게 하나요?', '기본은 매달 초 지난달 사용분을 세금계산서로 청구하고 계좌이체로 받는 방식입니다. 원하면 카드 자동결제도 됩니다. 카드로 결제하면 카드 전표가 증빙이 되므로 세금계산서는 따로 발행하지 않습니다.'],
  ['해지하면 데이터는 어떻게 되나요?', '해지 후 30일 동안 읽기 전용으로 접속해 모든 데이터를 엑셀과 파일로 내려받을 수 있습니다. 그 뒤 90일이 지나면 파기합니다. 법으로 보관해야 하는 장부와 기록은 해지 전에 내려받아 보관하시도록 안내드립니다.'],
  ['요금이 바뀌면요?', '90일 전에 알리고, 이미 계약한 기간에는 적용하지 않습니다. 알림톡이나 세금계산서처럼 외부 원가가 바뀌는 항목은 그 변동분만 반영하고 근거를 함께 알립니다.'],
];

export function pricing() {
  const plans = [
    ['starter', '건물 1~5동의 관리회사, 자가관리 건물', '스타터', ['건물·호실·설비, 문서함, 캘린더', '점검·작업지시·운영일지·법정점검·민원', '관리비 산정·고지·수납·연체', '월간 보고서', '본사 사용자 10명, 현장 무제한'], 'line'],
    ['standard', '건물 6~30동의 FM·PM 회사', '스탠다드', ['스타터의 모든 기능', '근무표와 근로시간 집계', 'FM 견적 엔진', '오너 포털과 승인', '협력업체 포털', '사용자 무제한'], 'primary'],
    ['pro', '건물 31~100동, 운용사 보고가 필요한 회사', '프로', ['스탠다드의 모든 기능', '자산관리 AM 모듈', '화이트라벨과 귀사 도메인', '리포트 빌더와 API', '전담 매니저'], 'line'],
    ['enterprise', '100동 이상, 운용사와 대형 관리회사', '엔터프라이즈', ['프로의 모든 기능', '전용 도메인과 사내 계정 연동(SSO)', '맞춤 보고 양식과 데이터 연동', '서비스 수준 계약(SLA)'], 'line'],
  ];
  const addons = [
    ['알림톡·문자', '건당', '고지서, 처리 결과, 만기 안내. 카카오 공식 딜러사 단가에 처리 비용을 더한 금액을 공개합니다.'],
    ['전자세금계산서', '건당', '임대료·관리비 세금계산서 발행과 국세청 전송. 발행 대행사 단가 기준으로 공개합니다.'],
    ['관리비 수납 (가상계좌·카드)', 'PG 수수료 실비', '관리회사나 건물주가 PG사와 직접 계약합니다. 에셋온은 그 위에 수수료를 얹지 않습니다.'],
    ['전자계약', '건당 (2027년 하반기)', '임대차·관리계약·협력업체 계약의 전자서명.'],
    ['계약서·검침 사진 인식', '건당 (2027년 하반기)', '계약서와 계량기 사진에서 숫자와 조건을 읽어 초안을 만듭니다.'],
    ['추가 저장공간', 'GB당 월', '플랜에 포함된 용량을 넘는 사진·문서.'],
  ];
  const terms = [
    ['결제 방식', '세금계산서 후불 + 계좌이체가 기본, 카드 자동결제 선택'],
    ['청구', '매달 1일 지난달 사용분 청구, 그달 말일 납부'],
    ['약정', '월 결제는 약정 없음. 연 결제는 12개월, 할인 적용'],
    ['무료 체험', '정식 공개 후 30일, 건물 2동까지, 카드 등록 없음, 자동 결제 없음'],
    ['미납', '납기 후 14일 안내 → 30일 읽기 전용 전환(데이터 보존) → 60일 해지 예고'],
    ['해지', '월 결제는 다음 결제일까지 쓰고 종료. 연 결제는 쓴 기간만 정산하고 나머지를 돌려드립니다'],
    ['데이터', '해지 후 30일 내보내기, 그 뒤 90일 보관 후 파기'],
    ['요금 변경', '90일 전 공지, 계약 기간에는 적용하지 않음'],
    ['가동률 목표', '월 99.9% (계획 점검 제외), 미달 시 크레딧'],
    ['부가세', '모든 금액은 부가세 별도'],
  ];
  const needs = [
    ['fm', '현장 기록 (점검·작업·일지·법정점검·민원)', 1],
    ['fee', '관리비 산정·고지·수납', 1],
    ['shift', '근무표와 근로시간 집계', 2],
    ['quote', 'FM 견적서 작성', 2],
    ['owner', '건물주 승인과 협력업체 포털', 2],
    ['am', '포트폴리오·투자자 보고 (AM)', 3],
    ['brand', '귀사 도메인과 브랜드로 표시', 3],
    ['api', '회계·그룹웨어 연동 (API)', 3],
  ];

  const body = `
${pageHero({ crumb: [['요금']], title: '요금은 관리하는 건물 수로 정합니다', lede: `사용자 수와 상관없이, 관리하는 건물 수 구간으로 정합니다. 금액은 파일럿 현장에서 실제로 줄어든 업무 시간을 재 본 뒤 ${LAUNCH.open} 공개 때 확정합니다. 사전 신청하신 회사에는 공개 전에 먼저 안내드립니다.`, actions: '<a class="btn btn-primary" href="/signup">사전 신청하기</a><a class="btn btn-line" href="#finder">맞는 플랜 찾기</a>' })}
${sec(`<div class="principles">
  <div><h3>건물 한 동이 단위</h3><p>사용자 수로 받으면 현장 인력이 많은 FM 회사가, 호실 수로 받으면 상가 건물이 불리합니다. 건물 수 구간으로 정하고 호실은 상한으로만 둡니다.</p></div>
  <div><h3>사람이 하던 일보다 싸게</h3><p>건물 한 동의 월 요금은 그 건물의 보고서 작성과 관리비 정산에 들던 인건비보다 낮아야 합니다. 그 기준으로 금액을 정합니다.</p></div>
  <div><h3>원가가 드는 것은 따로</h3><p>알림톡, 세금계산서처럼 건당 원가가 있는 기능은 쓴 만큼 받고 단가를 공개합니다. 기본료에 숨기지 않습니다.</p></div>
  <div><h3>약정 없이, 후불로</h3><p>월 결제는 약정이 없고 다음 달 초에 세금계산서로 청구합니다. 해지하면 데이터를 모두 돌려드립니다.</p></div>
</div>`, 'tight')}
${sec(`${head('플랜')}
<div class="plans" data-plans>${plans.map(([k, who, name, items, kind], i) => `<div class="plan${i === 1 ? ' hi' : ''}" data-plan="${k}"><div class="who">${who}</div><h3>${name}</h3><div class="price" data-price>${k === 'enterprise' ? '연 계약 견적<small>도입비 + 월 이용료</small>' : `출시 때 공개<small>건물 수 구간 · 부가세 별도</small>`}</div><ul class="bullets">${items.map((x) => `<li>${x}</li>`).join('')}</ul><a class="btn btn-${kind}" href="/signup?plan=${k}">${k === 'enterprise' ? '상담 신청' : '사전 신청'}</a></div>`).join('')}</div>
<p class="note mt-2">건물주, 임차사, 협력업체 계정은 어느 플랜에서나 무료입니다. 현장 근무자 계정은 모든 플랜에서 수 제한이 없습니다.</p>`, 'mist')}
${sec(`<div class="split-5-7" id="finder"><div>${head('맞는 플랜 찾기', '관리하는 건물 수와 쓰고 싶은 기능을 고르면 맞는 플랜을 알려 드립니다.')}<p class="note" data-estimate-note>요금이 공개되면 이곳에서 월 예상 금액도 함께 계산됩니다.</p></div>
<div class="tool"><div class="tool-out">
<form class="form" data-finder>
  <div class="row-2">
    <div class="field"><label for="f-b">관리하는 건물 수</label><input class="input" id="f-b" name="buildings" type="number" min="1" max="2000" value="8" inputmode="numeric"></div>
    <div class="field"><label for="f-u">전체 호실 수 (대략)</label><input class="input" id="f-u" name="units" type="number" min="0" max="100000" value="160" inputmode="numeric"></div>
  </div>
  <fieldset class="field" style="border:0;padding:0;margin:0"><legend class="label" style="margin-bottom:8px">쓰고 싶은 기능</legend>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 16px">${needs.map(([k, t, lvl], i) => `<label class="check"><input type="checkbox" name="need" value="${k}" data-level="${lvl}"${i < 2 ? ' checked' : ''}><span>${t}</span></label>`).join('')}</div>
  </fieldset>
</form>
<div class="mt-3" aria-live="polite" data-finder-out></div>
</div></div></div>`)}
${sec(`<div class="split-5-7"><div>${head('사용한 만큼 받는 항목', '건당 원가가 드는 기능입니다. 기본료에 넣지 않고 쓴 만큼 받으며, 단가와 그 근거를 공개합니다.')}</div><div>${table(['항목', '과금', '내용'], addons)}</div></div>`)}
${sec(`<div class="split-5-7"><div>${head('결제와 계약 조건', '약관 초안은 서비스 수준과 함께 공개해 두었습니다.')}<p><a class="text-link" href="/legal/terms">이용약관 초안</a> · <a class="text-link" href="/legal/sla">서비스 수준</a></p></div><div>${table(['항목', '조건'], terms)}</div></div>`, 'mist')}
${sec(`<div class="split-5-7"><div>${head('자주 묻는 질문')}</div>${faq(PRICE_FAQ)}</div>`)}
${ctaBand('요금 공개 전에 먼저 안내받으세요', '사전 신청하신 회사에는 확정 요금과 파일럿 참여 조건을 공개 전에 먼저 보내 드립니다.')}`;

  return page({ path: '/pricing', title: '요금 — 건물 수 기준 구독 요금', description: '에셋온 요금은 관리하는 건물 수 구간으로 정하고 사용자는 무제한입니다. 스타터·스탠다드·프로·엔터프라이즈 플랜, 건당 과금 항목, 세금계산서 후불·약정 없음·해지 시 데이터 반환 조건.', active: 'pricing', body, scripts: ['/assets/js/pricing.js'], jsonld: [faqLd(PRICE_FAQ), breadcrumbLd([['요금', '/pricing']])] });
}
export const ROUTES = [];
