# 포트폴리오 리뷰 스킬 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 채용담당자 스캔 기준 5개를 고정 명문화한 경량 단일 스킬(`portfolio-review`)을 만들어, `c:\study\portfolio` 사이트를 헤드리스 크롬 스크린샷 + 텍스트 검토로 평가하고 우선순위별 개선안을 보고하게 한다.

**Architecture:** 서브에이전트 없이 현재 대화에서 직접 실행되는 단일 SKILL.md. 절차는 (1) 로컬 정적 서버 기동 → (2) 헤드리스 크롬 CDP로 페이지별 스크린샷 → (3) HTML 텍스트 동시 검토 → (4) 5개 평가 기준 적용 → (5) 서버/크롬 정리 → (6) `[HIGH]/[MED]/[LOW]` 우선순위 리포트 출력(코드 수정 없음). 스펙 문서: `docs/superpowers/specs/2026-07-23-portfolio-review-skill-design.md`.

**Tech Stack:** Claude Code Skill(Markdown), Python `http.server`, Chrome headless + CDP(Chrome DevTools Protocol) — 이전 스크롤 스냅 버그 검증에 쓴 것과 동일한 방식.

---

### Task 1: skill-creator로 스킬 스캐폴딩

**Files:**
- Create (skill-creator가 생성): `SKILL.md` 및 필요 시 `references/` 하위 파일 (정확한 경로는 skill-creator 관례를 따름 — 보통 `~/.claude/skills/portfolio-review/SKILL.md` 또는 프로젝트 스코프 스킬 디렉터리)

- [ ] **Step 1: skill-creator 스킬 호출**

`Skill` 도구로 `skill-creator:skill-creator`를 호출한다. 아래 요구사항을 그대로 전달한다:

```
스킬 이름: portfolio-review
트리거: "/portfolio-review" 슬래시 커맨드, 그리고 "포트폴리오 평가해줘"/"1p 다시 봐줘" 류의 자연어
대상: c:\study\portfolio 사이트 (인자로 특정 페이지 지정 가능, 기본은 index.html)
서브에이전트 사용 안 함 — 현재 대화에서 직접 수행하는 경량 단일 스킬

절차:
1. `python -m http.server <포트>`로 portfolio/ 디렉터리를 임시 정적 서버로 기동
2. 헤드리스 크롬(--headless=new --remote-debugging-port=<포트>)을 띄우고 CDP로 접속
3. 대상 페이지의 각 섹션/슬라이드 위치로 스크롤(또는 앵커) 후 스크린샷 캡처
4. 같은 페이지의 HTML 텍스트(문구·배치 순서)도 함께 읽음
5. 아래 5개 평가 기준으로 채점
6. 헤드리스 크롬과 정적 서버 프로세스를 종료
7. [HIGH]/[MED]/[LOW] 우선순위별 개선안을 텍스트로 출력. 코드는 수정하지 않음 — 실제 반영은 사용자 승인 후 별도 진행

평가 기준 5개 (그대로 스킬 본문에 포함):
1. 첫 화면 스킵 테스트 — 스크롤 없이 보이는 영역에서 "핵심역량"이 "스펙/자격증"보다 시각적으로 먼저·크게 보이는가
2. 숫자=역량 매칭 — 정량 지표의 라벨이 역량을 설명하는가, 단순 스펙 나열인가 (예: "자격증 2"는 X, "MSA 5개 단독설계"는 O)
3. 문제→과정→해결→결과 구조 — 프로젝트 설명에 이 흐름이 있는지, 결과가 정량화됐는지
4. 훑어보기 밀도 — 한 화면/섹션 정보량이 6초~수십 초 안에 못 읽을 만큼 빽빽한 구간이 있는지
5. 정보 위계 순서 — 스펙(자격증·학력)이 상대적으로 뒤 슬라이드로 밀려 있고 역량·프로젝트가 앞에 오는 구조인지

출력 형식 예시:
[HIGH] <위치> — <문제 한 줄>
  → 근거: <왜 문제인지, 5개 기준 중 몇 번에 해당하는지>
  → 개선안: <구체적으로 무엇을 바꾸면 좋은지>

하지 않는 것: 코드 자동 수정, 색감/서체 등 주관적 심미성 평가, 매 실행마다 서브에이전트 기동
```

