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
