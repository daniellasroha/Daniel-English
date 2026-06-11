// Halaman Review Harian — ulangi kartu yang sudah jatuh tempo
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSRS } from "@/hooks/useSRS";
import { speak } from "@/lib/speech";

// Label interval hari per level untuk tampilan
const LEVEL_LABEL = ["Baru", "1–3 hr", "3–7 hr", "7–14 hr", "Dikuasai"];
const LEVEL_COLOR = [
  "var(--text-muted)",
  "#D97706",
  "#059669",
  "#1D4ED8",
  "#7C3AED",
];

export default function ReviewPage() {
  const { loaded, getDueCards, markReview } = useSRS();

  const [antrian, setAntrian]     = useState([]);   // kartu yang perlu direview hari ini
  const [index, setIndex]         = useState(0);
  const [terbalik, setTerbalik]   = useState(false); // apakah kartu sudah dibalik
  const [hasil, setHasil]         = useState([]);    // { id, correct }
  const [selesai, setSelesai]     = useState(false);

  // Ambil kartu due saat halaman load
  useEffect(() => {
    if (!loaded) return;
    const due = getDueCards();
    // Acak urutan supaya tidak monoton
    const acak = [...due].sort(() => Math.random() - 0.5);
    setAntrian(acak);
    if (acak.length === 0) setSelesai(true);
  }, [loaded]);

  const kartu    = antrian[index] || null;
  const total    = antrian.length;
  const progress = total > 0 ? Math.round((index / total) * 100) : 0;

  function balik() {
    setTerbalik(true);
    if (kartu) speak(kartu.english);
  }

  function jawab(correct) {
    if (!kartu) return;
    markReview(kartu.id, correct);
    setHasil((prev) => [...prev, { id: kartu.id, correct }]);

    if (index + 1 >= total) {
      setSelesai(true);
    } else {
      setIndex((n) => n + 1);
      setTerbalik(false);
    }
  }

  // ── Belum load ──
  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-base)" }}>
        <p className="font-sans" style={{ color: "var(--text-muted)" }}>Memuat...</p>
      </div>
    );
  }

  // ── Selesai / tidak ada kartu ──
  if (selesai) {
    const benar  = hasil.filter((h) => h.correct).length;
    const salah  = hasil.filter((h) => !h.correct).length;
    const adaKartu = total > 0;

    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-base)" }}>
        <header className="sticky top-0 z-10" style={{ backgroundColor: "var(--bg-paper)", borderBottom: "1px solid var(--border)" }}>
          <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-3">
            <Link href="/" aria-label="Kembali" className="text-2xl hover:opacity-70 transition" style={{ color: "var(--brand)" }}>←</Link>
            <h1 className="font-serif text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
              🔄 Review Harian
            </h1>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-4 py-10">
          <div className="card-de p-8 max-w-sm w-full text-center">
            {adaKartu ? (
              <>
                <div className="text-6xl mb-4">
                  {benar === total ? "🏆" : benar >= total / 2 ? "⭐" : "💪"}
                </div>
                <h2 className="font-serif text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  Review Selesai!
                </h2>
                <p className="font-sans text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                  Kamu mereview {total} kartu hari ini
                </p>

                {/* Statistik */}
                <div className="flex gap-4 justify-center mb-6">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-extrabold text-green-500">{benar}</span>
                    <span className="font-sans text-xs mt-1" style={{ color: "var(--text-muted)" }}>Ingat ✓</span>
                  </div>
                  <div className="w-px" style={{ backgroundColor: "var(--border)" }} />
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-extrabold text-red-500">{salah}</span>
                    <span className="font-sans text-xs mt-1" style={{ color: "var(--text-muted)" }}>Lupa ✗</span>
                  </div>
                </div>

                <p className="font-sans text-xs mb-6" style={{ color: "var(--text-muted)" }}>
                  Kartu yang "Lupa" akan muncul lagi besok. Kartu "Ingat" dijadwalkan lebih lama.
                </p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">✅</div>
                <h2 className="font-serif text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  Semua Beres!
                </h2>
                <p className="font-sans text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                  Tidak ada kartu yang perlu direview sekarang. Buka pelajaran baru di <strong>Belajar Terstruktur</strong> untuk menambah kartu ke antrian review.
                </p>
              </>
            )}

            <div className="flex flex-col gap-3">
              <Link href="/belajar">
                <button className="w-full py-3 rounded-2xl font-sans font-bold text-white transition hover:opacity-90"
                  style={{ backgroundColor: "var(--brand)", boxShadow: "var(--shadow-btn)" }}>
                  🗺️ Belajar Materi Baru
                </button>
              </Link>
              <Link href="/">
                <button className="w-full py-3 rounded-2xl font-sans font-semibold border transition"
                  style={{ borderColor: "var(--border)", color: "var(--text-secondary)", backgroundColor: "var(--bg-subtle)" }}>
                  ← Kembali ke Beranda
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Guard: kartu bisa null sebentar sebelum useEffect mengisi antrian
  if (!kartu) return null;

  // ── Layar review utama ──
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-base)" }}>
      {/* Header */}
      <header className="sticky top-0 z-10" style={{ backgroundColor: "var(--bg-paper)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" aria-label="Kembali" className="text-2xl hover:opacity-70 transition" style={{ color: "var(--brand)" }}>←</Link>
          <div className="flex-1">
            <h1 className="font-serif text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
              🔄 Review Harian
            </h1>
            <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
              {index + 1} dari {total} kartu
            </p>
          </div>
          {/* Skor sementara */}
          <div className="flex gap-2 text-sm font-bold font-sans">
            <span className="text-green-500">{hasil.filter(h => h.correct).length} ✓</span>
            <span style={{ color: "var(--border-strong)" }}>·</span>
            <span className="text-red-500">{hasil.filter(h => !h.correct).length} ✗</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-xl mx-auto px-4 pb-3">
          <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: "var(--bg-subtle)" }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, backgroundColor: "var(--brand)" }}
            />
          </div>
        </div>
      </header>

      {/* Konten kartu */}
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-md">

          {/* Level indicator */}
          <div className="text-center mb-3">
            <span
              className="font-sans text-xs font-semibold px-3 py-1 rounded-full"
              style={{
                backgroundColor: "var(--bg-subtle)",
                color: LEVEL_COLOR[kartu.level] || "var(--text-muted)",
              }}
            >
              Level {kartu.level} — {LEVEL_LABEL[kartu.level]}
            </span>
          </div>

          {/* Kartu utama */}
          <div
            className="card-de p-8 mb-6 text-center cursor-pointer select-none"
            onClick={!terbalik ? balik : undefined}
          >
            {/* Sisi depan — kata Inggris */}
            <div className="text-5xl mb-4">{kartu.emoji}</div>
            <h2 className="font-serif text-3xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              {kartu.english}
            </h2>

            {!terbalik ? (
              <>
                {/* Tipe kartu */}
                <p className="font-sans text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                  {kartu.type === "vocab" ? "📚 Kosakata" : "🗺️ Materi Belajar"}
                </p>
                {/* Petunjuk */}
                <div
                  className="mt-4 py-3 px-5 rounded-xl font-sans text-sm font-semibold"
                  style={{ backgroundColor: "var(--bg-subtle)", color: "var(--text-muted)" }}
                >
                  Klik untuk lihat arti 👆
                </div>
              </>
            ) : (
              <>
                {/* Sisi belakang — terjemahan + contoh */}
                <div
                  className="mt-2 py-4 px-5 rounded-xl text-left"
                  style={{ backgroundColor: "var(--bg-subtle)", border: "1px solid var(--border)" }}
                >
                  <p className="font-sans font-bold text-lg mb-1" style={{ color: "var(--brand)" }}>
                    {kartu.indonesian}
                  </p>
                  {kartu.contoh && (
                    <p className="font-sans text-sm italic" style={{ color: "var(--text-secondary)" }}>
                      &ldquo;{kartu.contoh}&rdquo;
                    </p>
                  )}
                </div>

                {/* Tombol TTS */}
                <button
                  onClick={(e) => { e.stopPropagation(); speak(kartu.english); }}
                  className="mt-3 font-sans text-xs px-3 py-1.5 rounded-full border transition hover:opacity-80"
                  style={{ borderColor: "var(--border)", color: "var(--text-muted)", backgroundColor: "var(--bg-paper)" }}
                >
                  🔊 Dengarkan pengucapan
                </button>
              </>
            )}
          </div>

          {/* Tombol jawaban — hanya muncul setelah kartu dibalik */}
          {terbalik ? (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => jawab(false)}
                className="py-4 rounded-2xl font-sans font-bold text-lg transition hover:scale-105 active:scale-95 text-white"
                style={{ backgroundColor: "#DC2626", boxShadow: "0 4px 12px rgba(220,38,38,0.3)" }}
              >
                🔴 Lupa
              </button>
              <button
                onClick={() => jawab(true)}
                className="py-4 rounded-2xl font-sans font-bold text-lg transition hover:scale-105 active:scale-95 text-white"
                style={{ backgroundColor: "#059669", boxShadow: "0 4px 12px rgba(5,150,105,0.3)" }}
              >
                🟢 Ingat
              </button>
            </div>
          ) : (
            /* Tombol skip — kalau tidak mau balik, langsung skip */
            <button
              onClick={() => { if (index + 1 >= total) setSelesai(true); else { setIndex(n => n + 1); setTerbalik(false); } }}
              className="w-full py-3 rounded-2xl font-sans text-sm border transition"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)", backgroundColor: "var(--bg-subtle)" }}
            >
              Lewati →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
