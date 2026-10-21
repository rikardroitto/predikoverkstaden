// ============================================================================
// PREDIKOVERKSTADEN – Web Audio API Syntetisk Ljudmotor
// ============================================================================

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playTone(freq, type = "sine", duration = 0.25, gainVal = 0.08, delay = 0) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainVal, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  playStep() {
    this.playTone(220, "triangle", 0.08, 0.04, 0);
    this.playTone(260, "triangle", 0.08, 0.03, 0.09);
  }

  playInsight() {
    // Varm treklang när en ny homiletisk insikt föds
    this.playTone(440, "sine", 0.4, 0.07, 0);
    this.playTone(554.37, "sine", 0.45, 0.07, 0.08);
    this.playTone(659.25, "sine", 0.6, 0.08, 0.16);
  }

  playSynergy() {
    // Glänsande ackord för arbetsrutin-synergi
    this.playTone(523.25, "triangle", 0.4, 0.08, 0);
    this.playTone(659.25, "triangle", 0.4, 0.08, 0.07);
    this.playTone(783.99, "triangle", 0.5, 0.08, 0.14);
    this.playTone(1046.5, "sine", 0.7, 0.09, 0.21);
  }

  playDisruption() {
    // Telefonringning / knackning på dörren
    this.playTone(587.33, "square", 0.12, 0.04, 0);
    this.playTone(493.88, "square", 0.14, 0.04, 0.13);
    this.playTone(587.33, "square", 0.12, 0.04, 0.28);
  }

  playChurchBell() {
    // Kyrkklockor inför söndagens högmässa
    const freqs = [293.66, 440, 587.33];
    freqs.forEach((f, idx) => {
      this.playTone(f, "sine", 1.8, 0.09 / (idx + 1), 0);
      this.playTone(f * 1.5, "sine", 1.2, 0.04 / (idx + 1), 0.02);
    });
    setTimeout(() => {
      freqs.forEach((f, idx) => {
        this.playTone(f * 0.89, "sine", 2.0, 0.09 / (idx + 1), 0);
      });
    }, 650);
  }

  playOrganChord() {
    // Varmt orgelackord
    const chord = [261.63, 329.63, 392.0, 523.25];
    chord.forEach((f) => {
      this.playTone(f, "triangle", 1.4, 0.04, 0);
    });
  }
}

window.soundEngine = new SoundEngine();
