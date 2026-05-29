"use client";

import { useMemo } from "react";

// ─── Definisi semua badge ─────────────────────────────────────────────────────
export const SEMUA_BADGE = [
  {
    id: "first_lesson",
    emoji: "🌱",
    judul: "Langkah Pertama",
    deskripsi: "Selesaikan pelajaran pertamamu",
    warna: "from-green-400 to-emerald-500",
    bg: "bg-green-50",
    border: "border-green-200",
    teks: "text-green-700",
  },
  {
    id: "first_unit",
    emoji: "⭐",
    judul: "Unit Pertama",
    deskripsi: "Selesaikan 1 unit penuh",
    warna: "from-yellow-400 to-orange-400",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    teks: "text-yellow-700",
  },
  {
    id: "five_units",
    emoji: "🎯",
    judul: "Setengah Jalan",
    deskripsi: "Selesaikan 5 unit",
    warna: "from-blue-400 to-indigo-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
    teks: "text-blue-700",
  },
  {
    id: "a1_tuntas",
    emoji: "🎓",
    judul: "A1 Tuntas",
    deskripsi: "Selesaikan semua 25 unit A1",
    warna: "from-indigo-400 to-purple-500",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    teks: "text-indigo-700",
  },
  {
    id: "master",
    emoji: "🏆",
    judul: "Master",
    deskripsi: "Selesaikan semua 37 unit",
    warna: "from-yellow-400 to-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    teks: "text-yellow-700",
  },
  {
    id: "streak_7",
    emoji: "🔥",
    judul: "7 Hari Berturut",
    deskripsi: "Belajar 7 hari tanpa putus",
    warna: "from-orange-400 to-red-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
    teks: "text-orange-700",
  },
  {
    id: "streak_30",
    emoji: "🌟",
    judul: "30 Hari Berturut",
    deskripsi: "Belajar 30 hari tanpa putus",
    warna: "from-yellow-300 to-orange-500",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    teks: "text-yellow-700",
  },
  {
    id: "quiz_perfect",
    emoji: "💯",
    judul: "Nilai Sempurna",
    deskripsi: "Raih 100% di quiz manapun",
    warna: "from-pink-400 to-rose-500",
    bg: "bg-pink-50",
    border: "border-pink-200",
    teks: "text-pink-700",
  },
  {
    id: "quiz_10",
    emoji: "🧠",
    judul: "Quiz Maniac",
    deskripsi: "Selesaikan 10 sesi quiz",
    warna: "from-purple-400 to-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    teks: "text-purple-700",
  },
  {
    id: "vocab_50",
    emoji: "📚",
    judul: "Kutu Buku",
    deskripsi: "Lihat 50 kartu kosakata",
    warna: "from-sky-400 to-blue-500",
    bg: "bg-sky-50",
    border: "border-sky-200",
    teks: "text-sky-700",
  },
];

// ─── Hook: hitung badge yang sudah diraih ─────────────────────────────────────
export function useBadges({ completedLessons = [], streak = 0, progressData = null, unitBelajar = [] }) {
  const earned = useMemo(() => {
    const ids = new Set();

    // Hitung berapa unit yang sudah selesai 100%
    let unitSelesai = 0;
    let a1Tuntas = false;
    let masterTuntas = false;

    if (unitBelajar.length > 0) {
      const a1Units = unitBelajar.filter(u => u.level === "a1");
      const semuaUnits = unitBelajar;

      unitSelesai = semuaUnits.filter(u => {
        const ids = u.pelajaran.map(p => p.id);
        return ids.every(id => completedLessons.includes(id));
      }).length;

      a1Tuntas = a1Units.every(u => {
        return u.pelajaran.every(p => completedLessons.includes(p.id));
      });

      masterTuntas = semuaUnits.every(u => {
        return u.pelajaran.every(p => completedLessons.includes(p.id));
      });
    }

    // Badge berdasarkan pelajaran
    if (completedLessons.length >= 1) ids.add("first_lesson");
    if (unitSelesai >= 1) ids.add("first_unit");
    if (unitSelesai >= 5) ids.add("five_units");
    if (a1Tuntas) ids.add("a1_tuntas");
    if (masterTuntas) ids.add("master");

    // Badge berdasarkan streak
    if (streak >= 7) ids.add("streak_7");
    if (streak >= 30) ids.add("streak_30");

    // Badge dari progress data
    if (progressData) {
      const quizList = progressData.quiz || [];
      if (quizList.some(q => q.score === q.total && q.total > 0)) ids.add("quiz_perfect");
      if (quizList.length >= 10) ids.add("quiz_10");
      const vocabSeen = progressData.vocabSeen || [];
      if (vocabSeen.length >= 50) ids.add("vocab_50");
    }

    return SEMUA_BADGE.map(b => ({ ...b, earned: ids.has(b.id) }));
  }, [completedLessons, streak, progressData, unitBelajar]);

  return earned;
}
