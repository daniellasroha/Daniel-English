"use client";

import { useState, useEffect, useCallback } from "react";

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

  // Catat hasil quiz
  const recordQuiz = useCallback((category, score, total) => {
    const d = loadData();
    const t = today();
    d.quiz = [...d.quiz, { date: t, category, score, total }];
    if (!d.sessions.includes(t)) d.sessions = [...d.sessions, t];
    saveData(d);
    setData({ ...d });
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
  }, []);

  // Catat listening diputar
  const recordListening = useCallback(() => {
    const d = loadData();
    const t = today();
    d.listeningPlayed = (d.listeningPlayed || 0) + 1;
    if (!d.sessions.includes(t)) d.sessions = [...d.sessions, t];
    saveData(d);
    setData({ ...d });
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
