/* ═══════════════════════════════════════════════════════
   ANGELIKA BELLE — Main JS
   90s Retro / Afro-Reggaeton / R&B Soul
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Nav scroll state ─────────────────────────────────
  const nav = document.getElementById('nav');
  const syncNavState = () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
    if (!prefersReducedMotion) {
      const shift = Math.min(window.scrollY * 0.12, 36);
      document.body.style.setProperty('--scroll-shift', `${shift}px`);
    }
  };

  window.addEventListener('scroll', syncNavState, { passive: true });
  syncNavState();

  // ── Mobile menu ──────────────────────────────────────
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  });

  document.querySelectorAll('[data-mobile-link]').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ── Smooth scroll for all nav links ──────────────────
  document.querySelectorAll('[data-nav], [data-mobile-link], .footer-links a, .hero-btns a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ── Scroll-in reveal ─────────────────────────────────
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );

  document.querySelectorAll('.scroll-in').forEach((el) => observer.observe(el));

  // ── Stat counters ────────────────────────────────────
  const counters = document.querySelectorAll('[data-counter]');

  const formatCounterValue = (value, suffix) => {
    if (suffix === 'K+') {
      return `${Math.round(value / 1000)}K+`;
    }
    if (suffix === 'M+') {
      return `${(value / 1000000).toFixed(1).replace(/\.0$/, '')}M+`;
    }
    return `${Math.round(value)}${suffix || ''}`;
  };

  const runCounter = (counter) => {
    if (counter.dataset.counted === 'true') {
      return;
    }

    const target = Number(counter.dataset.target || 0);
    const suffix = counter.dataset.suffix || '';
    counter.dataset.counted = 'true';

    if (prefersReducedMotion || target <= 0) {
      counter.textContent = formatCounterValue(target, suffix);
      return;
    }

    const duration = 1600;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = formatCounterValue(target * eased, suffix);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.45 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  // ── Tilt interactions ────────────────────────────────
  const tiltTargets = document.querySelectorAll('[data-tilt]');
  if (!prefersReducedMotion) {
    tiltTargets.forEach((el) => {
      el.addEventListener('pointermove', (event) => {
        const rect = el.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * 8;
        const rotateX = (0.5 - py) * 8;
        el.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });

      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });
  }

  // ── Contact form (basic UX) ──────────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Sent!';
      btn.style.background = 'var(--green)';
      btn.style.color = 'var(--ink)';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  }

})();
