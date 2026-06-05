// Halaman Listening — latihan mendengar dan mengucapkan kata bahasa Inggris
"use client";

import { useState } from "react";
import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";

const materiListening = [
  {
    id: 1, kategori: "Kata Dasar", emoji: "🔤",
    daftar: [
      { teks: "Apple",       arti: "Apel",               tingkat: "Mudah" },
      { teks: "Beautiful",   arti: "Cantik / Indah",      tingkat: "Mudah" },
      { teks: "Computer",    arti: "Komputer",            tingkat: "Mudah" },
      { teks: "Elephant",    arti: "Gajah",               tingkat: "Mudah" },
      { teks: "Friendship",  arti: "Persahabatan",        tingkat: "Sedang" },
    ],
  },
  {
    id: 2, kategori: "Kalimat Pendek", emoji: "💬",
    daftar: [
      { teks: "Good morning!",          arti: "Selamat pagi!",                              tingkat: "Mudah" },
      { teks: "How are you?",           arti: "Apa kabar?",                                 tingkat: "Mudah" },
      { teks: "I love learning English.",arti: "Saya suka belajar bahasa Inggris.",         tingkat: "Sedang" },
      { teks: "What is your name?",     arti: "Siapa namamu?",                              tingkat: "Mudah" },
      { teks: "Nice to meet you!",      arti: "Senang bertemu denganmu!",                   tingkat: "Mudah" },
    ],
  },
  {
    id: 3, kategori: "Kalimat Panjang", emoji: "📜",
    daftar: [
      { teks: "She goes to school every morning.",                    arti: "Dia pergi ke sekolah setiap pagi.",                                      tingkat: "Sedang" },
      { teks: "I am studying English to improve my skills.",          arti: "Saya belajar bahasa Inggris untuk meningkatkan kemampuan saya.",         tingkat: "Sulit" },
      { teks: "The weather is very nice today.",                      arti: "Cuaca sangat bagus hari ini.",                                           tingkat: "Sedang" },
      { teks: "Practice makes perfect.",                              arti: "Latihan membuat sempurna.",                                              tingkat: "Mudah" },
    ],
  },
];

function badgeTingkat(tingkat) {
  if (tingkat === "Mudah")  return { bg: "#D1FAE5", color: "#065F46" };
  if (tingkat === "Sedang") return { bg: "#FEF3C7", color: "#92400E" };
  return                           { bg: "#FEE2E2", color: "#7F1D1D" };
}

export default function ListeningPage() {
  const [sedangDiputar, setSedangDiputar] = useState(null);
  const [kecepatan, setKecepatan] = useState(0.8);
  const { recordListening } = useProgress();

  function putarSuara(teks, id) {
    window.speechSynthesis.cancel();
    if (sedangDiputar === id) { setSedangDiputar(null); return; }
    const ucapan = new SpeechSynthesisUtterance(teks);
    ucapan.lang = "en-US";
    ucapan.rate = kecepatan;
    ucapan.pitch = 1;
    setSedangDiputar(id);
    recordListening();
    ucapan.onend = () => setSedangDiputar(null);
    ucapan.onerror = () => setSedangDiputar(null);
    window.speechSynthesis.speak(ucapan);
  }

  const kecepatanOpts = [
    { label: "🐢 Lambat", value: 0.5 },
    { label: "🚶 Normal", value: 0.8 },
    { label: "🏃 Cepat",  value: 1.2 },
  ];

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      {/* Header */}
      <header className="sticky top-0 z-10" style={{ backgroundColor: "var(--bg-paper)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center gap-4">
          <Link href="/" className="text-2xl transition-opacity hover:opacity-70" style={{ color: "var(--brand)" }}>←</Link>
          <div>
            <h1 className="font-serif text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
              🎧 Listening
            </h1>
            <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
              Tekan tombol ▶ untuk mendengar pengucapan
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-8">
        {/* Pengaturan kecepatan */}
        <div className="card-de p-5 mb-6">
          <h3 className="font-sans font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            ⚙️ Kecepatan Bicara
          </h3>
          <div className="flex gap-3 flex-wrap">
            {kecepatanOpts.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setKecepatan(opt.value)}
                className="px-4 py-2 rounded-xl font-sans font-semibold text-sm transition"
                style={
                  kecepatan === opt.value
                    ? { backgroundColor: "var(--brand)", color: "var(--text-inverse)" }
                    : { backgroundColor: "var(--bg-subtle)", color: "var(--text-secondary)", border: "1px solid var(--border)" }
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="font-sans text-xs mt-2" style={{ color: "var(--text-muted)" }}>
            💡 Tips: Mulai dengan kecepatan Lambat, lalu tingkatkan setelah terbiasa.
          </p>
        </div>

        {/* Daftar materi */}
        {materiListening.map((kat) => (
          <div key={kat.id} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{kat.emoji}</span>
              <h2 className="font-serif text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                {kat.kategori}
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              {kat.daftar.map((item, idx) => {
                const idUnik = `${kat.id}-${idx}`;
                const diputar = sedangDiputar === idUnik;
                const badge = badgeTingkat(item.tingkat);

                return (
                  <div
                    key={idx}
                    className="card-de flex items-center gap-4 p-4 transition"
                    style={diputar ? { borderColor: "var(--brand)", borderWidth: "1.5px" } : {}}
                  >
                    {/* Tombol putar */}
                    <button
                      onClick={() => putarSuara(item.teks, idUnik)}
                      className="w-12 h-12 rounded-full flex items-center justify-center text-xl transition shadow-sm flex-shrink-0"
                      style={
                        diputar
                          ? { backgroundColor: "var(--brand)", color: "var(--text-inverse)" }
                          : { backgroundColor: "var(--brand-light)", color: "var(--brand)" }
                      }
                    >
                      {diputar ? "⏸" : "▶"}
                    </button>

                    {/* Teks */}
                    <div className="flex-1">
                      <p className="font-serif font-semibold text-lg" style={{ color: "var(--text-primary)" }}>
                        {item.teks}
                      </p>
                      <p className="font-sans text-sm" style={{ color: "var(--text-muted)" }}>
                        {item.arti}
                      </p>
                    </div>

                    {/* Badge tingkat */}
                    <span
                      className="font-sans text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0"
                      style={{ backgroundColor: badge.bg, color: badge.color }}
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
        <div
          className="rounded-xl p-4 font-sans text-sm"
          style={{ backgroundColor: "var(--brand-light)", border: "1px solid var(--border)", color: "var(--brand)" }}
        >
          🔊 <strong>Catatan:</strong>{" "}
          <span style={{ color: "var(--text-secondary)" }}>
            Fitur suara menggunakan Web Speech API bawaan browser. Pastikan volume sudah aktif. Bekerja paling baik di Chrome atau Edge.
          </span>
        </div>
      </div>
    </main>
  );
}
