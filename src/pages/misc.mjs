import { page, pageHero, sec, head, icon, ctaBand, table, faq, faqLd, breadcrumbLd, esc, orgLd } from '../lib/html.mjs';
import { SITE, COMPANY, LAUNCH } from '../site.mjs';
import { FEATURES, STAGE } from '../content/features-data.mjs';

const contactLine = () => `<span data-contact="email" hidden></span><span data-contact="phone" hidden></span>`;

// ───────── 보안
const SEC_FAQ = [
  ['다른 관리회사가 우리 데이터를 볼 수 있나요?', '볼 수 없습니다. 모든 데이터에는 회사 구분값이 붙고, 데이터베이스가 요청한 사람의 회사에 속한 행만 돌려줍니다. 화면 코드에 실수가 있어도 이 단계에서 막힙니다. 배포할 때마다 다른 회사의 데이터를 읽으려는 자동 테스트를 돌립니다.'],
  ['직원이 퇴사하면 어떻게 하나요?', '관리자가 계정을 비활성화하면 즉시 로그인이 막히고, 그 직원이 남긴 기록과 서명은 그대로 남습니다. 현장 휴대폰에 남아 있던 로그인도 다음 요청 때 끊깁니다.'],
  ['에셋온 직원이 우리 데이터를 볼 수 있나요?', '고객이 지원을 요청하고 화면 공유나 열람을 허락한 경우에만, 정해진 기간 동안 읽기 권한으로 봅니다. 열람한 사람과 시각은 고객 관리자 화면의 감사 기록에 남습니다.'],
  ['해지하면 데이터는 어떻게 되나요?', '해지 후 30일 동안 모든 기록을 엑셀로, 첨부 파일을 압축 파일로 내려받을 수 있습니다. 30일이 지나면 운영 데이터베이스에서 지우고, 백업에 남은 사본도 백업 보관 기간이 끝나면 지워집니다. 법으로 보관해야 하는 청구 기록은 예외입니다.'],
  ['개인정보 처리 위탁계약서를 받을 수 있나요?', '관리회사는 임차사·건물주 개인정보의 처리자이고, 에셋온은 수탁자입니다. 이용계약을 맺을 때 개인정보 처리 위탁계약서를 함께 드리고, 재위탁하는 업체 목록도 공개합니다.'],
];
function security() {
  const where = [
    ['기록 데이터', '계약, 관리비, 수납, 작업지시, 점검 결과, 임차사 연락처', '서울 리전 데이터베이스 (PostgreSQL)'],
    ['백업', '매일 전체 백업, 7일 안의 시점 복구', '서울 리전, 운영 데이터와 분리된 저장소'],
    ['첨부 파일', '현장 사진, 점검 보고서, 계약서 스캔본', '암호화된 객체 저장소. 국내 저장이 필요한 고객은 계약 때 정합니다'],
    ['화면과 정적 파일', '홈페이지, 앱 화면, 아이콘', 'Cloudflare 전 세계 네트워크 (개인정보 없음)'],
    ['알림과 결제', '알림톡, 가상계좌, 세금계산서', '각 국내 사업자. 전달에 필요한 항목만 보냅니다'],
  ];
  const body = `
${pageHero({ crumb: [['보안과 데이터']], title: '관리회사가 맡긴 기록을 지키는 방법', lede: '임차사 연락처와 관리비 기록은 관리회사와 건물주의 것입니다. 에셋온은 그 기록을 맡아 보관하는 수탁자로서, 첫 출시부터 아래 기준을 지킵니다.' })}
${sec(`${head('데이터는 어디에 저장되나요', '개인정보가 들어 있는 기록은 모두 서울 리전에 둡니다. 전 세계 네트워크는 화면을 빠르게 보여 주는 데에만 씁니다.')}${table(['구분', '들어 있는 것', '저장 위치'], where)}`)}
${sec(`<div class="cols-2">
  <div>${head('회사별 분리와 권한')}<ul class="checks" style="grid-template-columns:1fr">
    <li><div><b>데이터베이스 단계에서 회사 분리</b><span>모든 행에 회사 구분값을 붙이고 행 수준 보안 정책으로 걸러 냅니다. 배포할 때마다 교차 접근 테스트를 돌립니다.</span></div></li>
    <li><div><b>역할과 건물 단위 권한</b><span>대표, 관리자, PM, FM, 관리소장, 현장 근무자, 열람 전용. 같은 회사 안에서도 맡은 건물만 보이게 할 수 있습니다.</span></div></li>
    <li><div><b>로그인 보호</b><span>관리자와 금액을 다루는 역할은 2단계 인증이 기본입니다. 엔터프라이즈 플랜은 회사 계정 통합 로그인(SSO)을 씁니다.</span></div></li>
    <li><div><b>외부 사용자는 필요한 만큼만</b><span>건물주는 자기 건물, 임차사는 자기 호실, 협력업체는 배정받은 작업만 봅니다.</span></div></li>
  </ul></div>
  <div>${head('암호화와 기록')}<ul class="checks" style="grid-template-columns:1fr">
    <li><div><b>전송과 저장 모두 암호화</b><span>모든 연결은 TLS로 암호화하고, 데이터베이스와 백업, 첨부 파일은 저장할 때 암호화합니다.</span></div></li>
    <li><div><b>민감 항목은 한 번 더</b><span>휴대폰 번호, 이메일, 계좌번호는 항목 단위로 한 번 더 암호화합니다. 주민등록번호는 받지 않습니다.</span></div></li>
    <li><div><b>지워지지 않는 감사 기록</b><span>금액, 계약, 권한, 개인정보가 바뀐 기록과 대량 내려받기를 누가, 언제, 무엇을 했는지 3년간 남깁니다.</span></div></li>
    <li><div><b>확정한 숫자는 잠금</b><span>확정한 관리비와 발행한 보고서는 고칠 수 없고, 정정은 새 기록으로 남습니다.</span></div></li>
  </ul></div>
</div>`, 'mist')}
${sec(`${head('백업, 복구, 장애 대응')}<div class="cols-3">
  <div class="callout" style="margin:0"><h3>매일 백업</h3><p>매일 전체 백업을 하고, 7일 안의 원하는 시점으로 되돌릴 수 있습니다. 분기마다 실제로 복구해 보는 훈련을 합니다.</p></div>
  <div class="callout" style="margin:0"><h3>월 가용성 99.9%</h3><p>유료 플랜은 월 가용성 99.9%를 목표로 하고, 지키지 못한 달은 이용료 일부를 크레딧으로 돌려드립니다. <a href="/legal/sla">서비스 수준 기준</a></p></div>
  <div class="callout" style="margin:0"><h3>장애는 먼저 알립니다</h3><p>장애가 생기면 상태 페이지와 관리자 이메일로 먼저 알리고, 끝난 뒤에는 원인과 재발 방지 조치를 정리해 드립니다.</p></div>
</div>`)}
${sec(`<div class="split-5-7"><div>${head('개인정보와 법적 역할', '관리회사가 처리자, 에셋온이 수탁자입니다.')}</div><div><ul class="bullets">
  <li>이용계약 때 개인정보 처리 위탁계약서를 함께 드립니다. 재위탁 업체(데이터베이스, 알림톡, 결제, 이메일)는 이름과 업무를 공개합니다.</li>
  <li>임차사에게 보내는 알림과 고지서에는 관리회사 이름이 나가고, 개인정보 문의 창구도 관리회사로 안내됩니다.</li>
  <li>에셋온은 관리비와 임대료를 보관하거나 대신 정산하지 않습니다. 입금은 결제대행사를 거쳐 관리회사나 건물주 계좌로 바로 들어가고, 에셋온은 입금 통지를 받아 맞춰 볼 뿐입니다.</li>
  <li>정보보호 관리체계(ISMS) 인증은 아직 의무 대상이 아닙니다. 고객 규모가 커지는 시점에 맞춰 준비하고, 그 전에는 인증 기준에 맞춘 내부 점검표로 관리합니다.</li>
</ul></div></div>`, 'mist')}
${sec(`${head('자주 묻는 질문')}${faq(SEC_FAQ)}`)}
${ctaBand('보안 검토 자료가 필요하신가요', '운용사나 대형 건물주의 보안 검토 양식이 있으면 사전 신청 때 남겨 주세요. 데이터 흐름도와 위탁 업체 목록, 점검표를 함께 보내 드립니다.')}`;
  return page({ path: '/security', title: '보안과 데이터 — 서울 리전 저장, 회사별 분리, 백업', description: '에셋온은 계약·관리비·임차사 연락처 같은 기록을 서울 리전에 저장하고, 회사별로 데이터베이스 단계에서 분리합니다. 암호화, 감사 기록 3년, 매일 백업과 7일 시점 복구, 월 가용성 99.9%.', active: 'security', body, jsonld: [faqLd(SEC_FAQ), breadcrumbLd([['보안과 데이터', '/security']])] });
}

