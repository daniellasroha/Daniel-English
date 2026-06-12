// Target harian — hitung aktivitas belajar hari ini (pelajaran selesai + sesi kuis)
// Dipanggil dari useLearning.completeLesson dan useProgress.recordQuiz

const KEY = "daniel_english_target_harian";
export const TARGET_HARIAN = 3; // 3 aktivitas per hari

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

// Catat satu aktivitas (otomatis reset saat ganti hari)
export function catatAktivitas() {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : null;
    const today = todayStr();
    const count = data && data.date === today ? data.count + 1 : 1;
    localStorage.setItem(KEY, JSON.stringify({ date: today, count }));
  } catch {}
}

// Ambil jumlah aktivitas hari ini
export function getAktivitasHariIni() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return 0;
    const data = JSON.parse(raw);
    return data.date === todayStr() ? data.count : 0;
  } catch {
    return 0;
  }
}
