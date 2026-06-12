"use client";

import { useState, useEffect, useCallback } from "react";
// Pakai indeks ringan (bukan data penuh ~500 KB) — hook ini dipakai banyak halaman
import { learningPathIndex as unitBelajar } from "@/data/learningPathIndex";
import { syncLeaderboard } from "@/lib/leaderboard";
import { pushProgress } from "@/lib/syncProgress";
import { catatAktivitas } from "@/lib/dailyGoal";

const KEY = "daniel_english_belajar";
const KEY_BINTANG = "daniel_english_bintang";

export function useLearning() {
  const [completedLessons, setCompletedLessons] = useState([]);
  const [bintangMap, setBintangMap] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        setCompletedLessons(JSON.parse(saved));
      }
      const savedBintang = localStorage.getItem(KEY_BINTANG);
      if (savedBintang) {
        setBintangMap(JSON.parse(savedBintang));
      }
    } catch {
      setCompletedLessons([]);
    }
    setLoaded(true);
  }, []);

  // bintang (1-3, opsional) = hasil kuis pelajaran ini; simpan yang TERBAIK
  const completeLesson = useCallback((lessonId, bintang = 0) => {
    // Simpan bintang terbaik — bisa naik saat pelajaran diulang
    if (bintang > 0) {
      setBintangMap((prev) => {
        if ((prev[lessonId] || 0) >= bintang) return prev;
        const next = { ...prev, [lessonId]: bintang };
        try { localStorage.setItem(KEY_BINTANG, JSON.stringify(next)); } catch {}
        return next;
      });
    }

    catatAktivitas(); // hitung ke target harian (termasuk saat mengulang)

    setCompletedLessons((prev) => {
      if (prev.includes(lessonId)) return prev;
      const next = [...prev, lessonId];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}

      // Sync ke leaderboard + backup progress (fire-and-forget)
      try {
        const username = localStorage.getItem("daniel_english_username") || "";
        const level    = localStorage.getItem("daniel_english_level")    || "a1";
        const quizRaw  = localStorage.getItem("daniel_english_progress");
        const quizHistory = quizRaw ? (JSON.parse(quizRaw).quiz || []) : [];
        syncLeaderboard({ username, level, completedLessons: next, quizHistory });
        pushProgress(username);
      } catch {}

      return next;
    });
  }, []);

  const getBintang = useCallback(
    (lessonId) => bintangMap[lessonId] || 0,
    [bintangMap]
  );

  const isLessonDone = useCallback(
    (lessonId) => completedLessons.includes(lessonId),
    [completedLessons]
  );

  // Lesson unlocked if: it's the very first lesson, OR the previous lesson is done
  const isLessonUnlocked = useCallback(
    (unitId, lessonIndex) => {
      const unit = unitBelajar.find((u) => u.id === unitId);
      if (!unit) return false;

      // First lesson of first unit: always unlocked
      if (unitId === unitBelajar[0].id && lessonIndex === 0) return true;

      // First lesson of a unit (not the very first): previous unit's last lesson must be done
      if (lessonIndex === 0) {
        const prevUnitIdx = unitBelajar.findIndex((u) => u.id === unitId) - 1;
        if (prevUnitIdx < 0) return true;
        const prevUnit = unitBelajar[prevUnitIdx];
        const lastLesson = prevUnit.pelajaran[prevUnit.pelajaran.length - 1];
        return completedLessons.includes(lastLesson.id);
      }

      // Any other lesson: previous lesson in same unit must be done
      const prevLesson = unit.pelajaran[lessonIndex - 1];
      return completedLessons.includes(prevLesson.id);
    },
    [completedLessons]
  );

  const getUnitProgress = useCallback(
    (unitId) => {
      const unit = unitBelajar.find((u) => u.id === unitId);
      if (!unit) return { done: 0, total: 0 };
      const done = unit.pelajaran.filter((p) =>
        completedLessons.includes(p.id)
      ).length;
      return { done, total: unit.pelajaran.length };
    },
    [completedLessons]
  );

  const getTotalProgress = useCallback(() => {
    const total = unitBelajar.reduce((acc, u) => acc + u.pelajaran.length, 0);
    const done = completedLessons.length;
    return { done, total };
  }, [completedLessons]);

  return {
    completedLessons,
    completeLesson,
    isLessonDone,
    isLessonUnlocked,
    getUnitProgress,
    getTotalProgress,
    getBintang,
    loaded,
  };
}
