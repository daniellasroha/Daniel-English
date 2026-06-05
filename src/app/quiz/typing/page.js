// Quiz Typing — terjemahkan kalimat Indonesia ke Inggris dengan mengetik sendiri
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { useSound } from "@/hooks/useSound";

const ACCENT = "#6D28D9";
const JUMLAH_SOAL = 15;

const soalPool = [
  { id: 1,  indonesia: "Selamat pagi!",                    jawaban: ["Good morning!","Good morning"],                                                                                   level: "mudah" },
  { id: 2,  indonesia: "Apa kabar?",                        jawaban: ["How are you?","How are you"],                                                                                     level: "mudah" },
  { id: 3,  indonesia: "Nama saya adalah Budi.",            jawaban: ["My name is Budi.","My name is Budi"],                                                                             level: "mudah" },
  { id: 4,  indonesia: "Senang bertemu denganmu!",          jawaban: ["Nice to meet you!","Nice to meet you"],                                                                           level: "mudah" },
  { id: 5,  indonesia: "Saya dari Indonesia.",              jawaban: ["I'm from Indonesia.","I am from Indonesia.","I'm from Indonesia","I am from Indonesia"],                          level: "mudah" },
  { id: 6,  indonesia: "Saya tidak mengerti.",              jawaban: ["I don't understand.","I do not understand.","I don't understand","I do not understand"],                          level: "mudah" },
  { id: 7,  indonesia: "Tolong bicara lebih pelan.",        jawaban: ["Please speak slowly.","Please speak slowly"],                                                                     level: "mudah" },
  { id: 8,  indonesia: "Bisakah kamu ulangi itu?",          jawaban: ["Can you repeat that?","Can you repeat that"],                                                                     level: "mudah" },
  { id: 9,  indonesia: "Tentu saja!",                       jawaban: ["Of course!","Of course"],                                                                                         level: "mudah" },
  { id: 10, indonesia: "Tidak masalah!",                    jawaban: ["No problem!","No problem"],                                                                                       level: "mudah" },
  { id: 11, indonesia: "Saya makan nasi setiap hari.",      jawaban: ["I eat rice every day.","I eat rice every day"],                                                                   level: "a2" },
  { id: 12, indonesia: "Dia belajar setiap malam.",         jawaban: ["She studies every night.","He studies every night.","She studies every night","He studies every night"],          level: "a2" },
  { id: 13, indonesia: "Mereka bermain sepak bola.",        jawaban: ["They play football.","They play soccer.","They play football","They play soccer"],                                level: "a2" },
  { id: 14, indonesia: "Saya tidak suka ikan.",             jawaban: ["I don't like fish.","I do not like fish.","I don't like fish","I do not like fish"],                              level: "a2" },
  { id: 15, indonesia: "Apakah kamu suka kopi?",            jawaban: ["Do you like coffee?","Do you like coffee"],                                                                       level: "a2" },
  { id: 16, indonesia: "Saya adalah seorang pelajar.",      jawaban: ["I am a student.","I'm a student.","I am a student","I'm a student"],                                              level: "mudah" },
  { id: 17, indonesia: "Dia adalah guru.",                  jawaban: ["He is a teacher.","She is a teacher.","He is a teacher","She is a teacher"],                                      level: "mudah" },
  { id: 18, indonesia: "Apakah kamu senang?",               jawaban: ["Are you happy?","Are you happy"],                                                                                 level: "mudah" },
  { id: 19, indonesia: "Langit berwarna biru.",             jawaban: ["The sky is blue.","The sky is blue"],                                                                             level: "mudah" },
  { id: 20, indonesia: "Ini adalah seekor anjing.",         jawaban: ["This is a dog.","This is a dog"],                                                                                 level: "mudah" },
  { id: 21, indonesia: "Saya sedang belajar sekarang.",     jawaban: ["I am studying now.","I'm studying now.","I am studying now","I'm studying now"],                                  level: "a2" },
  { id: 22, indonesia: "Dia pergi ke pasar kemarin.",       jawaban: ["She went to the market yesterday.","He went to the market yesterday.","She went to the market yesterday","He went to the market yesterday"], level: "a2" },
  { id: 23, indonesia: "Saya akan pergi ke Bali besok.",    jawaban: ["I will go to Bali tomorrow.","I will go to Bali tomorrow"],                                                       level: "a2" },
  { id: 24, indonesia: "Kamu sebaiknya belajar lebih rajin.",jawaban: ["You should study harder.","You should study harder"],                                                            level: "a2" },
  { id: 25, indonesia: "Saya bisa berbicara bahasa Inggris.",jawaban: ["I can speak English.","I can speak English"],                                                                    level: "a2" },
  { id: 26, indonesia: "Di mana toiletnya?",                jawaban: ["Where is the toilet?","Where is the toilet"],                                                                     level: "mudah" },
  { id: 27, indonesia: "Berapa harganya?",                  jawaban: ["How much is it?","How much does it cost?","How much is it","How much does it cost"],                              level: "mudah" },
  { id: 28, indonesia: "Apa yang sedang kamu lakukan?",     jawaban: ["What are you doing?","What are you doing"],                                                                       level: "a2" },
  { id: 29, indonesia: "Di mana kamu tinggal?",             jawaban: ["Where do you live?","Where do you live"],                                                                         level: "a2" },
  { id: 30, indonesia: "Kapan ujiannya?",                   jawaban: ["When is the exam?","When is the exam"],                                                                           level: "mudah" },
  { id: 31, indonesia: "Dia lebih tinggi dari saya.",       jawaban: ["He is taller than me.","She is taller than me.","He is taller than me","She is taller than me"],                  level: "a2" },
  { id: 32, indonesia: "Matahari terbit di timur.",         jawaban: ["The sun rises in the east.","The sun rises in the east"],                                                         level: "a2" },
  { id: 33, indonesia: "Saya tidak pernah makan daging.",   jawaban: ["I have never eaten meat.","I have never eaten meat"],                                                             level: "sulit" },
  { id: 34, indonesia: "Buku itu ada di atas meja.",        jawaban: ["The book is on the table.","The book is on the table"],                                                           level: "a2" },
  { id: 35, indonesia: "Tolong jangan berisik.",            jawaban: ["Please don't be noisy.","Don't be noisy, please.","Please don't be noisy","Don't be noisy please"],               level: "a2" },
  { id: 36, indonesia: "Saya sudah makan tadi.",            jawaban: ["I have already eaten.","I've already eaten.","I have already eaten","I've already eaten"],                        level: "sulit" },
  { id: 37, indonesia: "Sebuah apel sehari membuat dokter menjauh.", jawaban: ["An apple a day keeps the doctor away.","An apple a day keeps the doctor away"],                         level: "sulit" },
  { id: 38, indonesia: "Bahasa Inggris itu menyenangkan!", jawaban: ["English is fun!","English is fun"],                                                                               level: "mudah" },
  { id: 39, indonesia: "Saya butuh lebih banyak latihan.", jawaban: ["I need more practice.","I need more practice"],                                                                   level: "mudah" },
  { id: 40, indonesia: "Jangan khawatir, saya baik-baik saja.", jawaban: ["Don't worry, I'm okay.","Don't worry, I am okay.","Don't worry, I'm okay","Don't worry I'm okay"],          level: "a2" },
];

