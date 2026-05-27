// Halaman utama — menu navigasi ke semua fitur belajar
"use client";

import Link from "next/link";
import { useUsername } from "@/hooks/useUsername";
import UsernameModal from "@/components/UsernameModal";
import DarkModeToggle from "@/components/DarkModeToggle";

// Data kartu menu — setiap fitur belajar
const menuItems = [
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
    badge: "BARU",
  },
];

export default function Home() {
  const { username, saveUsername, loaded } = useUsername();

  // Tampilkan modal jika nama belum diisi (setelah localStorage terbaca)
  const showModal = loaded && !username;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
      {/* Modal input nama (muncul saat pertama kali) */}
      {showModal && <UsernameModal onSave={saveUsername} />}

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
            <div className="bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">
              Level: Pemula
            </div>
            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="max-w-4xl mx-auto px-4 py-10 text-center">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-3">
          {username ? `Halo, ${username}! 👋` : "Halo, Selamat Datang! 👋"}
        </h2>
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
              <div
                className={`rounded-2xl border ${item.border} ${item.bgLight} p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer h-full relative`}
              >
                {/* Badge "Baru" jika ada */}
                {item.badge && (
                  <span className="absolute top-3 right-3 bg-violet-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                {/* Icon bulat dengan gradient */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-3xl mb-4 shadow-md`}
                >
                  {item.emoji}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-400 text-sm space-y-1">
        <p>💪 Belajar 15 menit sehari lebih baik dari 2 jam sebulan sekali!</p>
        <p className="text-gray-300 text-xs">
          Made with ❤️ by{" "}
          <span className="font-semibold text-indigo-400">Daniel Lasroha</span>
        </p>
      </footer>
    </main>
  );
}