// ───────── 출시 일정
function roadmap() {
  const names = { core: '공통', fm: 'FM', pm: 'PM', am: 'AM', sales: '영업', portals: '포털' };
  const byStage = (st) => Object.entries(FEATURES).flatMap(([k, g]) => g.items.filter((x) => x[2] === st).map((x) => [names[k], x[0]]));
  const list = (st) => `<ul class="bullets tagged" style="columns:2;column-gap:32px;font-size:var(--fs-15)">${byStage(st).map(([g, t]) => `<li style="break-inside:avoid"><span class="chip" style="margin-right:6px">${g}</span>${esc(t)}</li>`).join('')}</ul>`;
  const steps = [
    ['2026년 10월', '견적 엔진', '지유코퍼레이션의 FM 견적서 계산을 시스템으로 옮겼습니다. 기존 엑셀과 원 단위까지 같은 결과가 나오는지 확인했고, 실제 견적에 쓰고 있습니다.', 'done'],
    ['2026년 11월', '파일럿 관리회사 모집', '홈페이지와 체험판을 열고, 첫 출시를 함께 쓸 관리회사를 모읍니다. 지금 쓰는 엑셀과 종이 양식을 받아 이관 템플릿을 맞춥니다.', 'now'],
    [LAUNCH.pilot, '파일럿 운영', '지유코퍼레이션과 파일럿 관리회사의 건물 몇 동에서 종이 없이 한 달 이상 돌려 봅니다. 현장 입력률과 관리비 산정·고지·수납이 시스템 안에서 끝나는지가 기준입니다.', ''],
    [LAUNCH.open, '정식 공개', '파일럿에서 검증한 기능으로 요금을 공개하고 가입을 엽니다. AM 대시보드와 투자자 보고, 오너 승인, 카드 결제, 화이트라벨이 함께 나옵니다.', ''],
    ['2028년 상반기', '확장', 'AM 심화 분석, 회계 프로그램 연동, 공개 API, 영어 보고서, 설비 센서(IoT) 연동을 차례로 붙입니다.', ''],
  ];
  const body = `
${pageHero({ crumb: [['출시 일정']], title: '현장에서 먼저 돌려 보고 공개합니다', lede: `에셋온은 ${LAUNCH.pilot} 파일럿을 거쳐 ${LAUNCH.open}에 공개합니다. 한 달 이상 종이 없이 돌아간 기능만 공개 목록에 올립니다.` })}
${sec(`<ol class="steps-list">${steps.map(([when, t, d, st]) => `<li><div><span class="chip${st === 'done' ? ' on' : st === 'now' ? ' ink' : ''}" style="margin-bottom:8px">${when}${st === 'done' ? ' 완료' : st === 'now' ? ' 진행 중' : ''}</span><h3>${t}</h3><p>${d}</p></div></li>`).join('')}</ol>`)}
${sec(`${head('첫 출시에 들어가는 기능', '파일럿부터 쓰는 기능입니다. 관리회사의 하루와 한 달이 시스템 안에서 끝나는 데 필요한 것만 담았습니다.')}${list(1)}`, 'mist')}
${sec(`${head(`${STAGE[2][0]}에 더해지는 기능`)}${list(2)}`)}
${sec(`${head(`${STAGE[3][0]} 이후`)}${list(3)}<p class="note mt-3">일정은 파일럿 결과에 따라 바뀔 수 있고, 바뀌면 이 페이지를 먼저 고칩니다. 마지막 수정 ${SITE.updated.replace(/-/g, '.')}.</p>`, 'mist')}
${ctaBand('먼저 필요한 기능이 있다면', '파일럿 관리회사의 요청은 일정에 바로 반영됩니다. 사전 신청 때 가장 급한 일을 적어 주세요.')}`;
  return page({ path: '/roadmap', title: '출시 일정 — 파일럿과 정식 공개', description: `에셋온 출시 일정. 2026년 10월 견적 엔진, ${LAUNCH.pilot} 파일럿, ${LAUNCH.open} 정식 공개, 2028년 확장. 단계별로 들어가는 기능 목록.`, body, jsonld: [breadcrumbLd([['출시 일정', '/roadmap']])] });
}

