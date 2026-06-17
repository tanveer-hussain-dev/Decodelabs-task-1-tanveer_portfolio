// ============================================
// TANVEER HUSSAIN — PORTFOLIO JS
// DecodeLabs Project 1 | State Management
// ============================================

// ===== STATE =====
const state = {
  menuOpen: false,
  activeFilter: 'all',
  formSubmitted: false,
};

// ===== DOM REFS =====
const hamburger    = document.getElementById('hamburger');
const navLinks     = document.getElementById('navLinks');
const siteHeader   = document.getElementById('siteHeader');
const projectsGrid = document.getElementById('projectsGrid');
const filterBtns   = document.querySelectorAll('.filter-btn');
const submitBtn    = document.getElementById('submitBtn');
const nameInput    = document.getElementById('nameInput');
const emailInput   = document.getElementById('emailInput');
const msgInput     = document.getElementById('msgInput');
const formFeedback = document.getElementById('formFeedback');
const skillFills   = document.querySelectorAll('.sb-fill');

// ===== 1. HAMBURGER MENU =====
hamburger.addEventListener('click', () => {
  state.menuOpen = !state.menuOpen;

  navLinks.classList.toggle('open', state.menuOpen);
  hamburger.classList.toggle('open', state.menuOpen);
  hamburger.setAttribute('aria-expanded', state.menuOpen);

  // Prevent body scroll when menu open
  document.body.style.overflow = state.menuOpen ? 'hidden' : '';
});

// Close menu on nav link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    state.menuOpen = false;
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (state.menuOpen && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
    state.menuOpen = false;
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  }
});

// ===== 2. STICKY HEADER SCROLL =====
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    siteHeader.classList.add('scrolled');
  } else {
    siteHeader.classList.remove('scrolled');
  }
});

// ===== 3. PROJECT FILTER =====
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    state.activeFilter = filter;

    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Filter cards
    const cards = projectsGrid.querySelectorAll('.project-card');
    cards.forEach(card => {
      const cats = card.dataset.cat || '';

      if (filter === 'all' || cats.includes(filter)) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeUp 0.4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== 4. CONTACT FORM VALIDATION =====
submitBtn.addEventListener('click', () => {
  const name  = nameInput.value.trim();
  const email = emailInput.value.trim();
  const msg   = msgInput.value.trim();

  // Clear previous feedback
  formFeedback.textContent = '';
  formFeedback.style.color = '';

  // Validation
  if (!name || !email || !msg) {
    formFeedback.textContent = '⚠️ Please fill in all fields.';
    formFeedback.style.color = '#e53e3e';
    shakeElement(submitBtn);
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    formFeedback.textContent = '⚠️ Please enter a valid email address.';
    formFeedback.style.color = '#e53e3e';
    shakeElement(emailInput);
    return;
  }

  // Success state
  state.formSubmitted = true;
  submitBtn.textContent = 'Sending... ⏳';
  submitBtn.disabled = true;

  setTimeout(() => {
    formFeedback.textContent = `✅ Message sent! I'll get back to you soon, ${name}.`;
    formFeedback.style.color = '#16a34a';
    submitBtn.textContent = 'Send Message 🚀';
    submitBtn.disabled = false;
    nameInput.value = '';
    emailInput.value = '';
    msgInput.value = '';
    state.formSubmitted = false;
  }, 1200);
});

// Helper: Shake animation
function shakeElement(el) {
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'shake 0.4s ease';
  setTimeout(() => { el.style.animation = ''; }, 400);
}

// Add shake keyframe dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-6px); }
    40%, 80% { transform: translateX(6px); }
  }
`;
document.head.appendChild(shakeStyle);

// ===== 5. SCROLL ANIMATIONS (Intersection Observer) =====
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px',
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Apply fade-in to sections and cards
const animTargets = document.querySelectorAll(
  '.about-card, .skill-category, .project-card, .tl-item, .cert-card, .contact-item'
);

animTargets.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
  fadeObserver.observe(el);
});

// ===== 6. SKILL BARS ANIMATION =====
const skillBarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      skillFills.forEach(fill => fill.classList.add('animated'));
      skillBarObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const skillSection = document.querySelector('.skill-bars');
if (skillSection) skillBarObserver.observe(skillSection);

// ===== 7. SMOOTH ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === `#${id}`) {
          a.style.color = 'var(--mocha)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => navObserver.observe(sec));
