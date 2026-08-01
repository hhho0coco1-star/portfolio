# 면접용 요약 슬라이드 덱 설계

## 배경
기술면접 시 라이브 사이트를 화면공유로 스크롤하며 보여주는 대신, 발표 흐름을 통제할 수 있는
슬라이드 덱이 필요하다는 요청. 기존 상세페이지(SafeAlert·LocalQuest·HashTrip)에 이미
개요·아키텍처·트러블슈팅(문제→원인→해결→결과)·회고가 구조화돼 있어, 새로 쓰기보다 재배치·압축이
핵심이다.

## 범위
- 통합 1개 덱(`slides.html`)으로 3개 프로젝트를 순서대로 훑는 면접용 요약본.
- 프로젝트별 상세페이지를 대체하지 않는다 — 상세페이지는 그대로 유지, 덱은 면접 발표 전용 요약.
- `summary.pdf`/`summary.html`(이력서) 파일은 삭제하지 않는다. 히어로의 링크만 교체한다.

## 슬라이드 구성 (총 8장)

| # | 슬라이드 | 내용 출처 |
|---|---------|----------|
| 1 | 표지 — 안세웅 · Backend Engineer · 핵심 한 줄 | index.html 히어로 카피 축약 |
| 2 | 핵심역량 — p95 30%↓ · MSA 5 · replica 3 | index.html `.bigstats` 재사용 |
| 3 | SafeAlert 개요 + 간소화 아키텍처 플로우 | safealert.html `#overview`, `#domain` |
| 4 | SafeAlert 트러블슈팅 — k6 97%→0%, p95 2.66→1.86s (HikariCP 튜닝) | safealert.html `#trouble` t4 |
| 5 | LocalQuest 개요 + 담당역할(QR·비즈니스·관리자 풀스택) | localquest.html `#overview`, `#role` |
| 6 | LocalQuest 트러블슈팅 — 인터셉터 범위 밖 인증 공백 → 다층 방어 | localquest.html `#trouble` t2 |
| 7 | HashTrip 개요 + 트러블슈팅 — 가중치 합산 로직 수정 (오류 0건) | hashtrip.html `#overview`, `#trouble` |
| 8 | 마무리 — 연락처·GitHub·블로그 | index.html 링크 재사용 |

각 프로젝트당 트러블슈팅은 대표 1건만(상세페이지에 2건 있는 SafeAlert·LocalQuest는 백엔드 면접
관련성·기존 헤드라인 수치와의 일관성 기준으로 선별). 아키텍처는 상세페이지의 탭 전환형
arch-stepper 대신, 손으로 짚어가며 설명하기 쉬운 가로형 플로우 다이어그램(박스+화살표 3~5개)으로
간소화한다.

## 기술 구현

**신규 파일**
- `slides.html` — `<html class="slide-deck">`, `index.html`과 동일한 `.slide`/`.slide-wrap`/`.cue`
  구조. `script.js`를 그대로 include (수정 없이 스크롤스냅 + cue 버튼 네비게이션 동작). 프로젝트를
  넘나드는 nav바는 넣지 않고, index.html에 있는 `.snum`("03/08") 슬라이드 카운터만 사용한다
  (8장짜리 선형 덱에 nav는 과함).

**style-v2.css 추가분 (최소)**
- 트러블 전/후 지표는 상세페이지의 `.trouble-metric`/`.tm-before`/`.tm-arrow`/`.tm-after`를 그대로
  재사용 (신규 CSS 없음).
- 아키텍처 플로우용 `.flow-diagram`/`.flow-node`/`.flow-arrow` 신규 (가로 박스+화살표, ~20줄).
- `@media print` 블록 신규 — 슬라이드 1장 = 인쇄 1페이지, "포트폴리오 출력하기" 버튼 라벨과 대응.

**index.html 변경**
- 히어로 링크 배지 중 `이력서 PDF ↓`(→`summary.pdf`)를 `포트폴리오 출력하기`(→`slides.html`)로
  교체.

## 데이터 흐름 / 에러 처리
정적 HTML/CSS 페이지라 별도 데이터 흐름·에러 처리 로직 없음. `script.js`의 슬라이드덱 로직은
`document.documentElement.classList.contains('slide-deck')` 가드로 이미 index.html/slides.html
양쪽에서 안전하게 동작하도록 설계돼 있음 (신규 코드 불필요).

## 검증 방법
자동 테스트 프레임워크가 없는 정적 사이트이므로, 이번 점검에서 썼던 방식과 동일하게 헤드리스
크롬으로 슬라이드별 스크린샷을 찍어 레이아웃을 확인하고, `@media print` 결과를 인쇄 미리보기로
확인한다. 추가로 `slides.html`을 390px 모바일 폭에서도 한 번 확인해, 이번 점검에서 발견한 히어로
텍스트 잘림과 같은 문제가 재발하지 않는지 본다.

## 하지 않는 것 (Non-goals)
- 상세페이지(safealert.html 등) 콘텐츠 수정 — 슬라이드는 요약본일 뿐, 원본은 그대로 둠
- `summary.pdf`/`summary.html` 삭제
- reveal.js 등 신규 JS 라이브러리 도입 — 기존 슬라이드덱 패턴 재사용으로 충분
- 프로젝트별 개별 슬라이드 덱 — 이번 사이클은 통합 1개 덱만
