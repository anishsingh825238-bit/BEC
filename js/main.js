/* ============================================
   BHAWANI ENGINEERING CONSTRUCTIONS
   Main JavaScript
   ============================================ */

'use strict';

// ---- DOM Ready ----
document.addEventListener('DOMContentLoaded', function () {
  initPreloader();
  initNavbar();
  initHamburger();
  initScrollAnimations();
  initCounters();
  initParticles();
  initBackToTop();
  initFormHandling();
  setActiveNavLink();
});

// ============================================
// PRELOADER
// ============================================
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  window.addEventListener('load', function () {
    setTimeout(function () {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1600);
  });

  document.body.style.overflow = 'hidden';
}

// ============================================
// NAVBAR
// ============================================
function initNavbar() {
  const header = document.getElementById('header');
  if (!header) return;

  function handleScroll() {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// ============================================
// HAMBURGER MENU
// ============================================
function initHamburger() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navOverlay = document.querySelector('.nav-overlay');

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    if (navOverlay) navOverlay.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
  }

  // Close on nav link click
  document.querySelectorAll('.nav-link:not([data-dropdown])').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Mobile dropdown toggle
  document.querySelectorAll('.nav-item').forEach(function (item) {
    const link = item.querySelector('.nav-link[data-dropdown]');
    if (link) {
      link.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          item.classList.toggle('open');
        }
      });
    }
  });

  function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Close on resize
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });
}

// ============================================
// SET ACTIVE NAV LINK
// ============================================
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  elements.forEach(function (el) {
    observer.observe(el);
  });
}

// ============================================
// COUNTER ANIMATION
// ============================================
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(function (counter) {
    observer.observe(counter);
  });
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'), 10);
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 2000;
  const start = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
    const current = Math.floor(eased * target);
    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target + suffix;
    }
  }

  requestAnimationFrame(update);
}

// ============================================
// PARTICLES
// ============================================
function initParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;

  const count = 20;

  for (let i = 0; i < count; i++) {
    createParticle(container);
  }
}

function createParticle(container) {
  const particle = document.createElement('div');
  particle.classList.add('particle');

  const size = Math.random() * 4 + 1;
  const left = Math.random() * 100;
  const delay = Math.random() * 10;
  const duration = Math.random() * 15 + 10;

  particle.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${left}%;
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
    background: ${Math.random() > 0.5 ? '#f97316' : '#2563eb'};
  `;

  container.appendChild(particle);
}

// ============================================
// BACK TO TOP
// ============================================
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================
// FORM HANDLING
// ============================================
function initFormHandling() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = form.querySelector('[type="submit"]');
    const originalText = btn.innerHTML;

    // Validate
    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const message = form.querySelector('[name="message"]');

    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }

    if (!isValidEmail(email.value)) {
      showNotification('Please enter a valid email address.', 'error');
      return;
    }

    // Simulate submission
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    setTimeout(function () {
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      showNotification('Thank you! Your enquiry has been submitted. We will contact you shortly.', 'success');
      form.reset();

      setTimeout(function () {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 3000);
    }, 2000);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNotification(message, type) {
  // Remove existing
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    <span>${message}</span>
    <button onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
  `;

  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    z-index: 9999;
    background: ${type === 'success' ? '#16a34a' : '#dc2626'};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 400px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    animation: slideInRight 0.3s ease;
    font-family: 'Open Sans', sans-serif;
    font-size: 0.9rem;
  `;

  document.body.appendChild(notification);

  setTimeout(function () {
    if (notification.parentElement) {
      notification.style.animation = 'slideOutRight 0.3s ease forwards';
      setTimeout(function () { notification.remove(); }, 300);
    }
  }, 5000);
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ============================================
// STYLE INJECTION FOR NOTIFICATIONS
// ============================================
const notifStyle = document.createElement('style');
notifStyle.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  .notification button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    margin-left: auto;
    padding: 0 5px;
    font-size: 0.9rem;
  }
`;
document.head.appendChild(notifStyle);
