"use client";
// src/hooks/useSRS.js
// Spaced Repetition System — jadwalkan kapan sebuah kartu perlu direview
//
// Cara kerja:
//   1. Kartu didaftarkan saat pertama kali dilihat (di belajar / vocabulary)
//   2. nextReview diset 1 hari ke depan
//   3. Di halaman Review, user klik Ingat → interval naik, Lupa → reset
//
// Level → interval review:
//   0 → 1 hari   (baru dilihat)
//   1 → 3 hari   (benar sekali)
//   2 → 7 hari
//   3 → 14 hari
//   4 → 30 hari  (hampir dikuasai)

import { useState, useEffect, useCallback } from "react";

const KEY       = "daniel_english_srs";
const INTERVALS = [1, 3, 7, 14, 30]; // hari per level

function loadData() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

function saveData(d) {
  localStorage.setItem(KEY, JSON.stringify(d));
}

function nextReviewTimestamp(level) {
  const days = INTERVALS[Math.min(level, INTERVALS.length - 1)];
  return Date.now() + days * 24 * 60 * 60 * 1000;
}

export function useSRS() {
  const [data, setData] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setData(loadData());
    setLoaded(true);
  }, []);

  // Daftarkan kartu baru (dipanggil saat kartu pertama kali dibuka/dilihat)
  // cardInfo: { english, indonesian, emoji, contoh, type }
  const registerCard = useCallback((id, cardInfo) => {
    setData((prev) => {
      if (prev[id]) return prev; // sudah terdaftar, skip
      const updated = {
        ...prev,
        [id]: {
          ...cardInfo,
          id,
          level      : 0,
          nextReview : nextReviewTimestamp(0),
          totalReviews: 0,
          lastResult : null,
          firstSeen  : Date.now(),
        },
      };
      saveData(updated);
      return updated;
    });
  }, []);

  // Tandai hasil review — correct: true = ingat, false = lupa
  const markReview = useCallback((id, correct) => {
    setData((prev) => {
      const card = prev[id];
      if (!card) return prev;

      const newLevel = correct
        ? Math.min(card.level + 1, INTERVALS.length - 1)
        : Math.max(card.level - 1, 0);

      const updated = {
        ...prev,
        [id]: {
          ...card,
          level        : newLevel,
          nextReview   : nextReviewTimestamp(newLevel),
          totalReviews : card.totalReviews + 1,
          lastResult   : correct ? "correct" : "wrong",
          lastReviewed : Date.now(),
        },
      };
      saveData(updated);
      return updated;
    });
  }, []);

  // Kartu yang sudah jatuh tempo (nextReview <= sekarang)
  const getDueCards = useCallback(() => {
    const now = Date.now();
    return Object.values(data).filter((c) => c.nextReview <= now);
  }, [data]);

  // Status satu kartu
  const getCardState = useCallback((id) => data[id] || null, [data]);

  // Statistik ringkas
  const totalCards    = Object.keys(data).length;
  const dueCount      = loaded ? Object.values(data).filter((c) => c.nextReview <= Date.now()).length : 0;
  const masteredCount = Object.values(data).filter((c) => c.level >= 4).length;

  return {
    loaded,
    registerCard,
    markReview,
    getDueCards,
    getCardState,
    totalCards,
    dueCount,
    masteredCount,
  };
}
