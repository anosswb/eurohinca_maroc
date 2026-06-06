/* =========================================================
   EuroHinca Maroc — JavaScript
   Features: navbar scroll, hero slider, stats counter,
   scroll reveal, mobile menu, form submission, modals
========================================================= */

// ============ MODAL FUNCTIONS ============
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Focus close button for accessibility
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) setTimeout(() => closeBtn.focus(), 100);
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function closeModalOutside(event, id) {
  if (event.target === event.currentTarget) {
    closeModal(id);
  }
}

// Close any open modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
    });
    document.body.style.overflow = '';
  }
});

// Allow keyboard Enter/Space to open cards
document.querySelectorAll('.service-card-clickable').forEach(card => {
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});


// ============ NAVBAR ============
const navbar   = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  toggleScrollTop();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ============ HERO SLIDER ============
const slides = document.querySelectorAll('.hero-slide');
const dots   = document.querySelectorAll('.hero-dot');
let currentSlide = 0;
let sliderTimer;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
  resetSliderTimer();
}

function resetSliderTimer() {
  clearInterval(sliderTimer);
  sliderTimer = setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 6000);
}

resetSliderTimer();

// ============ STATS COUNTER ============
let statsAnimated = false;

function animateStats() {
  if (statsAnimated) return;
  const statsSection = document.getElementById('stats');
  const rect = statsSection.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.85) {
    statsAnimated = true;
    document.querySelectorAll('.stat-number').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      let step = 0;
      const timer = setInterval(() => {
        step++;
        current = Math.min(Math.round(increment * step), target);
        el.textContent = current;
        if (step >= steps) clearInterval(timer);
      }, duration / steps);
    });
  }
}

window.addEventListener('scroll', animateStats);
animateStats();

// ============ SCROLL REVEAL ============
const revealElements = document.querySelectorAll(
  '.service-card, .project-item, .about-feature, .why-feature, ' +
  '.contact-info-card, .stat-item, .about-img-main, .about-img-accent, ' +
  '.about-badge-float, .about-content, .cta-card, .footer-col, .footer-brand'
);

revealElements.forEach((el, i) => {
  el.classList.add('reveal');
  // Stagger for grid children
  const parent = el.parentElement;
  const siblings = Array.from(parent.children).filter(c => c === el);
  el.style.transitionDelay = `${(i % 4) * 0.1}s`;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => observer.observe(el));

// ============ SCROLL TO TOP ============
const scrollTopBtn = document.getElementById('scroll-top');

function toggleScrollTop() {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============ ACTIVE NAV LINK ============
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link:not(.nav-cta)');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (window.scrollY >= sectionTop - 100) {
      current = section.getAttribute('id');
    }
  });
  navLinkEls.forEach(link => {
    link.classList.remove('active-nav');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active-nav');
    }
  });
});

// ============ CONTACT FORM ============
function handleSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('contact-form');
  const btn  = document.getElementById('btn-submit');
  const success = document.getElementById('form-success');

  btn.disabled = true;
  btn.innerHTML = `
    <svg class="spin" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
    </svg>
    Envoi en cours...
  `;

  setTimeout(() => {
    btn.style.display = 'none';
    success.classList.add('show');
    form.reset();
    setTimeout(() => {
      btn.style.display = 'inline-flex';
      btn.disabled = false;
      btn.innerHTML = `
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
        </svg>
        Envoyer le Message
      `;
      success.classList.remove('show');
    }, 5000);
  }, 1500);
}

// ============ SMOOTH ANCHOR SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = navbar.offsetHeight;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ============ SPIN ANIMATION CSS ============
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .spin { animation: spin 1s linear infinite; }
  .active-nav {
    color: var(--white) !important;
    background: rgba(255,255,255,0.15) !important;
  }
`;
document.head.appendChild(style);
