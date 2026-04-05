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
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ---- COUNTER ANIMATION ----
  var statNumbers = document.querySelectorAll('.stat-number[data-target]');
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
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

  // ---- MAGNETIC BUTTON (Contact Email) ----
  var magneticEl = document.getElementById('contactEmail');
  if (magneticEl && !isTouch) {
    magneticEl.addEventListener('mousemove', function (e) {
      var rect = this.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      this.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
    });
    magneticEl.addEventListener('mouseleave', function () {
      this.style.transform = 'translate(0, 0)';
    });
  }

  // ---- PARALLAX ON HERO BLOBS ----
  var heroBlobs = document.querySelectorAll('.hero-blob');
  if (!isTouch && heroBlobs.length > 0) {
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      if (scrollY < window.innerHeight * 1.5) {
        heroBlobs.forEach(function (blob, i) {
          var speed = 0.08 + i * 0.04;
          blob.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
        });
      }
    }, { passive: true });
  }

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

})();
