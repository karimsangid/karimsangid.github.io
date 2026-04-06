/* ============================================================
   karimsangid.dev — ULTRA Premium Portfolio Script
   ============================================================ */

(function () {
  'use strict';

  var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // ============================================================
  // LOADING SCREEN — DRAMATIC BOOT SEQUENCE
  // ============================================================
  var loader = document.getElementById('loader');
  var loaderPercent = document.getElementById('loaderPercent');
  var loaderGrid = document.getElementById('loaderGrid');

  // Loader grid canvas animation
  if (loaderGrid) {
    var lgCtx = loaderGrid.getContext('2d');
    loaderGrid.width = window.innerWidth;
    loaderGrid.height = window.innerHeight;
    var gridRunning = true;

    function drawLoaderGrid() {
      if (!gridRunning) return;
      lgCtx.clearRect(0, 0, loaderGrid.width, loaderGrid.height);
      lgCtx.strokeStyle = 'rgba(255, 68, 68, 0.04)';
      lgCtx.lineWidth = 0.5;
      var spacing = 60;
      var time = Date.now() * 0.001;
      for (var x = 0; x < loaderGrid.width; x += spacing) {
        var wave = Math.sin(x * 0.01 + time) * 10;
        lgCtx.beginPath();
        lgCtx.moveTo(x, 0);
        lgCtx.lineTo(x + wave, loaderGrid.height);
        lgCtx.stroke();
      }
      for (var y = 0; y < loaderGrid.height; y += spacing) {
        var wave2 = Math.cos(y * 0.01 + time) * 10;
        lgCtx.beginPath();
        lgCtx.moveTo(0, y);
        lgCtx.lineTo(loaderGrid.width, y + wave2);
        lgCtx.stroke();
      }
      requestAnimationFrame(drawLoaderGrid);
    }
    drawLoaderGrid();
  }

  // Percent counter
  var percentVal = 0;
  function countPercent() {
    if (percentVal < 100) {
      percentVal += Math.floor(Math.random() * 8) + 2;
      if (percentVal > 100) percentVal = 100;
      if (loaderPercent) loaderPercent.textContent = percentVal + '%';
      setTimeout(countPercent, 60 + Math.random() * 80);
    }
  }
  countPercent();

  window.addEventListener('load', function () {
    setTimeout(function () {
      percentVal = 100;
      if (loaderPercent) loaderPercent.textContent = '100%';
      // Screen flash
      document.body.classList.add('flash');
      setTimeout(function () { document.body.classList.remove('flash'); }, 200);
      loader.classList.add('done');
      gridRunning = false;
      setTimeout(function () { loader.style.display = 'none'; }, 1000);
    }, 1800);
  });

  // ============================================================
  // CUSTOM CURSOR + GLOW
  // ============================================================
  var dot = document.getElementById('cursorDot');
  var ring = document.getElementById('cursorRing');
  var glow = document.getElementById('cursorGlow');

  if (!isTouch && dot && ring) {
    var mx = -100, my = -100;
    var rx = -100, ry = -100;
    var gx = -100, gy = -100;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });

    (function moveCursorRing() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      if (glow) {
        gx += (mx - gx) * 0.08;
        gy += (my - gy) * 0.08;
        glow.style.left = gx + 'px';
        glow.style.top = gy + 'px';
      }
      requestAnimationFrame(moveCursorRing);
    })();

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
      if (glow) glow.classList.add('hidden');
    });
    document.addEventListener('mouseenter', function () {
      dot.classList.remove('hidden');
      ring.classList.remove('hidden');
      if (glow) glow.classList.remove('hidden');
    });
  } else {
    if (dot) dot.style.display = 'none';
    if (ring) ring.style.display = 'none';
    if (glow) glow.style.display = 'none';
  }

  // ============================================================
  // NAVIGATION
  // ============================================================
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  function updateNav() {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Active link highlighting
  var sections = document.querySelectorAll('section[id]');
  var navAnchors = navLinks.querySelectorAll('a[href^="#"]');

  function highlightActiveNav() {
    var scrollY = window.scrollY + 200;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navAnchors.forEach(function (a) {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#' + id) {
            a.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', highlightActiveNav, { passive: true });

  // ============================================================
  // SCROLL REVEAL (IntersectionObserver) — WITH 3D CARD ENTRANCES
  // ============================================================
  var revealElements = document.querySelectorAll('.scroll-reveal');
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      } else {
        entry.target.classList.remove('revealed');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ============================================================
  // COUNTER ANIMATION
  // ============================================================
  var statNumbers = document.querySelectorAll('.stat-number[data-target]');
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.textContent = '0';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(function (el) { counterObserver.observe(el); });

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
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
        el.classList.add('counted');
      }
    }
    requestAnimationFrame(step);
  }

  // ============================================================
  // SMOOTH SCROLL
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var offset = parseInt(getComputedStyle(document.documentElement).scrollPaddingTop, 10) || 72;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ============================================================
  // MAGNETIC BUTTONS — SPRING PHYSICS
  // ============================================================
  if (!isTouch) {
    document.querySelectorAll('.project-link, .nav-links a, .contact-email, .social-link, .cert-item').forEach(function (btn) {
      var bx = 0, by = 0, tx = 0, ty = 0;
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        tx = (e.clientX - rect.left - rect.width / 2) * 0.35;
        ty = (e.clientY - rect.top - rect.height / 2) * 0.35;
      });
      btn.addEventListener('mouseleave', function () {
        tx = 0;
        ty = 0;
      });
      (function springAnimate() {
        bx += (tx - bx) * 0.15;
        by += (ty - by) * 0.15;
        if (Math.abs(bx) > 0.1 || Math.abs(by) > 0.1 || Math.abs(tx) > 0.1 || Math.abs(ty) > 0.1) {
          btn.style.transform = 'translate(' + bx + 'px, ' + by + 'px)';
        }
        requestAnimationFrame(springAnimate);
      })();
    });
  }

  // ============================================================
  // INTERACTIVE PARTICLE CONSTELLATION — CANVAS (UPGRADED)
  // ============================================================
  var heroCanvas = document.getElementById('heroCanvas');
  if (heroCanvas && !isTouch) {
    var ctx = heroCanvas.getContext('2d');
    var particles = [];
    var particleCount = 120;
    var connectionDist = 160;
    var pmx = -1000, pmy = -1000;
    var mouseRadius = 250;
    var time = 0;

    function resizeCanvas() {
      heroCanvas.width = window.innerWidth;
      heroCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('mousemove', function (e) {
      pmx = e.clientX;
      pmy = e.clientY;
    });

    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 1 + Math.random() * 2,
        baseAlpha: 0.3 + Math.random() * 0.5,
        pulse: Math.random() * Math.PI * 2,
        color: Math.random() > 0.8 ? '68, 68, 255' : Math.random() > 0.5 ? '255, 68, 68' : '255, 68, 170'
      });
    }

    function animateParticles() {
      if (window.scrollY > window.innerHeight * 1.2) {
        requestAnimationFrame(animateParticles);
        return;
      }
      time += 0.01;
      ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var dx = p.x - pmx;
        var dy = p.y - pmy;
        var dist = Math.sqrt(dx * dx + dy * dy);

        // Mouse attraction (close = repel, medium = attract)
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

        if (p.x < 0) p.x = heroCanvas.width;
        if (p.x > heroCanvas.width) p.x = 0;
        if (p.y < 0) p.y = heroCanvas.height;
        if (p.y > heroCanvas.height) p.y = 0;

        // Pulsing particle
        var pulseAlpha = p.baseAlpha + Math.sin(time * 2 + p.pulse) * 0.2;
        var pulseR = p.r + Math.sin(time * 3 + p.pulse) * 0.5;

        // Glow
        var grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulseR * 4);
        grd.addColorStop(0, 'rgba(' + p.color + ', ' + (pulseAlpha * 0.3) + ')');
        grd.addColorStop(1, 'rgba(' + p.color + ', 0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulseR * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

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
          var cd = Math.sqrt(cdx * cdx + cdy * cdy);
          if (cd < connectionDist) {
            var alpha = (1 - cd / connectionDist) * 0.12;
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

      // Mouse node glow — larger, more dramatic
      if (pmx > 0 && pmy > 0 && pmx < heroCanvas.width && pmy < heroCanvas.height) {
        var grad = ctx.createRadialGradient(pmx, pmy, 0, pmx, pmy, 100);
        grad.addColorStop(0, 'rgba(255, 68, 68, 0.12)');
        grad.addColorStop(0.5, 'rgba(255, 68, 68, 0.04)');
        grad.addColorStop(1, 'rgba(255, 68, 68, 0)');
        ctx.beginPath();
        ctx.arc(pmx, pmy, 100, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Crosshair at mouse
        ctx.strokeStyle = 'rgba(255, 68, 68, 0.08)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(pmx - 20, pmy);
        ctx.lineTo(pmx + 20, pmy);
        ctx.moveTo(pmx, pmy - 20);
        ctx.lineTo(pmx, pmy + 20);
        ctx.stroke();
      }

      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ============================================================
  // CARD SPOTLIGHT — CURSOR GRADIENT FOLLOW
  // ============================================================
  if (!isTouch) {
    document.querySelectorAll('.project-card-inner').forEach(function (card) {
      var spotlight = card.querySelector('.card-spotlight');
      if (!spotlight) return;

      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        spotlight.style.opacity = '1';
        spotlight.style.background = 'radial-gradient(600px circle at ' + x + 'px ' + y + 'px, rgba(255, 68, 68, 0.06), transparent 40%)';
      });

      card.addEventListener('mouseleave', function () {
        spotlight.style.opacity = '0';
      });
    });
  }

  // ============================================================
  // 3D TILT ON PROJECT CARDS
  // ============================================================
  if (!isTouch) {
    document.querySelectorAll('.project-card-inner').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -4;
        var rotateY = ((x - centerX) / centerX) * 4;
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.01)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        card.style.transition = 'transform 0.6s cubic-bezier(0.33, 1, 0.68, 1)';
      });
      card.addEventListener('mouseenter', function () {
        card.style.transition = 'transform 0.1s ease';
      });
    });
  }

  // ============================================================
  // TEXT SCRAMBLE — ON PROJECT NAMES
  // ============================================================
  var scrambleChars = '!@#$%^&*()_+-=[]{}|;\':",./<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var projectNameEls = document.querySelectorAll('.project-name');

  var scrambleObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        scrambleText(entry.target);
      }
    });
  }, { threshold: 0.5 });

  projectNameEls.forEach(function (el) {
    el.setAttribute('data-original', el.textContent);
    scrambleObserver.observe(el);
  });

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
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = original;
      }
    }
    requestAnimationFrame(step);
  }

  // ============================================================
  // TYPING EFFECT ON ABOUT BIO
  // ============================================================
  var bioParagraph = document.querySelector('.about-bio p');
  if (bioParagraph) {
    var bioOriginalText = bioParagraph.textContent;
    var bioTyped = false;

    var bioObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !bioTyped) {
          bioTyped = true;
          typeBio(bioParagraph, bioOriginalText);
          bioObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    bioObserver.observe(bioParagraph);
  }

  function typeBio(el, text) {
    el.textContent = '';
    var cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    el.appendChild(cursor);
    var ci = 0;

    function typeNext() {
      if (ci < text.length) {
        el.insertBefore(document.createTextNode(text[ci]), cursor);
        ci++;
        setTimeout(typeNext, 12);
      } else {
        setTimeout(function () {
          if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
        }, 2000);
      }
    }
    typeNext();
  }

  // ============================================================
  // 3D WIREFRAME HOUSE — CANVAS (RoofRoof)
  // ============================================================
  var houseCanvas = document.getElementById('houseCanvas');
  if (houseCanvas) {
    var hCtx = houseCanvas.getContext('2d');
    var hAngle = 0;

    // House vertices: [x, y, z] centered at origin
    // Body: 80w x 60h x 60d
    var houseVerts = [
      // Body bottom (0-3)
      [-40, 30, -30], [40, 30, -30], [40, 30, 30], [-40, 30, 30],
      // Body top (4-7)
      [-40, -30, -30], [40, -30, -30], [40, -30, 30], [-40, -30, 30],
      // Roof ridge (8-9)
      [-45, -60, 0], [45, -60, 0],
      // Roof overhang front (10-11)
      [-45, -30, 35], [45, -30, 35],
      // Roof overhang back (12-13)
      [-45, -30, -35], [45, -30, -35],
      // Door (14-17)
      [5, 30, 30.5], [18, 30, 30.5], [18, 5, 30.5], [5, 5, 30.5],
      // Window left (18-21)
      [-30, -15, 30.5], [-15, -15, 30.5], [-15, 0, 30.5], [-30, 0, 30.5],
      // Window right (22-25)
      [25, -15, 30.5], [35, -15, 30.5], [35, 0, 30.5], [25, 0, 30.5]
    ];

    // Edges: pairs of vertex indices
    var bodyEdges = [
      [0,1],[1,2],[2,3],[3,0], // bottom
      [4,5],[5,6],[6,7],[7,4], // top
      [0,4],[1,5],[2,6],[3,7]  // verticals
    ];
    var roofEdges = [
      [8,9],       // ridge
      [8,10],[9,11],[10,11], // front slope
      [8,12],[9,13],[12,13], // back slope
    ];
    var doorEdges = [[14,15],[15,16],[16,17],[17,14]];
    var win1Edges = [[18,19],[19,20],[20,21],[21,18]];
    var win2Edges = [[22,23],[23,24],[24,25],[25,22]];

    function project3D(x, y, z, angle) {
      // Rotate around Y axis
      var cosA = Math.cos(angle);
      var sinA = Math.sin(angle);
      var rx = x * cosA - z * sinA;
      var rz = x * sinA + z * cosA;
      // Slight tilt down (rotate around X)
      var tilt = -0.3;
      var cosT = Math.cos(tilt);
      var sinT = Math.sin(tilt);
      var ry = y * cosT - rz * sinT;
      var rz2 = y * sinT + rz * cosT;
      // Perspective projection
      var fov = 600;
      var scale = fov / (fov + rz2 + 200);
      return {
        x: 250 + rx * scale * 2.0,
        y: 210 + ry * scale * 2.0,
        depth: rz2
      };
    }

    function drawEdges(edges, color, lineWidth) {
      hCtx.strokeStyle = color;
      hCtx.lineWidth = lineWidth || 1;
      for (var i = 0; i < edges.length; i++) {
        var a = houseVerts[edges[i][0]];
        var b = houseVerts[edges[i][1]];
        var pa = project3D(a[0], a[1], a[2], hAngle);
        var pb = project3D(b[0], b[1], b[2], hAngle);
        hCtx.beginPath();
        hCtx.moveTo(pa.x, pa.y);
        hCtx.lineTo(pb.x, pb.y);
        hCtx.stroke();
      }
    }

    function drawHouse() {
      hAngle += 0.008;
      hCtx.clearRect(0, 0, 500, 450);

      // Shadow
      hCtx.beginPath();
      hCtx.ellipse(250, 380, 90, 16, 0, 0, Math.PI * 2);
      hCtx.fillStyle = 'rgba(255, 68, 68, 0.06)';
      hCtx.fill();

      // Body
      drawEdges(bodyEdges, 'rgba(255, 68, 68, 0.25)', 1);
      // Roof
      drawEdges(roofEdges, 'rgba(255, 68, 68, 0.4)', 1.5);
      // Door
      drawEdges(doorEdges, 'rgba(255, 68, 68, 0.3)', 1);
      // Windows
      drawEdges(win1Edges, 'rgba(255, 200, 100, 0.3)', 1);
      drawEdges(win2Edges, 'rgba(255, 200, 100, 0.3)', 1);

      // Window glow
      var w1 = project3D(-22.5, -7.5, 30.5, hAngle);
      var w2 = project3D(30, -7.5, 30.5, hAngle);
      if (w1.depth < 100) {
        var glow1 = hCtx.createRadialGradient(w1.x, w1.y, 0, w1.x, w1.y, 8);
        glow1.addColorStop(0, 'rgba(255, 200, 100, 0.08)');
        glow1.addColorStop(1, 'rgba(255, 200, 100, 0)');
        hCtx.beginPath();
        hCtx.arc(w1.x, w1.y, 8, 0, Math.PI * 2);
        hCtx.fillStyle = glow1;
        hCtx.fill();
      }
      if (w2.depth < 100) {
        var glow2 = hCtx.createRadialGradient(w2.x, w2.y, 0, w2.x, w2.y, 8);
        glow2.addColorStop(0, 'rgba(255, 200, 100, 0.08)');
        glow2.addColorStop(1, 'rgba(255, 200, 100, 0)');
        hCtx.beginPath();
        hCtx.arc(w2.x, w2.y, 8, 0, Math.PI * 2);
        hCtx.fillStyle = glow2;
        hCtx.fill();
      }

      requestAnimationFrame(drawHouse);
    }

    var houseObs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        drawHouse();
        houseObs.disconnect();
      }
    }, { threshold: 0.2 });
    houseObs.observe(houseCanvas);
  }

  // ============================================================
  // OSINT MATRIX RAIN — CANVAS
  // ============================================================
  var osintCanvas = document.getElementById('osintCanvas');
  if (osintCanvas) {
    var oCtx = osintCanvas.getContext('2d');
    var oCols = Math.floor(300 / 12);
    var oDrops = [];
    for (var oi = 0; oi < oCols; oi++) oDrops[oi] = Math.random() * -50;
    var oChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&<>{}[]:/?.';
    var oRunning = false;

    function drawOsintMatrix() {
      if (!oRunning) return;
      oCtx.fillStyle = 'rgba(10, 10, 15, 0.08)';
      oCtx.fillRect(0, 0, 300, 220);
      oCtx.font = '11px monospace';

      for (var i = 0; i < oDrops.length; i++) {
        var ch = oChars.charAt(Math.floor(Math.random() * oChars.length));
        var bright = Math.random();
        if (bright > 0.92) {
          oCtx.fillStyle = '#ff4444';
        } else if (bright > 0.85) {
          oCtx.fillStyle = 'rgba(255, 68, 68, 0.8)';
        } else {
          oCtx.fillStyle = 'rgba(255, 68, 68, 0.35)';
        }
        oCtx.fillText(ch, i * 12, oDrops[i] * 12);
        if (oDrops[i] * 12 > 220 && Math.random() > 0.96) oDrops[i] = 0;
        oDrops[i] += 0.4 + Math.random() * 0.3;
      }
      requestAnimationFrame(drawOsintMatrix);
    }

    var osintObs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        if (!oRunning) { oRunning = true; drawOsintMatrix(); }
      } else {
        oRunning = false;
      }
    }, { threshold: 0.2 });
    osintObs.observe(osintCanvas);
  }

  // ============================================================
  // TERMINAL TYPING (PC Terminal)
  // ============================================================
  var cmdTyped = document.querySelector('.vis-cmd-typed');
  if (cmdTyped) {
    var commands = ['Get-Process | Sort CPU -Desc', 'netstat -an | Select-String LISTEN', 'Get-Service | Where Status -eq Running', 'systeminfo | Select-String "OS"'];
    var cmdIdx = 0, charIdx = 0, typing = true;

    function typeCmd() {
      var cmd = commands[cmdIdx];
      if (typing) {
        if (charIdx <= cmd.length) {
          cmdTyped.textContent = cmd.substring(0, charIdx);
          charIdx++;
          setTimeout(typeCmd, 50 + Math.random() * 40);
        } else {
          typing = false;
          setTimeout(typeCmd, 2000);
        }
      } else {
        cmdTyped.textContent = '';
        charIdx = 0;
        cmdIdx = (cmdIdx + 1) % commands.length;
        typing = true;
        setTimeout(typeCmd, 400);
      }
    }

    var cmdObs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { typeCmd(); cmdObs.disconnect(); }
    }, { threshold: 0.3 });
    var cmdEl = document.querySelector('.vis-cmd');
    if (cmdEl) cmdObs.observe(cmdEl);
  }

  // ============================================================
  // SCROLL PROGRESS BAR
  // ============================================================
  var scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = pct + '%';
    }, { passive: true });
  }

  // ============================================================
  // MOUSE TRAIL — UPGRADED WITH FADE
  // ============================================================
  if (!isTouch) {
    var trailCount = 8;
    var trailDots = [];
    for (var t = 0; t < trailCount; t++) {
      var trailDot = document.createElement('div');
      trailDot.className = 'mouse-trail';
      document.body.appendChild(trailDot);
      trailDots.push({ el: trailDot, x: -100, y: -100 });
    }

    var trailMx = -100, trailMy = -100;
    document.addEventListener('mousemove', function (e) {
      trailMx = e.clientX;
      trailMy = e.clientY;
    });

    (function animateTrail() {
      for (var i = 0; i < trailDots.length; i++) {
        var d = trailDots[i];
        var targetX = i === 0 ? trailMx : trailDots[i - 1].x;
        var targetY = i === 0 ? trailMy : trailDots[i - 1].y;
        d.x += (targetX - d.x) * (0.3 - i * 0.03);
        d.y += (targetY - d.y) * (0.3 - i * 0.03);
        d.el.style.left = d.x + 'px';
        d.el.style.top = d.y + 'px';
        d.el.style.opacity = (0.4 - (i * 0.05));
        var size = 4 - i * 0.3;
        d.el.style.width = size + 'px';
        d.el.style.height = size + 'px';
      }
      requestAnimationFrame(animateTrail);
    })();
  }

  // ============================================================
  // PARALLAX — MULTI-LAYER DEPTH
  // ============================================================
  var heroBlobs = document.querySelectorAll('.hero-blob');
  var heroContent = document.querySelector('.hero-content');
  var geoShapes = document.querySelectorAll('.geo');

  if (!isTouch) {
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;

      if (heroContent && scrollY < window.innerHeight * 1.5) {
        heroContent.style.transform = 'translateY(' + (scrollY * 0.2) + 'px)';
        heroContent.style.opacity = Math.max(0, 1 - scrollY / (window.innerHeight * 0.8));
      }

      heroBlobs.forEach(function (blob, i) {
        if (scrollY < window.innerHeight * 1.5) {
          var speed = 0.12 + i * 0.08;
          var morphProgress = (scrollY / window.innerHeight) * 100;
          var br1 = 50 + Math.sin(morphProgress * 0.02 + i) * 20;
          var br2 = 50 + Math.cos(morphProgress * 0.03 + i) * 15;
          var br3 = 50 + Math.sin(morphProgress * 0.025 + i * 2) * 18;
          var br4 = 50 + Math.cos(morphProgress * 0.015 + i * 3) * 22;
          blob.style.borderRadius = br1 + '% ' + br2 + '% ' + br3 + '% ' + br4 + '%';
          blob.style.transform = 'translateY(' + (scrollY * speed) + 'px) scale(' + (1 + Math.sin(morphProgress * 0.01) * 0.15) + ')';
        }
      });

      // Floating geometry parallax
      geoShapes.forEach(function (geo, i) {
        var speed = 0.03 + i * 0.01;
        geo.style.transform = 'translateY(' + (scrollY * speed) + 'px) rotate(' + (scrollY * 0.05 + i * 30) + 'deg)';
      });
    }, { passive: true });
  }

  // ============================================================
  // SKILL PILL FLOAT + INDEX
  // ============================================================
  var allPills = document.querySelectorAll('.skill-pill');
  allPills.forEach(function (pill, index) {
    pill.style.setProperty('--pill-i', index);
  });

  var skillsGrid = document.querySelector('.skills-grid');
  if (skillsGrid) {
    var pillObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-pill').forEach(function (pill) {
            pill.style.animation = 'floatPill 4s ease-in-out infinite';
            pill.style.animationDelay = 'calc(var(--pill-i, 0) * 0.3s)';
          });
        } else {
          entry.target.querySelectorAll('.skill-pill').forEach(function (pill) {
            pill.style.animation = '';
          });
        }
      });
    }, { threshold: 0.1 });
    pillObserver.observe(skillsGrid);
  }

  // ============================================================
  // SECTION TITLE SCRAMBLE ON SCROLL
  // ============================================================
  document.querySelectorAll('.section-title .word').forEach(function (wordEl) {
    wordEl.setAttribute('data-original', wordEl.textContent);
    var wordObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          scrambleText(entry.target);
        }
      });
    }, { threshold: 0.8 });
    wordObs.observe(wordEl);
  });

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
        triggerMatrixRain();
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
    document.body.appendChild(canvas);

    var c = canvas.getContext('2d');
    var columns = Math.floor(canvas.width / 14);
    var drops = [];
    for (var i = 0; i < columns; i++) drops[i] = Math.random() * -100;

    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';

    canvas.offsetHeight;
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
  // SECTION VISIBILITY — STAGGER CHILDREN
  // ============================================================
  document.querySelectorAll('.timeline-item').forEach(function (item, idx) {
    item.style.transitionDelay = (idx * 0.15) + 's';
  });

  document.querySelectorAll('.cert-item').forEach(function (item, idx) {
    item.style.transitionDelay = (idx * 0.1) + 's';
  });

})();
