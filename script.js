// ===== 섹션 페이드인 (Intersection Observer) =====
const sections = document.querySelectorAll('.section');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1 }
);
sections.forEach((section) => observer.observe(section));

// ===== 네비게이션 활성화 (스크롤 위치 기반) =====
const navLinks = document.querySelectorAll('.nav-links a');
const sectionEls = document.querySelectorAll('section[id]');

function updateActiveNav() {
  let current = '';
  sectionEls.forEach((section) => {
    const parentContent = section.closest('.project-content');
    if (parentContent && parentContent.style.display === 'none') return;
    const sectionTop = section.offsetTop - 80;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}
window.addEventListener('scroll', updateActiveNav);

// ===== 교육 아코디언 =====
document.querySelectorAll('.edu-expandable').forEach((item) => {
  item.addEventListener('click', () => {
    item.classList.toggle('open');
    item.setAttribute('aria-expanded', item.classList.contains('open'));
  });
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      item.click();
    }
  });
});

// ===== 아키텍처 탭 전환 =====
const archTabBtns = document.querySelectorAll('.arch-tabs .tab-btn');
archTabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    archTabBtns.forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${target}`).classList.add('active');
  });
});

// ===== 기능 흐름 탭 전환 =====
document.querySelectorAll('.flow-tabs .tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.flow;
    document.querySelectorAll('.flow-tabs .tab-btn').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.flow-panel').forEach((p) => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`flow-panel-${target}`).classList.add('active');
  });
});

// ===== 프로젝트 탭 전환 =====
document.querySelectorAll('.project-content .section').forEach((s) => s.classList.add('visible'));

function switchProject(project) {
  document.querySelectorAll('.project-tab').forEach((t) => t.classList.remove('active'));
  document.querySelectorAll(`.project-tab[data-project="${project}"]`).forEach((t) => t.classList.add('active'));
  document.querySelectorAll('.project-content').forEach((c) => {
    c.style.display = c.dataset.project === project ? '' : 'none';
  });
  document.querySelectorAll('.project-nav-item').forEach((item) => {
    item.style.display = item.dataset.project === project ? '' : 'none';
  });
  localStorage.setItem('activeProject', project);
}

document.querySelectorAll('.project-tab').forEach((tab) => {
  tab.addEventListener('click', () => switchProject(tab.dataset.project));
});

// 새로고침 시 마지막 선택 탭 복원
const savedProject = localStorage.getItem('activeProject');
if (savedProject && document.querySelector(`.project-tab[data-project="${savedProject}"]`)) {
  switchProject(savedProject);
}

// ===== 트러블슈팅 카드 탭 전환 =====
document.querySelectorAll('.trouble-card').forEach((card) => {
  card.addEventListener('click', () => {
    const target = card.dataset.trouble;
    document.querySelectorAll('.trouble-card').forEach((c) => c.classList.remove('active'));
    document.querySelectorAll('.trouble-panel').forEach((p) => p.classList.remove('active'));
    card.classList.add('active');
    document.getElementById(`trouble-panel-${target}`).classList.add('active');
  });
});
