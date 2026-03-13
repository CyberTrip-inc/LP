/* ============================================
   CyberTrip — Premium Animation Toolkit
   Vanilla JS + GSAP + CSS — No frameworks
   Total: ~8KB minified (excluding GSAP CDN)

   Techniques inspired by:
   Linear.app, Stripe, Apple, Vercel, Raycast

   IMPORTANT: Load GSAP + ScrollTrigger before this.
   ============================================ */

(function () {
  'use strict';

  // Bail entirely if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Wait for GSAP to be available
  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  onReady(function () {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('[premium-animations] GSAP or ScrollTrigger not loaded.');
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    initPageCurtain();
    initScrollProgress();
    initCursorGlow();
    initLenisSmooth();
    initSplitText();
    initHorizontalScroll();
    initMagneticButtons();
    initParallax();
    initStaggeredGrid();
    initCounterAnimation();
    initSectionTransitions();
    initTextHighlight();
    initTiltCards();
    initButtonRipple();
    // Gradient beam is CSS-only — no JS init needed
  });


  /* ============================================
     0a. PAGE LOAD CURTAIN
     ============================================ */
  function initPageCurtain() {
    var curtain = document.getElementById('pageCurtain');
    if (!curtain) return;

    // Reveal after a short delay for the logo to show
    setTimeout(function () {
      curtain.classList.add('revealed');
    }, 600);

    // Remove from DOM after animation
    curtain.addEventListener('animationend', function () {
      curtain.style.display = 'none';
    });
  }


  /* ============================================
     0b. SCROLL PROGRESS BAR
     ============================================ */
  function initScrollProgress() {
    var bar = document.getElementById('scrollProgress');
    if (!bar) return;

    var ticking = false;
    function updateProgress() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
  }


  /* ============================================
     0c. CURSOR GLOW FOLLOWER
     ============================================ */
  function initCursorGlow() {
    // Only on desktop
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.innerWidth < 768) return;

    var glow = document.getElementById('cursorGlow');
    if (!glow) return;

    var mouseX = 0, mouseY = 0;
    var glowX = 0, glowY = 0;
    var active = false;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!active) {
        active = true;
        glow.classList.add('active');
      }
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      active = false;
      glow.classList.remove('active');
    });

    // Smooth follow with lerp
    function animate() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
      requestAnimationFrame(animate);
    }
    animate();
  }


  /* ============================================
     1. LENIS SMOOTH SCROLL (CDN version)
     ============================================
     Adds buttery smooth momentum scrolling.
     Uses the Lenis CDN (loaded in <head>).
     If Lenis is not loaded, falls back to native.
  */
  function initLenisSmooth() {
    // Lenis must be loaded from CDN in the HTML:
    // <script src="https://unpkg.com/lenis@1/dist/lenis.min.js"></script>
    if (typeof Lenis === 'undefined') {
      console.info('[premium-animations] Lenis not loaded — using native scroll.');
      return;
    }

    var lenis = new Lenis({
      duration: 1.2,           // scroll duration (lower = snappier)
      easing: function (t) {   // custom easing
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Store reference for external access
    window.__lenis = lenis;
  }


  /* ============================================
     2. SPLIT TEXT (free alternative to GSAP SplitText)
     ============================================
     Wraps each word (and optionally each char)
     in <span> elements for animation.

     Usage in HTML:
       <h2 class="split-words" data-split="words">Your headline here</h2>
       <h2 class="split-chars" data-split="chars">Character split</h2>

     After splitting, animate .word or .char spans.
  */
  function splitTextIntoWords(el) {
    var text = el.textContent;
    var words = text.split(/(\s+)/);
    el.innerHTML = '';
    el.setAttribute('aria-label', text);

    words.forEach(function (word) {
      if (/^\s+$/.test(word)) {
        // Preserve whitespace
        el.appendChild(document.createTextNode(word));
        return;
      }
      var wrapper = document.createElement('span');
      wrapper.className = 'word';
      wrapper.style.display = 'inline-block';
      wrapper.style.overflow = 'hidden';
      wrapper.style.verticalAlign = 'top';

      var inner = document.createElement('span');
      inner.className = 'word-inner';
      inner.style.display = 'inline-block';
      inner.textContent = word;

      wrapper.appendChild(inner);
      el.appendChild(wrapper);
    });

    return el.querySelectorAll('.word-inner');
  }

  function splitTextIntoChars(el) {
    var text = el.textContent;
    var chars = text.split('');
    el.innerHTML = '';
    el.setAttribute('aria-label', text);

    chars.forEach(function (char) {
      if (char === ' ') {
        el.appendChild(document.createTextNode(' '));
        return;
      }
      var span = document.createElement('span');
      span.className = 'char';
      span.style.display = 'inline-block';
      span.textContent = char;
      el.appendChild(span);
    });

    return el.querySelectorAll('.char');
  }

  function initSplitText() {
    // Split words
    document.querySelectorAll('[data-split="words"]').forEach(function (el) {
      var wordInners = splitTextIntoWords(el);
      gsap.set(wordInners, { y: '110%' });

      gsap.to(wordInners, {
        y: '0%',
        duration: 0.8,
        stagger: 0.04,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        }
      });
    });

    // Split chars
    document.querySelectorAll('[data-split="chars"]').forEach(function (el) {
      var chars = splitTextIntoChars(el);
      gsap.set(chars, { opacity: 0, y: 20 });

      gsap.to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.02,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        }
      });
    });
  }

  // Expose globally for manual use
  window.splitTextIntoWords = splitTextIntoWords;
  window.splitTextIntoChars = splitTextIntoChars;


  /* ============================================
     3. HORIZONTAL SCROLL SECTION
     ============================================
     Pin a section and scroll its content
     horizontally as the user scrolls down.

     Usage in HTML:
       <section class="horizontal-scroll-section">
         <div class="horizontal-scroll-track">
           <div class="horizontal-panel">Panel 1</div>
           <div class="horizontal-panel">Panel 2</div>
           <div class="horizontal-panel">Panel 3</div>
           <div class="horizontal-panel">Panel 4</div>
         </div>
       </section>
  */
  function initHorizontalScroll() {
    var sections = document.querySelectorAll('.horizontal-scroll-section');
    if (!sections.length) return;

    sections.forEach(function (section) {
      var track = section.querySelector('.horizontal-scroll-track');
      if (!track) return;

      var panels = track.querySelectorAll('.horizontal-panel');
      if (!panels.length) return;

      // Calculate how far to scroll
      var getScrollAmount = function () {
        return -(track.scrollWidth - window.innerWidth);
      };

      gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: function () {
            return '+=' + (track.scrollWidth - window.innerWidth);
          },
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1
        }
      });

      // Optional: stagger-reveal each panel
      panels.forEach(function (panel, i) {
        gsap.fromTo(panel,
          { opacity: 0.3, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            scrollTrigger: {
              trigger: panel,
              containerAnimation: null, // uses parent
              start: 'left 80%',
              end: 'left 30%',
              scrub: true
            }
          }
        );
      });
    });
  }


  /* ============================================
     4. MAGNETIC BUTTON EFFECT
     ============================================
     Button follows cursor slightly on hover,
     snaps back on mouse leave.

     Usage in HTML:
       <button class="magnetic-btn btn-pill btn-pill--accent">
         <span class="magnetic-btn-text">Get Started</span>
       </button>
  */
  function initMagneticButtons() {
    var buttons = document.querySelectorAll('.magnetic-btn');
    if (!buttons.length) return;

    var strength = 0.3; // 0-1, how far button moves toward cursor

    buttons.forEach(function (btn) {
      var textEl = btn.querySelector('.magnetic-btn-text') || btn;

      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;

        var deltaX = (e.clientX - centerX) * strength;
        var deltaY = (e.clientY - centerY) * strength;

        gsap.to(btn, {
          x: deltaX,
          y: deltaY,
          duration: 0.3,
          ease: 'power2.out'
        });

        // Inner text moves a bit more for parallax feel
        gsap.to(textEl, {
          x: deltaX * 0.3,
          y: deltaY * 0.3,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      btn.addEventListener('mouseleave', function () {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.4)'
        });
        gsap.to(textEl, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.4)'
        });
      });
    });
  }


  /* ============================================
     5. PARALLAX TEXT / IMAGE ON SCROLL
     ============================================
     Elements with data-parallax move at a
     different rate than the scroll.

     Usage in HTML:
       <div data-parallax="-100">Moves up 100px</div>
       <img data-parallax="80" src="..." alt="...">
       <h2 data-parallax="-50">Slower heading</h2>
  */
  function initParallax() {
    var elements = document.querySelectorAll('[data-parallax]');
    if (!elements.length) return;

    elements.forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-parallax')) || -50;

      gsap.to(el, {
        y: speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });
  }


  /* ============================================
     6. STAGGERED GRID REVEAL (Scale + Opacity)
     ============================================
     Grid items scale up from 0.85 and fade in
     with staggered timing.

     Usage in HTML:
       <div class="stagger-grid">
         <div class="stagger-grid-item">Item 1</div>
         <div class="stagger-grid-item">Item 2</div>
         ...
       </div>
  */
  function initStaggeredGrid() {
    var grids = document.querySelectorAll('.stagger-grid');
    if (!grids.length) return;

    grids.forEach(function (grid) {
      var items = grid.querySelectorAll('.stagger-grid-item');
      if (!items.length) return;

      gsap.set(items, {
        opacity: 0,
        scale: 0.85,
        y: 30
      });

      ScrollTrigger.batch(items, {
        onEnter: function (batch) {
          gsap.to(batch, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
            overwrite: true
          });
        },
        start: 'top 90%',
        once: true
      });
    });
  }


  /* ============================================
     8. COUNTER ANIMATION (Count up when in view)
     ============================================
     Numbers count from 0 to their target value
     when scrolled into view.

     Usage in HTML:
       <span class="counter" data-target="5000">0</span>
       <span class="counter" data-target="98.5" data-decimals="1">0</span>
       <span class="counter" data-target="200" data-prefix="$" data-suffix="+">0</span>
  */
  function initCounterAnimation() {
    var counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    counters.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-target')) || 0;
      var decimals = parseInt(el.getAttribute('data-decimals')) || 0;
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = parseFloat(el.getAttribute('data-duration')) || 2;

      var obj = { value: 0 };

      gsap.to(obj, {
        value: target,
        duration: duration,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        },
        onUpdate: function () {
          el.textContent = prefix + obj.value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
        }
      });
    });
  }


  /* ============================================
     9. SMOOTH SECTION TRANSITIONS (Dark/Light)
     ============================================
     Changes header and body theme as sections
     scroll into view. Creates a smooth crossfade
     between dark and light sections.

     Usage in HTML:
       <section class="section section--dark" data-theme="dark">...</section>
       <section class="section section--light" data-theme="light">...</section>
  */
  function initSectionTransitions() {
    var themedSections = document.querySelectorAll('[data-theme]');
    if (!themedSections.length) return;

    var body = document.body;

    themedSections.forEach(function (section) {
      var theme = section.getAttribute('data-theme');

      ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: function () { body.setAttribute('data-active-theme', theme); },
        onEnterBack: function () { body.setAttribute('data-active-theme', theme); }
      });
    });
  }


  /* ============================================
     10. TEXT HIGHLIGHT ON SCROLL (Apple-style)
     ============================================
     Text starts dim and each word/line becomes
     fully visible as the user scrolls past it.

     Usage in HTML:
       <p class="text-highlight-scroll">
         Your long paragraph text here that will
         gradually highlight as the user scrolls...
       </p>
  */
  function initTextHighlight() {
    var elements = document.querySelectorAll('.text-highlight-scroll');
    if (!elements.length) return;

    elements.forEach(function (el) {
      // Split into words
      var text = el.textContent;
      var words = text.split(/(\s+)/);
      el.innerHTML = '';
      el.setAttribute('aria-label', text);

      var wordSpans = [];
      words.forEach(function (word) {
        if (/^\s+$/.test(word)) {
          el.appendChild(document.createTextNode(word));
          return;
        }
        var span = document.createElement('span');
        span.className = 'highlight-word';
        span.textContent = word;
        el.appendChild(span);
        wordSpans.push(span);
      });

      // Animate each word's opacity based on scroll position
      wordSpans.forEach(function (span, i) {
        gsap.fromTo(span,
          { opacity: 0.15 },
          {
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: function () {
                var progress = i / wordSpans.length;
                return 'top+=' + (progress * el.offsetHeight * 0.8) + ' 70%';
              },
              end: function () {
                var progress = (i + 1) / wordSpans.length;
                return 'top+=' + (progress * el.offsetHeight * 0.8) + ' 70%';
              },
              scrub: 0.5
            }
          }
        );
      });
    });
  }

  /* ============================================
     11. 3D TILT CARD EFFECT
     ============================================
     Adds a subtle 3D perspective tilt on hover.
     Cards follow the cursor and spring back.

     Usage in HTML:
       <div class="tilt-card">...</div>
  */
  function initTiltCards() {
    // Only on desktop
    if (window.matchMedia('(hover: none)').matches) return;

    var cards = document.querySelectorAll('.tilt-card');
    if (!cards.length) return;

    var maxTilt = 8; // degrees

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;

        var tiltX = (maxTilt / 2 - y * maxTilt).toFixed(2);
        var tiltY = (x * maxTilt - maxTilt / 2).toFixed(2);

        card.style.transform = 'perspective(1000px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) translateY(-4px)';

        // Update CSS custom properties for glow position
        card.style.setProperty('--mouse-x', (x * 100).toFixed(0) + '%');
        card.style.setProperty('--mouse-y', (y * 100).toFixed(0) + '%');
      });

      card.addEventListener('mouseleave', function () {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)',
          clearProps: 'transform'
        });
      });
    });
  }

  /* ============================================
     12. BUTTON RIPPLE POSITION TRACKING
     ============================================ */
  function initButtonRipple() {
    var buttons = document.querySelectorAll('.btn-pill');
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width * 100).toFixed(0);
        var y = ((e.clientY - rect.top) / rect.height * 100).toFixed(0);
        btn.style.setProperty('--ripple-x', x + '%');
        btn.style.setProperty('--ripple-y', y + '%');
      });
    });
  }

})();
