"use client";

import { useState, useEffect } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  // Baca preferensi saat pertama load
  useEffect(() => {
    const saved = localStorage.getItem("daniel_english_dark");
    const isDark = saved === "true";
    setDark(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("daniel_english_dark", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("daniel_english_dark", "false");
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      aria-pressed={dark}
      title={dark ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
      className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 transition text-xl"
      style={{ flexShrink: 0 }}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
