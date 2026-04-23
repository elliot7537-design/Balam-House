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
      a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
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
const imgs = document.querySelectorAll('.ig-post-img, .ig-hl-img, .gi-img, .about-img');
imgs.forEach(el => {
  const url = el.style.backgroundImage;
  if (!url) return;

  const img = new Image();
  img.onerror = () => {
    el.style.backgroundImage = 'none';
    el.style.background = 'linear-gradient(135deg,#020814 0%,#010508 100%)';
  };
  img.src = url.replace(/url\(['"]?|['"]?\)/g, '');
});

/* ---- Hero title letter stagger ---- */
(function initHeroLetters() {
  const main = document.querySelector('.ht-main');
  const sub  = document.querySelector('.ht-sub');
  if (!main || !sub) return;

  revealObserver.unobserve(main);
  revealObserver.unobserve(sub);

  main.style.transition = 'none';
  main.style.opacity    = '1';
  main.style.transform  = 'none';
  main.classList.remove('reveal');

  /* Sub gets a whole-word animation — don't pre-set opacity so the
     animation fill-mode can hold it at 0 during the delay. */
  sub.style.transition = 'none';
  sub.style.transform  = 'none';
  sub.classList.remove('reveal');

  const mainLen = [...main.textContent.trim()].length;

  const splitLetters = (el, baseDelay) => {
    const chars = [...el.textContent.trim()];
    el.innerHTML = chars.map((ch, i) =>
      `<span class="hl" style="--delay:${(baseDelay + i * 0.06).toFixed(2)}s">${ch}</span>`
    ).join('');
  };

  splitLetters(main, 0.2);

  /* Animate sub as a whole word — splitting italic serif letters into
     individual inline-block spans causes the O's slant to bleed visually
     into the adjacent character, making "HOUSE" render as "HOrUSE". */
  const subDelay = (0.2 + mainLen * 0.06 + 0.08).toFixed(2);
  sub.style.animation = `heroLetterIn .85s cubic-bezier(.16,1,.3,1) ${subDelay}s both`;
})();

/* ---- Stat counter animation ---- */
function countUp(el, target, decimals, suffix, duration) {
  let startTime = null;
  const step = ts => {
    if (!startTime) startTime = ts;
    const p = Math.min((ts - startTime) / duration, 1);
    const v = target * (1 - Math.pow(1 - p, 3));
    el.textContent = v.toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    if (el.textContent.includes('★')) {
      countUp(el, 4.4, 1, '★', 1200);
    } else {
      countUp(el, parseInt(el.textContent, 10), 0, '', 900);
    }
    statObserver.unobserve(el);
  });
}, { threshold: 0.6 });

document.querySelectorAll('.stat-n').forEach(el => statObserver.observe(el));

/* ---- Menu vertical swipe ---- */
(function initCarousel() {
  const carousel   = document.getElementById('igCarousel');
  const prevBtn    = document.getElementById('igPrev');
  const nextBtn    = document.getElementById('igNext');
  const highlights = document.querySelectorAll('#igHighlights .ig-highlight');
  if (!carousel || !prevBtn || !nextBtn) return;

  const posts = Array.from(carousel.querySelectorAll('.ig-post'));

  /* Scroll by one slide height */
  function scrollByOne(dir) {
    const visible = posts.find(p => p.style.display !== 'none');
    if (!visible) return;
    carousel.scrollBy({ top: dir * visible.offsetHeight, behavior: 'smooth' });
  }
  prevBtn.addEventListener('click', () => scrollByOne(-1));
  nextBtn.addEventListener('click', () => scrollByOne(1));

  /* Keep arrow states in sync */
  function syncArrows() {
    prevBtn.disabled = carousel.scrollTop < 2;
    nextBtn.disabled = carousel.scrollTop >= carousel.scrollHeight - carousel.offsetHeight - 2;
  }
  carousel.addEventListener('scroll', syncArrows, { passive: true });
  syncArrows();

  /* Category filter — fade out, swap visible posts, reset scroll, fade in */
  highlights.forEach(hl => {
    hl.addEventListener('click', () => {
      const filter = hl.dataset.filter;
      highlights.forEach(h => {
        h.classList.toggle('active', h === hl);
        h.classList.toggle('inactive', h !== hl);
      });

      carousel.style.opacity = '0';
      setTimeout(() => {
        posts.forEach(p => {
          p.style.display = (filter === 'all' || p.dataset.category === filter) ? '' : 'none';
        });
        carousel.scrollTop = 0;
        carousel.style.opacity = '1';
        syncArrows();
      }, 200);
    });
  });
})();
