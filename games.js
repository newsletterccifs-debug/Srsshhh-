/**
 * Birthday Arcade & Activities Engine
 * Contains logic for Trivia, Balloon Pop Canvas Game, Wheel of Fortune, Fortune Cookies, and Memory Match.
 */

// ==========================================
// 1. TRIVIA QUIZ GAME
// ==========================================
class BirthdayTrivia {
  constructor() {
    this.questions = (window.BIRTHDAY_CONFIG && window.BIRTHDAY_CONFIG.quizQuestions) || [];
    this.currentIndex = 0;
    this.score = 0;
    this.userAnswers = [];
    this.container = document.getElementById('trivia-container');
  }

  init() {
    if (!this.container) return;
    this.currentIndex = 0;
    this.score = 0;
    this.userAnswers = [];
    this.renderQuestion();
  }

  renderQuestion() {
    if (this.currentIndex >= this.questions.length) {
      this.renderResults();
      return;
    }

    const q = this.questions[this.currentIndex];
    const progressPercent = ((this.currentIndex) / this.questions.length) * 100;

    this.container.innerHTML = `
      <div class="trivia-card glass-panel fade-in">
        <div class="quiz-header">
          <span class="quiz-badge">Question ${this.currentIndex + 1} of ${this.questions.length}</span>
          <span class="quiz-score-badge">⭐ Score: ${this.score * 100}</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
        </div>

        <h3 class="quiz-question">${q.question}</h3>

        <div class="quiz-options-grid">
          ${q.options.map((opt, i) => `
            <button class="quiz-option-btn" data-index="${i}">
              <span class="opt-letter">${String.fromCharCode(65 + i)}</span>
              <span class="opt-text">${opt}</span>
            </button>
          `).join('')}
        </div>

        <div id="quiz-feedback" class="quiz-feedback hidden"></div>
      </div>
    `;

    const btns = this.container.querySelectorAll('.quiz-option-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const selectedIndex = parseInt(btn.getAttribute('data-index'));
        this.handleAnswer(selectedIndex, btns);
      });
    });
  }

  handleAnswer(selectedIndex, buttons) {
    buttons.forEach(b => b.disabled = true);
    const q = this.questions[this.currentIndex];
    const isCorrect = selectedIndex === q.correct;
    const feedbackEl = document.getElementById('quiz-feedback');

    buttons[selectedIndex].classList.add(isCorrect ? 'correct-choice' : 'wrong-choice');
    if (!isCorrect) {
      buttons[q.correct].classList.add('correct-choice');
    }

    if (isCorrect) {
      this.score++;
      if (window.Sound) window.Sound.correct();
      if (window.Confetti) window.Confetti.blast(30);
    } else {
      if (window.Sound) window.Sound.pop();
    }

    feedbackEl.innerHTML = `
      <div class="feedback-box ${isCorrect ? 'fb-correct' : 'fb-wrong'}">
        <p class="fb-title">${isCorrect ? '🎉 Spot On!' : '😅 Close enough!'}</p>
        <p class="fb-desc">${q.explanation}</p>
        <button id="next-q-btn" class="btn-primary mt-3">
          ${this.currentIndex < this.questions.length - 1 ? 'Next Question ➔' : 'See Your Results 🏆'}
        </button>
      </div>
    `;
    feedbackEl.classList.remove('hidden');

    document.getElementById('next-q-btn').addEventListener('click', () => {
      this.currentIndex++;
      this.renderQuestion();
    });
  }

  renderResults() {
    const total = this.questions.length;
    const celebrant = (window.BIRTHDAY_CONFIG && window.BIRTHDAY_CONFIG.celebrant.name) || "the Birthday Star";
    if (window.Sound) window.Sound.fanfare();
    if (window.Confetti) window.Confetti.cannons(120);

    let rankTitle = "Certified Superfan & Bestie 🏅";
    if (this.score === total) rankTitle = "👑 Ultimate Birthday Soulmate (100% Master!)";
    else if (this.score >= total / 2) rankTitle = "⭐ True Partner in Crime";

    this.container.innerHTML = `
      <div class="trivia-results glass-panel fade-in text-center">
        <div class="result-trophy">🏆</div>
        <h2>Quiz Complete!</h2>
        <p class="result-score">You scored <strong>${this.score} / ${total}</strong> (${Math.round((this.score / total) * 100)}%)</p>
        <div class="certificate-badge">${rankTitle}</div>
        <p class="result-note mt-2">You truly know and appreciate ${celebrant}! Print your diploma or share the love!</p>

        <!-- Interactive Diploma Card -->
        <div class="diploma-card mt-4" id="diploma-card">
          <div class="diploma-border">
            <span class="diploma-seal">⭐ CERTIFIED BESTIE ⭐</span>
            <h3>Official Certificate of Friendship</h3>
            <p>This certifies that the player has proven supreme knowledge and appreciation for</p>
            <h4 class="diploma-star-name">${celebrant}</h4>
            <p class="diploma-date">${new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <div class="btn-group mt-4 justify-center">
          <button id="retry-quiz-btn" class="btn-secondary">🔄 Play Again</button>
          <button id="confetti-blast-btn" class="btn-primary">🎉 Blast Confetti</button>
        </div>
      </div>
    `;

    document.getElementById('retry-quiz-btn').addEventListener('click', () => this.init());
    document.getElementById('confetti-blast-btn').addEventListener('click', () => {
      if (window.Confetti) window.Confetti.cannons(100);
      if (window.Sound) window.Sound.partyHorn();
    });
  }
}

