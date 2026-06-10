// Halaman utama — navigasi kategori → sub-item
"use client";

import { useState } from "react";
import Link from "next/link";
import { useUsername } from "@/hooks/useUsername";
import { useLevel } from "@/hooks/useLevel";
import { useSRS } from "@/hooks/useSRS";
import UsernameModal from "@/components/UsernameModal";
import LevelModal from "@/components/LevelModal";
import DarkModeToggle from "@/components/DarkModeToggle";

const kategori = [
  {
    id: "belajar",
    emoji: "📚",
    title: "Belajar",
    deskripsi: "Pelajari kosakata, grammar, dan percakapan",
    accentColor: "#2D5A3D",
    iconBg: "#E8F0EB",
    items: [
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
        emoji: "📖",
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
        href: "/listening",
        emoji: "🎧",
        title: "Listening",
        description: "Latih kemampuan mendengar bahasa Inggris",
        accentColor: "#D97706",
        iconBg: "#FEF3C7",
      },
      {
        href: "/reading",
        emoji: "📰",
        title: "Reading",
        description: "Baca teks bahasa Inggris dan jawab soal pemahaman",
        accentColor: "#0369A1",
        iconBg: "#E0F2FE",
        badge: "✨ Baru",
      },
      {
        href: "/phrasebook",
        emoji: "💬",
        title: "Phrasebook",
        description: "Kalimat percakapan sehari-hari siap pakai dengan audio",
        accentColor: "#0369A1",
        iconBg: "#E0F2FE",
      },
    ],
  },
  {
    id: "latihan",
    emoji: "🎯",
    title: "Latihan",
    deskripsi: "Uji dan asah kemampuanmu dengan berbagai soal",
    accentColor: "#7C3AED",
    iconBg: "#EDE9FE",
    items: [
      {
        href: "/quiz",
        emoji: "🧠",
        title: "Quiz",
        description: "Uji kemampuanmu dengan soal-soal interaktif",
        accentColor: "#7C3AED",
        iconBg: "#EDE9FE",
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
        href: "/review",
        emoji: "🔄",
        title: "Review Harian",
        description: "Ulangi kata-kata yang sudah dipelajari sebelum terlupakan",
        accentColor: "#2D5A3D",
        iconBg: "#E8F0EB",
      },
    ],
  },
  {
    id: "progress",
    emoji: "🏆",
    title: "Progress & Ranking",
    deskripsi: "Pantau kemajuan belajar dan bandingkan dengan pelajar lain",
    accentColor: "#BE185D",
    iconBg: "#FCE7F3",
    items: [
      {
        href: "/progress",
        emoji: "📊",
        title: "Progress",
        description: "Lihat perkembangan belajarmu dari waktu ke waktu",
        accentColor: "#BE185D",
        iconBg: "#FCE7F3",
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
    ],
  },
];

function getLevelPillStyle(level) {
  const map = {
    a1: { background: "var(--a1-light)", color: "var(--a1)" },
    a2: { background: "var(--a2-light)", color: "var(--a2)" },
    b1: { background: "var(--b1-light)", color: "var(--b1)" },
  };
  return map[level] ?? { background: "var(--bg-subtle)", color: "var(--text-muted)" };
}

