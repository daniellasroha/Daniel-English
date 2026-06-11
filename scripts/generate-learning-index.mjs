// Script: generate learningPathIndex.js dari learningPath.js
// + validasi data (mencegah bug seperti tipe "kuis" yang merusak 8 kuis)
//
// Jalankan: npm run gen:index
// Otomatis jalan sebelum `npm run dev` dan `npm run build` (predev/prebuild)
//
// KENAPA: learningPath.js ~500 KB dan ikut terunduh di homepage hanya untuk
// tombol "Lanjutkan Belajar". Indeks ini berisi kerangka ringan (id, judul,
// emoji, level, id pelajaran) sehingga data penuh hanya dimuat di /belajar.

import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";
import { writeFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = join(__dirname, "..", "src", "data", "learningPath.js");
const outPath = join(__dirname, "..", "src", "data", "learningPathIndex.js");

const { learningPath } = await import(pathToFileURL(dataPath).href);

// ─── VALIDASI ─────────────────────────────────────────────────────────────────
const errors = [];
const seenLessonIds = new Set();
const TIPE_VALID = new Set(["vocab", "quiz"]);

learningPath.forEach((unit, ui) => {
  if (!unit.id) errors.push(`Unit #${ui} ("${unit.judul}") tidak punya id`);
  if (!unit.level) errors.push(`Unit "${unit.judul}" tidak punya level`);
  if (!Array.isArray(unit.pelajaran) || unit.pelajaran.length === 0)
    errors.push(`Unit "${unit.judul}" tidak punya pelajaran`);

  (unit.pelajaran || []).forEach((p) => {
    if (seenLessonIds.has(p.id))
      errors.push(`ID pelajaran duplikat: "${p.id}" (unit "${unit.judul}")`);
    seenLessonIds.add(p.id);

    if (!TIPE_VALID.has(p.tipe))
      errors.push(`Tipe tidak valid "${p.tipe}" di pelajaran "${p.id}" — harus "vocab" atau "quiz"`);

    if (p.tipe === "vocab" && (!p.kartu || p.kartu.length === 0))
      errors.push(`Pelajaran vocab "${p.id}" tidak punya kartu`);
    if (p.tipe === "quiz" && (!p.soal || p.soal.length === 0))
      errors.push(`Pelajaran quiz "${p.id}" tidak punya soal`);

    (p.soal || []).forEach((s, si) => {
      if (!Array.isArray(s.pilihan) || s.pilihan.length < 2)
        errors.push(`Soal #${si} di "${p.id}" pilihan < 2`);
      if (s.jawaban == null || s.jawaban < 0 || s.jawaban >= (s.pilihan || []).length)
        errors.push(`Soal #${si} di "${p.id}" index jawaban di luar range: ${s.jawaban}`);
    });
  });
});

if (errors.length) {
  console.error(`\n❌ VALIDASI GAGAL — ${errors.length} masalah di learningPath.js:\n`);
  errors.forEach((e) => console.error("  • " + e));
  process.exit(1);
}

// ─── GENERATE INDEKS ──────────────────────────────────────────────────────────
const index = learningPath.map((u) => ({
  id: u.id,
  judul: u.judul,
  emoji: u.emoji,
  level: u.level,
  pelajaran: u.pelajaran.map((p) => ({ id: p.id })),
}));

const banner = `// ⚠️ FILE INI DI-GENERATE OTOMATIS — JANGAN EDIT MANUAL
// Sumber: src/data/learningPath.js → jalankan \`npm run gen:index\` setelah mengubahnya
// Berisi kerangka ringan agar homepage/progress tidak perlu memuat data penuh (~500 KB)

export const learningPathIndex = `;

writeFileSync(outPath, banner + JSON.stringify(index, null, 1) + ";\n");

const totalLessons = index.reduce((a, u) => a + u.pelajaran.length, 0);
console.log(`✅ Validasi lolos: ${learningPath.length} unit, ${totalLessons} pelajaran, ${seenLessonIds.size} id unik`);
console.log(`✅ Indeks dibuat: src/data/learningPathIndex.js`);