// ==========================================
// 2. BALLOON POP FRENZY (CANVAS MINI-GAME)
// ==========================================
class BalloonPopGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.balloons = [];
    this.score = 0;
    this.combo = 0;
    this.timeLeft = 30;
    this.isRunning = false;
    this.timerInterval = null;
    this.spawnInterval = null;
    this.animFrame = null;
    this.highScore = parseInt(localStorage.getItem('balloon_highscore') || '0');

    this.colors = ['#FF4D6D', '#FFB703', '#06D6A0', '#118AB2', '#9D4EDD', '#F72585'];

    this.initCanvasSize();
    this.bindEvents();
  }

  initCanvasSize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = Math.min(rect.width, 800);
    this.canvas.height = 480;
  }

  bindEvents() {
    const handlePop = (clientX, clientY) => {
      if (!this.isRunning) return;
      const rect = this.canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      let hit = false;
      for (let i = this.balloons.length - 1; i >= 0; i--) {
        const b = this.balloons[i];
        const dist = Math.hypot(b.x - x, b.y - y);
        if (dist <= b.radius) {
          hit = true;
          this.popBalloon(i);
          break;
        }
      }

      if (!hit) {
        this.combo = 0;
      }
    };

    this.canvas.addEventListener('mousedown', (e) => handlePop(e.clientX, e.clientY));
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        handlePop(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }

  start() {
    this.initCanvasSize();
    this.balloons = [];
    this.score = 0;
    this.combo = 0;
    this.timeLeft = 30;
    this.isRunning = true;

    this.updateHUD();

    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.spawnInterval) clearInterval(this.spawnInterval);

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.updateHUD();
      if (this.timeLeft <= 0) {
        this.gameOver();
      }
    }, 1000);

    this.spawnInterval = setInterval(() => {
      if (this.isRunning) {
        this.spawnBalloon();
      }
    }, 450);

    this.loop();
  }

  spawnBalloon() {
    const radius = Math.random() * 15 + 24;
    const isGold = Math.random() < 0.15;
    const isBomb = !isGold && Math.random() < 0.08;

    this.balloons.push({
      x: Math.random() * (this.canvas.width - radius * 2) + radius,
      y: this.canvas.height + radius + 10,
      radius: radius,
      speed: Math.random() * 2.5 + 2 + (30 - this.timeLeft) * 0.08,
      color: isGold ? '#FFD700' : this.colors[Math.floor(Math.random() * this.colors.length)],
      isGold: isGold,
      isBomb: isBomb,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.06 + 0.03
    });
  }

  popBalloon(index) {
    const b = this.balloons[index];
    this.balloons.splice(index, 1);

    if (window.Sound) window.Sound.pop();

    if (b.isBomb) {
      // Clear nearby balloons
      this.score += 200;
      this.combo += 2;
      this.balloons = [];
      if (window.Sound) window.Sound.partyHorn();
      if (window.Confetti) window.Confetti.blast(40, b.x, b.y);
    } else if (b.isGold) {
      this.score += 150 * (1 + Math.floor(this.combo / 3));
      this.combo++;
      if (window.Sound) window.Sound.chime();
      if (window.Confetti) window.Confetti.blast(25, b.x, b.y);
    } else {
      this.combo++;
      this.score += 50 * (1 + Math.floor(this.combo / 5));
    }

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('balloon_highscore', this.highScore.toString());
    }

    this.updateHUD();
  }

  updateHUD() {
    const scoreEl = document.getElementById('balloon-score');
    const timeEl = document.getElementById('balloon-time');
    const comboEl = document.getElementById('balloon-combo');
    const highEl = document.getElementById('balloon-highscore');

    if (scoreEl) scoreEl.textContent = this.score;
    if (timeEl) timeEl.textContent = this.timeLeft + 's';
    if (comboEl) {
      comboEl.textContent = this.combo > 1 ? `Combo x${this.combo}! 🔥` : '';
    }
    if (highEl) highEl.textContent = this.highScore;
  }

  loop() {
    if (!this.isRunning) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.balloons.length - 1; i >= 0; i--) {
      const b = this.balloons[i];
      b.y -= b.speed;
      b.wobble += b.wobbleSpeed;
      const currentX = b.x + Math.sin(b.wobble) * 8;

      if (b.y < -b.radius * 2) {
        this.balloons.splice(i, 1);
        continue;
      }

      this.ctx.save();
      // Balloon body
      this.ctx.beginPath();
      this.ctx.arc(currentX, b.y, b.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = b.color;
      this.ctx.fill();

      // Highlight/shine
      this.ctx.beginPath();
      this.ctx.arc(currentX - b.radius * 0.35, b.y - b.radius * 0.35, b.radius * 0.25, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      this.ctx.fill();

      // Balloon tie knot
      this.ctx.beginPath();
      this.ctx.moveTo(currentX - 4, b.y + b.radius);
      this.ctx.lineTo(currentX + 4, b.y + b.radius);
      this.ctx.lineTo(currentX, b.y + b.radius + 6);
      this.ctx.fillStyle = b.color;
      this.ctx.fill();

      // Balloon string
      this.ctx.beginPath();
      this.ctx.moveTo(currentX, b.y + b.radius + 6);
      this.ctx.quadraticCurveTo(currentX + Math.sin(b.wobble) * 6, b.y + b.radius + 18, currentX, b.y + b.radius + 28);
      this.ctx.strokeStyle = 'rgba(200, 200, 200, 0.6)';
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();

      // Special icons
      if (b.isGold) {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 16px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('⭐', currentX, b.y + 6);
      } else if (b.isBomb) {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 16px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🎁', currentX, b.y + 6);
      }

      this.ctx.restore();
    }

    this.animFrame = requestAnimationFrame(() => this.loop());
  }

  gameOver() {
    this.isRunning = false;
    clearInterval(this.timerInterval);
    clearInterval(this.spawnInterval);
    if (this.animFrame) cancelAnimationFrame(this.animFrame);

    if (window.Sound) window.Sound.fanfare();
    if (window.Confetti) window.Confetti.blast(80);

    const overlay = document.getElementById('balloon-game-overlay');
    if (overlay) {
      overlay.innerHTML = `
        <div class="game-over-box glass-panel text-center fade-in">
          <h3>⏰ Time's Up!</h3>
          <p class="final-score-text">You popped a fantastic score of</p>
          <div class="big-score">${this.score}</div>
          <p class="highscore-badge">🏆 High Score: ${this.highScore}</p>
          <button id="restart-balloon-btn" class="btn-primary mt-3">🎈 Play Again</button>
        </div>
      `;
      overlay.classList.remove('hidden');
      document.getElementById('restart-balloon-btn').addEventListener('click', () => {
        overlay.classList.add('hidden');
        this.start();
      });
    }
  }
}

