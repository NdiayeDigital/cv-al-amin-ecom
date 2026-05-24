// ===== CONFIGURATION SUPABASE =====
// Remplissez ces champs avec vos clés d'API de votre projet Supabase
// (Vous pouvez créer un projet gratuit sur https://supabase.com)
const SUPABASE_URL = "VOTRE_SUPABASE_URL";
const SUPABASE_ANON_KEY = "VOTRE_SUPABASE_ANON_KEY";

let supabaseClient = null;

if (typeof supabase !== 'undefined' && SUPABASE_URL !== "VOTRE_SUPABASE_URL" && SUPABASE_ANON_KEY !== "VOTRE_SUPABASE_ANON_KEY") {
  try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase initialisé avec succès !");
  } catch (err) {
    console.error("Erreur d'initialisation de Supabase :", err);
  }
}

// ===== SPA NAVIGATION =====
const allSections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');
const mobileOverlay = document.getElementById('mobileOverlay');

function closeMobileMenu() {
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  navLinks.classList.remove('active');
  hamburger.classList.remove('open');
  if (mobileOverlay) mobileOverlay.classList.remove('active');
}

function updateBottomNav(pageId) {
  document.querySelectorAll('.bottom-nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-page') === pageId) {
      item.classList.add('active');
    }
  });
}

function showPage(pageId) {
  // Hide all sections
  allSections.forEach(section => {
    section.classList.remove('page-active');
    section.classList.add('page-hidden');
  });

  if (pageId === 'accueil') {
    // Show accueil, galerie, formation-gratuite, and parcours together on the Home page
    ['accueil', 'galerie', 'formation-gratuite', 'parcours'].forEach(id => {
      const target = document.getElementById(id);
      if (target) {
        target.classList.remove('page-hidden');
        target.classList.add('page-active');
        target.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
      }
    });
  } else {
    // Show target section
    const target = document.getElementById(pageId);
    if (target) {
      target.classList.remove('page-hidden');
      target.classList.add('page-active');
      // Trigger reveal animations inside visible section
      target.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
    }
  }

  // Update active top nav link
  navLinksAll.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + pageId) {
      link.classList.add('active');
    }
  });

  // Update bottom nav active state
  updateBottomNav(pageId);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Close mobile menu
  closeMobileMenu();
}

// Top nav link clicks
navLinksAll.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const pageId = this.getAttribute('href').replace('#', '');
    showPage(pageId);
  });
});

// Bottom nav link clicks
document.querySelectorAll('.bottom-nav-item').forEach(item => {
  item.addEventListener('click', function (e) {
    e.preventDefault();
    const pageId = this.getAttribute('data-page');
    if (pageId) showPage(pageId);
  });
});

// Overlay click closes menu
if (mobileOverlay) {
  mobileOverlay.addEventListener('click', closeMobileMenu);
}

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
  const isOpen = navLinks.classList.toggle('active');
  hamburger.classList.toggle('open', isOpen);
  if (mobileOverlay) mobileOverlay.classList.toggle('active', isOpen);
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

// ===== SECURITY UTILITIES & STATE HELPERS =====
function sanitizeHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"']/g, (m) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return map[m];
  });
}

function getBookings() {
  try {
    const data = localStorage.getItem('rdv_bookings');
    if (!data) return {};
    const parsed = JSON.parse(data);
    return (parsed && typeof parsed === 'object') ? parsed : {};
  } catch (e) {
    console.error("Sécurité : localStorage altéré ou corrompu. Réinitialisation sécurisée.", e);
    return {};
  }
}

function saveBooking(date, time) {
  try {
    const bookedData = getBookings();
    if (!bookedData[date]) {
      bookedData[date] = [];
    }
    if (!bookedData[date].includes(time)) {
      bookedData[date].push(time);
      localStorage.setItem('rdv_bookings', JSON.stringify(bookedData));
    }
  } catch (e) {
    console.error("Sécurité : Impossible de sauvegarder le rendez-vous sécurisé.", e);
  }
}

// ===== APPOINTMENT FORM =====
const dateInput = document.getElementById('form-date');
const timeSelect = document.getElementById('form-time');

