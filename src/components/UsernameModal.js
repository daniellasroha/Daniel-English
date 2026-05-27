"use client";

import { useState } from "react";

export default function UsernameModal({ onSave }) {
  const [input, setInput] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (input.trim()) onSave(input.trim());
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center">
        <div className="text-5xl mb-4">👋</div>
        <h2 className="text-2xl font-extrabold text-indigo-700 mb-2">Halo! Siapa namamu?</h2>
        <p className="text-gray-400 text-sm mb-6">
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
            className="w-full px-4 py-3 rounded-xl border-2 border-indigo-200 focus:outline-none focus:border-indigo-500 text-gray-700 text-center text-lg font-semibold"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Mulai Belajar 🚀
          </button>
        </form>
      </div>
    </div>
  );
}
