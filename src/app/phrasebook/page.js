// Halaman Phrasebook — kalimat percakapan sehari-hari + mode latihan ketik
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const kategoriPhrase = [
  {
    id: 1,
    judul: "Sapaan & Perkenalan",
    emoji: "👋",
    warna: "from-blue-400 to-blue-600",
    bgLight: "bg-blue-50",
    border: "border-blue-200",
    frasa: [
      { english: "Good morning!", indonesia: "Selamat pagi!", konteks: "Sapaan pagi hari" },
      { english: "Good afternoon!", indonesia: "Selamat siang!", konteks: "Sapaan siang hari" },
      { english: "Good evening!", indonesia: "Selamat malam!", konteks: "Sapaan malam hari" },
      { english: "How are you?", indonesia: "Apa kabar?", konteks: "Menanyakan kabar" },
      { english: "I'm fine, thank you!", indonesia: "Saya baik-baik saja, terima kasih!", konteks: "Menjawab kabar" },
      { english: "What's your name?", indonesia: "Siapa namamu?", konteks: "Menanyakan nama" },
      { english: "My name is Daniel.", indonesia: "Nama saya Daniel.", konteks: "Memperkenalkan diri" },
      { english: "Nice to meet you!", indonesia: "Senang bertemu denganmu!", konteks: "Saat pertama kali bertemu" },
      { english: "Where are you from?", indonesia: "Dari mana kamu berasal?", konteks: "Menanyakan asal" },
      { english: "I'm from Indonesia.", indonesia: "Saya dari Indonesia.", konteks: "Menjawab asal negara" },
    ],
  },
  {
    id: 2,
    judul: "Percakapan Sehari-hari",
    emoji: "💬",
    warna: "from-green-400 to-green-600",
    bgLight: "bg-green-50",
    border: "border-green-200",
    frasa: [
      { english: "Excuse me.", indonesia: "Permisi.", konteks: "Minta perhatian / minta jalan" },
      { english: "I'm sorry.", indonesia: "Saya minta maaf.", konteks: "Meminta maaf" },
      { english: "No problem!", indonesia: "Tidak masalah!", konteks: "Merespons permintaan maaf" },
      { english: "Can you help me?", indonesia: "Bisakah kamu membantuku?", konteks: "Meminta bantuan" },
      { english: "Of course!", indonesia: "Tentu saja!", konteks: "Menyatakan kesediaan" },
      { english: "I don't understand.", indonesia: "Saya tidak mengerti.", konteks: "Tidak memahami sesuatu" },
      { english: "Please speak slowly.", indonesia: "Tolong bicara lebih pelan.", konteks: "Minta bicara lebih lambat" },
      { english: "Can you repeat that?", indonesia: "Bisakah kamu ulangi itu?", konteks: "Meminta pengulangan" },
      { english: "What does it mean?", indonesia: "Apa artinya?", konteks: "Menanyakan arti kata" },
      { english: "I agree with you.", indonesia: "Saya setuju denganmu.", konteks: "Menyatakan persetujuan" },
    ],
  },
  {
    id: 3,
    judul: "Di Restoran & Warung",
    emoji: "🍽️",
    warna: "from-orange-400 to-orange-600",
    bgLight: "bg-orange-50",
    border: "border-orange-200",
    frasa: [
      { english: "A table for two, please.", indonesia: "Meja untuk dua orang, tolong.", konteks: "Memesan tempat duduk" },
      { english: "Can I see the menu?", indonesia: "Boleh saya lihat menunya?", konteks: "Meminta menu" },
      { english: "I'd like to order...", indonesia: "Saya ingin memesan...", konteks: "Memulai pemesanan" },
      { english: "What do you recommend?", indonesia: "Apa yang kamu rekomendasikan?", konteks: "Meminta rekomendasi" },
      { english: "This is delicious!", indonesia: "Ini enak sekali!", konteks: "Memuji makanan" },
      { english: "Can I have the bill?", indonesia: "Boleh saya minta tagihannya?", konteks: "Meminta nota" },
      { english: "How much is this?", indonesia: "Ini harganya berapa?", konteks: "Menanyakan harga" },
      { english: "Keep the change.", indonesia: "Kembaliannya buat kamu.", konteks: "Memberikan tip" },
      { english: "I'm allergic to...", indonesia: "Saya alergi terhadap...", konteks: "Memberitahu alergi" },
      { english: "No sugar, please.", indonesia: "Tanpa gula, tolong.", konteks: "Permintaan khusus" },
    ],
  },
  {
    id: 4,
    judul: "Bertanya Arah",
    emoji: "🗺️",
    warna: "from-purple-400 to-purple-600",
    bgLight: "bg-purple-50",
    border: "border-purple-200",
    frasa: [
      { english: "Where is the toilet?", indonesia: "Di mana toiletnya?", konteks: "Mencari toilet" },
      { english: "How do I get to...?", indonesia: "Bagaimana cara ke...?", konteks: "Meminta petunjuk arah" },
      { english: "Turn left / right.", indonesia: "Belok kiri / kanan.", konteks: "Memberi arah" },
      { english: "Go straight ahead.", indonesia: "Jalan terus ke depan.", konteks: "Arah lurus" },
      { english: "It's near / far.", indonesia: "Itu dekat / jauh.", konteks: "Menggambarkan jarak" },
      { english: "Is it far from here?", indonesia: "Apakah jauh dari sini?", konteks: "Menanyakan jarak" },
      { english: "Take the bus / taxi.", indonesia: "Naik bus / taksi.", konteks: "Saran transportasi" },
      { english: "I'm lost.", indonesia: "Saya tersesat.", konteks: "Saat tidak tahu jalan" },
      { english: "Can you show me on the map?", indonesia: "Bisakah kamu tunjukkan di peta?", konteks: "Meminta bantuan peta" },
      { english: "It's on the second floor.", indonesia: "Itu ada di lantai dua.", konteks: "Memberi info lokasi" },
    ],
  },
  {
    id: 5,
    judul: "Di Sekolah & Belajar",
    emoji: "🏫",
    warna: "from-teal-400 to-cyan-600",
    bgLight: "bg-teal-50",
    border: "border-teal-200",
    frasa: [
      { english: "May I ask a question?", indonesia: "Boleh saya bertanya?", konteks: "Minta izin bertanya" },
      { english: "I don't know the answer.", indonesia: "Saya tidak tahu jawabannya.", konteks: "Mengaku tidak tahu" },
      { english: "Can you explain again?", indonesia: "Bisakah kamu jelaskan lagi?", konteks: "Meminta penjelasan ulang" },
      { english: "Let's study together!", indonesia: "Ayo belajar bersama!", konteks: "Mengajak belajar" },
      { english: "I need more practice.", indonesia: "Saya butuh lebih banyak latihan.", konteks: "Menyatakan kebutuhan" },
      { english: "What's the homework?", indonesia: "Apa tugas rumahnya?", konteks: "Menanyakan PR" },
      { english: "I finished my homework.", indonesia: "Saya sudah selesai PR saya.", konteks: "Memberi tahu sudah selesai" },
      { english: "When is the exam?", indonesia: "Kapan ujiannya?", konteks: "Menanyakan jadwal ujian" },
      { english: "I passed the test!", indonesia: "Saya lulus tes!", konteks: "Memberi kabar lulus" },
      { english: "English is fun!", indonesia: "Bahasa Inggris itu menyenangkan!", konteks: "Ekspresi positif" },
    ],
  },
  {
    id: 6,
    judul: "Darurat & Kesehatan",
    emoji: "🚨",
    warna: "from-red-400 to-rose-600",
    bgLight: "bg-red-50",
    border: "border-red-200",
    frasa: [
      { english: "Help!", indonesia: "Tolong!", konteks: "Meminta pertolongan darurat" },
      { english: "Call the police!", indonesia: "Panggil polisi!", konteks: "Meminta bantuan polisi" },
      { english: "Call an ambulance!", indonesia: "Panggil ambulans!", konteks: "Keadaan darurat medis" },
      { english: "I need a doctor.", indonesia: "Saya butuh dokter.", konteks: "Meminta bantuan medis" },
      { english: "I'm not feeling well.", indonesia: "Saya tidak merasa baik.", konteks: "Memberitahu sakit" },
      { english: "It hurts here.", indonesia: "Sakit di sini.", konteks: "Menunjuk bagian yang sakit" },
      { english: "I have a fever.", indonesia: "Saya demam.", konteks: "Memberitahu gejala" },
      { english: "I'm allergic to penicillin.", indonesia: "Saya alergi penisilin.", konteks: "Info alergi obat" },
      { english: "Where is the nearest hospital?", indonesia: "Di mana rumah sakit terdekat?", konteks: "Mencari rumah sakit" },
      { english: "Don't worry, I'm okay.", indonesia: "Jangan khawatir, saya baik-baik saja.", konteks: "Menenangkan orang lain" },
    ],
  },
];

