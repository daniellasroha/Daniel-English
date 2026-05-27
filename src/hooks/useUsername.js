"use client";

import { useState, useEffect } from "react";

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
  }

  function clearUsername() {
    localStorage.removeItem("daniel_english_username");
    setUsername("");
  }

  return { username, saveUsername, clearUsername, loaded };
}
