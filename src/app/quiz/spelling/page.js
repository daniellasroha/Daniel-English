// Quiz Spelling — ketik jawaban sendiri
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { kosakata } from "@/data/vocabulary";
import { useProgress } from "@/hooks/useProgress";

// Ambil 15 kata acak dari vocabulary untuk soal spelling
function acakKata(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export default function SpellingQuizPage() {
  const [mulai, setMulai] = useState(false);
  const [soalList, setSoalList] = useState([]);
  const [index, setIndex] = useState(0);
  const [jawaban, setJawaban] = useState("");
  const [hasil, setHasil] = useState(null); // null | "benar" | "salah"
  const [skor, setSkor] = useState(0);
  const [selesai, setSelesai] = useState(false);
  const [riwayat, setRiwayat] = useState([]);
  const inputRef = useRef(null);

  const { recordQuiz } = useProgress();

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
    if (benar) setSkor((s) => s + 1);
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

  // Halaman awal
  if (!mulai) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link href="/quiz" className="text-indigo-500 hover:text-indigo-700 text-2xl">←</Link>
            <h1 className="text-xl font-bold text-teal-700">⌨️ Spelling Quiz</h1>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">⌨️</div>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-3">Spelling Quiz</h2>
            <p className="text-gray-500 text-sm mb-2">Kamu akan diberikan arti kata dalam bahasa Indonesia.</p>
            <p className="text-gray-500 text-sm mb-6">Tulis terjemahannya dalam bahasa Inggris dengan benar!</p>
            <div className="bg-teal-50 rounded-xl p-4 mb-6 text-left text-sm text-teal-700">
              <p>✅ 15 kata acak dari vocabulary</p>
              <p>⌨️ Ketik jawaban dengan keyboard</p>
              <p>🔡 Tidak case-sensitive (huruf besar/kecil)</p>
              <p>⏎ Tekan Enter untuk cek / lanjut</p>
            </div>
            <button
              onClick={mulaiQuiz}
              className="w-full py-4 bg-teal-600 text-white font-extrabold text-lg rounded-2xl hover:bg-teal-700 transition shadow-lg"
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

  // Halaman hasil
  if (selesai) {
    const persen = Math.round((skor / total) * 100);
    const huruf = persen >= 90 ? "A" : persen >= 75 ? "B" : persen >= 60 ? "C" : persen >= 50 ? "D" : "E";
    return (
      <main className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link href="/quiz" className="text-indigo-500 hover:text-indigo-700 text-2xl">←</Link>
            <h1 className="text-xl font-bold text-teal-700">⌨️ Spelling Quiz</h1>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center px-4 py-10">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-3">{persen >= 75 ? "🏆" : "📖"}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Selesai!</h2>
            <div className="w-28 h-28 rounded-full bg-teal-600 flex flex-col items-center justify-center mx-auto my-4 shadow-lg">
              <span className="text-3xl font-extrabold text-white">{huruf}</span>
              <span className="text-white text-sm font-semibold">{persen}%</span>
            </div>
            <p className="text-gray-500 text-sm mb-2">Benar: <strong>{skor}</strong> dari <strong>{total}</strong> kata</p>

            {/* Review jawaban */}
            <div className="text-left max-h-48 overflow-y-auto mb-5">
              {riwayat.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-xs py-1.5 border-b border-gray-100">
                  <span>{r.benar ? "✅" : "❌"}</span>
                  <div>
                    <span className="text-gray-500">{r.indonesian} → </span>
                    <span className={r.benar ? "text-green-600 font-bold" : "text-red-500 line-through"}>{r.jawaban}</span>
                    {!r.benar && <span className="text-green-600 font-bold ml-1">({r.english})</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={mulaiQuiz} className="flex-1 bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition">
                🔄 Ulangi
              </button>
              <Link href="/quiz" className="flex-1">
                <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
                  ← Kuis Lain
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/quiz" className="text-indigo-500 hover:text-indigo-700 text-2xl">←</Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-teal-700">⌨️ Spelling Quiz</h1>
            <p className="text-xs text-gray-400">Soal {index + 1} dari {total}</p>
          </div>
          <div className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-bold">
            ⭐ {skor} poin
          </div>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-8">
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div className="bg-teal-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(index / total) * 100}%` }} />
        </div>

        {/* Kartu soal */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-5 text-center">
          <p className="text-xs font-semibold text-teal-400 uppercase mb-3">Tulis dalam bahasa Inggris</p>
          <div className="text-5xl mb-3">{soal.emoji}</div>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-1">{soal.indonesian}</h2>
          <p className="text-gray-400 text-xs">Kategori: {soal.kategori}</p>
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
          className={`w-full px-5 py-4 rounded-2xl border-2 text-center text-xl font-bold focus:outline-none transition mb-4 ${
            hasil === "benar"
              ? "border-green-500 bg-green-50 text-green-700"
              : hasil === "salah"
              ? "border-red-400 bg-red-50 text-red-600"
              : "border-teal-200 focus:border-teal-500 text-gray-700"
          }`}
        />

        {/* Feedback */}
        {hasil && (
          <div className={`p-4 rounded-xl mb-4 text-center font-semibold ${
            hasil === "benar" ? "bg-green-100 text-green-700" : "bg-red-50 text-red-600"
          }`}>
            {hasil === "benar"
              ? "🎉 Benar! Kamu hebat!"
              : `❌ Salah. Jawaban yang benar: "${soal.english}"`}
            <p className="text-xs text-gray-400 font-normal mt-1 italic">{soal.contoh}</p>
          </div>
        )}

        {!hasil ? (
          <button
            onClick={cekJawaban}
            disabled={!jawaban.trim()}
            className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-teal-700 disabled:opacity-40 transition"
          >
            Cek Jawaban ✓
          </button>
        ) : (
          <button
            onClick={lanjut}
            className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-teal-700 transition"
          >
            {index + 1 >= total ? "Lihat Hasil →" : "Lanjut →"}
          </button>
        )}
      </div>
    </main>
  );
}
