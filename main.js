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
  
  // Thousands separator follows the page language (1.258 / 1,258)
  const statLocale = document.documentElement.lang.startsWith('es') ? 'es-CL' : 'en-US';
  const formatStat = (value) => Number(value).toLocaleString(statLocale);

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
        element.textContent = formatStat(target);
        clearInterval(timer);
      } else {
        // Round to nearest integer if integer, or keep decimals if necessary
        element.textContent = formatStat(Math.floor(current));
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
      num.textContent = formatStat(num.getAttribute('data-target'));
    });
  }

  // 4b. STAT DETAIL PANEL (expands inline below the stats bar)
  const statPanel = document.getElementById('stat-panel');
  if (statPanel) {
    const statButtons = document.querySelectorAll('.stat-item[data-stat]');
    const panelCard = statPanel.querySelector('.stat-panel-card');
    const panelFigure = statPanel.querySelector('.stat-panel-figure');
    const panelTitle = statPanel.querySelector('.stat-panel-title');
    const panelIntro = statPanel.querySelector('.stat-panel-intro');
    const panelBody = statPanel.querySelector('.stat-panel-body');
    const panelMore = statPanel.querySelector('.stat-panel-more');
    let activeButton = null;

    // Universities (the survey institutions, flagged with data-survey in the partner strip)
    // and publications are read from the page so the panel stays in sync
    const buildUniversities = (tpl, total) => {
      const groups = document.createElement('div');
      groups.className = 'stat-uni-groups';
      let listed = 0;
      ['public', 'cruch', 'private'].forEach(key => {
        const partners = document.querySelectorAll('.partners-list .partner-item[data-survey="' + key + '"]');
        if (!partners.length) return;
        listed += partners.length;
        const group = document.createElement('section');
        group.className = 'stat-uni-group';
        const heading = document.createElement('h3');
        const count = document.createElement('span');
        count.className = 'stat-uni-count';
        count.textContent = partners.length;
        heading.appendChild(count);
        heading.appendChild(document.createTextNode(tpl.dataset['group' + key.charAt(0).toUpperCase() + key.slice(1)]));
        group.appendChild(heading);
        const list = document.createElement('ul');
        list.className = 'stat-uni-list';
        partners.forEach(partner => {
          const item = document.createElement('li');
          const link = document.createElement('a');
          link.href = partner.href;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          const logo = partner.querySelector('img');
          if (logo) {
            const img = document.createElement('img');
            img.src = logo.src;
            img.alt = '';
            link.appendChild(img);
          }
          link.appendChild(document.createTextNode(partner.title || partner.textContent.trim()));
          item.appendChild(link);
          list.appendChild(item);
        });
        group.appendChild(list);
        groups.appendChild(group);
      });
      panelBody.appendChild(groups);
      const missing = total - listed;
      if (missing > 0 && tpl.dataset.missing) {
        const note = document.createElement('p');
        note.className = 'stat-panel-note';
        note.textContent = tpl.dataset.missing.replace('{n}', missing);
        panelBody.appendChild(note);
      }
    };

    const buildPublications = () => {
      const list = document.createElement('ul');
      list.className = 'stat-pub-grid';
      document.querySelectorAll('.pub-card').forEach(card => {
        const item = document.createElement('li');
        const type = card.querySelector('.pub-type');
        const citation = card.querySelector('.pub-citation');
        if (type) {
          const tag = document.createElement('span');
          tag.className = 'stat-pub-type';
          tag.textContent = type.textContent;
          item.appendChild(tag);
        }
        if (citation) {
          Array.from(citation.cloneNode(true).childNodes).forEach(node => item.appendChild(node));
        }
        list.appendChild(item);
      });
      panelBody.appendChild(list);
    };

    const placeNotch = () => {
      if (!activeButton) return;
      const button = activeButton.getBoundingClientRect();
      const card = panelCard.getBoundingClientRect();
      panelCard.style.setProperty('--notch-x', (button.left + button.width / 2 - card.left) + 'px');
    };

    const closePanel = () => {
      statPanel.classList.remove('is-open');
      statButtons.forEach(button => button.setAttribute('aria-expanded', 'false'));
      activeButton = null;
    };

    const openPanel = (button) => {
      const tpl = document.getElementById('stat-tpl-' + button.dataset.stat);
      if (!tpl) return;
      const total = button.querySelector('.stat-number').getAttribute('data-target');
      panelFigure.textContent = formatStat(total) + (button.querySelector('.stat-plus') ? '+' : '');
      panelTitle.textContent = tpl.dataset.title;
      panelIntro.textContent = tpl.dataset.intro;
      panelBody.replaceChildren(tpl.content.cloneNode(true));
      if (button.dataset.stat === 'universities') {
        buildUniversities(tpl, parseInt(total, 10));
      } else if (button.dataset.stat === 'publications') {
        buildPublications();
      }
      panelMore.href = tpl.dataset.moreHref;
      if ('moreExternal' in tpl.dataset) {
        panelMore.target = '_blank';
        panelMore.rel = 'noopener noreferrer';
      } else {
        panelMore.removeAttribute('target');
        panelMore.removeAttribute('rel');
      }
      panelMore.firstChild.textContent = tpl.dataset.moreLabel;

      statButtons.forEach(other => other.setAttribute('aria-expanded', other === button ? 'true' : 'false'));
      activeButton = button;
      // Measure against the fully open layout: the hero re-centres while the panel grows
      const wasOpen = statPanel.classList.contains('is-open');
      statPanel.style.transition = 'none';
      statPanel.classList.add('is-open');
      placeNotch();
      const bar = button.closest('.hero-stats').getBoundingClientRect();
      // Bring the bar and the start of the panel into view below the sticky header;
      // when the bar is too tall for that (stacked on small screens), favour the panel
      const anchor = bar.height > window.innerHeight * 0.45 ? statPanel.getBoundingClientRect().top - 24 : bar.top;
      const top = anchor + window.scrollY - 96;
      if (!wasOpen) {
        statPanel.classList.remove('is-open');
        void statPanel.offsetHeight;
      }
      statPanel.style.transition = '';
      statPanel.classList.add('is-open');
      window.scrollTo({ top: top, behavior: 'smooth' });
    };

    statButtons.forEach(button => {
      button.addEventListener('click', () => {
        if (button === activeButton) {
          closePanel();
        } else {
          openPanel(button);
        }
      });
    });

    statPanel.querySelector('.stat-panel-close').addEventListener('click', () => {
      const opener = activeButton;
      closePanel();
      if (opener) opener.focus();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && activeButton) {
        const opener = activeButton;
        closePanel();
        opener.focus();
      }
    });
    window.addEventListener('resize', placeNotch);
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
  }

  // 9. MAILTO COPY TO CLIPBOARD FALLBACK & TOAST
  const mailtoLinks = document.querySelectorAll('a[href^="mailto:"]');
  mailtoLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const email = link.getAttribute('href').replace('mailto:', '');
      
      // Copy to clipboard
      navigator.clipboard.writeText(email).then(() => {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'email-toast';
        const isEnglish = document.documentElement.lang === 'en';
        toast.textContent = isEnglish ? `Email copied: ${email}` : `Correo copiado: ${email}`;
        
        // Inline styles for toast
        toast.style.position = 'fixed';
        toast.style.bottom = '30px';
        toast.style.left = '50%';
        toast.style.transform = 'translate(-50%, 10px)';
        toast.style.backgroundColor = 'var(--navy, #0f172a)';
        toast.style.color = 'var(--white, #ffffff)';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = 'var(--border-radius-md, 8px)';
        toast.style.boxShadow = 'var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1))';
        toast.style.zIndex = '9999';
        toast.style.fontFamily = 'var(--font-sans, sans-serif)';
        toast.style.fontSize = '0.9rem';
        toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        toast.style.opacity = '0';
        
        document.body.appendChild(toast);
        
        // Trigger reflow
        toast.offsetHeight;
        
        // Fade in
        toast.style.opacity = '1';
        toast.style.transform = 'translate(-50%, 0)';
        
        // Fade out and remove
        setTimeout(() => {
          toast.style.opacity = '0';
          toast.style.transform = 'translate(-50%, 10px)';
          setTimeout(() => toast.remove(), 300);
        }, 3000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  });
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
