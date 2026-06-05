// Komponen QuizEngine — mesin kuis yang dipakai ulang untuk semua kategori
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { useSound } from "@/hooks/useSound";

const WAKTU_TIMER = 15;

function acakSoal(arr, max) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return max && max < copy.length ? copy.slice(0, max) : copy;
}

export default function QuizEngine({ judul, emoji, soalList, accentColor = "var(--brand)", kategori, pakaiTimer = false, maxSoal }) {
  const { recordQuiz } = useProgress();
  const { bunyiBenar, bunyiSalah, bunyiSelesai } = useSound();

  const [soalAcak, setSoalAcak] = useState(() => acakSoal(soalList, maxSoal));
  const [soalAktif, setSoalAktif] = useState(0);
  const [pilihanDipilih, setPilihanDipilih] = useState(null);
  const [sudahDijawab, setSudahDijawab] = useState(false);
  const [skor, setSkor] = useState(0);
  const [selesai, setSelesai] = useState(false);
  const [riwayat, setRiwayat] = useState([]);
  const [waktuSisa, setWaktuSisa] = useState(WAKTU_TIMER);
  const [habisWaktu, setHabisWaktu] = useState(false);
  const timerRef = useRef(null);

  const soal = soalAcak[soalAktif];
  const totalSoal = soalAcak.length;

  useEffect(() => {
    if (!pakaiTimer || sudahDijawab || selesai) return;
    setWaktuSisa(WAKTU_TIMER);
    setHabisWaktu(false);

    timerRef.current = setInterval(() => {
      setWaktuSisa((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setHabisWaktu(true);
          setSudahDijawab(true);
          setPilihanDipilih(null);
          bunyiSalah();
          setRiwayat((r) => [...r, { benar: false, soal: soalAcak[soalAktif]?.pertanyaan }]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [soalAktif, pakaiTimer, selesai]);

  useEffect(() => {
    if (sudahDijawab) clearInterval(timerRef.current);
  }, [sudahDijawab]);

  function pilihJawaban(index) {
    if (sudahDijawab) return;
    clearInterval(timerRef.current);
    setPilihanDipilih(index);
    setSudahDijawab(true);
    const benar = index === soal.jawaban;
    if (benar) { setSkor((s) => s + 1); bunyiBenar(); }
    else { bunyiSalah(); }
    setRiwayat((prev) => [...prev, { benar, soal: soal.pertanyaan }]);
  }

  function soalBerikutnya() {
    if (soalAktif + 1 >= totalSoal) {
      setSelesai(true);
      bunyiSelesai();
      const skorFinal = skor + (pilihanDipilih === soal?.jawaban && !habisWaktu ? 1 : 0);
      recordQuiz(kategori || "umum", skorFinal, totalSoal);
    } else {
      setSoalAktif((s) => s + 1);
      setPilihanDipilih(null);
      setSudahDijawab(false);
      setHabisWaktu(false);
    }
  }

  function ulangi() {
    clearInterval(timerRef.current);
    setSoalAcak(acakSoal(soalList, maxSoal));
    setSoalAktif(0); setPilihanDipilih(null);
    setSudahDijawab(false); setSkor(0);
    setSelesai(false); setRiwayat([]);
    setWaktuSisa(WAKTU_TIMER); setHabisWaktu(false);
  }

  // ─── Halaman hasil ────────────────────────────────────────────────────────
  if (selesai) {
    const persen = Math.round((skor / totalSoal) * 100);
    const nilaiHuruf = persen >= 90 ? "A" : persen >= 75 ? "B" : persen >= 60 ? "C" : persen >= 50 ? "D" : "E";
    const pesan = persen >= 90 ? "Luar biasa! Kamu sangat hebat! 🏆"
      : persen >= 75 ? "Bagus sekali! Terus berlatih! 🌟"
      : persen >= 60 ? "Cukup baik! Masih bisa lebih baik! 💪"
      : "Jangan menyerah! Pelajari lagi materinya! 📖";

    return (
      <main className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-base)" }}>
        <header
          className="sticky top-0 z-10"
          style={{ backgroundColor: "var(--bg-paper)", borderBottom: "1px solid var(--border)" }}
        >
          <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-4">
            <Link href="/quiz" className="text-2xl transition-opacity hover:opacity-70" style={{ color: "var(--brand)" }}>←</Link>
            <h1 className="font-serif text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
              {emoji} {judul}
            </h1>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-5 py-10">
          <div
            className="card-de p-8 max-w-md w-full text-center"
            style={{ position: "relative", overflow: "hidden" }}
          >
            {/* Strip aksen atas */}
            <div
              className="absolute inset-x-0 top-0 h-[3px]"
              style={{ backgroundColor: accentColor }}
            />

            <div className="text-6xl mb-3">{persen >= 75 ? "🏆" : persen >= 50 ? "⭐" : "📖"}</div>
            <h2 className="font-serif text-2xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              Kuis Selesai!
            </h2>
            <p className="font-sans text-sm mb-6" style={{ color: "var(--text-secondary)" }}>{pesan}</p>

            {/* Lingkaran nilai */}
            <div
              className="w-28 h-28 rounded-full flex flex-col items-center justify-center mx-auto mb-5 shadow-lg"
              style={{ backgroundColor: accentColor }}
            >
              <span className="text-3xl font-extrabold text-white">{nilaiHuruf}</span>
              <span className="text-white text-sm font-semibold">{persen}%</span>
            </div>

            <p className="font-sans text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
              Benar:{" "}
              <strong style={{ color: "var(--text-primary)" }}>{skor}</strong> dari{" "}
              <strong style={{ color: "var(--text-primary)" }}>{totalSoal}</strong> soal
            </p>

            {/* Review jawaban */}
            <div
              className="text-left mb-5 max-h-40 overflow-y-auto rounded-xl p-3"
              style={{ backgroundColor: "var(--bg-subtle)", border: "1px solid var(--border)" }}
            >
              {riwayat.map((r, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 font-sans text-xs py-1.5"
                  style={{
                    borderBottom: i < riwayat.length - 1 ? "1px solid var(--border)" : "none",
                    color: "var(--text-secondary)",
                  }}
                >
                  <span>{r.benar ? "✅" : "❌"}</span>
                  <span>{r.soal}</span>
                </div>
              ))}
            </div>

            {/* Tombol Share */}
            <button
              onClick={() => {
                const teks = `Aku baru selesai ${judul} di Daniel English!\nNilai: ${nilaiHuruf} (${persen}%) — ${skor}/${totalSoal} benar 🎉\nYuk belajar bareng! 📚`;
                if (navigator.share) {
                  navigator.share({ title: "Daniel English", text: teks });
                } else {
                  navigator.clipboard.writeText(teks);
                  alert("Hasil disalin ke clipboard! Paste dan bagikan ke temanmu 🎉");
                }
              }}
              className="w-full mb-3 font-sans font-semibold py-2.5 rounded-xl text-sm transition"
              style={{
                backgroundColor: "var(--bg-subtle)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              📤 Bagikan Hasil
            </button>

            <div className="flex gap-3 justify-center">
              <button
                onClick={ulangi}
                className="font-sans font-semibold px-5 py-2.5 rounded-xl text-sm transition hover:opacity-90 text-white"
                style={{ backgroundColor: accentColor }}
              >
                🔄 Ulangi
              </button>
              <Link href="/quiz">
                <button
                  className="font-sans font-semibold px-5 py-2.5 rounded-xl text-sm transition"
                  style={{
                    backgroundColor: "var(--bg-subtle)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border)",
                  }}
                >
                  ← Pilih Kuis Lain
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ─── Halaman soal ─────────────────────────────────────────────────────────
  const timerPersen = (waktuSisa / WAKTU_TIMER) * 100;
  const timerWarning = waktuSisa <= 5;

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      <header
        className="sticky top-0 z-10"
        style={{ backgroundColor: "var(--bg-paper)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-4">
          <Link href="/quiz" className="text-2xl transition-opacity hover:opacity-70" style={{ color: "var(--brand)" }}>←</Link>
          <div className="flex-1">
            <h1 className="font-serif text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              {emoji} {judul}
            </h1>
            <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
              Soal {soalAktif + 1} dari {totalSoal}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {pakaiTimer && !sudahDijawab && (
              <div
                className="px-3 py-1 rounded-full font-sans text-sm font-extrabold transition"
                style={
                  timerWarning
                    ? { backgroundColor: "#FEE2E2", color: "#DC2626" }
                    : { backgroundColor: "var(--gold-light)", color: "var(--gold)" }
                }
              >
                ⏱ {waktuSisa}s
              </div>
            )}
            <div
              className="px-3 py-1 rounded-full font-sans text-sm font-bold"
              style={{ backgroundColor: "var(--brand-light)", color: "var(--brand)" }}
            >
              ⭐ {skor} poin
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-5 py-6">
        {/* Progress bar soal */}
        <div
          className="w-full h-2 rounded-full mb-3 overflow-hidden"
          style={{ backgroundColor: "var(--border)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(soalAktif / totalSoal) * 100}%`, backgroundColor: accentColor }}
          />
        </div>

        {/* Timer bar */}
        {pakaiTimer && !sudahDijawab && (
          <div
            className="w-full h-2 rounded-full mb-5 overflow-hidden"
            style={{ backgroundColor: "var(--border)" }}
          >
            <div
              className="h-2 rounded-full transition-all duration-1000"
              style={{
                width: `${timerPersen}%`,
                backgroundColor: timerWarning ? "#DC2626" : "var(--gold)",
              }}
            />
          </div>
        )}
        {pakaiTimer && sudahDijawab && <div className="mb-5" />}

        {/* Kartu soal */}
        <div className="card-de p-5 mb-5 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 w-[3px]"
            style={{ backgroundColor: accentColor }}
          />
          <div className="pl-3">
            {soal.tag && (
              <span
                className="font-sans text-xs font-semibold px-2 py-0.5 rounded-full mb-2 inline-block"
                style={{ backgroundColor: "var(--brand-light)", color: "var(--brand)" }}
              >
                {soal.tag}
              </span>
            )}
            <p
              className="font-sans text-xs font-semibold uppercase tracking-wide mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              Soal {soalAktif + 1}
            </p>
            <h2 className="font-serif text-lg font-semibold leading-relaxed" style={{ color: "var(--text-primary)" }}>
              {soal.pertanyaan}
            </h2>
          </div>
        </div>

        {/* Pilihan jawaban */}
        <div className="flex flex-col gap-3 mb-4">
          {soal.pilihan.map((pilihan, idx) => {
            let cardStyle = {
              backgroundColor: "var(--bg-paper)",
              border: "2px solid var(--border)",
              color: "var(--text-primary)",
            };
            let labelColor = accentColor;

            if (sudahDijawab) {
              if (idx === soal.jawaban) {
                cardStyle = { backgroundColor: "#D1FAE5", border: "2px solid #059669", color: "#065F46" };
                labelColor = "#059669";
              } else if (idx === pilihanDipilih) {
                cardStyle = { backgroundColor: "#FEE2E2", border: "2px solid #DC2626", color: "#7F1D1D" };
                labelColor = "#DC2626";
              } else {
                cardStyle = { backgroundColor: "var(--bg-subtle)", border: "2px solid var(--border)", color: "var(--text-muted)", opacity: "0.6" };
              }
            }

            return (
              <button
                key={idx}
                onClick={() => pilihJawaban(idx)}
                disabled={sudahDijawab}
                className="w-full text-left px-4 py-3.5 rounded-xl font-sans font-medium transition-all"
                style={cardStyle}
              >
                <span className="font-bold mr-2" style={{ color: labelColor }}>
                  {["A", "B", "C", "D"][idx]}.
                </span>
                {pilihan}
                {sudahDijawab && idx === soal.jawaban && (
                  <span className="float-right font-bold" style={{ color: "#059669" }}>✓</span>
                )}
                {sudahDijawab && idx === pilihanDipilih && idx !== soal.jawaban && (
                  <span className="float-right font-bold" style={{ color: "#DC2626" }}>✗</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {sudahDijawab && (
          <div>
            <div
              className="p-4 rounded-xl mb-3 text-center font-sans font-semibold text-sm"
              style={
                habisWaktu
                  ? { backgroundColor: "var(--gold-light)", color: "var(--gold)" }
                  : pilihanDipilih === soal.jawaban
                  ? { backgroundColor: "#D1FAE5", color: "#065F46" }
                  : { backgroundColor: "#FEE2E2", color: "#DC2626" }
              }
            >
              {habisWaktu
                ? `⏱ Waktu habis! Jawaban: "${soal.pilihan[soal.jawaban]}"`
                : pilihanDipilih === soal.jawaban
                ? "🎉 Benar! Bagus sekali!"
                : `❌ Salah. Jawaban benar: "${soal.pilihan[soal.jawaban]}"`}
              {soal.penjelasan && (
                <p className="font-normal mt-1 text-xs" style={{ opacity: 0.8 }}>
                  {soal.penjelasan}
                </p>
              )}
            </div>
            <button
              onClick={soalBerikutnya}
              className="btn-primary w-full py-4 rounded-xl font-bold text-base hover:opacity-90 transition justify-center"
              style={{ backgroundColor: accentColor }}
            >
              {soalAktif + 1 >= totalSoal ? "Lihat Hasil →" : "Soal Berikutnya →"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
