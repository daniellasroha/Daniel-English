"use client";

import { useState } from "react";

export default function UsernameModal({ onSave }) {
  const [input, setInput] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (input.trim()) onSave(input.trim());
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(28,26,23,0.5)" }}>
      <div
        className="rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center"
        style={{ backgroundColor: "var(--bg-paper)", border: "1px solid var(--border)" }}
      >
        <div className="text-5xl mb-4">👋</div>
        <h2 className="font-serif text-2xl font-semibold mb-2" style={{ color: "var(--brand)" }}>
          Halo! Siapa namamu?
        </h2>
        <p className="font-sans text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          Masukkan namamu supaya aplikasi bisa menyapamu secara personal.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nama kamu..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            maxLength={30}
            className="w-full px-4 py-3 rounded-xl font-sans focus:outline-none text-center text-lg font-semibold"
            style={{
              border: "2px solid var(--border)",
              backgroundColor: "var(--bg-paper)",
              color: "var(--text-primary)",
            }}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="btn-primary w-full py-3 rounded-xl font-bold justify-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Mulai Belajar 🚀
          </button>
        </form>
      </div>
    </div>
  );
}
