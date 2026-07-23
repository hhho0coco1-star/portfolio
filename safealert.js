// 섹션 페이드인
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.section').forEach(s => observer.observe(s));

// 네비게이션 활성화
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 80) current = s.id; });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// 네비게이션 클릭 시 부드러운 스크롤
// 방문자 OS의 "동작 줄이기" 설정이 켜져 있으면 브라우저가 네이티브 smooth-scroll을
// 전부 무시하고 즉시 이동시켜버리므로(엔진 레벨 정책), 직접 애니메이션한다.
// scroll-snap-type(mandatory)은 애니메이션 도중 값을 가로채 중간에 스냅해버리므로
// 애니메이션 동안만 잠시 끄고, 끝나면 원래 값으로 복원한다.
const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 0;

function easeInOutQuad(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

function animateScrollTo(targetY, duration = 500) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();
  const prevSnapType = document.documentElement.style.scrollSnapType;
  document.documentElement.style.scrollSnapType = 'none';

  function step(now) {
    const progress = Math.min(1, (now - startTime) / duration);
    window.scrollTo(0, Math.round(startY + distance * easeInOutQuad(progress)));
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      document.documentElement.style.scrollSnapType = prevSnapType;
    }
  }
  requestAnimationFrame(step);
}

navLinks.forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const targetY = target.getBoundingClientRect().top + window.scrollY - navH;
    animateScrollTo(targetY);
    history.pushState(null, '', a.getAttribute('href'));
  });
});

// 아키텍처 탭 전환
document.querySelectorAll('.arch-tabs .tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.arch-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// 기능 흐름 탭 전환
document.querySelectorAll('.flow-tabs .tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.flow-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.flow-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('flow-panel-' + btn.dataset.flow).classList.add('active');
  });
});

// 트러블슈팅 카드
document.querySelectorAll('.trouble-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.trouble-card').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.trouble-panel').forEach(p => p.classList.remove('active'));
    card.classList.add('active');
    document.getElementById('trouble-panel-' + card.dataset.trouble).classList.add('active');
  });
});
