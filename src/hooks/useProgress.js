"use client";

import { useState, useEffect, useCallback } from "react";
import { syncLeaderboard } from "@/lib/leaderboard";
import { pushProgress } from "@/lib/syncProgress";
import { catatAktivitas } from "@/lib/dailyGoal";

const KEY = "daniel_english_progress";

function loadData() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultData();
    return { ...defaultData(), ...JSON.parse(raw) };
  } catch {
    return defaultData();
  }
}

function defaultData() {
  return {
    sessions: [],       // ["2026-05-27", ...] tanggal unik ada aktivitas
    quiz: [],           // [{date, category, score, total}]
    vocabSeen: [],      // [id, ...] kartu vocab yang pernah dibuka
    grammarSeen: [],    // [id, ...] topik grammar yang pernah dibuka
    listeningPlayed: 0, // total play listening
  };
}

function today() {
  return new Date().toISOString().split("T")[0];
}

function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

// ---- Fungsi kalkulasi ----

export function hitungStreak(sessions) {
  if (!sessions.length) return 0;
  const sorted = [...new Set(sessions)].sort().reverse();
  const now = new Date();
  let streak = 0;
  for (let i = 0; i < sorted.length; i++) {
    const tgl = new Date(sorted[i]);
    const diff = Math.floor((now - tgl) / (1000 * 60 * 60 * 24));
    if (diff === i || (i === 0 && diff <= 1)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function hitungRataQuiz(quiz) {
  if (!quiz.length) return 0;
  const total = quiz.reduce((acc, q) => acc + Math.round((q.score / q.total) * 100), 0);
  return Math.round(total / quiz.length);
}

// ---- Hook utama ----

export function useProgress() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(loadData());
  }, []);

  const refresh = useCallback(() => setData(loadData()), []);

  // Catat sesi hari ini
  const recordSession = useCallback(() => {
    const d = loadData();
    const t = today();
    if (!d.sessions.includes(t)) {
      d.sessions = [...d.sessions, t];
      saveData(d);
      setData({ ...d });
    }
  }, []);

  // Catat hasil quiz + sync leaderboard + backup progress
  const recordQuiz = useCallback((category, score, total) => {
    const d = loadData();
    const t = today();
    d.quiz = [...d.quiz, { date: t, category, score, total }];
    if (!d.sessions.includes(t)) d.sessions = [...d.sessions, t];
    saveData(d);
    setData({ ...d });
    catatAktivitas(); // hitung ke target harian

    // Sync ke leaderboard + backup progress (fire-and-forget)
    try {
      const username = localStorage.getItem("daniel_english_username") || "";
      const level    = localStorage.getItem("daniel_english_level")    || "a1";
      const lessons  = JSON.parse(localStorage.getItem("daniel_english_belajar") || "[]");
      syncLeaderboard({ username, level, completedLessons: lessons, quizHistory: d.quiz });
      pushProgress(username);
    } catch {}
  }, []);

  // Catat vocab dilihat
  const recordVocab = useCallback((id) => {
    const d = loadData();
    const t = today();
    if (!d.vocabSeen.includes(id)) {
      d.vocabSeen = [...d.vocabSeen, id];
    }
    if (!d.sessions.includes(t)) d.sessions = [...d.sessions, t];
    saveData(d);
    setData({ ...d });
    try {
      pushProgress(localStorage.getItem("daniel_english_username") || "");
    } catch {}
  }, []);

  // Catat grammar dibuka
  const recordGrammar = useCallback((id) => {
    const d = loadData();
    const t = today();
    if (!d.grammarSeen.includes(id)) {
      d.grammarSeen = [...d.grammarSeen, id];
    }
    if (!d.sessions.includes(t)) d.sessions = [...d.sessions, t];
    saveData(d);
    setData({ ...d });
    try {
      pushProgress(localStorage.getItem("daniel_english_username") || "");
    } catch {}
  }, []);

  // Catat listening diputar
  const recordListening = useCallback(() => {
    const d = loadData();
    const t = today();
    d.listeningPlayed = (d.listeningPlayed || 0) + 1;
    if (!d.sessions.includes(t)) d.sessions = [...d.sessions, t];
    saveData(d);
    setData({ ...d });
    try {
      pushProgress(localStorage.getItem("daniel_english_username") || "");
    } catch {}
  }, []);

  return {
    data,
    refresh,
    recordSession,
    recordQuiz,
    recordVocab,
    recordGrammar,
    recordListening,
  };
}
