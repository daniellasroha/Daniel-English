// Halaman Daily Challenge — 1 soal acak setiap hari
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Pool soal harian — campuran vocab + grammar
const soalPool = [
  { pertanyaan: "Apa arti 'Elephant'?", pilihan: ["Kelinci", "Harimau", "Gajah", "Ular"], jawaban: 2 },
  { pertanyaan: "Kata 'Beautiful' artinya...", pilihan: ["Jelek", "Cantik/Indah", "Marah", "Sedih"], jawaban: 1 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Apel'?", pilihan: ["Orange", "Mango", "Apple", "Grape"], jawaban: 2 },
  { pertanyaan: "Simple Present untuk 'She': She ___ (go) to school.", pilihan: ["go", "goes", "went", "going"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Nervous'?", pilihan: ["Marah", "Bahagia", "Gugup", "Bosan"], jawaban: 2 },
  { pertanyaan: "Kalimat negatif Simple Present: He ___ like coffee.", pilihan: ["not", "don't", "doesn't", "isn't"], jawaban: 2 },
  { pertanyaan: "Apa arti 'Watermelon'?", pilihan: ["Melon", "Semangka", "Pisang", "Mangga"], jawaban: 1 },
  { pertanyaan: "To Be untuk 'They': They ___ students.", pilihan: ["is", "am", "are", "be"], jawaban: 2 },
  { pertanyaan: "Kata 'Generous' artinya...", pilihan: ["Pemalas", "Dermawan", "Penakut", "Sombong"], jawaban: 1 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Berlari'?", pilihan: ["Jump", "Run", "Walk", "Swim"], jawaban: 1 },
  { pertanyaan: "Past tense dari 'go' adalah...", pilihan: ["goed", "goes", "went", "gone"], jawaban: 2 },
  { pertanyaan: "Apa arti 'Library'?", pilihan: ["Laboratorium", "Perpustakaan", "Kantor", "Toko"], jawaban: 1 },
  { pertanyaan: "Modal verb untuk kemampuan: I ___ speak English.", pilihan: ["will", "can", "must", "should"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Delicious'?", pilihan: ["Hambar", "Pahit", "Lezat", "Asam"], jawaban: 2 },
  { pertanyaan: "Present Continuous: She ___ eating now.", pilihan: ["is", "are", "was", "be"], jawaban: 0 },
  { pertanyaan: "Apa arti 'Mountain'?", pilihan: ["Pantai", "Sungai", "Gunung", "Danau"], jawaban: 2 },
  { pertanyaan: "Artikel untuk kata benda dimulai huruf vokal: ___ apple.", pilihan: ["a", "an", "the", "—"], jawaban: 1 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Rumah Sakit'?", pilihan: ["Hotel", "Hospital", "School", "Market"], jawaban: 1 },
  { pertanyaan: "Comparative: She is ___ than her sister. (tall)", pilihan: ["more tall", "tallest", "taller", "tall"], jawaban: 2 },
  { pertanyaan: "Apa arti 'Proud'?", pilihan: ["Malu", "Bangga", "Sedih", "Takut"], jawaban: 1 },
  { pertanyaan: "Future tense: I ___ visit you tomorrow.", pilihan: ["am", "was", "will", "have"], jawaban: 2 },
  { pertanyaan: "Apa arti 'Butterfly'?", pilihan: ["Lebah", "Capung", "Kupu-kupu", "Nyamuk"], jawaban: 2 },
  { pertanyaan: "Kalimat tanya Simple Present: ___ she speak English?", pilihan: ["Do", "Does", "Is", "Has"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Courage'?", pilihan: ["Kesabaran", "Keberanian", "Kebijakan", "Kejujuran"], jawaban: 1 },
  { pertanyaan: "Superlative: He is the ___ student. (smart)", pilihan: ["smarter", "more smart", "smartest", "smart"], jawaban: 2 },
  { pertanyaan: "Apa arti 'Rooster'?", pilihan: ["Bebek", "Ayam Jantan", "Kelinci", "Kambing"], jawaban: 1 },
  { pertanyaan: "Past Continuous: They ___ playing when I arrived.", pilihan: ["are", "is", "were", "was"], jawaban: 2 },
  { pertanyaan: "Apa arti 'Exhausted'?", pilihan: ["Senang", "Kelelahan", "Lapar", "Ngantuk"], jawaban: 1 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Kucing'?", pilihan: ["Dog", "Cat", "Bird", "Fish"], jawaban: 1 },
  { pertanyaan: "Artikel spesifik: Close ___ door, please.", pilihan: ["a", "an", "the", "—"], jawaban: 2 },
];

const KEY_DAILY = "daniel_english_daily";
const KEY_STREAK = "daniel_english_daily_streak";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function getSoalHariIni() {
  // Pilih soal berdasarkan hash tanggal agar sama sepanjang hari
  const today = todayStr();
  let hash = 0;
  for (let i = 0; i < today.length; i++) hash += today.charCodeAt(i);
  return soalPool[hash % soalPool.length];
}

export default function DailyChallengePage() {
  const [state, setState] = useState(null); // null = loading
  const [pilihan, setPilihan] = useState(null);
  const [selesai, setSelesai] = useState(false);
  const [streak, setStreak] = useState(0);

  const soal = getSoalHariIni();

  useEffect(() => {
    const saved = localStorage.getItem(KEY_DAILY);
    const streakData = localStorage.getItem(KEY_STREAK);
    const today = todayStr();

    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) {
        // Sudah menjawab hari ini
        setPilihan(parsed.pilihan);
        setSelesai(true);
      }
    }

    if (streakData) {
      setStreak(JSON.parse(streakData).count || 0);
    }

    setState("ready");
  }, []);

  function jawab(idx) {
    if (selesai) return;
    const today = todayStr();
    const benar = idx === soal.jawaban;
    setPilihan(idx);
    setSelesai(true);

    // Simpan jawaban hari ini
    localStorage.setItem(KEY_DAILY, JSON.stringify({ date: today, pilihan: idx, benar }));

    // Update streak
    const streakData = localStorage.getItem(KEY_STREAK);
    let newStreak = 1;
    if (streakData) {
      const parsed = JSON.parse(streakData);
      const kemarin = new Date();
      kemarin.setDate(kemarin.getDate() - 1);
      const kemarinStr = kemarin.toISOString().split("T")[0];
      if (parsed.lastDate === kemarinStr) {
        newStreak = (parsed.count || 0) + 1;
      }
    }
    localStorage.setItem(KEY_STREAK, JSON.stringify({ count: newStreak, lastDate: today }));
    setStreak(newStreak);
  }

  if (state === null) return null;

  const benar = pilihan === soal.jawaban;

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-indigo-500 hover:text-indigo-700 text-2xl">←</Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-violet-700">⚡ Daily Challenge</h1>
            <p className="text-xs text-gray-400">1 soal spesial setiap hari</p>
          </div>
          <div className="flex items-center gap-1 bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-bold">
            🔥 {streak}
          </div>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-10">
        {/* Tanggal */}
        <p className="text-center text-gray-400 text-sm mb-6">
          📅 {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>

        {/* Kartu soal */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          <div className="text-center mb-6">
            <span className="text-5xl">⚡</span>
            <h2 className="text-xl font-extrabold text-gray-800 mt-3 leading-snug">
              {soal.pertanyaan}
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {soal.pilihan.map((p, idx) => {
              let style = "border-2 border-gray-200 bg-white hover:border-violet-400 hover:bg-violet-50";
              if (selesai) {
                if (idx === soal.jawaban) style = "border-2 border-green-500 bg-green-50";
                else if (idx === pilihan && pilihan !== soal.jawaban) style = "border-2 border-red-400 bg-red-50";
                else style = "border-2 border-gray-100 bg-gray-50 opacity-40";
              }
              return (
                <button
                  key={idx}
                  onClick={() => jawab(idx)}
                  disabled={selesai}
                  className={`w-full text-left px-4 py-3.5 rounded-xl font-medium text-gray-700 transition-all ${style}`}
                >
                  <span className="font-bold text-violet-400 mr-2">{["A", "B", "C", "D"][idx]}.</span>
                  {p}
                  {selesai && idx === soal.jawaban && <span className="float-right text-green-600 font-bold">✓</span>}
                  {selesai && idx === pilihan && idx !== soal.jawaban && <span className="float-right text-red-500 font-bold">✗</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hasil */}
        {selesai && (
          <div className={`rounded-2xl p-6 text-center shadow-md ${benar ? "bg-green-100" : "bg-red-50"}`}>
            <p className="text-4xl mb-2">{benar ? "🏆" : "📖"}</p>
            <p className={`text-xl font-extrabold mb-1 ${benar ? "text-green-700" : "text-red-600"}`}>
              {benar ? "Benar! Keren!" : "Salah nih..."}
            </p>
            {!benar && (
              <p className="text-gray-600 text-sm">
                Jawaban benar: <strong>{soal.pilihan[soal.jawaban]}</strong>
              </p>
            )}
            <p className="text-gray-500 text-sm mt-3">
              Kembali lagi besok untuk soal baru! 🌟
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-orange-600 font-bold">
              🔥 Streak harian kamu: {streak} hari
            </div>
          </div>
        )}

        {/* Belum dijawab — info */}
        {!selesai && (
          <p className="text-center text-gray-400 text-xs">
            Soal ini hanya muncul sekali hari ini. Jawab sekarang!
          </p>
        )}
      </div>
    </main>
  );
}