// ───────── 사전 신청
function signup() {
  const radios = [['preorder', '사전 신청', true], ['demo', '데모 요청'], ['pilot', '파일럿 참여'], ['partner', '파트너 제휴']];
  const body = `
${pageHero({ crumb: [['사전 신청']], title: '사전 신청과 데모 요청', lede: `에셋온은 ${LAUNCH.pilot} 파일럿을 준비하고 있습니다. 남겨 주신 연락처로 영업일 이틀 안에 담당자가 연락드립니다.` })}
<section class="section tight"><div class="wrap"><div class="split-7-5">
<div class="form-panel">
<form class="form" data-signup novalidate>
  <div class="field"><span class="label" id="type-l">문의 유형</span><div class="seg" role="radiogroup" aria-labelledby="type-l">${radios.map(([v, t, c]) => `<label><input type="radio" name="type" value="${v}"${c ? ' checked' : ''}><span>${t}</span></label>`).join('')}</div></div>
  <div class="row-2">
    <div class="field"><label for="company">회사명</label><input class="input" id="company" name="company" autocomplete="organization" required maxlength="80"></div>
    <div class="field"><label for="bizno">사업자등록번호 <span class="hint">선택</span></label><input class="input" id="bizno" name="bizno" inputmode="numeric" placeholder="000-00-00000" maxlength="12"></div>
  </div>
  <div class="row-2">
    <div class="field"><label for="name">담당자 이름</label><input class="input" id="name" name="name" autocomplete="name" required maxlength="40"></div>
    <div class="field"><label for="title">직책 <span class="hint">선택</span></label><input class="input" id="title" name="title" autocomplete="organization-title" maxlength="40"></div>
  </div>
  <div class="row-2">
    <div class="field"><label for="phone">휴대폰</label><input class="input" id="phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="010-0000-0000" required maxlength="20"></div>
    <div class="field"><label for="email">이메일</label><input class="input" id="email" name="email" type="email" autocomplete="email" required maxlength="120"></div>
  </div>
  <div class="row-2">
    <div class="field"><label for="ctype">회사 유형</label><select class="select" id="ctype" name="ctype" required><option value="">고르세요</option><option>FM 시설관리 회사</option><option>PM 자산운영 회사</option><option>FM·PM 함께 하는 회사</option><option>자산운용사·AMC·리츠</option><option>건물주·관리단</option><option>점검·유지보수 협력업체</option><option>기타</option></select></div>
    <div class="field"><label for="buildings">관리하는 건물 수</label><select class="select" id="buildings" name="buildings" required><option value="">고르세요</option><option>1~5동</option><option>6~10동</option><option>11~30동</option><option>31~100동</option><option>100동 넘음</option></select></div>
  </div>
  <div class="field" data-plan-field hidden><label for="plan">관심 플랜</label><select class="select" id="plan" name="plan"><option value="">정하지 않음</option><option value="starter">스타터</option><option value="standard">스탠다드</option><option value="pro">프로</option><option value="enterprise">엔터프라이즈</option></select></div>
  <div class="field"><span class="label">지금 쓰는 방식 <span class="hint">여러 개 골라도 됩니다</span></span><div class="seg">${['엑셀', '종이 양식', '카카오톡 단톡방', '다른 관리 프로그램', '회계 프로그램'].map((t) => `<label><input type="checkbox" name="tools" value="${t}"><span>${t}</span></label>`).join('')}</div></div>
  <div class="field"><label for="message">가장 먼저 풀고 싶은 일 <span class="hint">선택</span></label><textarea class="textarea" id="message" name="message" rows="4" maxlength="2000" placeholder="예: 관리비 고지서를 매달 엑셀로 한 장씩 만듭니다. 법정점검 기한을 놓친 적이 있습니다."></textarea></div>
  <div class="hp" aria-hidden="true"><label for="website">웹사이트</label><input id="website" name="website" tabindex="-1" autocomplete="off"></div>
  <div data-turnstile></div>
  <div class="field" style="gap:10px;padding:16px;border-radius:var(--r-sm);background:var(--mist)">
    <p class="note" style="color:var(--ink)">수집 항목: 회사명, 담당자 이름, 휴대폰, 이메일, 회사 유형, 건물 수 (선택: 사업자등록번호, 직책, 관심 플랜, 지금 쓰는 방식, 남긴 말)<br>이용 목적: 문의 답변, 데모·파일럿 일정 안내<br>보유 기간: 문의일로부터 1년. 파일럿이나 이용계약을 맺으면 계약 기간 동안</p>
    <label class="check"><input type="checkbox" name="consent" value="y" required><span>위 내용으로 개인정보를 수집·이용하는 데 동의합니다. <a href="/legal/privacy">개인정보처리방침</a></span></label>
    <p class="note">동의하지 않으시면 이 양식으로는 신청을 받을 수 없습니다.</p>
  </div>
  <div data-form-status class="form-status" hidden role="status"></div>
  <div><button class="btn btn-primary btn-lg" type="submit" data-submit>신청 보내기</button></div>
</form>
</div>
<aside>
  ${head('신청하면 이렇게 진행됩니다')}
  <ol class="steps-list compact">
    <li><div><h3>연락</h3><p>영업일 이틀 안에 담당자가 전화나 이메일로 연락드립니다.</p></div></li>
    <li><div><h3>30분 상담</h3><p>지금 쓰는 관리비 엑셀, 점검표, 견적서를 같이 보면서 에셋온으로 옮겼을 때의 모습을 보여 드립니다. 화상이나 방문 중 편한 방법으로 합니다.</p></div></li>
    <li><div><h3>파일럿 안내</h3><p>${LAUNCH.pilot} 파일럿은 건물 2~3동부터 시작합니다. 참여 조건과 이관 일정, 파일럿 기간 이용료를 안내드립니다.</p></div></li>
  </ol>
  <div class="callout mt-3"><h3>파일럿 관리회사에게</h3><ul class="bullets plain" style="font-size:var(--fs-15)"><li>지금 쓰는 엑셀을 이관 템플릿으로 옮기는 일을 함께 합니다.</li><li>요청한 기능은 일정에 바로 반영합니다.</li><li>정식 공개 때 파일럿 참여 조건으로 계약을 이어갈 수 있습니다.</li></ul></div>
  <p class="note mt-3">${esc(COMPANY.name)} ${contactLine()}</p>
</aside>
</div></div></section>`;
  return page({ path: '/signup', title: '사전 신청과 데모 요청', description: `에셋온 사전 신청, 데모 요청, ${LAUNCH.pilot} 파일럿 참여, 파트너 제휴 문의. 영업일 이틀 안에 연락드립니다.`, body, scripts: ['/assets/js/signup.js'], jsonld: [breadcrumbLd([['사전 신청', '/signup']])] });
}

