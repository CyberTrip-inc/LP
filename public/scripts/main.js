/* ============================================
   CyberTrip — Premium Animations (2026)
   GSAP ScrollTrigger + Text Reveals + Parallax
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initHamburger();
  initGSAP();
});

/* --- Header background on scroll --- */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  let ticking = false;
  function update() {
    if (window.scrollY > 60) {
      header.classList.add('header--scrolled');
      header.classList.remove('header--hero');
    } else {
      header.classList.remove('header--scrolled');
      header.classList.add('header--hero');
    }
    ticking = false;
  }

  update();
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}

/* --- Mobile Hamburger --- */
function initHamburger() {
  const btn = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav-main');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* --- GSAP Animations --- */
function initGSAP() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    initFallbackAnimations();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Default easing for premium feel
  const premiumEase = 'power4.out';
  const smoothEase = 'expo.out';

  // =======================================
  // Hero entrance — cinematic stagger
  // =======================================
  const heroTimeline = gsap.timeline({ delay: 0.4 });

  const heroEyebrow = document.querySelector('.hero-eyebrow');
  if (heroEyebrow) {
    heroTimeline.to(heroEyebrow, {
      opacity: 1,
      duration: 0.8,
      ease: premiumEase
    });
  }

  const heroTitle = document.querySelector('.hero-title, .hero-title-ja');
  if (heroTitle) {
    heroTimeline.fromTo(heroTitle,
      { opacity: 0, y: 50, clipPath: 'inset(0 0 100% 0)' },
      { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: smoothEase },
      '-=0.4'
    );
  }

  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroSubtitle) {
    heroTimeline.to(heroSubtitle, {
      opacity: 1, duration: 1, ease: premiumEase
    }, '-=0.6');
  }

  const heroCtas = document.querySelector('.hero-ctas');
  if (heroCtas) {
    heroTimeline.to(heroCtas, {
      opacity: 1, duration: 0.8, ease: premiumEase
    }, '-=0.5');
  }

  // =======================================
  // Page hero entrance (sub-pages)
  // =======================================
  const pageHeroLabel = document.querySelector('.page-hero-label');
  const pageHeroTitle = document.querySelector('.page-hero-title');
  const pageHeroSub = document.querySelector('.page-hero-sub');

  if (pageHeroLabel || pageHeroTitle) {
    const pageTimeline = gsap.timeline({ delay: 0.3 });

    if (pageHeroLabel) {
      pageTimeline.to(pageHeroLabel, {
        opacity: 1, duration: 0.6, ease: premiumEase
      });
    }

    if (pageHeroTitle) {
      pageTimeline.to(pageHeroTitle, {
        opacity: 1, y: 0, duration: 1, ease: smoothEase
      }, '-=0.3');
    }

    if (pageHeroSub) {
      pageTimeline.to(pageHeroSub, {
        opacity: 1, y: 0, duration: 0.8, ease: premiumEase
      }, '-=0.5');
    }
  }

  // =======================================
  // Parallax on hero blobs
  // =======================================
  gsap.utils.toArray('.hero-blob').forEach((blob, i) => {
    gsap.to(blob, {
      y: -100 - (i * 40),
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  });

  // =======================================
  // Section labels — slide in with line
  // =======================================
  gsap.utils.toArray('.section-label-line').forEach(el => {
    const label = el.querySelector('.section-label');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true
      }
    });

    if (label) {
      tl.fromTo(label,
        { opacity: 0, x: -15 },
        { opacity: 1, x: 0, duration: 0.6, ease: premiumEase }
      );
    }

    // Animate the ::after line using a scaleX trick on the container
    tl.fromTo(el,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: premiumEase },
      0
    );
  });

  // =======================================
  // Philosophy items — staggered reveal
  // =======================================
  gsap.utils.toArray('.philosophy-item').forEach((item, i) => {
    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: i * 0.12,
      ease: smoothEase,
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        once: true
      }
    });
  });

  // =======================================
  // Concept text — dramatic reveal
  // =======================================
  gsap.utils.toArray('.concept-text').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      delay: i * 0.2,
      ease: smoothEase,
      scrollTrigger: {
        trigger: el,
        start: 'top 82%',
        once: true
      }
    });
  });

  // =======================================
  // Bento cards — staggered batch reveal
  // =======================================
  const bentoCards = gsap.utils.toArray('.bento-card');
  if (bentoCards.length) {
    ScrollTrigger.batch(bentoCards, {
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: smoothEase
        });
      },
      start: 'top 88%',
      once: true
    });
  }

  // =======================================
  // Home cards — staggered reveal
  // =======================================
  const homeCards = gsap.utils.toArray('.home-card');
  if (homeCards.length) {
    ScrollTrigger.batch(homeCards, {
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.12,
          ease: smoothEase
        });
      },
      start: 'top 88%',
      once: true
    });
  }

  // =======================================
  // VM items — scale + fade
  // =======================================
  gsap.utils.toArray('.vm-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, y: 40, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        delay: i * 0.15,
        ease: smoothEase,
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          once: true
        }
      }
    );
  });

  // =======================================
  // Stat cards — counter-like reveal
  // =======================================
  const statCards = gsap.utils.toArray('.stat-card');
  if (statCards.length) {
    ScrollTrigger.batch(statCards, {
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: smoothEase
        });
      },
      start: 'top 85%',
      once: true
    });
  }

  // =======================================
  // Drift Hero entrance
  // =======================================
  const driftHeroName = document.querySelector('.drift-hero-name');
  if (driftHeroName) {
    const driftHeroTl = gsap.timeline({ delay: 0.3 });
    const driftLabel = document.querySelector('.drift-hero .page-hero-label');
    const driftTagline = document.querySelector('.drift-hero-tagline');
    const driftDesc = document.querySelector('.drift-hero-desc');

    if (driftLabel) {
      driftHeroTl.to(driftLabel, { opacity: 1, duration: 0.6, ease: premiumEase });
    }
    driftHeroTl.to(driftHeroName, {
      opacity: 1, y: 0, duration: 1.2, ease: smoothEase
    }, '-=0.3');
    if (driftTagline) {
      driftHeroTl.to(driftTagline, { opacity: 1, y: 0, duration: 0.8, ease: smoothEase }, '-=0.6');
    }
    if (driftDesc) {
      driftHeroTl.to(driftDesc, { opacity: 1, duration: 0.8, ease: premiumEase }, '-=0.4');
    }
  }

  // =======================================
  // Drift KPI cards
  // =======================================
  const kpiCards = gsap.utils.toArray('.drift-kpi');
  if (kpiCards.length) {
    ScrollTrigger.batch(kpiCards, {
      onEnter: (batch) => {
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: smoothEase });
      },
      start: 'top 88%',
      once: true
    });
  }

  // =======================================
  // Company MV cards + Founder cards
  // =======================================
  gsap.utils.toArray('.company-mv-card').forEach((card, i) => {
    gsap.to(card, {
      opacity: 1, y: 0, duration: 1, delay: i * 0.15, ease: smoothEase,
      scrollTrigger: { trigger: card, start: 'top 85%', once: true }
    });
  });

  gsap.utils.toArray('.founder-card').forEach((card, i) => {
    gsap.to(card, {
      opacity: 1, y: 0, duration: 0.8, delay: i * 0.12, ease: smoothEase,
      scrollTrigger: { trigger: card, start: 'top 88%', once: true }
    });
  });

  // =======================================
  // Drift flow steps — stagger reveal
  // =======================================
  const flowSteps = gsap.utils.toArray('.drift-flow-step');
  if (flowSteps.length) {
    ScrollTrigger.batch(flowSteps, {
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: smoothEase
        });
      },
      start: 'top 88%',
      once: true
    });
  }

  // =======================================
  // Fade-up generic
  // =======================================
  gsap.utils.toArray('.fade-up').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: smoothEase,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true
      }
    });
  });

  // =======================================
  // Closing text — slow dramatic fade
  // =======================================
  const closingText = document.querySelector('.closing-text');
  if (closingText) {
    gsap.to(closingText, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: smoothEase,
      scrollTrigger: {
        trigger: closingText,
        start: 'top 80%',
        once: true
      }
    });
  }

  // =======================================
  // Closing blobs — parallax
  // =======================================
  gsap.utils.toArray('.closing-blob').forEach((blob, i) => {
    gsap.to(blob, {
      y: -40 - (i * 20),
      scrollTrigger: {
        trigger: '.closing',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2
      }
    });
  });

  // =======================================
  // Image row — parallax zoom
  // =======================================
  gsap.utils.toArray('.img-cell img').forEach(img => {
    gsap.fromTo(img,
      { scale: 1.2 },
      {
        scale: 1,
        scrollTrigger: {
          trigger: img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      }
    );
  });

  // =======================================
  // Drift intro — text reveal
  // =======================================
  const driftLogo = document.querySelector('.drift-logo');
  const driftTagline = document.querySelector('.drift-tagline');
  const driftDesc = document.querySelector('.drift-description');

  if (driftLogo) {
    const driftTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.drift-intro',
        start: 'top 80%',
        once: true
      }
    });

    driftTl.fromTo(driftLogo,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, ease: premiumEase }
    );

    if (driftTagline) {
      driftTl.fromTo(driftTagline,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 1, ease: smoothEase },
        '-=0.3'
      );
    }

    if (driftDesc) {
      driftTl.fromTo(driftDesc,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: premiumEase },
        '-=0.5'
      );
    }
  }

  // =======================================
  // Philosophy heading
  // =======================================
  const philHeading = document.querySelector('.philosophy-heading');
  if (philHeading) {
    gsap.fromTo(philHeading,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: smoothEase,
        scrollTrigger: {
          trigger: philHeading,
          start: 'top 85%',
          once: true
        }
      }
    );
  }
}

/* --- Fallback (no GSAP) --- */
function initFallbackAnimations() {
  const targets = document.querySelectorAll(
    '.fade-up, .fade-in, .philosophy-item, .vm-item, .closing-text, .concept-text, .bento-card, .stat-card, .home-card, .page-hero-label, .page-hero-title, .page-hero-sub, .drift-hero-name, .drift-hero-tagline, .drift-hero-desc, .drift-kpi, .company-mv-card, .founder-card, .drift-flow-step'
  );

  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
        entry.target.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  targets.forEach(el => observer.observe(el));

  // Hero elements
  setTimeout(() => {
    document.querySelectorAll('.hero-eyebrow, .hero-subtitle, .hero-ctas').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  }, 500);
}
