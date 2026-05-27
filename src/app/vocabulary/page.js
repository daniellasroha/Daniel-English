// Halaman Vocabulary — pilih kategori dulu, lalu lihat kata per kategori
"use client";

import { useState } from "react";
import Link from "next/link";
import { kosakata } from "@/data/vocabulary";
import { useProgress } from "@/hooks/useProgress";
import { useFavorites } from "@/hooks/useFavorites";
import { useLevel } from "@/hooks/useLevel";

// Metadata visual per kategori
const kategoriMeta = {
  "Buah & Sayur": { emoji: "🍎", warna: "from-green-400 to-emerald-600",   bg: "bg-green-50",   border: "border-green-200",   teks: "text-green-700" },
  "Hewan":         { emoji: "🐾", warna: "from-orange-400 to-amber-500",    bg: "bg-orange-50",  border: "border-orange-200",  teks: "text-orange-700" },
  "Tempat":        { emoji: "🏙️", warna: "from-blue-400 to-blue-600",       bg: "bg-blue-50",    border: "border-blue-200",    teks: "text-blue-700" },
  "Kata Kerja":    { emoji: "🏃", warna: "from-purple-400 to-purple-600",   bg: "bg-purple-50",  border: "border-purple-200",  teks: "text-purple-700" },
  "Kata Sifat":    { emoji: "✨", warna: "from-pink-400 to-rose-500",        bg: "bg-pink-50",    border: "border-pink-200",    teks: "text-pink-700" },
  "Perasaan":      { emoji: "❤️", warna: "from-red-400 to-red-600",          bg: "bg-red-50",     border: "border-red-200",     teks: "text-red-700" },
  "Rumah & Benda": { emoji: "🏠", warna: "from-teal-400 to-cyan-600",       bg: "bg-teal-50",    border: "border-teal-200",    teks: "text-teal-700" },
  "Alam & Cuaca":  { emoji: "🌿", warna: "from-emerald-400 to-green-600",   bg: "bg-emerald-50", border: "border-emerald-200", teks: "text-emerald-700" },
};