// Set minimum date to today
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;

  const availableHours = [
    "09:00", "10:00", "11:00", "12:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  dateInput.addEventListener('change', function() {
    const selectedDate = sanitizeHTML(this.value);
    timeSelect.innerHTML = '<option value="">Choisissez une heure</option>';
    
    if (selectedDate) {
      timeSelect.disabled = false;
      // Fetch booked times safely
      const bookedData = getBookings();
      const bookedTimes = bookedData[selectedDate] || [];

      availableHours.forEach(time => {
        const option = document.createElement('option');
        option.value = sanitizeHTML(time);
        option.textContent = sanitizeHTML(time);
        if (bookedTimes.includes(time)) {
          option.disabled = true;
          option.textContent += ' (Indisponible)';
        }
        timeSelect.appendChild(option);
      });
    } else {
      timeSelect.disabled = true;
    }
  });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nom = sanitizeHTML(document.getElementById('form-nom').value.trim());
    const prenom = sanitizeHTML(document.getElementById('form-prenom').value.trim());
    const email = sanitizeHTML(document.getElementById('form-email').value.trim());
    const tel = sanitizeHTML(document.getElementById('form-tel').value.trim());
    const date = sanitizeHTML(document.getElementById('form-date').value.trim());
    const time = sanitizeHTML(document.getElementById('form-time').value.trim());
    const message = sanitizeHTML(document.getElementById('form-message').value.trim());
    
    if (!time) {
      alert("Veuillez choisir une heure pour le rendez-vous.");
      return;
    }

    // Save booking safely
    saveBooking(date, time);

    // Save to Supabase if configured
    if (supabaseClient) {
      supabaseClient.from('bookings').insert([{
        nom: nom,
        prenom: prenom,
        email: email,
        tel: tel,
        date: date,
        heure: time,
        message: message
      }]).then(({ error }) => {
        if (error) console.error("Erreur de sauvegarde Supabase :", error);
        else console.log("Rendez-vous sauvegardé sur Supabase !");
      });
    }

    // Show success message
    document.getElementById('form-success').style.display = 'block';
    
    // Redirect to WhatsApp
    const whatsappMsg = encodeURIComponent(
      `📅 *NOUVEAU RENDEZ-VOUS*\n\n` +
      `*Client:* ${prenom} ${nom}\n` +
      `*Email:* ${email}\n` +
      `*Tél:* ${tel}\n` +
      `*Date:* ${date}\n` +
      `*Heure:* ${time}\n\n` +
      `*Sujet:* ${message}`
    );
    
    setTimeout(() => {
      window.open(`https://wa.me/221756490565?text=${whatsappMsg}`, '_blank');
      contactForm.reset();
      timeSelect.disabled = true;
      setTimeout(() => {
        document.getElementById('form-success').style.display = 'none';
      }, 5000);
    }, 1500);
  });
}

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

// ===== CAROUSEL =====
const carouselTrack = document.querySelector('.carousel-track');
if (carouselTrack) {
  const slides = Array.from(carouselTrack.children);
  const nextBtn = document.querySelector('.next-btn');
  const prevBtn = document.querySelector('.prev-btn');
  const dotsNav = document.querySelector('.carousel-dots');
  
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => moveToSlide(index));
    dotsNav.appendChild(dot);
  });
  
  const dots = Array.from(dotsNav.children);
  let currentIndex = 0;

  function moveToSlide(index) {
    carouselTrack.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
    currentIndex = index;
  }

  nextBtn.addEventListener('click', () => {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= slides.length) nextIndex = 0;
    moveToSlide(nextIndex);
  });

  prevBtn.addEventListener('click', () => {
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) prevIndex = slides.length - 1;
    moveToSlide(prevIndex);
  });

  // Auto slide
  setInterval(() => {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= slides.length) nextIndex = 0;
    moveToSlide(nextIndex);
  }, 4000);
}

// ===== FREE TRAINING FORM HANDLING =====
const freeForm = document.getElementById('freeTrainingForm');
if (freeForm) {
  freeForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const prenomInput = document.getElementById('free-prenom');
    const nomInput = document.getElementById('free-nom');
    const emailInput = document.getElementById('free-email');
    const telInput = document.getElementById('free-tel');

    const emailError = document.getElementById('free-email-error');
    const telError = document.getElementById('free-tel-error');
    const successBlock = document.getElementById('free-success');
    const successName = document.getElementById('free-success-name');

    // Reset errors
    emailError.style.display = 'none';
    telError.style.display = 'none';
    emailInput.classList.remove('invalid');
    telInput.classList.remove('invalid');

    // Get and sanitize values
    const prenom = sanitizeHTML(prenomInput.value.trim());
    const nom = sanitizeHTML(nomInput.value.trim());
    const email = sanitizeHTML(emailInput.value.trim());
    const tel = sanitizeHTML(telInput.value.trim());

    let hasError = false;

    // Validate email ends with @gmail.com
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      emailError.style.display = 'block';
      emailInput.classList.add('invalid');
      hasError = true;
    }

    // Validate telephone (must be valid digits, spaces, hyphens, plus sign)
    const telRegex = /^[0-9\s+\-()]{7,20}$/;
    if (!telRegex.test(tel)) {
      telError.style.display = 'block';
      telInput.classList.add('invalid');
      hasError = true;
    }

    if (hasError) return;

    // Save registration info in localStorage (safely)
    try {
      const registrations = JSON.parse(localStorage.getItem('free_training_registrations') || '[]');
      registrations.push({
        prenom,
        nom,
        email,
        tel,
        date: new Date().toISOString()
      });
      localStorage.setItem('free_training_registrations', JSON.stringify(registrations));
    } catch (err) {
      console.error("Error saving registration:", err);
    }

    // Show success message
    freeForm.style.display = 'none';
    successName.textContent = prenom;
    successBlock.style.display = 'flex';
  });
}

// ===== GALERIE SLIDESHOW =====
(function() {
  const track = document.getElementById('galerieTrack');
  if (!track) return;

  const slides = Array.from(track.children);
  const dotsContainer = document.getElementById('galerieDots');
  const prevBtn = document.getElementById('galeriePrev');
  const nextBtn = document.getElementById('galerieNext');
  let current = 0;
  let autoTimer = null;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('galerie-dot');
    dot.setAttribute('aria-label', `Photo ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });
  const dots = Array.from(dotsContainer.children);

  function goTo(index) {
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    slides[current].classList.add('is-active');
    dots[current].classList.add('active');
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 4000);
  }
  function stopAuto() { clearInterval(autoTimer); }

  prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

  // Touch / swipe support
  let touchStartX = 0;
  track.parentElement.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.parentElement.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      stopAuto();
      goTo(diff > 0 ? current + 1 : current - 1);
      startAuto();
    }
  }, { passive: true });

  // Init first slide
  goTo(0);
  startAuto();
})();
