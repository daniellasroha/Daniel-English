// Halaman utama — menu navigasi ke semua fitur belajar
"use client";

import { useState } from "react";
import Link from "next/link";
import { useUsername } from "@/hooks/useUsername";
import { useLevel, LEVEL_CONFIG } from "@/hooks/useLevel";
import UsernameModal from "@/components/UsernameModal";
import LevelModal from "@/components/LevelModal";
import DarkModeToggle from "@/components/DarkModeToggle";

const menuItems = [
  {
    href: "/belajar",
    emoji: "🗺️",
    title: "Belajar Terstruktur",
    description: "Alur belajar bertahap seperti Busuu — dari salam pertama hingga percakapan sehari-hari",
    color: "from-indigo-400 to-purple-600",
    bgLight: "bg-indigo-50",
    border: "border-indigo-200",
    badge: "✨ Baru",
  },
  {
    href: "/vocabulary",
    emoji: "📚",
    title: "Vocabulary",
    description: "Belajar kosakata baru dengan gambar dan contoh kalimat",
    color: "from-blue-400 to-blue-600",
    bgLight: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    href: "/grammar",
    emoji: "✏️",
    title: "Grammar",
    description: "Pelajari tata bahasa Inggris dengan penjelasan mudah",
    color: "from-green-400 to-green-600",
    bgLight: "bg-green-50",
    border: "border-green-200",
  },
  {
    href: "/quiz",
    emoji: "🧠",
    title: "Quiz",
    description: "Uji kemampuanmu dengan soal-soal interaktif",
    color: "from-purple-400 to-purple-600",
    bgLight: "bg-purple-50",
    border: "border-purple-200",
  },
  {
    href: "/listening",
    emoji: "🎧",
    title: "Listening",
    description: "Latih kemampuan mendengar bahasa Inggris",
    color: "from-orange-400 to-orange-600",
    bgLight: "bg-orange-50",
    border: "border-orange-200",
  },
  {
    href: "/progress",
    emoji: "📊",
    title: "Progress",
    description: "Lihat perkembangan belajarmu dari waktu ke waktu",
    color: "from-pink-400 to-pink-600",
    bgLight: "bg-pink-50",
    border: "border-pink-200",
  },
  {
    href: "/daily",
    emoji: "⚡",
    title: "Daily Challenge",
    description: "1 soal spesial setiap hari — bangun streak kamu!",
    color: "from-violet-400 to-purple-600",
    bgLight: "bg-violet-50",
    border: "border-violet-200",
  },
  {
    href: "/phrasebook",
    emoji: "💬",
    title: "Phrasebook",
    description: "Kalimat percakapan sehari-hari siap pakai dengan audio",
    color: "from-sky-400 to-blue-600",
    bgLight: "bg-sky-50",
    border: "border-sky-200",
  },
];

export default function Home() {
  const { username, saveUsername, loaded: loadedUser } = useUsername();
  const { level, setLevel, config, loaded: loadedLevel } = useLevel();
  const [gantiLevel, setGantiLevel] = useState(false);

  // Step 1: isi nama dulu
  const showNameModal = loadedUser && !username;
  // Step 2: setelah nama terisi, pilih level
  const showLevelModal = loadedUser && loadedLevel && username && !level;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
      {/* Modal nama */}
      {showNameModal && <UsernameModal onSave={saveUsername} />}

      {/* Modal pilih level (pertama kali / ganti level) */}
      {(showLevelModal || gantiLevel) && (
        <LevelModal
          onSave={(lvl) => { setLevel(lvl); setGantiLevel(false); }}
          bolehTutup={gantiLevel}
          onTutup={() => setGantiLevel(false)}
        />
      )}

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🇬🇧</span>
            <div>
              <h1 className="text-xl font-bold text-indigo-700">Daniel English</h1>
              <p className="text-xs text-gray-400">Belajar bahasa Inggris mudah & menyenangkan</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Tombol level — klik untuk ganti */}
            <button
              onClick={() => setGantiLevel(true)}
              className={`flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full transition hover:opacity-80 ${
                config ? `${config.warnaLight} ${config.teks} border ${config.border}` : "bg-gray-100 text-gray-500"
              }`}
              title="Klik untuk ganti level"
            >
              {config ? `${config.emoji} ${config.label}` : "Pilih Level"}
            </button>
            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="max-w-4xl mx-auto px-4 py-10 text-center">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-3">
          {username ? `Halo, ${username}! 👋` : "Halo, Selamat Datang! 👋"}
        </h2>
        {config && (
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 ${config.warnaLight} ${config.teks} border ${config.border}`}>
            {config.emoji} Level {config.label} — {config.deskripsi.split(",")[0]}
          </div>
        )}
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Pilih kategori di bawah untuk mulai belajar. Konsisten setiap hari
          adalah kunci sukses berbahasa Inggris!
        </p>
      </section>

      {/* Kartu menu */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={`rounded-2xl border ${item.border} ${item.bgLight} p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer h-full relative`}>
                {item.badge && (
                  <span className="absolute top-3 right-3 bg-violet-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-3xl mb-4 shadow-md`}>
                  {item.emoji}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-400 text-sm space-y-1">
        <p>💪 Belajar 15 menit sehari lebih baik dari 2 jam sebulan sekali!</p>
        <p className="text-gray-300 text-xs">
          Made with ❤️ by <span className="font-semibold text-indigo-400">Daniel Lasroha</span>
        </p>
      </footer>
    </main>
  );
}