// Normalisasi jawaban: lowercase, hapus tanda baca akhir, trim whitespace
function normalize(str) {
  return str.trim().toLowerCase().replace(/[.,!?]+$/, "").trim();
}

// Cek apakah jawaban diterima (exact atau close enough)
function cekJawaban(input, jawaban) {
  const a = normalize(input);
  const b = normalize(jawaban);
  if (a === b) return "benar";
  // Boleh ada 1 karakter beda (typo ringan) untuk frasa panjang (>8 char)
  if (b.length > 8) {
    let diff = 0;
    const maxLen = Math.max(a.length, b.length);
    for (let i = 0; i < maxLen; i++) {
      if ((a[i] || "") !== (b[i] || "")) diff++;
      if (diff > 1) break;
    }
    if (diff <= 1) return "hampir"; // hampir benar
  }
  return "salah";
}

// Komponen Mode Latihan Ketik
function ModeLatihan({ kategori, onKembali }) {
  const frasa = kategori.frasa;
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [hasil, setHasil] = useState(null); // null | "benar" | "hampir" | "salah"
  const [skor, setSkor] = useState(0);
  const [selesai, setSelesai] = useState(false);
  const [riwayat, setRiwayat] = useState([]);
  const [sedangDiputar, setSedangDiputar] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [index]);

  function putar(teks) {
    window.speechSynthesis.cancel();
    const ucapan = new SpeechSynthesisUtterance(teks);
    ucapan.lang = "en-US";
    ucapan.rate = 0.85;
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
    setRiwayat((prev) => [...prev, {
      indonesia: soal.indonesia,
      english: soal.english,
      jawaban: input.trim(),
      status,
    }]);
    // Putar audio jawaban benar otomatis
    setTimeout(() => putar(soal.english), 200);
  }

  function lanjut() {
    if (index + 1 >= frasa.length) {
      setSelesai(true);
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

  function ulangi() {
    setIndex(0);
    setInput("");
    setHasil(null);
    setSkor(0);
    setSelesai(false);
    setRiwayat([]);
  }

  const persen = Math.round((skor / frasa.length) * 100);
  const soalSaatIni = frasa[index];

  // Layar selesai
  if (selesai) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className={`rounded-3xl p-8 text-center shadow-lg mb-6 ${
          persen >= 80 ? "bg-gradient-to-br from-green-400 to-emerald-500"
          : persen >= 60 ? "bg-gradient-to-br from-yellow-400 to-orange-400"
          : "bg-gradient-to-br from-red-400 to-rose-500"
        } text-white`}>
          <div className="text-6xl mb-3">
            {persen >= 80 ? "🎉" : persen >= 60 ? "👍" : "💪"}
          </div>
          <p className="text-4xl font-extrabold mb-1">{persen}%</p>
          <p className="text-xl font-bold mb-1">{skor} / {frasa.length} Benar</p>
          <p className="text-sm opacity-90">
            {persen >= 80 ? "Luar biasa! Kamu hafal frasa ini!" : persen >= 60 ? "Bagus! Latihan lagi untuk sempurna." : "Jangan menyerah! Coba lagi."}
          </p>
        </div>

        {/* Review */}
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
                Kamu: "{item.jawaban}"
              </p>
              {item.status !== "benar" && (
                <p className="text-green-700 font-bold text-sm mt-1">✅ Jawaban: {item.english}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={ulangi}
            className={`w-full py-4 rounded-2xl text-white font-bold text-base bg-gradient-to-r ${kategori.warna} shadow-lg`}
          >
            🔄 Ulangi Latihan
          </button>
          <button
            onClick={onKembali}
            className="w-full py-3 rounded-2xl bg-gray-100 text-gray-600 font-semibold"
          >
            ← Kembali ke Frasa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Header latihan */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onKembali}
          className="text-sky-600 font-semibold text-sm hover:text-sky-800 transition"
        >
          ← Kembali
        </button>
        <span className="text-sm font-bold text-gray-600">
          {index + 1} / {frasa.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
        <div
          className={`h-2 rounded-full bg-gradient-to-r ${kategori.warna} transition-all duration-500`}
          style={{ width: `${((index) / frasa.length) * 100}%` }}
        />
      </div>

      {/* Kartu soal */}
      <div className={`rounded-3xl border-2 ${kategori.border} ${kategori.bgLight} p-6 mb-5 shadow-md`}>
        <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">Terjemahkan ke bahasa Inggris:</p>
        <p className="text-2xl font-extrabold text-gray-800 mb-1">{soalSaatIni.indonesia}</p>
        <p className="text-xs text-gray-400">📌 {soalSaatIni.konteks}</p>
      </div>

      {/* Input ketik */}
      <div className="mb-4">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={!!hasil}
          placeholder="Ketik dalam bahasa Inggris..."
          className={`w-full px-5 py-4 rounded-2xl border-2 text-lg font-semibold focus:outline-none transition ${
            hasil === "benar" ? "border-green-400 bg-green-50 text-green-700"
            : hasil === "hampir" ? "border-yellow-400 bg-yellow-50 text-yellow-700"
            : hasil === "salah" ? "border-red-400 bg-red-50 text-red-600"
            : "border-gray-200 bg-white text-gray-800 focus:border-sky-400"
          }`}
        />
      </div>

      {/* Feedback */}
      {hasil && (
        <div className={`rounded-2xl p-4 mb-4 ${
          hasil === "benar" ? "bg-green-50 border-2 border-green-200"
          : hasil === "hampir" ? "bg-yellow-50 border-2 border-yellow-200"
          : "bg-red-50 border-2 border-red-200"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-bold text-base ${
                hasil === "benar" ? "text-green-700"
                : hasil === "hampir" ? "text-yellow-700"
                : "text-red-600"
              }`}>
                {hasil === "benar" ? "✓ Benar!" : hasil === "hampir" ? "≈ Hampir benar!" : "✗ Kurang tepat"}
              </p>
              {hasil !== "benar" && (
                <p className="text-green-700 font-semibold text-sm mt-1">
                  Jawaban: <span className="font-bold">{soalSaatIni.english}</span>
                </p>
              )}
              {hasil === "hampir" && (
                <p className="text-yellow-600 text-xs mt-0.5">Skor dihitung karena hampir benar 👍</p>
              )}
            </div>
            <button
              onClick={() => putar(soalSaatIni.english)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
                sedangDiputar ? "bg-sky-500 text-white" : "bg-sky-50 text-sky-500"
              }`}
            >
              {sedangDiputar ? "⏹" : "🔊"}
            </button>
          </div>
        </div>
      )}

      {/* Tombol aksi */}
      {!hasil ? (
        <button
          onClick={cek}
          disabled={!input.trim()}
          className={`w-full py-4 rounded-2xl text-white font-bold text-base transition ${
            input.trim()
              ? `bg-gradient-to-r ${kategori.warna} shadow-lg hover:opacity-90`
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Cek Jawaban
        </button>
      ) : (
        <button
          onClick={lanjut}
          className={`w-full py-4 rounded-2xl text-white font-bold text-base bg-gradient-to-r ${kategori.warna} shadow-lg`}
        >
          {index + 1 >= frasa.length ? "Lihat Hasil →" : "Lanjut →"}
        </button>
      )}

      {/* Skor sementara */}
      <p className="text-center text-xs text-gray-400 mt-3">
        Skor: {skor} benar dari {index + (hasil ? 1 : 0)} soal
      </p>
    </div>
  );
}

export default function PhrasebookPage() {
  const [kategoriAktif, setKategoriAktif] = useState(null);
  const [modeLatihan, setModeLatihan] = useState(false);
  const [sedangDiputar, setSedangDiputar] = useState(null);

  function putar(teks, id) {
    window.speechSynthesis.cancel();
    if (sedangDiputar === id) { setSedangDiputar(null); return; }
    const ucapan = new SpeechSynthesisUtterance(teks);
    ucapan.lang = "en-US";
    ucapan.rate = 0.85;
    setSedangDiputar(id);
    ucapan.onend = () => setSedangDiputar(null);
    ucapan.onerror = () => setSedangDiputar(null);
    window.speechSynthesis.speak(ucapan);
  }

  // Mode latihan aktif
  if (kategoriAktif && modeLatihan) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${kategoriAktif.warna} flex items-center justify-center text-xl shadow`}>
              {kategoriAktif.emoji}
            </div>
            <div>
              <h1 className="text-base font-bold text-sky-700">🎯 Latihan: {kategoriAktif.judul}</h1>
              <p className="text-xs text-gray-400">Ketik terjemahan bahasa Inggris</p>
            </div>
          </div>
        </header>
        <ModeLatihan
          kategori={kategoriAktif}
          onKembali={() => setModeLatihan(false)}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-indigo-500 hover:text-indigo-700 text-2xl">←</Link>
          <div>
            <h1 className="text-xl font-bold text-sky-700">💬 Phrasebook</h1>
            <p className="text-xs text-gray-400">Kalimat percakapan bahasa Inggris sehari-hari</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Daftar kategori */}
        {!kategoriAktif && (
          <>
            <p className="text-center text-gray-500 text-sm mb-6">
              Pilih kategori untuk belajar frasa sehari-hari 👇
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {kategoriPhrase.map((kat) => (
                <button
                  key={kat.id}
                  onClick={() => { setKategoriAktif(kat); setModeLatihan(false); }}
                  className={`rounded-2xl border ${kat.border} ${kat.bgLight} p-5 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${kat.warna} flex items-center justify-center text-2xl mb-3 shadow`}>
                    {kat.emoji}
                  </div>
                  <h3 className="font-bold text-gray-800">{kat.judul}</h3>
                  <p className="text-gray-400 text-xs mt-1">{kat.frasa.length} frasa · ada latihan ketik</p>
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
              className="flex items-center gap-2 text-sky-600 font-semibold text-sm mb-5 hover:text-sky-800 transition"
            >
              ← Kembali ke Kategori
            </button>

            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${kategoriAktif.warna} flex items-center justify-center text-2xl shadow`}>
                  {kategoriAktif.emoji}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{kategoriAktif.judul}</h2>
                  <p className="text-xs text-gray-400">{kategoriAktif.frasa.length} frasa — tekan 🔊 untuk dengar</p>
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
                    className={`bg-white rounded-2xl border ${kategoriAktif.border} p-4 shadow-sm`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 text-base">{f.english}</p>
                        <p className="text-sky-600 font-semibold text-sm mt-0.5">{f.indonesia}</p>
                        <p className="text-gray-400 text-xs mt-1">📌 {f.konteks}</p>
                      </div>
                      <button
                        onClick={() => putar(f.english, id)}
                        className={`w-11 h-11 rounded-full flex items-center justify-center text-xl transition flex-shrink-0 ${
                          diputar
                            ? "bg-sky-500 text-white shadow-md scale-110"
                            : "bg-sky-50 text-sky-500 hover:bg-sky-100"
                        }`}
                        title="Dengar pengucapan"
                      >
                        {diputar ? "⏹" : "🔊"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tombol mulai latihan */}
            <button
              onClick={() => setModeLatihan(true)}
              className={`w-full py-5 rounded-2xl text-white font-extrabold text-lg bg-gradient-to-r ${kategoriAktif.warna} shadow-xl hover:opacity-90 transition flex items-center justify-center gap-3`}
            >
              <span>🎯 Mulai Latihan Ketik</span>
              <span className="text-sm font-semibold opacity-80">({kategoriAktif.frasa.length} soal)</span>
            </button>
            <p className="text-center text-xs text-gray-400 mt-2">
              Lihat terjemahan Indonesia → ketik sendiri dalam Inggris
            </p>
          </>
        )}
      </div>
    </main>
  );
}
