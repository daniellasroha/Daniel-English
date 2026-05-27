"use client";

import { useState, useEffect, useCallback } from "react";
import { learningPath as unitBelajar } from "@/data/learningPath";

const KEY = "daniel_english_belajar";

export function useLearning() {
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        setCompletedLessons(JSON.parse(saved));
      }
    } catch {
      setCompletedLessons([]);
    }
    setLoaded(true);
  }, []);

  const completeLesson = useCallback((lessonId) => {
    setCompletedLessons((prev) => {
      if (prev.includes(lessonId)) return prev;
      const next = [...prev, lessonId];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

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
    loaded,
  };
}
