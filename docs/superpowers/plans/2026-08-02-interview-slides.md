# 면접용 요약 슬라이드 덱 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 면접 발표용 8슬라이드 HTML 덱(`portfolio/slides.html`)을 만들고, index.html 히어로의 "이력서 PDF" 버튼을 이 덱으로 연결되는 "포트폴리오 출력하기" 버튼으로 교체한다.

**Architecture:** 새 페이지는 index.html이 이미 쓰고 있는 `.slide-deck` 스크롤스냅 패턴(`style-v2.css`의 `.slide`/`.slide-wrap`/`.cue`)과 `script.js`를 그대로 재사용한다. 신규 JS는 없음. CSS는 아키텍처 플로우 다이어그램용 `.flow-diagram` 컴포넌트와 슬라이드를 종이 한 장씩 인쇄하기 위한 `@media print` 블록만 추가한다. 트러블슈팅 슬라이드는 상세페이지(safealert.html 등)에 이미 있는 `.trouble-metric`/`.trouble-step`/`.tstep` 계열 클래스를 그대로 재사용한다(신규 CSS 없음).

**Tech Stack:** 순수 HTML/CSS, 기존 `script.js`(수정 없음). 테스트 프레임워크가 없는 정적 사이트이므로, 검증은 헤드리스 크롬 `--print-to-pdf`로 전체 덱을 PDF로 렌더링한 뒤 Read 도구로 페이지별로 시각 확인하는 방식을 쓴다(§검증 방법 참고).

## Global Constraints

- 신규 JS 파일/라이브러리 추가 금지 — `script.js`를 그대로 include.
- `summary.pdf`/`summary.html` 파일은 삭제하지 않는다.
- 프로젝트 상세페이지(safealert.html/localquest.html/hashtrip.html) 내용은 수정하지 않는다 — 인용만 한다.
- 다크·골드 테마(`style-v2.css`의 기존 CSS 변수 `--bg`/`--gold`/`--ink` 등)를 그대로 따른다. 새 색상 하드코딩 금지.
- 트러블슈팅은 프로젝트당 대표 1건만: SafeAlert=k6/HikariCP, LocalQuest=인터셉터 인증 공백, HashTrip=가중치 합산(유일 사례).

## 검증 방법 (모든 Task 공통)

정적 사이트라 pytest 같은 테스트 러너가 없다. 대신 아래 명령으로 전체 덱을 PDF로 렌더링해 Read 도구로 페이지를 눈으로 확인한다 (Task 1의 `@media print` 블록이 먼저 들어가야 페이지가 슬라이드 1장=PDF 1페이지로 쪼개진다):

```bash
mkdir -p /tmp/portshots
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --print-to-pdf=/tmp/portshots/slides.pdf "file:///D:/projects/portfolio/slides.html"
```

그 다음 `Read`로 `C:\Users\User\AppData\Local\Temp\portshots\slides.pdf`를 열어(pages 파라미터로 확인할 슬라이드 번호 지정) 레이아웃이 깨지지 않았는지, 텍스트가 잘리지 않았는지 확인한다.

---

### Task 1: slides.html 뼈대 + 표지·핵심역량 슬라이드 + 인쇄용 CSS

**Files:**
- Create: `portfolio/slides.html`
- Modify: `portfolio/style-v2.css` (파일 끝에 추가)

- [ ] **Step 1: `portfolio/slides.html` 작성**

