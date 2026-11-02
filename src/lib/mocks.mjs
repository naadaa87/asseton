// 제품 화면 모형 (HTML/CSS). 모든 숫자는 예시입니다.
import { icon } from './html.mjs';

export const exampleNote = (t = '예시 화면입니다. 건물명과 숫자는 실제 고객 데이터가 아닙니다.') => `<p class="mock-note">${t}</p>`;

// ---------- 히어로: 기록 → 작업 → 보고 ----------
export function heroFlow() {
  return `<div class="flow-stage" data-flow aria-label="현장 점검 기록이 작업지시와 월간 보고서로 이어지는 예시 화면" role="img">
  <div class="backdrop"></div>
  <svg class="wire" aria-hidden="true"><path class="w1"/><path class="w2"/><path class="pulse p1"/><path class="pulse p2"/></svg>
  <div class="flow-card flow-a" data-a>
    <div class="cap">${icon('phone')}<span class="where">워크</span><span>현장 근무자</span></div>
    <div class="body">
      <b style="color:var(--ink);font-size:13px">B1 수변전실 정기점검</b>
      <div style="font-size:11px;color:var(--muted)">3월 14일 09:20 · 시설기사</div>
      <div class="mt-1">
        <div class="check-row"><span class="box ok"></span><span>수전 전압</span><span class="val">22.9kV</span></div>
        <div class="check-row"><span class="box ok"></span><span>역률</span><span class="val">0.96</span></div>
        <div class="check-row" data-flag><span class="box ok" data-flag-box></span><span>변압기 2호 온도</span><span class="val" data-flag-val>86℃ / 기준 85℃</span></div>
        <div class="check-row"><span class="box ok"></span><span>절연 상태</span><span class="val">이상 없음</span></div>
      </div>
      <div style="display:flex;gap:6px;margin-top:10px;align-items:center"><span class="chip">사진 1장</span><span class="chip amber" data-flag-chip style="opacity:.0">이상 1건</span></div>
    </div>
  </div>
  <div class="flow-card flow-b" data-b>
    <div class="cap">${icon('monitor')}<span class="where">오피스</span><span>관리소장 · 본사</span></div>
    <div class="body">
      <div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><span style="font-size:11px;color:var(--muted)">작업지시 WO-0142</span><span class="chip" data-wo-state>접수</span></div>
      <b style="display:block;color:var(--ink);font-size:13.5px;margin-top:6px">변압기 2호 냉각팬 점검</b>
      <div style="font-size:11.5px;color:var(--muted);margin-top:4px">정기점검 이상 항목에서 자동 생성 · 담당 시설팀장 · 기한 내일</div>
      <div class="wo-steps" data-wo-steps><span class="done"></span><span></span><span></span><span></span></div>
      <div style="display:flex;justify-content:space-between;font-size:10.5px;color:var(--faint);margin-top:4px"><span>접수</span><span>배정</span><span>진행</span><span>완료</span></div>
    </div>
  </div>
  <div class="flow-card flow-c" data-c>
    <div class="cap">${icon('report')}<span class="where">오너</span><span>건물주 월간 보고</span></div>
    <div class="body">
      <b style="color:var(--ink);font-size:13px">역삼 A빌딩 · 3월</b>
      <div class="mini-kpis">
        <div><span>임대율</span><b>96.2%</b></div>
        <div><span>수납률</span><b>98.7%</b></div>
        <div data-repair><span>이번 달 수선</span><b data-repair-n>6건</b></div>
        <div><span>민원 처리</span><b>12건</b></div>
      </div>
      <div style="font-size:11.5px;display:flex;justify-content:space-between"><span class="muted">법정점검 이행</span><b style="color:var(--on-deep)">18 / 18</b></div>
      <div style="font-size:11.5px;margin-top:8px;padding:8px 10px;background:var(--amber-tint);border-radius:6px;color:#6b4300" data-decision>승인 요청 1건 · 냉각팬 교체 견적</div>
    </div>
  </div>
</div>`;
}

