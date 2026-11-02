/**
 * GU System · 견적 계산 엔진
 *
 * 기존 엑셀 견적서('24년 인건비 견적' 시트)의 수식과 반올림·절사 규칙을 그대로 옮겼습니다.
 * 화면, 엑셀, PDF가 모두 이 함수 하나의 결과만 사용하므로 숫자가 서로 어긋나지 않습니다.
 *
 * 원본 대비 바로잡은 부분 (tests/engine.test.mjs 참고)
 *  - 연차수당: 일근 직종은 1일 실근로시간 × 15일 ÷ 12개월로 통일
 *    (원본은 보안팀장·주차관리 열에 교대근무용 ÷2 수식이 복사되어 절반만 반영됨)
 *  - 퇴직급여 충당금: 모든 직종 원 단위 반올림으로 통일 (원본 미화직만 백원 단위)
 */
import { GROUP_ORDER, GROUPS } from './presets.js';

const EPS = 1e-9;

/** 엑셀 ROUND (자릿수 음수 허용, 0.5는 0에서 먼 쪽으로) */
export function xround(v, digits = 0) {
  if (digits < 0) {
    const unit = Math.pow(10, -digits);
    return Math.sign(v) * Math.floor(Math.abs(v) / unit + 0.5 + EPS) * unit || 0;
  }
  const f = Math.pow(10, digits);
  const r = Math.floor(Math.abs(v) * f + 0.5 + EPS);
  return (Math.sign(v) * r) / f || 0;
}
/** 엑셀 ROUNDDOWN */
export function xrounddown(v, digits = 0) {
  if (digits < 0) {
    const unit = Math.pow(10, -digits);
    return Math.sign(v) * Math.floor(Math.abs(v) / unit + EPS) * unit || 0;
  }
  const f = Math.pow(10, digits);
  const r = Math.floor(Math.abs(v) * f + EPS);
  return (Math.sign(v) * r) / f || 0;
}
/** 단위 금액으로 절사 (예: 100000 → 10만원 미만 버림) */
export function cutBy(v, unit) {
  if (!unit || unit <= 1) return Math.floor(v + EPS);
  return Math.floor((v + EPS) / unit) * unit;
}

export const num = (v, d = 0) => {
  const n = typeof v === 'string' ? parseFloat(v.replace(/,/g, '')) : Number(v);
  return Number.isFinite(n) ? n : d;
};

/** 근무형태에 따른 시간 계산 */
export function calcHours(role) {
  const dayNet = Math.max(0, num(role.dayHours) - num(role.dayBreak));
  const nightNet = Math.max(0, num(role.nightHours) - num(role.nightBreak));
  let monthly = 0, nightMonthly = 0, leaveDaily = 0;
  switch (role.shift) {
    case 'shift3':
      monthly = ((dayNet + nightNet) * 365) / 12 / 3;
      nightMonthly = (nightNet * 365) / 12 / 3;
      leaveDaily = (dayNet + nightNet) / 3;
      break;
    case 'shift2':
      monthly = ((dayNet + nightNet) * 365) / 12 / 2;
      nightMonthly = (nightNet * 365) / 12 / 2;
      leaveDaily = (dayNet + nightNet) / 2;
      break;
    case 'custom':
      monthly = num(role.customMonthlyHours);
      nightMonthly = num(role.customNightHours);
      leaveDaily = num(role.customLeaveHours);
      break;
    case 'day5':
    default:
      // 야간이 있는 일근(예: 주5일 야간조)도 야간 실근로를 근로시간에 넣고, 야간가산은 실제 근무일(주5일) 기준
      monthly = ((((dayNet + nightNet) * (5 + 1)) / 7) * 365) / 12;
      nightMonthly = (((nightNet * 5) / 7) * 365) / 12;
      leaveDaily = dayNet + nightNet;
      break;
  }
  const ov = role.leaveHoursOverride;
  if (ov !== null && ov !== undefined && String(ov).trim() !== '' && Number.isFinite(Number(String(ov).replace(/,/g, '')))) {
    leaveDaily = num(ov);
  }
  return { dayNet, nightNet, monthly, nightMonthly, leaveDaily, overtime: num(role.overtimeHours) };
}

