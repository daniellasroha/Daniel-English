// Halaman Listening — latihan mendengar dan mengucapkan kata bahasa Inggris
"use client";

import { useState } from "react";
import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";

// Data latihan listening — kata dan kalimat untuk didengarkan
const materiListening = [
  {
    id: 1,
    kategori: "Kata Dasar",
    emoji: "🔤",
    daftar: [
      { teks: "Apple", arti: "Apel", tingkat: "Mudah" },
      { teks: "Beautiful", arti: "Cantik / Indah", tingkat: "Mudah" },
      { teks: "Computer", arti: "Komputer", tingkat: "Mudah" },
      { teks: "Elephant", arti: "Gajah", tingkat: "Mudah" },
      { teks: "Friendship", arti: "Persahabatan", tingkat: "Sedang" },
    ],
  },
  {
    id: 2,
    kategori: "Kalimat Pendek",
    emoji: "💬",
    daftar: [
      { teks: "Good morning!", arti: "Selamat pagi!", tingkat: "Mudah" },
      { teks: "How are you?", arti: "Apa kabar?", tingkat: "Mudah" },
      { teks: "I love learning English.", arti: "Saya suka belajar bahasa Inggris.", tingkat: "Sedang" },
      { teks: "What is your name?", arti: "Siapa namamu?", tingkat: "Mudah" },
      { teks: "Nice to meet you!", arti: "Senang bertemu denganmu!", tingkat: "Mudah" },
    ],
  },
  {
    id: 3,
    kategori: "Kalimat Panjang",
    emoji: "📜",
    daftar: [
      { teks: "She goes to school every morning.", arti: "Dia pergi ke sekolah setiap pagi.", tingkat: "Sedang" },
      { teks: "I am studying English to improve my skills.", arti: "Saya belajar bahasa Inggris untuk meningkatkan kemampuan saya.", tingkat: "Sulit" },
      { teks: "The weather is very nice today.", arti: "Cuaca sangat bagus hari ini.", tingkat: "Sedang" },
      { teks: "Practice makes perfect.", arti: "Latihan membuat sempurna.", tingkat: "Mudah" },
    ],
  },
];

// Warna berdasarkan tingkat kesulitan
function warnaTingkat(tingkat) {
  if (tingkat === "Mudah") return "bg-green-100 text-green-700";
  if (tingkat === "Sedang") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-600";
}

export default function ListeningPage() {
  const [sedangDiputar, setSedangDiputar] = useState(null);
  const [kecepatan, setKecepatan] = useState(0.8);
  const { recordListening } = useProgress();

  // Fungsi untuk memutar teks menggunakan Web Speech API
  function putarSuara(teks, id) {
    // Hentikan suara yang sedang diputar
    window.speechSynthesis.cancel();

    if (sedangDiputar === id) {
      // Kalau tombol yang sama diklik lagi, hentikan saja
      setSedangDiputar(null);
      return;
    }

    // Buat objek utterance (ucapan)
    const ucapan = new SpeechSynthesisUtterance(teks);
    ucapan.lang = "en-US"; // Bahasa Inggris Amerika
    ucapan.rate = kecepatan; // Kecepatan bicara
    ucapan.pitch = 1; // Nada suara normal

    setSedangDiputar(id);
    recordListening();

    ucapan.onend = () => setSedangDiputar(null);
    ucapan.onerror = () => setSedangDiputar(null);

    // Mulai bicara
    window.speechSynthesis.speak(ucapan);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-indigo-500 hover:text-indigo-700 text-2xl">
            ←
          </Link>
          <div>
            <h1 className="text-xl font-bold text-orange-700">🎧 Listening</h1>
            <p className="text-xs text-gray-400">Tekan tombol ▶ untuk mendengar pengucapan</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Pengaturan kecepatan */}
        <div className="bg-white rounded-2xl p-5 mb-6 border border-orange-200 shadow-sm">
          <h3 className="font-bold text-gray-700 mb-3">⚙️ Kecepatan Bicara</h3>
          <div className="flex gap-3 flex-wrap">
            {[
              { label: "🐢 Lambat", value: 0.5 },
              { label: "🚶 Normal", value: 0.8 },
              { label: "🏃 Cepat", value: 1.2 },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setKecepatan(opt.value)}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition ${
                  kecepatan === opt.value
                    ? "bg-orange-500 text-white shadow"
                    : "bg-gray-100 text-gray-600 hover:bg-orange-100"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            💡 Tips: Mulai dengan kecepatan Lambat, lalu tingkatkan setelah terbiasa.
          </p>
        </div>

        {/* Daftar materi listening */}
        {materiListening.map((kategori) => (
          <div key={kategori.id} className="mb-6">
            {/* Judul kategori */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{kategori.emoji}</span>
              <h2 className="text-lg font-bold text-gray-700">{kategori.kategori}</h2>
            </div>

            {/* Kartu setiap item */}
            <div className="flex flex-col gap-3">
              {kategori.daftar.map((item, index) => {
                const idUnik = `${kategori.id}-${index}`;
                const diputar = sedangDiputar === idUnik;

                return (
                  <div
                    key={index}
                    className={`bg-white rounded-2xl border p-4 flex items-center gap-4 shadow-sm transition ${
                      diputar ? "border-orange-400 bg-orange-50" : "border-orange-100"
                    }`}
                  >
                    {/* Tombol putar */}
                    <button
                      onClick={() => putarSuara(item.teks, idUnik)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition shadow ${
                        diputar
                          ? "bg-orange-500 text-white animate-pulse"
                          : "bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white"
                      }`}
                    >
                      {diputar ? "⏸" : "▶"}
                    </button>

                    {/* Teks dan terjemahan */}
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-lg">{item.teks}</p>
                      <p className="text-gray-400 text-sm">{item.arti}</p>
                    </div>

                    {/* Badge tingkat kesulitan */}
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${warnaTingkat(
                        item.tingkat
                      )}`}
                    >
                      {item.tingkat}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Info browser */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-600">
          <p>
            🔊 <strong>Catatan:</strong> Fitur suara menggunakan Web Speech API bawaan browser.
            Pastikan volume laptop/PC kamu sudah aktif. Fitur ini bekerja paling baik di Chrome atau Edge.
          </p>
        </div>
      </div>
    </main>
  );
}