```html
<!DOCTYPE html>
<html lang="ko" class="slide-deck">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>면접용 요약 | 안세웅 포트폴리오</title>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Gowun+Batang:wght@400;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css" />

  <link rel="stylesheet" href="style-v2.css?v=9" />
</head>
<body>

  <nav id="navbar">
    <div class="nav-inner">
      <div class="nav-left">
        <a href="index.html" class="nav-logo">Portfolio</a>
      </div>
    </div>
  </nav>

  <main>

    <!-- SLIDE 1: 표지 -->
    <section id="s1" class="slide">
      <span class="snum">01 / 08</span>
      <div class="slide-wrap">
        <p class="s-eyebrow">면접용 요약</p>
        <h1 class="s-name">안세웅</h1>
        <p class="s-role">분산 환경의 <b>데이터 정합성과 장애 격리</b>를 고민하는 백엔드 개발자</p>
      </div>
      <button type="button" class="cue" aria-label="다음 슬라이드로 이동"><span class="a">↓</span> SCROLL</button>
    </section>

    <!-- SLIDE 2: 핵심역량 -->
    <section id="s2" class="slide left">
      <span class="snum">02 / 08</span>
      <div class="slide-wrap">
        <p class="kicker">CORE COMPETENCIES</p>
        <h2 class="s-title">핵심역량</h2>
        <p class="intro-tagline">백엔드를 중심으로 설계하고, 필요하면 화면까지 직접 붙입니다. 재난·기상 실시간 알림 서비스(SafeAlert)를 기획부터 배포까지 단독 수행하며 5개 마이크로서비스와 API Gateway를 설계했고, O2O 플랫폼(LocalQuest)에서는 팀 리더로 Spring·React 풀스택을 담당했습니다.</p>
        <div class="bigstats">
          <div class="bs"><b>p95 30%↓</b><span>부하 테스트 기반 성능 개선</span></div>
          <div class="bs"><b>MSA 5</b><span>마이크로서비스 단독 설계</span></div>
          <div class="bs"><b>replica 3</b><span>WebSocket 무손실 (Redis Pub/Sub)</span></div>
        </div>
      </div>
      <button type="button" class="cue" aria-label="다음 슬라이드로 이동"><span class="a">↓</span> SCROLL</button>
    </section>

  </main>

  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: `portfolio/style-v2.css` 끝에 인쇄용 CSS 추가**

파일 맨 끝(809번째 줄 이후)에 추가:

```css

/* ============================================================
   면접용 슬라이드 덱 인쇄 (slides.html 전용, .slide-deck 스코프)
   ============================================================ */