- [ ] **Step 2: skill-creator 산출물 확인**

skill-creator가 생성한 SKILL.md의 실제 경로를 확인한다 (`find ~/.claude/skills -iname "*portfolio-review*"` 또는 skill-creator가 보고하는 경로 그대로 사용). 이 경로를 이후 Task에서 그대로 참조한다.

- [ ] **Step 3: frontmatter 확인**

생성된 SKILL.md 상단에 `name`, `description` 필드가 있는지, `description`에 "포트폴리오", "채용담당자", "/portfolio-review" 같은 트리거 키워드가 포함돼 스킬 자동 매칭에 걸릴 만한지 확인한다. 빠져 있으면 Edit로 보완한다.

---

### Task 2: 정적 서버 + 헤드리스 크롬 절차 동작 확인

**Files:**
- Read: 생성된 SKILL.md (Task 1에서 확인한 경로)

- [ ] **Step 1: 스킬 본문에 있는 서버 기동 커맨드를 그대로 수동 실행해본다**

```bash
cd /c/study/portfolio && python -m http.server 8791 >/tmp/portsrv_verify.log 2>&1 &
sleep 1
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8791/index.html
```

Expected: `200`

- [ ] **Step 2: 헤드리스 크롬 CDP 접속 확인**

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --remote-debugging-port=9333 --window-size=1400,900 about:blank > /tmp/chrome_verify.log 2>&1 &
sleep 2
curl -s http://localhost:9333/json/version
```

Expected: JSON에 `webSocketDebuggerUrl` 포함

- [ ] **Step 3: 프로세스 정리**

```bash
taskkill //F //IM chrome.exe 2>/dev/null
pkill -f "http.server 8791" 2>/dev/null
```

---

### Task 3: 실제 포트폴리오 대상 end-to-end 실행 검증

**Files:**
- N/A (스킬 실행 자체가 검증 대상)

- [ ] **Step 1: `/portfolio-review` 슬래시 커맨드 실행**

새 대화 턴에서 `/portfolio-review`를 실행한다.

- [ ] **Step 2: 출력 형식 검증**

출력이 다음을 만족하는지 확인한다:
- `[HIGH]`/`[MED]`/`[LOW]` 우선순위 태그가 붙어 있다
- 각 항목에 "근거"와 "개선안"이 구분되어 있다
- 1p(hero)의 "자격증 2" 통계 카드가 최소 하나의 항목으로 지적된다 (이미 알려진 실제 이슈이므로, 스킬이 이걸 못 잡으면 기준이 제대로 반영 안 된 것)
- 코드 파일이 실제로 수정되지 않았다 (`git status`로 확인)

```bash
cd /c/study/portfolio && git status --short
```

Expected: 변경된 파일 없음 (스킬 실행만으로는 diff가 생기지 않아야 함)

- [ ] **Step 3: 서버/크롬 프로세스 잔류 확인**

```bash
tasklist | grep -i chrome
```

Expected: 스킬 실행이 끝난 후 남아있는 chrome.exe 프로세스가 없어야 함 (스킬이 정리 단계를 제대로 수행했는지 확인)

---

### Task 4: 커밋

**Files:**
- Modify/Create: 생성된 SKILL.md 경로

- [ ] **Step 1: 스킬 파일이 git 추적 대상인지 확인**

스킬이 `~/.claude/skills/`(사용자 홈)에 생성됐다면 `c:\study\portfolio` 저장소와 무관하므로 커밋 대상이 아니다. 스킬이 프로젝트 스코프(`c:\study\portfolio\.claude\skills\`)에 생성됐다면 아래처럼 커밋한다:

```bash
cd /c/study/portfolio && git add .claude/skills/portfolio-review && git commit -m "$(cat <<'EOF'
Add portfolio-review skill for recruiter-scan-focused feedback

Adds a lightweight skill that screenshots the portfolio site via
headless Chrome and scores it against a 5-point recruiter-scan
rubric (core competency over credentials, quantified impact,
problem-process-result structure, scan density, info hierarchy).
EOF
)"
```

- [ ] **Step 2: git status로 최종 확인**

```bash
git status
```

Expected: `nothing to commit, working tree clean` (push는 하지 않음 — 저장소 규칙)
