// Halaman Speaking — latihan pengucapan dengan Web Speech API (speech recognition)
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { kosakata } from "@/data/vocabulary";
import { useLevel } from "@/hooks/useLevel";
import { useProgress } from "@/hooks/useProgress";
import { useSound } from "@/hooks/useSound";
import { speak } from "@/lib/speech";

const ACCENT = "#DC2626";
const JUMLAH_SOAL = 10;

// Normalisasi untuk perbandingan: lowercase, hapus tanda baca
function normalize(str) {
  return str.toLowerCase().replace(/[.,!?'"]/g, "").trim();
}

function acakKata(arr, n) {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

export default function SpeakingPage() {
  const [didukung, setDidukung] = useState(null); // null = belum dicek
  const [mulai, setMulai] = useState(false);
  const [soalList, setSoalList] = useState([]);
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | listening | benar | salah | error
  const [transcript, setTranscript] = useState("");
  const [skor, setSkor] = useState(0);
  const [sudahBenar, setSudahBenar] = useState(false); // item ini sudah dijawab benar
  const [selesai, setSelesai] = useState(false);
  const recRef = useRef(null);

  const { config } = useLevel();
  const { recordQuiz } = useProgress();
  const { bunyiBenar, bunyiSalah, bunyiSelesai } = useSound();

  // Cek dukungan browser sekali di client
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setDidukung(!!SR);
  }, []);

  // Kata sesuai level — hanya kata sederhana (tanpa simbol)
  const kataTersedia = (config
    ? config.vocabLevel === "a1"
      ? kosakata.filter((k) => k.level === "a1")
      : config.vocabLevel === "a2"
      ? kosakata.filter((k) => k.level === "a1" || k.level === "a2")
      : kosakata
    : kosakata
  ).filter((k) => !k.english.includes("/"));

  function mulaiLatihan() {
    setSoalList(acakKata(kataTersedia, JUMLAH_SOAL));
    setIndex(0);
    setStatus("idle");
    setTranscript("");
    setSkor(0);
    setSudahBenar(false);
    setSelesai(false);
    setMulai(true);
  }

  function dengarkan() {
    const soal = soalList[index];
    if (!soal || status === "listening") return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    recRef.current = rec;
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 5;

    rec.onresult = (e) => {
      const alternatif = [...e.results[0]].map((a) => a.transcript);
      const target = normalize(soal.english);
      // Benar jika salah satu alternatif sama persis ATAU mengandung kata target
      const cocok = alternatif.some((t) => {
        const n = normalize(t);
        return n === target || n.includes(target) || target.includes(n);
      });
      setTranscript(alternatif[0]);
      if (cocok) {
        setStatus("benar");
        if (!sudahBenar) { setSkor((s) => s + 1); setSudahBenar(true); }
        bunyiBenar();
      } else {
        setStatus("salah");
        bunyiSalah();
      }
    };
    rec.onerror = (e) => {
      setStatus("error");
      setTranscript(e.error === "not-allowed" ? "izin-mikrofon" : e.error);
    };
    rec.onend = () => {
      // Jika berhenti tanpa hasil (diam), kembali ke idle
      setStatus((s) => (s === "listening" ? "idle" : s));
    };

    setStatus("listening");
    setTranscript("");
    rec.start();
  }

  function lanjut() {
    recRef.current?.abort?.();
    if (index + 1 >= soalList.length) {
      setSelesai(true);
      bunyiSelesai();
      recordQuiz("speaking", skor, soalList.length);
    } else {
      setIndex((i) => i + 1);
      setStatus("idle");
      setTranscript("");
      setSudahBenar(false);
    }
  }

  // ─── Header bersama ─────────────────────────────────────────────────────────
  function Header({ subtitle }) {
    return (
      <header className="sticky top-0 z-10" style={{ backgroundColor: "var(--bg-paper)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-xl mx-auto px-5 py-4 flex items-center gap-4">
          <Link href="/" className="text-2xl transition-opacity hover:opacity-70" style={{ color: "var(--brand)" }}>←</Link>
          <div>
            <h1 className="font-serif text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
              🎤 Speaking
            </h1>
            <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>{subtitle}</p>
          </div>
        </div>
      </header>
    );
  }

  // ─── Browser tidak mendukung ────────────────────────────────────────────────
  if (didukung === false) {
    return (
      <main className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-base)" }}>
        <Header subtitle="Latihan pengucapan" />
        <div className="flex-1 flex items-center justify-center px-5 py-10">
          <div className="card-de p-8 max-w-sm w-full text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="font-serif text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
              Browser Tidak Mendukung
            </h2>
            <p className="font-sans text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              Fitur pengenalan suara butuh browser <strong>Chrome</strong> atau <strong>Edge</strong>. Silakan buka aplikasi ini di salah satu browser tersebut.
            </p>
            <Link href="/">
              <button className="btn-primary w-full py-3 rounded-xl font-bold justify-center">
                ← Kembali ke Beranda
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ─── Layar awal ─────────────────────────────────────────────────────────────
  if (!mulai) {
    return (
      <main className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-base)" }}>
        <Header subtitle="Latihan pengucapan" />
        <div className="flex-1 flex items-center justify-center px-5 py-10">
          <div className="card-de p-8 max-w-sm w-full text-center" style={{ position: "relative", overflow: "hidden" }}>
            <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: ACCENT }} />
            <div className="text-6xl mb-4">🎤</div>
            <h2 className="font-serif text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Latihan Pengucapan
            </h2>
            <p className="font-sans text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              Ucapkan kata bahasa Inggris dengan lantang — aplikasi akan menilai apakah pengucapanmu dikenali!
            </p>

            <div
              className="rounded-xl p-4 mb-6 text-left font-sans text-sm space-y-1"
              style={{ backgroundColor: "var(--bg-subtle)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            >
              <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>ℹ️ Cara berlatih:</p>
              <p>1️⃣ Dengar contoh pengucapan (🔊)</p>
              <p>2️⃣ Tap tombol mikrofon 🎤</p>
              <p>3️⃣ Ucapkan katanya dengan jelas</p>
              <p>4️⃣ Lihat hasilnya — boleh coba berulang kali!</p>
            </div>

            <p className="font-sans text-xs mb-5" style={{ color: "var(--text-muted)" }}>
              {JUMLAH_SOAL} kata acak
              {config && ` · level ${config.emoji} ${config.label}`} · butuh izin mikrofon
            </p>

            <button
              onClick={mulaiLatihan}
              className="btn-primary w-full py-4 rounded-xl font-bold text-base justify-center"
              style={{ backgroundColor: ACCENT }}
            >
              Mulai Latihan 🎤
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ─── Layar hasil ────────────────────────────────────────────────────────────
  if (selesai) {
    const total = soalList.length;
    const persen = Math.round((skor / total) * 100);
    const scoreColor = persen >= 75 ? "#059669" : persen >= 50 ? "#D97706" : ACCENT;

    return (
      <main className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-base)" }}>
        <Header subtitle="Hasil latihan" />
        <div className="flex-1 flex items-center justify-center px-5 py-10">
          <div className="card-de p-8 max-w-sm w-full text-center" style={{ position: "relative", overflow: "hidden" }}>
            <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: scoreColor }} />
            <div className="text-6xl mb-3">{persen >= 75 ? "🏆" : persen >= 50 ? "⭐" : "💪"}</div>
            <h2 className="font-serif text-2xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              Latihan Selesai!
            </h2>
            <p className="font-serif text-4xl font-semibold my-3" style={{ color: scoreColor }}>{persen}%</p>
            <p className="font-sans text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              <strong style={{ color: "var(--text-primary)" }}>{skor}</strong> dari{" "}
              <strong style={{ color: "var(--text-primary)" }}>{total}</strong> kata diucapkan dengan benar
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={mulaiLatihan}
                className="btn-primary w-full py-3 rounded-xl font-bold justify-center"
                style={{ backgroundColor: ACCENT }}
              >
                🔄 Latihan Lagi
              </button>
              <Link href="/">
                <button
                  className="w-full py-3 rounded-xl font-sans font-semibold transition"
                  style={{ backgroundColor: "var(--bg-subtle)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                >
                  ← Kembali ke Beranda
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ─── Layar latihan ──────────────────────────────────────────────────────────
  const soal = soalList[index];
  const total = soalList.length;

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      <header className="sticky top-0 z-10" style={{ backgroundColor: "var(--bg-paper)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-xl mx-auto px-5 py-4 flex items-center gap-4">
          <Link href="/" className="text-2xl transition-opacity hover:opacity-70" style={{ color: "var(--brand)" }}>←</Link>
          <div className="flex-1">
            <h1 className="font-serif text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              🎤 Speaking
            </h1>
            <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
              Kata {index + 1} dari {total}
            </p>
          </div>
          <div
            className="px-3 py-1 rounded-full font-sans text-sm font-bold"
            style={{ backgroundColor: "#FEE2E2", color: ACCENT }}
          >
            ⭐ {skor}
          </div>
        </div>
        {/* Progress bar */}
        <div className="max-w-xl mx-auto px-5 pb-3">
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(index / total) * 100}%`, backgroundColor: ACCENT }}
            />
          </div>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-5 py-8">
        {/* Kartu kata target */}
        <div className="card-de p-8 mb-6 text-center" style={{ position: "relative", overflow: "hidden" }}>
          <div className="absolute inset-y-0 left-0 w-[3px]" style={{ backgroundColor: ACCENT }} />
          <p className="font-sans text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: ACCENT }}>
            Ucapkan kata ini
          </p>
          <div className="text-5xl mb-3">{soal.emoji}</div>
          <h2 className="font-serif text-4xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
            {soal.english}
          </h2>
          <p className="font-sans text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            {soal.indonesian}
          </p>
          <button
            onClick={() => speak(soal.english)}
            className="font-sans text-sm px-4 py-2 rounded-full transition hover:opacity-80"
            style={{ backgroundColor: "var(--brand-light)", color: "var(--brand)", border: "1px solid var(--border)" }}
          >
            🔊 Dengar contoh
          </button>
        </div>

        {/* Tombol mikrofon besar */}
        <div className="text-center mb-6">
          <button
            onClick={dengarkan}
            disabled={status === "listening"}
            className="w-24 h-24 rounded-full text-4xl text-white shadow-lg transition-transform hover:scale-110"
            style={{
              backgroundColor: status === "listening" ? "#F59E0B" : ACCENT,
              animation: status === "listening" ? "pulse 1s infinite" : "none",
            }}
          >
            {status === "listening" ? "👂" : "🎤"}
          </button>
          <p className="font-sans text-sm mt-3" style={{ color: "var(--text-muted)" }}>
            {status === "listening" ? "Mendengarkan... ucapkan sekarang!" : "Tap mikrofon, lalu ucapkan katanya"}
          </p>
        </div>

        {/* Hasil */}
        {status === "benar" && (
          <div className="rounded-xl p-4 mb-4 text-center font-sans" style={{ backgroundColor: "#D1FAE5", border: "2px solid #059669" }}>
            <p className="font-bold text-base" style={{ color: "#065F46" }}>🎉 Sempurna! Pengucapanmu dikenali!</p>
            <p className="text-xs mt-1" style={{ color: "#065F46", opacity: 0.8 }}>
              Terdengar: &ldquo;{transcript}&rdquo;
            </p>
          </div>
        )}
        {status === "salah" && (
          <div className="rounded-xl p-4 mb-4 text-center font-sans" style={{ backgroundColor: "#FEF3C7", border: "2px solid #D97706" }}>
            <p className="font-bold text-base" style={{ color: "#92400E" }}>🤔 Hmm, terdengar seperti: &ldquo;{transcript}&rdquo;</p>
            <p className="text-xs mt-1" style={{ color: "#92400E", opacity: 0.9 }}>
              Dengar contohnya lagi (🔊), lalu coba ucapkan sekali lagi!
            </p>
          </div>
        )}
        {status === "error" && (
          <div className="rounded-xl p-4 mb-4 text-center font-sans" style={{ backgroundColor: "#FEE2E2", border: "2px solid #DC2626" }}>
            <p className="font-bold text-sm" style={{ color: "#7F1D1D" }}>
              {transcript === "izin-mikrofon"
                ? "⚠️ Izin mikrofon ditolak. Izinkan akses mikrofon di pengaturan browser."
                : "⚠️ Mikrofon bermasalah. Coba lagi."}
            </p>
          </div>
        )}

        {/* Tombol lanjut — muncul setelah ada percobaan */}
        {(status === "benar" || status === "salah") && (
          <button
            onClick={lanjut}
            className="btn-primary w-full py-4 rounded-xl font-bold text-base justify-center"
            style={{ backgroundColor: status === "benar" ? "#059669" : ACCENT }}
          >
            {index + 1 >= total ? "Lihat Hasil →" : "Kata Berikutnya →"}
          </button>
        )}

        {/* Lewati */}
        {status === "idle" && index > 0 && (
          <button
            onClick={lanjut}
            className="w-full py-3 rounded-xl font-sans text-sm transition"
            style={{ backgroundColor: "var(--bg-subtle)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
          >
            Lewati kata ini →
          </button>
        )}
      </div>
    </main>
  );
}