function normalize(str) {
  return str.trim().toLowerCase().replace(/[.,!?]+$/, "").trim();
}

function cekJawaban(input, jawabanArr) {
  const a = normalize(input);
  for (const j of jawabanArr) {
    if (normalize(j) === a) return "benar";
  }
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

function levelStyle(level) {
  if (level === "mudah") return { backgroundColor: "#D1FAE5", color: "#065F46" };
  if (level === "a2")    return { backgroundColor: "#FEF3C7", color: "#92400E" };
  return                        { backgroundColor: "#FEE2E2", color: "#7F1D1D" };
}

function levelLabel(level) {
  if (level === "mudah") return "🟢 Mudah";
  if (level === "a2")    return "🟡 A2";
  return "🔴 Sulit";
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
    setIndex(0); setInput(""); setHasil(null);
    setSkor(0); setSelesai(false); setRiwayat([]);
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
    setRiwayat((prev) => [...prev, { indonesia: soal.indonesia, jawaban: input.trim(), kunci: soal.jawaban[0], status }]);
  }

  function lanjut() {
    if (index + 1 >= soalList.length) {
      recordQuiz("typing", skor, soalList.length);
      setSelesai(true);
      bunyiSelesai();
    } else {
      setIndex((i) => i + 1); setInput(""); setHasil(null);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter") {
      if (!hasil) cek(); else lanjut();
    }
  }

  const soalSaatIni = soalList[index];
  const persen = Math.round((skor / JUMLAH_SOAL) * 100);

  // ─── Layar awal ───────────────────────────────────────────────────────────
  if (!mulai) {
    return (
      <main className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-base)" }}>
        <header className="sticky top-0 z-10" style={{ backgroundColor: "var(--bg-paper)", borderBottom: "1px solid var(--border)" }}>
          <div className="max-w-xl mx-auto px-5 py-4 flex items-center gap-4">
            <Link href="/quiz" className="text-2xl hover:opacity-70 transition" style={{ color: "var(--brand)" }}>←</Link>
            <h1 className="font-serif text-xl font-semibold" style={{ color: "var(--text-primary)" }}>✍️ Typing Quiz</h1>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-5 py-10">
          <div className="card-de p-8 max-w-sm w-full text-center" style={{ position: "relative", overflow: "hidden" }}>
            <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: ACCENT }} />

            <div className="text-6xl mb-4">✍️</div>
            <h2 className="font-serif text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Latihan Mengetik
            </h2>
            <p className="font-sans text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              Baca kalimat bahasa Indonesia, lalu ketik sendiri terjemahannya. Lebih efektif dari pilihan ganda!
            </p>

            <div
              className="rounded-xl p-4 mb-6 text-left font-sans text-sm space-y-1"
              style={{ backgroundColor: "var(--bg-subtle)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            >
              <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>ℹ️ Cara bermain:</p>
              <p>• Baca kalimat bahasa Indonesia</p>
              <p>• Ketik terjemahan bahasa Inggris</p>
              <p>• Tekan Enter atau klik Cek</p>
              <p>• Typo ringan masih dihitung ≈ hampir benar</p>
            </div>

            <p className="font-sans text-xs mb-5" style={{ color: "var(--text-muted)" }}>
              {JUMLAH_SOAL} soal acak dari {soalPool.length} kalimat
            </p>
            <button
              onClick={mulaiQuiz}
              className="btn-primary w-full py-4 rounded-xl font-bold text-base justify-center"
              style={{ backgroundColor: ACCENT }}
            >
              Mulai Latihan →
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ─── Layar selesai ────────────────────────────────────────────────────────
  if (selesai) {
    const scoreColor = persen >= 80 ? "#059669" : persen >= 60 ? "#D97706" : "#DC2626";

    return (
      <main className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
        <header className="sticky top-0 z-10" style={{ backgroundColor: "var(--bg-paper)", borderBottom: "1px solid var(--border)" }}>
          <div className="max-w-xl mx-auto px-5 py-4 flex items-center gap-4">
            <Link href="/quiz" className="text-2xl hover:opacity-70 transition" style={{ color: "var(--brand)" }}>←</Link>
            <h1 className="font-serif text-xl font-semibold" style={{ color: "var(--text-primary)" }}>✍️ Typing Quiz</h1>
          </div>
        </header>

        <div className="max-w-xl mx-auto px-5 py-8">
          {/* Kartu skor */}
          <div
            className="card-de p-8 text-center mb-6"
            style={{ position: "relative", overflow: "hidden" }}
          >
            <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: scoreColor }} />
            <div className="text-5xl mb-3">{persen >= 80 ? "🎉" : persen >= 60 ? "👍" : "💪"}</div>
            <p className="font-serif text-4xl font-semibold mb-1" style={{ color: scoreColor }}>{persen}%</p>
            <p className="font-sans text-lg font-bold mb-1" style={{ color: "var(--text-primary)" }}>
              {skor} / {JUMLAH_SOAL} Benar
            </p>
            <p className="font-sans text-sm" style={{ color: "var(--text-secondary)" }}>
              {persen >= 80 ? "Luar biasa! Mengetik kalimat bahasa Inggris seperti pro!" : persen >= 60 ? "Bagus! Terus latihan." : "Jangan menyerah, coba lagi!"}
            </p>
          </div>

          {/* Review per soal */}
          <div className="flex flex-col gap-3 mb-6">
            {riwayat.map((item, i) => {
              const isBenar = item.status === "benar";
              const isHampir = item.status === "hampir";
              return (
                <div
                  key={i}
                  className="rounded-xl p-4"
                  style={{
                    border: `2px solid ${isBenar ? "#059669" : isHampir ? "#D97706" : "#DC2626"}`,
                    backgroundColor: isBenar ? "#D1FAE5" : isHampir ? "#FEF3C7" : "#FEE2E2",
                  }}
                >
                  <p className="font-sans text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                    🇮🇩 {item.indonesia}
                  </p>
                  <p className="font-sans font-semibold text-sm" style={{ color: isBenar ? "#065F46" : isHampir ? "#92400E" : "#7F1D1D" }}>
                    {isBenar ? "✓ " : isHampir ? "≈ " : "✗ "}
                    Kamu: &ldquo;{item.jawaban}&rdquo;
                  </p>
                  {!isBenar && (
                    <p className="font-sans font-bold text-sm mt-1" style={{ color: "#065F46" }}>
                      ✅ {item.kunci}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={mulaiQuiz}
              className="flex-1 py-4 rounded-xl font-sans font-bold text-white hover:opacity-90 transition"
              style={{ backgroundColor: ACCENT }}
            >
              🔄 Coba Lagi
            </button>
            <Link href="/quiz" className="flex-1">
              <div
                className="w-full py-4 rounded-xl font-sans font-bold text-center"
                style={{ backgroundColor: "var(--bg-subtle)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
              >
                ← Quiz Lain
              </div>
            </Link>
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
          <Link href="/quiz" className="text-2xl hover:opacity-70 transition" style={{ color: "var(--brand)" }}>←</Link>
          <div className="flex-1">
            <div className="flex justify-between font-sans text-sm mb-1" style={{ color: "var(--text-muted)" }}>
              <span>Soal {index + 1} / {JUMLAH_SOAL}</span>
              <span>Skor: {skor}</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(index / JUMLAH_SOAL) * 100}%`, backgroundColor: ACCENT }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-5 py-8">
        {/* Badge level */}
        <div className="flex justify-end mb-3">
          <span
            className="font-sans text-xs font-bold px-3 py-1 rounded-full"
            style={levelStyle(soalSaatIni.level)}
          >
            {levelLabel(soalSaatIni.level)}
          </span>
        </div>

        {/* Kartu soal */}
        <div className="card-de p-6 mb-6" style={{ position: "relative", overflow: "hidden" }}>
          <div className="absolute inset-y-0 left-0 w-[3px]" style={{ backgroundColor: ACCENT }} />
          <div className="pl-3">
            <p className="font-sans text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--text-muted)" }}>
              Terjemahkan ke bahasa Inggris:
            </p>
            <p className="font-serif text-2xl font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>
              {soalSaatIni.indonesia}
            </p>
          </div>
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
            className="w-full px-5 py-4 rounded-xl font-sans font-semibold text-base focus:outline-none transition"
            style={
              hasil === "benar"  ? { border: "2px solid #059669", backgroundColor: "#D1FAE5", color: "#065F46" }
              : hasil === "hampir" ? { border: "2px solid #D97706", backgroundColor: "#FEF3C7", color: "#92400E" }
              : hasil === "salah"  ? { border: "2px solid #DC2626", backgroundColor: "#FEE2E2", color: "#7F1D1D" }
              : { border: "2px solid var(--border)", backgroundColor: "var(--bg-paper)", color: "var(--text-primary)" }
            }
          />
        </div>

        {/* Feedback */}
        {hasil && (
          <div
            className="rounded-xl p-4 mb-4 font-sans"
            style={
              hasil === "benar"  ? { border: "2px solid #059669", backgroundColor: "#D1FAE5" }
              : hasil === "hampir" ? { border: "2px solid #D97706", backgroundColor: "#FEF3C7" }
              : { border: "2px solid #DC2626", backgroundColor: "#FEE2E2" }
            }
          >
            <p
              className="font-bold text-base"
              style={{ color: hasil === "benar" ? "#065F46" : hasil === "hampir" ? "#92400E" : "#7F1D1D" }}
            >
              {hasil === "benar" ? "✓ Benar!" : hasil === "hampir" ? "≈ Hampir benar! (skor dihitung)" : "✗ Kurang tepat"}
            </p>
            {hasil !== "benar" && (
              <p className="font-semibold text-sm mt-1" style={{ color: "#065F46" }}>
                Jawaban: <span className="font-bold">{soalSaatIni.jawaban[0]}</span>
              </p>
            )}
          </div>
        )}

        {!hasil ? (
          <button
            onClick={cek}
            disabled={!input.trim()}
            className="w-full py-4 rounded-xl font-sans font-bold text-base text-white transition"
            style={{
              backgroundColor: input.trim() ? ACCENT : "var(--border-strong)",
              opacity: input.trim() ? 1 : 0.5,
              cursor: input.trim() ? "pointer" : "not-allowed",
            }}
          >
            Cek Jawaban
          </button>
        ) : (
          <button
            onClick={lanjut}
            className="btn-primary w-full py-4 rounded-xl font-bold text-base justify-center"
            style={{ backgroundColor: ACCENT }}
          >
            {index + 1 >= soalList.length ? "Lihat Hasil →" : "Lanjut →"}
          </button>
        )}
      </div>
    </main>
  );
}
