/* ============================================================
   karimsangid.dev — JavaScript
   ============================================================ */

(function () {
  'use strict';

  // --- Navigation: scroll effect ---
  const nav = document.getElementById('nav');

  function updateNav() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // --- Mobile menu toggle ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close mobile menu on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // --- Scroll animations (IntersectionObserver) ---
  var animateElements = document.querySelectorAll('.animate-in');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    animateElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    animateElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // --- Active nav link highlight on scroll ---
  var sections = document.querySelectorAll('section[id]');

  function highlightNav() {
    var scrollY = window.scrollY + 100;

    sections.forEach(function (section) {
      var sectionTop = section.offsetTop;
      var sectionHeight = section.offsetHeight;
      var sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.querySelectorAll('a').forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  // --- Parallax on hero blobs ---
  var heroSection = document.querySelector('.hero');

  if (heroSection && window.matchMedia('(min-width: 768px)').matches) {
    window.addEventListener(
      'scroll',
      function () {
        var scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
          var blobs = heroSection.querySelectorAll('.hero-blob');
          blobs.forEach(function (blob, i) {
            var speed = 0.1 + i * 0.05;
            blob.style.transform =
              'translate(' +
              Math.sin(scrolled * 0.002 + i) * 20 +
              'px, ' +
              scrolled * speed +
              'px)';
          });
        }
      },
      { passive: true }
    );
  }

  // --- Sentinel bar animation restart on scroll into view ---
  var sentinelBars = document.querySelectorAll('.sentinel-bar');

  if (sentinelBars.length && 'IntersectionObserver' in window) {
    var barObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Re-trigger animation by removing and re-adding the element
            var bar = entry.target;
            bar.style.animation = 'none';
            // Force reflow
            void bar.offsetHeight;
            bar.style.animation = '';
          }
        });
      },
      { threshold: 0.5 }
    );

    sentinelBars.forEach(function (bar) {
      barObserver.observe(bar);
    });
  }
})();