export default function VocabularyPage() {
  const [kategoriDipilih, setKategoriDipilih] = useState(null);
  const [kartuTerbuka, setKartuTerbuka] = useState({});

  const { recordVocab } = useProgress();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { config } = useLevel();

  // Filter kata berdasarkan level
  const kosakataTersedia = config
    ? (config.vocabLevel === "pemula"
        ? kosakata.filter((k) => k.level === "pemula")
        : kosakata)
    : kosakata;

  // Daftar kategori yang ada (urutan tetap)
  const urutanKategori = [
    "Buah & Sayur", "Hewan", "Tempat", "Kata Kerja",
    "Kata Sifat", "Perasaan", "Rumah & Benda", "Alam & Cuaca",
  ];

  // Hitung jumlah kata per kategori (sesuai level)
  const jumlahPerKategori = {};
  urutanKategori.forEach((kat) => {
    jumlahPerKategori[kat] = kosakataTersedia.filter((k) => k.kategori === kat).length;
  });

  // Kata yang ditampilkan sesuai kategori dipilih
  const kataKategoriIni = kategoriDipilih
    ? kosakataTersedia.filter((k) => k.kategori === kategoriDipilih)
    : [];

  function toggleKartu(id) {
    setKartuTerbuka((prev) => ({ ...prev, [id]: !prev[id] }));
    if (!kartuTerbuka[id]) recordVocab(id);
  }

  const meta = kategoriDipilih ? kategoriMeta[kategoriDipilih] : null;

  // ─── TAMPILAN KATA (setelah pilih kategori) ───────────────────────────────
  if (kategoriDipilih) {
    const sudahTerbuka = kataKategoriIni.filter((k) => kartuTerbuka[k.id]).length;

    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
            <button
              onClick={() => setKategoriDipilih(null)}
              className="text-indigo-500 hover:text-indigo-700 text-2xl"
            >
              ←
            </button>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.warna} flex items-center justify-center text-xl shadow`}>
              {meta.emoji}
            </div>
            <div className="flex-1">
              <h1 className={`text-xl font-bold ${meta.teks}`}>{kategoriDipilih}</h1>
              <p className="text-xs text-gray-400">
                {kataKategoriIni.length} kata
                {config && <span className={`ml-1 font-semibold ${config.teks}`}>· {config.emoji} {config.label}</span>}
              </p>
            </div>
            {/* Progress bar kategori ini */}
            <div className="text-right">
              <p className="text-xs text-gray-400">{sudahTerbuka}/{kataKategoriIni.length} dibuka</p>
              <div className="w-20 h-1.5 bg-gray-200 rounded-full mt-1">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${meta.warna} transition-all`}
                  style={{ width: `${kataKategoriIni.length ? (sudahTerbuka / kataKategoriIni.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kataKategoriIni.map((kata) => (
              <div
                key={kata.id}
                className={`rounded-2xl shadow-sm border ${meta.border} ${meta.bg} relative hover:shadow-md hover:-translate-y-1 transition-all duration-200`}
              >
                {/* Tombol favorit */}
                <button
                  onClick={() => toggleFavorite(kata.id)}
                  className={`absolute top-3 right-3 text-lg transition-transform hover:scale-125 ${
                    isFavorite(kata.id) ? "opacity-100" : "opacity-30 hover:opacity-70"
                  }`}
                >
                  ⭐
                </button>

                {/* Kartu — klik untuk flip */}
                <div onClick={() => toggleKartu(kata.id)} className="cursor-pointer p-4">
                  <div className="flex items-center gap-3 mb-3 pr-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meta.warna} flex items-center justify-center text-2xl shadow flex-shrink-0`}>
                      {kata.emoji}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">{kata.english}</h2>
                      {!kartuTerbuka[kata.id] && (
                        <p className="text-gray-400 text-xs">Klik untuk lihat arti →</p>
                      )}
                    </div>
                  </div>

                  {kartuTerbuka[kata.id] ? (
                    <div className={`rounded-xl p-3 bg-white bg-opacity-70 border ${meta.border}`}>
                      <p className={`font-bold text-base ${meta.teks}`}>{kata.indonesian}</p>
                      <p className="text-gray-400 text-xs mt-1 italic">"{kata.contoh}"</p>
                    </div>
                  ) : (
                    <div className="h-12 rounded-xl bg-white bg-opacity-40 border border-dashed border-gray-300 flex items-center justify-center">
                      <span className="text-gray-300 text-sm">• • •</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ─── TAMPILAN PILIH KATEGORI ──────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-indigo-500 hover:text-indigo-700 text-2xl">←</Link>
          <div>
            <h1 className="text-xl font-bold text-indigo-700">📚 Vocabulary</h1>
            <p className="text-xs text-gray-400">
              {kosakataTersedia.length} kata · {urutanKategori.filter(k => jumlahPerKategori[k] > 0).length} kategori
              {config && <span className={`ml-1 font-semibold ${config.teks}`}>· {config.emoji} {config.label}</span>}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Pilih Kategori</h2>
          <p className="text-gray-500 text-sm">Klik salah satu kategori untuk mulai belajar kosakata 👇</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {urutanKategori.map((kat) => {
            const m = kategoriMeta[kat];
            const jumlah = jumlahPerKategori[kat];
            if (jumlah === 0) return null;
            return (
              <button
                key={kat}
                onClick={() => { setKategoriDipilih(kat); setKartuTerbuka({}); }}
                className={`rounded-2xl border-2 ${m.border} ${m.bg} p-5 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${m.warna} flex items-center justify-center text-4xl shadow-md mx-auto mb-3`}>
                  {m.emoji}
                </div>
                <h3 className={`font-bold text-sm ${m.teks} leading-tight`}>{kat}</h3>
                <p className="text-gray-400 text-xs mt-1">{jumlah} kata</p>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
