# 에셋온 AssetOn 홈페이지

FM·PM·AM 관리회사를 위한 자산관리시스템 **에셋온(AssetOn, Asset Management System ON, 약칭 AMSO)** 의 공개 홈페이지입니다.
GitHub 저장소를 Cloudflare Workers에 연결하면, 저장소에 변경을 올릴 때마다 자동으로 다시 배포됩니다.

- 페이지 33개: 홈, 기능 6, 대상별 4, 요금, 체험판 5, 보안, 출시 일정, 사전 신청, 회사 소개, 파트너, 자주 묻는 질문, 도움말, 인사이트 6, 약관·방침 3, 404
- 체험판 3종(법정점검 계산기, 관리비 배분과 고지서, FM 견적 계산)은 브라우저 안에서만 계산하며 서버로 아무것도 보내지 않습니다
- 사전 신청 양식은 `/api/inquiry` 로 들어와 담당자 이메일로 전달됩니다 (Resend 사용)
- 외부 라이브러리 없이 동작합니다. 빌드에 필요한 것은 Node.js 하나입니다

---

## 1. 처음 배포하기 (한 번만)

### ① GitHub 저장소
이 저장소([naadaa87/asseton](https://github.com/naadaa87/asseton))가 홈페이지 원본입니다. 파일을 고칠 때는 GitHub 웹에서 파일을 열고 연필 아이콘으로 수정한 뒤 **Commit changes** 를 누르면, Cloudflare 연결 후에는 자동으로 다시 배포됩니다.

> 이 저장소는 공개(Public) 상태입니다. API 키 같은 비밀값은 저장소에 적지 말고 Cloudflare 대시보드의 '비밀'로만 넣으세요. 공개 전 요금 금액도 `site-config.js` 에 미리 적지 않습니다.

### ② Cloudflare에 연결하기
1. Cloudflare 대시보드 → **Workers & Pages** → **만들기(Create)** → **Git 리포지토리 가져오기(Import a repository)**
2. GitHub 계정을 연결하고 `asseton` 저장소를 고릅니다
3. 설정값
   | 항목 | 값 |
   |---|---|
   | 프로젝트 이름 | `asseton` (wrangler.jsonc 의 name 과 같아야 합니다) |
   | 빌드 명령 | `npm run build` |
   | 배포 명령 | `npx wrangler deploy` |
   | 루트 디렉터리 | `/` |
4. **저장 및 배포(Save and Deploy)** → 1~2분 뒤 `asseton.<계정>.workers.dev` 주소로 열립니다

### ③ 도메인 연결
1. 도메인을 Cloudflare에 등록(네임서버 변경)합니다
2. Workers & Pages → `asseton` → **설정 → 도메인 및 경로 → 추가 → 사용자 지정 도메인** 에 `asseton.co.kr`(예시)와 `www.asseton.co.kr` 입력
3. **설정 → 빌드 → 빌드 변수 및 비밀(Build variables and secrets)** 에 `SITE_URL` = `https://asseton.co.kr` 추가 후 다시 배포 (런타임 변수가 아니라 빌드 변수입니다)
   - 이 값이 있어야 검색엔진용 `sitemap.xml` 과 대표 주소(canonical)가 만들어집니다

### ④ 사전 신청을 이메일로 받기
1. [resend.com](https://resend.com) 가입 → **Domains** 에서 도메인 인증(DNS 레코드 몇 개를 Cloudflare DNS에 추가)
2. **API Keys** 에서 키 발급
3. Workers & Pages → `asseton` → **설정 → 변수 및 비밀** 에 추가
   | 이름 | 종류 | 예 |
   |---|---|---|
   | `RESEND_API_KEY` | 비밀(Secret) | `re_...` |
   | `INQUIRY_TO` | 텍스트 | `sales@asseton.co.kr` (쉼표로 여러 명) |
   | `INQUIRY_FROM` | 텍스트 | `에셋온 <hello@asseton.co.kr>` (인증한 도메인 주소) |
4. 홈페이지 `/signup` 에서 시험 신청을 보내 메일이 오는지 확인합니다
5. 설정이 되었는지는 `https://도메인/api/health` 에서 볼 수 있습니다 (`"email": true`)

> 설정 전에는 신청 버튼을 눌러도 "신청을 보내지 못했습니다"가 나옵니다. 연락처(아래 ⑤)를 넣어 두면 그 자리에 이메일·전화 안내가 대신 나옵니다.

#### 선택: 신청 내용 보관(KV)
이메일과 별도로 신청 내용을 1년간 Cloudflare에 보관하려면
1. **Workers & Pages → KV → 네임스페이스 만들기** (이름 `asseton-inquiries`) → ID 복사
2. `wrangler.jsonc` 맨 아래 주석 `// ,"kv_namespaces": ...` 의 `//` 를 지우고 ID를 넣어 저장

#### 선택: 자동 입력 방지(Turnstile)
1. Cloudflare 대시보드 → **Turnstile → 사이트 추가** → 사이트 키·비밀 키 발급
2. `public/assets/js/site-config.js` 의 `turnstileSiteKey` 에 사이트 키 입력
3. 변수 및 비밀에 `TURNSTILE_SECRET` (비밀) 추가

### ⑤ 연락처 넣기
`public/assets/js/site-config.js` 를 GitHub 웹에서 열어 연필 아이콘으로 고칩니다.
```js
contact: { email: 'hello@asseton.co.kr', phone: '031-000-0000', kakao: '' },
```
비워 두면 연락처가 화면에 나오지 않습니다. 저장(Commit)하면 자동으로 다시 배포됩니다.

---

## 2. 자주 고치는 곳

| 고칠 것 | 파일 |
|---|---|
| 회사 정보(상호·대표·주소·사업자번호·통신판매업 신고번호) | `src/site.mjs` 의 `COMPANY` |
| 출시 일정 문구(파일럿·공개 시기) | `src/site.mjs` 의 `LAUNCH` |
| 메뉴와 푸터 링크 | `src/site.mjs` 의 `NAV`, `FOOT` |
| 연락처, Turnstile 키 | `public/assets/js/site-config.js` |
| **요금 공개** | `public/assets/js/site-config.js` 의 `pricing.published` 를 `true` 로, 플랜 금액 확인 |
| 홈 화면 문구 | `src/pages/home.mjs` |
| 기능 목록(기능 페이지·출시 일정 페이지 공통) | `src/content/features-data.mjs` |
| 인사이트 글 추가 | `src/pages/insights.mjs` 의 `ARTICLES` 맨 위에 하나 추가 |
| 개인정보처리방침·약관·서비스 수준 | `src/pages/misc.mjs` 의 `privacy`, `terms`, `sla` |
| 디자인(색, 글자 크기, 간격) | `public/assets/css/site.css` 맨 위 `:root` |
| 엑셀 이관 템플릿 | `public/assets/files/asseton-migration-template.xlsx` |

`src/` 의 파일을 고치면 배포할 때 `public/` 의 HTML이 새로 만들어집니다. `public/*.html` 을 직접 고치면 다음 배포 때 덮어써지니 `src/` 쪽을 고치세요.

---

## 3. 폴더 구조

```
asseton/
├─ src/                    페이지 원본 (Node.js로 HTML 생성)
│  ├─ build.mjs            node src/build.mjs → public/ 에 HTML, sitemap.xml, robots.txt
│  ├─ site.mjs             회사 정보, 메뉴, 출시 일정
│  ├─ lib/html.mjs         공통 머리말·꼬리말·부품
│  ├─ lib/mocks.mjs        예시 화면(목업)
│  ├─ content/             기능 목록 데이터
│  └─ pages/               페이지별 내용
├─ public/                 실제로 배포되는 파일
│  ├─ assets/css/site.css
│  ├─ assets/js/           site.js, 체험판(demo-*.js), 견적 엔진(quote/), 신청 양식(signup.js)
│  ├─ assets/fonts/        AssetOn Sans KR (IBM Plex Sans KR 부분 글꼴, OFL)
│  ├─ assets/img/          og.png(공유 미리보기), apple-touch-icon.png
│  ├─ assets/files/        엑셀 이관 템플릿
│  └─ _headers             보안 헤더와 캐시 설정
├─ docs/                   개발기획서·기능명세서·제작지시서, 엑셀 이관 템플릿 (배포 안 됨)
├─ worker/index.js         /api/inquiry, /api/health
├─ wrangler.jsonc          Cloudflare Workers 설정
└─ package.json
```

## 4. 기획 자료

`docs/` 폴더에 개발기획서, 기능명세서, 제작지시서(Word·PDF)와 엑셀 이관 템플릿이 있습니다. 목록은 [docs/README.md](docs/README.md) 에 있습니다. 이 폴더는 홈페이지로 배포되지 않습니다.

## 5. 내 컴퓨터에서 미리 보기 (개발자용)

```bash
npm install
npm run build        # public/ 에 HTML 생성
npx wrangler dev     # http://localhost:8787
npm run check        # 배포 전 점검 (실제로 올리지는 않음)
```
신청 양식을 로컬에서 시험하려면 `.dev.vars` 파일에 `INQUIRY_TO=...`, `RESEND_API_KEY=...` 를 적습니다 (저장소에는 올리지 않습니다).

---

## 6. 공개 전 확인할 것

- [ ] 통신판매업 신고 후 `src/site.mjs` 의 `COMPANY.mailOrder` 입력 (유료 판매 시작 전)
- [ ] `site-config.js` 에 대표 이메일·전화 입력 (개인정보 보호책임자 연락처로도 쓰입니다)
- [ ] 도메인 연결과 `SITE_URL` 빌드 변수
- [ ] Resend 도메인 인증, 시험 신청 메일 수신 확인
- [ ] 상표 출원 상태 확인 후 'AssetOn' 표기 유지 여부 결정
- [ ] 요금 공개 시점에 `pricing.published` 와 플랜 금액 확인
- [ ] 개인정보처리방침의 위탁 업체(Cloudflare, Resend)가 실제 사용과 같은지 확인

© 2026 주식회사 지유공간개발