// ==========================================
// 3. WHEEL OF BIRTHDAY FORTUNE
// ==========================================
class WheelOfFortune {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.prizes = (window.BIRTHDAY_CONFIG && window.BIRTHDAY_CONFIG.wheelPrizes) || [
      { text: "☕ Free Coffee", color: "#FF6B6B" },
      { text: "🍕 Free Pizza", color: "#4ECDC4" },
      { text: "🛋️ Chores Free Pass", color: "#FFE66D" },
      { text: "🍰 Cake Pass", color: "#F72585" }
    ];

    this.currentAngle = 0;
    this.isSpinning = false;
    this.spinVelocity = 0;
    this.init();
  }

  init() {
    this.canvas.width = 380;
    this.canvas.height = 380;
    this.drawWheel();

    const spinBtn = document.getElementById('spin-wheel-btn');
    if (spinBtn) {
      spinBtn.addEventListener('click', () => this.spin());
    }
  }

  drawWheel() {
    const numSlices = this.prizes.length;
    const sliceAngle = (Math.PI * 2) / numSlices;
    const radius = this.canvas.width / 2 - 10;
    const center = this.canvas.width / 2;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < numSlices; i++) {
      const angle = this.currentAngle + i * sliceAngle;
      this.ctx.beginPath();
      this.ctx.moveTo(center, center);
      this.ctx.arc(center, center, radius, angle, angle + sliceAngle);
      this.ctx.closePath();
      this.ctx.fillStyle = this.prizes[i].color;
      this.ctx.fill();
      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.lineWidth = 3;
      this.ctx.stroke();

      // Text label
      this.ctx.save();
      this.ctx.translate(center, center);
      this.ctx.rotate(angle + sliceAngle / 2);
      this.ctx.textAlign = 'right';
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = 'bold 13px system-ui, sans-serif';
      this.ctx.shadowColor = 'rgba(0,0,0,0.5)';
      this.ctx.shadowBlur = 4;
      this.ctx.fillText(this.prizes[i].text, radius - 20, 5);
      this.ctx.restore();
    }

    // Center peg
    this.ctx.beginPath();
    this.ctx.arc(center, center, 24, 0, Math.PI * 2);
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fill();
    this.ctx.strokeStyle = '#333333';
    this.ctx.lineWidth = 4;
    this.ctx.stroke();

    this.ctx.fillStyle = '#333333';
    this.ctx.font = 'bold 16px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('🎁', center, center + 6);
  }

  spin() {
    if (this.isSpinning) return;
    this.isSpinning = true;
    this.spinVelocity = Math.random() * 0.25 + 0.35; // initial angular speed
    const friction = 0.988;

    let lastTickAngle = this.currentAngle;
    const sliceAngle = (Math.PI * 2) / this.prizes.length;

    const animate = () => {
      this.spinVelocity *= friction;
      this.currentAngle += this.spinVelocity;
      this.drawWheel();

      if (Math.abs(this.currentAngle - lastTickAngle) >= sliceAngle) {
        if (window.Sound) window.Sound.tick();
        lastTickAngle = this.currentAngle;
      }

      if (this.spinVelocity > 0.001) {
        requestAnimationFrame(animate);
      } else {
        this.isSpinning = false;
        this.determineWinner();
      }
    };

    animate();
  }

  determineWinner() {
    const numSlices = this.prizes.length;
    const sliceAngle = (Math.PI * 2) / numSlices;
    // Pointer is at the top (3*PI / 2)
    const normalizedAngle = (Math.PI * 2 - (this.currentAngle % (Math.PI * 2))) % (Math.PI * 2);
    // Pointer is at angle 3*PI/2 = 270 deg (top)
    const topPointerAngle = (normalizedAngle + (3 * Math.PI) / 2) % (Math.PI * 2);
    const winningIndex = Math.floor(topPointerAngle / sliceAngle) % numSlices;
    const prize = this.prizes[winningIndex];

    if (window.Sound) window.Sound.fanfare();
    if (window.Confetti) window.Confetti.blast(80);

    const resultModal = document.getElementById('wheel-result-modal');
    if (resultModal) {
      resultModal.innerHTML = `
        <div class="modal-card glass-panel fade-in text-center">
          <span class="modal-close-btn" id="close-wheel-modal">✖</span>
          <div class="result-prize-icon">🎉</div>
          <h3>You Won!</h3>
          <div class="prize-pill mt-2">${prize.text}</div>
          <p class="prize-desc mt-3">Valid immediately for the Birthday Star to redeem from anyone present!</p>
          <button class="btn-primary mt-3" id="claim-prize-btn">Claim Birthday Coupon</button>
        </div>
      `;
      resultModal.classList.remove('hidden');

      const close = () => resultModal.classList.add('hidden');
      document.getElementById('close-wheel-modal').addEventListener('click', close);
      document.getElementById('claim-prize-btn').addEventListener('click', () => {
        close();
        if (window.Confetti) window.Confetti.cannons(50);
      });
    }
  }
}

