// src/lib/leaderboard.js
// Sinkronisasi skor ke Firestore & kalkulasi total poin

import { db } from "./firebase";
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";

// ── Helpers waktu ─────────────────────────────────────────────────────────────

function today() {
  return new Date().toISOString().split("T")[0];
}

// Format: "2026-W22" — konsisten lintas timezone
function getWeekKey() {
  const d = new Date();
  const year = d.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const dayOfYear = Math.floor((d - startOfYear) / 86400000) + 1;
  const weekNum = Math.ceil((dayOfYear + startOfYear.getDay()) / 7);
  return `${year}-W${String(weekNum).padStart(2, "0")}`;
}

// ── Snapshot harian/mingguan (localStorage) ───────────────────────────────────
// Menyimpan baseline poin di awal hari/minggu untuk menghitung delta

const SNAPSHOT_KEY = "daniel_english_lb_snapshot";

function getOrUpdateSnapshot(totalPoin) {
  const todayStr  = today();
  const weekStr   = getWeekKey();

  let snap = {};
  try { snap = JSON.parse(localStorage.getItem(SNAPSHOT_KEY)) || {}; } catch {}

  // Hari baru → reset baseline harian
  if (snap.dailyDate !== todayStr) {
    snap.dailyDate = todayStr;
    snap.dailyBase = totalPoin; // poin awal hari ini
  }

  // Minggu baru → reset baseline mingguan
  if (snap.weekKey !== weekStr) {
    snap.weekKey   = weekStr;
    snap.weeklyBase = totalPoin; // poin awal minggu ini
  }

  try { localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snap)); } catch {}

  return {
    dailyDate  : snap.dailyDate,
    dailyPoin  : Math.max(0, totalPoin - (snap.dailyBase  ?? totalPoin)),
    weekKey    : snap.weekKey,
    weeklyPoin : Math.max(0, totalPoin - (snap.weeklyBase ?? totalPoin)),
  };
}

// ── Rumus Skor ─────────────────────────────────────────────────────────────────
export function hitungTotalPoin({ completedLessons = [], quizHistory = [] }) {
  const belajarPoin = completedLessons.length * 10;
  const quizPoin = quizHistory.reduce((acc, q) => {
    return acc + Math.ceil((q.score / q.total) * 100);
  }, 0);
  return { belajarPoin, quizPoin, totalPoin: belajarPoin + quizPoin };
}

// ── Sync ke Firestore ─────────────────────────────────────────────────────────
export async function syncLeaderboard({ username, level, completedLessons, quizHistory }) {
  if (!username || !username.trim()) return;
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) return;

  try {
    const { belajarPoin, quizPoin, totalPoin } = hitungTotalPoin({
      completedLessons,
      quizHistory,
    });

    // Hitung poin harian & mingguan dari snapshot localStorage
    const { dailyDate, dailyPoin, weekKey, weeklyPoin } =
      getOrUpdateSnapshot(totalPoin);

    const docRef = doc(db, "leaderboard", username.trim().toLowerCase());
    await setDoc(
      docRef,
      {
        username      : username.trim(),
        level         : level || "a1",
        belajarPoin,
        quizPoin,
        totalPoin,
        lessonsCompleted: completedLessons.length,
        // Tracking harian
        dailyDate,
        dailyPoin,
        // Tracking mingguan
        weekKey,
        weeklyPoin,
        updatedAt     : serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn("[Leaderboard] sync gagal:", err.message);
  }
}

// ── Ambil Leaderboard ─────────────────────────────────────────────────────────
// period: "semua" | "harian" | "mingguan"
// level:  "semua" | "a1" | "a2" | "b1"
export async function fetchLeaderboard(level = "semua", maxRows = 50, period = "semua") {
  try {
    const col = collection(db, "leaderboard");
    // Selalu order by totalPoin di Firestore (menghindari kebutuhan composite index)
    const q   = query(col, orderBy("totalPoin", "desc"), limit(200));

    const snap = await getDocs(q);
    let rows   = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Filter & urutkan ulang berdasarkan periode
    if (period === "harian") {
      const todayStr = today();
      rows = rows
        .filter((r) => r.dailyDate === todayStr && (r.dailyPoin ?? 0) > 0)
        .sort((a, b) => (b.dailyPoin ?? 0) - (a.dailyPoin ?? 0));
    } else if (period === "mingguan") {
      const weekStr = getWeekKey();
      rows = rows
        .filter((r) => r.weekKey === weekStr && (r.weeklyPoin ?? 0) > 0)
        .sort((a, b) => (b.weeklyPoin ?? 0) - (a.weeklyPoin ?? 0));
    }

    // Filter level (client-side, menghindari composite index Firestore)
    if (level !== "semua") {
      rows = rows.filter((r) => r.level === level);
    }

    return rows.slice(0, maxRows);
  } catch (err) {
    console.warn("[Leaderboard] fetch gagal:", err.message);
    return [];
  }
}
