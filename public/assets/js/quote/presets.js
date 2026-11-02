/**
 * GU System · 견적서 모듈 — 기준값 프리셋, 근무형태, 직책 라이브러리, 템플릿
 *
 * 연도별 기준값은 매년 1회 이 파일만 고치면 전체 견적에 반영됩니다.
 * (최저임금 고시는 매년 8월, 건강·장기요양보험료율은 8~11월, 산재보험료율은 12월 고시)
 */

/** 연도별 기준값 프리셋 */
export const RATE_PRESETS = {
  2024: {
    label: '2024년 (기존 견적서 적용값)',
    minWage: 9860,
    pension: 0.045,          // 국민연금 사업주 부담분
    health: 0.03545,         // 건강보험 사업주 부담분
    ltcRatio: 0.1295,        // 장기요양 = 건강보험료 × 비율
    injury: 0.016,           // 산재보험 (기존 견적서 적용값)
    employment: 0.009,       // 고용보험 실업급여 사업주분
    employmentStab: 0,       // 고용안정·직업능력개발 (기존 견적서 미반영)
    disabilityBase: 1207000, // 장애인고용부담금 부담기초액(월)
    disabilityRate: 0.031,   // 민간 의무고용률
    pending: [],
    sources: ['기존 엑셀 견적서(2024년) 적용값 그대로'],
  },
  2025: {
    label: '2025년',
    minWage: 10030,
    pension: 0.045,
    health: 0.03545,
    ltcRatio: 0.1295,
    injury: 0.0086,
    employment: 0.009,
    employmentStab: 0.0025,
    disabilityBase: 1258000,
    disabilityRate: 0.031,
    pending: [],
    sources: ['최저시급 10,030원', '국민연금 9%(사업주 4.5%)', '건강보험 7.09%, 장기요양 건보료의 12.95%', '산재: 2026년 고시 업종요율 준용 (평균요율 1.47% 2년 연속 동결)', '장애인고용부담금 부담기초액 1,258,000원'],
  },
  2026: {
    label: '2026년',
    minWage: 10320,
    pension: 0.0475,
    health: 0.03595,
    ltcRatio: 0.1314,
    injury: 0.0086,
    employment: 0.009,
    employmentStab: 0.0025,
    disabilityBase: 1295000,
    disabilityRate: 0.031,
    pending: [],
    sources: ['최저시급 10,320원', '국민연금 9.5%(사업주 4.75%)', '건강보험 7.19%, 장기요양 건보료의 13.14%', '산재: 시설관리 및 사업지원 서비스업 8‰ + 출퇴근재해 0.6‰', '장애인고용부담금 부담기초액 1,295,000원, 의무고용률 3.1%'],
  },
  2027: {
    label: '2027년',
    minWage: 10700,
    pension: 0.05,
    health: 0.03595,
    ltcRatio: 0.1314,
    injury: 0.0086,
    employment: 0.009,
    employmentStab: 0.0025,
    disabilityBase: 1295000,
    disabilityRate: 0.033,
    pending: ['ltcRatio', 'injury', 'disabilityBase'],
    sources: ['최저시급 10,700원 (2026.7 결정)', '국민연금 10%(사업주 5%)', '건강보험 7.19% 동결 (2026.9.8 의결)', '장기요양·산재요율·부담기초액은 고시 전이라 2026년 값 준용', '장애인 의무고용률 3.3% (시행령 개정 의결)'],
  },
};

export const RATE_FIELD_LABELS = {
  minWage: '법정 최저시급',
  pension: '국민연금 (사업주)',
  health: '건강보험 (사업주)',
  ltcRatio: '장기요양 (건보료 대비)',
  injury: '산재보험',
  employment: '고용보험 실업급여',
  employmentStab: '고용안정·직업능력개발',
  disabilityBase: '장애인고용부담금 기초액',
  disabilityRate: '장애인 의무고용률',
};

/** 견적 기준연도 기본값: 10월 이후 작성하는 견적은 다음 해 계약을 기준으로 잡습니다. */
export function defaultQuoteYear(today = new Date()) {
  const y = today.getFullYear();
  const target = today.getMonth() >= 9 ? y + 1 : y;
  const years = Object.keys(RATE_PRESETS).map(Number);
  return years.includes(target) ? target : Math.max(...years);
}