// ---------- 오피스 대시보드 ----------
export function officeDashboard() {
  return `<div class="device">
  <div class="bar"><i></i><i></i><i></i><span class="url">app.asseton · 포트폴리오</span></div>
  <div class="app">
    <div class="side">
      <div class="logo"><span class="lamp"></span>AssetOn</div>
      <a class="on">대시보드</a><a>건물·호실·설비</a>
      <div class="grp">시설관리</div><a>작업지시</a><a>점검·운영일지</a><a>법정점검</a><a>근무표</a><a>민원</a>
      <div class="grp">자산운영</div><a>임대차·렌트롤</a><a>관리비·고지</a><a>수납·연체</a><a>월간 보고</a>
      <div class="grp">자산관리</div><a>포트폴리오</a>
    </div>
    <div class="main">
      <h5>대시보드</h5><div class="sub">관리 건물 12동 · 2027년 3월</div>
      <div class="kpis">
        <div class="kpi"><span>수납률</span><b>97.4%</b><em>전월 대비 +0.6%p</em></div>
        <div class="kpi"><span>미완료 작업</span><b>9건</b><em>긴급 1</em></div>
        <div class="kpi"><span>법정점검 지연</span><b style="color:var(--red)">1건</b><em class="down">전기 정기검사</em></div>
        <div class="kpi"><span>만기 90일 이내</span><b>4건</b><em>갱신 협상 2</em></div>
      </div>
      <table class="mini-table">
        <thead><tr><th>건물</th><th class="r">임대율</th><th class="r">수납률</th><th class="r">작업</th><th>법정점검</th></tr></thead>
        <tbody>
          <tr><td>역삼 A빌딩</td><td class="r">96.2%</td><td class="r">98.7%</td><td class="r">2</td><td><span class="chip on">이행</span></td></tr>
          <tr><td>성수 B센터</td><td class="r">91.0%</td><td class="r">95.1%</td><td class="r">3</td><td><span class="chip red">지연 1</span></td></tr>
          <tr><td>가산 C타워</td><td class="r">100%</td><td class="r">99.2%</td><td class="r">1</td><td><span class="chip amber">D-7</span></td></tr>
          <tr><td>판교 D스퀘어</td><td class="r">88.4%</td><td class="r">96.0%</td><td class="r">3</td><td><span class="chip on">이행</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>
</div>`;
}

// ---------- 워크 앱 ----------
export function workPhone() {
  const row = (t, s, chip, cls = '') => `<div style="display:grid;grid-template-columns:44px 1fr;gap:8px;padding:9px 0;border-bottom:1px solid var(--line)"><span style="font-size:11px;color:var(--muted);font-variant-numeric:tabular-nums">${t}</span><span><b style="display:block;color:var(--ink);font-size:12px;font-weight:600">${s}</b><span class="chip ${cls}" style="margin-top:4px;height:20px;font-size:10.5px">${chip}</span></span></div>`;
  return `<div class="phone"><div class="notch"><i></i></div><div class="scr">
  <div class="sub">역삼 A빌딩 · 시설기사</div><h6>오늘 할 일 4건</h6>
  <div style="margin-top:8px">${row('09:00', 'B1 수변전실 정기점검', '진행 중', 'blue')}${row('10:30', '옥상·기계실 순찰', '대기')}${row('13:00', '3층 화장실 누수 확인', '민원 · 긴급', 'amber')}${row('18:00', '전기 운영일지 마감', '대기')}</div>
  <span class="big-btn">QR 찍고 바로 입력</span>
  <div style="font-size:10.5px;color:var(--muted);text-align:center;margin-top:8px"><span class="lamp" style="width:6px;height:6px;margin-right:6px;vertical-align:middle"></span>오프라인에서도 저장됩니다</div>
</div></div>`;
}

