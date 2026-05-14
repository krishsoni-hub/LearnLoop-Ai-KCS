// ===== LearnLoop AI — Main JavaScript =====

// Wait for DOM + Lucide icons
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) lucide.createIcons();

  // ===== SCROLL REVEAL =====
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ===== MOBILE MENU =====
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
    });
  });

  // ===== COUNTER ANIMATION =====
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

  function animateCounter(el, target) {
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ===== MODAL =====
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');

  function openModal(mode = 'register') {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    const registerView = document.getElementById('registerView');
    const loginView = document.getElementById('loginView');
    if (registerView && loginView) {
      if (mode === 'login') {
        registerView.style.display = 'none';
        loginView.style.display = 'block';
      } else {
        registerView.style.display = 'block';
        loginView.style.display = 'none';
      }
    }
  }
  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Open modal buttons
  ['signupBtn', 'heroGetStarted', 'ctaGetStarted'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', () => openModal('register'));
  });

  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) loginBtn.addEventListener('click', () => openModal('login'));

  // Toggle buttons
  const toggleToLogin = document.getElementById('toggleToLogin');
  if (toggleToLogin) toggleToLogin.addEventListener('click', (e) => { e.preventDefault(); openModal('login'); });
  
  const toggleToRegister = document.getElementById('toggleToRegister');
  if (toggleToRegister) toggleToRegister.addEventListener('click', (e) => { e.preventDefault(); openModal('register'); });

  // Close modal
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ===== SIGNUP FORM & ROLE LOGIC =====
  let completeProfilePending = false;
  let completeProfilePanel = null;
  let profileBtnRef = null;

  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signupName').value;
      const roleSelect = document.getElementById('signupRole');
      const role = roleSelect ? roleSelect.value : 'both';
      const btn = signupForm.querySelector('button[type="submit"]');
      
      btn.textContent = `Welcome, ${name}! 🎉`;
      btn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
      btn.disabled = true;
      
      setTimeout(() => {
        closeModal();
        signupForm.reset();
        btn.textContent = 'Create Account';
        btn.style.background = '';
        btn.disabled = false;
        
        // Update UI with registered user
        const navActions = document.querySelector('.nav-actions');
        if (navActions) {
          navActions.innerHTML = `<div style="display:flex; align-items:center; gap:0.5rem; font-weight:600; padding: 0.5rem 1rem; border-radius: 8px; background: rgba(255,255,255,0.05);"><div style="width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg, #E67E22, #F39C12); color:#fff; display:flex; align-items:center; justify-content:center; font-size:0.9rem;">${name.charAt(0).toUpperCase()}</div> <span>${name}</span></div>`;
        }
        
        // Handle Role Visibility
        const studentTab = document.querySelector('.dash-tab[data-tab="student"]');
        const tutorTab = document.querySelector('.dash-tab[data-tab="tutor"]');
        if (role === 'learn') {
          if (tutorTab) tutorTab.style.display = 'none';
          if (studentTab) { studentTab.style.display = 'inline-flex'; studentTab.click(); }
        } else if (role === 'teach') {
          if (studentTab) studentTab.style.display = 'none';
          if (tutorTab) { tutorTab.style.display = 'inline-flex'; tutorTab.click(); }
        } else {
          if (studentTab) studentTab.style.display = 'inline-flex';
          if (tutorTab) tutorTab.style.display = 'inline-flex';
        }
        
        // Handle Complete Profile Credits
        if (completeProfilePending) {
          completeProfilePending = false;
          if (typeof window.awardCredits === 'function') {
            const isStudent = completeProfilePanel && completeProfilePanel.id === 'panel-student';
            window.awardCredits(5, isStudent);
            
            if (profileBtnRef) {
              profileBtnRef.innerHTML = `<i data-lucide="check-circle"></i> Profile Complete`;
              profileBtnRef.style.background = 'rgba(46, 204, 113, 0.2)';
              profileBtnRef.style.borderColor = '#2ecc71';
              profileBtnRef.style.color = '#2ecc71';
              profileBtnRef.disabled = true;
              if (window.lucide) lucide.createIcons();
            }
          }
        }
      }, 1500);
    });
  }

  // ===== LOGIN FORM =====
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const name = email.split('@')[0]; // Simple extraction for demo
      const btn = loginForm.querySelector('button[type="submit"]');
      btn.textContent = `Welcome back, ${name}! 🎉`;
      btn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
      btn.disabled = true;
      setTimeout(() => {
        closeModal();
        loginForm.reset();
        btn.textContent = 'Log In';
        btn.style.background = '';
        btn.disabled = false;
        
        // Update UI with logged in user
        const navActions = document.querySelector('.nav-actions');
        if (navActions) {
          navActions.innerHTML = `<div style="display:flex; align-items:center; gap:0.5rem; font-weight:600; padding: 0.5rem 1rem; border-radius: 8px; background: rgba(255,255,255,0.05);"><div style="width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg, #E67E22, #F39C12); color:#fff; display:flex; align-items:center; justify-content:center; font-size:0.9rem;">${name.charAt(0).toUpperCase()}</div> <span>${name}</span></div>`;
        }
      }, 1500);
    });
  }

  // ===== CTA LEARN MORE =====
  const ctaLearnMore = document.getElementById('ctaLearnMore');
  if (ctaLearnMore) {
    ctaLearnMore.addEventListener('click', () => {
      document.getElementById('info').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ===== DASHBOARD TABS =====
  const dashTabs = document.querySelectorAll('.dash-tab');
  const dashPanels = document.querySelectorAll('.dash-panel');

  dashTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      dashTabs.forEach(t => t.classList.remove('active'));
      dashPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`panel-${target}`).classList.add('active');
      // Re-init lucide icons for the new panel
      if (window.lucide) lucide.createIcons();
    });
  });

  // ===== DASHBOARD SIDEBAR NAVIGATION =====
  document.querySelectorAll('.mock-sidebar .mock-nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      // 1. Update active class on sidebar items
      const sidebar = item.closest('.mock-sidebar');
      sidebar.querySelectorAll('.mock-nav-item').forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      // 2. Get the main content area for this specific dashboard panel
      const panel = item.closest('.dash-panel');
      if (!panel) return;
      const mainContent = panel.querySelector('.mock-main');
      const widgets = mainContent.querySelectorAll('.mock-widget');
      
      // 3. Determine which view to show based on text content
      const viewName = item.textContent.trim().toLowerCase();
      
      widgets.forEach(widget => {
        // Reset display
        widget.style.display = 'none';
        
        // Show based on selection
        if (viewName.includes('dashboard') || viewName.includes('overview')) {
          widget.style.display = 'flex'; // Default flex display
        } else if (viewName.includes('wallet') || viewName.includes('earning')) {
          if (widget.classList.contains('mock-wallet')) widget.style.display = 'flex';
        } else if (viewName.includes('request') || viewName.includes('session') || viewName.includes('moderation')) {
          if (widget.classList.contains('mock-requests')) widget.style.display = 'flex';
        } else if (viewName.includes('badge') || viewName.includes('top tutors')) {
          if (widget.classList.contains('mock-badges')) widget.style.display = 'flex';
        } else if (viewName.includes('progress')) {
          if (widget.classList.contains('mock-radar') || widget.classList.contains('mock-leaderboard') || widget.classList.contains('mock-ai-rec') || widget.classList.contains('mock-streak')) {
            widget.style.display = 'flex';
          }
        } else if (viewName.includes('streak') || viewName.includes('coverage gaps')) {
          if (widget.classList.contains('mock-streak')) widget.style.display = 'flex';
        } else if (viewName.includes('review')) {
          if (widget.classList.contains('mock-reviews')) widget.style.display = 'flex';
        } else if (viewName.includes('user')) {
          if (widget.classList.contains('mock-wallet') || widget.classList.contains('mock-leaderboard')) {
            widget.style.display = 'flex';
          }
        } else if (viewName.includes('announce')) {
          if (widget.classList.contains('mock-ai-rec')) widget.style.display = 'flex';
        } else {
          // Fallback
          widget.style.display = 'flex';
        }
      });
    });
  });

  // ===== DEEP DIVE EXPAND/COLLAPSE =====
  document.querySelectorAll('.dd-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't toggle if clicking a link inside
      if (e.target.closest('a')) return;
      card.classList.toggle('expanded');
      if (window.lucide) lucide.createIcons();
    });
  });

  // ===== PROMPT CARD EXPAND/COLLAPSE =====
  document.querySelectorAll('.prompt-card').forEach(card => {
    const header = card.querySelector('.prompt-header');
    header.addEventListener('click', () => {
      card.classList.toggle('expanded');
      if (window.lucide) lucide.createIcons();
    });
  });

  // ===== SMOOTH SCROLL FOR NAV =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ===== ACTIVE NAV LINK HIGHLIGHT =====
  const sections = document.querySelectorAll('.section[id], .hero[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => activeObserver.observe(s));

  // ===== INTERACTIVE CREDIT EARNING & BADGES =====
  let studentCredits = 142;
  let tutorCredits = 384;
  
  const studentAwardedBadges = new Set([101]);
  const tutorAwardedBadges = new Set([101, 251]);

  const BADGE_TIERS = [
    { threshold: 101, text: '📖 Lvl 2: Learner' },
    { threshold: 251, text: '🤝 Lvl 3: Contributor' },
    { threshold: 451, text: '👨‍🏫 Lvl 4: Tutor' },
    { threshold: 701, text: '🧠 Lvl 5: Expert' },
    { threshold: 1001, text: '🌟 Lvl 6: Mentor' },
    { threshold: 1401, text: '👑 Lvl 7: Elite' }
  ];

  function checkBadges(currentCredits, badgeListElement, awardedSet) {
    if (!badgeListElement) return;
    
    BADGE_TIERS.forEach(tier => {
      if (currentCredits >= tier.threshold && !awardedSet.has(tier.threshold)) {
        awardedSet.add(tier.threshold);
        const badgeElement = document.createElement('span');
        badgeElement.className = 'mock-badge';
        badgeElement.textContent = tier.text;
        badgeElement.style.animation = 'popIn 0.3s ease-out forwards';
        badgeListElement.prepend(badgeElement);
      }
    });
  }

  window.awardCredits = function(kcAmount, isStudent) {
    let walletDisplay, badgeListElement, awardedSet, currentValue;
    if (isStudent) {
      studentCredits += kcAmount;
      walletDisplay = document.getElementById('studentWalletValue');
      badgeListElement = document.getElementById('studentBadgeList');
      awardedSet = studentAwardedBadges;
      currentValue = studentCredits;
    } else {
      tutorCredits += kcAmount;
      walletDisplay = document.getElementById('tutorWalletValue');
      badgeListElement = document.getElementById('tutorBadgeList');
      awardedSet = tutorAwardedBadges;
      currentValue = tutorCredits;
    }
    
    if (walletDisplay) {
      walletDisplay.innerHTML = `${currentValue} <small>KC</small>`;
      walletDisplay.style.transform = 'scale(1.1)';
      walletDisplay.style.color = '#2ecc71';
      setTimeout(() => {
        walletDisplay.style.transform = 'scale(1)';
        walletDisplay.style.color = '';
      }, 300);
    }
    checkBadges(currentValue, badgeListElement, awardedSet);
  };

  const videoInput = document.getElementById('videoUploadInput');
  const resourceInput = document.getElementById('resourceUploadInput');

  if (videoInput) {
    videoInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0 && window._currentActionBtn) {
        window.awardCredits(10, false);
        setButtonEarnedState(window._currentActionBtn, 10);
      }
    });
  }
  
  if (resourceInput) {
    resourceInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0 && window._currentActionBtn) {
        window.awardCredits(2, false);
        setButtonEarnedState(window._currentActionBtn, 2);
      }
    });
  }

  function setButtonEarnedState(btn, amount, temporary = true) {
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i data-lucide="check-circle"></i> Earned (+${amount})`;
    btn.style.background = 'rgba(46, 204, 113, 0.2)';
    btn.style.borderColor = '#2ecc71';
    btn.style.color = '#2ecc71';
    btn.disabled = true;
    if (window.lucide) lucide.createIcons();
    
    if (temporary) {
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
        btn.disabled = false;
        if (window.lucide) lucide.createIcons();
      }, 1500);
    }
  }

  document.querySelectorAll('.earn-kc-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      if (this.disabled) return;
      
      const action = this.getAttribute('data-action');
      const kcAmount = parseInt(this.getAttribute('data-kc'), 10);
      const isStudent = this.closest('.dash-panel')?.id === 'panel-student';
      
      window._currentActionBtn = this;

      if (action === 'complete-profile') {
        completeProfilePending = true;
        completeProfilePanel = this.closest('.dash-panel');
        profileBtnRef = this;
        
        // Open modal and switch to register view
        if (typeof openModal === 'function') openModal('register');
        return;
      }
      
      if (action === 'daily-checkin') {
        window.awardCredits(1, true);
        this.innerHTML = `<i data-lucide="check-circle"></i> Checked in ✅`;
        this.style.background = 'rgba(46, 204, 113, 0.2)';
        this.style.borderColor = '#2ecc71';
        this.style.color = '#2ecc71';
        this.disabled = true;
        if (window.lucide) lucide.createIcons();
        return;
      }
      
      if (action === 'attend-lecture') {
        window.awardCredits(7, true);
        setButtonEarnedState(this, 7, true);
        const tutorTab = document.querySelector('.dash-tab[data-tab="tutor"]');
        if (tutorTab) tutorTab.click();
        return;
      }
      
      if (action === 'upload-video' && videoInput) {
        videoInput.click();
        return;
      }
      
      if (action === 'upload-resource' && resourceInput) {
        resourceInput.click();
        return;
      }
      
      // Fallback
      window.awardCredits(kcAmount, isStudent);
      setButtonEarnedState(this, kcAmount);
    });
  });

  // Inject dynamic animation for badges
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    @keyframes popIn {
      0% { transform: scale(0.5); opacity: 0; }
      70% { transform: scale(1.1); }
      100% { transform: scale(1); opacity: 1; }
    }
    .mock-widget-value { transition: transform 0.3s ease, color 0.3s ease; display: inline-block; }
  `;
  document.head.appendChild(styleSheet);
});
