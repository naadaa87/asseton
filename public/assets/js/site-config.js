/*
 * 에셋온 홈페이지 설정 — 이 파일만 고치면 연락처·요금·보안 위젯이 바뀝니다.
 * GitHub 웹에서 이 파일을 열고 연필(Edit) 버튼으로 수정한 뒤 저장(Commit)하면 Cloudflare가 자동으로 다시 배포합니다.
 */
window.ASSETON_CONFIG = {
  // 연락처 — 비워 두면 화면에 표시하지 않습니다.
  contact: {
    email: '',        // 예: 'hello@asseton.kr'
    phone: '',        // 예: '02-000-0000'
    kakao: '',        // 카카오톡 채널 주소 예: 'https://pf.kakao.com/_xxxx'
  },

  // Cloudflare Turnstile 사이트 키 (봇 차단). 비워 두면 위젯 없이 동작합니다.
  turnstileSiteKey: '',

  // 요금 — 금액을 정하면 아래 숫자를 채우고 published 를 true 로 바꿉니다.
  // 그 전까지는 숫자를 비워 두세요. 이 파일은 누구나 볼 수 있으므로, 공개 전 금액을 적어 두면 미리 알려집니다.
  // (원, 월, 부가세 별도)
  pricing: {
    published: false,
    yearlyDiscount: null,  // 연 결제 할인율. 예: 0.15
    plans: {
      starter:  { base: null, includedBuildings: null, extraBuilding: null, includedUnits: null },
      standard: { base: null, includedBuildings: null, extraBuilding: null, includedUnits: null },
      pro:      { base: null, includedBuildings: null, extraBuilding: null, includedUnits: null },
    },
    addons: {
      alimtalk: null,        // 알림톡 1건 (원)
      taxInvoice: null,      // 전자세금계산서 1건 (원)
      virtualAccount: null,  // 가상계좌 수납 1건 (원)
    },
  },
};
