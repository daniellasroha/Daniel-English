"use client";

import { useState, useEffect, useCallback } from "react";

const KEY = "daniel_english_level";

// Definisi konten per level
export const LEVEL_CONFIG = {
  pemula: {
    label: "Pemula",
    emoji: "🌱",
    warna: "bg-green-500",
    warnaLight: "bg-green-50",
    border: "border-green-300",
    teks: "text-green-700",
    deskripsi: "Kosakata dasar, tata bahasa sederhana, dan quiz pilihan ganda",
    vocabIds: null,        // null = filter by maxId
    vocabMaxId: 64,        // hanya kata id 1-64
    grammarTopics: [1, 2, 3, 4], // Simple Present, Simple Past, To Be, Present Continuous
    quizRoutes: ["/quiz/vocabulary", "/quiz/grammar"],
  },
  menengah: {
    label: "Menengah",
    emoji: "🚀",
    warna: "bg-indigo-500",
    warnaLight: "bg-indigo-50",
    border: "border-indigo-300",
    teks: "text-indigo-700",
    deskripsi: "Semua kosakata, semua topik grammar, dan semua jenis quiz",
    vocabMaxId: 9999,      // semua kata
    grammarTopics: [1, 2, 3, 4, 5, 6, 7, 8], // semua topik
    quizRoutes: ["/quiz/vocabulary", "/quiz/grammar", "/quiz/mixed", "/quiz/spelling"],
  },
};

export function useLevel() {
  const [level, setLevelState] = useState(null); // null = belum dipilih
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      setLevelState(saved || null);
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
