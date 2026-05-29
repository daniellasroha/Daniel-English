"use client";

import { useState, useEffect } from "react";
import { pullProgress } from "@/lib/syncProgress";

export function useUsername() {
  const [username, setUsername] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("daniel_english_username");
    if (saved) setUsername(saved);
    setLoaded(true);
  }, []);

  function saveUsername(name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    localStorage.setItem("daniel_english_username", trimmed);
    setUsername(trimmed);

    // Jika device baru (localStorage kosong), coba restore dari Firebase
    const sudahAdaData =
      !!localStorage.getItem("daniel_english_belajar") ||
      !!localStorage.getItem("daniel_english_progress");

    if (!sudahAdaData) {
      pullProgress(trimmed).then((remote) => {
        if (!remote) return;
        const adaLessons = remote.completedLessons?.length > 0;
        const adaSessions = remote.sessions?.length > 0;
        if (!adaLessons && !adaSessions) return;

        // Restore data ke localStorage
        if (remote.completedLessons) {
          localStorage.setItem(
            "daniel_english_belajar",
            JSON.stringify(remote.completedLessons)
          );
        }
        const { username: _u, updatedAt: _t, completedLessons: _c, ...prog } = remote;
        localStorage.setItem("daniel_english_progress", JSON.stringify(prog));

        // Reload agar semua hook re-initialize dari localStorage yang sudah terisi
        window.location.reload();
      });
    }
  }

  function clearUsername() {
    localStorage.removeItem("daniel_english_username");
    setUsername("");
  }

  return { username, saveUsername, clearUsername, loaded };
}
