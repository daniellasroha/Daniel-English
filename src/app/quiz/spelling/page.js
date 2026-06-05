// Quiz Spelling — ketik jawaban sendiri
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { kosakata } from "@/data/vocabulary";
import { useProgress } from "@/hooks/useProgress";
import { useSound } from "@/hooks/useSound";

const ACCENT = "#0D9488";

function acakKata(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export default function SpellingQuizPage() {
  const [mulai, setMulai] = useState(false);
  const [soalList, setSoalList] = useState([]);
  const [index, setIndex] = useState(0);
  const [jawaban, setJawaban] = useState("");
  const [hasil, setHasil] = useState(null);
  const [skor, setSkor] = useState(0);
  const [selesai, setSelesai] = useState(false);
  const [riwayat, setRiwayat] = useState([]);
  const inputRef = useRef(null);

  const { recordQuiz } = useProgress();
  const { bunyiBenar, bunyiSalah, bunyiSelesai } = useSound();

  function mulaiQuiz() {
    const list = acakKata(kosakata, 15);
    setSoalList(list);
    setIndex(0);
    setJawaban("");
    setHasil(null);
    setSkor(0);
    setSelesai(false);
    setRiwayat([]);
    setMulai(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function cekJawaban() {
    if (!jawaban.trim() || hasil) return;
    const soal = soalList[index];
    const benar = jawaban.trim().toLowerCase() === soal.english.toLowerCase();
    setHasil(benar ? "benar" : "salah");
    if (benar) { setSkor((s) => s + 1); bunyiBenar(); }
    else { bunyiSalah(); }
    setRiwayat((prev) => [...prev, {
      indonesian: soal.indonesian,
      english: soal.english,
      jawaban: jawaban.trim(),
      benar,
    }]);
  }

  function lanjut() {
    if (index + 1 >= soalList.length) {
      setSelesai(true);
      recordQuiz("spelling", skor + (hasil === "benar" ? 1 : 0), soalList.length);
      bunyiSelesai();
    } else {
      setIndex((i) => i + 1);
      setJawaban("");
      setHasil(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter") {
      if (!hasil) cekJawaban();
      else lanjut();
    }
  }

  // ─── Header bersama ───────────────────────────────────────────────────────
  function Header({ children }) {
    return (
      <header
        className="sticky top-0 z-10"
        style={{ backgroundColor: "var(--bg-paper)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-xl mx-auto px-5 py-4 flex items-center gap-4">
          <Link href="/quiz" className="text-2xl transition-opacity hover:opacity-70" style={{ color: "var(--brand)" }}>←</Link>
          {children}
        </div>
      </header>
    );
  }

  // ─── Layar awal ───────────────────────────────────────────────────────────
  if (!mulai) {
    return (
      <main className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-base)" }}>
        <Header>
          <h1 className="font-serif text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
            ⌨️ Spelling Quiz
          </h1>
        </Header>

        <div className="flex-1 flex items-center justify-center px-5 py-10">
          <div className="card-de p-8 max-w-md w-full text-center" style={{ position: "relative", overflow: "hidden" }}>
            <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: ACCENT }} />

            <div className="text-6xl mb-4">⌨️</div>
            <h2 className="font-serif text-2xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
              Spelling Quiz
            </h2>
            <p className="font-sans text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
              Kamu akan diberikan arti kata dalam bahasa Indonesia.
            </p>
            <p className="font-sans text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              Tulis terjemahannya dalam bahasa Inggris dengan benar!
            </p>

            <div
              className="rounded-xl p-4 mb-6 text-left font-sans text-sm space-y-1"
              style={{ backgroundColor: "var(--bg-subtle)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            >
              <p>✅ 15 kata acak dari vocabulary</p>
              <p>⌨️ Ketik jawaban dengan keyboard</p>
              <p>🔡 Tidak case-sensitive (huruf besar/kecil)</p>
              <p>⏎ Tekan Enter untuk cek / lanjut</p>
            </div>

            <button
              onClick={mulaiQuiz}
              className="btn-primary w-full py-4 rounded-xl font-bold text-base justify-center"
              style={{ backgroundColor: ACCENT }}
            >
              Mulai Quiz ⌨️
            </button>
          </div>
        </div>
      </main>
    );
  }

  const soal = soalList[index];
  const total = soalList.length;

  // ─── Layar hasil ──────────────────────────────────────────────────────────
  if (selesai) {
    const persen = Math.round((skor / total) * 100);
    const huruf = persen >= 90 ? "A" : persen >= 75 ? "B" : persen >= 60 ? "C" : persen >= 50 ? "D" : "E";

    return (
      <main className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-base)" }}>
        <Header>
          <h1 className="font-serif text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
            ⌨️ Spelling Quiz
          </h1>
        </Header>

        <div className="flex-1 flex items-center justify-center px-5 py-10">
          <div className="card-de p-8 max-w-md w-full text-center" style={{ position: "relative", overflow: "hidden" }}>
            <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: ACCENT }} />

            <div className="text-6xl mb-3">{persen >= 75 ? "🏆" : "📖"}</div>
            <h2 className="font-serif text-2xl font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Selesai!</h2>

            <div
              className="w-28 h-28 rounded-full flex flex-col items-center justify-center mx-auto mb-4 shadow-lg"
              style={{ backgroundColor: ACCENT }}
            >
              <span className="text-3xl font-extrabold text-white">{huruf}</span>
              <span className="text-white text-sm font-semibold">{persen}%</span>
            </div>

            <p className="font-sans text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
              Benar: <strong style={{ color: "var(--text-primary)" }}>{skor}</strong> dari{" "}
              <strong style={{ color: "var(--text-primary)" }}>{total}</strong> kata
            </p>

            {/* Review jawaban */}
            <div
              className="text-left max-h-48 overflow-y-auto mb-5 rounded-xl p-3"
              style={{ backgroundColor: "var(--bg-subtle)", border: "1px solid var(--border)" }}
            >
              {riwayat.map((r, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 font-sans text-xs py-1.5"
                  style={{ borderBottom: i < riwayat.length - 1 ? "1px solid var(--border)" : "none" }}
                >
                  <span>{r.benar ? "✅" : "❌"}</span>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>{r.indonesian} → </span>
                    <span
                      className="font-bold"
                      style={{ color: r.benar ? "#059669" : "#DC2626", textDecoration: r.benar ? "none" : "line-through" }}
                    >
                      {r.jawaban}
                    </span>
                    {!r.benar && (
                      <span className="font-bold ml-1" style={{ color: "#059669" }}>
                        ({r.english})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={mulaiQuiz}
                className="flex-1 py-3 rounded-xl font-sans font-bold text-white hover:opacity-90 transition"
                style={{ backgroundColor: ACCENT }}
              >
                🔄 Ulangi
              </button>
              <Link href="/quiz" className="flex-1">
                <button
                  className="w-full py-3 rounded-xl font-sans font-semibold transition"
                  style={{ backgroundColor: "var(--bg-subtle)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                >
                  ← Kuis Lain
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ─── Layar soal ───────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      <header
        className="sticky top-0 z-10"
        style={{ backgroundColor: "var(--bg-paper)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-xl mx-auto px-5 py-4 flex items-center gap-4">
          <Link href="/quiz" className="text-2xl transition-opacity hover:opacity-70" style={{ color: "var(--brand)" }}>←</Link>
          <div className="flex-1">
            <h1 className="font-serif text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              ⌨️ Spelling Quiz
            </h1>
            <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
              Soal {index + 1} dari {total}
            </p>
          </div>
          <div
            className="px-3 py-1 rounded-full font-sans text-sm font-bold"
            style={{ backgroundColor: "var(--bg-subtle)", color: ACCENT, border: `1px solid ${ACCENT}30` }}
          >
            ⭐ {skor} poin
          </div>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-5 py-6">
        {/* Progress bar */}
        <div className="w-full h-2 rounded-full mb-6 overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(index / total) * 100}%`, backgroundColor: ACCENT }}
          />
        </div>

        {/* Kartu soal */}
        <div className="card-de p-8 mb-5 text-center" style={{ position: "relative", overflow: "hidden" }}>
          <div className="absolute inset-y-0 left-0 w-[3px]" style={{ backgroundColor: ACCENT }} />
          <p
            className="font-sans text-xs font-semibold uppercase tracking-wide mb-3"
            style={{ color: ACCENT }}
          >
            Tulis dalam bahasa Inggris
          </p>
          <div className="text-5xl mb-3">{soal.emoji}</div>
          <h2 className="font-serif text-3xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
            {soal.indonesian}
          </h2>
          <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
            Kategori: {soal.kategori}
          </p>
        </div>

        {/* Input jawaban */}
        <input
          ref={inputRef}
          type="text"
          value={jawaban}
          onChange={(e) => setJawaban(e.target.value)}
          onKeyDown={handleKey}
          disabled={!!hasil}
          placeholder="Ketik jawabanmu di sini..."
          className="w-full px-5 py-4 rounded-xl font-sans font-bold text-xl text-center focus:outline-none transition mb-4"
          style={
            hasil === "benar"
              ? { border: "2px solid #059669", backgroundColor: "#D1FAE5", color: "#065F46" }
              : hasil === "salah"
              ? { border: "2px solid #DC2626", backgroundColor: "#FEE2E2", color: "#7F1D1D" }
              : {
                  border: `2px solid var(--border)`,
                  backgroundColor: "var(--bg-paper)",
                  color: "var(--text-primary)",
                }
          }
        />

        {/* Feedback */}
        {hasil && (
          <div
            className="p-4 rounded-xl mb-4 text-center font-sans font-semibold text-sm"
            style={
              hasil === "benar"
                ? { backgroundColor: "#D1FAE5", color: "#065F46" }
                : { backgroundColor: "#FEE2E2", color: "#DC2626" }
            }
          >
            {hasil === "benar"
              ? "🎉 Benar! Kamu hebat!"
              : `❌ Salah. Jawaban yang benar: "${soal.english}"`}
            <p className="font-normal text-xs mt-1 italic" style={{ opacity: 0.8 }}>
              {soal.contoh}
            </p>
          </div>
        )}

        {!hasil ? (
          <button
            onClick={cekJawaban}
            disabled={!jawaban.trim()}
            className="w-full py-4 rounded-xl font-sans font-bold text-base text-white transition"
            style={{
              backgroundColor: jawaban.trim() ? ACCENT : "var(--border-strong)",
              opacity: jawaban.trim() ? 1 : 0.5,
              cursor: jawaban.trim() ? "pointer" : "not-allowed",
            }}
          >
            Cek Jawaban ✓
          </button>
        ) : (
          <button
            onClick={lanjut}
            className="btn-primary w-full py-4 rounded-xl font-bold text-base justify-center"
            style={{ backgroundColor: ACCENT }}
          >
            {index + 1 >= total ? "Lihat Hasil →" : "Lanjut →"}
          </button>
        )}
      </div>
    </main>
  );
}
