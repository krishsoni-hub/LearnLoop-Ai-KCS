import re

filepath = r'd:\My Projects\LearnLoop-AI\main.js'

with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# --- Section 1: Replace signupForm logic ---
signup_old = """  // ===== SIGNUP FORM =====
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signupName').value;
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
      }, 1500);
    });
  }"""

signup_new = """  // ===== SIGNUP FORM & ROLE LOGIC =====
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
  }"""

if signup_old in text:
    text = text.replace(signup_old, signup_new)
else:
    print("Signup old not found! Check formatting.")

# --- Section 2: Replace INTERACTIVE CREDIT section ---
# We'll use regex to replace everything from "// ===== INTERACTIVE CREDIT EARNING & BADGES =====" to the end of the script before the dynamic animation style sheet.
import re

interactive_start = "// ===== INTERACTIVE CREDIT EARNING & BADGES ====="
dynamic_style_start = "// Inject dynamic animation for badges"

if interactive_start in text and dynamic_style_start in text:
    # Find the indices
    start_idx = text.find(interactive_start)
    end_idx = text.find(dynamic_style_start)
    
    new_interactive = """// ===== INTERACTIVE CREDIT EARNING & BADGES =====
  let studentCredits = 142;
  let tutorCredits = 384;
  
  const studentAwardedBadges = new Set();
  const tutorAwardedBadges = new Set();

  const BADGE_TIERS = [
    { threshold: 150, text: '🥉 Bronze Scholar' },
    { threshold: 175, text: '🥈 Silver Expert' },
    { threshold: 200, text: '🥇 Gold Master' },
    { threshold: 250, text: '💎 Diamond Legend' },
    { threshold: 300, text: '🏆 Master Educator' },
    { threshold: 400, text: '👑 Top 1% Tutor' }
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

  """
    text = text[:start_idx] + new_interactive + text[end_idx:]
else:
    print("Interactive old not found!")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated main.js logic.")
