/**
 * Y2K McBling & Hello Kitty Apology Website for Kavuuuu
 * Interactive logic: Audio synthesis, dodging No button, unfolding letter, 
 * 3D flip cards, canvas sparkles & celebration confetti.
 */

// Sound state
let soundEnabled = true;
let audioCtx = null;

// Initialize Web Audio API on first user interaction
function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Sound Synthesizers (100% self-contained, no external mp3 files required)
function playPop() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  const now = ctx.currentTime;
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
  
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(now);
  osc.stop(now + 0.1);
}

function playFlip() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'triangle';
  const now = ctx.currentTime;
  osc.frequency.setValueAtTime(300, now);
  osc.frequency.exponentialRampToValueAtTime(550, now + 0.12);
  
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(now);
  osc.stop(now + 0.15);
}

function playSqueak() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  const now = ctx.currentTime;
  const startFreq = 600 + Math.random() * 200;
  osc.frequency.setValueAtTime(startFreq, now);
  osc.frequency.exponentialRampToValueAtTime(startFreq * 1.5, now + 0.09);
  
  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(now);
  osc.stop(now + 0.12);
}

function playCelebrationChime() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  
  // Arpeggio notes: C5, E5, G5, B5, C6, E6
  const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
  const now = ctx.currentTime;
  
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const noteTime = now + (idx * 0.1);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, noteTime);
    
    gain.gain.setValueAtTime(0.28, noteTime);
    gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(noteTime);
    osc.stop(noteTime + 0.5);
  });
}

// ==========================================================================
// Apology Letter Unfolding Logic
// ==========================================================================

function initLetter() {
  const envelope = document.getElementById('envelope-closed');
  const letterBody = document.getElementById('letter-open');
  const sealBtn = document.getElementById('wax-seal');
  const refoldBtn = document.getElementById('btn-refold-letter');
  const editToggleBtn = document.getElementById('btn-edit-letter');
  const letterTextContainer = document.getElementById('editable-letter-body');

  function openLetter() {
    playPop();
    envelope.style.display = 'none';
    letterBody.classList.add('visible');
    
    // Sparkle effect at envelope position
    createSparkleBurst(window.innerWidth / 2, window.innerHeight * 0.45);
  }

  function closeLetter() {
    playPop();
    letterBody.classList.remove('visible');
    envelope.style.display = 'block';
  }

  if (envelope) envelope.addEventListener('click', openLetter);
  if (sealBtn) sealBtn.addEventListener('click', (e) => { e.stopPropagation(); openLetter(); });
  if (refoldBtn) refoldBtn.addEventListener('click', closeLetter);

  // Allow in-browser editing of letter text with local storage backup
  if (editToggleBtn && letterTextContainer) {
    // Load cached letter text if user previously modified it
    const savedLetter = localStorage.getItem('kavuuuu_apology_letter');
    if (savedLetter && savedLetter.includes('<h5>')) {
      letterTextContainer.innerHTML = savedLetter;
    }

    let isEditing = false;
    editToggleBtn.addEventListener('click', () => {
      isEditing = !isEditing;
      if (isEditing) {
        letterTextContainer.setAttribute('contenteditable', 'true');
        letterTextContainer.focus();
        editToggleBtn.textContent = '💾 Save Changes';
        editToggleBtn.style.background = '#ff1493';
        editToggleBtn.style.color = '#fff';
      } else {
        letterTextContainer.removeAttribute('contenteditable');
        localStorage.setItem('kavuuuu_apology_letter', letterTextContainer.innerHTML);
        editToggleBtn.textContent = '✏️ Edit Letter';
        editToggleBtn.style.background = '#ffe3ed';
        editToggleBtn.style.color = 'var(--deep-pink)';
        playPop();
      }
    });
  }
}

// ==========================================================================
// "Reasons Why I Adore Kavuuuu" 3D Flip Cards
// ==========================================================================

