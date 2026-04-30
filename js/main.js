/* ═══════════════════════════════════════════════════════
   ANGELIKA BELLE — Main JS
   90s Retro / Afro-Reggaeton / R&B Soul
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    // Hide loader once page is fully loaded
    const loader = document.getElementById('loader');
    if (loader) {
      const hideLoader = () => {
        loader.classList.add('hidden');
      };

      // Wait for window load and ensure minimum 4s display time
      const startTime = Date.now();
      const minDisplayTime = 4000;

      const checkAndHide = () => {
        const elapsed = Date.now() - startTime;
        const timeToWait = Math.max(0, minDisplayTime - elapsed);
        setTimeout(() => {
          hideLoader();
          document.body.classList.add('loader-done');
        }, timeToWait);
      };

      if (document.readyState === 'complete') {
        checkAndHide();
      } else {
        window.addEventListener('load', checkAndHide);
      }
    }

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

  // Close mobile menu on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Close mobile menu on click outside
  menu.addEventListener('click', (e) => {
    if (e.target === menu) {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    }
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
  const hasTouchScreen = window.matchMedia('(hover: none)').matches;
  if (!prefersReducedMotion && !hasTouchScreen) {
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

  // ── Release artwork carousels ───────────────────────
  const carousels = document.querySelectorAll('[data-carousel]');

  carousels.forEach((carousel) => {
    const originalSlides = Array.from(carousel.querySelectorAll('[data-slide]'));
    if (originalSlides.length < 2) return;

    const viewport = carousel.querySelector('.release-carousel-viewport');
    const track = carousel.querySelector('[data-carousel-track]');
    const dots = Array.from(carousel.querySelectorAll('[data-carousel-dot]'));
    const prevBtn = carousel.querySelector('[data-carousel-prev]');
    const nextBtn = carousel.querySelector('[data-carousel-next]');
    const autoplayMs = Number(carousel.getAttribute('data-autoplay-ms') || 0);

    // Cloning for infinite loop — clone enough to fill viewport on both sides
    const cloneOffset = 4;
    const clonesToPrepend = originalSlides.slice(-cloneOffset);
    const clonesToAppend = originalSlides.slice(0, cloneOffset);

    clonesToAppend.forEach(s => {
      const clone = s.cloneNode(true);
      clone.classList.add('is-clone');
      track.appendChild(clone);
    });
    clonesToPrepend.reverse().forEach(s => {
      const clone = s.cloneNode(true);
      clone.classList.add('is-clone');
      track.insertBefore(clone, track.firstChild);
    });
  });

  // ── Release Player (Featured + Stack) ───────────────────────
  const player = document.getElementById('releasePlayer');
  if (player) {
    const featuredImg = document.getElementById('featuredImg');
    const featuredTitle = document.getElementById('featuredTitle');
    const featuredSleeve = player.querySelector('.release-sleeve');
    const stackItems = Array.from(document.querySelectorAll('.release-stack-item'));
    const releaseStack = document.getElementById('releaseStack');
    const scrollArrowUp = document.getElementById('scrollArrowUp');
    const scrollArrowDown = document.getElementById('scrollArrowDown');
    const scrollDots = Array.from(document.querySelectorAll('.release-scroll-dot'));

    const releaseData = [
      { title: "What You Like",       spotify: "https://open.spotify.com/album/3Im5jsHHzlIuIhIqN92DNZ?si=1&nd=1&dlsi=f3da75b918064ee2", apple: "https://music.apple.com/us/album/what-you-like-single/1877894327",                                   youtube: "https://www.youtube.com/watch?v=a4DGXqqy0M4&list=OLAK5uy_kscFLRUIQIiC4fAb8mkAQQVLJJwhYZG60&index=1", audiomack: "https://audiomack.com/angelika_belle", preview: "assets/audio/previews/What You Like.mp3" },
      { title: "Dreadlocks (Remix)",  spotify: "https://open.spotify.com/album/0sZBNxqbKNUDWTNYGkanDp",                                    apple: "https://music.apple.com/ng/album/dreadlocks-feat-elijah-seychelles-remix-single/1794778555", youtube: "https://www.youtube.com/watch?v=AzCbuGVxLOo",                                                            audiomack: "https://audiomack.com/angelika_belle/song/dreadlocks-remix", preview: "assets/audio/previews/Dreadlocks.mp3" },
      { title: "Fall ft Fiokee",      spotify: "https://open.spotify.com/track/29GgoWpyWmh4YdPOCZ1lM6",                                    apple: "https://music.apple.com/ng/album/fall-feat-fiokee-single/1664894284",                              youtube: "https://www.youtube.com/watch?v=TmeX82FkFkY",                                                            audiomack: "https://audiomack.com/angelika_belle/song/fall" },
      { title: "My Love",             spotify: "https://open.spotify.com/album/5A4g0ShceJZpLUXQ737cbE",                                    apple: "https://music.apple.com/ng/album/my-love-single/1691242661",                                      youtube: "https://www.youtube.com/watch?v=7zTeBbI7mG8",                                                            audiomack: "https://audiomack.com/angelika_belle/song/my-love" },
      { title: "Sho'Ma",              spotify: "https://open.spotify.com/track/7iAq7W79x8iz0kqmPpAbd9",                                    apple: "https://music.apple.com/ng/song/sho-ma-feat-jennifer-rush/1571525535",                            youtube: "https://www.youtube.com/watch?v=jrqiUpJHtfM",                                                            audiomack: "https://audiomack.com/angelika_belle", preview: "assets/audio/previews/Shoma.mp3" },
      { title: "Dreadlocks",          spotify: "https://open.spotify.com/track/3fz0ENhSCcCrNbRVQJ16xm",                                    apple: "https://music.apple.com/ng/album/dreadlock-single/1746216849",                                    youtube: "https://www.youtube.com/watch?v=AoPBQP8FK7k",                                                            audiomack: "https://audiomack.com/angelika_belle/song/dreadlocks-by-angelika-belle", preview: "assets/audio/previews/Dreadlocks.mp3" },
      { title: "Burn",                spotify: "https://open.spotify.com/track/4pGktaNnEzrsJmIybKNZ53",                                    apple: "https://music.apple.com/ng/album/burn-feat-dandizzy-single/1746217263",                          youtube: "https://www.youtube.com/watch?v=7kGgthGms-o",                                                            audiomack: "https://audiomack.com/angelika_belle/song/burn" },
      { title: "Turn on Your Light",  spotify: "https://open.spotify.com/album/7tcloVGAPLemjCUpABkl1Z",                                    apple: "https://music.apple.com/ng/album/turn-on-your-light-single/1746294774",                          youtube: "https://www.youtube.com/watch?v=15l2E9C0zeM",                                                            audiomack: "https://audiomack.com/angelika_belle/song/turn-on-your-light" },
      { title: "1n Day",              spotify: "https://open.spotify.com/album/3WBR48vHnwI3aOYOb06MxS",                                    apple: "https://music.apple.com/ng/album/1n-day-single/1464007310",                                      youtube: "https://www.youtube.com/watch?v=o8Db2LnlpH4",                                                            audiomack: "https://audiomack.com/angelika_belle/song/1n-day" },
    ];
    let currentIndex = Math.max(0, Math.min(releaseData.length - 1, parseInt(player.dataset.initialIndex || 0)));

    // Hover preview audio
    const previewAudio = new Audio();
    previewAudio.preload = 'none';
    const previewCache = new Map();
    let previewToken = 0;
    let fadeFrame = null;
    let audioUnlocked = false;

    // Unlock audio context on first user interaction with the page
    const unlockOnInteraction = () => {
      audioUnlocked = true;
      document.removeEventListener('click', unlockOnInteraction);
      document.removeEventListener('keydown', unlockOnInteraction);
      document.removeEventListener('touchstart', unlockOnInteraction);
    };
    document.addEventListener('click', unlockOnInteraction);
    document.addEventListener('keydown', unlockOnInteraction);
    document.addEventListener('touchstart', unlockOnInteraction);

    const stopPreview = (resetTime = true) => {
      previewToken += 1;
      if (fadeFrame) {
        cancelAnimationFrame(fadeFrame);
        fadeFrame = null;
      }
      previewAudio.pause();
      previewAudio.volume = 0;
      if (resetTime) {
        try {
          previewAudio.currentTime = 0;
        } catch (e) {
          // Ignore seek errors before metadata is loaded.
        }
      }
    };

    const fadeInPreview = (targetVolume = 0.8, durationMs = 260) => {
      if (fadeFrame) {
        cancelAnimationFrame(fadeFrame);
        fadeFrame = null;
      }
      const start = performance.now();
      const startVol = previewAudio.volume;
      const step = (now) => {
        const t = Math.min((now - start) / durationMs, 1);
        previewAudio.volume = startVol + (targetVolume - startVol) * t;
        if (t < 1) {
          fadeFrame = requestAnimationFrame(step);
        } else {
          fadeFrame = null;
        }
      };
      fadeFrame = requestAnimationFrame(step);
    };

    const getPreviewUrl = (index) => {
      if (previewCache.has(index)) return previewCache.get(index);
      const release = releaseData[index];
      if (!release) return null;

      // Deterministic local previews only for now.
      const previewUrl = release.preview || null;
      previewCache.set(index, previewUrl);
      return previewUrl;
    };

    const playHoverPreview = ({ force = false } = {}) => {
      if (!featuredSleeve) return;
      if (!force && !featuredSleeve.matches(':hover')) return;
      const url = getPreviewUrl(currentIndex);
      if (!url || (!force && !featuredSleeve.matches(':hover'))) return;

      if (previewAudio.src !== url) {
        stopPreview(false);
        previewAudio.src = url;
        previewAudio.load();
      }
      // Capture token AFTER any internal stopPreview so the token stays current.
      const token = ++previewToken;
      previewAudio.volume = 0;
      const playPromise = previewAudio.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(() => {
          audioUnlocked = true;
          if (token === previewToken && (force || featuredSleeve.matches(':hover'))) {
            fadeInPreview();
          }
        }).catch(() => {
          // Browser blocked autoplay without gesture.
        });
      } else {
        audioUnlocked = true;
        if (token === previewToken && (force || featuredSleeve.matches(':hover'))) {
          fadeInPreview();
        }
      }
    };

    const updateScrollArrows = () => {
      if (!releaseStack || !scrollArrowUp || !scrollArrowDown) return;
      const atTop    = releaseStack.scrollTop <= 10;
      const atBottom = releaseStack.scrollTop >= releaseStack.scrollHeight - releaseStack.clientHeight - 10;
      scrollArrowUp.classList.toggle('hidden', atTop);
      scrollArrowUp.classList.toggle('visible', !atTop);
      scrollArrowDown.classList.toggle('hidden', atBottom);
      scrollArrowDown.classList.toggle('visible', !atBottom);
    };

    const updateFeatured = (index) => {
      const item = stackItems[index];
      const data = releaseData[index] || releaseData[0];
      currentIndex = index;

      stackItems.forEach((btn, i) => btn.classList.toggle('is-active', i === index));
      scrollDots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      updateScrollArrows();

      featuredImg.style.opacity = '0';
      featuredTitle.style.opacity = '0';
      featuredTitle.style.transform = 'translateY(10px)';

      setTimeout(() => {
        featuredImg.src = item.dataset.img;
        featuredImg.alt = item.dataset.title;
        featuredTitle.textContent = item.dataset.title;

        document.querySelectorAll('.release-link').forEach(link => {
          const url = data[link.dataset.platform];
          if (url) link.href = url;
        });

        featuredImg.style.opacity = '1';
        featuredTitle.style.opacity = '1';
        featuredTitle.style.transform = 'translateY(0)';
      }, 200);

      updatePreviewHint(index);

      // If user is already hovering the sleeve, switch preview to the selected track.
      if (featuredSleeve && featuredSleeve.matches(':hover')) {
        stopPreview();
        playHoverPreview();
      }
    };

    stackItems.forEach((item, i) => item.addEventListener('click', () => updateFeatured(i)));

    if (releaseStack) releaseStack.addEventListener('scroll', updateScrollArrows);
    // Preview hint badge
    const previewHint = document.createElement('span');
    previewHint.className = 'release-sleeve-preview-hint';
    previewHint.textContent = '♪ preview';
    if (featuredSleeve) featuredSleeve.appendChild(previewHint);

    const updatePreviewHint = (index) => {
      const hasPreview = !!getPreviewUrl(index);
      featuredSleeve.toggleAttribute('data-has-preview', hasPreview);
      previewHint.style.display = hasPreview ? '' : 'none';
    };

    if (featuredSleeve) {
      featuredSleeve.addEventListener('mouseenter', playHoverPreview);
      featuredSleeve.addEventListener('mouseleave', () => stopPreview());
      const unlockAndPlay = () => {
        audioUnlocked = true;
        playHoverPreview({ force: true });
      };
      featuredSleeve.addEventListener('pointerdown', unlockAndPlay);
      featuredSleeve.addEventListener('click', unlockAndPlay);
    }

    updateFeatured(currentIndex);
    updatePreviewHint(currentIndex);
    updateScrollArrows();
  }

  } // end init

})();