// ---------- 오너 포털 ----------
export function ownerPhone() {
  return `<div class="phone"><div class="notch"><i></i></div><div class="scr">
  <div class="sub">건물주 · 3월 보고</div><h6>역삼 A빌딩</h6>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:10px">
    <div class="kpi"><span>임대율</span><b>96.2%</b></div><div class="kpi"><span>수납률</span><b>98.7%</b></div>
    <div class="kpi"><span>순영업수익</span><b>1.84억</b></div><div class="kpi"><span>민원</span><b>12건</b></div>
  </div>
  <div style="margin-top:10px;border:1px solid var(--line);border-radius:8px;padding:10px">
    <div style="font-size:10.5px;color:var(--amber);font-weight:600">승인 요청</div>
    <b style="display:block;color:var(--ink);font-size:12px;margin-top:2px">냉각팬 교체 견적 148만원</b>
    <div style="font-size:10.5px;color:var(--muted);margin-top:2px">견적 3건 비교 · 관리소장 의견 첨부</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px"><span class="big-btn on" style="margin:0;padding:8px">승인</span><span class="big-btn" style="margin:0;padding:8px;background:#fff;color:var(--ink);border:1px solid var(--line)">질문하기</span></div>
  </div>
  <div style="font-size:11px;margin-top:10px;display:flex;justify-content:space-between"><span class="muted">월간 보고서</span><b style="color:var(--ink)">PDF 열기</b></div>
</div></div>`;
}

// ---------- 임차사 알림톡 ----------
export function tenantKakao() {
  return `<div class="phone kakao"><div class="notch" style="background:#b9cde3"><i></i></div><div class="scr">
  <div class="sender"><i></i><span>역삼 A빌딩 관리사무소</span></div>
  <div class="bubble"><div class="bh">알림톡 도착</div><div class="bb">
  <b>[역삼 A빌딩] 3월 관리비 안내</b><br>502호 · ㈜하늘상사<br><br>
  납부 금액 1,284,600원<br>납부 기한 4월 10일<br>입금 계좌 우리 0000-000-000000 (502호 전용)<br><br>
  항목별 세부 내역은 아래에서 확인하실 수 있습니다.</div>
  <div class="bl">고지서 보기</div><div class="bl">시설 요청하기</div></div>
  <div style="font-size:10.5px;color:#4a5a6e;text-align:center;margin-top:10px">앱 설치 없이 링크로 열립니다</div>
</div></div>`;
}

// ---------- 모듈별 화면 ----------
export function fmMock() {
  return `<div class="device"><div class="bar"><i></i><i></i><i></i><span class="url">시설관리 · 법정점검</span></div>
  <div class="main" style="padding:16px;background:#fafbfc">
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap"><h5 style="margin:0;font-size:14px;color:var(--ink)">성수 B센터 · 법정점검 캘린더</h5><span class="chip">업무시설 · 연면적 12,480㎡ · 지상 15층</span></div>
    <table class="mini-table">
      <thead><tr><th>항목</th><th>주기</th><th>다음 기한</th><th>상태</th></tr></thead>
      <tbody>
        <tr><td>전기설비 정기검사</td><td>3년</td><td>3월 10일</td><td><span class="chip red">지연 4일</span></td></tr>
        <tr><td>승강기 자체점검</td><td>매월</td><td>3월 20일</td><td><span class="chip amber">D-6</span></td></tr>
        <tr><td>저수조 청소</td><td>반기</td><td>4월 4일</td><td><span class="chip">D-21</span></td></tr>
        <tr><td>소방시설 종합점검</td><td>연 1회</td><td>9월</td><td><span class="chip on">3월 작동점검 완료</span></td></tr>
        <tr><td>기계설비 성능점검</td><td>연 1회</td><td>11월</td><td><span class="chip">예정</span></td></tr>
        <tr><td>건축물 정기점검</td><td>3년</td><td>2028년 6월</td><td><span class="chip">예정</span></td></tr>
      </tbody>
    </table>
    <div style="font-size:11px;color:var(--muted);margin-top:10px">결과 보고서를 첨부하면 이행으로 바뀌고, 월간 보고서에 자동으로 들어갑니다.</div>
  </div></div>`;
}