/** 견적 공통 기준값(연도 프리셋 + 회사 관리비 정책) */
export function makeRates(year, policy = {}) {
  const years = Object.keys(RATE_PRESETS).map(Number);
  const y = Number(year);
  const used = RATE_PRESETS[y] ? y : y < Math.min(...years) ? Math.min(...years) : Math.max(...years); // 없는 연도는 가장 가까운 연도
  const p = RATE_PRESETS[used];
  return {
    presetYear: used,
    minWage: p.minWage,
    pension: p.pension,
    health: p.health,
    ltcRatio: p.ltcRatio,
    injury: policy.injuryOverride ?? p.injury,
    employment: p.employment,
    employmentStab: p.employmentStab,
    disabilityOn: policy.disabilityOn ?? true,
    disabilityBase: p.disabilityBase,
    disabilityRate: p.disabilityRate,
    nightCheckAnnual: policy.nightCheckAnnual ?? 50000, // 야간근로자 특수건강진단비(연, 1인)
    overtimeRate: 1.5,
    nightPremium: 0.5,
    adminRate: policy.adminRate ?? 0.015,   // 일반관리비율
    profitRate: policy.profitRate ?? 0.0143, // 기업이윤율
    subtotalCut: policy.subtotalCut ?? 100000, // 소계 절사 단위
    totalCut: policy.totalCut ?? 1000,         // 총합계 절사 단위
  };
}

/** 근무형태 */
export const SHIFT_TYPES = {
  day5: {
    label: '일근 주5일',
    hint: '월 근로시간 = 1일 실근로 × (5+1)/7 × 365/12 (주휴 포함)',
  },
  shift2: {
    label: '24시간 맞교대',
    hint: '월 근로시간 = (주간 실근로 + 야간 실근로) × 365/12 ÷ 2',
  },
  shift3: {
    label: '3교대 주·당·비',
    hint: '월 근로시간 = (주간 실근로 + 야간 실근로) × 365/12 ÷ 3',
  },
  custom: {
    label: '직접 입력',
    hint: '월 근로시간, 월 야간시간, 연차 산정 1일 시간을 직접 넣습니다.',
  },
};

/** 직군 */
export const GROUPS = {
  facility: { label: '시설관리직', short: '시설', docLabel: '시설\n관리직' },
  security: { label: '보안·주차관리직', short: '보안·주차', docLabel: '보안직\n/\n주차관리' },
  cleaning: { label: '환경미화직', short: '미화', docLabel: '환경\n미화직' },
  etc: { label: '기타 지원직', short: '기타', docLabel: '기타\n지원직' },
};
export const GROUP_ORDER = ['facility', 'security', 'cleaning', 'etc'];

const uid = () => 'r' + Math.random().toString(36).slice(2, 9);

/** 직군별 복리후생 기본값 (기존 견적서 기준) */
const WELFARE = {
  facility: { meal: 100000, giftUnit: 30000, giftTimes: 2, uniformUnit: 90000, uniformTimes: 2, safetyEdu: 5000, opsCost: 20000, liability: 15000 },
  security: { meal: 100000, giftUnit: 30000, giftTimes: 2, uniformUnit: 150000, uniformTimes: 2, safetyEdu: 5000, opsCost: 20000, liability: 15000 },
  cleaning: { meal: 0, giftUnit: 30000, giftTimes: 2, uniformUnit: 90000, uniformTimes: 2, safetyEdu: 5000, opsCost: 20000, liability: 15000 },
  etc: { meal: 100000, giftUnit: 30000, giftTimes: 2, uniformUnit: 90000, uniformTimes: 2, safetyEdu: 5000, opsCost: 20000, liability: 15000 },
};

/** 근무형태별 기본 근무시간 */
export const SHIFT_DEFAULTS = {
  facilityDay: { shift: 'day5', hoursText: '주간 주5일\n08:30~18:00', dayHours: 9.5, dayBreak: 1.5, nightHours: 0, nightBreak: 0, overtimeHours: 11, overtimeNote: '격주 토요일 근무 (0.5h × 22일)' },
  facility3: { shift: 'shift3', hoursText: '3교대 (주·당·비)\n09:00~익일 09:00', dayHours: 25, dayBreak: 3, nightHours: 8, nightBreak: 6, overtimeHours: 0 },
  securityDay: { shift: 'day5', hoursText: '주간 주5일\n08:00~18:00', dayHours: 10, dayBreak: 2, nightHours: 0, nightBreak: 0, overtimeHours: 0 },
  security24: { shift: 'shift2', hoursText: '24시간 맞교대\n07:00~익일 07:00', dayHours: 16, dayBreak: 2, nightHours: 8, nightBreak: 6.885, overtimeHours: 0 },
  cleaningDay: { shift: 'day5', hoursText: '주간 주5일\n06:00~15:00', dayHours: 9, dayBreak: 1, nightHours: 0, nightBreak: 0, overtimeHours: 0 },
  cleaningPm: { shift: 'day5', hoursText: '오후조 주5일\n15:00~22:00', dayHours: 7, dayBreak: 0.5, nightHours: 0, nightBreak: 0, overtimeHours: 0 },
};