export function wageOf(role, rates) {
  return role.minLinked ? num(rates.minWage) : num(role.hourlyWage);
}

/**
 * 1개 직책(열)의 산출내역. 금액은 '1인 기준(per)'과 '인원 전체(total)'를 함께 돌려줍니다.
 * 엑셀 원본처럼 각 단계에서 반올림한 1인 금액에 인원을 곱합니다.
 */
export function calcRole(role, rates) {
  const n = Math.max(0, Math.round(num(role.count)));
  // (인원은 정수만 의미가 있으므로 반올림)
  const h = calcHours(role);
  const wage = wageOf(role, rates);

  // 직접인건비
  const basePay = h.monthly * wage; // 엑셀과 동일하게 반올림하지 않음
  const otPay = xround(h.overtime * wage, -1) * num(rates.overtimeRate, 1.5);
  const nightPay = xround(wage * h.nightMonthly, -1) * num(rates.nightPremium, 0.5);
  const leavePay = (wage * h.leaveDaily * 15) / 12;
  const allowPosition = num(role.allowPosition);
  const allowLicense = num(role.allowLicense);
  const allowSum = otPay + nightPay + leavePay + allowPosition + allowLicense;
  const meal = num(role.meal);
  const severance = xround((basePay + allowSum + meal) / 12, 0);
  const laborSub = xrounddown(basePay + allowSum + severance, 0);

  // 4대보험 외 (비과세 식대 제외 금액 기준)
  const insBase = basePay + allowSum;
  const pension = xround(insBase * num(rates.pension), -2);
  const health = xround(insBase * num(rates.health), -2);
  const ltc = xround(health * num(rates.ltcRatio), -2);
  const injury = xround(insBase * num(rates.injury), -2);
  const employment = xround(insBase * (num(rates.employment) + num(rates.employmentStab)), -2);
  const nightCheck = role.nightCheck ? num(rates.nightCheckAnnual, 50000) / 12 : 0;
  const monthlySalary = xround(basePay + allowSum + meal - leavePay, -3);
  const laborDay = role.laborDay ? monthlySalary / 30.416 / 12 / 2 : 0;
  const disability = rates.disabilityOn ? num(rates.disabilityBase) * num(rates.disabilityRate) : 0;
  const insSub = xrounddown(pension + health + ltc + injury + employment + nightCheck + laborDay + disability, 0);

  // 복리후생비
  const gift = (num(role.giftUnit) * num(role.giftTimes)) / 12;
  const uniform = (num(role.uniformUnit) * num(role.uniformTimes)) / 12;
  const safetyEdu = num(role.safetyEdu);
  const opsCost = num(role.opsCost);
  const welfareSub = xrounddown(meal + gift + uniform + safetyEdu + opsCost, 0);

  const liability = num(role.liability);
  const mid = laborSub + insSub + welfareSub + liability; // 중계
  const admin = xround(mid * num(rates.adminRate), 0);
  const profit = xround(mid * num(rates.profitRate), 0);
  const total = mid + admin + profit;

  const per = {
    basePay, otPay, nightPay, leavePay, allowPosition, allowLicense, allowSum, severance, laborSub,
    pension, health, ltc, injury, employment, nightCheck, laborDay, disability, insSub,
    meal, gift, uniform, safetyEdu, opsCost, welfareSub,
    liability, mid, admin, profit, total,
  };
  const tot = {};
  for (const k of Object.keys(per)) tot[k] = per[k] * n;

  return {
    id: role.id,
    role,
    count: n,
    wage,
    hours: h,
    monthlySalary,
    annualSalary: monthlySalary * 12,
    per,
    tot,
    // 견적총괄(갑)에 올라가는 직책별 월 비용 = 중계 − 영업배상책임보험
    summaryMonthly: tot.mid - tot.liability,
  };
}

