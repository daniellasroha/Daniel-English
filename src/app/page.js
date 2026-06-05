// Halaman utama — menu navigasi ke semua fitur belajar
"use client";

import { useState } from "react";
import Link from "next/link";
import { useUsername } from "@/hooks/useUsername";
import { useLevel, LEVEL_CONFIG } from "@/hooks/useLevel";
import UsernameModal from "@/components/UsernameModal";
import LevelModal from "@/components/LevelModal";
import DarkModeToggle from "@/components/DarkModeToggle";

// Warna aksen per fitur — semantik & konsisten, bukan acak
const menuItems = [
  {
    href: "/belajar",
    emoji: "🗺️",
    title: "Belajar Terstruktur",
    description: "Alur belajar bertahap seperti Busuu — dari salam pertama hingga percakapan sehari-hari",
    accentColor: "#2D5A3D",
    iconBg: "#E8F0EB",
    badge: "✨ Baru",
  },
  {
    href: "/vocabulary",
    emoji: "📚",
    title: "Vocabulary",
    description: "Belajar kosakata baru dengan gambar dan contoh kalimat",
    accentColor: "#1D4ED8",
    iconBg: "#DBEAFE",
  },
  {
    href: "/grammar",
    emoji: "✏️",
    title: "Grammar",
    description: "Pelajari tata bahasa Inggris dengan penjelasan mudah",
    accentColor: "#059669",
    iconBg: "#D1FAE5",
  },
  {
    href: "/quiz",
    emoji: "🧠",
    title: "Quiz",
    description: "Uji kemampuanmu dengan soal-soal interaktif",
    accentColor: "#7C3AED",
    iconBg: "#EDE9FE",
  },
  {
    href: "/listening",
    emoji: "🎧",
    title: "Listening",
    description: "Latih kemampuan mendengar bahasa Inggris",
    accentColor: "#D97706",
    iconBg: "#FEF3C7",
  },
  {
    href: "/progress",
    emoji: "📊",
    title: "Progress",
    description: "Lihat perkembangan belajarmu dari waktu ke waktu",
    accentColor: "#BE185D",
    iconBg: "#FCE7F3",
  },
  {
    href: "/daily",
    emoji: "⚡",
    title: "Daily Challenge",
    description: "1 soal spesial setiap hari — bangun streak kamu!",
    accentColor: "#C9933A",
    iconBg: "#FDF3E3",
    badge: "🔥 Harian",
  },
  {
    href: "/phrasebook",
    emoji: "💬",
    title: "Phrasebook",
    description: "Kalimat percakapan sehari-hari siap pakai dengan audio",
    accentColor: "#0369A1",
    iconBg: "#E0F2FE",
  },
  {
    href: "/leaderboard",
    emoji: "🏆",
    title: "Leaderboard",
    description: "Lihat ranking kamu dibanding semua pelajar lainnya",
    accentColor: "#C9933A",
    iconBg: "#FDF3E3",
    badge: "🔥 Baru",
  },
];

// Mapping level → CSS vars untuk pill di header & hero
function getLevelPillStyle(level) {
  const map = {
    a1: { background: "var(--a1-light)", color: "var(--a1)" },
    a2: { background: "var(--a2-light)", color: "var(--a2)" },
    b1: { background: "var(--b1-light)", color: "var(--b1)" },
  };
  return map[level] ?? { background: "var(--bg-subtle)", color: "var(--text-muted)" };
}

export default function Home() {
  // ─── Semua logika tetap sama persis ────────────────────────────────────────
  const { username, saveUsername, loaded: loadedUser } = useUsername();
  const { level, setLevel, config, loaded: loadedLevel } = useLevel();
  const [gantiLevel, setGantiLevel] = useState(false);

  const showNameModal  = loadedUser && !username;
  const showLevelModal = loadedUser && loadedLevel && username && !level;

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>

      {/* Modal nama */}
      {showNameModal && <UsernameModal onSave={saveUsername} />}

      {/* Modal pilih level */}
      {(showLevelModal || gantiLevel) && (
        <LevelModal
          onSave={(lvl) => { setLevel(lvl); setGantiLevel(false); }}
          bolehTutup={gantiLevel}
          onTutup={() => setGantiLevel(false)}
        />
      )}

      {/* ─── Header ────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-10"
        style={{
          backgroundColor: "var(--bg-paper)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">

          {/* Logo & nama brand */}
          <div className="flex items-center gap-3">
            <span className="text-2xl select-none">🇬🇧</span>
            <div>
              <h1
                className="font-serif text-xl font-semibold leading-tight"
                style={{ color: "var(--brand)" }}
              >
                Daniel English
              </h1>
              <p
                className="font-sans text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Belajar bahasa Inggris mudah & menyenangkan
              </p>
            </div>
          </div>

          {/* Tombol level + dark mode toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setGantiLevel(true)}
              className="level-pill"
              style={
                level
                  ? getLevelPillStyle(level)
                  : { background: "var(--bg-subtle)", color: "var(--text-muted)" }
              }
              title="Klik untuk ganti level"
            >
              {config ? `${config.emoji} ${config.label}` : "Pilih Level"}
            </button>
            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* ─── Hero ──────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-5 pt-12 pb-8 text-center">
        <h2
          className="font-serif text-4xl sm:text-5xl font-semibold leading-tight mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          {username ? (
            <>
              Halo, <em>{username}</em>! 👋
            </>
          ) : (
            "Halo, Selamat Datang! 👋"
          )}
        </h2>

        {/* Pill level aktif */}
        {config && (
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-sans text-sm font-semibold mb-5"
            style={getLevelPillStyle(level)}
          >
            {config.emoji} Level {config.label} — {config.deskripsi.split(",")[0]}
          </div>
        )}

        <p
          className="font-sans text-base max-w-md mx-auto leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Pilih modul di bawah untuk mulai belajar. Konsisten setiap hari
          adalah kunci sukses berbahasa Inggris.
        </p>
      </section>

      {/* ─── Grid kartu menu ───────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-5 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className="group">
              <div className="card-de relative h-full overflow-hidden">

                {/* Strip aksen kiri — warna semantik per fitur */}
                <div
                  className="absolute inset-y-0 left-0 w-[3px]"
                  style={{ backgroundColor: item.accentColor }}
                />

                {/* Konten kartu */}
                <div className="pl-6 pr-5 py-6">

                  {/* Badge "Baru" / "Harian" */}
                  {item.badge && (
                    <span className="badge-gold absolute top-4 right-4">
                      {item.badge}
                    </span>
                  )}

                  {/* Ikon — lingkaran hangat bertekstur, bukan gradient box */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-4 flex-shrink-0"
                    style={{
                      backgroundColor: item.iconBg,
                      border: "1px solid var(--border)",
                    }}
                  >
                    {item.emoji}
                  </div>

                  {/* Judul — Playfair Display */}
                  <h3
                    className="font-serif text-[1.0625rem] font-semibold mb-1.5 leading-snug"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.title}
                  </h3>

                  {/* Deskripsi */}
                  <p
                    className="font-sans text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────────────── */}
      <footer className="text-center pb-10 space-y-1.5">
        <p className="font-sans text-sm" style={{ color: "var(--text-muted)" }}>
          💪 Belajar 15 menit sehari lebih baik dari 2 jam sebulan sekali!
        </p>
        <p className="font-sans text-xs" style={{ color: "var(--border-strong)" }}>
          Made with ❤️ by{" "}
          <span className="font-semibold" style={{ color: "var(--brand)" }}>
            Daniel Lasroha
          </span>
        </p>
      </footer>
    </main>
  );
}
