/**
 * Web Audio API synthesized micro-sounds
 * Zero external assets required, crisp sci-fi acoustic feedback.
 */

class SoundController {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.playTone(600, 'sine', 0.08, 0.05);
    }
    return this.enabled;
  }

  playTone(freq, type = 'sine', duration = 0.08, volume = 0.04) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy catch
    }
  }

  playClick() {
    this.playTone(850, 'sine', 0.04, 0.03);
  }

  playHover() {
    this.playTone(420, 'sine', 0.03, 0.015);
  }

  playSuccess() {
    this.playTone(523.25, 'triangle', 0.1, 0.04);
    setTimeout(() => this.playTone(659.25, 'triangle', 0.12, 0.04), 80);
    setTimeout(() => this.playTone(783.99, 'triangle', 0.18, 0.04), 160);
  }

  playWarp() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch {}
  }
}

export const soundFx = new SoundController();
