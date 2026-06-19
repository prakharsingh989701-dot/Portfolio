/* =====================================================
   1. LOADER
   Hides the #loader screen after the page is ready
   ===================================================== */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const fill = loader.querySelector('.loader-fill');
  const text = loader.querySelector('.loader-text');

  const messages = ['Initializing...', 'Loading assets...', 'Almost there...'];
  let msgIndex = 0;

  const msgTimer = setInterval(() => {
    msgIndex++;
    if (text && msgIndex < messages.length) text.textContent = messages[msgIndex];
  }, 700);

  window.addEventListener('load', () => {
    clearInterval(msgTimer);
    // Give the bar animation time to finish (CSS: 2s)
    setTimeout(() => {
      loader.classList.add('hidden');
      // Kick off page-entry animations after loader hides
      startPageAnimations();
    }, 400);
  });
})();


/* =====================================================
   2. NAVBAR
   - Scrolled class for background
   - Hamburger mobile menu toggle
   - Close menu on nav-link click
   - Active link highlight on scroll
   ===================================================== */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const links     = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');

  if (!navbar) return;

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });
  }

  // Close mobile menu when a nav link is clicked
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks && navLinks.classList.remove('open');
      hamburger && hamburger.classList.remove('open');
    });
  });

  // Scroll-based: scrolled class + active link
  function onScroll() {
    const scrollY = window.scrollY;

    // Navbar background
    navbar.classList.toggle('scrolled', scrollY > 50);

    // Active link – find which section is in view
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (scrollY >= top) current = section.getAttribute('id');
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* =====================================================
   3. SCROLL PROGRESS BAR
   Updates #scroll-progress width based on page scroll
   ===================================================== */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = pct + '%';
  }, { passive: true });
})();


/* =====================================================
   4. BACK TO TOP BUTTON
   Shows/hides the #back-to-top button and scrolls up
   ===================================================== */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* =====================================================
   5. TYPING EFFECT
   Types out roles in the hero section via #typed-text
   ===================================================== */
(function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const roles = [
    'Full Stack Developer',
    'Backend Enthusiast',
    'BCA Student',
    'Problem Solver',
    'Continuous Learner',
  ];

  let roleIndex  = 0;
  let charIndex  = 0;
  let deleting   = false;
  let pauseTimer = null;

  const TYPING_SPEED   = 90;
  const DELETING_SPEED = 50;
  const PAUSE_AFTER    = 1800;
  const PAUSE_BEFORE   = 400;

  function type() {
    const currentRole = roles[roleIndex];

    if (!deleting) {
      el.textContent = currentRole.slice(0, ++charIndex);
      if (charIndex === currentRole.length) {
        deleting = true;
        pauseTimer = setTimeout(type, PAUSE_AFTER);
        return;
      }
    } else {
      el.textContent = currentRole.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        pauseTimer = setTimeout(type, PAUSE_BEFORE);
        return;
      }
    }

    pauseTimer = setTimeout(type, deleting ? DELETING_SPEED : TYPING_SPEED);
  }

  // Small initial delay so it starts after the loader hides
  setTimeout(type, 2600);
})();


/* =====================================================
   6. ANIMATED COUNTERS
   Counts up .stat-num elements to their data-target value
   ===================================================== */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  counters.forEach(counter => {
    const target   = parseInt(counter.getAttribute('data-target'), 10);
    const duration = 1600; // ms
    const start    = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else counter.textContent = target;
    }

    requestAnimationFrame(update);
  });
}


/* =====================================================
   7. SCROLL REVEAL
   Observes [data-reveal] and [data-reveal-right] elements
   and adds .visible when they enter the viewport
   ===================================================== */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('[data-reveal], [data-reveal-right]');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
})();


/* =====================================================
   8. SKILL & GOAL PROGRESS BARS
   Animates .skill-fill and .goal-fill bars when visible
   ===================================================== */
