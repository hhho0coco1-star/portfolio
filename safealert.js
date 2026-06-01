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