/**
 * 직책 라이브러리 — "인력 추가" 메뉴에 나오는 기본 직책.
 * wage: 기존 견적서(2024) 기준 시급. minLinked: 최저시급과 자동 연동.
 */
/** 직책 라이브러리 시급이 맞춰진 연도 (기존 엑셀 견적서 기준) */
export const LIB_WAGE_YEAR = 2024;

export const ROLE_LIBRARY = [
  { key: 'chief', group: 'facility', title: '관리소장', subtitle: '전기직', license: '전기안전관리자 선임', base: 'facilityDay', wage: 15105, allowPosition: 200000, allowLicense: 100000 },
  { key: 'facLead', group: 'facility', title: '시설팀장', subtitle: '기계직', license: '기계설비유지관리자 선임(중급)', base: 'facilityDay', wage: 12885, allowPosition: 100000, allowLicense: 100000 },
  { key: 'facFire1', group: 'facility', title: '시설주임', subtitle: '소방직', license: '(1급)소방안전관리자 선임', base: 'facility3', wage: 10258, allowPosition: 0, allowLicense: 100000, nightCheck: true, laborDay: true },
  { key: 'facFire2', group: 'facility', title: '시설기사', subtitle: '소방직', license: '(보조선임)소방안전관리자', base: 'facility3', wage: 9864, allowPosition: 0, allowLicense: 100000, nightCheck: true, laborDay: true },
  { key: 'facMech', group: 'facility', title: '시설기사', subtitle: '기계직', license: '승강기안전관리자 선임', base: 'facility3', wage: 9864, allowPosition: 0, allowLicense: 0, nightCheck: true, laborDay: true },
  { key: 'facElec', group: 'facility', title: '시설기사', subtitle: '전기직', license: '', base: 'facility3', wage: 9864, allowPosition: 0, allowLicense: 0, nightCheck: true, laborDay: true },
  { key: 'facRepair', group: 'facility', title: '영선기사', subtitle: '', license: '', base: 'facilityDay', wage: 11265, allowPosition: 0, allowLicense: 0, overtimeHours: 0 },
  { key: 'secLead', group: 'security', title: '보안팀장', subtitle: '', license: '', base: 'securityDay', wage: 11265, allowPosition: 50000, allowLicense: 0, nightCheck: true, laborDay: true },
  { key: 'secGuard', group: 'security', title: '보안대원', subtitle: '', license: '', base: 'security24', wage: 9860, minLinked: true, allowPosition: 0, allowLicense: 0, nightCheck: true, laborDay: true },
  { key: 'parking', group: 'security', title: '주차관리', subtitle: '', license: '', base: 'securityDay', wage: 11265, allowPosition: 0, allowLicense: 0, nightCheck: true, laborDay: true },
  { key: 'clnLead', group: 'cleaning', title: '미화감독', subtitle: '', license: '', base: 'cleaningDay', wage: 11265, allowPosition: 50000, allowLicense: 0 },
  { key: 'clnChiefM', group: 'cleaning', title: '미화반장', subtitle: '남', license: '', base: 'cleaningDay', wage: 10550, allowPosition: 0, allowLicense: 0 },
  { key: 'clnStaffF', group: 'cleaning', title: '미화원', subtitle: '여', license: '', base: 'cleaningDay', wage: 9860, minLinked: true, allowPosition: 0, allowLicense: 0 },
  { key: 'clnStaffM', group: 'cleaning', title: '미화원', subtitle: '남', license: '', base: 'cleaningDay', wage: 9860, minLinked: true, allowPosition: 0, allowLicense: 0 },
  { key: 'clnPm', group: 'cleaning', title: '미화원', subtitle: '오후조', license: '', base: 'cleaningPm', wage: 9860, minLinked: true, allowPosition: 0, allowLicense: 0 },
  { key: 'info', group: 'etc', title: '안내데스크', subtitle: '', license: '', base: 'securityDay', wage: 10550, allowPosition: 0, allowLicense: 0 },
  { key: 'office', group: 'etc', title: '관리사무원', subtitle: '경리', license: '', base: 'securityDay', wage: 10550, allowPosition: 0, allowLicense: 0 },
];

