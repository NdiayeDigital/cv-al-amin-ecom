// ===== SPA NAVIGATION =====
const allSections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');

function showPage(pageId) {
  // Hide all sections
  allSections.forEach(section => {
    section.classList.remove('page-active');
    section.classList.add('page-hidden');
  });

  if (pageId === 'accueil') {
    // Show accueil and parcours together on the Home page
    ['accueil', 'parcours'].forEach(id => {
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
    const selectedDate = this.value;
    timeSelect.innerHTML = '<option value="">Choisissez une heure</option>';
    
    if (selectedDate) {
      timeSelect.disabled = false;
      // Fetch booked times from localStorage
      const bookedData = JSON.parse(localStorage.getItem('rdv_bookings') || '{}');
      const bookedTimes = bookedData[selectedDate] || [];

      availableHours.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
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
    const nom = document.getElementById('form-nom').value;
    const prenom = document.getElementById('form-prenom').value;
    const email = document.getElementById('form-email').value;
    const tel = document.getElementById('form-tel').value;
    const date = document.getElementById('form-date').value;
    const time = document.getElementById('form-time').value;
    const message = document.getElementById('form-message').value;
    
    if (!time) {
      alert("Veuillez choisir une heure pour le rendez-vous.");
      return;
    }

    // Save booking to localStorage
    const bookedData = JSON.parse(localStorage.getItem('rdv_bookings') || '{}');
    if (!bookedData[date]) {
      bookedData[date] = [];
    }
    bookedData[date].push(time);
    localStorage.setItem('rdv_bookings', JSON.stringify(bookedData));

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