export function pmMock() {
  return `<div class="device"><div class="bar"><i></i><i></i><i></i><span class="url">자산운영 · 관리비 산정</span></div>
  <div class="main" style="padding:16px;background:#fafbfc">
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap"><h5 style="margin:0;font-size:14px;color:var(--ink)">역삼 A빌딩 · 3월 관리비</h5><span class="chip blue">초안 · 확정 전</span></div>
    <table class="mini-table">
      <thead><tr><th>호실</th><th class="r sm-hide">전용㎡</th><th class="r">일반관리비</th><th class="r sm-hide">청소·경비</th><th class="r">전기료</th><th class="r">합계</th></tr></thead>
      <tbody>
        <tr><td>201호</td><td class="r sm-hide">412.5</td><td class="r">412,500</td><td class="r sm-hide">288,750</td><td class="r">318,400</td><td class="r">1,019,650</td></tr>
        <tr><td>301호</td><td class="r sm-hide">412.5</td><td class="r">412,500</td><td class="r sm-hide">288,750</td><td class="r">296,100</td><td class="r">997,350</td></tr>
        <tr style="background:var(--amber-tint)"><td>502호</td><td class="r sm-hide">498.0</td><td class="r">498,000</td><td class="r sm-hide">348,600</td><td class="r">438,000</td><td class="r">1,284,600</td></tr>
        <tr><td>공실 701호</td><td class="r sm-hide">286.4</td><td class="r">286,400</td><td class="r sm-hide">200,480</td><td class="r">12,300</td><td class="r">499,180</td></tr>
      </tbody>
    </table>
    <div style="font-size:11px;color:#6b4300;margin-top:10px;background:var(--amber-tint);padding:8px 10px;border-radius:6px">502호 전기료가 전월보다 34% 늘었습니다. 검침값을 확인한 뒤 확정하세요.</div>
    <div style="font-size:11px;color:var(--muted);margin-top:8px">공실 호실의 공용 항목은 건물주 부담으로 따로 모입니다.</div>
  </div></div>`;
}

export function amMock() {
  return `<div class="device"><div class="bar"><i></i><i></i><i></i><span class="url">자산관리 · 포트폴리오</span></div>
  <div class="main" style="padding:16px;background:#fafbfc">
    <h5 style="margin:0;font-size:14px;color:var(--ink)">포트폴리오 · 2027년 1분기</h5>
    <div class="kpis" style="grid-template-columns:repeat(3,1fr)">
      <div class="kpi"><span>분기 NOI</span><b>14.2억</b><em>예산 대비 +2.1%</em></div>
      <div class="kpi"><span>가중 임대율</span><b>94.1%</b><em>전분기 +0.8%p</em></div>
      <div class="kpi"><span>12개월 내 만기</span><b>18.6%</b><em class="down">임대면적 기준</em></div>
    </div>
    <table class="mini-table">
      <thead><tr><th>자산</th><th class="r">임대가능㎡</th><th class="r">임대율</th><th class="r">NOI(분기)</th><th class="r">예산 대비</th></tr></thead>
      <tbody>
        <tr><td>역삼 A빌딩</td><td class="r">9,820</td><td class="r">96.2%</td><td class="r">5.51억</td><td class="r">+3.4%</td></tr>
        <tr><td>성수 B센터</td><td class="r">8,140</td><td class="r">91.0%</td><td class="r">3.86억</td><td class="r" style="color:var(--red)">−1.9%</td></tr>
        <tr><td>가산 C타워</td><td class="r">6,300</td><td class="r">100%</td><td class="r">2.95억</td><td class="r">+4.0%</td></tr>
        <tr><td>판교 D스퀘어</td><td class="r">4,910</td><td class="r">88.4%</td><td class="r">1.88억</td><td class="r">+0.6%</td></tr>
      </tbody>
    </table>
    <div style="font-size:11px;color:var(--muted);margin-top:10px">숫자를 누르면 임대차·관리비·지출 원장까지 내려가 근거를 볼 수 있습니다.</div>
  </div></div>`;
}

