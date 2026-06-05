// src/lib/speech.js
// Text-to-speech menggunakan Web Speech API (gratis, built-in browser)
// Tidak perlu file audio eksternal

/**
 * Ucapkan teks dalam bahasa Inggris.
 * @param {string} text  - teks yang mau diucapkan
 * @param {number} rate  - kecepatan bicara (0.6–1.0 bagus untuk belajar)
 */
export function speak(text, rate = 0.82) {
  if (typeof window === "undefined") return;
  if (!window.speechSynthesis) return;

  // Hentikan ucapan sebelumnya agar tidak tumpang tindih
  window.speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang  = "en-US";
  utter.rate  = rate;
  utter.pitch = 1;

  window.speechSynthesis.speak(utter);
}