// ==========================================
// 4. FORTUNE COOKIE & WISHING JAR
// ==========================================
class FortuneJar {
  constructor() {
    this.fortunes = (window.BIRTHDAY_CONFIG && window.BIRTHDAY_CONFIG.fortunes) || [
      "🌟 A year of wondrous joy and success awaits you!"
    ];
    this.init();
  }

  init() {
    const cookieBtn = document.getElementById('crack-cookie-btn');
    const wishingJar = document.getElementById('wishing-jar-card');

    if (cookieBtn) {
      cookieBtn.addEventListener('click', () => this.crackCookie());
    }
    if (wishingJar) {
      wishingJar.addEventListener('click', () => this.drawJarFortune());
    }
  }

  crackCookie() {
    const cookieBox = document.getElementById('fortune-cookie-box');
    const fortuneDisplay = document.getElementById('fortune-text-display');
    if (!cookieBox || !fortuneDisplay) return;

    if (window.Sound) window.Sound.blow();
    if (window.Confetti) window.Confetti.blast(30);

    cookieBox.classList.add('cracked');
    const fortune = this.fortunes[Math.floor(Math.random() * this.fortunes.length)];

    setTimeout(() => {
      fortuneDisplay.innerHTML = `<div class="fortune-paper fade-in">${fortune}</div>`;
      if (window.Sound) window.Sound.chime();
    }, 400);
  }

