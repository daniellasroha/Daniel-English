// Halaman Daily Challenge — 3 soal setiap hari, streak dari useProgress
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useProgress, hitungStreak } from "@/hooks/useProgress";
import { useSound } from "@/hooks/useSound";

const ACCENT = "#7C3AED";

// ─── POOL SOAL (150+ soal) ────────────────────────────────────────────────────
const soalPool = [
  { pertanyaan: "Apa arti 'Elephant'?", pilihan: ["Kelinci","Harimau","Gajah","Ular"], jawaban: 2 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Kupu-kupu'?", pilihan: ["Bee","Butterfly","Dragonfly","Ant"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Rooster'?", pilihan: ["Bebek","Ayam Betina","Ayam Jantan","Burung"], jawaban: 2 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Kuda'?", pilihan: ["Cow","Horse","Sheep","Goat"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Dolphin'?", pilihan: ["Hiu","Paus","Lumba-lumba","Gurita"], jawaban: 2 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Singa'?", pilihan: ["Tiger","Bear","Lion","Wolf"], jawaban: 2 },
  { pertanyaan: "Apa arti 'Giraffe'?", pilihan: ["Zebra","Jerapah","Kuda Nil","Badak"], jawaban: 1 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Lebah'?", pilihan: ["Ant","Fly","Bee","Worm"], jawaban: 2 },
  { pertanyaan: "Apa arti 'Penguin'?", pilihan: ["Pinguin","Elang","Merpati","Flamingo"], jawaban: 0 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Kucing'?", pilihan: ["Dog","Cat","Bird","Fish"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Rabbit'?", pilihan: ["Tikus","Kelinci","Hamster","Tupai"], jawaban: 1 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Ular'?", pilihan: ["Lizard","Crocodile","Snake","Frog"], jawaban: 2 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Apel'?", pilihan: ["Orange","Mango","Apple","Grape"], jawaban: 2 },
  { pertanyaan: "Apa arti 'Watermelon'?", pilihan: ["Melon","Semangka","Pisang","Mangga"], jawaban: 1 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Nanas'?", pilihan: ["Peach","Plum","Pineapple","Papaya"], jawaban: 2 },
  { pertanyaan: "Apa arti 'Strawberry'?", pilihan: ["Blueberry","Stroberi","Anggur","Ceri"], jawaban: 1 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Mangga'?", pilihan: ["Melon","Lemon","Mango","Guava"], jawaban: 2 },
  { pertanyaan: "Apa arti 'Coconut'?", pilihan: ["Kelapa","Alpukat","Durian","Rambutan"], jawaban: 0 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Tomat'?", pilihan: ["Potato","Tomato","Carrot","Onion"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Spinach'?", pilihan: ["Brokoli","Bayam","Kangkung","Selada"], jawaban: 1 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Telur'?", pilihan: ["Milk","Egg","Meat","Fish"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Bread'?", pilihan: ["Kue","Nasi","Roti","Mie"], jawaban: 2 },
  { pertanyaan: "Kata 'Beautiful' artinya...", pilihan: ["Jelek","Cantik/Indah","Marah","Sedih"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Nervous'?", pilihan: ["Marah","Bahagia","Gugup","Bosan"], jawaban: 2 },
  { pertanyaan: "Kata 'Generous' artinya...", pilihan: ["Pemalas","Dermawan","Penakut","Sombong"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Delicious'?", pilihan: ["Hambar","Pahit","Lezat","Asam"], jawaban: 2 },
  { pertanyaan: "Apa arti 'Proud'?", pilihan: ["Malu","Bangga","Sedih","Takut"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Courage'?", pilihan: ["Kesabaran","Keberanian","Kebijakan","Kejujuran"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Exhausted'?", pilihan: ["Senang","Kelelahan","Lapar","Ngantuk"], jawaban: 1 },
  { pertanyaan: "Kata 'Honest' artinya...", pilihan: ["Pintar","Jujur","Rajin","Pemberani"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Furious'?", pilihan: ["Sedih","Takut","Sangat Marah","Bingung"], jawaban: 2 },
  { pertanyaan: "Kata 'Shy' artinya...", pilihan: ["Pemalu","Pemarah","Pemalas","Pelit"], jawaban: 0 },
  { pertanyaan: "Apa arti 'Clever'?", pilihan: ["Kuat","Cepat","Pintar","Baik"], jawaban: 2 },
  { pertanyaan: "Kata 'Brave' artinya...", pilihan: ["Penakut","Pemberani","Pemalu","Pemalas"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Lonely'?", pilihan: ["Ramai","Kesepian","Gembira","Bosan"], jawaban: 1 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Berlari'?", pilihan: ["Jump","Run","Walk","Swim"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Laugh'?", pilihan: ["Menangis","Tidur","Tertawa","Berlari"], jawaban: 2 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Memasak'?", pilihan: ["Clean","Cook","Wash","Eat"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Listen'?", pilihan: ["Melihat","Mendengarkan","Berbicara","Membaca"], jawaban: 1 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Menulis'?", pilihan: ["Read","Draw","Write","Print"], jawaban: 2 },
  { pertanyaan: "Apa arti 'Carry'?", pilihan: ["Menjatuhkan","Membawa","Menaruh","Mengangkat"], jawaban: 1 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Belajar'?", pilihan: ["Teach","Study","Know","Think"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Choose'?", pilihan: ["Membeli","Memilih","Mencari","Menemukan"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Library'?", pilihan: ["Laboratorium","Perpustakaan","Kantor","Toko"], jawaban: 1 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Rumah Sakit'?", pilihan: ["Hotel","Hospital","School","Market"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Mountain'?", pilihan: ["Pantai","Sungai","Gunung","Danau"], jawaban: 2 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Jembatan'?", pilihan: ["Road","Bridge","Tunnel","Gate"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Pharmacy'?", pilihan: ["Toko Buku","Apotek","Warung","Klinik"], jawaban: 1 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Stasiun'?", pilihan: ["Airport","Harbor","Station","Terminal"], jawaban: 2 },
  { pertanyaan: "Apa arti 'Umbrella'?", pilihan: ["Tas","Payung","Topi","Sarung Tangan"], jawaban: 1 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Kunci'?", pilihan: ["Lock","Key","Door","Handle"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Pillow'?", pilihan: ["Selimut","Kasur","Bantal","Sprei"], jawaban: 2 },
  { pertanyaan: "To Be untuk 'They': They ___ students.", pilihan: ["is","am","are","be"], jawaban: 2 },
  { pertanyaan: "Pilih To Be yang benar: 'I ___ a student.'", pilihan: ["is","am","are","be"], jawaban: 1 },
  { pertanyaan: "Pilih To Be yang benar: 'She ___ happy.'", pilihan: ["am","is","are","be"], jawaban: 1 },
  { pertanyaan: "Simple Present 'She': She ___ (go) to school.", pilihan: ["go","goes","went","going"], jawaban: 1 },
  { pertanyaan: "Kalimat negatif: He ___ like coffee.", pilihan: ["not","don't","doesn't","isn't"], jawaban: 2 },
  { pertanyaan: "Past tense dari 'go' adalah...", pilihan: ["goed","goes","went","gone"], jawaban: 2 },
  { pertanyaan: "Past tense dari 'eat' adalah...", pilihan: ["eated","aten","ate","eats"], jawaban: 2 },
  { pertanyaan: "Modal verb untuk kemampuan: I ___ speak English.", pilihan: ["will","can","must","should"], jawaban: 1 },
  { pertanyaan: "Comparative: She is ___ than her sister. (tall)", pilihan: ["more tall","tallest","taller","tall"], jawaban: 2 },
  { pertanyaan: "Artikel untuk kata benda vokal: ___ apple.", pilihan: ["a","an","the","—"], jawaban: 1 },
  { pertanyaan: "Kata tanya untuk menanyakan tempat: ___?", pilihan: ["What","Who","Where","When"], jawaban: 2 },
  { pertanyaan: "Kata tanya untuk menanyakan waktu: ___?", pilihan: ["Why","How","Where","When"], jawaban: 3 },
  { pertanyaan: "Preposisi waktu: I was born ___ 2005.", pilihan: ["in","on","at","by"], jawaban: 0 },
  { pertanyaan: "Preposisi waktu: The meeting is ___ Monday.", pilihan: ["in","on","at","by"], jawaban: 1 },
  { pertanyaan: "Terjemahkan: 'Saya suka belajar bahasa Inggris.'", pilihan: ["I liked study English.","I like to study English.","I am like English.","I study like English."], jawaban: 1 },
  { pertanyaan: "Terjemahkan: 'Berapa harga buku ini?'", pilihan: ["How many is this book?","How much is this book?","What price is this book?","How much this book is?"], jawaban: 1 },
  { pertanyaan: "Terjemahkan: 'Tolong tutup pintunya.'", pilihan: ["Please close the door.","Please closing the door.","Please closed the door.","You close the door please."], jawaban: 0 },
];

const KEY_DAILY = "daniel_english_daily";
const SOAL_PER_HARI = 3;

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function getSoalHariIni() {
  const today = todayStr();
  let hash = 0;
  for (let i = 0; i < today.length; i++) hash = (hash * 31 + today.charCodeAt(i)) % soalPool.length;
  const result = [];
  const used = new Set();
  for (let i = 0; i < SOAL_PER_HARI; i++) {
    let idx = (hash + i * 37) % soalPool.length;
    while (used.has(idx)) idx = (idx + 1) % soalPool.length;
    used.add(idx);
    result.push({ ...soalPool[idx], _idx: idx });
  }
  return result;
}

export default function DailyChallengePage() {
  const [soalHariIni] = useState(() => getSoalHariIni());
  const [jawabanUser, setJawabanUser] = useState([]);
  const [soalAktif, setSoalAktif] = useState(0);
  const [sudahSelesai, setSudahSelesai] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const { data, recordSession } = useProgress();
  const { bunyiBenar, bunyiSalah, bunyiSelesai } = useSound();
  const streak = data ? hitungStreak(data.sessions) : 0;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY_DAILY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.date === todayStr()) {
          setJawabanUser(parsed.jawaban || []);
          setSoalAktif(soalHariIni.length);
          setSudahSelesai(true);
        }
      }
    } catch {}
    setLoaded(true);
  }, []);

  function jawab(idx) {
    if (jawabanUser[soalAktif] !== undefined) return;
    const newJawaban = [...jawabanUser];
    newJawaban[soalAktif] = idx;
    setJawabanUser(newJawaban);
    if (idx === soalHariIni[soalAktif]?.jawaban) bunyiBenar(); else bunyiSalah();
    if (soalAktif === soalHariIni.length - 1) {
      setTimeout(() => {
        setSudahSelesai(true);
        setSoalAktif(soalHariIni.length);
        localStorage.setItem(KEY_DAILY, JSON.stringify({ date: todayStr(), jawaban: newJawaban }));
        recordSession();
        bunyiSelesai();
      }, 800);
    } else {
      setTimeout(() => setSoalAktif((n) => n + 1), 800);
    }
  }

  function lanjut() {
    if (soalAktif < soalHariIni.length - 1) setSoalAktif((n) => n + 1);
  }

  if (!loaded) return null;

  const benarCount = jawabanUser.filter((j, i) => j === soalHariIni[i]?.jawaban).length;
  const soalSekarang = soalHariIni[soalAktif] || null;
  const sudahJawabSekarang = jawabanUser[soalAktif] !== undefined;

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      {/* Header */}
      <header className="sticky top-0 z-10" style={{ backgroundColor: "var(--bg-paper)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-xl mx-auto px-5 py-4 flex items-center gap-4">
          <Link href="/" aria-label="Kembali" className="text-2xl transition-opacity hover:opacity-70" style={{ color: "var(--brand)" }}>←</Link>
          <div className="flex-1">
            <h1 className="font-serif text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
              ⚡ Daily Challenge
            </h1>
            <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
              {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          <div
            className="flex items-center gap-1 px-3 py-1.5 rounded-full font-sans text-sm font-bold"
            style={{ backgroundColor: "var(--gold-light)", color: "var(--gold)" }}
          >
            🔥 {streak} hari
          </div>
        </div>

        {!sudahSelesai && (
          <div className="max-w-xl mx-auto px-5 pb-3">
            <div className="flex gap-1.5">
              {soalHariIni.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-1.5 rounded-full transition-all"
                  style={{
                    backgroundColor:
                      i < soalAktif ? ACCENT : i === soalAktif ? `${ACCENT}80` : "var(--border)",
                  }}
                />
              ))}
            </div>
            <p className="font-sans text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Soal {Math.min(soalAktif + 1, soalHariIni.length)} dari {soalHariIni.length}
            </p>
          </div>
        )}
      </header>

      <div className="max-w-xl mx-auto px-5 py-8">
        {/* ─── Layar selesai ─────────────────────────────────────────────────── */}
        {sudahSelesai ? (
          <div className="flex flex-col gap-5">
            <div className="card-de p-8 text-center" style={{ position: "relative", overflow: "hidden" }}>
              <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: ACCENT }} />
              <div className="text-6xl mb-3">
                {benarCount === soalHariIni.length ? "🏆" : benarCount >= 2 ? "🌟" : "💪"}
              </div>
              <h2 className="font-serif text-2xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                {benarCount === soalHariIni.length ? "Sempurna!" : benarCount >= 2 ? "Bagus!" : "Tetap Semangat!"}
              </h2>
              <p className="font-sans text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                {benarCount} dari {soalHariIni.length} soal benar
              </p>
              <div className="flex items-center justify-center gap-4 mb-4">
                {soalHariIni.map((_, i) => (
                  <span key={i} className="text-3xl"
                    style={{ color: jawabanUser[i] === soalHariIni[i].jawaban ? "#059669" : "#DC2626" }}>
                    {jawabanUser[i] === soalHariIni[i].jawaban ? "✓" : "✗"}
                  </span>
                ))}
              </div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-sans font-bold text-sm"
                style={{ backgroundColor: "var(--gold-light)", color: "var(--gold)" }}
              >
                🔥 Streak kamu: {streak} hari
              </div>
            </div>

            {/* Review jawaban */}
            <div className="card-de p-5">
              <h3 className="font-serif font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                📋 Review Jawaban
              </h3>
              <div className="flex flex-col gap-3">
                {soalHariIni.map((soal, i) => {
                  const benar = jawabanUser[i] === soal.jawaban;
                  return (
                    <div
                      key={i}
                      className="rounded-xl p-4"
                      style={{
                        border: `2px solid ${benar ? "#059669" : "#DC2626"}`,
                        backgroundColor: benar ? "#D1FAE5" : "#FEE2E2",
                      }}
                    >
                      <p className="font-sans text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                        {i + 1}. {soal.pertanyaan}
                      </p>
                      {!benar && (
                        <p className="font-sans text-xs mb-1" style={{ color: "#DC2626" }}>
                          Jawabanmu: <span className="font-bold">{soal.pilihan[jawabanUser[i]]}</span>
                        </p>
                      )}
                      <p className="font-sans text-xs font-bold" style={{ color: "#065F46" }}>
                        ✓ Jawaban benar: {soal.pilihan[soal.jawaban]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-center font-sans text-sm" style={{ color: "var(--text-muted)" }}>
              Kembali lagi besok untuk soal baru! 🌟
            </p>
          </div>
        ) : (
          /* ─── Layar soal ──────────────────────────────────────────────────── */
          soalSekarang && (
            <div className="card-de p-7" style={{ position: "relative", overflow: "hidden" }}>
              <div className="absolute inset-y-0 left-0 w-[3px]" style={{ backgroundColor: ACCENT }} />

              <div className="text-center mb-6 pl-3">
                <span className="text-5xl">⚡</span>
                <h2 className="font-serif text-xl font-semibold mt-3 leading-snug" style={{ color: "var(--text-primary)" }}>
                  {soalSekarang.pertanyaan}
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {soalSekarang.pilihan.map((p, idx) => {
                  let cardStyle = { backgroundColor: "var(--bg-paper)", border: "2px solid var(--border)", color: "var(--text-primary)" };
                  let icon = null;
                  if (sudahJawabSekarang) {
                    if (idx === soalSekarang.jawaban) {
                      cardStyle = { backgroundColor: "#D1FAE5", border: "2px solid #059669", color: "#065F46" };
                      icon = <span className="float-right font-bold" style={{ color: "#059669" }}>✓</span>;
                    } else if (idx === jawabanUser[soalAktif]) {
                      cardStyle = { backgroundColor: "#FEE2E2", border: "2px solid #DC2626", color: "#7F1D1D" };
                      icon = <span className="float-right font-bold" style={{ color: "#DC2626" }}>✗</span>;
                    } else {
                      cardStyle = { backgroundColor: "var(--bg-subtle)", border: "2px solid var(--border)", color: "var(--text-muted)", opacity: 0.5 };
                    }
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => jawab(idx)}
                      disabled={sudahJawabSekarang}
                      className="w-full text-left px-4 py-3.5 rounded-xl font-sans font-medium transition-all"
                      style={cardStyle}
                    >
                      <span className="font-bold mr-2" style={{ color: ACCENT }}>{["A","B","C","D"][idx]}.</span>
                      {p}{icon}
                    </button>
                  );
                })}
              </div>

              {sudahJawabSekarang && soalAktif < soalHariIni.length - 1 && (
                <button
                  onClick={lanjut}
                  className="btn-primary w-full mt-5 py-3 rounded-2xl font-bold justify-center"
                  style={{ backgroundColor: ACCENT }}
                >
                  Soal Berikutnya →
                </button>
              )}
            </div>
          )
        )}
      </div>
    </main>
  );
}
