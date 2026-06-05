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
    accentColor: "#1D4ED8",
    iconBg: "#DBEAFE",
    soalA1: "15 soal",
    soalA2: "20 soal",
  },
  {
    href: "/quiz/grammar",
    emoji: "✏️",
    judul: "Grammar Quiz",
    deskripsi: "Uji tata bahasa — materi sesuai topik di levelmu",
    accentColor: "#059669",
    iconBg: "#D1FAE5",
    soalA1: "10 soal",
    soalA2: "16 soal",
  },
  {
    href: "/quiz/translation",
    emoji: "🌐",
    judul: "Translation Quiz",
    deskripsi: "Terjemahkan kalimat Indonesia ke bahasa Inggris!",
    accentColor: "#0369A1",
    iconBg: "#E0F2FE",
    soalA1: "12 soal",
    soalA2: "15 soal",
    badge: "🆕 Baru",
  },
  {
    href: "/quiz/mixed",
    emoji: "🎯",
    judul: "Mixed Quiz",
    deskripsi: "Campuran semua materi — tantangan terbesar!",
    accentColor: "#7C3AED",
    iconBg: "#EDE9FE",
    soalA2: "20 soal",
    badge: "⚡ Tantangan",
  },
  {
    href: "/quiz/spelling",
    emoji: "⌨️",
    judul: "Spelling Quiz",
    deskripsi: "Lihat arti bahasa Indonesia, tulis dalam bahasa Inggris!",
    accentColor: "#0D9488",
    iconBg: "#CCFBF1",
    soalA2: "15 soal acak",
  },
  {
    href: "/quiz/typing",
    emoji: "✍️",
    judul: "Typing Quiz",
    deskripsi: "Baca kalimat Indonesia, ketik sendiri terjemahannya — latihan paling efektif!",
    accentColor: "#6D28D9",
    iconBg: "#EDE9FE",
    soalA1: "15 soal",
    soalA2: "15 soal",
    badge: "✍️ Ketik",
  },
];

export default function QuizPage() {
  const [timer, setTimer] = useState(false);
  const { config } = useLevel();

  const kuis = config
    ? kategoriKuis.filter((k) => config.quizRoutes.includes(k.href))
    : kategoriKuis;

  const getSoal = (kat) => {
    if (config?.vocabLevel === "a1") return kat.soalA1 || kat.soalA2;
    return kat.soalA2 || kat.soalA1;
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>

      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-10"
        style={{ backgroundColor: "var(--bg-paper)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="text-2xl transition-opacity hover:opacity-70"
            style={{ color: "var(--brand)" }}
          >
            ←
          </Link>
          <div>
            <h1 className="font-serif text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
              🧠 Quiz
            </h1>
            <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
              {kuis.length} jenis quiz
              {config && (
                <span className="ml-1 font-semibold" style={{ color: "var(--brand)" }}>
                  · {config.emoji} {config.label}
                </span>
              )}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-5 py-8">

        {/* ─── Hero ──────────────────────────────────────────────────────────── */}
        <div className="text-center mb-7">
          <h2 className="font-serif text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            Pilih Kategori Kuis
          </h2>
          <p className="font-sans text-sm" style={{ color: "var(--text-secondary)" }}>
            {config?.vocabLevel === "a1"
              ? "Soal sudah disesuaikan untuk level A1 🌱 Selamat mencoba!"
              : config?.vocabLevel === "b1"
              ? "Soal disesuaikan untuk level B1 🚀 Selamat mencoba!"
              : "Soal disesuaikan untuk level A2 📗 Selamat mencoba!"}
          </p>
        </div>

        {/* ─── Toggle Timer ──────────────────────────────────────────────────── */}
        <div
          className="card-de p-4 mb-6 flex items-center justify-between"
        >
          <div>
            <p className="font-sans font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
              ⏱ Mode Timer
            </p>
            <p className="font-sans text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              15 detik per soal — lebih menantang!
            </p>
          </div>
          <button
            onClick={() => setTimer((v) => !v)}
            className="w-14 h-7 rounded-full transition-all duration-300 relative flex-shrink-0"
            style={{ backgroundColor: timer ? "var(--gold)" : "var(--border-strong)" }}
          >
            <span
              className="absolute top-0.5 w-6 h-6 rounded-full shadow transition-all duration-300"
              style={{
                backgroundColor: "var(--bg-paper)",
                left: timer ? "calc(100% - 1.625rem)" : "0.125rem",
              }}
            />
          </button>
        </div>

        {/* ─── Kartu kategori ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {kuis.map((kat) => {
            const hrefFinal =
              kat.href === "/quiz/spelling"
                ? kat.href
                : timer
                ? `${kat.href}?timer=1`
                : kat.href;

            return (
              <Link key={kat.href} href={hrefFinal} className="group">
                <div className="card-de relative overflow-hidden">
                  {/* Strip aksen kiri */}
                  <div
                    className="absolute inset-y-0 left-0 w-[3px]"
                    style={{ backgroundColor: kat.accentColor }}
                  />

                  <div className="pl-6 pr-5 py-5">
                    {/* Badge */}
                    {kat.badge && (
                      <span
                        className="absolute top-3 right-3 font-sans text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: kat.accentColor }}
                      >
                        {kat.badge}
                      </span>
                    )}
                    {timer && kat.href !== "/quiz/spelling" && (
                      <span
                        className="absolute top-3 left-3 font-sans text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: "var(--gold)" }}
                      >
                        ⏱ Timer ON
                      </span>
                    )}

                    <div className="flex items-center gap-4">
                      {/* Ikon */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ backgroundColor: kat.iconBg, border: "1px solid var(--border)" }}
                      >
                        {kat.emoji}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-serif font-semibold text-base leading-snug"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {kat.judul}
                        </h3>
                        <p
                          className="font-sans text-sm mt-0.5 leading-snug"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {kat.deskripsi}
                        </p>
                        {getSoal(kat) && (
                          <span
                            className="font-sans text-xs mt-1.5 inline-block px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: "var(--bg-subtle)",
                              color: "var(--text-muted)",
                              border: "1px solid var(--border)",
                            }}
                          >
                            {getSoal(kat)}
                          </span>
                        )}
                      </div>

                      <span className="text-xl flex-shrink-0" style={{ color: "var(--text-muted)" }}>
                        ›
                      </span>
                    </div>
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
