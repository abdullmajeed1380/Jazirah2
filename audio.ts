/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private intervalId: any = null;

  private init() {
    if (!this.ctx) {
      // @ts-ignore
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play outgoing ringtone (American ringback style: 440Hz + 480Hz, 2s on, 4s off)
  playOutgoingRing() {
    this.init();
    this.stop();
    if (!this.ctx) return;

    const playTone = () => {
      if (!this.ctx) return;
      
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc1.frequency.value = 440;
      osc2.frequency.value = 480;
      
      gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.08, this.ctx.currentTime + 1.8);
      gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 2.0);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc1.start();
      osc2.start();

      setTimeout(() => {
        try {
          osc1.stop();
          osc2.stop();
        } catch (e) {}
      }, 2100);
    };

    playTone();
    this.intervalId = setInterval(playTone, 4000);
  }

  // Play incoming ringtone (Acoustic iPhone style Marimba: fast plucky melody)
  playIncomingRing() {
    this.init();
    this.stop();
    if (!this.ctx) return;

    const playMelody = () => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      // iPhone "Opening" Marimba melody sequence
      const sequence = [
        { freq: 659.25, time: 0.0 },   // E5
        { freq: 830.61, time: 0.12 },  // G#5
        { freq: 987.77, time: 0.24 },  // B5
        { freq: 1318.51, time: 0.36 }, // E6
        { freq: 1244.51, time: 0.48 }, // D#6
        { freq: 987.77, time: 0.60 },  // B5
        { freq: 830.61, time: 0.72 },  // G#5
        { freq: 739.99, time: 0.84 },  // F#5
        { freq: 830.61, time: 0.96 },  // G#5
        { freq: 987.77, time: 1.08 },  // B5
        { freq: 830.61, time: 1.20 },  // G#5
      ];

      sequence.forEach(({ freq, time }) => {
        if (!this.ctx) return;
        
        const noteTime = now + time;

        // Fundamental oscillator (woody core)
        const osc1 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.value = freq;

        // Mallet secondary harmonic (creates the glass/acoustic chime click)
        const osc2 = this.ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = freq * 2; 

        // Individual volume controls
        const gain1 = this.ctx.createGain();
        const gain2 = this.ctx.createGain();

        // Core pluck envelope
        gain1.gain.setValueAtTime(0, noteTime);
        gain1.gain.linearRampToValueAtTime(0.08, noteTime + 0.01);
        gain1.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

        // Fast transient click decay
        gain2.gain.setValueAtTime(0, noteTime);
        gain2.gain.linearRampToValueAtTime(0.04, noteTime + 0.005);
        gain2.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.12);

        osc1.connect(gain1);
        osc2.connect(gain2);

        gain1.connect(this.ctx.destination);
        gain2.connect(this.ctx.destination);

        osc1.start(noteTime);
        osc2.start(noteTime);

        osc1.stop(noteTime + 0.4);
        osc2.stop(noteTime + 0.4);
      });
    };

    playMelody();
    this.intervalId = setInterval(playMelody, 2000);
  }

  // Play a quick success tone on connection
  playConnectBeep() {
    this.init();
    this.stop();
    if (!this.ctx) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc1.frequency.value = 600;
    osc2.frequency.value = 800;
    
    const now = this.ctx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.1, now + 0.05);
    gainNode.gain.setValueAtTime(0.1, now + 0.2);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.25);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(now + 0.3);
    osc2.stop(now + 0.3);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const audio = new AudioEngine();
