// Quiz Typing — terjemahkan kalimat Indonesia ke Inggris dengan mengetik sendiri
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { useSound } from "@/hooks/useSound";

// Pool kalimat: tampilkan Indonesia, user ketik Inggris
// Kunci jawaban = semua varian yang diterima (array)
const soalPool = [
  // Sapaan & Perkenalan
  { id: 1, indonesia: "Selamat pagi!", jawaban: ["Good morning!","Good morning"], level: "mudah" },
  { id: 2, indonesia: "Apa kabar?", jawaban: ["How are you?","How are you"], level: "mudah" },
  { id: 3, indonesia: "Nama saya adalah Budi.", jawaban: ["My name is Budi.","My name is Budi"], level: "mudah" },
  { id: 4, indonesia: "Senang bertemu denganmu!", jawaban: ["Nice to meet you!","Nice to meet you"], level: "mudah" },
  { id: 5, indonesia: "Saya dari Indonesia.", jawaban: ["I'm from Indonesia.","I am from Indonesia.","I'm from Indonesia","I am from Indonesia"], level: "mudah" },
  // Sehari-hari
  { id: 6, indonesia: "Saya tidak mengerti.", jawaban: ["I don't understand.","I do not understand.","I don't understand","I do not understand"], level: "mudah" },
  { id: 7, indonesia: "Tolong bicara lebih pelan.", jawaban: ["Please speak slowly.","Please speak slowly"], level: "mudah" },
  { id: 8, indonesia: "Bisakah kamu ulangi itu?", jawaban: ["Can you repeat that?","Can you repeat that"], level: "mudah" },
  { id: 9, indonesia: "Tentu saja!", jawaban: ["Of course!","Of course"] , level: "mudah" },
  { id: 10, indonesia: "Tidak masalah!", jawaban: ["No problem!","No problem"], level: "mudah" },
  // Present tense
  { id: 11, indonesia: "Saya makan nasi setiap hari.", jawaban: ["I eat rice every day.","I eat rice every day"], level: "a2" },
  { id: 12, indonesia: "Dia belajar setiap malam.", jawaban: ["She studies every night.","He studies every night.","She studies every night","He studies every night"], level: "a2" },
  { id: 13, indonesia: "Mereka bermain sepak bola.", jawaban: ["They play football.","They play soccer.","They play football","They play soccer"], level: "a2" },
  { id: 14, indonesia: "Saya tidak suka ikan.", jawaban: ["I don't like fish.","I do not like fish.","I don't like fish","I do not like fish"], level: "a2" },
  { id: 15, indonesia: "Apakah kamu suka kopi?", jawaban: ["Do you like coffee?","Do you like coffee"], level: "a2" },
  // To be
  { id: 16, indonesia: "Saya adalah seorang pelajar.", jawaban: ["I am a student.","I'm a student.","I am a student","I'm a student"], level: "mudah" },
  { id: 17, indonesia: "Dia adalah guru.", jawaban: ["He is a teacher.","She is a teacher.","He is a teacher","She is a teacher"], level: "mudah" },
  { id: 18, indonesia: "Apakah kamu senang?", jawaban: ["Are you happy?","Are you happy"], level: "mudah" },
  { id: 19, indonesia: "Langit berwarna biru.", jawaban: ["The sky is blue.","The sky is blue"], level: "mudah" },
  { id: 20, indonesia: "Ini adalah seekor anjing.", jawaban: ["This is a dog.","This is a dog"], level: "mudah" },
  // Kalimat lebih panjang
  { id: 21, indonesia: "Saya sedang belajar sekarang.", jawaban: ["I am studying now.","I'm studying now.","I am studying now","I'm studying now"], level: "a2" },
  { id: 22, indonesia: "Dia pergi ke pasar kemarin.", jawaban: ["She went to the market yesterday.","He went to the market yesterday.","She went to the market yesterday","He went to the market yesterday"], level: "a2" },
  { id: 23, indonesia: "Saya akan pergi ke Bali besok.", jawaban: ["I will go to Bali tomorrow.","I will go to Bali tomorrow"], level: "a2" },
  { id: 24, indonesia: "Kamu sebaiknya belajar lebih rajin.", jawaban: ["You should study harder.","You should study harder"], level: "a2" },
  { id: 25, indonesia: "Saya bisa berbicara bahasa Inggris.", jawaban: ["I can speak English.","I can speak English"], level: "a2" },
  // Pertanyaan
  { id: 26, indonesia: "Di mana toiletnya?", jawaban: ["Where is the toilet?","Where is the toilet"], level: "mudah" },
  { id: 27, indonesia: "Berapa harganya?", jawaban: ["How much is it?","How much does it cost?","How much is it","How much does it cost"], level: "mudah" },
  { id: 28, indonesia: "Apa yang sedang kamu lakukan?", jawaban: ["What are you doing?","What are you doing"], level: "a2" },
  { id: 29, indonesia: "Di mana kamu tinggal?", jawaban: ["Where do you live?","Where do you live"], level: "a2" },
  { id: 30, indonesia: "Kapan ujiannya?", jawaban: ["When is the exam?","When is the exam"], level: "mudah" },
  // Kalimat advanced
  { id: 31, indonesia: "Dia lebih tinggi dari saya.", jawaban: ["He is taller than me.","She is taller than me.","He is taller than me","She is taller than me"], level: "a2" },
  { id: 32, indonesia: "Matahari terbit di timur.", jawaban: ["The sun rises in the east.","The sun rises in the east"], level: "a2" },
  { id: 33, indonesia: "Saya tidak pernah makan daging.", jawaban: ["I have never eaten meat.","I have never eaten meat"], level: "sulit" },
  { id: 34, indonesia: "Buku itu ada di atas meja.", jawaban: ["The book is on the table.","The book is on the table"], level: "a2" },
  { id: 35, indonesia: "Tolong jangan berisik.", jawaban: ["Please don't be noisy.","Don't be noisy, please.","Please don't be noisy","Don't be noisy please"], level: "a2" },
  { id: 36, indonesia: "Saya sudah makan tadi.", jawaban: ["I have already eaten.","I've already eaten.","I have already eaten","I've already eaten"], level: "sulit" },
  { id: 37, indonesia: "Sebuah apel sehari membuat dokter menjauh.", jawaban: ["An apple a day keeps the doctor away.","An apple a day keeps the doctor away"], level: "sulit" },
  { id: 38, indonesia: "Bahasa Inggris itu menyenangkan!", jawaban: ["English is fun!","English is fun"], level: "mudah" },
  { id: 39, indonesia: "Saya butuh lebih banyak latihan.", jawaban: ["I need more practice.","I need more practice"], level: "mudah" },
  { id: 40, indonesia: "Jangan khawatir, saya baik-baik saja.", jawaban: ["Don't worry, I'm okay.","Don't worry, I am okay.","Don't worry, I'm okay","Don't worry I'm okay"], level: "a2" },
];

