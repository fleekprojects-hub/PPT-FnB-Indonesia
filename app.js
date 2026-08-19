document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const htmlElement = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const printBtn = document.getElementById('printBtn');
  const navToggleBtn = document.getElementById('navToggleBtn');
  const navDrawer = document.getElementById('navDrawer');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  
  // IT Brief Elements
  const passcodeInput = document.getElementById('passcodeInput');
  const unlockBtn = document.getElementById('unlockBtn');
  const terminalLockScreen = document.getElementById('terminalLockScreen');
  const itUnlockedContent = document.getElementById('itUnlockedContent');
  const errorMessage = document.getElementById('errorMessage');

  // --- Typewriter Word & Letter Wrapper ---
  const animateTexts = document.querySelectorAll('.animate-text');
  animateTexts.forEach(el => {
    const text = el.textContent.trim();
    const words = text.split(/\s+/);
    let wrappedHTML = '';
    
    words.forEach((wordText, wordIdx) => {
      let wordHTML = '<span class="word">';
      for (let i = 0; i < wordText.length; i++) {
        wordHTML += `<span class="letter">${wordText[i]}</span>`;
      }
      wordHTML += '</span>';
      wrappedHTML += wordHTML;
      if (wordIdx < words.length - 1) {
        wrappedHTML += ' ';
      }
    });
    
    el.innerHTML = wrappedHTML;
  });

  // Arrays of section IDs for ordered navigation
  // 12 slides: Opening, 4 Pillars, Weather Promo, WA Broadcast, Command Portal, Dormant, Timeline, Schema, Quotation, Email Blast, Sign-Off, IT Brief
  const slideIds = ['opening', 'painpoint', 'project1', 'project2', 'project3', 'project4', 'timeline', 'schema', 'tablize', 'emailblast', 'signed', 'itbrief'];
  let currentIndex = 0;
  let isTransitioning = false;
  const cooldownMs = 800;

  // --- Anime.js Entry Trigger ---
  function triggerAnimeAnimations(content) {
    // 1. Stagger typewriter letters
    const letters = content.querySelectorAll('.letter');
    if (letters.length > 0) {
      anime.remove(letters);
      anime.set(letters, { opacity: 0, translateY: 20 });
      anime({
        targets: letters,
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(15),
        duration: 800,
        easing: 'easeOutElastic(1, .8)'
      });
    }

    // 2. Stagger general block elements
    const items = content.querySelectorAll('.painpoint-item, .project-layout, .timeline-project-track, .schema-card, .table-wrapper-container, .signature-box, .lock-terminal, .fsb-header, .fsb-footer');
    if (items.length > 0) {
      anime.remove(items);
      anime.set(items, { opacity: 0, translateY: 30 });
      anime({
        targets: items,
        opacity: [0, 1],
        translateY: [30, 0],
        delay: anime.stagger(150, { start: 100 }),
        duration: 900,
        easing: 'easeOutElastic(1, 1)'
      });
    }

    // 3. Email newsletter card slide-in
    const emailCard = content.querySelector('.email-newsletter-card');
    if (emailCard) {
      anime.remove(emailCard);
      anime.set(emailCard, { opacity: 0, scale: 0.9, translateY: 30 });
      anime({
        targets: emailCard,
        opacity: [0, 1],
        scale: [0.9, 1],
        translateY: [30, 0],
        duration: 1000,
        easing: 'easeOutElastic(1, .7)',
        delay: 200
      });
    }

    // 4. WA & FSB message bubble stagger
    const bubbles = content.querySelectorAll('.wa-message-bubble, .fsb-bubble-container');
    if (bubbles.length > 0) {
      anime.remove(bubbles);
      anime.set(bubbles, { opacity: 0, scale: 0.85, translateY: 20 });
      anime({
        targets: bubbles,
        opacity: [0, 1],
        scale: [0.85, 1],
        translateY: [20, 0],
        delay: anime.stagger(250, { start: 300 }),
        duration: 850,
        easing: 'easeOutElastic(1, .6)'
      });
    }

    // 5. Dashboard bar chart columns animate on enter
    const bars = content.querySelectorAll('.dashboard-bar');
    if (bars.length > 0) {
      anime.remove(bars);
      anime.set(bars, { height: '0%' });
      bars.forEach(bar => {
        const targetHeight = bar.getAttribute('data-height') + '%';
        anime({
          targets: bar,
          height: ['0%', targetHeight],
          duration: 900,
          easing: 'easeOutQuart',
          delay: anime.random(150, 350)
        });
      });
    }
  }

  // --- Viewport Auto-Scaling Engine for 100% Single-Screen Fit ---
  function autoScaleActiveSlide() {
    const activeSlide = document.getElementById(slideIds[currentIndex]);
    if (!activeSlide) return;
    
    const content = activeSlide.querySelector('.section-content');
    if (!content) return;

    // Reset scale to measure natural height
    content.style.transform = 'scale(1)';
    content.style.transformOrigin = 'center center';
    
    const availableHeight = activeSlide.clientHeight - 40;
    const contentHeight = content.scrollHeight;
    
    if (contentHeight > availableHeight && availableHeight > 200) {
      const scale = Math.max(0.68, Math.min(1, (availableHeight / contentHeight)));
      content.style.transform = `scale(${scale})`;
      content.style.transformOrigin = 'center center';
    }
  }

  window.addEventListener('resize', autoScaleActiveSlide);

  // --- Set Active Slide & Trigger Animations ---
  function showSlide(index) {
    if (index < 0 || index >= slideIds.length) return;
    
    const slides = document.querySelectorAll('.slide-panel');
    slides.forEach(s => s.classList.remove('active-slide'));
    
    const targetSlide = document.getElementById(slideIds[index]);
    if (targetSlide) {
      targetSlide.classList.add('active-slide');
      targetSlide.scrollTop = 0;
      
      const content = targetSlide.querySelector('.section-content');
      if (content) {
        triggerAnimeAnimations(content);
      }

      // Auto-fit to viewport
      setTimeout(autoScaleActiveSlide, 50);
    }
    
    // Highlight active nav link
    navLinks.forEach(link => {
      const targetHref = link.getAttribute('href').replace('#', '');
      if (targetHref === slideIds[index]) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update top progress bar
    const progressPercent = (index / (slideIds.length - 1)) * 100;
    scrollProgressBar.style.width = `${progressPercent}%`;

    currentIndex = index;
  }

  // --- Single-Screen 100% Fit: Instant Slide Transition ---
  function canTransition(direction) {
    return true; // 100% single screen fit - zero scroll traps
  }

  // --- Input Event Listeners ---

  // 1. Mouse wheel
  window.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) < 30) return;
    if (isTransitioning) return;

    const direction = e.deltaY > 0 ? 1 : -1;
    
    if (canTransition(direction)) {
      const nextIndex = currentIndex + direction;
      if (nextIndex >= 0 && nextIndex < slideIds.length) {
        isTransitioning = true;
        showSlide(nextIndex);
        setTimeout(() => { isTransitioning = false; }, cooldownMs);
      }
    }
  }, { passive: true });

  // 2. Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (isTransitioning) return;
    
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      return;
    }

    let direction = 0;
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      direction = 1;
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      direction = -1;
    }

    if (direction !== 0 && canTransition(direction)) {
      const nextIndex = currentIndex + direction;
      if (nextIndex >= 0 && nextIndex < slideIds.length) {
        isTransitioning = true;
        showSlide(nextIndex);
        setTimeout(() => { isTransitioning = false; }, cooldownMs);
      }
    }
  });

  // 3. Touch swipe
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (isTransitioning) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diffY = touchStartY - touchEndY;
    
    if (Math.abs(diffY) > 55) {
      const direction = diffY > 0 ? 1 : -1;
      
      if (canTransition(direction)) {
        const nextIndex = currentIndex + direction;
        if (nextIndex >= 0 && nextIndex < slideIds.length) {
          isTransitioning = true;
          showSlide(nextIndex);
          setTimeout(() => { isTransitioning = false; }, cooldownMs);
        }
      }
    }
  }, { passive: true });

  // Init on startup
  showSlide(0);

  // --- Theme Toggle ---
  const savedTheme = localStorage.getItem('theme') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    anime({
      targets: 'body',
      backgroundColor: newTheme === 'dark' ? '#111110' : '#f8f8f8',
      duration: 350,
      easing: 'easeInOutQuad'
    });

    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    const icon = themeToggleBtn.querySelector('svg');
    if (theme === 'dark') {
      icon.innerHTML = `
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2"></path>
        <path d="M12 20v2"></path>
        <path d="M4.93 4.93l1.41 1.41"></path>
        <path d="M17.66 17.66l1.41 1.41"></path>
        <path d="M2 12h2"></path>
        <path d="M20 12h2"></path>
        <path d="M6.34 17.66l-1.41 1.41"></path>
        <path d="M19.07 4.93l-1.41 1.41"></path>
      `;
    } else {
      icon.innerHTML = `
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      `;
    }
  }

  // --- Print ---
  printBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.print();
  });

  // --- Navigation Drawer ---
  function openNav() {
    navDrawer.classList.add('open');
    navOverlay.classList.add('open');
    navToggleBtn.classList.add('active');
    
    anime({
      targets: '.nav-links li',
      translateX: [25, 0],
      opacity: [0, 1],
      delay: anime.stagger(50),
      duration: 400,
      easing: 'easeOutQuart'
    });
  }

  function closeNav() {
    navDrawer.classList.remove('open');
    navOverlay.classList.remove('open');
    navToggleBtn.classList.remove('active');
  }

  navToggleBtn.addEventListener('click', () => {
    if (navDrawer.classList.contains('open')) {
      closeNav();
    } else {
      openNav();
    }
  });

  navOverlay.addEventListener('click', closeNav);

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      closeNav();
      
      const targetId = link.getAttribute('href').replace('#', '');
      const targetIndex = slideIds.indexOf(targetId);
      if (targetIndex !== -1) {
        showSlide(targetIndex);
      }
    });
  });

  // --- IT Brief Passcode Gate ---
  const PASSCODE_SECRET = "fleek";

  function handleUnlock() {
    const code = passcodeInput.value.trim().toLowerCase();
    
    if (code === PASSCODE_SECRET) {
      errorMessage.classList.remove('visible');
      
      anime({
        targets: terminalLockScreen,
        scale: 0.96,
        opacity: 0,
        duration: 300,
        easing: 'easeInQuad',
        complete: () => {
          terminalLockScreen.style.display = 'none';
          itUnlockedContent.style.display = 'block';
          
          anime({
            targets: '#itUnlockedContent',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 500,
            easing: 'easeOutQuart'
          });
          
          anime({
            targets: '.it-card',
            opacity: [0, 1],
            translateY: [15, 0],
            delay: anime.stagger(80),
            duration: 500,
            easing: 'easeOutQuart'
          });
        }
      });
    } else {
      errorMessage.classList.add('visible');
      passcodeInput.value = '';
      
      terminalLockScreen.classList.add('shake');
      setTimeout(() => {
        terminalLockScreen.classList.remove('shake');
      }, 300);

      anime({
        targets: errorMessage,
        opacity: [0, 1, 0.4, 1],
        duration: 300,
        easing: 'linear'
      });
    }
  }

  if (unlockBtn) unlockBtn.addEventListener('click', handleUnlock);
  
  if (passcodeInput) {
    passcodeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleUnlock();
    });
  }

  if (terminalLockScreen) {
    terminalLockScreen.addEventListener('click', () => {
      if (itUnlockedContent && itUnlockedContent.style.display !== 'block') {
        passcodeInput.focus();
      }
    });
  }

  // ============================================================
  // --- F&B INDONESIA: Continuous Auto-Wave Bar Chart (Red Looping) ---
  // ============================================================

  let waveInterval = null;

  function setBarHeight(barId, badgeId, heightPct) {
    const bar = document.getElementById(barId);
    const badge = document.getElementById(badgeId);
    if (!bar || !badge) return;
    bar.setAttribute('data-height', heightPct);
    anime({
      targets: bar,
      height: heightPct + '%',
      duration: 850,
      easing: 'easeInOutQuad'
    });
    badge.textContent = heightPct + '%';
  }

  function initDashboardLiveWave() {
    if (waveInterval) clearInterval(waveInterval);

    waveInterval = setInterval(() => {
      const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
      setBarHeight('barChatime', 'badgeChatime', rand(82, 98));
      setBarHeight('barCupbop',  'badgeCupbop',  rand(66, 92));
      setBarHeight('barGindaco', 'badgeGindaco', rand(54, 88));
      setBarHeight('barGoGoCha', 'badgeGoGoCha', rand(72, 96));
    }, 2000);
  }

  // Start continuous red wave on load
  initDashboardLiveWave();


  // ============================================================
  // --- F&B INDONESIA SPECIFIC: Toast & Voucher Copy Feedback ---
  // ============================================================

  const deckToast = document.getElementById('deckToast');

  window.triggerToast = function(message) {
    if (!deckToast) return;
    deckToast.innerHTML = `<span>⚡</span> ${message}`;
    deckToast.classList.add('show');
    setTimeout(() => { deckToast.classList.remove('show'); }, 2800);
  };

  window.copyVoucherCode = function(code) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        window.triggerToast(`🎉 Kode <strong>${code}</strong> berhasil disalin ke clipboard!`);
      }).catch(() => {
        window.triggerToast(`Kode voucher: ${code}`);
      });
    } else {
      window.triggerToast(`Kode voucher: ${code}`);
    }
  };

});