  drawJarFortune() {
    const jarDisplay = document.getElementById('jar-fortune-display');
    if (!jarDisplay) return;

    if (window.Sound) window.Sound.chime();
    if (window.Confetti) window.Confetti.blast(25);

    const fortune = this.fortunes[Math.floor(Math.random() * this.fortunes.length)];
    jarDisplay.innerHTML = `
      <div class="jar-card-result fade-in">
        <span class="jar-star-icon">✨</span>
        <p>${fortune}</p>
      </div>
    `;
  }
}

// ==========================================
// 5. BIRTHDAY EMOJI MATCH PUZZLE
// ==========================================
class EmojiMatchPuzzle {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.emojis = ['🎂', '🎈', '🎁', '🥳', '🥂', '🍰', '⭐', '🍕'];
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.init();
  }

  init() {
    this.cards = [...this.emojis, ...this.emojis].sort(() => Math.random() - 0.5);
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="match-game-wrapper">
        <div class="match-stats">
          <span>Pairs Matched: <strong id="matched-count">${this.matchedPairs} / 8</strong></span>
          <span>Moves: <strong id="moves-count">${this.moves}</strong></span>
          <button id="reset-match-btn" class="btn-small">🔄 Reset</button>
        </div>
        <div class="match-grid">
          ${this.cards.map((emoji, idx) => `
            <div class="match-card" data-index="${idx}" data-emoji="${emoji}">
              <div class="match-card-inner">
                <div class="match-card-front">❓</div>
                <div class="match-card-back">${emoji}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.getElementById('reset-match-btn').addEventListener('click', () => this.init());

    const cardElements = this.container.querySelectorAll('.match-card');
    cardElements.forEach(card => {
      card.addEventListener('click', () => this.flipCard(card));
    });
  }

  flipCard(card) {
    if (this.flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
      return;
    }

    if (window.Sound) window.Sound.pop();
    card.classList.add('flipped');
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.moves++;
      document.getElementById('moves-count').textContent = this.moves;
      this.checkMatch();
    }
  }

  checkMatch() {
    const [c1, c2] = this.flippedCards;
    const isMatch = c1.dataset.emoji === c2.dataset.emoji;

    if (isMatch) {
      this.matchedPairs++;
      document.getElementById('matched-count').textContent = `${this.matchedPairs} / 8`;
      c1.classList.add('matched');
      c2.classList.add('matched');
      this.flippedCards = [];

      if (window.Sound) window.Sound.correct();

      if (this.matchedPairs === this.emojis.length) {
        if (window.Sound) window.Sound.fanfare();
        if (window.Confetti) window.Confetti.blast(100);
      }
    } else {
      setTimeout(() => {
        c1.classList.remove('flipped');
        c2.classList.remove('flipped');
        this.flippedCards = [];
      }, 900);
    }
  }
}

// Global initialization helper for arcade page
window.initArcadeGames = () => {
  window.Trivia = new BirthdayTrivia();
  window.Trivia.init();

  window.BalloonGame = new BalloonPopGame('balloon-game-canvas');
  const startBalloonBtn = document.getElementById('start-balloon-btn');
  if (startBalloonBtn) {
    startBalloonBtn.addEventListener('click', () => {
      document.getElementById('balloon-start-screen').classList.add('hidden');
      window.BalloonGame.start();
    });
  }

  window.Wheel = new WheelOfFortune('wheel-canvas');
  window.Fortune = new FortuneJar();
  window.EmojiMatch = new EmojiMatchPuzzle('emoji-match-container');
};