(function initProgressBars() {
  const fills = document.querySelectorAll('.skill-fill[data-width], .goal-fill[data-width], .tl-progress-fill');

  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el  = entry.target;
        const w   = el.getAttribute('data-width') || el.style.width; // tl-progress-fill uses inline style
        // For tl-progress-fill the width is already set inline via style=""
        if (el.getAttribute('data-width')) {
          // slight delay so CSS transition is visible
          requestAnimationFrame(() => {
            el.style.width = el.getAttribute('data-width') + '%';
          });
        }
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  fills.forEach(el => {
    // Reset data-width bars to 0 so the animation plays
    if (el.getAttribute('data-width')) el.style.width = '0%';
    observer.observe(el);
  });
})();


/* =====================================================
   9. PARTICLE CANVAS
   Draws a subtle animated particle field in the hero
   ===================================================== */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles;
  const COUNT     = 70;
  const MAX_DIST  = 120;
  const COLOR     = '108,99,255';

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = Array.from({ length: COUNT }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r:  Math.random() * 1.5 + 0.5,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${COLOR},0.55)`;
      ctx.fill();
    });

    // Connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${COLOR},${0.15 * (1 - dist / MAX_DIST)})`;
          ctx.lineWidth   = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  // Respect reduced-motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('resize', () => { resize(); createParticles(); }, { passive: true });
  resize();
  createParticles();
  draw();
})();


/* =====================================================
   10. CONTACT FORM – Send Button Feedback
   Simulates a form submission with visual feedback
   (wire up to a real backend / EmailJS as needed)
   ===================================================== 
(function initContactForm() {
  const btn      = document.getElementById('send-btn');
  const nameEl   = document.getElementById('name');
  const emailEl  = document.getElementById('email');
  const subjectEl= document.getElementById('subject');
  const msgEl    = document.getElementById('message');

  if (!btn) return;

  btn.addEventListener('click', () => {
    const name    = nameEl   ? nameEl.value.trim()    : '';
    const email   = emailEl  ? emailEl.value.trim()   : '';
    const subject = subjectEl? subjectEl.value.trim() : '';
    const message = msgEl    ? msgEl.value.trim()     : '';

    // Basic validation
    if (!name || !email || !message) {
      showFormStatus(btn, 'Please fill in all required fields.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFormStatus(btn, 'Please enter a valid email address.', 'error');
      return;
    }

    // Simulate sending (replace with real fetch/EmailJS call)
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.background = 'linear-gradient(135deg,#4ecdc4,#44b89e)';
      if (nameEl)    nameEl.value    = '';
      if (emailEl)   emailEl.value   = '';
      if (subjectEl) subjectEl.value = '';
      if (msgEl)     msgEl.value     = '';

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        btn.style.background = '';
      }, 3500);
    }, 1500);
  });

  function showFormStatus(btn, message, type) {
    // Briefly flash the button
    const original = btn.innerHTML;
    btn.innerHTML = `<i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check'}"></i> ${message}`;
    btn.style.background = type === 'error'
      ? 'linear-gradient(135deg,#f5576c,#c0392b)'
      : 'linear-gradient(135deg,#4ecdc4,#44b89e)';
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
    }, 2500);
  }
})();*/


/* =====================================================
   11. SMOOTH SCROLL FOR ANCHOR LINKS
   Handles links that point to #section IDs
   ===================================================== */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


/* =====================================================
   12. HERO COUNTER TRIGGER
   Fires the stat counter once the hero is in view
   ===================================================== */
(function initHeroCounters() {
  const statsSection = document.querySelector('.hero-stats');
  if (!statsSection) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      observer.disconnect();
    }
  }, { threshold: 0.5 });

  observer.observe(statsSection);
})();


/* =====================================================
   13. PAGE ENTRY ANIMATIONS
   Called after loader hides; kicks off reveal for
   hero elements that aren't IntersectionObserver-driven
   ===================================================== */
function startPageAnimations() {
  // Immediately reveal hero elements
  document.querySelectorAll('.hero [data-reveal], .hero [data-reveal-right]').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 150);
  });
}