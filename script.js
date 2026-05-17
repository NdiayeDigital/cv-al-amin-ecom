// ===== SPA NAVIGATION =====
const allSections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');

function showPage(pageId) {
  // Hide all sections
  allSections.forEach(section => {
    section.classList.remove('page-active');
    section.classList.add('page-hidden');
  });

  // Show target section
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.remove('page-hidden');
    target.classList.add('page-active');
    // Trigger reveal animations inside visible section
    target.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
  }

  // Update active nav link
  navLinksAll.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + pageId) {
      link.classList.add('active');
    }
  });

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Close mobile menu
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  navLinks.classList.remove('active');
  hamburger.classList.remove('open');
}

// Nav link clicks
navLinksAll.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const pageId = this.getAttribute('href').replace('#', '');
    showPage(pageId);
  });
});

// Show accueil by default on load
window.addEventListener('load', () => {
  showPage('accueil');
  // Trigger hero animations
  document.querySelectorAll('.hero .reveal, .hero [class*="fadeInUp"]').forEach(el => {
    el.classList.add('active');
  });
  animateCounters();
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('open');
});

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.stat-item h3');
let counted = false;
function animateCounters() {
  if (counted) return;
  const statsSection = document.querySelector('.hero-stats');
  if (!statsSection) return;
  counted = true;
  counters.forEach(counter => {
    const text = counter.textContent;
    const target = parseInt(text);
    const suffix = text.replace(/[0-9]/g, '');
    let current = 0;
    const increment = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = current + suffix;
    }, 25);
  });
}

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('form-name').value;
  const email = document.getElementById('form-email').value;
  const subject = document.getElementById('form-subject').value;
  const message = document.getElementById('form-message').value;
  
  const whatsappMsg = encodeURIComponent(
    `Bonjour Al Amin,\n\nJe suis ${name} (${email}).\n\nSujet: ${subject}\n\n${message}`
  );
  window.open(`https://wa.me/221784799882?text=${whatsappMsg}`, '_blank');
});

// ===== LOGO CLICK = HOME =====
document.querySelector('.nav-logo').addEventListener('click', (e) => {
  e.preventDefault();
  showPage('accueil');
});

// ===== INTERNAL LINKS (buttons inside pages) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  if (!anchor.closest('.nav-links')) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const pageId = this.getAttribute('href').replace('#', '');
      showPage(pageId);
    });
  }
});
