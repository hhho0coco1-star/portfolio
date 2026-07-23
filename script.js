// 섹션 페이드인
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.section').forEach(s => observer.observe(s));

// 네비게이션 활성화 (스크롤 위치 기반)
// nav 링크가 가리키는 섹션만 추적 → 메뉴 없는 #projects 구간에서는 직전 항목(소개) 유지
const navLinks = document.querySelectorAll('.nav-links a');
const sectionEls = Array.from(navLinks)
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

window.addEventListener('scroll', () => {
  let current = '';
  sectionEls.forEach(s => {
    if (window.scrollY >= s.offsetTop - 80) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// 네비게이션 클릭 시 부드러운 스크롤
// 방문자 OS의 "동작 줄이기" 설정이 켜져 있으면 브라우저가 scroll-behavior:smooth /
// {behavior:'smooth'} 를 전부 무시하고 즉시 이동시켜버리는 경우가 있어(엔진 레벨 정책,
// 페이지 CSS/JS로 우회 불가), 네이티브 smooth-scroll에 기대지 않고 직접 애니메이션한다.
// scroll-snap-type(mandatory)은 애니메이션 도중 값을 가로채 중간에 스냅해버리므로
// 애니메이션 동안만 잠시 끄고, 끝나면 원래 값으로 복원한다.
if (document.documentElement.classList.contains('slide-deck')) {
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

  // 슬라이드 하단 "SCROLL" 버튼 → 바로 다음 슬라이드로 한 화면씩 이동
  // 마지막 슬라이드의 "TOP" 버튼(.cue-top)만 예외 — 첫 슬라이드로 되돌아감
  document.querySelectorAll('.cue').forEach(cue => {
    cue.addEventListener('click', () => {
      let target;
      if (cue.classList.contains('cue-top')) {
        target = document.querySelector('.slide');
      } else {
        const currentSlide = cue.closest('.slide');
        target = currentSlide && currentSlide.nextElementSibling;
      }
      if (!target || !target.classList.contains('slide')) return;
      const targetY = target.getBoundingClientRect().top + window.scrollY - navH;
      animateScrollTo(targetY);
      if (target.id) history.pushState(null, '', '#' + target.id);
    });
  });
}

// 교육 아코디언
document.querySelectorAll('.edu-expandable').forEach(item => {
  item.addEventListener('click', () => {
    item.classList.toggle('open');
    item.setAttribute('aria-expanded', item.classList.contains('open'));
  });
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
  });
});
