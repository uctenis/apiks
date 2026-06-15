/* ==========================================================================
   APIKS CHILE - CORE INTERACTIVE SCRIPTS (main.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 1. STICKY HEADER SCROLL EFFECT
  const header = document.getElementById('site-header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once in case page loads scrolled

  // 2. MOBILE MENU TOGGLE (ACCESSIBILITY COMPLIANT)
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('active');
      mainNav.classList.toggle('active');
    });

    // Close menu when clicking a link
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('active');
        mainNav.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !navToggle.contains(e.target) && mainNav.classList.contains('active')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('active');
        mainNav.classList.remove('active');
      }
    });
  }

  // 3. INTERSECTION OBSERVER FOR AOS ANIMATIONS (FADE-UP, FADE-IN, ETC)
  const aosElements = document.querySelectorAll('[data-aos]');
  if ('IntersectionObserver' in window) {
    const aosObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add delay if specified
          const delay = entry.target.getAttribute('data-aos-delay');
          if (delay) {
            setTimeout(() => {
              entry.target.classList.add('aos-animate');
            }, parseInt(delay));
          } else {
            entry.target.classList.add('aos-animate');
          }
          // Unobserve after animating once
          aosObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    aosElements.forEach(element => aosObserver.observe(element));
  } else {
    // Fallback: animate everything if browser doesn't support IntersectionObserver
    aosElements.forEach(el => el.classList.add('aos-animate'));
  }

  // 4. STATS COUNTER ANIMATION
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const animateCounter = (element) => {
    const target = parseFloat(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const start = 0;
    const stepTime = 20; // 50 updates per second
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        // Round to nearest integer if integer, or keep decimals if necessary
        element.textContent = Math.floor(current);
      }
    }, stepTime);
  };

  if ('IntersectionObserver' in window && statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => counterObserver.observe(num));
  } else {
    // Fallback
    statNumbers.forEach(num => {
      num.textContent = num.getAttribute('data-target');
    });
  }

  // 5. BACK TO TOP BUTTON
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 6. FORM VALIDATION & INTERACTION (NEWSLETTER)
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = document.getElementById('newsletter-email');
      const successMsg = document.getElementById('form-success');
      
      if (!emailInput) return;
      
      const email = emailInput.value.trim();
      
      // Simple regex validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!emailRegex.test(email)) {
        emailInput.style.borderColor = '#dc2626';
        alert('Por favor, ingresa un correo electrónico institucional válido.');
        return;
      }
      
      // Successful submit representation
      emailInput.style.borderColor = '';
      emailInput.disabled = true;
      const submitBtn = newsletterForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      
      if (successMsg) {
        successMsg.hidden = false;
        successMsg.style.display = 'block';
      }
      
      // Reset after a delay
      setTimeout(() => {
        newsletterForm.reset();
        emailInput.disabled = false;
        if (submitBtn) submitBtn.disabled = false;
        if (successMsg) successMsg.style.display = 'none';
      }, 5000);
    });
  }

  // 7. HERO PARTICLES GENERATION (SIMPLE CSS-BASED ANIMATED DOTS)
  const heroParticlesContainer = document.getElementById('hero-particles');
  if (heroParticlesContainer) {
    const colors = ['rgba(34, 211, 238, 0.2)', 'rgba(6, 182, 212, 0.15)', 'rgba(255, 255, 255, 0.1)'];
    const particleCount = 25;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      
      const size = Math.random() * 6 + 2;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const delay = Math.random() * 10;
      const duration = Math.random() * 15 + 10;
      
      particle.style.position = 'absolute';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.borderRadius = '50%';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.opacity = Math.random() * 0.5 + 0.1;
      
      // Define inline animation
      particle.style.animation = `floatParticle ${duration}s infinite ease-in-out`;
      particle.style.animationDelay = `${delay}s`;
      
      heroParticlesContainer.appendChild(particle);
    }
  }

  // 8. PUBLICATIONS SEARCH & FILTER (CONSOLIDATED ON RESEARCH PAGE)
  const searchInput = document.getElementById('pub-search');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const pubCards = document.querySelectorAll('.pub-card');
  const resultsCount = document.getElementById('pub-results-count');
  const noResultsEl = document.getElementById('pub-no-results');
  const resetBtn = document.getElementById('pub-reset-btn');

  if (searchInput && pubCards.length > 0) {
    let activeType = 'all';
    let searchQuery = '';

    const filterPubs = () => {
      let visibleCount = 0;
      pubCards.forEach(card => {
        const type = card.getAttribute('data-type');
        const citationText = card.querySelector('.pub-citation').textContent.toLowerCase();

        const matchesType = activeType === 'all' || type === activeType;
        const matchesSearch = citationText.includes(searchQuery);

        if (matchesType && matchesSearch) {
          card.classList.remove('hidden');
          visibleCount++;
        } else {
          card.classList.add('hidden');
        }
      });

      // Update counter text
      if (resultsCount) {
        const total = pubCards.length;
        const isEnglish = document.documentElement.lang === 'en';
        if (isEnglish) {
          resultsCount.textContent = `Showing ${visibleCount} of ${total} publications`;
        } else {
          resultsCount.textContent = `Mostrando ${visibleCount} de ${total} publicaciones`;
        }
      }

      // Show/hide no results message
      if (noResultsEl) {
        if (visibleCount === 0) {
          noResultsEl.style.display = 'block';
        } else {
          noResultsEl.style.display = 'none';
        }
      }
    };

    // Search input event
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterPubs();
    });

    // Filter button click event
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeType = btn.getAttribute('data-type');
        filterPubs();
      });
    });

    // Reset button event
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        activeType = 'all';
        filterBtns.forEach(b => b.classList.remove('active'));
        const allBtn = document.querySelector('.filter-btn[data-type="all"]');
        if (allBtn) allBtn.classList.add('active');
        filterPubs();
      });
    }

    // Run once at load to set initial counter
    filterPubs();
  }
});

// Particle Float keyframes injected in page style
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes floatParticle {
    0%, 100% {
      transform: translateY(0) translateX(0);
    }
    50% {
      transform: translateY(-40px) translateX(20px);
    }
  }
`;
document.head.appendChild(styleSheet);
