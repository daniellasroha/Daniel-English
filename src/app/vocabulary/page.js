// Halaman Vocabulary — pilih kategori dulu, lalu lihat kata per kategori
"use client";

import { useState } from "react";
import Link from "next/link";
import { kosakata } from "@/data/vocabulary";
import { useProgress } from "@/hooks/useProgress";
import { useFavorites } from "@/hooks/useFavorites";
import { useLevel } from "@/hooks/useLevel";
import { useSRS } from "@/hooks/useSRS";
import { speak } from "@/lib/speech";

const kategoriMeta = {
  "Buah & Sayur":       { emoji: "🍎", accent: "#059669", iconBg: "#D1FAE5" },
  "Hewan":              { emoji: "🐾", accent: "#D97706", iconBg: "#FEF3C7" },
  "Tempat":             { emoji: "🏙️", accent: "#1D4ED8", iconBg: "#DBEAFE" },
  "Kata Kerja":         { emoji: "🏃", accent: "#7C3AED", iconBg: "#EDE9FE" },
  "Kata Sifat":         { emoji: "✨", accent: "#BE185D", iconBg: "#FCE7F3" },
  "Perasaan":           { emoji: "❤️", accent: "#DC2626", iconBg: "#FEE2E2" },
  "Rumah & Benda":      { emoji: "🏠", accent: "#0D9488", iconBg: "#CCFBF1" },
  "Alam & Cuaca":       { emoji: "🌿", accent: "#047857", iconBg: "#D1FAE5" },
  "Warna":              { emoji: "🎨", accent: "#C9933A", iconBg: "#FDF3E3" },
  "Keluarga":           { emoji: "👪", accent: "#BE185D", iconBg: "#FCE7F3" },
  "Makanan & Minuman":  { emoji: "🍽️", accent: "#D97706", iconBg: "#FEF3C7" },
  "Tubuh & Kesehatan":  { emoji: "🫀", accent: "#DC2626", iconBg: "#FEE2E2" },
  "Pekerjaan & Studi":  { emoji: "💼", accent: "#1D4ED8", iconBg: "#DBEAFE" },
  "Perjalanan & Dunia": { emoji: "🌏", accent: "#0369A1", iconBg: "#E0F2FE" },
};

