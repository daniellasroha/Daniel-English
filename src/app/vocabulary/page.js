// Halaman Vocabulary — 64 kosakata dengan 8 kategori
"use client";

import { useState } from "react";
import Link from "next/link";
import { kosakata, kategoriList } from "@/data/vocabulary";
import { useProgress } from "@/hooks/useProgress";

export default function VocabularyPage() {
  const [kartuTerbuka, setKartuTerbuka] = useState({});
  const [cari, setCari] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState("Semua");
  const { recordVocab } = useProgress();

  function toggleKartu(id) {
    setKartuTerbuka((prev) => ({ ...prev, [id]: !prev[id] }));
    if (!kartuTerbuka[id]) recordVocab(id);
  }

  // Filter berdasarkan pencarian dan kategori
  const hasilFilter = kosakata.filter((kata) => {
    const cocokCari =
      kata.english.toLowerCase().includes(cari.toLowerCase()) ||
      kata.indonesian.toLowerCase().includes(cari.toLowerCase());
    const cocokKategori =
      kategoriAktif === "Semua" || kata.kategori === kategoriAktif;
    return cocokCari && cocokKategori;
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-indigo-500 hover:text-indigo-700 text-2xl">←</Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-indigo-700">📚 Vocabulary</h1>
            <p className="text-xs text-gray-400">{kosakata.length} kata dalam 8 kategori — klik kartu untuk lihat arti</p>
          </div>
          <span className="bg-indigo-100 text-indigo-700 text-sm font-semibold px-3 py-1 rounded-full">
            {hasilFilter.length} kata
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Pencarian */}
        <input
          type="text"
          placeholder="🔍 Cari kata (Inggris atau Indonesia)..."
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-blue-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700 mb-4"
        />

        {/* Filter kategori */}
        <div className="flex gap-2 flex-wrap mb-6">
          {["Semua", ...kategoriList].map((kat) => (
            <button
              key={kat}
              onClick={() => setKategoriAktif(kat)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${
                kategoriAktif === kat
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              {kat}
            </button>
          ))}
        </div>

        {/* Grid kartu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {hasilFilter.map((kata) => (
            <div
              key={kata.id}
              onClick={() => toggleKartu(kata.id)}
              className="bg-white rounded-2xl shadow-sm p-4 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200 border border-blue-100"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{kata.emoji}</span>
                <span className="text-xs bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full">{kata.kategori}</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">{kata.english}</h2>
              {kartuTerbuka[kata.id] ? (
                <div className="mt-2">
                  <p className="text-indigo-600 font-semibold">{kata.indonesian}</p>
                  <p className="text-gray-400 text-xs mt-1 italic">{kata.contoh}</p>
                </div>
              ) : (
                <p className="text-gray-300 text-xs mt-1">Klik untuk lihat arti →</p>
              )}
            </div>
          ))}
        </div>

        {hasilFilter.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-3">🔍</p>
            <p>Kata tidak ditemukan. Coba kata lain!</p>
          </div>
        )}
      </div>
    </main>
  );
}