function initFlipCards() {
  const cards = document.querySelectorAll('.flip-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      playFlip();
      card.classList.toggle('flipped');
      
      const rect = card.getBoundingClientRect();
      createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  });
}

// ==========================================================================
// Interactive Forgiveness Mechanics ("No" Dodging & "Yes" Growing)
// ==========================================================================

const noExcuses = [
  "No 😤",
  "Are you sure, Kavuuuu? 🥺",
  "Think again! 💭",
  "Kavuuuu pls 😭",
  "Button broken! ⚠️",
  "Too slow! 💨",
  "Look how big the Yes button is! 👉👈",
  "I'll buy you favorite snacks! 🍩",
  "Unlimited back scratches! 💆‍♀️",
  "Kavuuuu don't be cold 🥶",
  "Free bubble tea coupon included! 🧋",
  "I'm on my knees begging! 🧎‍♂️",
  "You're smiling right now, aren't you? 😏",
  "Okay, but what if I bring cute kitties? 🐱",
  "You have no choice, I love you too much! 💖"
];

let dodgeCount = 0;

function initForgivenessButtons() {
  const btnNo = document.getElementById('btn-no');
  const btnYes = document.getElementById('btn-yes');
  const dodgeBanner = document.getElementById('dodge-counter');
  const questionCard = document.querySelector('.question-card');
  const heroKitty = document.getElementById('hero-kitty');

  if (!btnNo || !btnYes || !questionCard) return;

  function dodgeNo(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    playSqueak();
    dodgeCount++;

    // Update button text to cute excuses
    const excuseIndex = Math.min(dodgeCount, noExcuses.length - 1);
    btnNo.innerHTML = `<span>${noExcuses[excuseIndex]}</span>`;

    // Ensure question card has relative positioning
    questionCard.style.position = 'relative';
    btnNo.style.position = 'absolute';

    // Get boundaries of the card
    const cardRect = questionCard.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();
    const yesRect = btnYes.getBoundingClientRect();

    const padding = 16;
    const minX = padding;
    const maxX = Math.max(minX, cardRect.width - btnRect.width - padding);
    
    // Keep within lower half / arena so it doesn't cover the headline
    const minY = Math.max(60, cardRect.height * 0.45);
    const maxY = Math.max(minY + 20, cardRect.height - btnRect.height - padding);

    let randomX = Math.random() * (maxX - minX) + minX;
    let randomY = Math.random() * (maxY - minY) + minY;

    // Check if it overlaps the YES button; if so, push it to the other side
    const cardRelYesX = yesRect.left - cardRect.left;
    const cardRelYesY = yesRect.top - cardRect.top;
    
    if (Math.abs(randomX - cardRelYesX) < 120 && Math.abs(randomY - cardRelYesY) < 60) {
      randomX = randomX > (cardRect.width / 2) ? minX + 20 : maxX - 20;
    }

    // Apply absolute placement with spring transition
    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;
    btnNo.style.transform = `scale(${Math.max(0.75, 1 - dodgeCount * 0.02)}) rotate(${(Math.random() - 0.5) * 20}deg)`;

    // Make the YES button progressively grow larger & juicier
    const scaleFactor = 1 + Math.min(dodgeCount * 0.12, 1.25);
    btnYes.style.transform = `scale(${scaleFactor})`;
    btnYes.style.boxShadow = `0 ${8 + dodgeCount * 3}px ${24 + dodgeCount * 6}px rgba(230, 0, 107, 0.7)`;

    // Show playful banner
    if (dodgeBanner) {
      dodgeBanner.classList.add('show');
      dodgeBanner.innerHTML = `Kavuuuu tried to say no <strong>${dodgeCount}</strong> time${dodgeCount === 1 ? '' : 's'}... but resistance is futile! 🥺💖`;
    }

    // Cute Kitty Reaction: Kitty wiggles and blushes deeper
    if (heroKitty) {
      heroKitty.style.animation = 'kittyWiggle 0.35s ease-in-out 3 alternate';
      setTimeout(() => {
        heroKitty.style.animation = 'kittyBounce 2.5s ease-in-out infinite';
      }, 1100);
    }
  }

  // Desktop hover / mouse events
  btnNo.addEventListener('mouseenter', dodgeNo);
  btnNo.addEventListener('mouseover', dodgeNo);
  btnNo.addEventListener('focus', dodgeNo);
  
  // Mobile touch / pointer events
  btnNo.addEventListener('touchstart', dodgeNo, { passive: false });
  btnNo.addEventListener('pointerdown', dodgeNo);

  // Yes button click: trigger celebration!
  btnYes.addEventListener('click', triggerCelebration);
}

