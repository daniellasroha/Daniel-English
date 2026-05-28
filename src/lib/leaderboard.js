// src/lib/leaderboard.js
// Fungsi sinkronisasi skor ke Firestore & kalkulasi total poin

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

// ── Rumus Skor ────────────────────────────────────────────────────────────────
// Belajar terstruktur : 10 poin per pelajaran selesai
// Quiz harian         : ceil(score / total * 100) poin per sesi quiz
//
// Contoh:
//   25 pelajaran selesai → 250 poin
//   Quiz 8/10 benar      → 80 poin (satu sesi)
//   Total                → 330 poin

export function hitungTotalPoin({ completedLessons = [], quizHistory = [] }) {
  const belajarPoin = completedLessons.length * 10;
  const quizPoin = quizHistory.reduce((acc, q) => {
    return acc + Math.ceil((q.score / q.total) * 100);
  }, 0);
  return { belajarPoin, quizPoin, totalPoin: belajarPoin + quizPoin };
}

// ── Sync ke Firestore ─────────────────────────────────────────────────────────
// Dipanggil setiap kali lesson selesai atau quiz harian selesai
export async function syncLeaderboard({ username, level, completedLessons, quizHistory }) {
  if (!username || !username.trim()) return;
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) return; // belum dikonfigurasi

  try {
    const { belajarPoin, quizPoin, totalPoin } = hitungTotalPoin({
      completedLessons,
      quizHistory,
    });

    const docRef = doc(db, "leaderboard", username.trim().toLowerCase());
    await setDoc(
      docRef,
      {
        username: username.trim(),
        level: level || "pemula",
        belajarPoin,
        quizPoin,
        totalPoin,
        lessonsCompleted: completedLessons.length,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    // Jangan crash app jika Firestore error (mis. offline)
    console.warn("[Leaderboard] sync gagal:", err.message);
  }
}

// ── Ambil Leaderboard ─────────────────────────────────────────────────────────
// level: "pemula" | "menengah" | "semua"
export async function fetchLeaderboard(level = "semua", maxRows = 50) {
  try {
    const col = collection(db, "leaderboard");
    let q;

    if (level === "semua") {
      q = query(col, orderBy("totalPoin", "desc"), limit(maxRows));
    } else {
      // Firestore butuh composite index untuk where + orderBy
      // Kita filter di sisi klien agar tidak perlu setup index manual
      q = query(col, orderBy("totalPoin", "desc"), limit(200));
    }

    const snap = await getDocs(q);
    let rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (level !== "semua") {
      rows = rows.filter((r) => r.level === level);
    }

    return rows.slice(0, maxRows);
  } catch (err) {
    console.warn("[Leaderboard] fetch gagal:", err.message);
    return [];
  }
}
