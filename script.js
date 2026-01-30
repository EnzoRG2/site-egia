// ============================================
// NAVIGATION MOBILE
// ============================================

const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

if (mobileMenuToggle && navMenu) {
  mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
  });

  // Fermer le menu au clic sur un lien
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
    });
  });

  // Fermer le menu au clic en dehors
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
      navMenu.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
    }
  });
}

// ============================================
// HEADER SCROLL EFFECT
// ============================================

const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
  } else {
    header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
  }

  lastScroll = currentScroll;
});

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    
    if (target) {
      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition = target.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================
// FORM HANDLING
// ============================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Récupération des données du formulaire
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Validation basique
    if (!data.nom || !data.email || !data.telephone || !data.message) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    
    // Ici, tu peux ajouter l'envoi vers ton backend/API
    // Exemple avec fetch :
    /*
    fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
      alert('Message envoyé avec succès !');
      contactForm.reset();
    })
    .catch(error => {
      console.error('Erreur:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    });
    */
    
    // Pour l'instant, affichage console et message de confirmation
    console.log('Données du formulaire:', data);
    alert('Merci pour votre message ! Nous vous contacterons dans les plus brefs délais.');
    contactForm.reset();
  });
}

// ============================================
// ANIMATION ON SCROLL
// ============================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observer les cartes de services et réalisations
document.querySelectorAll('.service-card, .realisation-card, .expertise-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ============================================
// CURRENT YEAR IN FOOTER
// ============================================

const currentYearElement = document.getElementById('currentYear');
if (currentYearElement) {
  currentYearElement.textContent = new Date().getFullYear();
}

// ============================================
// LAZY LOADING IMAGES (si pas déjà géré par le navigateur)
// ============================================

if ('loading' in HTMLImageElement.prototype) {
  // Le navigateur supporte le lazy loading natif
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.src = img.dataset.src || img.src;
  });
} else {
  // Fallback pour les navigateurs plus anciens
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ============================================
// STATS COUNTER ANIMATION
// ============================================

const animateCounter = (element, target, duration = 2000) => {
  let start = 0;
  const increment = target / (duration / 16);
  
  const updateCounter = () => {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '');
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target + (element.textContent.includes('+') ? '+' : '');
    }
  };
  
  updateCounter();
};

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumber = entry.target.querySelector('.stat-number');
      if (statNumber && !statNumber.dataset.animated) {
        const text = statNumber.textContent;
        const number = parseInt(text.replace(/\D/g, ''));
        if (!isNaN(number)) {
          statNumber.dataset.animated = 'true';
          statNumber.textContent = '0' + (text.includes('+') ? '+' : '');
          animateCounter(statNumber, number, 2000);
        }
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
  statsObserver.observe(stat);
});