export function salesMock() {
  return `<div class="device"><div class="bar"><i></i><i></i><i></i><span class="url">영업 · FM 견적서</span></div>
  <div class="main" style="padding:16px;background:#fafbfc">
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap"><h5 style="margin:0;font-size:14px;color:var(--ink)">견적 Q-2027-0031 · 오피스 16명</h5><span class="chip">2027년 요율 적용</span></div>
    <table class="mini-table">
      <thead><tr><th>직군</th><th class="r">인원</th><th>근무형태</th><th class="r">월 금액</th></tr></thead>
      <tbody>
        <tr><td>시설관리직</td><td class="r">5</td><td>일근 2 · 3교대 3</td><td class="r">21,840,000</td></tr>
        <tr><td>보안·주차관리직</td><td class="r">4</td><td>일근 2 · 맞교대 2</td><td class="r">15,320,000</td></tr>
        <tr><td>환경미화직</td><td class="r">7</td><td>일근 주5일</td><td class="r">20,110,000</td></tr>
        <tr><td><b>총합계 (월)</b></td><td class="r"><b>16</b></td><td></td><td class="r"><b>58,400,000</b></td></tr>
      </tbody>
    </table>
    <div style="font-size:11px;color:#6b4300;margin-top:10px;background:var(--amber-tint);padding:8px 10px;border-radius:6px">보내기 전 확인 1건 · 미화원 시급이 2027년 최저시급보다 낮습니다.</div>
    <div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap"><span class="chip">엑셀</span><span class="chip">PDF</span><span class="chip">메일 문구</span><span class="chip">제안서에 넣기</span></div>
  </div></div>`;
}

export function portalMock() {
  return `<div style="display:flex;gap:20px;flex-wrap:wrap;justify-content:center">${ownerPhone()}${tenantKakao()}</div>`;
}

// 월간 보고서 첫 장
export function reportSheet() {
  return `<div class="device" style="max-width:640px">
  <div class="bar"><span class="url">월간 보고서 · 역삼 A빌딩 · 2027년 3월</span><span class="tag">예시</span></div>
  <div style="padding:22px 24px;font-size:13px">
    <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;flex-wrap:wrap"><div><div style="font-size:11px;color:var(--muted)">○○관리 주식회사 · 자산운영팀</div><b style="font-size:18px;color:var(--ink)">2027년 3월 운영 보고</b></div><span class="chip on">발행됨 · 4월 3일</span></div>
    <div class="five" style="margin-top:14px">
      <div><b>96.2%</b><span>임대율</span></div><div><b>98.7%</b><span>수납률</span></div><div><b>4,210만</b><span>관리비 부과</span></div><div><b>7건</b><span>수선</span></div><div><b>12건</b><span>민원</span></div>
    </div>
    <table class="mini-table" style="margin-top:6px">
      <thead><tr><th>수입·지출 (원)</th><th class="r">당월</th><th class="r">예산</th><th class="r">차이</th></tr></thead>
      <tbody>
        <tr><td>임대료 수입</td><td class="r">182,400,000</td><td class="r">180,000,000</td><td class="r">+2,400,000</td></tr>
        <tr><td>관리비 수입</td><td class="r">42,100,000</td><td class="r">41,500,000</td><td class="r">+600,000</td></tr>
        <tr><td>운영비</td><td class="r">40,300,000</td><td class="r">41,000,000</td><td class="r">−700,000</td></tr>
        <tr><td><b>순영업수익(NOI)</b></td><td class="r"><b>184,200,000</b></td><td class="r">180,500,000</td><td class="r"><b>+3,700,000</b></td></tr>
      </tbody>
    </table>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px">
      <div><b style="color:var(--ink);font-size:12px">임대차</b><div style="font-size:12px;color:var(--muted);margin-top:4px;line-height:1.6">만기 90일 이내 2건 (502호 갱신 협상, 1101호 퇴거 예정) · 공실 1개 호실 286.4㎡</div></div>
      <div><b style="color:var(--ink);font-size:12px">시설·법정점검</b><div style="font-size:12px;color:var(--muted);margin-top:4px;line-height:1.6">이행 18/18 · 소방 작동점검 완료 · 승강기 자체점검 4대 완료</div></div>
    </div>
    <div style="margin-top:14px;padding:12px 14px;border:1px solid #f0c674;background:var(--amber-tint);border-radius:8px;font-size:12px;color:#5c3a00"><b style="color:#5c3a00">결정이 필요한 일</b><br>변압기 2호 냉각팬 교체 — 견적 3건 중 최저 148만원(부가세 별도). 4월 10일까지 승인 요청</div>
  </div>
</div>`;
}
