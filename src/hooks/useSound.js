"use client";

// Simpan satu AudioContext agar tidak dibuat ulang terus
let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume jika browser suspend otomatis
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function nada(freq, mulai, durasi, type = "sine", volume = 0.3) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, ctx.currentTime + mulai);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + mulai + durasi);
  osc.start(ctx.currentTime + mulai);
  osc.stop(ctx.currentTime + mulai + durasi + 0.05);
}

export function useSound() {
  function bunyiBenar() {
    try {
      // Tiga nada naik: C5 → E5 → G5
      nada(523, 0,    0.15);
      nada(659, 0.13, 0.15);
      nada(784, 0.26, 0.25);
    } catch (e) {}
  }

  function bunyiSalah() {
    try {
      // Dua nada turun — buzz pendek
      nada(350, 0,    0.2, "sawtooth", 0.2);
      nada(220, 0.18, 0.25, "sawtooth", 0.15);
    } catch (e) {}
  }

  function bunyiSelesai() {
    try {
      // Melodi 4 nada naik — ta-da!
      nada(523,  0,    0.2);
      nada(659,  0.18, 0.2);
      nada(784,  0.36, 0.2);
      nada(1047, 0.54, 0.4);
    } catch (e) {}
  }

  return { bunyiBenar, bunyiSalah, bunyiSelesai };
}