const JUMLAH_SOAL = 15;

function normalize(str) {
  return str.trim().toLowerCase().replace(/[.,!?]+$/, "").trim();
}

function cekJawaban(input, jawabanArr) {
  const a = normalize(input);
  for (const j of jawabanArr) {
    if (normalize(j) === a) return "benar";
  }
  // Cek hampir benar: bandingkan dengan jawaban pertama (utama)
  const b = normalize(jawabanArr[0]);
  if (b.length > 8) {
    const maxLen = Math.max(a.length, b.length);
    let diff = 0;
    for (let i = 0; i < maxLen; i++) {
      if ((a[i] || "") !== (b[i] || "")) diff++;
      if (diff > 2) return "salah";
    }
    if (diff <= 2) return "hampir";
  }
  return "salah";
}

function acakSoal(arr, n) {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

export default function TypingQuizPage() {
  const [mulai, setMulai] = useState(false);
  const [soalList, setSoalList] = useState([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [hasil, setHasil] = useState(null);
  const [skor, setSkor] = useState(0);
  const [selesai, setSelesai] = useState(false);
  const [riwayat, setRiwayat] = useState([]);
  const inputRef = useRef(null);
  const { recordQuiz } = useProgress();
  const { bunyiBenar, bunyiSalah, bunyiSelesai } = useSound();

  useEffect(() => {
    if (mulai) setTimeout(() => inputRef.current?.focus(), 100);
  }, [index, mulai]);

  function mulaiQuiz() {
    setSoalList(acakSoal(soalPool, JUMLAH_SOAL));
    setIndex(0);
    setInput("");
    setHasil(null);
    setSkor(0);
    setSelesai(false);
    setRiwayat([]);
    setMulai(true);
  }

  function cek() {
    if (!input.trim() || hasil) return;
    const soal = soalList[index];
    const status = cekJawaban(input, soal.jawaban);
    setHasil(status);
    const hitungBenar = status === "benar" || status === "hampir";
    if (hitungBenar) { setSkor((s) => s + 1); bunyiBenar(); }
    else { bunyiSalah(); }
    setRiwayat((prev) => [...prev, {
      indonesia: soal.indonesia,
      jawaban: input.trim(),
      kunci: soal.jawaban[0],
      status,
    }]);
  }

  function lanjut() {
    if (index + 1 >= soalList.length) {
      recordQuiz("typing", skor, soalList.length);
      setSelesai(true);
      bunyiSelesai();
    } else {
      setIndex((i) => i + 1);
      setInput("");
      setHasil(null);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter") {
      if (!hasil) cek();
      else lanjut();
    }
  }

  const soalSaatIni = soalList[index];
  const persen = Math.round((skor / JUMLAH_SOAL) * 100);

  // Layar awal
  if (!mulai) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link href="/quiz" className="text-indigo-500 hover:text-indigo-700 text-2xl">←</Link>
            <h1 className="text-xl font-bold text-violet-700">⌨️ Typing Quiz</h1>
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center">
            <div className="text-6xl mb-4">⌨️</div>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Latihan Mengetik</h2>
            <p className="text-gray-500 text-sm mb-6">
              Baca kalimat bahasa Indonesia, lalu ketik sendiri terjemahannya dalam bahasa Inggris.
              Lebih efektif dari pilihan ganda!
            </p>
            <div className="bg-violet-50 rounded-2xl p-4 mb-6 text-left">
              <p className="font-bold text-violet-700 mb-2">ℹ️ Cara bermain:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Baca kalimat bahasa Indonesia</li>
                <li>• Ketik terjemahan bahasa Inggris</li>
                <li>• Tekan Enter atau klik Cek</li>
                <li>• Typo ringan masih dihitung ≈ hampir benar</li>
              </ul>
            </div>
            <p className="text-gray-400 text-xs mb-5">{JUMLAH_SOAL} soal acak dari {soalPool.length} kalimat</p>
            <button
              onClick={mulaiQuiz}
              className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-extrabold text-lg rounded-2xl shadow-lg hover:opacity-90 transition"
            >
              Mulai Latihan →
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Layar selesai
  if (selesai) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link href="/quiz" className="text-indigo-500 hover:text-indigo-700 text-2xl">←</Link>
            <h1 className="text-xl font-bold text-violet-700">⌨️ Typing Quiz</h1>
          </div>
        </header>
        <div className="max-w-xl mx-auto px-4 py-8">
          <div className={`rounded-3xl p-8 text-center shadow-lg mb-6 text-white ${
            persen >= 80 ? "bg-gradient-to-br from-green-400 to-emerald-500"
            : persen >= 60 ? "bg-gradient-to-br from-yellow-400 to-orange-400"
            : "bg-gradient-to-br from-red-400 to-rose-500"
          }`}>
            <div className="text-5xl mb-3">{persen >= 80 ? "🎉" : persen >= 60 ? "👍" : "💪"}</div>
            <p className="text-4xl font-extrabold mb-1">{persen}%</p>
            <p className="text-xl font-bold mb-1">{skor} / {JUMLAH_SOAL} Benar</p>
            <p className="text-sm opacity-90">
              {persen >= 80 ? "Luar biasa! Mengetik kalimat bahasa Inggris seperti pro!" : persen >= 60 ? "Bagus! Terus latihan." : "Jangan menyerah, coba lagi!"}
            </p>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            {riwayat.map((item, i) => (
              <div key={i} className={`rounded-2xl p-4 border-2 ${
                item.status === "benar" ? "bg-green-50 border-green-200"
                : item.status === "hampir" ? "bg-yellow-50 border-yellow-200"
                : "bg-red-50 border-red-200"
              }`}>
                <p className="text-xs text-gray-400 mb-1">🇮🇩 {item.indonesia}</p>
                <p className={`font-semibold text-sm ${
                  item.status === "benar" ? "text-green-700"
                  : item.status === "hampir" ? "text-yellow-700"
                  : "text-red-600"
                }`}>
                  {item.status === "benar" ? "✓ " : item.status === "hampir" ? "≈ " : "✗ "}
                  Kamu: &ldquo;{item.jawaban}&rdquo;
                </p>
                {item.status !== "benar" && (
                  <p className="text-green-700 font-bold text-sm mt-1">✅ {item.kunci}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={mulaiQuiz}
              className="flex-1 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg"
            >
              🔄 Coba Lagi
            </button>
            <Link href="/quiz" className="flex-1">
              <div className="w-full py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl text-center">
                ← Quiz Lain
              </div>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Layar quiz
  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/quiz" className="text-indigo-500 hover:text-indigo-700 text-2xl">←</Link>
          <div className="flex-1">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Soal {index + 1} / {JUMLAH_SOAL}</span>
              <span>Skor: {skor}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-violet-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((index) / JUMLAH_SOAL) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-8">
        {/* Badge level */}
        <div className="flex justify-end mb-3">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            soalSaatIni.level === "mudah" ? "bg-green-100 text-green-700"
            : soalSaatIni.level === "a2" ? "bg-yellow-100 text-yellow-700"
            : "bg-red-100 text-red-700"
          }`}>
            {soalSaatIni.level === "mudah" ? "🟢 Mudah" : soalSaatIni.level === "a2" ? "🟡 A2" : "🔴 Sulit"}
          </span>
        </div>

        {/* Kartu soal */}
        <div className="bg-white rounded-3xl border-2 border-violet-200 p-6 mb-6 shadow-md">
          <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wide">Terjemahkan ke bahasa Inggris:</p>
          <p className="text-2xl font-extrabold text-gray-800 leading-snug">{soalSaatIni.indonesia}</p>
        </div>

        {/* Input */}
        <div className="mb-4">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={!!hasil}
            placeholder="Ketik jawaban dalam bahasa Inggris..."
            className={`w-full px-5 py-4 rounded-2xl border-2 text-base font-semibold focus:outline-none transition ${
              hasil === "benar" ? "border-green-400 bg-green-50 text-green-700"
              : hasil === "hampir" ? "border-yellow-400 bg-yellow-50 text-yellow-700"
              : hasil === "salah" ? "border-red-400 bg-red-50 text-red-600"
              : "border-gray-200 bg-white text-gray-800 focus:border-violet-400"
            }`}
          />
        </div>

        {/* Feedback */}
        {hasil && (
          <div className={`rounded-2xl p-4 mb-4 border-2 ${
            hasil === "benar" ? "bg-green-50 border-green-200"
            : hasil === "hampir" ? "bg-yellow-50 border-yellow-200"
            : "bg-red-50 border-red-200"
          }`}>
            <p className={`font-bold text-base ${
              hasil === "benar" ? "text-green-700"
              : hasil === "hampir" ? "text-yellow-700"
              : "text-red-600"
            }`}>
              {hasil === "benar" ? "✓ Benar!" : hasil === "hampir" ? "≈ Hampir benar! (skor dihitung)" : "✗ Kurang tepat"}
            </p>
            {hasil !== "benar" && (
              <p className="text-green-700 font-semibold text-sm mt-1">
                Jawaban: <span className="font-bold">{soalSaatIni.jawaban[0]}</span>
              </p>
            )}
          </div>
        )}

        {/* Tombol */}
        {!hasil ? (
          <button
            onClick={cek}
            disabled={!input.trim()}
            className={`w-full py-4 rounded-2xl text-white font-bold text-base transition ${
              input.trim()
                ? "bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg hover:opacity-90"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Cek Jawaban
          </button>
        ) : (
          <button
            onClick={lanjut}
            className="w-full py-4 rounded-2xl text-white font-bold text-base bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg"
          >
            {index + 1 >= soalList.length ? "Lihat Hasil →" : "Lanjut →"}
          </button>
        )}
      </div>
    </main>
  );
}
