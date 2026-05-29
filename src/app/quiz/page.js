// Halaman Quiz — pilih kategori kuis
"use client";
import { useState } from "react";
import Link from "next/link";
import { useLevel } from "@/hooks/useLevel";

const kategoriKuis = [
  {
    href: "/quiz/vocabulary",
    emoji: "📚",
    judul: "Vocabulary Quiz",
    deskripsi: "Uji hafalan kosakata — soal disesuaikan dengan levelmu",
    warna: "from-blue-400 to-blue-600",
    bgLight: "bg-blue-50",
    border: "border-blue-200",
    soalA1: "15 soal",
    soalA2: "20 soal",
  },
  {
    href: "/quiz/grammar",
    emoji: "✏️",
    judul: "Grammar Quiz",
    deskripsi: "Uji tata bahasa — materi sesuai topik di levelmu",
    warna: "from-green-400 to-green-600",
    bgLight: "bg-green-50",
    border: "border-green-200",
    soalA1: "10 soal",
    soalA2: "16 soal",
  },
  {
    href: "/quiz/translation",
    emoji: "🌐",
    judul: "Translation Quiz",
    deskripsi: "Terjemahkan kalimat Indonesia ke bahasa Inggris!",
    warna: "from-sky-400 to-blue-600",
    bgLight: "bg-sky-50",
    border: "border-sky-200",
    soalA1: "12 soal",
    soalA2: "15 soal",
    badge: "🆕 Baru",
  },
  {
    href: "/quiz/mixed",
    emoji: "🎯",
    judul: "Mixed Quiz",
    deskripsi: "Campuran semua materi — tantangan terbesar!",
    warna: "from-purple-400 to-purple-600",
    bgLight: "bg-purple-50",
    border: "border-purple-200",
    soalA2: "20 soal",
    badge: "⚡ Tantangan",
  },
  {
    href: "/quiz/spelling",
    emoji: "⌨️",
    judul: "Spelling Quiz",
    deskripsi: "Lihat arti bahasa Indonesia, tulis dalam bahasa Inggris!",
    warna: "from-teal-400 to-cyan-600",
    bgLight: "bg-teal-50",
    border: "border-teal-200",
    soalA2: "15 soal acak",
  },
  {
    href: "/quiz/typing",
    emoji: "✍️",
    judul: "Typing Quiz",
    deskripsi: "Baca kalimat Indonesia, ketik sendiri terjemahannya — latihan paling efektif!",
    warna: "from-violet-400 to-purple-600",
    bgLight: "bg-violet-50",
    border: "border-violet-200",
    soalA1: "15 soal",
    soalA2: "15 soal",
    badge: "✍️ Ketik",
  },
];

export default function QuizPage() {
  const [timer, setTimer] = useState(false);
  const { config } = useLevel();

  // Filter quiz sesuai level
  const kuis = config
    ? kategoriKuis.filter((k) => config.quizRoutes.includes(k.href))
    : kategoriKuis;

  // Tampilkan jumlah soal sesuai level
  const getSoal = (kat) => {
    if (config?.vocabLevel === "a1") return kat.soalA1 || kat.soalA2;
    return kat.soalA2 || kat.soalA1;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-indigo-500 hover:text-indigo-700 text-2xl">←</Link>
          <div>
            <h1 className="text-xl font-bold text-indigo-700">🧠 Quiz</h1>
            <p className="text-xs text-gray-400">
              {kuis.length} jenis quiz
              {config && <span className={`ml-1 font-semibold ${config.teks}`}>· {config.emoji} {config.label}</span>}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Pilih Kategori Kuis</h2>
          <p className="text-gray-500 text-sm">
            {config?.vocabLevel === "a1"
              ? "Soal sudah disesuaikan untuk level A1 🌱 Selamat mencoba!"
              : config?.vocabLevel === "b1"
              ? "Soal disesuaikan untuk level B1 🚀 Selamat mencoba!"
              : "Soal disesuaikan untuk level A2 📗 Selamat mencoba!"}
          </p>
        </div>

        {/* Toggle Timer */}
        <div className="bg-white rounded-2xl border border-orange-200 p-4 mb-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="font-bold text-gray-800">⏱ Mode Timer</p>
            <p className="text-xs text-gray-400">15 detik per soal — lebih menantang!</p>
          </div>
          <button
            onClick={() => setTimer((v) => !v)}
            className={`w-14 h-7 rounded-full transition-all duration-300 relative ${
              timer ? "bg-orange-500" : "bg-gray-200"
            }`}
          >
            <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all duration-300 ${
              timer ? "left-7" : "left-0.5"
            }`} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {kuis.map((kat) => {
            // Spelling quiz tidak pakai timer
            const hrefFinal = kat.href === "/quiz/spelling"
              ? kat.href
              : timer ? `${kat.href}?timer=1` : kat.href;
            return (
              <Link key={kat.href} href={hrefFinal}>
                <div className={`rounded-2xl border ${kat.border} ${kat.bgLight} p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer relative`}>
                  {kat.badge && (
                    <span className="absolute top-3 right-3 bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {kat.badge}
                    </span>
                  )}
                  {timer && kat.href !== "/quiz/spelling" && (
                    <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      ⏱ Timer ON
                    </span>
                  )}
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${kat.warna} flex items-center justify-center text-3xl shadow-md flex-shrink-0`}>
                      {kat.emoji}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">{kat.judul}</h3>
                      <p className="text-gray-500 text-sm">{kat.deskripsi}</p>
                      <span className="text-xs bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full mt-1 inline-block">
                        {getSoal(kat)}
                      </span>
                    </div>
                    <span className="text-gray-400 text-2xl">›</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