// ───────── 회사 소개
function about() {
  const body = `
${pageHero({ crumb: [['회사 소개']], title: '관리 현장의 일을 시스템으로 옮기는 회사', lede: `${COMPANY.name}는 건물 관리 현장에서 매일 반복되는 기록과 계산을 시스템으로 옮겨, 관리회사가 더 적은 손으로 더 많은 건물을 맡을 수 있게 돕습니다. 에셋온(${SITE.nameEn}, ${SITE.system})은 그 첫 제품입니다.` })}
${sec(`<div class="split-5-7"><div>${head('왜 만드는가')}</div><div class="prose" style="max-width:none">
<p>관계사 ${esc(COMPANY.affiliate)}는 오피스, 물류센터, 병원, 상업시설 등 43개 동, 195,000평을 관리하는 FM·PM 회사입니다. 오랫동안 쌓은 운영 경험과 관리 능력이 있지만, 점검표와 일지는 종이에, 관리비와 견적은 엑셀에, 현장 보고는 카카오톡에 흩어져 있었습니다.</p>
<p>같은 숫자를 세 번 옮겨 적고, 대표가 밤에 견적서를 만들고, 법정점검 기한은 담당자의 기억에 달려 있었습니다. 다른 관리회사들의 사정도 크게 다르지 않았습니다.</p>
<p>에셋온은 이 일을 하나의 흐름으로 묶습니다. 현장에서 한 번 입력한 기록이 관리비와 보고서, 견적까지 그대로 이어지도록 만드는 것이 목표입니다.</p>
</div></div>`)}
${sec(`${head('일하는 원칙')}<div class="principles">
  <div><h3>현장에서 먼저</h3><p>관계사 현장에서 종이 없이 한 달 이상 돌아간 기능만 공개합니다.</p></div>
  <div><h3>법이 정한 기록부터</h3><p>관리비 14개 항목, 법정점검, 장부 보관처럼 지켜야 하는 것을 기본값으로 둡니다.</p></div>
  <div><h3>숫자는 한 번만 입력</h3><p>점검 결과가 작업지시로, 검침이 관리비로, 관리비가 보고서로 이어집니다.</p></div>
  <div><h3>데이터는 고객의 것</h3><p>언제든 엑셀로 내려받을 수 있고, 해지하면 돌려드립니다.</p></div>
</div>`, 'mist')}
${sec(`${head('회사 정보')}${table(['항목', '내용'], [
    ['상호', esc(COMPANY.name) + ` (${esc(COMPANY.nameEn)})`],
    ['대표', esc(COMPANY.ceo)],
    ['설립', esc(COMPANY.founded)],
    ['사업자등록번호', esc(COMPANY.bizNo)],
    ['주소', esc(COMPANY.address)],
    ['관계사', `${esc(COMPANY.affiliate)} (시설관리 FM·자산운영 PM)`],
    ['제품', `에셋온 ${SITE.nameEn} (${SITE.system}, 약칭 ${SITE.short})`],
  ])}<p class="note mt-2">${contactLine()}</p>`)}
${ctaBand()}`;
  return page({ path: '/about', title: `회사 소개 — ${COMPANY.name}`, description: `${COMPANY.name}는 FM·PM·AM 관리회사를 위한 자산관리시스템 에셋온을 만듭니다. 관계사 ${COMPANY.affiliate}의 43개 동 관리 현장에서 먼저 검증합니다.`, body, jsonld: [orgLd(), breadcrumbLd([['회사 소개', '/about']])] });
}

// ───────── 파트너
function partners() {
  const body = `
${pageHero({ crumb: [['파트너']], title: '관리회사 곁에 있는 회사들과 함께 갑니다', lede: '세무·회계사무소, 점검·유지보수 업체, 건물 관련 서비스 회사가 에셋온을 함께 쓰거나 소개하면 관리회사의 일이 더 줄어듭니다. 파트너 조건은 파일럿과 함께 정하고 있습니다.', actions: '<a class="btn btn-primary" href="/signup?type=partner">파트너 제휴 문의</a>' })}
${sec(`<div class="cols-2">
  <div class="callout" style="margin:0"><span class="ico" style="display:inline-grid;place-items:center;width:44px;height:44px;border-radius:12px;background:var(--mist)">${icon('wrench')}</span><h3 class="mt-2">점검·유지보수 협력업체</h3><p>소방, 승강기, 전기, 기계설비, 소독, 저수조 업체는 협력업체 화면을 무료로 씁니다. 배정받은 작업을 확인하고, 점검 결과와 사진, 보고서를 바로 올리면 관리회사의 법정점검 캘린더가 이행으로 바뀝니다.</p></div>
  <div class="callout" style="margin:0"><span class="ico" style="display:inline-grid;place-items:center;width:44px;height:44px;border-radius:12px;background:var(--mist)">${icon('users')}</span><h3 class="mt-2">소개 파트너</h3><p>관리회사와 건물주를 고객으로 둔 세무·회계사무소, 부동산 중개법인, 시설관리 협회와 교육기관. 고객을 소개하면 계약 기간 동안 소개 보상을 드립니다. 비율은 정식 공개 전에 확정합니다.</p></div>
  <div class="callout" style="margin:0"><span class="ico" style="display:inline-grid;place-items:center;width:44px;height:44px;border-radius:12px;background:var(--mist)">${icon('plug')}</span><h3 class="mt-2">연동 파트너</h3><p>알림톡, 결제대행, 전자세금계산서, 전자계약, 회계 프로그램, 설비 센서. 관리회사가 따로 가입하지 않아도 에셋온 안에서 쓰도록 연결합니다.</p></div>
  <div class="callout" style="margin:0"><span class="ico" style="display:inline-grid;place-items:center;width:44px;height:44px;border-radius:12px;background:var(--mist)">${icon('building')}</span><h3 class="mt-2">도입 컨설팅</h3><p>관리회사의 엑셀과 종이 양식을 정리해 에셋온으로 옮기고, 직원 교육을 맡는 파트너. 지역 단위로 함께할 곳을 찾고 있습니다.</p></div>
</div>`)}
${sec(`${head('지금 연결을 준비하는 서비스')}${table(['분야', '쓰임', '시점'], [
    ['카카오 알림톡', '관리비 고지, 민원 진행 알림, 법정점검 기한 알림', '첫 출시'],
    ['가상계좌 결제대행', '호실별 가상계좌 발급과 입금 통지. 돈은 관리회사·건물주 계좌로 바로 갑니다', '첫 출시'],
    ['전자세금계산서', '임대료·관리비 세금계산서 발행과 국세청 전송', '첫 출시'],
    ['건축물대장', '주소로 용도·면적·층수·사용승인일 불러오기', '첫 출시'],
    ['전자계약', '임대차·관리계약 전자서명', '2027년 하반기'],
    ['회계 프로그램', '전표와 거래처 내보내기', '2028년'],
    ['설비 센서(IoT)', '수변전·기계실 계측값 자동 수집', '2028년'],
  ])}`, 'mist')}
${ctaBand('함께할 방법을 이야기해 보세요', '파트너 제휴 문의를 남기시면 지금 준비하는 조건과 일정을 안내드립니다.')}`;
  return page({ path: '/partners', title: '파트너 — 협력업체·소개·연동·도입 컨설팅', description: '에셋온 파트너 프로그램. 점검·유지보수 협력업체 무료 화면, 세무·회계사무소 등 소개 파트너, 알림톡·결제·세금계산서 연동 파트너, 도입 컨설팅 파트너.', body, jsonld: [breadcrumbLd([['파트너', '/partners']])] });
}

