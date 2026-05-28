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
    deskripsi: "Kosakata paling dasar, grammar inti, dan quiz pilihan ganda",
    vocabLevel: "pemula",          // hanya kata dengan level: "pemula" (40 kata)
    grammarTopics: [1, 3, 9, 10],  // Simple Present + To Be + Salam & Perkenalan + Kata Ganti Orang
    quizRoutes: ["/quiz/vocabulary", "/quiz/grammar", "/quiz/translation", "/quiz/typing"],
  },
  menengah: {
    label: "Menengah",
    emoji: "🚀",
    warna: "bg-indigo-500",
    warnaLight: "bg-indigo-50",
    border: "border-indigo-300",
    teks: "text-indigo-700",
    deskripsi: "Semua kosakata, semua topik grammar, dan semua jenis quiz",
    vocabLevel: "semua",           // semua 112 kata
    grammarTopics: [1, 2, 3, 4, 5, 6, 7, 8], // semua 8 topik
    quizRoutes: ["/quiz/vocabulary", "/quiz/grammar", "/quiz/translation", "/quiz/mixed", "/quiz/spelling", "/quiz/typing"],
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
