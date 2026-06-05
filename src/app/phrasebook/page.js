// Halaman Phrasebook — kalimat percakapan sehari-hari + mode latihan ketik
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const kategoriPhrase = [
  {
    id: 1, judul: "Sapaan & Perkenalan", emoji: "👋",
    accent: "#1D4ED8", iconBg: "#DBEAFE",
    frasa: [
      { english: "Good morning!",         indonesia: "Selamat pagi!",                      konteks: "Sapaan pagi hari" },
      { english: "Good afternoon!",       indonesia: "Selamat siang!",                     konteks: "Sapaan siang hari" },
      { english: "Good evening!",         indonesia: "Selamat malam!",                     konteks: "Sapaan malam hari" },
      { english: "How are you?",          indonesia: "Apa kabar?",                         konteks: "Menanyakan kabar" },
      { english: "I'm fine, thank you!",  indonesia: "Saya baik-baik saja, terima kasih!", konteks: "Menjawab kabar" },
      { english: "What's your name?",     indonesia: "Siapa namamu?",                      konteks: "Menanyakan nama" },
      { english: "My name is Daniel.",    indonesia: "Nama saya Daniel.",                  konteks: "Memperkenalkan diri" },
      { english: "Nice to meet you!",     indonesia: "Senang bertemu denganmu!",           konteks: "Saat pertama kali bertemu" },
      { english: "Where are you from?",   indonesia: "Dari mana kamu berasal?",            konteks: "Menanyakan asal" },
      { english: "I'm from Indonesia.",   indonesia: "Saya dari Indonesia.",               konteks: "Menjawab asal negara" },
    ],
  },
  {
    id: 2, judul: "Percakapan Sehari-hari", emoji: "💬",
    accent: "#059669", iconBg: "#D1FAE5",
    frasa: [
      { english: "Excuse me.",             indonesia: "Permisi.",                          konteks: "Minta perhatian / minta jalan" },
      { english: "I'm sorry.",             indonesia: "Saya minta maaf.",                  konteks: "Meminta maaf" },
      { english: "No problem!",            indonesia: "Tidak masalah!",                    konteks: "Merespons permintaan maaf" },
      { english: "Can you help me?",       indonesia: "Bisakah kamu membantuku?",          konteks: "Meminta bantuan" },
      { english: "Of course!",             indonesia: "Tentu saja!",                       konteks: "Menyatakan kesediaan" },
      { english: "I don't understand.",    indonesia: "Saya tidak mengerti.",              konteks: "Tidak memahami sesuatu" },
      { english: "Please speak slowly.",   indonesia: "Tolong bicara lebih pelan.",        konteks: "Minta bicara lebih lambat" },
      { english: "Can you repeat that?",   indonesia: "Bisakah kamu ulangi itu?",          konteks: "Meminta pengulangan" },
      { english: "What does it mean?",     indonesia: "Apa artinya?",                      konteks: "Menanyakan arti kata" },
      { english: "I agree with you.",      indonesia: "Saya setuju denganmu.",             konteks: "Menyatakan persetujuan" },
    ],
  },
  {
    id: 3, judul: "Di Restoran & Warung", emoji: "🍽️",
    accent: "#D97706", iconBg: "#FEF3C7",
    frasa: [
      { english: "A table for two, please.",    indonesia: "Meja untuk dua orang, tolong.",      konteks: "Memesan tempat duduk" },
      { english: "Can I see the menu?",         indonesia: "Boleh saya lihat menunya?",           konteks: "Meminta menu" },
      { english: "I'd like to order...",        indonesia: "Saya ingin memesan...",               konteks: "Memulai pemesanan" },
      { english: "What do you recommend?",      indonesia: "Apa yang kamu rekomendasikan?",       konteks: "Meminta rekomendasi" },
      { english: "This is delicious!",          indonesia: "Ini enak sekali!",                    konteks: "Memuji makanan" },
      { english: "Can I have the bill?",        indonesia: "Boleh saya minta tagihannya?",        konteks: "Meminta nota" },
      { english: "How much is this?",           indonesia: "Ini harganya berapa?",                konteks: "Menanyakan harga" },
      { english: "Keep the change.",            indonesia: "Kembaliannya buat kamu.",             konteks: "Memberikan tip" },
      { english: "I'm allergic to...",          indonesia: "Saya alergi terhadap...",             konteks: "Memberitahu alergi" },
      { english: "No sugar, please.",           indonesia: "Tanpa gula, tolong.",                 konteks: "Permintaan khusus" },
    ],
  },
  {
    id: 4, judul: "Bertanya Arah", emoji: "🗺️",
    accent: "#7C3AED", iconBg: "#EDE9FE",
    frasa: [
      { english: "Where is the toilet?",           indonesia: "Di mana toiletnya?",                     konteks: "Mencari toilet" },
      { english: "How do I get to...?",             indonesia: "Bagaimana cara ke...?",                  konteks: "Meminta petunjuk arah" },
      { english: "Turn left / right.",              indonesia: "Belok kiri / kanan.",                    konteks: "Memberi arah" },
      { english: "Go straight ahead.",              indonesia: "Jalan terus ke depan.",                  konteks: "Arah lurus" },
      { english: "It's near / far.",                indonesia: "Itu dekat / jauh.",                      konteks: "Menggambarkan jarak" },
      { english: "Is it far from here?",            indonesia: "Apakah jauh dari sini?",                 konteks: "Menanyakan jarak" },
      { english: "Take the bus / taxi.",            indonesia: "Naik bus / taksi.",                      konteks: "Saran transportasi" },
      { english: "I'm lost.",                       indonesia: "Saya tersesat.",                         konteks: "Saat tidak tahu jalan" },
      { english: "Can you show me on the map?",     indonesia: "Bisakah kamu tunjukkan di peta?",        konteks: "Meminta bantuan peta" },
      { english: "It's on the second floor.",       indonesia: "Itu ada di lantai dua.",                 konteks: "Memberi info lokasi" },
    ],
  },
  {
    id: 5, judul: "Di Sekolah & Belajar", emoji: "🏫",
    accent: "#0D9488", iconBg: "#CCFBF1",
    frasa: [
      { english: "May I ask a question?",       indonesia: "Boleh saya bertanya?",                    konteks: "Minta izin bertanya" },
      { english: "I don't know the answer.",    indonesia: "Saya tidak tahu jawabannya.",              konteks: "Mengaku tidak tahu" },
      { english: "Can you explain again?",      indonesia: "Bisakah kamu jelaskan lagi?",              konteks: "Meminta penjelasan ulang" },
      { english: "Let's study together!",       indonesia: "Ayo belajar bersama!",                    konteks: "Mengajak belajar" },
      { english: "I need more practice.",       indonesia: "Saya butuh lebih banyak latihan.",         konteks: "Menyatakan kebutuhan" },
      { english: "What's the homework?",        indonesia: "Apa tugas rumahnya?",                      konteks: "Menanyakan PR" },
      { english: "I finished my homework.",     indonesia: "Saya sudah selesai PR saya.",              konteks: "Memberi tahu sudah selesai" },
      { english: "When is the exam?",           indonesia: "Kapan ujiannya?",                          konteks: "Menanyakan jadwal ujian" },
      { english: "I passed the test!",          indonesia: "Saya lulus tes!",                          konteks: "Memberi kabar lulus" },
      { english: "English is fun!",             indonesia: "Bahasa Inggris itu menyenangkan!",         konteks: "Ekspresi positif" },
    ],
  },
  {
    id: 6, judul: "Darurat & Kesehatan", emoji: "🚨",
    accent: "#DC2626", iconBg: "#FEE2E2",
    frasa: [
      { english: "Help!",                               indonesia: "Tolong!",                                            konteks: "Meminta pertolongan darurat" },
      { english: "Call the police!",                    indonesia: "Panggil polisi!",                                    konteks: "Meminta bantuan polisi" },
      { english: "Call an ambulance!",                  indonesia: "Panggil ambulans!",                                  konteks: "Keadaan darurat medis" },
      { english: "I need a doctor.",                    indonesia: "Saya butuh dokter.",                                 konteks: "Meminta bantuan medis" },
      { english: "I'm not feeling well.",               indonesia: "Saya tidak merasa baik.",                            konteks: "Memberitahu sakit" },
      { english: "It hurts here.",                      indonesia: "Sakit di sini.",                                     konteks: "Menunjuk bagian yang sakit" },
      { english: "I have a fever.",                     indonesia: "Saya demam.",                                        konteks: "Memberitahu gejala" },
      { english: "I'm allergic to penicillin.",         indonesia: "Saya alergi penisilin.",                             konteks: "Info alergi obat" },
      { english: "Where is the nearest hospital?",      indonesia: "Di mana rumah sakit terdekat?",                      konteks: "Mencari rumah sakit" },
      { english: "Don't worry, I'm okay.",              indonesia: "Jangan khawatir, saya baik-baik saja.",              konteks: "Menenangkan orang lain" },
    ],
  },
];

