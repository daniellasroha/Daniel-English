// Halaman Belajar Terstruktur — Busuu-style learning path
"use client";

import { useState } from "react";
import Link from "next/link";
import { learningPath as unitBelajar } from "@/data/learningPath";
import { useLearning } from "@/hooks/useLearning";
import { useLevel } from "@/hooks/useLevel";

// ─── SOUND EFFECTS (Web Audio API, no external files) ─────────────────────────
function playBenar() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    // Dua nada naik — "ding ding"
    [0, 0.15].forEach((offset, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(i === 0 ? 880 : 1100, ctx.currentTime + offset);
      gain.gain.setValueAtTime(0.25, ctx.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.25);
      osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 0.25);
    });
  } catch {}
}

function playSalah() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch {}
}

// ─── KOMPONEN: Kartu Vocab (flashcard) ────────────────────────────────────────
function VocabCard({ kartu, meta, index, total }) {
  const [terbuka, setTerbuka] = useState(false);
  return (
    <div
      onClick={() => setTerbuka(!terbuka)}
      className={`rounded-2xl border-2 ${meta.border} ${meta.bg} cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5`}
    >
      <div className="flex items-center gap-4 mb-3">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${meta.warna} flex items-center justify-center text-3xl shadow flex-shrink-0`}>
          {kartu.emoji}
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-400 mb-0.5">{index + 1} / {total}</p>
          <h3 className="text-xl font-bold text-gray-800">{kartu.kata}</h3>
          {!terbuka && <p className="text-xs text-gray-400">Klik untuk lihat arti</p>}
        </div>
      </div>

      {terbuka ? (
        <div className={`rounded-xl p-3 bg-white bg-opacity-70 border ${meta.border}`}>
          <p className={`font-bold text-base ${meta.teks}`}>{kartu.arti}</p>
          <p className="text-gray-400 text-xs mt-1 italic">"{kartu.contoh}"</p>
        </div>
      ) : (
        <div className="h-10 rounded-xl bg-white bg-opacity-40 border border-dashed border-gray-300 flex items-center justify-center">
          <span className="text-gray-300 text-sm">• • •</span>
        </div>
      )}
    </div>
  );
}

// ─── KOMPONEN: Mini Quiz ──────────────────────────────────────────────────────
function MiniQuiz({ soalList, meta, onSelesai }) {
  const [idx, setIdx] = useState(0);
  const [dipilih, setDipilih] = useState(null);
  const [benar, setBenar] = useState(0);

  const soal = soalList[idx];
  const selesai = idx >= soalList.length;

  function pilih(i) {
    if (dipilih !== null) return;
    setDipilih(i);
    if (i === soal.jawaban) {
      setBenar((b) => b + 1);
      playBenar();
    } else {
      playSalah();
    }
  }

  function lanjut() {
    setDipilih(null);
    setIdx((n) => n + 1);
  }

  if (selesai) {
    const persen = Math.round((benar / soalList.length) * 100);
    const lulus = persen >= 60;
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">{lulus ? "🎉" : "💪"}</div>
        <h3 className="text-2xl font-extrabold text-gray-800 mb-2">
          {lulus ? "Luar Biasa!" : "Hampir Benar!"}
        </h3>
        <p className="text-gray-500 mb-1">{benar} dari {soalList.length} soal benar</p>
        <p className={`text-2xl font-bold mb-6 ${lulus ? "text-green-600" : "text-orange-500"}`}>{persen}%</p>
        <button
          onClick={() => onSelesai(lulus)}
          className={`px-8 py-3 rounded-2xl text-white font-bold text-lg shadow-lg bg-gradient-to-r ${meta.warna} hover:scale-105 transition-transform`}
        >
          {lulus ? "Selesai & Lanjut ✓" : "Coba Lagi"}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Soal {idx + 1} dari {soalList.length}</span>
          <span>{benar} benar</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${meta.warna} transition-all`}
            style={{ width: `${((idx) / soalList.length) * 100}%` }}
          />
        </div>
      </div>

      <div className={`rounded-2xl border-2 ${meta.border} ${meta.bg} p-6 mb-6`}>
        <p className="text-lg font-bold text-gray-800 leading-snug">{soal.pertanyaan}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-4">
        {soal.pilihan.map((p, i) => {
          let style = "border-2 border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50";
          let icon = null;
          if (dipilih !== null) {
            if (i === soal.jawaban) {
              style = "border-2 border-green-400 bg-green-50 text-green-700";
              icon = <span className="ml-2 text-green-500 font-bold">✓</span>;
            } else if (i === dipilih) {
              style = "border-2 border-red-400 bg-red-50 text-red-700";
              icon = <span className="ml-2 text-red-500 font-bold">✗</span>;
            } else {
              style = "border-2 border-gray-200 bg-white text-gray-400 opacity-60";
            }
          }
          return (
            <button
              key={i}
              onClick={() => pilih(i)}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${style}`}
            >
              <span className="text-xs text-gray-400 mr-2">{["A", "B", "C", "D"][i]}.</span>
              {p}
              {icon}
            </button>
          );
        })}
      </div>

      {dipilih !== null && (
        <button
          onClick={lanjut}
          className={`w-full py-3 rounded-2xl text-white font-bold bg-gradient-to-r ${meta.warna} hover:scale-105 transition-transform shadow-md`}
        >
          {idx < soalList.length - 1 ? "Soal Berikutnya →" : "Lihat Hasil"}
        </button>
      )}
    </div>
  );
}

// ─── KOMPONEN: Tampilan Pelajaran ─────────────────────────────────────────────
function TampilanPelajaran({
  unit,
  pelajaran,
  lessonIndex,
  onKembali,
  onSelesai,
  sudahSelesai,
  nextLesson,
  onNextLesson,
}) {
  const meta = unit;
  const [fase, setFase] = useState("vocab"); // vocab | quiz | done — selalu mulai dari awal
  const [vocabIdx, setVocabIdx] = useState(0);

  const isVocab = pelajaran.tipe === "vocab";
  const isQuiz = pelajaran.tipe === "quiz";

  // Kalau pelajaran sudah selesai tapi user klik dari daftar → mulai dari awal, bukan langsung "done"
  // (sudahSelesai hanya untuk tahu status, bukan untuk skip)

  function handleVocabNext() {
    if (isVocab && vocabIdx < pelajaran.kartu.length - 1) {
      setVocabIdx(vocabIdx + 1);
    } else {
      setFase("quiz");
    }
  }

  function handleVocabPrev() {
    if (vocabIdx > 0) setVocabIdx(vocabIdx - 1);
  }

  function handleQuizSelesai(lulus) {
    if (lulus) {
      setFase("done");
      onSelesai();
    } else {
      // Reset quiz
      setFase("vocab");
      setVocabIdx(0);
    }
  }

  // Lesson type: pure quiz (no vocab)
  if (isQuiz && fase !== "done") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-3">
            <button onClick={onKembali} className="text-indigo-500 hover:text-indigo-700 text-2xl">←</button>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.warna} flex items-center justify-center text-xl shadow`}>
              {pelajaran.emoji}
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-800">{pelajaran.judul}</h1>
              <p className={`text-xs ${meta.teks} font-semibold`}>{unit.judul}</p>
            </div>
          </div>
        </header>
        <div className="max-w-xl mx-auto px-4 py-6">
          <MiniQuiz soalList={pelajaran.soal} meta={meta} onSelesai={handleQuizSelesai} />
        </div>
      </div>
    );
  }

  // ── Selesai / Done screen ──
  if (fase === "done") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center">
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Pelajaran Selesai!</h2>
          <p className="text-gray-500 mb-1 text-sm">{pelajaran.judul}</p>
          <p className={`font-semibold ${meta.teks} text-sm mb-6`}>{unit.judul}</p>

          <div className="flex flex-col gap-3">
            {/* Tombol next chapter — muncul kalau ada pelajaran berikutnya */}
            {nextLesson && (
              <button
                onClick={onNextLesson}
                className={`w-full py-3 rounded-2xl text-white font-bold bg-gradient-to-r ${meta.warna} shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2`}
              >
                <span>Pelajaran Berikutnya</span>
                <span className="text-xl">→</span>
              </button>
            )}

            {/* Tombol ulangi pelajaran */}
            <button
              onClick={() => { setFase(isVocab ? "vocab" : "quiz"); setVocabIdx(0); }}
              className="w-full py-3 rounded-2xl font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <span>🔄</span> Ulangi Pelajaran
            </button>

            <button
              onClick={onKembali}
              className={`w-full py-3 rounded-2xl font-bold border-2 transition hover:shadow-md ${
                nextLesson
                  ? `${meta.border} ${meta.bg} ${meta.teks}`
                  : `text-white bg-gradient-to-r ${meta.warna} shadow-lg hover:scale-105`
              }`}
            >
              Kembali ke Unit
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Vocab phase ──
  if (fase === "vocab" && isVocab) {
    const kartu = pelajaran.kartu[vocabIdx];
    const isLast = vocabIdx === pelajaran.kartu.length - 1;
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-3">
            <button onClick={onKembali} className="text-indigo-500 hover:text-indigo-700 text-2xl">←</button>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.warna} flex items-center justify-center text-xl shadow`}>
              {pelajaran.emoji}
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-800">{pelajaran.judul}</h1>
              <p className={`text-xs ${meta.teks} font-semibold`}>{unit.judul}</p>
            </div>
            <span className="text-xs text-gray-400 font-mono">{vocabIdx + 1}/{pelajaran.kartu.length}</span>
          </div>
          {/* Progress */}
          <div className="max-w-xl mx-auto px-4 pb-3">
            <div className="w-full h-1.5 bg-gray-200 rounded-full">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${meta.warna} transition-all`}
                style={{ width: `${((vocabIdx + 1) / pelajaran.kartu.length) * 100}%` }}
              />
            </div>
          </div>
        </header>

        <div className="max-w-xl mx-auto px-4 py-6">
          <div className="mb-4 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest">Kartu Kosakata</p>
          </div>

          <VocabCard kartu={kartu} meta={meta} index={vocabIdx} total={pelajaran.kartu.length} />

          <div className="flex gap-3 mt-6">
            {vocabIdx > 0 && (
              <button
                onClick={handleVocabPrev}
                className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition"
              >
                ← Sebelumnya
              </button>
            )}
            <button
              onClick={handleVocabNext}
              className={`flex-1 py-3 rounded-2xl text-white font-bold bg-gradient-to-r ${meta.warna} shadow-md hover:scale-105 transition-transform`}
            >
              {isLast ? "Mulai Kuis →" : "Berikutnya →"}
            </button>
          </div>

          {/* Grid semua kartu di bawah */}
          <div className="mt-8">
            <p className="text-xs text-gray-400 mb-3 text-center">Semua Kata ({pelajaran.kartu.length})</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pelajaran.kartu.map((k, i) => (
                <button
                  key={i}
                  onClick={() => setVocabIdx(i)}
                  className={`rounded-xl p-3 text-left border-2 transition-all ${
                    i === vocabIdx
                      ? `${meta.border} ${meta.bg}`
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <span className="text-lg mr-2">{k.emoji}</span>
                  <span className={`font-semibold text-sm ${i === vocabIdx ? meta.teks : "text-gray-700"}`}>{k.kata}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz phase (after vocab) ──
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => setFase("vocab")} className="text-indigo-500 hover:text-indigo-700 text-2xl">←</button>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.warna} flex items-center justify-center text-xl shadow`}>
            🧠
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-800">Kuis: {pelajaran.judul}</h1>
            <p className={`text-xs ${meta.teks} font-semibold`}>{unit.judul}</p>
          </div>
        </div>
      </header>
      <div className="max-w-xl mx-auto px-4 py-6">
        <MiniQuiz soalList={pelajaran.soal || generateSoalFromKartu(pelajaran.kartu)} meta={meta} onSelesai={handleQuizSelesai} />
      </div>
    </div>
  );
}

// Auto-generate quiz from vocab cards if no soal defined
function generateSoalFromKartu(kartu) {
  if (!kartu || kartu.length < 4) return [];
  return kartu.slice(0, Math.min(5, kartu.length)).map((k, i) => {
    const salah = kartu.filter((_, j) => j !== i).sort(() => Math.random() - 0.5).slice(0, 3);
    const allPilihan = [k.arti, ...salah.map((s) => s.arti)].sort(() => Math.random() - 0.5);
    return {
      pertanyaan: `Apa arti kata "${k.kata}"?`,
      pilihan: allPilihan,
      jawaban: allPilihan.indexOf(k.arti),
    };
  });
}

// ─── HALAMAN UTAMA ────────────────────────────────────────────────────────────
export default function BelajarPage() {
  const [unitDipilih, setUnitDipilih] = useState(null);
  const [pelajaranDipilih, setPelajaranDipilih] = useState(null);

  const {
    isLessonDone,
    isLessonUnlocked,
    getUnitProgress,
    completeLesson,
    loaded,
  } = useLearning();

  const { config, level } = useLevel();
  const userLevel = level || "a1";
  const unitsTampil = userLevel === "a1"
    ? unitBelajar.filter((u) => u.level === "a1")
    : userLevel === "a2"
    ? unitBelajar.filter((u) => u.level === "a1" || u.level === "a2")
    : unitBelajar; // b1 → semua unit

  // ── View 3: Pelajaran ──
  // (unitsTampil dipakai di View 2 dan View 1)
  if (pelajaranDipilih && unitDipilih) {
    const unit = unitBelajar.find((u) => u.id === unitDipilih);
    const lessonIndex = unit.pelajaran.findIndex((p) => p.id === pelajaranDipilih);
    const pelajaran = unit.pelajaran[lessonIndex];

    // Cari pelajaran berikutnya (dalam unit yang sama)
    const nextLesson = unit.pelajaran[lessonIndex + 1] || null;

    function handleSelesai() {
      completeLesson(pelajaran.id);
      // Tetap di layar "done" — tombol next/back yang handle navigasi
    }

    function handleNextLesson() {
      if (nextLesson) {
        setPelajaranDipilih(nextLesson.id);
      }
    }

    return (
      <TampilanPelajaran
        unit={unit}
        pelajaran={pelajaran}
        lessonIndex={lessonIndex}
        onKembali={() => setPelajaranDipilih(null)}
        onSelesai={handleSelesai}
        sudahSelesai={isLessonDone(pelajaran.id)}
        nextLesson={nextLesson}
        onNextLesson={handleNextLesson}
      />
    );
  }

  // ── View 2: Unit (daftar pelajaran) ──
  if (unitDipilih) {
    const unit = unitBelajar.find((u) => u.id === unitDipilih);
    const { done, total } = getUnitProgress(unitDipilih);
    const currentUnitIdx = unitsTampil.findIndex((u) => u.id === unitDipilih);
    const nextUnit = unitsTampil[currentUnitIdx + 1] || null;

    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-3">
            <button onClick={() => setUnitDipilih(null)} className="text-indigo-500 hover:text-indigo-700 text-2xl">←</button>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${unit.warna} flex items-center justify-center text-xl shadow`}>
              {unit.emoji}
            </div>
            <div className="flex-1">
              <h1 className={`text-lg font-bold ${unit.teks}`}>{unit.judul}</h1>
              <p className="text-xs text-gray-400">{done}/{total} pelajaran selesai</p>
            </div>
          </div>
        </header>

        <div className="max-w-xl mx-auto px-4 py-6">
          {/* Unit description */}
          <div className={`rounded-2xl border-2 ${unit.border} ${unit.bg} p-4 mb-6`}>
            <p className="text-sm text-gray-600">{unit.deskripsi}</p>
            <div className="mt-3 w-full h-2 bg-white bg-opacity-60 rounded-full">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${unit.warna} transition-all`}
                style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Lesson list */}
          <div className="flex flex-col gap-4">
            {unit.pelajaran.map((pelajaran, idx) => {
              const unlocked = isLessonUnlocked(unitDipilih, idx);
              const done = isLessonDone(pelajaran.id);
              return (
                <button
                  key={pelajaran.id}
                  onClick={() => unlocked && setPelajaranDipilih(pelajaran.id)}
                  disabled={!unlocked}
                  className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
                    done
                      ? `${unit.border} ${unit.bg} shadow-md`
                      : unlocked
                      ? "border-gray-200 bg-white hover:shadow-md hover:-translate-y-0.5"
                      : "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow flex-shrink-0 ${
                      done ? `bg-gradient-to-br ${unit.warna}` : "bg-gray-100"
                    }`}>
                      {done ? "⭐" : unlocked ? pelajaran.emoji : "🔒"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`font-bold text-base ${done ? unit.teks : unlocked ? "text-gray-800" : "text-gray-400"}`}>
                          {pelajaran.judul}
                        </p>
                        {done && <span className="text-xs bg-white rounded-full px-2 py-0.5 border border-green-200 text-green-600 font-semibold">Selesai ✓</span>}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {pelajaran.tipe === "vocab"
                          ? `${pelajaran.kartu.length} kartu kata + kuis`
                          : `${pelajaran.soal.length} soal kuis`}
                        {!unlocked && " · Selesaikan pelajaran sebelumnya"}
                      </p>
                    </div>
                    {unlocked && !done && (
                      <span className={`text-2xl ${unit.teks}`}>›</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tombol next unit */}
          <div className="mt-8 flex flex-col gap-3">
            {nextUnit && (
              <button
                onClick={() => setUnitDipilih(nextUnit.id)}
                className={`w-full py-4 rounded-2xl text-white font-bold text-base bg-gradient-to-r ${nextUnit.warna} shadow-lg hover:scale-105 transition-transform flex items-center justify-between px-6`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">{nextUnit.emoji}</span>
                  <span>
                    <span className="block text-xs font-normal opacity-80">Unit Berikutnya</span>
                    {nextUnit.judul}
                  </span>
                </span>
                <span className="text-2xl">→</span>
              </button>
            )}
            <button
              onClick={() => setUnitDipilih(null)}
              className="w-full py-3 rounded-2xl border-2 border-gray-200 text-gray-500 font-semibold hover:bg-gray-50 transition text-sm"
            >
              ← Kembali ke Semua Unit
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── View 1: Path overview ──
  // unitsTampil sudah dihitung di atas
  const { totalDone, totalAll } = loaded
    ? unitsTampil.reduce(
        (acc, u) => {
          const p = getUnitProgress(u.id);
          return { totalDone: acc.totalDone + p.done, totalAll: acc.totalAll + p.total };
        },
        { totalDone: 0, totalAll: 0 }
      )
    : { totalDone: 0, totalAll: 0 };
  const totalPersen = totalAll > 0 ? Math.round((totalDone / totalAll) * 100) : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-indigo-500 hover:text-indigo-700 text-2xl">←</Link>
          <div>
            <h1 className="text-xl font-bold text-indigo-700">🗺️ Belajar Terstruktur</h1>
            <p className="text-xs text-gray-400">{totalDone}/{totalAll} pelajaran selesai · {unitsTampil.length} unit</p>
          </div>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-6">
        {/* Overall progress */}
        <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-5 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-2xl shadow">
              🎯
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800">Progress Keseluruhan</p>
              <p className="text-xs text-gray-400">Ikuti alur belajar dari awal hingga mahir</p>
            </div>
            <span className="text-2xl font-extrabold text-indigo-600">{totalPersen}%</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-500"
              style={{ width: `${totalPersen}%` }}
            />
          </div>
        </div>

        {/* Learning path */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-7 top-8 bottom-8 w-0.5 bg-gradient-to-b from-indigo-200 to-transparent" />

          <div className="flex flex-col gap-4">
            {unitsTampil.map((unit, unitIdx) => {
              const { done, total } = loaded ? getUnitProgress(unit.id) : { done: 0, total: 0 };
              const firstLessonUnlocked = loaded ? isLessonUnlocked(unit.id, 0) : unitIdx === 0;
              const allDone = done === total && total > 0;
              const persen = total > 0 ? Math.round((done / total) * 100) : 0;
              const showA2Separator = unit.level === "a2" &&
                (unitIdx === 0 || unitsTampil[unitIdx - 1].level === "a1");
              const showB1Separator = unit.level === "b1" &&
                (unitIdx === 0 || unitsTampil[unitIdx - 1].level !== "b1");

              return (
                <div key={unit.id}>
                  {showA2Separator && (
                    <div className="relative pl-16 mb-2">
                      <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-3 flex items-center gap-3">
                        <span className="text-2xl">📗</span>
                        <div>
                          <p className="font-bold text-blue-700 text-sm">Materi A2</p>
                          <p className="text-xs text-blue-400">Lanjutan setelah menguasai A1</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {showB1Separator && (
                    <div className="relative pl-16 mb-2">
                      <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50 px-5 py-3 flex items-center gap-3">
                        <span className="text-2xl">🚀</span>
                        <div>
                          <p className="font-bold text-purple-700 text-sm">Materi B1</p>
                          <p className="text-xs text-purple-400">Level menengah CEFR — setelah menguasai A2</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="relative pl-16">
                    {/* Circle connector */}
                    <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-md border-2 border-white ${
                      allDone
                        ? `bg-gradient-to-br ${unit.warna}`
                        : firstLessonUnlocked
                        ? `bg-gradient-to-br ${unit.warna} opacity-70`
                        : "bg-gray-200"
                    }`}>
                      {allDone ? "✓" : firstLessonUnlocked ? unit.emoji : "🔒"}
                    </div>

                    <button
                      onClick={() => firstLessonUnlocked && setUnitDipilih(unit.id)}
                      disabled={!firstLessonUnlocked}
                      className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
                        allDone
                          ? `${unit.border} ${unit.bg} shadow-md`
                          : firstLessonUnlocked
                          ? "border-gray-200 bg-white hover:shadow-md hover:-translate-y-0.5"
                          : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-400 font-mono">Unit {unitIdx + 1}</span>
                            {unit.level === "a2" && (
                              <span className="text-xs bg-blue-100 rounded-full px-2 py-0.5 text-blue-500 font-semibold">A2</span>
                            )}
                            {unit.level === "b1" && (
                              <span className="text-xs bg-purple-100 rounded-full px-2 py-0.5 text-purple-500 font-semibold">B1</span>
                            )}
                            {allDone && (
                              <span className="text-xs bg-white rounded-full px-2 py-0.5 border border-green-200 text-green-600 font-semibold">Selesai ✓</span>
                            )}
                            {!firstLessonUnlocked && (
                              <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5 text-gray-400">Terkunci</span>
                            )}
                          </div>
                          <p className={`font-bold text-base ${firstLessonUnlocked ? unit.teks : "text-gray-400"}`}>{unit.judul}</p>
                          <p className="text-xs text-gray-400 mt-0.5 leading-snug">{unit.deskripsi}</p>

                          {firstLessonUnlocked && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>{done}/{total} pelajaran</span>
                                <span>{persen}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-gray-100 rounded-full">
                                <div
                                  className={`h-full rounded-full bg-gradient-to-r ${unit.warna} transition-all`}
                                  style={{ width: `${persen}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">Ikuti urutan unit untuk hasil belajar terbaik 🎓</p>
        </div>
      </div>
    </main>
  );
}