// ───────── 자주 묻는 질문
const FAQ_GROUPS = [
  ['서비스', [
    ['에셋온은 어떤 회사가 쓰나요?', '건물의 시설을 관리하는 FM 회사, 임대차와 관리비를 맡는 PM 회사, 여러 건물의 숫자를 보는 자산운용사와 다건물 건물주, 그리고 관리회사 없이 직접 관리하는 관리소장과 관리단이 씁니다. 건물주, 임차사, 협력업체는 관리회사가 초대하면 무료로 자기 화면을 씁니다.'],
    ['지금 바로 쓸 수 있나요?', `지금은 사전 신청과 파일럿 관리회사를 받고 있습니다. ${LAUNCH.pilot}에 파일럿을 시작하고, ${LAUNCH.open}에 정식으로 가입을 엽니다. 체험판의 법정점검 계산기, 관리비 배분, 견적 계산은 지금 바로 써 볼 수 있습니다.`],
    ['아파트 관리에도 쓸 수 있나요?', '처음에는 오피스, 상가, 물류센터, 병원, 집합건물 같은 비주거 건물에 맞춰 만듭니다. 공동주택 관리비는 따로 정한 법 기준과 공개 의무가 있어, 공동주택 전용 기능은 아직 계획에 없습니다.'],
    ['현장 직원이 나이가 많은데 쓸 수 있을까요?', '현장 화면은 오늘 할 일, 점검, 작업, 민원 네 개만 보입니다. 글자는 크고, 사진을 찍고 숫자를 넣고 완료를 누르면 끝납니다. 교육 한 시간이면 쓸 수 있게 만드는 것이 기준입니다.'],
  ]],
  ['요금과 계약', [
    ['요금은 얼마인가요?', `관리하는 건물 수와 호실 수에 따른 월 구독료입니다. 금액은 파일럿에서 실제 사용량을 확인한 뒤 ${LAUNCH.open} 정식 공개 때 공개합니다. 플랜 구성과 우리 회사에 맞는 플랜은 <a href="/pricing">요금 페이지</a>에서 볼 수 있습니다.`],
    ['약정이 있나요?', '월 단위로 쓰고 언제든 해지할 수 있습니다. 1년 치를 미리 내면 할인됩니다. 30일 무료 체험 기간에는 결제 정보를 받지 않습니다.'],
    ['결제는 어떻게 하나요?', '매월 세금계산서를 받고 계좌로 내는 후불 방식이 기본입니다. 작은 회사는 카드 자동결제를 고를 수 있습니다.'],
    ['알림톡이나 가상계좌 비용은 따로인가요?', '알림톡 발송, 가상계좌 입금, 세금계산서 발행처럼 건마다 외부 비용이 드는 기능은 쓴 만큼 따로 청구합니다. 단가는 요금 페이지에 함께 공개합니다.'],
  ]],
  ['데이터와 보안', [
    ['데이터는 어디에 저장되나요?', '계약, 관리비, 임차사 연락처 같은 기록 데이터는 서울 리전 데이터베이스에 저장하고, 매일 백업합니다. <a href="/security">보안과 데이터</a>에 자세히 정리했습니다.'],
    ['관리비를 에셋온이 받아서 넘겨 주나요?', '아닙니다. 에셋온은 돈을 보관하거나 대신 정산하지 않습니다. 임차인이 입금하면 결제대행사를 거쳐 관리회사나 건물주 계좌로 바로 들어가고, 에셋온은 입금 통지를 받아 고지와 맞춰 볼 뿐입니다.'],
    ['해지하면 데이터는요?', '해지 후 30일 동안 모든 기록을 엑셀로, 첨부 파일을 압축 파일로 내려받을 수 있습니다.'],
  ]],
  ['도입과 이관', [
    ['지금 쓰는 엑셀을 옮길 수 있나요?', '건물, 호실, 임대차, 설비, 인력, 거래처를 엑셀 템플릿으로 한 번에 올립니다. 지금 쓰는 엑셀을 그대로 올려도 열을 맞춰 주고, 오류가 있는 행만 골라 보여 줍니다. <a href="/help/#templates">이관 템플릿</a>을 미리 받아 볼 수 있습니다.'],
    ['도입에 얼마나 걸리나요?', '건물 몇 동이면 회사 등록부터 첫 관리비 고지까지 2~3주가 목표입니다. 파일럿 관리회사는 이관 작업을 함께 합니다.'],
    ['다른 관리 프로그램을 쓰고 있는데 옮길 수 있나요?', '대부분의 프로그램은 엑셀로 내보낼 수 있으니, 내보낸 파일을 이관 템플릿에 맞춰 올리면 됩니다. 파일 형식이 다르면 사전 신청 때 알려 주세요.'],
  ]],
];
function faqPage() {
  const all = FAQ_GROUPS.flatMap(([, items]) => items);
  const body = `
${pageHero({ crumb: [['자주 묻는 질문']], title: '자주 묻는 질문', lede: '여기에 없는 질문은 사전 신청 양식에 남겨 주세요. 담당자가 직접 답해 드립니다.' })}
${FAQ_GROUPS.map(([g, items], i) => sec(`<div class="split-5-7"><div>${head(g)}</div><div>${faq(items)}</div></div>`, i % 2 ? 'mist' : '')).join('')}
${ctaBand()}`;
  return page({ path: '/faq', title: '자주 묻는 질문 — 요금, 데이터, 도입', description: '에셋온을 누가 쓰는지, 언제부터 쓸 수 있는지, 요금과 약정, 결제 방식, 데이터 저장 위치, 관리비 수납 구조, 엑셀 이관과 도입 기간에 대한 답.', body, jsonld: [faqLd(all), breadcrumbLd([['자주 묻는 질문', '/faq']])] });
}

