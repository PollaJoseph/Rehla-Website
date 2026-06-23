/* ============================================================
   REHLA — Custom JavaScript
   Behaviors: sticky nav, slider, counters, tabs, scroll reveal
   ============================================================ */

(function () {
  'use strict';

  /* ── Sticky Header ── */
  const header = document.getElementById('rehla-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile Menu ── */
  const navToggle = document.getElementById('nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');

  if (navToggle && mobileDrawer) {
    const openDrawer = () => {
      mobileDrawer.classList.add('open');
      navToggle.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const closeDrawer = () => {
      mobileDrawer.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    };
    navToggle.addEventListener('click', () => {
      mobileDrawer.classList.contains('open') ? closeDrawer() : openDrawer();
    });
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);
    // Close on link click
    mobileDrawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
  }

  /* ── Hero Slideshow ── */
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  const destName = document.getElementById('dest-name');

  if (slides.length > 0) {
    let current = 0;
    let timer;

    const destinations = Array.from(slides).map(s => s.dataset.dest || '');

    const goTo = (index) => {
      slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
      if (destName) destName.textContent = destinations[current];
    };

    const start = () => { timer = setInterval(() => goTo(current + 1), 5000); };
    const stop  = () => clearInterval(timer);

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { stop(); goTo(i); start(); });
    });

    goTo(0);
    start();
  }

  /* ── Scroll Reveal ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── Animated Counters ── */
  const counters = document.querySelectorAll('[data-count]');

  if (counters.length > 0) {
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const animateCounter = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 2000;
      const start = performance.now();

      const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(easeOut(progress) * target);
        el.textContent = value.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString() + suffix;
      };

      requestAnimationFrame(update);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  /* ── How It Works Tabs ── */
  const howTabs   = document.querySelectorAll('.how-tab');
  const howPanels = document.querySelectorAll('.how-panel');

  if (howTabs.length > 0) {
    howTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        howTabs.forEach(t => t.classList.remove('active'));
        howPanels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = document.getElementById(target);
        if (panel) panel.classList.add('active');
      });
    });
  }

  /* ── Smooth Scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Active nav link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

})();
