/**
 * Main Birthday Website Controller
 * Elegant Edition with Site Lock, VIP Passcode Bypass, Themes, Countdown, and Page Orchestrations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCelebrantData();
  initSiteLockEngine();
  initThemeSwitcher();
  initCountdownTimer();
  initAudioControls();
  initFloatingBalloons();

  // Route-specific initializers
  if (document.getElementById('cake-container')) {
    initBirthdayCake();
  }

  if (document.getElementById('timeline-container') || document.getElementById('polaroid-gallery')) {
    initMemoriesPage();
  }

  if (document.getElementById('wishes-board')) {
    initWishesPage();
  }

  if (document.getElementById('gift-box-stage')) {
    initSurprisePage();
  }

  if (typeof window.initArcadeGames === 'function' && document.getElementById('trivia-container')) {
    window.initArcadeGames();
  }
});

// ==========================================
// 1. SITE LOCK & VIP ORGANIZER ENGINE
// ==========================================
function initSiteLockEngine() {
  const config = window.BIRTHDAY_CONFIG;
  const security = config && config.security;
  if (!security || !security.lockUntilBirthday) return;

  const now = new Date();
  const currentYear = now.getFullYear();
  let target = new Date(currentYear, 10, 1, 0, 0, 0); // Month 10 = November

  if (config.celebrant && config.celebrant.birthdayDate) {
    const parts = config.celebrant.birthdayDate.split('-');
    if (parts.length === 3) {
      target = new Date(currentYear, parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 0, 0, 0);
    }
  }

  // If today is on or past November 1st, automatically unlocked!
  const isBirthdayArrived = now.getTime() >= target.getTime();
  const isVIPUnlocked = localStorage.getItem('bday_vip_unlocked') === 'true';

  if (isBirthdayArrived) {
    showOrganizerNavBadge(false);
    return;
  }

  if (isVIPUnlocked) {
    showOrganizerNavBadge(true);
    return;
  }

  // Otherwise, display the elegant lock overlay
  renderLockOverlay(target);
}

function renderLockOverlay(targetDate) {
  let overlay = document.getElementById('site-lock-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'site-lock-overlay';
    overlay.className = 'site-lock-overlay fade-in';
    document.body.appendChild(overlay);
  }

  const celebrant = (window.BIRTHDAY_CONFIG && window.BIRTHDAY_CONFIG.celebrant) || { name: "Shristii 🐘" };

  overlay.innerHTML = `
    <div style="max-width: 680px; margin: auto;">
      <div class="lock-shield-icon">⚜️</div>
      <span class="hero-badge">Private & Exclusive Celebration</span>
      <h1 class="hero-title" style="font-size: clamp(2.2rem, 5vw, 3.8rem); margin-bottom: 0.8rem;">
        ${celebrant.name}'s Birthday
      </h1>
      <p class="hero-subtitle" style="margin-bottom: 2rem;">
        An elegant birthday experience is being prepared in secret. Full public access opens on <strong>November 1st</strong>.
      </p>

      <!-- Live Lock Screen Countdown -->
      <div class="countdown-section" style="background: rgba(18, 22, 34, 0.85); border-color: rgba(212, 175, 55, 0.4);">
        <div class="countdown-title">
          <span>⏳</span>
          <span>Grand Reveal Countdown</span>
        </div>
        <div class="countdown-grid">
          <div class="countdown-card">
            <span class="countdown-num" id="lock-cd-days">00</span>
            <span class="countdown-label">Days</span>
          </div>
          <div class="countdown-card">
            <span class="countdown-num" id="lock-cd-hours">00</span>
            <span class="countdown-label">Hours</span>
          </div>
          <div class="countdown-card">
            <span class="countdown-num" id="lock-cd-minutes">00</span>
            <span class="countdown-label">Minutes</span>
          </div>
          <div class="countdown-card">
            <span class="countdown-num" id="lock-cd-seconds">00</span>
            <span class="countdown-label">Seconds</span>
          </div>
        </div>
        <p class="countdown-subtext">Curated with love & timeless elegance ✨</p>
      </div>

      <button id="open-passcode-btn" class="vip-unlock-trigger">
        🗝️ Organizer / VIP Unlock
      </button>
    </div>

    <!-- Passcode Modal -->
    <div id="passcode-modal" class="modal-backdrop hidden">
      <div class="modal-overlay"></div>
      <div class="modal-card glass-panel fade-in" style="max-width: 420px; text-align: center;">
        <span class="modal-close-btn" id="close-passcode-modal">✖</span>
        <div style="font-size: 2.2rem; color: var(--primary); margin-bottom: 0.5rem;">🔐</div>
        <h3 style="font-family: 'Playfair Display', serif; margin-bottom: 0.5rem;">Organizer Access</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.2rem;">
          Enter the secret VIP passcode to preview and edit the celebration website.
        </p>
        <form id="passcode-form">
          <input 
            type="password" 
            id="vip-passcode-input" 
            placeholder="Enter VIP Key (e.g. shristii1101)" 
            required 
            style="width: 100%; padding: 0.8rem 1rem; border-radius: 6px; border: 1px solid var(--card-border); background: rgba(0,0,0,0.6); color: #FFF; font-size: 1rem; text-align: center; letter-spacing: 2px; margin-bottom: 1rem;" 
          />
          <div id="passcode-error" style="color: #FF6B6B; font-size: 0.85rem; margin-bottom: 0.8rem; display: none;">
            ⚠️ Incorrect passcode. Please try again!
          </div>
          <button type="submit" class="btn-primary" style="width: 100%; justify-content: center;">
            Unlock Preview 🔓
          </button>
        </form>
      </div>
    </div>
  `;

  // Start Lock Screen Countdown Loop
  const updateLockCountdown = () => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    if (diff <= 0) {
      overlay.remove();
      return;
    }
    const totalSeconds = Math.floor(diff / 1000);
    const d = Math.floor(totalSeconds / (3600 * 24));
    const h = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const elD = document.getElementById('lock-cd-days');
    const elH = document.getElementById('lock-cd-hours');
    const elM = document.getElementById('lock-cd-minutes');
    const elS = document.getElementById('lock-cd-seconds');

    if (elD) elD.textContent = String(d).padStart(2, '0');
    if (elH) elH.textContent = String(h).padStart(2, '0');
    if (elM) elM.textContent = String(m).padStart(2, '0');
    if (elS) elS.textContent = String(s).padStart(2, '0');
  };

  updateLockCountdown();
  setInterval(updateLockCountdown, 1000);

  // VIP Passcode Modal Bindings
  const openPasscodeBtn = document.getElementById('open-passcode-btn');
  const passcodeModal = document.getElementById('passcode-modal');
  const closePasscodeModal = document.getElementById('close-passcode-modal');
  const passcodeForm = document.getElementById('passcode-form');
  const passcodeInput = document.getElementById('vip-passcode-input');
  const passcodeError = document.getElementById('passcode-error');

  if (openPasscodeBtn && passcodeModal) {
    openPasscodeBtn.addEventListener('click', () => {
      passcodeModal.classList.remove('hidden');
      setTimeout(() => passcodeInput && passcodeInput.focus(), 100);
    });
    if (closePasscodeModal) {
      closePasscodeModal.addEventListener('click', () => passcodeModal.classList.add('hidden'));
    }
  }

  if (passcodeForm) {
    passcodeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = passcodeInput.value.trim().toLowerCase();
      const security = window.BIRTHDAY_CONFIG.security;
      const validKeys = [security.unlockPasscode.toLowerCase(), ...(security.altPasscodes || []).map(k => k.toLowerCase())];

      if (validKeys.includes(entered)) {
        localStorage.setItem('bday_vip_unlocked', 'true');
        if (window.Sound) window.Sound.fanfare();
        if (window.Confetti) window.Confetti.blast(100);

        overlay.classList.add('fade-out');
        setTimeout(() => {
          overlay.remove();
          showOrganizerNavBadge(true);
        }, 500);
      } else {
        if (passcodeError) passcodeError.style.display = 'block';
        if (window.Sound) window.Sound.pop();
      }
    });
  }
}

function showOrganizerNavBadge(isVIP) {
  if (!isVIP) return;
  const navControls = document.querySelector('.nav-controls');
  if (!navControls || document.getElementById('organizer-badge-btn')) return;

  const badgeBtn = document.createElement('button');
  badgeBtn.id = 'organizer-badge-btn';
  badgeBtn.className = 'vip-status-pill';
  badgeBtn.title = 'You have VIP Organizer Preview Access. Click to Re-Lock site.';
  badgeBtn.innerHTML = `<span>👑 VIP Mode</span> <span style="font-size: 0.7rem; opacity: 0.8;">(Lock)</span>`;

  badgeBtn.addEventListener('click', () => {
    if (confirm('Re-lock website for visitors? You will need your passcode to preview again.')) {
      localStorage.removeItem('bday_vip_unlocked');
      location.reload();
    }
  });

  navControls.prepend(badgeBtn);
}

// ==========================================
// 2. DYNAMIC CELEBRANT DATA INJECTION
// ==========================================
function initCelebrantData() {
  const config = window.BIRTHDAY_CONFIG;
  if (!config) return;

  const celebrant = config.celebrant;

  document.querySelectorAll('[data-bind="name"]').forEach(el => el.textContent = celebrant.name);
  document.querySelectorAll('[data-bind="nickname"]').forEach(el => el.textContent = celebrant.nickname);
  document.querySelectorAll('[data-bind="age"]').forEach(el => el.textContent = celebrant.age);
  document.querySelectorAll('[data-bind="title"]').forEach(el => el.textContent = celebrant.title);
  document.querySelectorAll('[data-bind="shortBio"]').forEach(el => el.textContent = celebrant.shortBio);
  document.querySelectorAll('[data-bind="heroTagline"]').forEach(el => el.textContent = celebrant.heroTagline);
}

// ==========================================
// 3. LIVE BIRTHDAY COUNTDOWN TIMER
// ==========================================
function initCountdownTimer() {
  const container = document.getElementById('birthday-countdown-container');
  if (!container) return;

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');
  const messageEl = document.getElementById('cd-message');
  const config = window.BIRTHDAY_CONFIG;

  const getTargetDate = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    let target = new Date(currentYear, 10, 1, 0, 0, 0); // November 1st

    if (config && config.celebrant && config.celebrant.birthdayDate) {
      const parts = config.celebrant.birthdayDate.split('-');
      if (parts.length === 3) {
        target = new Date(currentYear, parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 0, 0, 0);
      }
    }

    const isBirthdayToday = (now.getMonth() === target.getMonth() && now.getDate() === target.getDate());
    if (now.getTime() > target.getTime() + 24 * 60 * 60 * 1000 && !isBirthdayToday) {
      target.setFullYear(currentYear + 1);
    }
    return target;
  };

  const updateCountdown = () => {
    const now = new Date();
    const target = getTargetDate();
    const diff = target.getTime() - now.getTime();

    const isToday = (now.getMonth() === target.getMonth() && now.getDate() === target.getDate());

    if (isToday) {
      container.innerHTML = `
        <div class="countdown-today-banner fade-in">
          <h2 style="font-family: 'Playfair Display', serif; font-size: 2rem;">🎉 IT'S SHRISTII'S BIRTHDAY TODAY! 🐘🎉</h2>
          <p style="font-size: 1.1rem; margin-top: 0.5rem; color: #F3E5AB;">Wishing you an extraordinary year filled with pure joy, elegance, and success!</p>
        </div>
      `;
      return;
    }

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');

    if (messageEl) {
      messageEl.textContent = `Only ${days} days, ${hours} hours, and ${minutes} minutes left until November 1st ✨`;
    }
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ==========================================
// 4. THEME SWITCHER
// ==========================================
function initThemeSwitcher() {
  const savedTheme = localStorage.getItem('bday_theme') || 'theme-noir-gold';
  document.body.className = savedTheme;

  const themeSelect = document.getElementById('theme-select');
  if (themeSelect) {
    themeSelect.value = savedTheme;
    themeSelect.addEventListener('change', (e) => {
      document.body.className = e.target.value;
      localStorage.setItem('bday_theme', e.target.value);
      if (window.Sound) window.Sound.pop();
    });
  }
}

// ==========================================
// 5. AUDIO CONTROLS & BGM TOGGLE
// ==========================================
function initAudioControls() {
  const bgmBtn = document.getElementById('bgm-toggle-btn');
  const sfxBtn = document.getElementById('sfx-toggle-btn');

  if (bgmBtn) {
    bgmBtn.addEventListener('click', () => {
      if (window.Sound) {
        const isPlaying = window.Sound.toggleBGM();
        bgmBtn.classList.toggle('active', isPlaying);
        bgmBtn.innerHTML = isPlaying ? '🎵 Melody: ON' : '🔇 Melody: OFF';
      }
    });
  }

  if (sfxBtn) {
    sfxBtn.addEventListener('click', () => {
      if (window.Sound) {
        const isMuted = window.Sound.toggleMute();
        sfxBtn.classList.toggle('muted', isMuted);
        sfxBtn.innerHTML = isMuted ? '🔇 Sound: OFF' : '🔊 Sound: ON';
      }
    });
  }
}

// ==========================================
// 6. INTERACTIVE BIRTHDAY CAKE & CANDLE BLOWOUT
// ==========================================
function initBirthdayCake() {
  const candles = document.querySelectorAll('.candle-flame');
  const blowBtn = document.getElementById('blow-candles-btn');
  const relightBtn = document.getElementById('relight-candles-btn');
  const cakeStatus = document.getElementById('cake-status');
  let areCandlesLit = true;

  const blowOutCandles = () => {
    if (!areCandlesLit) return;
    areCandlesLit = false;

    candles.forEach((flame, idx) => {
      setTimeout(() => {
        flame.classList.add('out');
      }, idx * 100);
    });

    if (window.Sound) {
      window.Sound.blow();
      setTimeout(() => window.Sound.fanfare(), 500);
    }

    if (window.Confetti) {
      window.Confetti.blast(140);
      setTimeout(() => window.Confetti.cannons(100), 400);
    }

    if (cakeStatus) {
      cakeStatus.innerHTML = `
        <div class="wish-granted-banner fade-in">
          <h3 style="font-family: 'Playfair Display', serif; font-size: 1.5rem; color: #D4AF37;">
            ✨ A Golden Birthday Wish Granted ✨
          </h3>
          <p style="margin-top: 0.4rem; color: #F4F5F7;">May your year be as bright and extraordinary as you are, Shristii!</p>
        </div>
      `;
    }

    if (blowBtn) blowBtn.classList.add('hidden');
    if (relightBtn) relightBtn.classList.remove('hidden');
  };

  if (blowBtn) blowBtn.addEventListener('click', blowOutCandles);

  candles.forEach(flame => {
    flame.parentElement.addEventListener('click', () => {
      if (areCandlesLit) blowOutCandles();
    });
  });

  if (relightBtn) {
    relightBtn.addEventListener('click', () => {
      areCandlesLit = true;
      candles.forEach(flame => flame.classList.remove('out'));
      if (window.Sound) window.Sound.chime();
      if (cakeStatus) cakeStatus.innerHTML = `<p class="cake-hint">💡 Tap candles or click below to make a birthday wish</p>`;
      blowBtn.classList.remove('hidden');
      relightBtn.classList.add('hidden');
    });
  }

  const cannonBtn = document.getElementById('hero-confetti-btn');
  if (cannonBtn) {
    cannonBtn.addEventListener('click', () => {
      if (window.Confetti) window.Confetti.cannons(120);
      if (window.Sound) window.Sound.partyHorn();
    });
  }
}

// ==========================================
// 7. FLOATING BACKGROUND BALLOONS / PARTICLES
// ==========================================
function initFloatingBalloons() {
  const container = document.getElementById('floating-balloons-bg');
  if (!container) return;

  const goldColors = ['#D4AF37', '#E29578', '#C5A059', '#AA820A', '#E5C158'];

  for (let i = 0; i < 6; i++) {
    const balloon = document.createElement('div');
    balloon.className = 'ambient-balloon';
    balloon.style.left = `${Math.random() * 85 + 5}%`;
    balloon.style.animationDelay = `${Math.random() * 8}s`;
    balloon.style.animationDuration = `${Math.random() * 6 + 14}s`;
    balloon.style.backgroundColor = goldColors[i % goldColors.length];

    balloon.addEventListener('click', (e) => {
      if (window.Sound) window.Sound.pop();
      if (window.Confetti) window.Confetti.blast(20, e.clientX, e.clientY);
      balloon.style.transform = 'scale(1.4)';
      balloon.style.opacity = '0';
      setTimeout(() => {
        balloon.style.transform = '';
        balloon.style.opacity = '0.55';
        balloon.style.top = '110vh';
      }, 800);
    });

    container.appendChild(balloon);
  }
}

// ==========================================
// 8. MEMORIES PAGE: TIMELINE, POLAROIDS & CASSETTE
// ==========================================
function initMemoriesPage() {
  const config = window.BIRTHDAY_CONFIG;
  if (!config) return;

  const timelineContainer = document.getElementById('timeline-container');
  if (timelineContainer && config.timeline) {
    timelineContainer.innerHTML = config.timeline.map((item, idx) => `
      <div class="timeline-item ${idx % 2 === 0 ? 'left' : 'right'} fade-in">
        <div class="timeline-node">${item.icon}</div>
        <div class="timeline-content glass-panel">
          <span class="timeline-tag">${item.tag}</span>
          <span class="timeline-year">${item.year}</span>
          <h3 style="margin-top: 0.4rem;">${item.title}</h3>
          <p style="margin-top: 0.3rem; color: var(--text-muted);">${item.description}</p>
        </div>
      </div>
    `).join('');
  }

  const polaroidGrid = document.getElementById('polaroid-gallery');
  if (polaroidGrid && config.photos) {
    polaroidGrid.innerHTML = config.photos.map((photo, idx) => `
      <div class="polaroid-card" style="transform: rotate(${photo.rotation}deg);" data-idx="${idx}">
        <div class="polaroid-img-wrapper">
          <img src="${photo.url}" alt="${photo.caption}" loading="lazy" />
        </div>
        <div class="polaroid-caption">
          <p class="polaroid-text">${photo.caption}</p>
          <span class="polaroid-date">${photo.date}</span>
        </div>
      </div>
    `).join('');

    const polaroids = polaroidGrid.querySelectorAll('.polaroid-card');
    polaroids.forEach(p => {
      p.addEventListener('click', () => {
        const idx = p.dataset.idx;
        openLightbox(config.photos[idx]);
      });
    });
  }

  const cassetteEl = document.getElementById('cassette-deck');
  const playTapeBtn = document.getElementById('play-tape-btn');
  const tapeTrackInfo = document.getElementById('tape-track-info');

  if (playTapeBtn && cassetteEl) {
    let isTapePlaying = false;
    let currentTrackIdx = 0;
    const tracks = config.mixtape || [];

    const updateTrack = () => {
      if (tracks[currentTrackIdx] && tapeTrackInfo) {
        tapeTrackInfo.innerHTML = `
          <strong style="font-family: 'Playfair Display', serif; font-size: 1.1rem; color: var(--text-main);">${tracks[currentTrackIdx].title}</strong>
          <span class="dedication-quote">"${tracks[currentTrackIdx].dedication}"</span>
        `;
      }
    };

    updateTrack();

    playTapeBtn.addEventListener('click', () => {
      isTapePlaying = !isTapePlaying;
      cassetteEl.classList.toggle('playing', isTapePlaying);
      playTapeBtn.textContent = isTapePlaying ? '⏸ Pause Mixtape' : '▶ Play Mixtape';

      if (window.Sound) {
        if (isTapePlaying) {
          window.Sound.startBGM();
          window.Sound.chime();
        } else {
          window.Sound.stopBGM();
        }
      }
    });

    const nextTrackBtn = document.getElementById('next-track-btn');
    if (nextTrackBtn) {
      nextTrackBtn.addEventListener('click', () => {
        currentTrackIdx = (currentTrackIdx + 1) % tracks.length;
        updateTrack();
        if (window.Sound) window.Sound.tick();
      });
    }
  }
}

function openLightbox(photo) {
  let modal = document.getElementById('lightbox-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'lightbox-modal';
    modal.className = 'lightbox-modal';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="lightbox-overlay"></div>
    <div class="lightbox-content glass-panel fade-in">
      <span class="lightbox-close">✖</span>
      <img src="${photo.url}" alt="${photo.caption}" class="lightbox-img" />
      <div class="lightbox-footer" style="margin-top: 1rem;">
        <h3 style="font-family: 'Playfair Display', serif; color: var(--primary);">${photo.caption}</h3>
        <p style="color: var(--text-muted); font-size: 0.85rem;">${photo.date}</p>
      </div>
    </div>
  `;
  modal.classList.add('open');

  const close = () => modal.classList.remove('open');
  modal.querySelector('.lightbox-overlay').addEventListener('click', close);
  modal.querySelector('.lightbox-close').addEventListener('click', close);
}

// ==========================================
// 9. WISHES PINBOARD & GUESTBOOK
// ==========================================
function initWishesPage() {
  const config = window.BIRTHDAY_CONFIG;
  const board = document.getElementById('wishes-board');
  if (!board) return;

  const savedWishes = JSON.parse(localStorage.getItem('bday_wishes') || 'null');
  let wishes = savedWishes || (config && config.starterWishes) || [];

  const renderWishes = () => {
    board.innerHTML = wishes.map((w, idx) => `
      <div class="pin-card ${w.color || 'card-yellow'} fade-in">
        <div class="pin-header">
          <span class="pin-avatar">${w.avatar || '✨'}</span>
          <div class="pin-meta">
            <strong class="pin-author" style="font-family: 'Playfair Display', serif;">${w.author}</strong>
            <span class="pin-badge">${w.badge || 'Friend'}</span>
          </div>
        </div>
        <p class="pin-text">${w.text}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.8rem;">
          <span style="font-size: 0.75rem; color: var(--text-muted);">${w.date || 'Today'}</span>
          <button class="btn-small like-btn" data-idx="${idx}">❤️ <span class="like-count">${w.likes || 0}</span></button>
        </div>
      </div>
    `).join('');

    board.querySelectorAll('.like-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.dataset.idx;
        wishes[idx].likes = (wishes[idx].likes || 0) + 1;
        localStorage.setItem('bday_wishes', JSON.stringify(wishes));
        btn.querySelector('.like-count').textContent = wishes[idx].likes;
        if (window.Sound) window.Sound.chime();
        if (window.Confetti) window.Confetti.blast(15);
      });
    });
  };

  renderWishes();

  const openWishModalBtn = document.getElementById('open-wish-modal-btn');
  const wishModal = document.getElementById('add-wish-modal');
  const wishForm = document.getElementById('new-wish-form');
  const closeWishModal = document.getElementById('close-wish-modal');

  if (openWishModalBtn && wishModal) {
    openWishModalBtn.addEventListener('click', () => wishModal.classList.remove('hidden'));
    if (closeWishModal) {
      closeWishModal.addEventListener('click', () => wishModal.classList.add('hidden'));
    }
  }

  if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = document.getElementById('wish-author').value.trim() || 'Well-Wisher';
      const text = document.getElementById('wish-text').value.trim();
      const badge = document.getElementById('wish-badge').value;
      const avatar = document.getElementById('wish-avatar').value;
      const color = document.querySelector('input[name="card-color"]:checked')?.value || 'card-yellow';

      if (!text) return;

      const newWish = {
        author,
        text,
        badge,
        avatar,
        color,
        date: 'Just now',
        likes: 1
      };

      wishes.unshift(newWish);
      localStorage.setItem('bday_wishes', JSON.stringify(wishes));
      renderWishes();

      wishForm.reset();
      wishModal.classList.add('hidden');

      if (window.Sound) window.Sound.partyHorn();
      if (window.Confetti) window.Confetti.blast(80);
    });
  }

  const printBtn = document.getElementById('export-wishes-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

// ==========================================
// 10. SURPRISE GIFT BOX UNBOXING
// ==========================================
function initSurprisePage() {
  const config = window.BIRTHDAY_CONFIG;
  const giftBox = document.getElementById('interactive-gift-box');
  const stageInstruction = document.getElementById('unbox-instruction');
  const surpriseContent = document.getElementById('unboxed-surprise-content');

  if (!giftBox || !stageInstruction || !surpriseContent) return;

  let stage = 0;
  const celebrantName = (config && config.celebrant && config.celebrant.name) || "Shristii 🐘";
  const instructions = [
    "⚜️ Step 1: Click the velvet gift box to untie the golden silk ribbon!",
    "✨ Step 2: Click again to unveil the interior vault!",
    "🎉 Step 3: Open the lid to reveal the royal birthday privileges!",
    `🌟 Happy Birthday ${celebrantName}! Your bespoke celebration is revealed!`
  ];

  giftBox.addEventListener('click', () => {
    if (stage === 0) {
      giftBox.classList.add('ribbon-untied');
      stage = 1;
      stageInstruction.textContent = instructions[stage];
      if (window.Sound) window.Sound.tick();
      if (window.Confetti) window.Confetti.blast(25);
    } else if (stage === 1) {
      giftBox.classList.add('paper-unwrapped');
      stage = 2;
      stageInstruction.textContent = instructions[stage];
      if (window.Sound) window.Sound.blow();
      if (window.Confetti) window.Confetti.blast(50);
    } else if (stage === 2) {
      giftBox.classList.add('box-opened');
      stage = 3;
      stageInstruction.textContent = instructions[stage];

      if (window.Sound) window.Sound.fanfare();
      if (window.Confetti) {
        window.Confetti.cannons(150);
        setTimeout(() => window.Confetti.blast(100), 500);
      }

      setTimeout(() => {
        surpriseContent.classList.remove('hidden');
        surpriseContent.classList.add('fade-in');
        surpriseContent.scrollIntoView({ behavior: 'smooth' });
      }, 600);
    }
  });

  const couponGrid = document.getElementById('coupon-grid');
  if (couponGrid && config && config.surprise && config.surprise.coupons) {
    couponGrid.innerHTML = config.surprise.coupons.map(c => `
      <div class="birthday-coupon glass-panel fade-in">
        <div class="coupon-left" style="text-align: left;">
          <span style="font-size: 0.7rem; letter-spacing: 1.5px; color: var(--primary); font-weight: 700; text-transform: uppercase;">ROYAL BIRTHDAY PRIVILEGE</span>
          <h4 style="font-family: 'Playfair Display', serif; font-size: 1.25rem; margin: 0.3rem 0;">${c.title}</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem;">${c.desc}</p>
        </div>
        <div class="coupon-right" style="margin-left: 1.5rem; text-align: center;">
          <span class="coupon-code" style="border: 1px dashed var(--primary); padding: 0.4rem 0.8rem; border-radius: 4px; color: var(--primary);">${c.code}</span>
          <button class="btn-primary mt-2" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;" onclick="copyCouponCode('${c.code}', this)">Copy Pass 📋</button>
        </div>
      </div>
    `).join('');
  }

  const letterBody = document.getElementById('surprise-letter-body');
  if (letterBody && config && config.surprise) {
    letterBody.textContent = config.surprise.letterBody;
  }
}

function copyCouponCode(code, btn) {
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = 'Copied! ✨';
    if (window.Sound) window.Sound.chime();
    if (window.Confetti) window.Confetti.blast(20);
    setTimeout(() => {
      btn.textContent = 'Copy Pass 📋';
    }, 2000);
  });
}
window.copyCouponCode = copyCouponCode;
