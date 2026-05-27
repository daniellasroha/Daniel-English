// Halaman Phrasebook — kalimat percakapan sehari-hari
"use client";

import { useState } from "react";
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

export default function PhrasebookPage() {
  const [kategoriAktif, setKategoriAktif] = useState(null);
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
              Pilih kategori untuk mulai belajar frasa sehari-hari 👇
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {kategoriPhrase.map((kat) => (
                <button
                  key={kat.id}
                  onClick={() => setKategoriAktif(kat)}
                  className={`rounded-2xl border ${kat.border} ${kat.bgLight} p-5 text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${kat.warna} flex items-center justify-center text-2xl mb-3 shadow`}>
                    {kat.emoji}
                  </div>
                  <h3 className="font-bold text-gray-800">{kat.judul}</h3>
                  <p className="text-gray-400 text-xs mt-1">{kat.frasa.length} frasa</p>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Daftar frasa dalam kategori */}
        {kategoriAktif && (
          <>
            <button
              onClick={() => { setKategoriAktif(null); window.speechSynthesis.cancel(); }}
              className="flex items-center gap-2 text-sky-600 font-semibold text-sm mb-5 hover:text-sky-800 transition"
            >
              ← Kembali ke Kategori
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${kategoriAktif.warna} flex items-center justify-center text-2xl shadow`}>
                {kategoriAktif.emoji}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{kategoriAktif.judul}</h2>
                <p className="text-xs text-gray-400">{kategoriAktif.frasa.length} frasa — tekan 🔊 untuk dengar pengucapan</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
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
          </>
        )}
      </div>
    </main>
  );
}