const sumBy = (arr, fn) => arr.reduce((s, x) => s + fn(x), 0);

/** 견적 전체 계산 */
export function calcQuote(quote) {
  const rates = quote.rates;
  const roles = (quote.roles || []).map((r) => calcRole(r, rates));

  const gOf = (r) => (GROUP_ORDER.includes(r.role.group) ? r.role.group : 'etc');
  const groups = GROUP_ORDER.map((g) => {
    const rs = roles.filter((r) => gOf(r) === g);
    if (!rs.length) return null;
    const keys = Object.keys(rs[0].tot);
    const tot = {};
    for (const k of keys) tot[k] = sumBy(rs, (r) => r.tot[k]);
    return {
      key: g,
      label: GROUPS[g].label,
      docLabel: GROUPS[g].docLabel,
      roles: rs,
      count: sumBy(rs, (r) => r.count),
      monthlySalary: sumBy(rs, (r) => r.monthlySalary * r.count),
      summaryMonthly: sumBy(rs, (r) => r.summaryMonthly),
      tot,
    };
  }).filter(Boolean);

  const headcount = sumBy(roles, (r) => r.count);
  const laborTotal = sumBy(roles, (r) => r.summaryMonthly); // 인건비 소계
  const liability = sumBy(roles, (r) => r.tot.liability);   // 영업배상책임보험
  const mid = laborTotal + liability;                        // 중계
  const admin = sumBy(roles, (r) => r.tot.admin);
  const profit = sumBy(roles, (r) => r.tot.profit);
  const costSumRaw = mid + admin + profit;
  const costSum = cutBy(costSumRaw, num(rates.subtotalCut, 1)); // 기타비용 소계 (절사)

  const ex = quote.extras || { maintenance: [], depreciation: [] };
  // 줄마다 10원 미만을 버린 뒤 합산 (줄 금액과 소계가 어긋나지 않게)
  const maintenance = sumBy(ex.maintenance || [], (x) => (x.separate ? 0 : xrounddown(Math.max(0, num(x.amount)), -1)));
  const depreciation = sumBy(ex.depreciation || [], (x) => (x.separate ? 0 : Math.round(Math.max(0, num(x.amount)))));

  const grandRaw = costSum + maintenance + depreciation;
  const grand = cutBy(grandRaw, num(rates.totalCut, 1));

  // 산출내역 합계 열 (모든 직책 합)
  const allTot = {};
  if (roles.length) for (const k of Object.keys(roles[0].tot)) allTot[k] = sumBy(roles, (r) => r.tot[k]);

  return {
    roles,
    groups,
    headcount,
    laborTotal,
    liability,
    mid,
    admin,
    profit,
    costSumRaw,
    costSum,
    cutAdjust: costSum - costSumRaw,
    maintenance,
    depreciation,
    grandRaw,
    grand,
    grandAnnual: grand * 12,
    vat: Math.floor(grand * 0.1),
    allTot,
    monthlySalaryTotal: sumBy(roles, (r) => r.monthlySalary * r.count),
  };
}

/** 직군별 인원 요약 문장: 시설관리직 5명, 보안·주차관리직 4명, 환경미화직 7명(남 2, 여 5) */
export function headcountSentence(result) {
  const parts = result.groups.filter((g) => g.count > 0).map((g) => {
    let s = `${g.label} ${g.count}명`;
    if (g.key === 'cleaning') {
      const isF = (r) => /여|女/.test(r.role.subtitle || '') || /여|女/.test(r.role.title || '');
      const f = g.roles.filter(isF).reduce((a, r) => a + r.count, 0);
      const m = g.count - f;
      if (f && m) s += `(남 ${m}, 여 ${f})`;
    }
    return s;
  });
  return `${parts.join(', ')}, 총 ${result.headcount}명 근무`;
}
