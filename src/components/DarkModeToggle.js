"use client";

import { useState, useEffect } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("daniel_english_dark");
    if (saved === "true") {
      document.documentElement.classList.add("dark");
      setDark(true);
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
      title={dark ? "Mode Terang" : "Mode Gelap"}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-xl"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
