/* =============================================
   BALAM HOUSE — script.js
   ============================================= */

/* ---- Sticky navbar ---- */
const navbar  = document.getElementById('navbar');
const hero    = document.getElementById('hero');

const navObserver = new IntersectionObserver(
  ([entry]) => navbar.classList.toggle('scrolled', !entry.isIntersecting),
  { threshold: 0.1 }
);
if (hero) navObserver.observe(hero);

/* ---- Mobile menu ---- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ---- Smooth scroll (offset for sticky nav) ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.scrollY - 78;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});

/* ---- Scroll-reveal (Intersection Observer) ---- */
const revealItems = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    /* Stagger siblings */
    const siblings = Array.from(
      entry.target.parentElement.querySelectorAll('.reveal')
    );
    const idx = siblings.indexOf(entry.target);
    entry.target.style.transitionDelay = `${idx * 0.07}s`;

    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

revealItems.forEach(el => revealObserver.observe(el));

/* ---- Hero parallax (subtle) ---- */
const heroBg = document.querySelector('.hero-bg');

function onScroll() {
  if (!heroBg) return;
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight * 1.2) {
    heroBg.style.transform = `translateY(${scrolled * 0.28}px)`;
  }
}
window.addEventListener('scroll', onScroll, { passive: true });

/* ---- Active nav link on scroll ---- */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navAnchors.forEach(a => {
      const isActive = a.getAttribute('href') === `#${id}`;
      a.style.color = isActive ? 'var(--text)' : '';
    });
  });
}, { threshold: 0.45 });

sections.forEach(s => sectionObserver.observe(s));

/* ---- Newsletter form ---- */
const nlForm = document.getElementById('nlForm');
if (nlForm) {
  nlForm.addEventListener('submit', e => {
    e.preventDefault();
    const input = nlForm.querySelector('.nl-input');
    const btn   = nlForm.querySelector('.nl-btn');
    input.value = '¡Gracias por suscribirte!';
    input.style.color = 'var(--green)';
    btn.innerHTML = '<i class="fas fa-check"></i>';
    btn.style.background = 'var(--green)';
    btn.style.color = '#000';
    setTimeout(() => {
      input.value = '';
      input.style.color = '';
      btn.innerHTML = '<i class="fas fa-arrow-right"></i>';
      btn.style.background = '';
      btn.style.color = '';
    }, 3000);
  });
}

/* ---- Image error fallback ---- */
const imgs = document.querySelectorAll('.mc-img, .gi-img, .about-img');
imgs.forEach(el => {
  const url = el.style.backgroundImage;
  if (!url) return;

  const img = new Image();
  img.onerror = () => {
    el.style.backgroundImage = 'none';
    el.style.background = 'linear-gradient(135deg,#1a0e00 0%,#0a0704 100%)';
  };
  img.src = url.replace(/url\(['"]?|['"]?\)/g, '');
});
