// Halaman Reading — baca teks bahasa Inggris lalu jawab soal pemahaman
"use client";

import { useState } from "react";
import Link from "next/link";
import { bacaan } from "@/data/reading";
import { useLevel } from "@/hooks/useLevel";
import { useProgress } from "@/hooks/useProgress";
import { useSound } from "@/hooks/useSound";

const ACCENT = "#0369A1";

// Badge level CEFR
function levelBadge(level) {
  const map = {
    a1: { label: "🌱 A1", bg: "var(--a1-light)", color: "var(--a1)" },
    a2: { label: "📗 A2", bg: "var(--a2-light)", color: "var(--a2)" },
    b1: { label: "🚀 B1", bg: "var(--b1-light)", color: "var(--b1)" },
  };
  return map[level] ?? map.a1;
}

function hitungKata(teks) {
  return teks.split(/\s+/).length;
}

export default function ReadingPage() {
  const [bacaanAktif, setBacaanAktif] = useState(null);
  const [modeSoal, setModeSoal] = useState(false);
  const [indexSoal, setIndexSoal] = useState(0);
  const [dipilih, setDipilih] = useState(null);
  const [skor, setSkor] = useState(0);
  const [selesai, setSelesai] = useState(false);
  const [sedangDibaca, setSedangDibaca] = useState(false);

  const { config } = useLevel();
  const { recordQuiz } = useProgress();
  const { bunyiBenar, bunyiSalah, bunyiSelesai } = useSound();

  // Filter bacaan sesuai level: A1 → a1, A2 → a1+a2, B1 → semua
  const bacaanTersedia = config
    ? config.vocabLevel === "a1"
      ? bacaan.filter((b) => b.level === "a1")
      : config.vocabLevel === "a2"
      ? bacaan.filter((b) => b.level === "a1" || b.level === "a2")
      : bacaan
    : bacaan;

  // TTS — bacakan seluruh teks
  function bacakanTeks(teks) {
    window.speechSynthesis.cancel();
    if (sedangDibaca) { setSedangDibaca(false); return; }
    const ucapan = new SpeechSynthesisUtterance(teks);
    ucapan.lang = "en-US";
    ucapan.rate = 0.85;
    setSedangDibaca(true);
    ucapan.onend = () => setSedangDibaca(false);
    ucapan.onerror = () => setSedangDibaca(false);
    window.speechSynthesis.speak(ucapan);
  }

  function bukaBacaan(b) {
    window.speechSynthesis.cancel();
    setSedangDibaca(false);
    setBacaanAktif(b);
    setModeSoal(false);
    setIndexSoal(0);
    setDipilih(null);
    setSkor(0);
    setSelesai(false);
  }

  function jawab(idx) {
    if (dipilih !== null) return;
    setDipilih(idx);
    const benar = idx === bacaanAktif.soal[indexSoal].jawaban;
    if (benar) { setSkor((s) => s + 1); bunyiBenar(); }
    else { bunyiSalah(); }
  }

  function lanjut() {
    if (indexSoal + 1 >= bacaanAktif.soal.length) {
      setSelesai(true);
      bunyiSelesai();
      recordQuiz("reading", skor, bacaanAktif.soal.length);
    } else {
      setIndexSoal((i) => i + 1);
      setDipilih(null);
    }
  }

  function kembaliKeDaftar() {
    window.speechSynthesis.cancel();
    setSedangDibaca(false);
    setBacaanAktif(null);
    setModeSoal(false);
  }

  // ─── Header bersama ─────────────────────────────────────────────────────────
  function Header({ subtitle }) {
    return (
      <header
        className="sticky top-0 z-10"
        style={{ backgroundColor: "var(--bg-paper)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-4">
          {bacaanAktif ? (
            <button onClick={kembaliKeDaftar} className="text-2xl hover:opacity-70 transition" style={{ color: "var(--brand)" }}>←</button>
          ) : (
            <Link href="/" className="text-2xl hover:opacity-70 transition" style={{ color: "var(--brand)" }}>←</Link>
          )}
          <div>
            <h1 className="font-serif text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
              📰 Reading
            </h1>
            <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>{subtitle}</p>
          </div>
        </div>
      </header>
    );
  }

  // ─── Tampilan: hasil akhir ──────────────────────────────────────────────────
  if (bacaanAktif && selesai) {
    const total = bacaanAktif.soal.length;
    const persen = Math.round((skor / total) * 100);
    const scoreColor = persen >= 75 ? "#059669" : persen >= 50 ? "#D97706" : "#DC2626";

    return (
      <main className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-base)" }}>
        <Header subtitle={bacaanAktif.judul} />
        <div className="flex-1 flex items-center justify-center px-5 py-10">
          <div className="card-de p-8 max-w-md w-full text-center" style={{ position: "relative", overflow: "hidden" }}>
            <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: scoreColor }} />
            <div className="text-6xl mb-3">{persen >= 75 ? "🏆" : persen >= 50 ? "⭐" : "📖"}</div>
            <h2 className="font-serif text-2xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              Selesai!
            </h2>
            <p className="font-serif text-4xl font-semibold my-3" style={{ color: scoreColor }}>{persen}%</p>
            <p className="font-sans text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              Kamu menjawab benar <strong style={{ color: "var(--text-primary)" }}>{skor}</strong> dari{" "}
              <strong style={{ color: "var(--text-primary)" }}>{total}</strong> pertanyaan
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => bukaBacaan(bacaanAktif)}
                className="btn-primary w-full py-3 rounded-xl font-bold justify-center"
                style={{ backgroundColor: ACCENT }}
              >
                📖 Baca Ulang
              </button>
              <button
                onClick={kembaliKeDaftar}
                className="w-full py-3 rounded-xl font-sans font-semibold transition"
                style={{ backgroundColor: "var(--bg-subtle)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
              >
                ← Pilih Bacaan Lain
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ─── Tampilan: soal pemahaman ───────────────────────────────────────────────
  if (bacaanAktif && modeSoal) {
    const soal = bacaanAktif.soal[indexSoal];
    const total = bacaanAktif.soal.length;

    return (
      <main className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
        <Header subtitle={`Soal ${indexSoal + 1} dari ${total}`} />
        <div className="max-w-2xl mx-auto px-5 py-6">
          {/* Progress bar */}
          <div className="w-full h-2 rounded-full mb-5 overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(indexSoal / total) * 100}%`, backgroundColor: ACCENT }}
            />
          </div>

          {/* Teks bacaan (bisa dibuka-tutup untuk dilihat lagi) */}
          <details className="card-de mb-5 overflow-hidden">
            <summary
              className="px-5 py-3 cursor-pointer font-sans text-sm font-semibold"
              style={{ color: "var(--brand)" }}
            >
              📄 Lihat teks bacaan lagi
            </summary>
            <p
              className="px-5 pb-5 font-sans text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {bacaanAktif.teks}
            </p>
          </details>

          {/* Kartu soal */}
          <div className="card-de p-5 mb-5" style={{ position: "relative", overflow: "hidden" }}>
            <div className="absolute inset-y-0 left-0 w-[3px]" style={{ backgroundColor: ACCENT }} />
            <div className="pl-3">
              <p className="font-sans text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--text-muted)" }}>
                Pertanyaan {indexSoal + 1}
              </p>
              <h2 className="font-serif text-lg font-semibold leading-relaxed" style={{ color: "var(--text-primary)" }}>
                {soal.pertanyaan}
              </h2>
            </div>
          </div>

          {/* Pilihan jawaban */}
          <div className="flex flex-col gap-3 mb-4">
            {soal.pilihan.map((p, idx) => {
              let cardStyle = { backgroundColor: "var(--bg-paper)", border: "2px solid var(--border)", color: "var(--text-primary)" };
              if (dipilih !== null) {
                if (idx === soal.jawaban) cardStyle = { backgroundColor: "#D1FAE5", border: "2px solid #059669", color: "#065F46" };
                else if (idx === dipilih) cardStyle = { backgroundColor: "#FEE2E2", border: "2px solid #DC2626", color: "#7F1D1D" };
                else cardStyle = { backgroundColor: "var(--bg-subtle)", border: "2px solid var(--border)", color: "var(--text-muted)", opacity: 0.5 };
              }
              return (
                <button
                  key={idx}
                  onClick={() => jawab(idx)}
                  disabled={dipilih !== null}
                  className="w-full text-left px-4 py-3.5 rounded-xl font-sans font-medium transition-all"
                  style={cardStyle}
                >
                  <span className="font-bold mr-2" style={{ color: dipilih === null ? ACCENT : "inherit" }}>
                    {["A", "B", "C", "D"][idx]}.
                  </span>
                  {p}
                  {dipilih !== null && idx === soal.jawaban && <span className="float-right font-bold" style={{ color: "#059669" }}>✓</span>}
                  {dipilih !== null && idx === dipilih && idx !== soal.jawaban && <span className="float-right font-bold" style={{ color: "#DC2626" }}>✗</span>}
                </button>
              );
            })}
          </div>

          {dipilih !== null && (
            <button
              onClick={lanjut}
              className="btn-primary w-full py-4 rounded-xl font-bold text-base justify-center"
              style={{ backgroundColor: ACCENT }}
            >
              {indexSoal + 1 >= total ? "Lihat Hasil →" : "Pertanyaan Berikutnya →"}
            </button>
          )}
        </div>
      </main>
    );
  }

  // ─── Tampilan: baca teks ────────────────────────────────────────────────────
  if (bacaanAktif) {
    const badge = levelBadge(bacaanAktif.level);

    return (
      <main className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
        <Header subtitle={`${hitungKata(bacaanAktif.teks)} kata · ${bacaanAktif.soal.length} pertanyaan`} />
        <div className="max-w-2xl mx-auto px-5 py-6">
          {/* Kartu bacaan */}
          <article className="card-de p-7 mb-5" style={{ position: "relative", overflow: "hidden" }}>
            <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: ACCENT }} />

            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{bacaanAktif.emoji}</span>
                <div>
                  <h2 className="font-serif text-2xl font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
                    {bacaanAktif.judul}
                  </h2>
                  <span
                    className="inline-block font-sans text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1"
                    style={{ backgroundColor: badge.bg, color: badge.color }}
                  >
                    {badge.label}
                  </span>
                </div>
              </div>
              {/* Tombol dengarkan */}
              <button
                onClick={() => bacakanTeks(bacaanAktif.teks)}
                className="w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0 transition"
                style={
                  sedangDibaca
                    ? { backgroundColor: ACCENT, color: "white" }
                    : { backgroundColor: "var(--brand-light)", color: "var(--brand)" }
                }
                title="Dengarkan teks"
              >
                {sedangDibaca ? "⏹" : "🔊"}
              </button>
            </div>

            {/* Isi teks */}
            <p
              className="font-sans text-base leading-loose"
              style={{ color: "var(--text-secondary)" }}
            >
              {bacaanAktif.teks}
            </p>
          </article>

          {/* Tips */}
          <div
            className="rounded-xl p-4 mb-5 font-sans text-sm"
            style={{ backgroundColor: "var(--gold-light)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
          >
            💡 <strong style={{ color: "var(--gold)" }}>Tips:</strong> Baca teksnya pelan-pelan. Tidak perlu mengerti semua kata — coba pahami ide utamanya dulu.
          </div>

          {/* Tombol mulai soal */}
          <button
            onClick={() => setModeSoal(true)}
            className="btn-primary w-full py-4 rounded-xl font-bold text-base justify-center"
            style={{ backgroundColor: ACCENT }}
          >
            ✅ Saya Sudah Selesai Membaca — Jawab Pertanyaan
          </button>
        </div>
      </main>
    );
  }

  // ─── Tampilan: daftar bacaan ────────────────────────────────────────────────
  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      <Header
        subtitle={
          `${bacaanTersedia.length} bacaan` +
          (config ? ` · ${config.emoji} ${config.label}` : "")
        }
      />
      <div className="max-w-2xl mx-auto px-5 py-8">
        <div className="text-center mb-7">
          <h2 className="font-serif text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            Pilih Bacaan
          </h2>
          <p className="font-sans text-sm" style={{ color: "var(--text-secondary)" }}>
            Baca teks bahasa Inggris, lalu uji pemahamanmu dengan pertanyaan 👇
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {bacaanTersedia.map((b) => {
            const badge = levelBadge(b.level);
            return (
              <button
                key={b.id}
                onClick={() => bukaBacaan(b)}
                className="card-de relative overflow-hidden text-left w-full group"
              >
                <div className="absolute inset-y-0 left-0 w-[3px]" style={{ backgroundColor: ACCENT }} />
                <div className="pl-6 pr-5 py-5 flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: "#E0F2FE", border: "1px solid var(--border)" }}
                  >
                    {b.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-semibold text-base leading-snug" style={{ color: "var(--text-primary)" }}>
                      {b.judul}
                    </h3>
                    <p className="font-sans text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                      {hitungKata(b.teks)} kata · {b.soal.length} pertanyaan
                    </p>
                  </div>
                  <span
                    className="font-sans text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: badge.bg, color: badge.color }}
                  >
                    {badge.label}
                  </span>
                  <span className="text-xl flex-shrink-0" style={{ color: "var(--text-muted)" }}>›</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
