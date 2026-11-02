// 사이트 공통 정보 — 회사 정보·메뉴·출시 일정은 여기서만 고칩니다.
export const SITE = {
  name: '에셋온',
  nameEn: 'AssetOn',
  full: '에셋온 AssetOn',
  system: 'Asset Management System ON',
  short: 'AMSO',
  tagline: 'FM · PM · AM 관리회사를 위한 자산관리시스템',
  // 배포 도메인. Cloudflare 빌드 변수 SITE_URL 로 넣거나 여기에 직접 적습니다 (끝에 / 없이).
  url: (process.env.SITE_URL || '').replace(/\/$/, ''),
  updated: '2026-11-02',
};

export const COMPANY = {
  name: '주식회사 지유공간개발',
  nameEn: 'GU gonggan gaebal Co., Ltd.',
  ceo: '최시준',
  bizNo: '757-86-04159',
  corpNo: '130111-0133105',
  address: '경기도 화성시 병점구 경기대로 1014, 6층 603호·605호 (병점동)',
  founded: '2026년 9월',
  mailOrder: '', // 통신판매업 신고번호 — 신고 후 입력
  privacyOfficer: '최시준',
  affiliate: '주식회사 지유코퍼레이션',
};

// 출시 일정 (개발기획서 13장)
export const LAUNCH = {
  statusShort: '파일럿 관리회사 모집 중',
  pilot: '2027년 상반기',
  open: '2027년 하반기',
};

export const NAV = [
  {
    label: '기능', key: 'features', items: [
      { href: '/features/', title: '전체 기능', desc: '여덟 개 모듈과 출시 단계' },
      { href: '/features/fm', title: '시설관리 FM', desc: '점검·작업·법정점검·근무·민원' },
      { href: '/features/pm', title: '자산운영 PM', desc: '임대차·관리비·수납·월간 보고' },
      { href: '/features/am', title: '자산관리 AM', desc: '포트폴리오·NOI·예산·투자자 보고' },
      { href: '/features/sales', title: '영업·견적', desc: 'FM 견적 엔진·제안서·수주 전환' },
      { href: '/features/portals', title: '포털', desc: '건물주·임차사·협력업체 화면' },
    ],
  },
  {
    label: '누가 쓰나요', key: 'solutions', items: [
      { href: '/solutions/fm', title: 'FM 시설관리 회사', desc: '현장 기록과 견적을 한 곳에서' },
      { href: '/solutions/pm', title: 'PM 자산운영 회사', desc: '관리비부터 월간 보고까지' },
      { href: '/solutions/am', title: '자산운용사 · 다건물 건물주', desc: '여러 PM사의 숫자를 같은 양식으로' },
      { href: '/solutions/site', title: '관리소장 · 자가관리 건물', desc: '혼자 관리하는 건물의 법정 기록' },
    ],
  },
  { label: '체험판', key: 'demo', href: '/demo/' },
  { label: '요금', key: 'pricing', href: '/pricing' },
  { label: '보안', key: 'security', href: '/security' },
  { label: '인사이트', key: 'insights', href: '/insights/' },
];

export const FOOT = [
  { title: '제품', links: [['전체 기능', '/features/'], ['시설관리 FM', '/features/fm'], ['자산운영 PM', '/features/pm'], ['자산관리 AM', '/features/am'], ['영업·견적', '/features/sales'], ['포털', '/features/portals']] },
  { title: '대상', links: [['FM 시설관리 회사', '/solutions/fm'], ['PM 자산운영 회사', '/solutions/pm'], ['자산운용사·다건물 건물주', '/solutions/am'], ['관리소장·자가관리', '/solutions/site']] },
  { title: '자료', links: [['체험판', '/demo/'], ['인사이트', '/insights/'], ['도움말', '/help/'], ['자주 묻는 질문', '/faq'], ['엑셀 이관 템플릿', '/help/#templates']] },
  { title: '회사', links: [['요금', '/pricing'], ['보안·데이터', '/security'], ['출시 일정', '/roadmap'], ['파트너', '/partners'], ['회사 소개', '/about'], ['사전 신청', '/signup']] },
];
