/**
 * Web Audio API Sound Synthesizer
 * Zero external audio dependencies - 100% pure synthesized sound effects & background music!
 */

class SoundEffects {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.initAudioContext();
  }

  initAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext && !this.ctx) {
      this.ctx = new AudioContext();
    }
  }

  ensureContext() {
    if (!this.ctx) {
      this.initAudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.bgmPlaying) {
      this.stopBGM();
    }
    return this.isMuted;
  }

  // Balloon Pop / Click sound
  pop() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Candle Blow Puff sound
  blow() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(200, now + 0.35);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  // Party Horn sound
  partyHorn() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.linearRampToValueAtTime(440, now + 0.15);
    osc.frequency.linearRampToValueAtTime(415, now + 0.4);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.52);
  }

  // Sparkle / Magic Chime
  chime() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.36);
    });
  }

  // Victory / Cheer Fanfare
  fanfare() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    // Happy Birthday opening motif: G4, G4, A4, G4, C5, B4
    const melody = [
      { f: 392.00, d: 0.2 },
      { f: 392.00, d: 0.2 },
      { f: 440.00, d: 0.4 },
      { f: 392.00, d: 0.4 },
      { f: 523.25, d: 0.4 },
      { f: 493.88, d: 0.8 }
    ];

    let t = this.ctx.currentTime;
    melody.forEach((note) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + note.d + 0.05);

      t += note.d + 0.05;
    });
  }

  // Wheel Tick sound
  tick() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.02);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  // Game success sound
  correct() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [440, 554.37, 659.25, 880].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.26);
    });
  }

  // Ambient BGM (Festive 8-bit / Lo-Fi Melody Loop)
  startBGM() {
    if (this.bgmPlaying || this.isMuted) return;
    this.ensureContext();
    this.bgmPlaying = true;
    this.bgmStep = 0;

    // "Happy Birthday to you" notes sequence
    const notes = [
      { f: 261.63, len: 300 }, // C4
      { f: 261.63, len: 300 }, // C4
      { f: 293.66, len: 600 }, // D4
      { f: 261.63, len: 600 }, // C4
      { f: 349.23, len: 600 }, // F4
      { f: 329.63, len: 1200 },// E4
      { f: 0, len: 300 },      // rest
      { f: 261.63, len: 300 }, // C4
      { f: 261.63, len: 300 }, // C4
      { f: 293.66, len: 600 }, // D4
      { f: 261.63, len: 600 }, // C4
      { f: 392.00, len: 600 }, // G4
      { f: 349.23, len: 1200 },// F4
      { f: 0, len: 300 },      // rest
      { f: 261.63, len: 300 }, // C4
      { f: 261.63, len: 300 }, // C4
      { f: 523.25, len: 600 }, // C5
      { f: 440.00, len: 600 }, // A4
      { f: 349.23, len: 600 }, // F4
      { f: 329.63, len: 600 }, // E4
      { f: 293.66, len: 1200 },// D4
      { f: 0, len: 300 },      // rest
      { f: 466.16, len: 300 }, // Bb4
      { f: 466.16, len: 300 }, // Bb4
      { f: 440.00, len: 600 }, // A4
      { f: 349.23, len: 600 }, // F4
      { f: 392.00, len: 600 }, // G4
      { f: 349.23, len: 1400 },// F4
      { f: 0, len: 800 }       // long rest
    ];

    const playNext = () => {
      if (!this.bgmPlaying || this.isMuted) return;
      const current = notes[this.bgmStep];

      if (current.f > 0 && this.ctx) {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Warm electric piano / marimba feel
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(current.f, now);

        const durSec = (current.len * 0.8) / 1000;
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + durSec);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + durSec + 0.05);
      }

      this.bgmStep = (this.bgmStep + 1) % notes.length;
      this.bgmTimer = setTimeout(playNext, current.len);
    };

    playNext();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  toggleBGM() {
    if (this.bgmPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }
}

// Global audio singleton
const Sound = new SoundEffects();
if (typeof window !== 'undefined') {
  window.Sound = Sound;
}