function normalize(str) {
  return str.trim().toLowerCase().replace(/[.,!?]+$/, "").trim();
}

function cekJawaban(input, jawaban) {
  const a = normalize(input);
  const b = normalize(jawaban);
  if (a === b) return "benar";
  if (b.length > 8) {
    let diff = 0;
    const maxLen = Math.max(a.length, b.length);
    for (let i = 0; i < maxLen; i++) {
      if ((a[i] || "") !== (b[i] || "")) diff++;
      if (diff > 1) break;
    }
    if (diff <= 1) return "hampir";
  }
  return "salah";
}

// ─── Komponen Mode Latihan ─────────────────────────────────────────────────────
function ModeLatihan({ kategori, onKembali }) {
  const frasa = kategori.frasa;
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [hasil, setHasil] = useState(null);
  const [skor, setSkor] = useState(0);
  const [selesai, setSelesai] = useState(false);
  const [riwayat, setRiwayat] = useState([]);
  const [sedangDiputar, setSedangDiputar] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100); }, [index]);

  function putar(teks) {
    window.speechSynthesis.cancel();
    const ucapan = new SpeechSynthesisUtterance(teks);
    ucapan.lang = "en-US"; ucapan.rate = 0.85;
    setSedangDiputar(true);
    ucapan.onend = () => setSedangDiputar(false);
    ucapan.onerror = () => setSedangDiputar(false);
    window.speechSynthesis.speak(ucapan);
  }

  function cek() {
    if (!input.trim() || hasil) return;
    const soal = frasa[index];
    const status = cekJawaban(input, soal.english);
    setHasil(status);
    if (status === "benar" || status === "hampir") setSkor((s) => s + 1);
    setRiwayat((prev) => [...prev, { indonesia: soal.indonesia, english: soal.english, jawaban: input.trim(), status }]);
    setTimeout(() => putar(soal.english), 200);
  }

  function lanjut() {
    if (index + 1 >= frasa.length) { setSelesai(true); }
    else { setIndex((i) => i + 1); setInput(""); setHasil(null); }
  }

  function handleKey(e) {
    if (e.key === "Enter") { if (!hasil) cek(); else lanjut(); }
  }

  function ulangi() { setIndex(0); setInput(""); setHasil(null); setSkor(0); setSelesai(false); setRiwayat([]); }

  const persen = Math.round((skor / frasa.length) * 100);
  const soalSaatIni = frasa[index];
  const scoreColor = persen >= 80 ? "#059669" : persen >= 60 ? "#D97706" : "#DC2626";

  // Layar selesai
  if (selesai) {
    return (
      <div className="max-w-xl mx-auto px-5 py-8">
        <div className="card-de p-8 text-center mb-6" style={{ position: "relative", overflow: "hidden" }}>
          <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: scoreColor }} />
          <div className="text-6xl mb-3">{persen >= 80 ? "🎉" : persen >= 60 ? "👍" : "💪"}</div>
          <p className="font-serif text-4xl font-semibold mb-1" style={{ color: scoreColor }}>{persen}%</p>
          <p className="font-sans text-lg font-bold mb-1" style={{ color: "var(--text-primary)" }}>{skor} / {frasa.length} Benar</p>
          <p className="font-sans text-sm" style={{ color: "var(--text-secondary)" }}>
            {persen >= 80 ? "Luar biasa! Kamu hafal frasa ini!" : persen >= 60 ? "Bagus! Latihan lagi untuk sempurna." : "Jangan menyerah! Coba lagi."}
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          {riwayat.map((item, i) => {
            const isBenar = item.status === "benar";
            const isHampir = item.status === "hampir";
            return (
              <div key={i} className="rounded-xl p-4" style={{
                border: `2px solid ${isBenar ? "#059669" : isHampir ? "#D97706" : "#DC2626"}`,
                backgroundColor: isBenar ? "#D1FAE5" : isHampir ? "#FEF3C7" : "#FEE2E2",
              }}>
                <p className="font-sans text-xs mb-1" style={{ color: "var(--text-muted)" }}>🇮🇩 {item.indonesia}</p>
                <p className="font-sans font-semibold text-sm" style={{ color: isBenar ? "#065F46" : isHampir ? "#92400E" : "#7F1D1D" }}>
                  {isBenar ? "✓ " : isHampir ? "≈ " : "✗ "}Kamu: &ldquo;{item.jawaban}&rdquo;
                </p>
                {!isBenar && <p className="font-sans font-bold text-sm mt-1" style={{ color: "#065F46" }}>✅ Jawaban: {item.english}</p>}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-3">
          <button onClick={ulangi} className="btn-primary w-full py-4 rounded-2xl font-bold justify-center" style={{ backgroundColor: kategori.accent }}>
            🔄 Ulangi Latihan
          </button>
          <button onClick={onKembali} className="w-full py-3 rounded-2xl font-sans font-semibold transition"
            style={{ backgroundColor: "var(--bg-subtle)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
            ← Kembali ke Frasa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-6">
      <div className="flex items-center justify-between mb-5">
        <button onClick={onKembali} className="font-sans font-semibold text-sm hover:opacity-70 transition" style={{ color: "var(--brand)" }}>
          ← Kembali
        </button>
        <span className="font-sans text-sm font-bold" style={{ color: "var(--text-muted)" }}>
          {index + 1} / {frasa.length}
        </span>
      </div>

      <div className="w-full h-2 rounded-full mb-6 overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(index / frasa.length) * 100}%`, backgroundColor: kategori.accent }} />
      </div>

      <div className="card-de p-6 mb-5" style={{ position: "relative", overflow: "hidden" }}>
        <div className="absolute inset-y-0 left-0 w-[3px]" style={{ backgroundColor: kategori.accent }} />
        <div className="pl-3">
          <p className="font-sans text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--text-muted)" }}>Terjemahkan ke bahasa Inggris:</p>
          <p className="font-serif text-2xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{soalSaatIni.indonesia}</p>
          <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>📌 {soalSaatIni.konteks}</p>
        </div>
      </div>

      <div className="mb-4">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={!!hasil}
          placeholder="Ketik dalam bahasa Inggris..."
          className="w-full px-5 py-4 rounded-xl font-sans font-semibold text-lg focus:outline-none transition"
          style={
            hasil === "benar"  ? { border: "2px solid #059669", backgroundColor: "#D1FAE5", color: "#065F46" }
            : hasil === "hampir" ? { border: "2px solid #D97706", backgroundColor: "#FEF3C7", color: "#92400E" }
            : hasil === "salah"  ? { border: "2px solid #DC2626", backgroundColor: "#FEE2E2", color: "#7F1D1D" }
            : { border: "2px solid var(--border)", backgroundColor: "var(--bg-paper)", color: "var(--text-primary)" }
          }
        />
      </div>

      {hasil && (
        <div className="rounded-xl p-4 mb-4" style={{
          border: `2px solid ${hasil === "benar" ? "#059669" : hasil === "hampir" ? "#D97706" : "#DC2626"}`,
          backgroundColor: hasil === "benar" ? "#D1FAE5" : hasil === "hampir" ? "#FEF3C7" : "#FEE2E2",
        }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans font-bold text-base" style={{ color: hasil === "benar" ? "#065F46" : hasil === "hampir" ? "#92400E" : "#7F1D1D" }}>
                {hasil === "benar" ? "✓ Benar!" : hasil === "hampir" ? "≈ Hampir benar!" : "✗ Kurang tepat"}
              </p>
              {hasil !== "benar" && (
                <p className="font-sans font-semibold text-sm mt-1" style={{ color: "#065F46" }}>
                  Jawaban: <span className="font-bold">{soalSaatIni.english}</span>
                </p>
              )}
              {hasil === "hampir" && <p className="font-sans text-xs mt-0.5" style={{ color: "#92400E" }}>Skor dihitung karena hampir benar 👍</p>}
            </div>
            <button
              onClick={() => putar(soalSaatIni.english)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 transition"
              style={sedangDiputar ? { backgroundColor: "var(--brand)", color: "var(--text-inverse)" } : { backgroundColor: "var(--brand-light)", color: "var(--brand)" }}
            >
              {sedangDiputar ? "⏹" : "🔊"}
            </button>
          </div>
        </div>
      )}

      {!hasil ? (
        <button
          onClick={cek}
          disabled={!input.trim()}
          className="w-full py-4 rounded-xl font-sans font-bold text-base text-white transition"
          style={{ backgroundColor: input.trim() ? kategori.accent : "var(--border-strong)", opacity: input.trim() ? 1 : 0.5, cursor: input.trim() ? "pointer" : "not-allowed" }}
        >
          Cek Jawaban
        </button>
      ) : (
        <button
          onClick={lanjut}
          className="btn-primary w-full py-4 rounded-xl font-bold text-base justify-center"
          style={{ backgroundColor: kategori.accent }}
        >
          {index + 1 >= frasa.length ? "Lihat Hasil →" : "Lanjut →"}
        </button>
      )}

      <p className="text-center font-sans text-xs mt-3" style={{ color: "var(--text-muted)" }}>
        Skor: {skor} benar dari {index + (hasil ? 1 : 0)} soal
      </p>
    </div>
  );
}

// ─── Halaman utama Phrasebook ──────────────────────────────────────────────────
export default function PhrasebookPage() {
  const [kategoriAktif, setKategoriAktif] = useState(null);
  const [modeLatihan, setModeLatihan] = useState(false);
  const [sedangDiputar, setSedangDiputar] = useState(null);

  function putar(teks, id) {
    window.speechSynthesis.cancel();
    if (sedangDiputar === id) { setSedangDiputar(null); return; }
    const ucapan = new SpeechSynthesisUtterance(teks);
    ucapan.lang = "en-US"; ucapan.rate = 0.85;
    setSedangDiputar(id);
    ucapan.onend = () => setSedangDiputar(null);
    ucapan.onerror = () => setSedangDiputar(null);
    window.speechSynthesis.speak(ucapan);
  }

  function Header({ children }) {
    return (
      <header className="sticky top-0 z-10" style={{ backgroundColor: "var(--bg-paper)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center gap-3">
          {children}
        </div>
      </header>
    );
  }

  // Mode latihan aktif
  if (kategoriAktif && modeLatihan) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
        <Header>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ backgroundColor: kategoriAktif.iconBg, border: "1px solid var(--border)" }}
          >
            {kategoriAktif.emoji}
          </div>
          <div>
            <h1 className="font-serif text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              🎯 Latihan: {kategoriAktif.judul}
            </h1>
            <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>Ketik terjemahan bahasa Inggris</p>
          </div>
        </Header>
        <ModeLatihan kategori={kategoriAktif} onKembali={() => setModeLatihan(false)} />
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      <Header>
        <Link href="/" className="text-2xl transition-opacity hover:opacity-70" style={{ color: "var(--brand)" }}>←</Link>
        <div>
          <h1 className="font-serif text-xl font-semibold" style={{ color: "var(--text-primary)" }}>💬 Phrasebook</h1>
          <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>Kalimat percakapan bahasa Inggris sehari-hari</p>
        </div>
      </Header>

      <div className="max-w-3xl mx-auto px-5 py-6">
        {/* Daftar kategori */}
        {!kategoriAktif && (
          <>
            <p className="text-center font-sans text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              Pilih kategori untuk belajar frasa sehari-hari 👇
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {kategoriPhrase.map((kat) => (
                <button
                  key={kat.id}
                  onClick={() => { setKategoriAktif(kat); setModeLatihan(false); }}
                  className="card-de p-5 text-left group"
                  style={{ position: "relative", overflow: "hidden" }}
                >
                  <div className="absolute inset-y-0 left-0 w-[3px]" style={{ backgroundColor: kat.accent }} />
                  <div className="pl-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
                      style={{ backgroundColor: kat.iconBg, border: "1px solid var(--border)" }}
                    >
                      {kat.emoji}
                    </div>
                    <h3 className="font-serif font-semibold" style={{ color: "var(--text-primary)" }}>{kat.judul}</h3>
                    <p className="font-sans text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                      {kat.frasa.length} frasa · ada latihan ketik
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Daftar frasa dalam kategori */}
        {kategoriAktif && !modeLatihan && (
          <>
            <button
              onClick={() => { setKategoriAktif(null); window.speechSynthesis.cancel(); }}
              className="flex items-center gap-2 font-sans font-semibold text-sm mb-5 hover:opacity-70 transition"
              style={{ color: "var(--brand)" }}
            >
              ← Kembali ke Kategori
            </button>

            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: kategoriAktif.iconBg, border: "1px solid var(--border)" }}
                >
                  {kategoriAktif.emoji}
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
                    {kategoriAktif.judul}
                  </h2>
                  <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
                    {kategoriAktif.frasa.length} frasa — tekan 🔊 untuk dengar
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              {kategoriAktif.frasa.map((f, i) => {
                const id = `${kategoriAktif.id}-${i}`;
                const diputar = sedangDiputar === id;
                return (
                  <div
                    key={i}
                    className="card-de p-4"
                    style={diputar ? { borderColor: kategoriAktif.accent, borderWidth: "1.5px" } : {}}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-serif font-semibold text-base" style={{ color: "var(--text-primary)" }}>{f.english}</p>
                        <p className="font-sans font-semibold text-sm mt-0.5" style={{ color: kategoriAktif.accent }}>{f.indonesia}</p>
                        <p className="font-sans text-xs mt-1" style={{ color: "var(--text-muted)" }}>📌 {f.konteks}</p>
                      </div>
                      <button
                        onClick={() => putar(f.english, id)}
                        className="w-11 h-11 rounded-full flex items-center justify-center text-xl transition flex-shrink-0"
                        style={diputar
                          ? { backgroundColor: kategoriAktif.accent, color: "white" }
                          : { backgroundColor: kategoriAktif.iconBg, color: kategoriAktif.accent }
                        }
                        title="Dengar pengucapan"
                      >
                        {diputar ? "⏹" : "🔊"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setModeLatihan(true)}
              className="btn-primary w-full py-5 rounded-2xl font-bold text-lg justify-center gap-3"
              style={{ backgroundColor: kategoriAktif.accent }}
            >
              <span>🎯 Mulai Latihan Ketik</span>
              <span className="text-sm font-semibold opacity-80">({kategoriAktif.frasa.length} soal)</span>
            </button>
            <p className="text-center font-sans text-xs mt-2" style={{ color: "var(--text-muted)" }}>
              Lihat terjemahan Indonesia → ketik sendiri dalam Inggris
            </p>
          </>
        )}
      </div>
    </main>
  );
}