// ───────── 도움말 (도입 가이드 + 이관 템플릿)
export const TEMPLATE_SHEETS = [
  ['회사', '회사 기본정보, 사업자등록번호, 대표, 주소', '1행'],
  ['건물', '건물명, 주소, 용도, 연면적, 층수, 사용승인일, 관리 범위', '건물당 1행'],
  ['호실', '건물, 호실, 층, 전용·공용·계약면적(㎡), 용도, 계량기 번호', '호실당 1행'],
  ['거래처', '건물주·임차사·협력업체, 사업자번호, 담당자, 연락처', '거래처당 1행'],
  ['임대차', '호실, 임차사, 계약 기간, 보증금, 월 임대료, 관리비 방식, 납부일', '계약당 1행'],
  ['관리비 항목', '법정 14개 항목 연결, 배분 기준, 과세 구분', '항목당 1행'],
  ['설비', '건물, 분류, 설비명, 위치, 제조사, 설치일, 점검 주기', '설비당 1행'],
  ['인력', '이름, 직책, 소속 건물, 근무형태, 자격증과 만료일', '사람당 1행'],
  ['법정점검 이력', '항목, 직전 실시일, 업체, 결과', '점검당 1행'],
  ['검침', '호실·계량기, 월, 전기·수도·가스 검침값', '계량기·월당 1행'],
];
function help() {
  const steps = [
    ['회사와 사용자', '회사 정보를 넣고, 대표·관리자·PM·관리소장을 초대합니다. 역할마다 보이는 화면과 권한이 정해져 있습니다.'],
    ['건물과 호실', '주소를 넣으면 건축물대장에서 용도·면적·층수·사용승인일을 불러옵니다. 호실은 이관 템플릿으로 한 번에 올립니다.'],
    ['임대차와 거래처', '임대차 계약을 올리면 렌트롤과 만기 일정이 만들어집니다. 건물주와 협력업체도 이때 등록합니다.'],
    ['관리비 항목과 배분 기준', '지금 받는 관리비 항목을 법정 14개 항목에 연결하고, 항목마다 배분 기준을 정합니다.'],
    ['점검표와 법정점검', '건물 조건으로 법정점검 캘린더가 만들어집니다. 직전 실시일을 넣으면 다음 기한이 맞춰집니다.'],
    ['현장 앱', '현장 근무자는 휴대폰으로 링크를 열고 홈 화면에 추가합니다. 설치 파일은 없습니다.'],
    ['첫 달 마감', '검침을 넣고 관리비를 산정해 확정하면 고지서가 나갑니다. 월말에는 보고서 초안을 확인하고 발행합니다.'],
  ];
  const body = `
${pageHero({ crumb: [['도움말']], title: '에셋온 도입 가이드', lede: '처음 시작하는 순서와 미리 준비할 자료를 정리했습니다. 파일럿 관리회사는 이 순서를 담당자와 함께 진행합니다.' })}
${sec(`${head('시작하는 순서', '온보딩 마법사가 같은 순서로 안내합니다. 건물 몇 동이면 2~3주 안에 첫 관리비 고지까지 갈 수 있습니다.')}<ol class="steps-list">${steps.map(([t, d]) => `<li><div><h3>${t}</h3><p>${d}</p></div></li>`).join('')}</ol>`)}
${sec(`<div class="split-5-7"><div>${head('엑셀 이관 템플릿', '지금 쓰는 엑셀을 이 템플릿에 맞춰 옮기면 한 번에 올라갑니다. 시트마다 작성 예시와 입력 규칙이 들어 있습니다.')}<p class="mt-3"><a class="btn btn-primary" href="/assets/files/asseton-migration-template.xlsx" download>${icon('excel')} 이관 템플릿 내려받기</a></p><p class="note mt-2">엑셀 파일, 시트 10개. 면적은 ㎡, 날짜는 2027-03-01처럼 적습니다.</p></div><div>${table(['시트', '들어가는 내용', '단위'], TEMPLATE_SHEETS)}</div></div>`, 'mist', 'templates')}
${sec(`${head('미리 준비하면 좋은 자료')}<div class="cols-3">
  <div class="callout" style="margin:0"><h3>건물과 계약</h3><p>건물별 호실 목록과 면적, 임대차 계약 목록(렌트롤), 건물주와 맺은 관리계약서.</p></div>
  <div class="callout" style="margin:0"><h3>관리비</h3><p>최근 석 달 치 관리비 산정 엑셀과 고지서 양식, 검침 기록.</p></div>
  <div class="callout" style="margin:0"><h3>시설과 인력</h3><p>점검표와 일지 양식, 법정점검 직전 실시일과 업체, 근무 인력과 자격증 목록.</p></div>
</div>`)}
${ctaBand('이관이 걱정된다면', '사전 신청 때 지금 쓰는 파일 형태를 알려 주시면, 어떤 시트에 어떻게 옮기면 되는지 먼저 안내드립니다.')}`;
  return page({ path: '/help/', title: '도움말 — 도입 순서와 엑셀 이관 템플릿', description: '에셋온 도입 가이드. 회사·사용자 등록부터 건물·호실, 임대차, 관리비 항목, 법정점검, 현장 앱, 첫 달 마감까지의 순서와 엑셀 이관 템플릿(시트 10개).', body, jsonld: [breadcrumbLd([['도움말', '/help/']])] });
}

// ───────── 약관·방침
const legalPage = ({ path, crumb, title, lede, sections, desc }) => {
  const nav = sections.map(([t], i) => `<li><a href="#s${i + 1}">${esc(t)}</a></li>`).join('');
  const body = `
${pageHero({ crumb: [[crumb]], title, lede })}
<section class="section tight"><div class="wrap"><div class="doc-layout">
<nav class="doc-nav" aria-label="목차"><ol>${nav}</ol></nav>
<div class="prose">${sections.map(([t, html], i) => `<h2 id="s${i + 1}">${esc(t)}</h2>${html}`).join('')}</div>
</div></div></section>`;
  return page({ path, title, description: desc, body, jsonld: [breadcrumbLd([[crumb, path]])] });
};