// ==========================================================================
// Celebration Modal & Confetti Particle System
// ==========================================================================

function triggerCelebration() {
  playCelebrationChime();
  
  const modalOverlay = document.getElementById('celebration-modal');
  if (modalOverlay) {
    modalOverlay.classList.add('active');
  }

  // Launch massive multi-color confetti & heart explosion
  startConfettiBurst();

  // Scroll smoothly to modal
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initCelebrationControls() {
  const modalOverlay = document.getElementById('celebration-modal');
  const btnClose = document.getElementById('btn-close-modal');
  const btnScreenshot = document.getElementById('btn-screenshot');
  const btnSendWhatsapp = document.getElementById('btn-send-whatsapp');

  if (btnClose && modalOverlay) {
    btnClose.addEventListener('click', () => {
      playPop();
      modalOverlay.classList.remove('active');
    });
  }

  if (btnScreenshot) {
    btnScreenshot.addEventListener('click', () => {
      playPop();
      // Prompt user to take a native screenshot or print
      window.print();
    });
  }

  if (btnSendWhatsapp) {
    btnSendWhatsapp.addEventListener('click', () => {
      playPop();
      const message = encodeURIComponent("I forgive you! 💖 I just claimed my VIP Date Coupon for 1 Free Date, treats & unlimited cuddles! When are you taking me out? 🥰");
      window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
    });
  }
}

// ==========================================================================
// Sparkles & Confetti Visual Effects (Canvas Powered)
// ==========================================================================

const sparkleCanvas = document.getElementById('sparkle-canvas');
let sparkleCtx = null;
let sparkles = [];
let confettiList = [];
let isConfettiActive = false;

function initCanvas() {
  if (!sparkleCanvas) return;
  sparkleCtx = sparkleCanvas.getContext('2d');
  
  function resizeCanvas() {
    sparkleCanvas.width = window.innerWidth;
    sparkleCanvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Seed ambient floating sparkles
  for (let i = 0; i < 30; i++) {
    sparkles.push(createSparkle());
  }

  renderAnimationLoop();
}

function createSparkle() {
  return {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: 4 + Math.random() * 8,
    opacity: 0.2 + Math.random() * 0.7,
    speedY: -(0.3 + Math.random() * 0.7),
    speedX: (Math.random() - 0.5) * 0.4,
    rotation: Math.random() * Math.PI,
    rotSpeed: (Math.random() - 0.5) * 0.04,
    color: Math.random() > 0.4 ? '#ff69b4' : (Math.random() > 0.5 ? '#ffd700' : '#ffffff')
  };
}

function createSparkleBurst(originX, originY) {
  for (let i = 0; i < 20; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 5;
    sparkles.push({
      x: originX,
      y: originY,
      size: 6 + Math.random() * 10,
      opacity: 1,
      speedX: Math.cos(angle) * speed,
      speedY: Math.sin(angle) * speed,
      rotation: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.1,
      color: Math.random() > 0.3 ? '#ff1493' : '#ffd700',
      decay: 0.02 + Math.random() * 0.02
    });
  }
}

function startConfettiBurst() {
  isConfettiActive = true;
  confettiList = [];

  const emojis = ['💖', '🎀', '✨', '🌸', '🍓', '🐾'];
  const colors = ['#ff4d94', '#ff85c2', '#ffd1dc', '#ffd700', '#ffffff', '#222222'];

  for (let i = 0; i < 120; i++) {
    confettiList.push({
      x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 200,
      y: window.innerHeight * 0.3,
      vx: (Math.random() - 0.5) * 14,
      vy: -6 - Math.random() * 12,
      gravity: 0.35 + Math.random() * 0.2,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8,
      size: 14 + Math.random() * 16,
      color: colors[Math.floor(Math.random() * colors.length)],
      emoji: Math.random() > 0.5 ? emojis[Math.floor(Math.random() * emojis.length)] : null,
      opacity: 1
    });
  }

  // Allow confetti to shower continuously for 8 seconds
  setTimeout(() => {
    isConfettiActive = false;
  }, 8000);
}

function drawFourPointStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}

function renderAnimationLoop() {
  if (!sparkleCtx) return;

  sparkleCtx.clearRect(0, 0, sparkleCanvas.width, sparkleCanvas.height);

  // Update & Draw Ambient Sparkles
  for (let i = sparkles.length - 1; i >= 0; i--) {
    const s = sparkles[i];
    s.x += s.speedX;
    s.y += s.speedY;
    s.rotation += s.rotSpeed;

    if (s.decay) {
      s.opacity -= s.decay;
      if (s.opacity <= 0) {
        sparkles.splice(i, 1);
        continue;
      }
    } else {
      // Loop ambient sparkles
      if (s.y < -20) {
        s.y = window.innerHeight + 20;
        s.x = Math.random() * window.innerWidth;
      }
    }

    sparkleCtx.save();
    sparkleCtx.translate(s.x, s.y);
    sparkleCtx.rotate(s.rotation);
    sparkleCtx.globalAlpha = Math.max(0, s.opacity);
    sparkleCtx.fillStyle = s.color;
    
    // Y2K 4-Point Star Sparkle
    drawFourPointStar(sparkleCtx, 0, 0, 4, s.size, s.size * 0.28);
    sparkleCtx.fill();
    sparkleCtx.restore();
  }

  // Update & Draw Celebration Confetti
  if (isConfettiActive || confettiList.length > 0) {
    for (let i = confettiList.length - 1; i >= 0; i--) {
      const c = confettiList[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += c.gravity;
      c.rotation += c.rotSpeed;

      if (c.y > window.innerHeight + 50) {
        if (isConfettiActive) {
          // Recycle
          c.y = -20;
          c.x = Math.random() * window.innerWidth;
          c.vy = 2 + Math.random() * 4;
        } else {
          confettiList.splice(i, 1);
          continue;
        }
      }

      sparkleCtx.save();
      sparkleCtx.translate(c.x, c.y);
      sparkleCtx.rotate((c.rotation * Math.PI) / 180);
      sparkleCtx.globalAlpha = c.opacity;

      if (c.emoji) {
        sparkleCtx.font = `${c.size}px sans-serif`;
        sparkleCtx.textAlign = 'center';
        sparkleCtx.textBaseline = 'middle';
        sparkleCtx.fillText(c.emoji, 0, 0);
      } else {
        sparkleCtx.fillStyle = c.color;
        sparkleCtx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
      }

      sparkleCtx.restore();
    }
  }

  requestAnimationFrame(renderAnimationLoop);
}

// Sound toggle button setup
function initSoundToggle() {
  const soundBtn = document.getElementById('sound-toggle');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.innerHTML = soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
    if (soundEnabled) {
      getAudioContext();
      playPop();
    }
  });
}

// Window load initializer
document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  initSoundToggle();
  initLetter();
  initFlipCards();
  initForgivenessButtons();
  initCelebrationControls();
});