@media print{
  html.slide-deck{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  .slide-deck #navbar,.slide-deck .cue,.slide-deck .snum{display:none;}
  .slide-deck .slide{
    height:auto;min-height:0;overflow:visible;
    page-break-after:always;break-after:page;
    padding:20px 26px;
  }
  .slide-deck .slide:last-child{page-break-after:auto;break-after:auto;}
}
```

- [ ] **Step 3: 검증 — PDF 렌더링 후 1~2페이지 확인**

```bash
mkdir -p /tmp/portshots
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --print-to-pdf=/tmp/portshots/slides.pdf "file:///D:/projects/portfolio/slides.html"
```

Read 도구로 `C:\Users\User\AppData\Local\Temp\portshots\slides.pdf`를 `pages: "1-2"`로 열어 확인.
Expected: PDF가 정확히 2페이지, 1페이지는 "안세웅" 표지, 2페이지는 "핵심역량" + 3개 스탯 카드가 잘림 없이 보임.

- [ ] **Step 4: 커밋**

```bash
git add portfolio/slides.html portfolio/style-v2.css
git commit -m "feat: 면접용 슬라이드 덱 뼈대 — 표지·핵심역량 슬라이드 + 인쇄 CSS"
```

---

### Task 2: SafeAlert 슬라이드 2장 + 플로우 다이어그램 CSS

**Files:**
- Modify: `portfolio/slides.html`
- Modify: `portfolio/style-v2.css`

**Interfaces:**
- Consumes: Task 1의 `</main>` 앵커, `.slide`/`.slide-wrap`/`.kicker`/`.flag`/`.fpitch`/`.chips`/`.chip` 클래스(기존 index.html에서 이미 정의됨), `.trouble-metrics`/`.trouble-metric`/`.tm-label`/`.tm-before`/`.tm-arrow`/`.tm-after`/`.tm-delta`/`.trouble-steps`/`.tstep`/`.trail`/`.tnode`/`.tnode-problem`/`.tnode-cause`/`.tnode-solve`/`.tnode-result`/`.trouble-step`/`.step-problem`/`.step-cause`/`.step-solve`/`.step-result`/`.step-label` 클래스(safealert.html 등에서 이미 정의됨, `style-v2.css` 454~485줄).
- Produces: `.flow-diagram`/`.flow-node`/`.flow-arrow` 클래스 — Task 3·4에서는 쓰지 않지만(스펙상 SafeAlert 전용), 향후 다른 프로젝트 슬라이드에 아키텍처 플로우를 추가하고 싶을 때 재사용 가능.

- [ ] **Step 1: `portfolio/style-v2.css`에 `.flow-diagram` 컴포넌트 추가**

Task 1에서 추가한 `@media print` 블록 앞에 삽입:

```css

/* 슬라이드용 간소화 아키텍처 플로우 다이어그램 */
.flow-diagram{display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin:20px 0 26px;}
.flow-node{flex:1;min-width:130px;border:1px solid var(--line2);border-radius:10px;background:var(--panel);padding:14px 18px;font-size:.88rem;color:var(--ink);text-align:center;}
.flow-node b{display:block;color:var(--gold);font-family:var(--serif);font-size:.98rem;margin-bottom:4px;}
.flow-arrow{flex:none;color:var(--gold);font-size:1.3rem;}
@media(max-width:760px){.flow-diagram{flex-direction:column;}.flow-arrow{transform:rotate(90deg);}}
```

- [ ] **Step 2: `portfolio/slides.html`의 `  </main>` 앞에 슬라이드 3·4 삽입**

`  </main>`을 찾아 그 앞에 아래 두 `<section>`을 넣는다 (old_string은 `  </main>`, new_string은 아래 블록 + `  </main>`):

```html
    <!-- SLIDE 3: SafeAlert 개요 + 플로우 -->
    <section id="s3" class="slide alt">
      <span class="snum">03 / 08</span>
      <div class="slide-wrap">
        <p class="kicker">PROJECT 01</p>
        <h2 class="flag">SafeAlert</h2>
        <p class="fpitch">재난·기상·미세먼지 공공 API를 구독하고 <b>WebSocket으로 실시간 알림</b>을 받는 MSA 기반 구독 서비스. 5개 마이크로서비스 + API Gateway를 <b>단독 설계·구현·배포</b>.</p>
        <div class="flow-diagram">
          <div class="flow-node"><b>공공 API</b>재난·기상·미세먼지</div>
          <span class="flow-arrow">→</span>
          <div class="flow-node"><b>Kafka</b>수집·처리 속도 분리</div>
          <span class="flow-arrow">→</span>
          <div class="flow-node"><b>Notification</b>Redis Pub/Sub</div>
          <span class="flow-arrow">→</span>
          <div class="flow-node"><b>WebSocket</b>React 클라이언트</div>
        </div>
        <div class="chips">
          <span class="chip">Spring Boot</span>
          <span class="chip">Apache Kafka</span>
          <span class="chip">Kubernetes</span>
          <span class="chip">Redis</span>
          <span class="chip">WebSocket (STOMP)</span>
        </div>
      </div>
      <button type="button" class="cue" aria-label="다음 슬라이드로 이동"><span class="a">↓</span> SCROLL</button>
    </section>

    <!-- SLIDE 4: SafeAlert 트러블슈팅 -->
    <section id="s4" class="slide">
      <span class="snum">04 / 08</span>
      <div class="slide-wrap">
        <p class="kicker">SAFEALERT · TROUBLESHOOTING</p>
        <h2 class="s-title">k6 부하 테스트 오류율 97.85% → 0%</h2>
        <div class="trouble-metrics">
          <div class="trouble-metric">
            <span class="tm-label">오류율</span>
            <span class="tm-before">97.85%</span>
            <span class="tm-arrow">→</span>
            <span class="tm-after">0%</span>
          </div>
          <div class="trouble-metric">
            <span class="tm-label">p95 응답</span>
            <span class="tm-before">2.66s</span>
            <span class="tm-arrow">→</span>
            <span class="tm-after">1.86s</span>
            <span class="tm-delta">-30%</span>
          </div>
        </div>
        <div class="trouble-steps">
          <div class="tstep">
            <div class="trail"><div class="tnode tnode-problem">⚠️</div></div>
            <div class="trouble-step step-problem">
              <span class="step-label">문제 상황</span>
              <p>k6 로그인 부하 테스트(100 VU, 3분) 오류율 97.85%. p95 2.66s로 목표(2s) 초과.</p>
            </div>
          </div>
          <div class="tstep">
            <div class="trail"><div class="tnode tnode-cause">🔍</div></div>
            <div class="trouble-step step-cause">
              <span class="step-label">원인 분석</span>
              <p>HikariCP 기본 maximum-pool-size 10. 100명 동시 로그인 시 90명이 커넥션을 기다리다 타임아웃. Rate Limiting도 동일 IP 100개 요청을 차단하고 있었음.</p>
            </div>
          </div>
          <div class="tstep">
            <div class="trail"><div class="tnode tnode-solve">🛠️</div></div>
            <div class="trouble-step step-solve">
              <span class="step-label">해결 과정</span>
              <p>Rate Limiting 로컬호스트 화이트리스트 추가, HikariCP <code>maximum-pool-size</code> 10 → 30으로 조정 후 재테스트.</p>
            </div>
          </div>
          <div class="tstep">
            <div class="trail"><div class="tnode tnode-result">✅</div></div>
            <div class="trouble-step step-result">
              <span class="step-label">결과</span>
              <p>목표 2s 이하 달성. <strong>배운 점:</strong> DB 커넥션 풀은 동시 요청 수를 고려해 설정해야 하며, 기본값이 실무와 다를 수 있다.</p>
            </div>
          </div>
        </div>
      </div>
      <button type="button" class="cue" aria-label="다음 슬라이드로 이동"><span class="a">↓</span> SCROLL</button>
    </section>

```

- [ ] **Step 3: 검증 — PDF 재렌더링 후 3~4페이지 확인**

Task 1의 print-to-pdf 명령을 다시 실행하고, Read로 `pages: "3-4"` 확인.
Expected: 3페이지는 SafeAlert 개요 + 화살표 4단계 플로우 다이어그램이 한 줄에 정렬됨. 4페이지는 오류율/p95 지표 카드 2개 + 문제/원인/해결/결과 4단계가 잘림 없이 보임.

- [ ] **Step 4: 커밋**

```bash
git add portfolio/slides.html portfolio/style-v2.css
git commit -m "feat: 면접용 슬라이드에 SafeAlert 개요·트러블슈팅 추가"
```

---

### Task 3: LocalQuest 슬라이드 2장

**Files:**
- Modify: `portfolio/slides.html`

**Interfaces:**
- Consumes: Task 1의 `.role-stats`/`.role-stat-card`/`.role-stat-num`/`.role-stat-label` 클래스(localquest.html에서 이미 정의됨, `style-v2.css` 340~343줄), Task 2와 동일한 `.trouble-*` 클래스.

- [ ] **Step 1: `portfolio/slides.html`의 `  </main>` 앞에 슬라이드 5·6 삽입**

```html
    <!-- SLIDE 5: LocalQuest 개요 + 역할 -->
    <section id="s5" class="slide left">
      <span class="snum">05 / 08</span>
      <div class="slide-wrap">
        <p class="kicker">PROJECT 02</p>
        <h2 class="flag">LocalQuest</h2>
        <p class="fpitch">지역을 게임처럼 탐험하는 미션 기반 O2O 로컬 발견 플랫폼. 팀 5명 중 <b>팀 리더</b>로 QR 현장 인증 시스템을 설계·구현하고, 비즈니스 React SPA와 관리자 8개 페이지를 풀스택으로 담당.</p>
        <div class="role-stats">
          <div class="role-stat-card"><span class="role-stat-num">8개</span><span class="role-stat-label">관리자 페이지 풀스택 구현</span></div>
          <div class="role-stat-card"><span class="role-stat-num">3개 영역</span><span class="role-stat-label">비즈니스·관리자·QR 풀스택 담당</span></div>
          <div class="role-stat-card"><span class="role-stat-num">JWT·세션</span><span class="role-stat-label">이원화 인증 구조 설계</span></div>
        </div>
        <div class="chips">
          <span class="chip">Spring</span>
          <span class="chip">React</span>
          <span class="chip">MyBatis</span>
          <span class="chip">Oracle</span>
        </div>
      </div>
      <button type="button" class="cue" aria-label="다음 슬라이드로 이동"><span class="a">↓</span> SCROLL</button>
    </section>

    <!-- SLIDE 6: LocalQuest 트러블슈팅 -->
    <section id="s6" class="slide">
      <span class="snum">06 / 08</span>
      <div class="slide-wrap">
        <p class="kicker">LOCALQUEST · TROUBLESHOOTING</p>
        <h2 class="s-title">관리자 인증 공백 → 전 경로 검증 + 이중화</h2>
        <div class="trouble-metrics">
          <div class="trouble-metric">
            <span class="tm-label">관리자 경로 인증</span>
            <span class="tm-before">일부 경로 검증 공백</span>
            <span class="tm-arrow">→</span>
            <span class="tm-after">전 경로 검증 + 이중화 ✅</span>
          </div>
        </div>
        <div class="trouble-steps">
          <div class="tstep">
            <div class="trail"><div class="tnode tnode-problem">⚠️</div></div>
            <div class="trouble-step step-problem">
              <span class="step-label">문제 상황</span>
              <p>RoleBasedPageInterceptor로 세션·ADMIN 역할을 검증하는데, 점검 중 인터셉터 적용 경로에 포함되지 않은 일부 관리자 기능 URL이 검증 없이 접근 가능한 것을 발견.</p>
            </div>
          </div>
          <div class="tstep">
            <div class="trail"><div class="tnode tnode-cause">🔍</div></div>
            <div class="trouble-step step-cause">
              <span class="step-label">원인 분석</span>
              <p><code>addPathPatterns</code>가 특정 prefix 중심으로만 등록돼, 이후 추가된 관리자 경로 일부가 패턴에서 빠짐. 인증을 인터셉터 한 곳에만 의존한 게 원인.</p>
            </div>
          </div>
          <div class="tstep">
            <div class="trail"><div class="tnode tnode-solve">🛠️</div></div>
            <div class="trouble-step step-solve">
              <span class="step-label">해결 과정</span>
              <p>관리자 전체 경로를 재점검해 인터셉터 적용 범위를 재정의하고, 마스터 계정(userId=1) 보호 등 핵심 분기는 컨트롤러 레벨에서 한 번 더 검증하도록 이중화.</p>
            </div>
          </div>
          <div class="tstep">
            <div class="trail"><div class="tnode tnode-result">✅</div></div>
            <div class="trouble-step step-result">
              <span class="step-label">결과</span>
              <p>모든 관리자 경로가 인증·역할 검증을 거치도록 정비. <strong>배운 점:</strong> 인증을 한 지점에만 의존하면 누락 경로가 곧 취약점이 된다.</p>
            </div>
          </div>
        </div>
      </div>
      <button type="button" class="cue" aria-label="다음 슬라이드로 이동"><span class="a">↓</span> SCROLL</button>
    </section>

```

- [ ] **Step 2: 검증 — PDF 재렌더링 후 5~6페이지 확인**

Task 1의 print-to-pdf 명령을 다시 실행하고, Read로 `pages: "5-6"` 확인.
Expected: 5페이지는 LocalQuest 개요 + 스탯 카드 3개가 한 행에 정렬됨. 6페이지는 트러블슈팅 4단계가 잘림 없이 보임.

- [ ] **Step 3: 커밋**

```bash
git add portfolio/slides.html
git commit -m "feat: 면접용 슬라이드에 LocalQuest 개요·트러블슈팅 추가"
```

---

### Task 4: HashTrip 슬라이드 + 마무리 슬라이드

**Files:**
- Modify: `portfolio/slides.html`

**Interfaces:**
- Consumes: Task 1의 `.s-links`/`.intro-links`/`.link-badge`/`.cue-top` 클래스(index.html에서 이미 정의됨).

- [ ] **Step 1: `portfolio/slides.html`의 `  </main>` 앞에 슬라이드 7·8 삽입**

```html
    <!-- SLIDE 7: HashTrip 개요 + 트러블슈팅 -->
    <section id="s7" class="slide alt">
      <span class="snum">07 / 08</span>
      <div class="slide-wrap">
        <p class="kicker">PROJECT 03</p>
        <h2 class="flag">HashTrip</h2>
        <p class="fpitch">여행 성향 분석부터 일정 공유까지, 내 취향에 맞는 여행을 계획하는 플랫폼. 설문 <b>가중치 합산 기반 성향 분석 알고리즘</b>을 직접 설계·구현.</p>
        <div class="trouble-metrics">
          <div class="trouble-metric">
            <span class="tm-label">성향 분석 결과</span>
            <span class="tm-before">중복 태그 시 오산출</span>
            <span class="tm-arrow">→</span>
            <span class="tm-after">오류 케이스 0건 ✅</span>
          </div>
        </div>
        <div class="trouble-steps">
          <div class="tstep">
            <div class="trail"><div class="tnode tnode-problem">⚠️</div></div>
            <div class="trouble-step step-problem">
              <span class="step-label">문제 상황</span>
              <p>동일 태그가 여러 질문에 걸쳐 중복 등장하면, 실제 가장 많이 선택한 태그가 아닌 다른 태그가 최종 성향으로 결정되는 오류 발생.</p>
            </div>
          </div>
          <div class="tstep">
            <div class="trail"><div class="tnode tnode-cause">🔍</div></div>
            <div class="trouble-step step-cause">
              <span class="step-label">원인 분석</span>
              <p>초기 로직은 태그 존재 여부만 비교하는 SQL 문자열 매칭 방식이라 선택 빈도가 반영되지 않았음.</p>
            </div>
          </div>
          <div class="tstep">
            <div class="trail"><div class="tnode tnode-solve">🛠️</div></div>
            <div class="trouble-step step-solve">
              <span class="step-label">해결 과정</span>
              <p>'태그 유무 비교'를 폐기하고 '질문별 가중치 합산' 방식으로 전면 수정. Oracle SQL 가중치 합산 쿼리(SUM·GROUP BY)로 변경.</p>
            </div>
          </div>
          <div class="tstep">
            <div class="trail"><div class="tnode tnode-result">✅</div></div>
            <div class="trouble-step step-result">
              <span class="step-label">결과</span>
              <p>중복 태그가 발생하는 모든 케이스에서 실제 최다 선택 태그가 정확히 결정됨. 로직 수정 후 오류 케이스 0건 확인.</p>
            </div>
          </div>
        </div>
      </div>
      <button type="button" class="cue" aria-label="다음 슬라이드로 이동"><span class="a">↓</span> SCROLL</button>
    </section>

    <!-- SLIDE 8: 마무리 -->
    <section id="s8" class="slide">
      <span class="snum">08 / 08</span>
      <div class="slide-wrap">
        <p class="s-eyebrow">Thank you</p>
        <h2 class="s-title">감사합니다</h2>
        <p class="s-role">더 궁금한 부분은 아래 채널로 편하게 연락 주세요.</p>
        <div class="s-links intro-links">
          <a href="mailto:dpcks2553@naver.com" class="link-badge">dpcks2553@naver.com</a>
          <a href="https://github.com/hhho0coco1-star" target="_blank" class="link-badge">GitHub ↗</a>
          <a href="https://velog.io/@hhho0coco1-star/posts" target="_blank" class="link-badge">기술 블로그 ↗</a>
        </div>
      </div>
      <button type="button" class="cue cue-top" aria-label="처음으로 이동"><span class="a">↑</span> TOP</button>
    </section>

```

- [ ] **Step 2: 검증 — PDF 재렌더링 후 전체 페이지 수·7~8페이지 확인**

Task 1의 print-to-pdf 명령을 다시 실행하고, Read로 전체를 확인(페이지 수가 정확히 8인지 먼저 확인 후 `pages: "7-8"`).
Expected: PDF 총 8페이지. 7페이지는 HashTrip 개요+트러블슈팅이 한 슬라이드에 들어가 잘림 없이 보임. 8페이지는 연락처 배지 3개 + "TOP" 버튼(인쇄 시엔 `.cue`라 안 보이는 게 정상).

- [ ] **Step 3: 커밋**

```bash
git add portfolio/slides.html
git commit -m "feat: 면접용 슬라이드에 HashTrip·마무리 슬라이드 추가"
```

---

### Task 5: index.html 히어로 버튼 교체 + 모바일 확인 + 최종 점검

**Files:**
- Modify: `portfolio/index.html:52`

- [ ] **Step 1: 히어로 링크 배지 교체**

`portfolio/index.html`에서 (현재 52번째 줄):

```html
          <a href="summary.pdf" download class="link-badge">이력서 PDF ↓</a>
```

를 아래로 교체:

```html
          <a href="slides.html" class="link-badge">포트폴리오 출력하기 ↗</a>
```

- [ ] **Step 2: 검증 — index.html 히어로 스크린샷**

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --window-size=1440,900 --screenshot=/tmp/portshots/index_final.png "file:///D:/projects/portfolio/index.html"
```

Read로 `C:\Users\User\AppData\Local\Temp\portshots\index_final.png` 확인.
Expected: 링크 배지 4개(이메일/GitHub/기술 블로그/포트폴리오 출력하기)가 모두 보이고 "이력서 PDF"는 더 이상 없음.

- [ ] **Step 3: 검증 — slides.html 모바일 폭(390px) 확인**

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --window-size=390,844 --screenshot=/tmp/portshots/slides_mobile.png "file:///D:/projects/portfolio/slides.html"
```

Read로 스크린샷 확인.
Expected: 이전 포트폴리오 점검에서 발견했던 것과 같은 텍스트 잘림(문장 중간이 화면 밖으로 잘리는 현상)이 없어야 함. nav가 로고 하나뿐이라 index.html 히어로보다 겹칠 위험이 적지만, `.s-role`/`.intro-tagline` 문단이 화면 폭 안에서 정상적으로 줄바꿈되는지 반드시 눈으로 확인한다. 잘림이 보이면 이번 Task를 완료 처리하지 말고 원인(=이전 점검에서 미해결로 남긴 모바일 오버플로 버그)을 먼저 잡는다.

- [ ] **Step 4: 헤드리스 크롬 프로세스 정리**

```bash
taskkill //F //IM chrome.exe
```

- [ ] **Step 5: 커밋**

```bash
git add portfolio/index.html
git commit -m "feat: 히어로 '이력서 PDF' 버튼을 '포트폴리오 출력하기'(slides.html)로 교체"
```

---

## 최종 체크리스트

- [ ] `slides.html` 총 8슬라이드, 프로젝트 3개(SafeAlert/LocalQuest/HashTrip) + 표지 + 핵심역량 + 마무리
- [ ] 신규 CSS는 `.flow-diagram` 계열 + `@media print` 블록뿐, 기존 클래스 재사용이 대부분
- [ ] `script.js` 미수정
- [ ] `summary.pdf`/`summary.html` 그대로 존재
- [ ] index.html 히어로에 "이력서 PDF" 문구 없음, "포트폴리오 출력하기"가 `slides.html`로 연결됨
- [ ] `--print-to-pdf`로 뽑은 PDF가 정확히 8페이지, 슬라이드 간 텍스트/카드 잘림 없음
- [ ] slides.html이 390px 모바일 폭에서 텍스트 잘림 없음