function privacy() {
  const sections = [
    ['처리하는 개인정보와 목적', `<p>${esc(COMPANY.name)}(이하 회사)는 이 홈페이지에서 아래 개인정보를 처리합니다.</p>${table(['구분', '항목', '목적'], [
      ['사전 신청·문의 (필수)', '회사명, 담당자 이름, 휴대폰 번호, 이메일, 회사 유형, 관리 건물 수', '문의 답변, 데모·파일럿 일정 안내, 신청자 확인'],
      ['사전 신청·문의 (선택)', '사업자등록번호, 직책, 관심 플랜, 지금 쓰는 방식, 남긴 말', '상담 준비와 맞춤 안내'],
      ['자동으로 생성되는 정보', '접속 IP 주소, 브라우저 정보, 접속 시각', '자동 입력 방지와 부정 이용 차단, 보안 기록'],
    ])}<p>체험판에 입력한 값은 이용자의 브라우저 안에서만 계산되며 회사로 전송되거나 저장되지 않습니다.</p>`],
    ['보유와 이용 기간', `<p>문의일로부터 1년이 지나면 지체 없이 파기합니다. 다만 파일럿이나 이용계약을 맺은 경우에는 계약 기간과 관계 법령이 정한 기간 동안 보관합니다.</p><ul><li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)</li><li>소비자의 불만 또는 분쟁 처리에 관한 기록: 3년 (같은 법)</li><li>접속 기록: 3개월 (통신비밀보호법)</li></ul>`],
    ['제3자 제공', '<p>회사는 정보주체의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 법률에 특별한 규정이 있는 경우는 예외로 합니다.</p>'],
    ['처리 위탁과 국외 이전', `<p>회사는 홈페이지 운영을 위해 아래 업체에 업무를 맡기고 있습니다. 두 업체 모두 국외 사업자로, 이용자가 신청 양식을 제출하는 시점에 네트워크를 통해 전송됩니다. 국외 이전을 원하지 않으시면 신청 양식 대신 전화로 문의해 주세요. 이 경우 홈페이지 신청은 이용할 수 없습니다.</p>${table(['수탁자', '위탁 업무', '이전 국가', '이전 항목', '보유 기간'], [
      ['Cloudflare, Inc.', '홈페이지 호스팅, 보안(자동 입력 방지), 신청 내용 임시 저장', '미국 및 Cloudflare 데이터센터 소재국', '신청 양식 항목, 접속 정보', '위 보유 기간과 같음'],
      ['Resend, Inc.', '신청 내용을 담당자 이메일로 전달', '미국', '신청 양식 항목', '전달 후 30일 이내 삭제'],
    ])}<p>업체 연락처: Cloudflare(privacyquestions@cloudflare.com), Resend(privacy@resend.com). 위탁 업체가 바뀌면 이 방침을 고쳐 알립니다.</p>`],
    ['파기 절차와 방법', '<p>보유 기간이 지나거나 처리 목적을 이룬 개인정보는 지체 없이 파기합니다. 전자 파일은 복구할 수 없는 방법으로 지우고, 출력물은 분쇄합니다.</p>'],
    ['정보주체의 권리', '<p>정보주체는 언제든지 자신의 개인정보에 대한 열람, 정정, 삭제, 처리정지를 요구하고 동의를 철회할 수 있습니다. 아래 개인정보 보호책임자에게 이메일이나 전화로 요청하시면 10일 안에 처리 결과를 알려 드립니다. 법정대리인이나 위임받은 사람을 통해서도 요청할 수 있습니다.</p>'],
    ['안전성 확보 조치', '<p>회사는 개인정보에 접근할 수 있는 사람을 최소한으로 정하고, 전송 구간을 암호화하며, 접근 기록을 보관하고, 관리용 계정에 2단계 인증을 적용합니다.</p>'],
    ['쿠키와 행태정보', '<p>이 홈페이지는 광고나 이용 행태 분석을 위한 쿠키를 쓰지 않습니다. 자동 입력 방지 기능이 보안 목적으로 브라우저 정보를 확인할 수 있습니다.</p>'],
    ['개인정보 보호책임자', `<p>성명 ${esc(COMPANY.privacyOfficer)} (대표이사)<br>${contactLine()}</p><p>개인정보 침해에 대한 신고나 상담은 아래 기관에도 할 수 있습니다.</p><ul><li>개인정보침해신고센터 (privacy.kisa.or.kr, 국번 없이 118)</li><li>개인정보분쟁조정위원회 (www.kopico.go.kr, 1833-6972)</li><li>대검찰청 사이버수사과 (www.spo.go.kr, 국번 없이 1301)</li><li>경찰청 사이버수사국 (ecrm.police.go.kr, 국번 없이 182)</li></ul>`],
    ['방침의 변경', `<p>이 방침은 ${SITE.updated.replace(/^(\d+)-(\d+)-(\d+)$/, (m, y, mo, d) => `${y}년 ${+mo}월 ${+d}일`)}부터 적용합니다. 내용이 바뀌면 시행 7일 전에 홈페이지에 알립니다.</p><p>이 방침은 홈페이지 이용자에 대한 것입니다. 에셋온 서비스 안에서 관리회사가 등록하는 임차사·건물주 정보는 관리회사가 처리자이며, 회사는 이용계약과 위탁계약에 따라 수탁자로서 처리합니다.</p>`],
  ];
  return legalPage({ path: '/legal/privacy', crumb: '개인정보처리방침', title: '개인정보처리방침', lede: `${COMPANY.name}가 에셋온 홈페이지에서 개인정보를 어떻게 처리하는지 알려 드립니다.`, sections, desc: '에셋온 홈페이지 개인정보처리방침. 수집 항목과 목적, 보유 기간, 처리 위탁과 국외 이전, 정보주체의 권리, 개인정보 보호책임자.' });
}

function terms() {
  const sections = [
    ['목적', `<p>이 약관은 ${esc(COMPANY.name)}(이하 회사)가 운영하는 에셋온 홈페이지(이하 홈페이지)와 홈페이지에서 제공하는 체험판, 자료, 사전 신청(이하 홈페이지 서비스)의 이용 조건을 정합니다.</p>`],
    ['약관의 효력과 변경', '<p>이 약관은 홈페이지에 게시해 효력이 생깁니다. 회사는 관련 법령을 어기지 않는 범위에서 약관을 바꿀 수 있고, 바꾸면 적용일 7일 전부터 홈페이지에 알립니다.</p>'],
    ['에셋온 서비스 이용계약과의 관계', `<p>에셋온 자산관리시스템의 이용(유료 구독, 파일럿 포함)은 별도의 서비스 이용약관 또는 이용계약서에 따릅니다. 서비스 이용약관은 ${LAUNCH.open} 정식 공개 전에 게시하며, 파일럿은 개별 계약서로 정합니다.</p>`],
    ['체험판과 자료', '<p>체험판의 법정점검 계산, 관리비 배분, 견적 계산 결과는 이해를 돕기 위한 예시이며 법률·세무·노무 자문이 아닙니다. 실제 의무 이행이나 계약 금액은 관계 기관과 전문가의 확인을 거쳐 정해야 합니다. 회사는 체험판 결과를 그대로 사용해 생긴 손해에 대해 고의 또는 중대한 과실이 없는 한 책임지지 않습니다.</p><p>인사이트 글은 작성 시점의 법령과 자료를 바탕으로 하며, 이후 바뀐 내용이 반영되지 않았을 수 있습니다.</p>'],
    ['이용자의 의무', '<p>이용자는 사전 신청 때 사실과 다른 정보나 다른 사람의 정보를 입력해서는 안 됩니다. 홈페이지의 정상적인 운영을 방해하거나, 자동화된 방법으로 대량의 요청을 보내거나, 다른 사람의 개인정보를 수집해서는 안 됩니다.</p>'],
    ['지식재산권', '<p>홈페이지의 글, 화면 디자인, 계산 규칙, 템플릿에 대한 권리는 회사에 있습니다. 이관 템플릿은 에셋온 도입 준비를 위해 자유롭게 내려받아 쓸 수 있습니다. 그 밖의 목적으로 복제·배포하려면 회사의 동의를 받아야 합니다.</p>'],
    ['서비스의 변경과 중단', '<p>회사는 홈페이지 서비스의 내용을 바꾸거나, 점검·장애·천재지변 등으로 잠시 중단할 수 있습니다.</p>'],
    ['분쟁 해결', '<p>이 약관은 대한민국 법률에 따릅니다. 홈페이지 서비스와 관련한 분쟁은 민사소송법에 따른 관할 법원에서 다룹니다.</p>'],
    ['부칙', `<p>이 약관은 ${SITE.updated.replace(/^(\d+)-(\d+)-(\d+)$/, (m, y, mo, d) => `${y}년 ${+mo}월 ${+d}일`)}부터 적용합니다.</p>`],
  ];
  return legalPage({ path: '/legal/terms', crumb: '이용약관', title: '홈페이지 이용약관', lede: '에셋온 홈페이지와 체험판, 자료, 사전 신청을 이용하는 조건입니다. 에셋온 서비스 자체의 이용 조건은 정식 공개 전에 따로 게시합니다.', sections, desc: '에셋온 홈페이지 이용약관. 체험판과 자료의 성격, 이용자의 의무, 지식재산권, 서비스 이용계약과의 관계.' });
}

