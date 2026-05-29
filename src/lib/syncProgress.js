// src/lib/syncProgress.js
// Sinkronisasi semua data progress (belajar + quiz + vocab dll) ke Firestore
// Tujuan: data tidak hilang kalau ganti device atau clear browser

import { db } from "./firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const COLLECTION = "user_progress";

function isFirebaseConfigured() {
  return !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
}

// Push semua data progress dari localStorage ke Firestore (fire-and-forget)
export async function pushProgress(username) {
  if (!username?.trim() || !isFirebaseConfigured()) return;
  try {
    const completedLessons = JSON.parse(
      localStorage.getItem("daniel_english_belajar") || "[]"
    );
    const progress = JSON.parse(
      localStorage.getItem("daniel_english_progress") || "{}"
    );
    const docRef = doc(db, COLLECTION, username.trim().toLowerCase());
    await setDoc(
      docRef,
      {
        username: username.trim(),
        completedLessons,
        sessions: progress.sessions || [],
        quiz: progress.quiz || [],
        vocabSeen: progress.vocabSeen || [],
        grammarSeen: progress.grammarSeen || [],
        listeningPlayed: progress.listeningPlayed || 0,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn("[Progress] push gagal:", err.message);
  }
}

// Pull progress dari Firestore — dipakai untuk restore ke device baru
export async function pullProgress(username) {
  if (!username?.trim() || !isFirebaseConfigured()) return null;
  try {
    const snap = await getDoc(
      doc(db, COLLECTION, username.trim().toLowerCase())
    );
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.warn("[Progress] pull gagal:", err.message);
    return null;
  }
}