export default function VocabularyPage() {
  const [kategoriDipilih, setKategoriDipilih] = useState(null);
  const [kartuTerbuka, setKartuTerbuka] = useState({});

  const { recordVocab } = useProgress();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { config } = useLevel();
  const { registerCard } = useSRS();

  // Filter kata sesuai level CEFR: A1 → hanya a1, A2 → a1+a2, B1 → semua
  const kosakataTersedia = config
    ? config.vocabLevel === "a1"
      ? kosakata.filter((k) => k.level === "a1")
      : config.vocabLevel === "a2"
      ? kosakata.filter((k) => k.level === "a1" || k.level === "a2")
      : kosakata
    : kosakata;

  const urutanKategori = [
    "Warna", "Keluarga", "Buah & Sayur", "Makanan & Minuman",
    "Hewan", "Tubuh & Kesehatan", "Tempat", "Kata Kerja",
    "Kata Sifat", "Perasaan", "Rumah & Benda", "Alam & Cuaca",
    "Pekerjaan & Studi", "Perjalanan & Dunia",
  ];

  const jumlahPerKategori = {};
  urutanKategori.forEach((kat) => {
    jumlahPerKategori[kat] = kosakataTersedia.filter((k) => k.kategori === kat).length;
  });

  const kataKategoriIni = kategoriDipilih
    ? kosakataTersedia.filter((k) => k.kategori === kategoriDipilih)
    : [];

  function toggleKartu(kata) {
    const id = kata.id;
    setKartuTerbuka((prev) => ({ ...prev, [id]: !prev[id] }));
    if (!kartuTerbuka[id]) {
      recordVocab(id);
      registerCard(`vocab-${id}`, {
        type: "vocab", english: kata.english, indonesian: kata.indonesian,
        emoji: kata.emoji, contoh: kata.contoh,
      });
      speak(kata.english);
    }
  }

  const meta = kategoriDipilih ? kategoriMeta[kategoriDipilih] : null;

  // ─── TAMPILAN KATA ──────────────────────────────────────────────────────────
  if (kategoriDipilih) {
    const sudahTerbuka = kataKategoriIni.filter((k) => kartuTerbuka[k.id]).length;

    return (
      <main className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
        <header className="sticky top-0 z-10" style={{ backgroundColor: "var(--bg-paper)", borderBottom: "1px solid var(--border)" }}>
          <div className="max-w-5xl mx-auto px-5 py-4 flex items-center gap-4">
            <button
              onClick={() => setKategoriDipilih(null)}
              className="text-2xl transition-opacity hover:opacity-70"
              style={{ color: "var(--brand)" }}
            >
              ←
            </button>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ backgroundColor: meta.iconBg, border: "1px solid var(--border)" }}
            >
              {meta.emoji}
            </div>
            <div className="flex-1">
              <h1 className="font-serif text-xl font-semibold" style={{ color: meta.accent }}>
                {kategoriDipilih}
              </h1>
              <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
                {kataKategoriIni.length} kata
                {config && (
                  <span className="ml-1 font-semibold" style={{ color: "var(--brand)" }}>
                    · {config.emoji} {config.label}
                  </span>
                )}
              </p>
            </div>
            {/* Progress bar */}
            <div className="text-right flex-shrink-0">
              <p className="font-sans text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                {sudahTerbuka}/{kataKategoriIni.length}
              </p>
              <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${kataKategoriIni.length ? (sudahTerbuka / kataKategoriIni.length) * 100 : 0}%`,
                    backgroundColor: meta.accent,
                  }}
                />
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-5 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kataKategoriIni.map((kata) => (
              <div key={kata.id} className="card-de relative overflow-hidden">
                {/* Strip aksen */}
                <div className="absolute inset-y-0 left-0 w-[3px]" style={{ backgroundColor: meta.accent }} />

                {/* Tombol favorit */}
                <button
                  onClick={() => toggleFavorite(kata.id)}
                  className={`absolute top-3 right-3 text-lg transition-transform hover:scale-125 ${
                    isFavorite(kata.id) ? "opacity-100" : "opacity-25 hover:opacity-60"
                  }`}
                >
                  ⭐
                </button>

                {/* Kartu — klik untuk flip */}
                <div onClick={() => toggleKartu(kata)} className="cursor-pointer pl-6 pr-5 py-4">
                  <div className="flex items-center gap-3 mb-3 pr-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: meta.iconBg, border: "1px solid var(--border)" }}
                    >
                      {kata.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="font-serif text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                          {kata.english}
                        </h2>
                        <button
                          onClick={(e) => { e.stopPropagation(); speak(kata.english); }}
                          className="text-base opacity-40 hover:opacity-90 transition-opacity flex-shrink-0"
                          title="Dengarkan pengucapan"
                        >
                          🔊
                        </button>
                      </div>
                      {!kartuTerbuka[kata.id] && (
                        <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
                          Klik untuk lihat arti →
                        </p>
                      )}
                    </div>
                  </div>

                  {kartuTerbuka[kata.id] ? (
                    <div
                      className="rounded-xl p-3"
                      style={{ backgroundColor: "var(--bg-subtle)", border: "1px solid var(--border)" }}
                    >
                      <p className="font-sans font-bold text-base" style={{ color: meta.accent }}>
                        {kata.indonesian}
                      </p>
                      <p className="font-sans text-xs mt-1 italic" style={{ color: "var(--text-muted)" }}>
                        &ldquo;{kata.contoh}&rdquo;
                      </p>
                    </div>
                  ) : (
                    <div
                      className="h-12 rounded-xl border-dashed flex items-center justify-center"
                      style={{ border: "1px dashed var(--border-strong)", backgroundColor: "var(--bg-subtle)" }}
                    >
                      <span className="font-sans text-sm" style={{ color: "var(--border-strong)" }}>• • •</span>
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

  // ─── TAMPILAN PILIH KATEGORI ────────────────────────────────────────────────
  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      <header className="sticky top-0 z-10" style={{ backgroundColor: "var(--bg-paper)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center gap-4">
          <Link href="/" className="text-2xl transition-opacity hover:opacity-70" style={{ color: "var(--brand)" }}>←</Link>
          <div>
            <h1 className="font-serif text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
              📚 Vocabulary
            </h1>
            <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
              {kosakataTersedia.length} kata · {urutanKategori.filter((k) => jumlahPerKategori[k] > 0).length} kategori
              {config && (
                <span className="ml-1 font-semibold" style={{ color: "var(--brand)" }}>
                  · {config.emoji} {config.label}
                </span>
              )}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-8">
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            Pilih Kategori
          </h2>
          <p className="font-sans text-sm" style={{ color: "var(--text-secondary)" }}>
            Klik salah satu kategori untuk mulai belajar kosakata 👇
          </p>
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
                className="card-de p-5 text-center group"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-3"
                  style={{ backgroundColor: m.iconBg, border: `1px solid var(--border)` }}
                >
                  {m.emoji}
                </div>
                <h3 className="font-serif font-semibold text-sm leading-tight mb-1" style={{ color: m.accent }}>
                  {kat}
                </h3>
                <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
                  {jumlah} kata
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
