/* ============================================================
   karimsangid.is-a.dev — Portfolio Script
   Animations run only while visible, stop when idle, and respect
   prefers-reduced-motion.
   ============================================================ */

(function () {
  'use strict';

  var root = document.documentElement;
  var mq = function (q) { return window.matchMedia ? window.matchMedia(q).matches : false; };
  var reduceMotion = mq('(prefers-reduced-motion: reduce)');
  var finePointer = mq('(hover: hover) and (pointer: fine)');
  var raf = window.requestAnimationFrame.bind(window);

  // Runs cb(true/false) as el enters/leaves the viewport.
  function watchVisibility(el, cb, opts) {
    if (!el || !('IntersectionObserver' in window)) { if (el) cb(true); return; }
    new IntersectionObserver(function (entries) {
      cb(entries[entries.length - 1].isIntersecting);
    }, opts || { threshold: 0 }).observe(el);
  }

  // ============================================================
  // CUSTOM CURSOR (fine pointers only; the system cursor is hidden
  // only while html.has-custom-cursor is set)
  // ============================================================
  var dot = document.getElementById('cursorDot');
  var ring = document.getElementById('cursorRing');

  if (finePointer && !reduceMotion && dot && ring) {
    root.classList.add('has-custom-cursor');
    var mx = -100, my = -100, rx = -100, ry = -100, ringRaf = 0;
    var place = function (el, x, y) {
      el.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) translate(-50%,-50%)';
    };
    var ringStep = function () {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      if (Math.abs(mx - rx) < 0.1 && Math.abs(my - ry) < 0.1) { rx = mx; ry = my; ringRaf = 0; }
      else { ringRaf = raf(ringStep); }
      place(ring, rx, ry);
    };

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      place(dot, mx, my);
      if (!ringRaf) ringRaf = raf(ringStep);
    }, { passive: true });

    var interactiveSelector = 'a, button, .project-card-inner, .skill-pill, .cert-item, .contact-email, .social-link, .vis-flashcard';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(interactiveSelector)) {
        ring.classList.add('hover');
        dot.classList.add('hover');
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(interactiveSelector)) {
        ring.classList.remove('hover');
        dot.classList.remove('hover');
      }
    });
    document.addEventListener('mouseleave', function () {
      dot.classList.add('hidden');
      ring.classList.add('hidden');
    });
    document.addEventListener('mouseenter', function () {
      dot.classList.remove('hidden');
      ring.classList.remove('hidden');
    });
  }

  // ============================================================
  // NAVIGATION
  // ============================================================
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  function setMenu(open) {
    navToggle.classList.toggle('active', open);
    navLinks.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (nav && navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      setMenu(!navLinks.classList.contains('open'));
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        setMenu(false);
        navToggle.focus();
      }
    });
    // Close the open menu when keyboard focus moves out of it
    navLinks.addEventListener('focusout', function (e) {
      if (navLinks.classList.contains('open') && e.relatedTarget &&
          !navLinks.contains(e.relatedTarget) && e.relatedTarget !== navToggle) {
        setMenu(false);
      }
    });
  }

  // Active link highlighting: a 1px observer band 200px below the top
  // of the viewport (same rule as before, without per-scroll layout reads).
  var sections = document.querySelectorAll('section[id]');
  var navAnchors = navLinks ? navLinks.querySelectorAll('a[href^="#"]') : [];
  var sectionObserver = null;

  function setActive(id) {
    for (var i = 0; i < navAnchors.length; i++) {
      navAnchors[i].classList.toggle('active', navAnchors[i].getAttribute('href') === '#' + id);
    }
  }

  function observeSections() {
    if (!('IntersectionObserver' in window) || !sections.length) return;
    if (sectionObserver) sectionObserver.disconnect();
    var bottom = Math.max(0, window.innerHeight - 201);
    sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-200px 0px -' + bottom + 'px 0px', threshold: 0 });
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }
  // Set up when the main thread is idle, after first layout, so reading
  // innerHeight forces no extra reflow inside the first frame.
  if ('requestIdleCallback' in window) window.requestIdleCallback(observeSections, { timeout: 1000 });
  else setTimeout(observeSections, 200);

  // ============================================================
  // SCROLL: one rAF-throttled handler
  // ============================================================
  var heroContent = document.querySelector('.hero-content');
  var scrollQueued = false;

  function onScrollFrame() {
    scrollQueued = false;
    var y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 80);
    if (heroContent && !reduceMotion) {
      var vh = window.innerHeight;
      if (y < vh * 1.5) {
        heroContent.style.transform = y > 0 ? 'translateY(' + (y * 0.2) + 'px)' : '';
        heroContent.style.opacity = Math.max(0, 1 - y / (vh * 0.8));
      }
    }
  }
  window.addEventListener('scroll', function () {
    if (!scrollQueued) { scrollQueued = true; raf(onScrollFrame); }
  }, { passive: true });
  // Initial state (e.g. a reload mid-page) once the main thread is idle,
  // so reading scrollY does not force a layout inside the startup task.
  if ('requestIdleCallback' in window) window.requestIdleCallback(onScrollFrame, { timeout: 300 });
  else setTimeout(onScrollFrame, 100);

  var resizeTimer = 0;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(observeSections, 200);
  });

  // ============================================================
  // SCROLL REVEAL (runs once per element)
  // ============================================================
  var revealElements = document.querySelectorAll('.scroll-reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(function (el) { el.classList.add('revealed'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealElements.forEach(function (el) { revealObserver.observe(el); });
  }

  // ============================================================
  // COUNTER ANIMATION (once)
  // ============================================================
  var statNumbers = document.querySelectorAll('.stat-number[data-target]');

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var duration = 2000;
    var start = null;
    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) {
        raf(step);
      } else {
        el.textContent = target.toLocaleString();
        el.classList.add('counted');
      }
    }
    raf(step);
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    statNumbers.forEach(function (el) {
      el.textContent = parseInt(el.getAttribute('data-target'), 10).toLocaleString();
    });
  } else {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(function (el) { counterObserver.observe(el); });
  }

  // ============================================================
  // SMOOTH SCROLL (the skip link keeps native behavior so focus moves)
  // ============================================================
  document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var offset = parseInt(getComputedStyle(root).scrollPaddingTop, 10) || 72;
        var top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
        window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        if (history.replaceState) history.replaceState(null, '', href);
      }
    });
  });

  // ============================================================
  // MAGNETIC CONTACT LINKS: spring runs only until it settles
  // ============================================================
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.contact-email, .social-link').forEach(function (el) {
      var bx = 0, by = 0, tx = 0, ty = 0, id = 0;
      function step() {
        bx += (tx - bx) * 0.15;
        by += (ty - by) * 0.15;
        if (Math.abs(tx - bx) < 0.05 && Math.abs(ty - by) < 0.05) {
          bx = tx; by = ty; id = 0;
        } else {
          id = raf(step);
        }
        el.style.transform = (bx || by) ? 'translate(' + bx + 'px, ' + by + 'px)' : '';
      }
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        tx = (e.clientX - rect.left - rect.width / 2) * 0.35;
        ty = (e.clientY - rect.top - rect.height / 2) * 0.35;
        if (!id) id = raf(step);
      });
      el.addEventListener('mouseleave', function () {
        tx = 0; ty = 0;
        if (!id) id = raf(step);
      });
    });
  }

  // ============================================================
  // HERO PARTICLE CONSTELLATION — CANVAS
  // Paused when off-screen or the tab is hidden; drawn at 1x (as the
  // site always has) so HiDPI screens do not pay 3-4x the pixels;
  // glows drawn from cached sprites.
  // ============================================================
  var heroCanvas = document.getElementById('heroCanvas');
  if (heroCanvas && heroCanvas.getContext) {
    var ctx = heroCanvas.getContext('2d');
    var particles = [];
    var particleCount = finePointer ? 120 : 60;
    var connectionDist = 160;
    var connectionDist2 = connectionDist * connectionDist;
    var pmx = -1000, pmy = -1000;
    var mouseRadius = 250;
    var time = 0;
    var cw = 0, ch = 0;
    var heroVisible = true, heroRunning = false;
    var colors = ['68, 68, 255', '255, 68, 68', '255, 68, 170'];
    var sprites = {};

    colors.forEach(function (c) {
      var s = document.createElement('canvas');
      s.width = s.height = 64;
      var sc = s.getContext('2d');
      var g = sc.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, 'rgba(' + c + ', 1)');
      g.addColorStop(1, 'rgba(' + c + ', 0)');
      sc.fillStyle = g;
      sc.fillRect(0, 0, 64, 64);
      sprites[c] = s;
    });

    function resizeCanvas() {
      var dpr = 1;
      cw = window.innerWidth;
      ch = window.innerHeight;
      heroCanvas.width = Math.round(cw * dpr);
      heroCanvas.height = Math.round(ch * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function seedParticles() {
    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * cw,
        y: Math.random() * ch,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 1 + Math.random() * 2,
        baseAlpha: 0.3 + Math.random() * 0.5,
        pulse: Math.random() * Math.PI * 2,
        color: Math.random() > 0.8 ? colors[0] : Math.random() > 0.5 ? colors[1] : colors[2]
      });
    }
    }

    function drawParticles(animate) {
      if (animate) time += 0.01;
      ctx.clearRect(0, 0, cw, ch);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var dx = p.x - pmx;
        var dy = p.y - pmy;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (animate) {
          // Mouse: close = repel, medium = attract
          if (dist < mouseRadius * 0.4 && dist > 0) {
            var force = (mouseRadius * 0.4 - dist) / (mouseRadius * 0.4);
            p.vx += (dx / dist) * force * 1.2;
            p.vy += (dy / dist) * force * 1.2;
          } else if (dist < mouseRadius && dist > 0) {
            var attract = (mouseRadius - dist) / mouseRadius * 0.15;
            p.vx -= (dx / dist) * attract;
            p.vy -= (dy / dist) * attract;
          }
          p.vx *= 0.97;
          p.vy *= 0.97;
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = cw;
          if (p.x > cw) p.x = 0;
          if (p.y < 0) p.y = ch;
          if (p.y > ch) p.y = 0;
        }

        var pulseAlpha = p.baseAlpha + Math.sin(time * 2 + p.pulse) * 0.2;
        var pulseR = p.r + Math.sin(time * 3 + p.pulse) * 0.5;

        // Glow (cached radial sprite)
        var gr = pulseR * 4;
        ctx.globalAlpha = Math.max(0, pulseAlpha * 0.3);
        ctx.drawImage(sprites[p.color], p.x - gr, p.y - gr, gr * 2, gr * 2);
        ctx.globalAlpha = 1;

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulseR, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.color + ', ' + pulseAlpha + ')';
        ctx.fill();

        // Connections
        for (var j = i + 1; j < particles.length; j++) {
          var p2 = particles[j];
          var cdx = p.x - p2.x;
          var cdy = p.y - p2.y;
          var cd2 = cdx * cdx + cdy * cdy;
          if (cd2 < connectionDist2) {
            var alpha = (1 - Math.sqrt(cd2) / connectionDist) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(' + p.color + ', ' + alpha + ')';
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Mouse connections
        if (dist < mouseRadius * 1.5 && dist > 0) {
          var mAlpha = (1 - dist / (mouseRadius * 1.5)) * 0.35;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pmx, pmy);
          ctx.strokeStyle = 'rgba(255, 68, 68, ' + mAlpha + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Mouse node glow + crosshair
      if (pmx > 0 && pmy > 0 && pmx < cw && pmy < ch) {
        var grad = ctx.createRadialGradient(pmx, pmy, 0, pmx, pmy, 100);
        grad.addColorStop(0, 'rgba(255, 68, 68, 0.12)');
        grad.addColorStop(0.5, 'rgba(255, 68, 68, 0.04)');
        grad.addColorStop(1, 'rgba(255, 68, 68, 0)');
        ctx.beginPath();
        ctx.arc(pmx, pmy, 100, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 68, 68, 0.08)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(pmx - 20, pmy);
        ctx.lineTo(pmx + 20, pmy);
        ctx.moveTo(pmx, pmy - 20);
        ctx.lineTo(pmx, pmy + 20);
        ctx.stroke();
      }
    }

    function particleFrame() {
      if (!heroRunning) return;
      drawParticles(true);
      raf(particleFrame);
    }
    function updateParticleLoop() {
      var shouldRun = heroVisible && !document.hidden && !reduceMotion;
      if (shouldRun && !heroRunning) { heroRunning = true; raf(particleFrame); }
      else if (!shouldRun) { heroRunning = false; }
    }

    // Size and seed on the first frame, so reading the viewport size
    // lines up with the browser's own layout instead of forcing one.
    raf(function () {
      resizeCanvas();
      seedParticles();
      if (reduceMotion) {
        drawParticles(false); // one static frame, drawn after first paint
      } else {
        document.addEventListener('mousemove', function (e) {
          pmx = e.clientX;
          pmy = e.clientY;
        }, { passive: true });
        watchVisibility(heroCanvas, function (v) { heroVisible = v; updateParticleLoop(); });
        document.addEventListener('visibilitychange', updateParticleLoop);
        updateParticleLoop();
      }
    });

    var canvasResizeQueued = false;
    window.addEventListener('resize', function () {
      if (canvasResizeQueued) return;
      canvasResizeQueued = true;
      raf(function () {
        canvasResizeQueued = false;
        resizeCanvas();
        if (!heroRunning) drawParticles(false);
      });
    });
  }

  // ============================================================
  // CARD SPOTLIGHT + 3D TILT (fine pointers)
  // ============================================================
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.project-card-inner').forEach(function (card) {
      var spotlight = card.querySelector('.card-spotlight');
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        if (spotlight) {
          spotlight.style.opacity = '1';
          spotlight.style.background = 'radial-gradient(600px circle at ' + x + 'px ' + y + 'px, rgba(255, 68, 68, 0.06), transparent 40%)';
        }
        var rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -4;
        var rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 4;
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.01)';
      });
      card.addEventListener('mouseenter', function () {
        card.style.transition = 'transform 0.1s ease';
      });
      card.addEventListener('mouseleave', function () {
        if (spotlight) spotlight.style.opacity = '0';
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        card.style.transition = 'transform 0.6s cubic-bezier(0.33, 1, 0.68, 1)';
      });
    });
  } else {
    document.querySelectorAll('.card-spotlight').forEach(function (s) { s.style.display = 'none'; });
  }

  // ============================================================
  // TEXT SCRAMBLE — project names and section titles (once each)
  // ============================================================
  var scrambleChars = '!@#$%^&*()_+-=[]{}|;\':",./<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  function scrambleText(el) {
    var original = el.getAttribute('data-original');
    var length = original.length;
    var duration = 600;
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var result = '';
      for (var i = 0; i < length; i++) {
        if (original[i] === ' ' || original[i] === '.') {
          result += original[i];
          continue;
        }
        if (progress > (i / length) * 0.7 + 0.3) {
          result += original[i];
        } else {
          result += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }
      }
      el.textContent = result;
      if (progress < 1) raf(step);
      else el.textContent = original;
    }
    raf(step);
  }

  function scrambleOnce(selector, threshold) {
    var els = document.querySelectorAll(selector);
    if (reduceMotion || !els.length || !('IntersectionObserver' in window)) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          scrambleText(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: threshold });
    els.forEach(function (el) {
      el.setAttribute('data-original', el.textContent);
      obs.observe(el);
    });
  }
  scrambleOnce('.project-name', 0.5);
  scrambleOnce('.section-title .word', 0.8);

  // ============================================================
  // TYPING EFFECT ON ABOUT BIO (height reserved so nothing below moves)
  // ============================================================
  var bioParagraph = document.querySelector('.about-bio p');
  if (bioParagraph && !reduceMotion && 'IntersectionObserver' in window) {
    var bioOriginalText = bioParagraph.textContent;
    var bioObserver = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      bioObserver.disconnect();
      typeBio(bioParagraph, bioOriginalText);
    }, { threshold: 0.3 });
    bioObserver.observe(bioParagraph);
  }

  function typeBio(el, text) {
    el.style.minHeight = el.offsetHeight + 'px';
    el.textContent = '';
    // Screen readers get the full text at once; the typed copy is hidden from them.
    var srCopy = document.createElement('span');
    srCopy.className = 'sr-only';
    srCopy.textContent = text;
    var visible = document.createElement('span');
    visible.setAttribute('aria-hidden', 'true');
    var typed = document.createTextNode('');
    var cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    visible.appendChild(typed);
    el.appendChild(srCopy);
    el.appendChild(visible);
    el.appendChild(cursor);
    var ci = 0;
    function typeNext() {
      if (ci < text.length) {
        typed.data += text[ci++];
        setTimeout(typeNext, 12);
      } else {
        el.textContent = text;
        el.appendChild(cursor);
        el.style.minHeight = '';
        setTimeout(function () {
          if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
        }, 2000);
      }
    }
    typeNext();
  }

  // ============================================================
  // 3D WIREFRAME HOUSE — CANVAS (All Service Leads), runs while visible
  // ============================================================
  var houseCanvas = document.getElementById('houseCanvas');
  if (houseCanvas && houseCanvas.getContext) {
    var hCtx = houseCanvas.getContext('2d');
    var hAngle = 0;

    var houseVerts = [
      [-40, 30, -30], [40, 30, -30], [40, 30, 30], [-40, 30, 30],      // body bottom (0-3)
      [-40, -30, -30], [40, -30, -30], [40, -30, 30], [-40, -30, 30],  // body top (4-7)
      [-45, -60, 0], [45, -60, 0],                                     // roof ridge (8-9)
      [-45, -30, 35], [45, -30, 35],                                   // overhang front (10-11)
      [-45, -30, -35], [45, -30, -35],                                 // overhang back (12-13)
      [5, 30, 30.5], [18, 30, 30.5], [18, 5, 30.5], [5, 5, 30.5],      // door (14-17)
      [-30, -15, 30.5], [-15, -15, 30.5], [-15, 0, 30.5], [-30, 0, 30.5], // window left (18-21)
      [25, -15, 30.5], [35, -15, 30.5], [35, 0, 30.5], [25, 0, 30.5]   // window right (22-25)
    ];
    var bodyEdges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
    var roofEdges = [[8,9],[8,10],[9,11],[10,11],[8,12],[9,13],[12,13]];
    var doorEdges = [[14,15],[15,16],[16,17],[17,14]];
    var win1Edges = [[18,19],[19,20],[20,21],[21,18]];
    var win2Edges = [[22,23],[23,24],[24,25],[25,22]];
    var tiltCos = Math.cos(-0.3), tiltSin = Math.sin(-0.3);

    var project3D = function (x, y, z, angle) {
      var cosA = Math.cos(angle), sinA = Math.sin(angle);
      var rx = x * cosA - z * sinA;
      var rz = x * sinA + z * cosA;
      var ry = y * tiltCos - rz * tiltSin;
      var rz2 = y * tiltSin + rz * tiltCos;
      var scale = 600 / (600 + rz2 + 200);
      return { x: 250 + rx * scale * 2.0, y: 210 + ry * scale * 2.0, depth: rz2 };
    };

    var drawEdges = function (edges, color, lineWidth) {
      hCtx.strokeStyle = color;
      hCtx.lineWidth = lineWidth || 1;
      hCtx.beginPath();
      for (var i = 0; i < edges.length; i++) {
        var a = houseVerts[edges[i][0]];
        var b = houseVerts[edges[i][1]];
        var pa = project3D(a[0], a[1], a[2], hAngle);
        var pb = project3D(b[0], b[1], b[2], hAngle);
        hCtx.moveTo(pa.x, pa.y);
        hCtx.lineTo(pb.x, pb.y);
      }
      hCtx.stroke();
    };

    var windowGlow = function (x, y, z) {
      var w = project3D(x, y, z, hAngle);
      if (w.depth >= 100) return;
      var g = hCtx.createRadialGradient(w.x, w.y, 0, w.x, w.y, 8);
      g.addColorStop(0, 'rgba(255, 200, 100, 0.08)');
      g.addColorStop(1, 'rgba(255, 200, 100, 0)');
      hCtx.beginPath();
      hCtx.arc(w.x, w.y, 8, 0, Math.PI * 2);
      hCtx.fillStyle = g;
      hCtx.fill();
    };

    var drawHouse = function () {
      hCtx.clearRect(0, 0, 500, 450);
      hCtx.beginPath();
      hCtx.ellipse(250, 340, 90, 14, 0, 0, Math.PI * 2);
      hCtx.fillStyle = 'rgba(255, 68, 68, 0.06)';
      hCtx.fill();
      drawEdges(bodyEdges, 'rgba(255, 68, 68, 0.25)', 1);
      drawEdges(roofEdges, 'rgba(255, 68, 68, 0.4)', 1.5);
      drawEdges(doorEdges, 'rgba(255, 68, 68, 0.3)', 1);
      drawEdges(win1Edges, 'rgba(255, 200, 100, 0.3)', 1);
      drawEdges(win2Edges, 'rgba(255, 200, 100, 0.3)', 1);
      windowGlow(-22.5, -7.5, 30.5);
      windowGlow(30, -7.5, 30.5);
    };

    if (reduceMotion) {
      hAngle = 0.6;
      drawHouse();
    } else {
      var houseVisible = false, houseRunning = false;
      var houseFrame = function () {
        if (!houseRunning) return;
        hAngle += 0.008;
        drawHouse();
        raf(houseFrame);
      };
      var updateHouse = function () {
        var run = houseVisible && !document.hidden;
        if (run && !houseRunning) { houseRunning = true; raf(houseFrame); }
        else if (!run) { houseRunning = false; }
      };
      watchVisibility(houseCanvas, function (v) { houseVisible = v; updateHouse(); });
      document.addEventListener('visibilitychange', updateHouse);
    }
  }

  // ============================================================
  // TERMINAL TYPING (GPU inference gateway), runs while visible
  // ============================================================
  var cmdTyped = document.querySelector('.vis-cmd-typed');
  var cmdEl = document.querySelector('.vis-cmd');
  if (cmdTyped && cmdEl) {
    var commands = ['GET /v1/models', 'POST /v1/embeddings', 'POST /v1/audio/speech', 'POST /v1/chat/completions stream=true'];
    if (reduceMotion) {
      cmdTyped.textContent = commands[commands.length - 1];
    } else {
      var cmdIdx = 0, charIdx = 0, typing = true, cmdVisible = false, cmdTimer = 0;
      var schedule = function (ms) { cmdTimer = setTimeout(typeCmd, ms); };
      var typeCmd = function () {
        cmdTimer = 0;
        if (!cmdVisible) return;
        var cmd = commands[cmdIdx];
        if (typing) {
          if (charIdx <= cmd.length) {
            cmdTyped.textContent = cmd.substring(0, charIdx);
            charIdx++;
            schedule(50 + Math.random() * 40);
          } else {
            typing = false;
            schedule(2000);
          }
        } else {
          cmdTyped.textContent = '';
          charIdx = 0;
          cmdIdx = (cmdIdx + 1) % commands.length;
          typing = true;
          schedule(400);
        }
      };
      watchVisibility(cmdEl, function (v) {
        cmdVisible = v;
        if (v && !cmdTimer) typeCmd();
      }, { threshold: 0.3 });
    }
  }

  // ============================================================
  // KONAMI CODE EASTER EGG
  // ============================================================
  var konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  var konamiIndex = 0;

  document.addEventListener('keydown', function (e) {
    if (e.keyCode === konamiSequence[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiSequence.length) {
        konamiIndex = 0;
        if (!reduceMotion) triggerMatrixRain();
      }
    } else {
      konamiIndex = 0;
    }
  });

  function triggerMatrixRain() {
    var canvas = document.createElement('canvas');
    canvas.className = 'matrix-rain-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);

    var c = canvas.getContext('2d');
    var columns = Math.floor(canvas.width / 14);
    var drops = [];
    for (var i = 0; i < columns; i++) drops[i] = Math.random() * -100;
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';

    canvas.offsetHeight; // commit the initial opacity before fading in
    canvas.classList.add('active');

    var matrixInterval = setInterval(function () {
      c.fillStyle = 'rgba(5, 5, 7, 0.05)';
      c.fillRect(0, 0, canvas.width, canvas.height);
      c.font = '14px monospace';
      for (var i = 0; i < drops.length; i++) {
        var text = chars.charAt(Math.floor(Math.random() * chars.length));
        c.fillStyle = Math.random() > 0.5 ? '#ff4444' : '#00ffff';
        c.fillText(text, i * 14, drops[i] * 14);
        if (drops[i] * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }, 40);

    setTimeout(function () {
      canvas.classList.remove('active');
      setTimeout(function () { clearInterval(matrixInterval); canvas.remove(); }, 300);
    }, 3000);
  }

  // ============================================================
  // STAGGER CHILDREN
  // ============================================================
  document.querySelectorAll('.timeline-item').forEach(function (item, idx) {
    item.style.transitionDelay = (idx * 0.15) + 's';
  });
  document.querySelectorAll('.cert-item').forEach(function (item, idx) {
    item.style.transitionDelay = (idx * 0.1) + 's';
  });

})();