function sla() {
  const sections = [
    ['적용 범위', `<p>이 기준은 에셋온 유료 플랜(스타터, 스탠다드, 프로, 엔터프라이즈)에 적용할 서비스 수준의 초안입니다. ${LAUNCH.open} 정식 공개 때 서비스 이용약관과 함께 확정하며, 파일럿 기간에는 파일럿 계약서의 조건을 따릅니다.</p>`],
    ['월 가용성', `<p>월 가용성 목표는 99.9%입니다. 월 가용성은 한 달 전체 시간에서 서비스를 쓸 수 없었던 시간을 뺀 비율로 계산합니다. 30일 기준으로 약 43분까지의 중단이 99.9%에 해당합니다.</p>`],
    ['크레딧', `${table(['월 가용성', '크레딧 (해당 월 이용료 대비)'], [['99.9% 미만', '5%'], ['99.0% 미만', '15%'], ['95.0% 미만', '50%']])}<p>크레딧은 장애가 있었던 달이 끝난 뒤 30일 안에 요청하면 다음 청구에서 뺍니다. 크레딧은 현금으로 돌려드리지 않으며, 한 달 크레딧은 그 달 이용료를 넘지 않습니다.</p>`],
    ['가용성 계산에서 빼는 시간', '<ul><li>7일 전에 알린 정기 점검 (월 4시간 이내, 평일 오전 2~6시)</li><li>고객의 설정, 계정 관리, 고객 쪽 네트워크나 기기로 생긴 문제</li><li>알림톡, 결제대행, 세금계산서 등 외부 사업자의 장애. 이 경우 에셋온은 재시도와 대체 안내를 합니다</li><li>천재지변, 전쟁, 대규모 통신 장애처럼 회사가 통제할 수 없는 사유</li></ul>'],
    ['지원 응답 시간', `${table(['등급', '예', '첫 응답', '대상 플랜'], [
      ['긴급', '로그인 불가, 관리비 산정·고지 불가, 데이터 손상', '1시간 이내 (24시간)', '프로, 엔터프라이즈'],
      ['높음', '주요 기능 일부가 안 됨, 우회 방법 있음', '업무시간 4시간 이내', '스탠다드 이상'],
      ['보통', '일부 화면 오류, 사용 문의', '1영업일 이내', '전 플랜'],
      ['낮음', '개선 요청, 문서 문의', '3영업일 이내', '전 플랜'],
    ])}<p>업무시간은 평일 오전 9시부터 오후 6시까지입니다. 스타터·스탠다드 플랜의 긴급 장애는 업무시간 1시간 이내에 응답합니다.</p>`],
    ['백업과 복구', '<p>매일 전체 백업을 하고, 7일 안의 원하는 시점으로 복구할 수 있습니다. 데이터 손상이 생기면 마지막 정상 시점으로 되돌리는 것을 목표로 하며, 복구 과정과 결과를 고객 관리자에게 알립니다.</p>'],
    ['장애 알림과 보고', '<p>장애가 확인되면 상태 페이지와 고객 관리자 이메일로 30분 안에 알립니다. 긴급 장애가 끝나면 5영업일 안에 원인, 영향 범위, 재발 방지 조치를 정리한 보고서를 드립니다.</p>'],
  ];
  return legalPage({ path: '/legal/sla', crumb: '서비스 수준', title: '서비스 수준 기준', lede: '유료 플랜에 적용할 가용성, 크레딧, 지원 응답 시간의 기준입니다. 정식 공개 때 이용약관과 함께 확정합니다.', sections, desc: '에셋온 서비스 수준 기준(SLA) 초안. 월 가용성 99.9%, 크레딧 5·15·50%, 지원 등급별 응답 시간, 백업과 복구, 장애 알림.' });
}

// ───────── 404
function notFound() {
  const body = `
<section class="page-hero"><div class="wrap"><div><h1>찾는 페이지가 없습니다</h1><p class="lede">주소가 바뀌었거나 잘못 입력되었을 수 있습니다. 아래에서 찾으시는 곳으로 가 보세요.</p>
<div class="actions"><a class="btn btn-primary" href="/">홈으로</a><a class="btn btn-line" href="/features/">전체 기능</a><a class="btn btn-line" href="/demo/">체험판</a><a class="btn btn-line" href="/faq">자주 묻는 질문</a></div></div></div></section>`;
  return page({ path: '/404', title: '페이지를 찾을 수 없습니다', description: '요청한 페이지를 찾을 수 없습니다.', body, noindex: true });
}

export const ROUTES = [
  ['/security', security, { priority: '0.7' }],
  ['/roadmap', roadmap, { priority: '0.6' }],
  ['/signup', signup, { priority: '0.8' }],
  ['/about', about, { priority: '0.5' }],
  ['/partners', partners, { priority: '0.5' }],
  ['/faq', faqPage, { priority: '0.7' }],
  ['/help/', help, { priority: '0.6' }],
  ['/legal/privacy', privacy, { priority: '0.3' }],
  ['/legal/terms', terms, { priority: '0.3' }],
  ['/legal/sla', sla, { priority: '0.3' }],
  ['/404', notFound, { sitemap: false }],
];
