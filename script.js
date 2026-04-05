/* ============================================================
   karimsangid.dev — Premium Portfolio Script
   ============================================================ */

(function () {
  'use strict';

  // ---- LOADING SCREEN ----
  const loader = document.getElementById('loader');
  window.addEventListener('load', function () {
    setTimeout(function () {
      loader.classList.add('done');
      setTimeout(function () { loader.style.display = 'none'; }, 800);
    }, 1400);
  });

  // ---- CUSTOM CURSOR ----
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouch && dot && ring) {
    let mx = -100, my = -100;
    let rx = -100, ry = -100;

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
      requestAnimationFrame(moveCursorRing);
    })();

    // Expand ring on hover over interactive elements
    var interactiveSelector = 'a, button, .project-card-inner, .skill-pill, .cert-item, .contact-email, .social-link, .vis-flashcard';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(interactiveSelector)) {
        ring.classList.add('hover');
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(interactiveSelector)) {
        ring.classList.remove('hover');
      }
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', function () {
      dot.classList.add('hidden');
      ring.classList.add('hidden');
    });
    document.addEventListener('mouseenter', function () {
      dot.classList.remove('hidden');
      ring.classList.remove('hidden');
    });
  } else {
    // Hide custom cursor elements on touch devices
    if (dot) dot.style.display = 'none';
    if (ring) ring.style.display = 'none';
  }

  // ---- NAVIGATION ----
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

  // Mobile menu toggle
  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on Escape
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

  // ---- SCROLL REVEAL (IntersectionObserver) ----
  var revealElements = document.querySelectorAll('.scroll-reveal');
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      } else {
        entry.target.classList.remove('revealed');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ---- COUNTER ANIMATION (re-counts on every scroll into view) ----
  var statNumbers = document.querySelectorAll('.stat-number[data-target]');
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.textContent = '0';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(function (el) {
    counterObserver.observe(el);
  });

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var duration = 2000;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = current.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(step);
  }

  // ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
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

  // ---- MAGNETIC BUTTONS (all interactive elements) ----
  if (!isTouch) {
    document.querySelectorAll('.project-link, .nav-links a, .contact-email, .social-link, .cert-item').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
        btn.style.transition = 'transform 0.1s ease';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = 'translate(0, 0)';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });
    });
  }

  // ---- PARALLAX ON HERO BLOBS (handled in INSANE MODE parallax section below) ----
  var heroBlobs = document.querySelectorAll('.hero-blob');

  // ---- TERMINAL TYPING EFFECT (PC Terminal project) ----
  var cmdTyped = document.querySelector('.vis-cmd-typed');
  if (cmdTyped) {
    var commands = ['Get-Process | Sort CPU -Desc', 'netstat -an | Select-String LISTEN', 'Get-Service | Where Status -eq Running', 'systeminfo | Select-String "OS"'];
    var cmdIndex = 0;
    var charIndex = 0;
    var typing = true;

    function typeCmd() {
      var cmd = commands[cmdIndex];
      if (typing) {
        if (charIndex <= cmd.length) {
          cmdTyped.textContent = cmd.substring(0, charIndex);
          charIndex++;
          setTimeout(typeCmd, 50 + Math.random() * 40);
        } else {
          typing = false;
          setTimeout(typeCmd, 2000);
        }
      } else {
        cmdTyped.textContent = '';
        charIndex = 0;
        cmdIndex = (cmdIndex + 1) % commands.length;
        typing = true;
        setTimeout(typeCmd, 400);
      }
    }

    // Start typing when visible
    var cmdObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        typeCmd();
        cmdObserver.disconnect();
      }
    }, { threshold: 0.3 });

    var cmdEl = document.querySelector('.vis-cmd');
    if (cmdEl) cmdObserver.observe(cmdEl);
  }

  // ---- SCROLL PROGRESS BAR ----
  var scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = scrollPercent + '%';
    }, { passive: true });
  }

  // ---- FLOATING PARTICLES IN HERO ----
  var heroSection = document.getElementById('hero');
  if (heroSection) {
    var particleCount = 18;
    for (var p = 0; p < particleCount; p++) {
      var particle = document.createElement('div');
      particle.className = 'particle';
      var size = 2 + Math.random() * 2;
      var startX = Math.random() * 100;
      var startY = Math.random() * 100;
      var duration = 15 + Math.random() * 20;
      var delay = Math.random() * -20;
      particle.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + startX + '%;top:' + startY + '%;opacity:' + (0.1 + Math.random() * 0.1) + ';animation:particleDrift' + (p % 3) + ' ' + duration + 's linear ' + delay + 's infinite;';
      heroSection.querySelector('.hero-bg').appendChild(particle);
    }

    var particleStyle = document.createElement('style');
    particleStyle.textContent =
      '@keyframes particleDrift0{0%{transform:translate(0,0)}25%{transform:translate(60px,-80px)}50%{transform:translate(-40px,-160px)}75%{transform:translate(80px,-240px)}100%{transform:translate(0,0)}}' +
      '@keyframes particleDrift1{0%{transform:translate(0,0)}25%{transform:translate(-50px,-60px)}50%{transform:translate(70px,-120px)}75%{transform:translate(-30px,-200px)}100%{transform:translate(0,0)}}' +
      '@keyframes particleDrift2{0%{transform:translate(0,0)}25%{transform:translate(40px,-100px)}50%{transform:translate(-60px,-50px)}75%{transform:translate(20px,-180px)}100%{transform:translate(0,0)}}';
    document.head.appendChild(particleStyle);
  }

  // ---- MOUSE TRAIL EFFECT (desktop only) ----
  if (!isTouch) {
    var trailCount = 6;
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
      var prevX = trailMx, prevY = trailMy;
      for (var i = 0; i < trailDots.length; i++) {
        var d = trailDots[i];
        var targetX = i === 0 ? trailMx : trailDots[i - 1].x;
        var targetY = i === 0 ? trailMy : trailDots[i - 1].y;
        d.x += (targetX - d.x) * (0.35 - i * 0.04);
        d.y += (targetY - d.y) * (0.35 - i * 0.04);
        d.el.style.left = d.x + 'px';
        d.el.style.top = d.y + 'px';
        d.el.style.opacity = (0.3 - (i * 0.05));
        d.el.style.transform = 'translate(-50%, -50%)';
      }
      requestAnimationFrame(animateTrail);
    })();
  }

  // ---- TILT EFFECT ON PROJECT CARDS (desktop only) ----
  if (!isTouch) {
    var projectCards = document.querySelectorAll('.project-card-inner');
    projectCards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -3;
        var rotateY = ((x - centerX) / centerX) * 3;
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        card.style.transition = 'transform 0.5s ease';
      });
      card.addEventListener('mouseenter', function () {
        card.style.transition = 'transform 0.1s ease';
      });
    });
  }

  // ---- TEXT SCRAMBLE EFFECT ON PROJECT NAMES ----
  var scrambleChars = '!@#$%^&*()_+-=[]{}|;\':",./<>?';
  var projectNameEls = document.querySelectorAll('.project-name');

  var scrambleObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        scrambleText(entry.target);
        scrambleObserver.unobserve(entry.target);
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
    var duration = 500;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var result = '';
      for (var i = 0; i < length; i++) {
        if (original[i] === ' ') {
          result += ' ';
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

  // ---- TYPING EFFECT ON ABOUT BIO ----
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
    var charIndex2 = 0;

    function typeNextChar() {
      if (charIndex2 < text.length) {
        el.insertBefore(document.createTextNode(text[charIndex2]), cursor);
        charIndex2++;
        setTimeout(typeNextChar, 15);
      } else {
        setTimeout(function () {
          if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
        }, 2000);
      }
    }

    typeNextChar();
  }

  // ---- STAT NUMBER GLOW AFTER COUNTING ----
  // Patch: add 'counted' class after counter finishes
  var statNumsAll = document.querySelectorAll('.stat-number[data-target]');
  var glowObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        // Wait for counter animation to finish (2s) then add glow
        setTimeout(function () {
          el.classList.add('counted');
        }, 2200);
        glowObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumsAll.forEach(function (el) {
    glowObserver.observe(el);
  });

  // Horizontal scroll removed — using vertical layout

  // ============================================================
  // INSANE MODE — PARALLAX DEPTH
  // ============================================================
  if (!isTouch) {
    var heroContent = document.querySelector('.hero-content');
    var statNums = document.querySelectorAll('.stat-number');

    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;

      // Hero text parallax (0.5x)
      if (heroContent && scrollY < window.innerHeight * 1.5) {
        heroContent.style.transform = 'translateY(' + (scrollY * 0.15) + 'px)';
      }

      // Hero blobs parallax (0.3x) — enhance existing
      heroBlobs.forEach(function (blob, i) {
        if (scrollY < window.innerHeight * 1.5) {
          var speed = 0.12 + i * 0.06;
          // Morphing border-radius based on scroll
          var morphProgress = (scrollY / window.innerHeight) * 100;
          var br1 = 50 + Math.sin(morphProgress * 0.02 + i) * 20;
          var br2 = 50 + Math.cos(morphProgress * 0.03 + i) * 15;
          var br3 = 50 + Math.sin(morphProgress * 0.025 + i * 2) * 18;
          var br4 = 50 + Math.cos(morphProgress * 0.015 + i * 3) * 22;
          blob.style.borderRadius = br1 + '% ' + br2 + '% ' + br3 + '% ' + br4 + '%';
          blob.style.transform = 'translateY(' + (scrollY * speed) + 'px) scale(' + (1 + Math.sin(morphProgress * 0.01) * 0.1) + ')';
        }
      });

      // Stats slight upward drift
      statNums.forEach(function (num) {
        var rect = num.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          var offset = (rect.top - window.innerHeight / 2) * 0.05;
          num.style.transform = 'translateY(' + offset + 'px)';
        }
      });
    }, { passive: true });
  }

  // ============================================================
  // INSANE MODE — SKILL PILL FLOAT + INDEX VAR
  // ============================================================
  var allPills = document.querySelectorAll('.skill-pill');
  allPills.forEach(function (pill, index) {
    pill.style.setProperty('--pill-i', index);
  });

  // Add float animation when skills section is revealed
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
  // INSANE MODE — KONAMI CODE EASTER EGG
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

    var ctx = canvas.getContext('2d');
    var columns = Math.floor(canvas.width / 14);
    var drops = [];
    for (var i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';

    // Force reflow then activate
    canvas.offsetHeight;
    canvas.classList.add('active');

    var matrixInterval = setInterval(function () {
      ctx.fillStyle = 'rgba(5, 5, 7, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ff4444';
      ctx.font = '14px monospace';

      for (var i2 = 0; i2 < drops.length; i2++) {
        var text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillStyle = Math.random() > 0.5 ? '#ff4444' : '#00ffff';
        ctx.fillText(text, i2 * 14, drops[i2] * 14);
        if (drops[i2] * 14 > canvas.height && Math.random() > 0.975) {
          drops[i2] = 0;
        }
        drops[i2]++;
      }
    }, 40);

    setTimeout(function () {
      canvas.classList.remove('active');
      setTimeout(function () {
        clearInterval(matrixInterval);
        canvas.remove();
      }, 300);
    }, 3000);
  }

})();