/** 라이브러리 항목으로 새 인력 행 만들기 */
export function createRole(libKey, overrides = {}) {
  const lib = ROLE_LIBRARY.find((r) => r.key === libKey) || ROLE_LIBRARY[0];
  const shift = SHIFT_DEFAULTS[lib.base];
  const w = WELFARE[lib.group];
  return {
    id: uid(),
    libKey: lib.key,
    group: lib.group,
    title: lib.title,
    subtitle: lib.subtitle,
    count: 1,
    license: lib.license,
    shift: shift.shift,
    hoursText: shift.hoursText,
    dayHours: shift.dayHours,
    dayBreak: shift.dayBreak,
    nightHours: shift.nightHours,
    nightBreak: shift.nightBreak,
    overtimeHours: lib.overtimeHours ?? shift.overtimeHours,
    overtimeNote: shift.overtimeNote || '',
    customMonthlyHours: 209,
    customNightHours: 0,
    customLeaveHours: 8,
    leaveHoursOverride: null,
    minLinked: !!lib.minLinked,
    hourlyWage: lib.wage,
    allowPosition: lib.allowPosition,
    allowLicense: lib.allowLicense,
    meal: w.meal,
    giftUnit: w.giftUnit,
    giftTimes: w.giftTimes,
    uniformUnit: w.uniformUnit,
    uniformTimes: w.uniformTimes,
    safetyEdu: w.safetyEdu,
    opsCost: w.opsCost,
    liability: w.liability,
    nightCheck: !!lib.nightCheck,
    laborDay: !!lib.laborDay,
    note: '',
    ...overrides,
  };
}

export const DEFAULT_EXTRAS = () => ({
  liabilityNote: '시설소유자·주차장 배상책임 5억 가입',
  maintenance: [
    { id: uid(), name: '소모품자재비', amount: 0, separate: true },
    { id: uid(), name: '외주 유지관리비', amount: 0, separate: true },
    { id: uid(), name: '법정검사비', amount: 0, separate: true },
    { id: uid(), name: '협회비 및 면허세', amount: 0, separate: true },
  ],
  depreciation: [
    { id: uid(), name: '비품, 공기구, 청소장비 감가상각비', amount: 0, separate: true },
  ],
});

export const DEFAULT_NOTES = () => [
  '연간 수선유지관리비는 건물주 지급 조건입니다.',
  '소모품, 승강기, 소방, 소독방역 비용은 건물주 지급 조건입니다.',
  '관리용 비품, 공기구, 청소장비는 건물주 지급 조건입니다.',
];

/** 미화 배치계획 기본 틀 */
export const DEFAULT_CLEANING_PLAN = () => ({
  enabled: false,
  shiftLabels: { dayM: '주간조 남', dayF: '주간조 여', pm: '오후조 여', sat: '토요일 여' },
  shiftTimes: { day: '06:00~15:00', pm: '15:00~22:00', sat: '07:00~12:00' },
  floors: [],
  commonWork: '로비 바닥 흡진, 건물 외곽 및 조경 내 오물 청소, 내부 유리창 청소, 고소작업, 사무실 카펫 흡진, 주차장 바닥 청소, 청소장비 운전 및 관리, 쓰레기 분리수거',
});

/** 템플릿 목록 */
export const TEMPLATES = [
  {
    key: 'office16',
    name: '중대형 오피스 표준 (16명)',
    desc: '시설 5, 보안·주차 4, 미화 7. 기존 16명 오피스 견적 구성을 그대로 옮긴 표준안입니다.',
    roles: () => [
      createRole('chief'),
      createRole('facLead'),
      createRole('facFire1'),
      createRole('facFire2'),
      createRole('facMech'),
      createRole('secLead'),
      createRole('secGuard', { count: 2 }),
      createRole('parking'),
      createRole('clnLead'),
      createRole('clnChiefM'),
      createRole('clnStaffF', { count: 5 }),
    ],
  },
  {
    key: 'small6',
    name: '중소형 건물 (6명)',
    desc: '관리소장 1, 시설기사 1, 보안 2, 미화 2. 연면적 1만㎡ 안팎 건물의 시작점입니다.',
    roles: () => [
      createRole('chief'),
      createRole('facMech', { shift: 'day5', hoursText: '주간 주5일\n08:30~18:00', dayHours: 9.5, dayBreak: 1.5, nightHours: 0, nightBreak: 0, nightCheck: false, laborDay: false }),
      createRole('secGuard', { count: 2 }),
      createRole('clnStaffF', { count: 2 }),
    ],
  },
  {
    key: 'blank',
    name: '빈 견적서',
    desc: '인력 구성을 처음부터 직접 넣습니다.',
    roles: () => [],
  },
];
