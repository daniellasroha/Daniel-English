"use client";

import { useState, useEffect, useCallback } from "react";

const KEY = "daniel_english_level";

// Migrasi nilai lama ke baru (agar pengguna lama tidak kehilangan level)
function migrateLevel(saved) {
  if (saved === "pemula") return "a1";
  if (saved === "menengah") return "a2";
  return saved;
}

// Definisi konten per level CEFR
export const LEVEL_CONFIG = {
  a1: {
    label: "A1",
    sublabel: "Pemula",
    emoji: "🌱",
    warna: "bg-green-500",
    warnaLight: "bg-green-50",
    border: "border-green-300",
    teks: "text-green-700",
    deskripsi: "Kosakata dasar, To Be, Simple Present, Can — level pemula CEFR A1",
    vocabLevel: "a1",             // hanya kata level a1
    grammarTopics: [1, 3, 9, 10], // To Be + Simple Present + Salam + Kata Ganti
    quizRoutes: ["/quiz/vocabulary", "/quiz/grammar", "/quiz/translation", "/quiz/typing"],
  },
  a2: {
    label: "A2",
    sublabel: "Menengah Awal",
    emoji: "📗",
    warna: "bg-blue-500",
    warnaLight: "bg-blue-50",
    border: "border-blue-300",
    teks: "text-blue-700",
    deskripsi: "Past, Future, Modal, Comparative, Countable/Uncountable — CEFR A2",
    vocabLevel: "a2",             // kata a1 + a2
    grammarTopics: [1, 2, 3, 4, 5, 6, 7, 8],
    quizRoutes: ["/quiz/vocabulary", "/quiz/grammar", "/quiz/translation", "/quiz/mixed", "/quiz/spelling", "/quiz/typing"],
  },
  b1: {
    label: "B1",
    sublabel: "Menengah",
    emoji: "🚀",
    warna: "bg-purple-500",
    warnaLight: "bg-purple-50",
    border: "border-purple-300",
    teks: "text-purple-700",
    deskripsi: "Present Perfect, Conjunctions lanjutan — level menengah CEFR B1",
    vocabLevel: "b1",             // semua kata (a1 + a2)
    grammarTopics: [1, 2, 3, 4, 5, 6, 7, 8],
    quizRoutes: ["/quiz/vocabulary", "/quiz/grammar", "/quiz/translation", "/quiz/mixed", "/quiz/spelling", "/quiz/typing"],
  },
};

export function useLevel() {
  const [level, setLevelState] = useState(null); // null = belum dipilih
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      const migrated = saved ? migrateLevel(saved) : null;
      // Jika ada migrasi, simpan nilai baru
      if (saved && migrated !== saved) {
        localStorage.setItem(KEY, migrated);
      }
      setLevelState(migrated || null);
    } catch {
      setLevelState(null);
    }
    setLoaded(true);
  }, []);

  const setLevel = useCallback((lvl) => {
    localStorage.setItem(KEY, lvl);
    setLevelState(lvl);
  }, []);

  const config = level ? LEVEL_CONFIG[level] : null;

  return { level, setLevel, config, loaded };
}