export default function Home() {
  const { username, saveUsername, loaded: loadedUser } = useUsername();
  const { level, setLevel, config, loaded: loadedLevel } = useLevel();
  const { dueCount } = useSRS();
  const [gantiLevel, setGantiLevel] = useState(false);
  const [aktif, setAktif] = useState(null); // null = tampilkan 3 kartu kategori

  const showNameModal  = loadedUser && !username;
  const showLevelModal = loadedUser && loadedLevel && username && !level;

  const kat = aktif ? kategori.find((k) => k.id === aktif) : null;

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>

      {showNameModal && <UsernameModal onSave={saveUsername} />}
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
        style={{ backgroundColor: "var(--bg-paper)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Tombol kembali ke kategori */}
            {aktif && (
              <button
                onClick={() => setAktif(null)}
                className="text-2xl transition-opacity hover:opacity-70 mr-1"
                style={{ color: "var(--brand)" }}
              >
                ←
              </button>
            )}
            <span className="text-2xl select-none">🇬🇧</span>
            <div>
              <h1 className="font-serif text-xl font-semibold leading-tight" style={{ color: "var(--brand)" }}>
                Daniel English
              </h1>
              <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
                {kat ? kat.title : "Belajar bahasa Inggris mudah & menyenangkan"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setGantiLevel(true)}
              className="level-pill"
              style={level ? getLevelPillStyle(level) : { background: "var(--bg-subtle)", color: "var(--text-muted)" }}
              title="Klik untuk ganti level"
            >
              {config ? `${config.emoji} ${config.label}` : "Pilih Level"}
            </button>
            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* ─── Hero ──────────────────────────────────────────────────────────── */}
      {!aktif && (
        <section className="max-w-4xl mx-auto px-5 pt-12 pb-8 text-center">
          <h2
            className="font-serif text-4xl sm:text-5xl font-semibold leading-tight mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            {username ? <>Halo, <em>{username}</em>! 👋</> : "Halo, Selamat Datang! 👋"}
          </h2>
          {config && (
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-sans text-sm font-semibold mb-5"
              style={getLevelPillStyle(level)}
            >
              {config.emoji} Level {config.label} — {config.deskripsi.split(",")[0]}
            </div>
          )}
          <p className="font-sans text-base max-w-md mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Pilih kategori di bawah untuk mulai belajar.
          </p>
        </section>
      )}

      {/* ─── Tampilan: 3 Kartu Kategori ────────────────────────────────────── */}
      {!aktif && (
        <section className="max-w-4xl mx-auto px-5 pb-16">
          <div className="flex flex-col gap-4">
            {kategori.map((kat) => (
              <button
                key={kat.id}
                onClick={() => setAktif(kat.id)}
                className="card-de relative overflow-hidden text-left w-full group"
              >
                {/* Strip aksen kiri */}
                <div
                  className="absolute inset-y-0 left-0 w-[3px]"
                  style={{ backgroundColor: kat.accentColor }}
                />

                <div className="pl-6 pr-5 py-6 flex items-center gap-5">
                  {/* Ikon besar */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ backgroundColor: kat.iconBg, border: "1px solid var(--border)" }}
                  >
                    {kat.emoji}
                  </div>

                  {/* Teks */}
                  <div className="flex-1 min-w-0">
                    <h2
                      className="font-serif text-xl font-semibold mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {kat.title}
                    </h2>
                    <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {kat.deskripsi}
                    </p>
                    {/* Jumlah modul */}
                    <span
                      className="inline-block font-sans text-xs font-semibold mt-2 px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: kat.iconBg, color: kat.accentColor, border: `1px solid ${kat.accentColor}30` }}
                    >
                      {kat.items.length} modul
                    </span>
                  </div>

                  {/* Panah */}
                  <span
                    className="text-2xl flex-shrink-0 transition-transform group-hover:translate-x-1"
                    style={{ color: kat.accentColor }}
                  >
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ─── Tampilan: Sub-item kategori terpilih ──────────────────────────── */}
      {aktif && kat && (
        <section className="max-w-4xl mx-auto px-5 pt-6 pb-16">
          {/* Sub-header kategori */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ backgroundColor: kat.iconBg, border: "1px solid var(--border)" }}
            >
              {kat.emoji}
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
                {kat.title}
              </h2>
              <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
                {kat.items.length} modul tersedia
              </p>
            </div>
          </div>

          {/* Grid sub-item */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kat.items.map((item) => (
              <Link key={item.href} href={item.href} className="group">
                <div className="card-de relative h-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 w-[3px]"
                    style={{ backgroundColor: item.accentColor }}
                  />
                  <div className="pl-6 pr-5 py-6">
                    {/* Badge */}
                    {item.href === "/review" && dueCount > 0 ? (
                      <span
                        className="absolute top-4 right-4 font-sans text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: "#DC2626" }}
                      >
                        {dueCount} kartu
                      </span>
                    ) : item.badge ? (
                      <span className="badge-gold absolute top-4 right-4">{item.badge}</span>
                    ) : null}

                    {/* Ikon */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-4 flex-shrink-0"
                      style={{ backgroundColor: item.iconBg, border: "1px solid var(--border)" }}
                    >
                      {item.emoji}
                    </div>

                    {/* Judul */}
                    <h3
                      className="font-serif text-[1.0625rem] font-semibold mb-1.5 leading-snug"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.title}
                    </h3>

                    {/* Deskripsi */}
                    <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Tombol kembali bawah */}
          <button
            onClick={() => setAktif(null)}
            className="mt-8 font-sans text-sm font-semibold transition-opacity hover:opacity-70 flex items-center gap-1"
            style={{ color: "var(--text-muted)" }}
          >
            ← Kembali ke semua kategori
          </button>
        </section>
      )}

      {/* ─── Footer ────────────────────────────────────────────────────────── */}
      {!aktif && (
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
      )}
    </main>
  );
}
