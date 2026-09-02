/**
 * High-Performance Canvas Confetti & Fireworks Engine
 */

class ConfettiEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationFrame = null;
    this.colors = [
      '#FF6B6B', '#4ECDC4', '#FFE66D', '#FF9F1C', 
      '#F72585', '#7209B7', '#4361EE', '#4CC9F0', '#06D6A0'
    ];
    this.shapes = ['circle', 'rect', 'star', 'ribbon'];
    this.initCanvas();
    window.addEventListener('resize', () => this.resize());
  }

  initCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'confetti-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9999';
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.resize();
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticle(x, y, vx, vy, color, shape, size) {
    return {
      x: x || window.innerWidth / 2,
      y: y || window.innerHeight / 2,
      vx: vx || (Math.random() - 0.5) * 16,
      vy: vy || (Math.random() - 1.5) * 14,
      gravity: 0.28,
      drag: 0.96,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      color: color || this.colors[Math.floor(Math.random() * this.colors.length)],
      shape: shape || this.shapes[Math.floor(Math.random() * this.shapes.length)],
      size: size || (Math.random() * 8 + 6),
      alpha: 1,
      decay: Math.random() * 0.008 + 0.005,
      tilt: Math.random() * 10,
      tiltSpeed: Math.random() * 0.1 + 0.05
    };
  }

  // Massive celebration explosion from center
  blast(count = 120, originX, originY) {
    const x = originX !== undefined ? originX : window.innerWidth / 2;
    const y = originY !== undefined ? originY : window.innerHeight / 2;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 16 + 8;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed - 4; // slight upward bias
      this.particles.push(this.createParticle(x, y, vx, vy));
    }

    this.startLoop();
  }

  // Left & right side celebration cannons
  cannons(count = 100) {
    // Left Cannon
    for (let i = 0; i < count / 2; i++) {
      const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.6;
      const speed = Math.random() * 22 + 10;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      this.particles.push(this.createParticle(0, window.innerHeight * 0.8, vx, vy));
    }

    // Right Cannon
    for (let i = 0; i < count / 2; i++) {
      const angle = (-3 * Math.PI) / 4 + (Math.random() - 0.5) * 0.6;
      const speed = Math.random() * 22 + 10;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      this.particles.push(this.createParticle(window.innerWidth, window.innerHeight * 0.8, vx, vy));
    }

    this.startLoop();
  }

  // Fireworks burst at a specific coordinate
  firework(x, y) {
    const pCount = 60;
    const baseColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    for (let i = 0; i < pCount; i++) {
      const angle = (Math.PI * 2 * i) / pCount;
      const speed = Math.random() * 10 + 4;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const p = this.createParticle(x, y, vx, vy, baseColor, 'star', 6);
      p.decay = 0.015;
      this.particles.push(p);
    }
    this.startLoop();
  }

  startLoop() {
    if (!this.animationFrame) {
      this.loop();
    }
  }

  loop() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.tilt += p.tiltSpeed;
      p.alpha -= p.decay;

      if (p.alpha <= 0 || p.y > window.innerHeight + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.strokeStyle = p.color;

      const size = p.size * Math.cos(p.tilt);

      if (p.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, Math.abs(size) / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.shape === 'star') {
        this.drawStar(this.ctx, 0, 0, 5, Math.abs(size), Math.abs(size) / 2);
      } else if (p.shape === 'ribbon') {
        this.ctx.fillRect(-size, -p.size / 3, size * 2, p.size / 1.5);
      } else {
        this.ctx.fillRect(-size / 2, -p.size / 2, size, p.size);
      }

      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animationFrame = requestAnimationFrame(() => this.loop());
    } else {
      this.animationFrame = null;
    }
  }

  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
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
    ctx.fill();
  }
}

// Global Confetti singleton
window.addEventListener('DOMContentLoaded', () => {
  window.Confetti = new ConfettiEngine();
});
