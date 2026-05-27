// Halaman Grammar — 8 topik lengkap dengan rumus, contoh, dan tips
"use client";

import { useState } from "react";
import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { useLevel } from "@/hooks/useLevel";

const materiGrammar = [
  {
    id: 1, judul: "Simple Present Tense", emoji: "⏰",
    warna: "from-blue-400 to-blue-600", bgLight: "bg-blue-50", border: "border-blue-200",
    penjelasan: "Digunakan untuk kebiasaan, fakta umum, atau kejadian yang terjadi secara rutin.",
    rumus: [
      { subjek: "I / You / We / They", kata_kerja: "Verb (bentuk dasar)", contoh: "I eat rice every day." },
      { subjek: "He / She / It", kata_kerja: "Verb + s/es", contoh: "She eats rice every day." },
      { subjek: "Negatif", kata_kerja: "do/does + not + Verb", contoh: "He does not like coffee." },
      { subjek: "Pertanyaan", kata_kerja: "Do/Does + Subjek + Verb?", contoh: "Does she speak English?" },
    ],
    contohKalimat: [
      { indonesia: "Saya belajar bahasa Inggris.", inggris: "I study English." },
      { indonesia: "Dia pergi ke sekolah setiap hari.", inggris: "He goes to school every day." },
      { indonesia: "Mereka tidak suka sayur.", inggris: "They do not like vegetables." },
      { indonesia: "Apakah kamu tinggal di sini?", inggris: "Do you live here?" },
    ],
    tips: "Tambahkan -s atau -es pada kata kerja jika subjeknya He, She, atau It. Contoh: go → goes, watch → watches.",
  },
  {
    id: 2, judul: "Simple Past Tense", emoji: "📅",
    warna: "from-green-400 to-green-600", bgLight: "bg-green-50", border: "border-green-200",
    penjelasan: "Digunakan untuk kejadian yang sudah selesai di masa lampau.",
    rumus: [
      { subjek: "Semua subjek (positif)", kata_kerja: "Verb 2 (past form)", contoh: "I ate rice yesterday." },
      { subjek: "Semua subjek (negatif)", kata_kerja: "did not + Verb 1", contoh: "She did not come." },
      { subjek: "Pertanyaan", kata_kerja: "Did + Subjek + Verb 1?", contoh: "Did you see that?" },
    ],
    contohKalimat: [
      { indonesia: "Saya belajar kemarin malam.", inggris: "I studied last night." },
      { indonesia: "Dia pergi ke pasar tadi pagi.", inggris: "She went to the market this morning." },
      { indonesia: "Kami tidak menonton film itu.", inggris: "We did not watch that movie." },
      { indonesia: "Apakah kamu sudah makan?", inggris: "Did you eat already?" },
    ],
    tips: "Kata kerja tidak beraturan (irregular verbs): go→went, eat→ate, see→saw, buy→bought, take→took.",
  },
  {
    id: 3, judul: "To Be (is, am, are, was, were)", emoji: "🔗",
    warna: "from-purple-400 to-purple-600", bgLight: "bg-purple-50", border: "border-purple-200",
    penjelasan: "To Be menghubungkan subjek dengan keadaan, profesi, atau sifat. Bentuknya berubah tergantung subjek dan waktu.",
    rumus: [
      { subjek: "I (sekarang)", kata_kerja: "am", contoh: "I am a student." },
      { subjek: "He / She / It (sekarang)", kata_kerja: "is", contoh: "She is happy." },
      { subjek: "You / We / They (sekarang)", kata_kerja: "are", contoh: "They are smart." },
      { subjek: "I / He / She / It (lampau)", kata_kerja: "was", contoh: "He was tired." },
      { subjek: "You / We / They (lampau)", kata_kerja: "were", contoh: "We were at school." },
    ],
    contohKalimat: [
      { indonesia: "Saya seorang pelajar.", inggris: "I am a student." },
      { indonesia: "Cuaca sangat panas hari ini.", inggris: "The weather is very hot today." },
      { indonesia: "Kami sangat lelah kemarin.", inggris: "We were very tired yesterday." },
      { indonesia: "Apakah dia seorang dokter?", inggris: "Is she a doctor?" },
    ],
    tips: "Ingat: I→am, He/She/It→is, You/We/They→are. Untuk masa lalu: I/He/She/It→was, You/We/They→were.",
  },
  {
    id: 4, judul: "Present Continuous Tense", emoji: "🔄",
    warna: "from-orange-400 to-orange-600", bgLight: "bg-orange-50", border: "border-orange-200",
    penjelasan: "Digunakan untuk kejadian yang sedang berlangsung saat ini atau rencana di masa depan dekat.",
    rumus: [
      { subjek: "I", kata_kerja: "am + Verb-ing", contoh: "I am eating now." },
      { subjek: "He / She / It", kata_kerja: "is + Verb-ing", contoh: "She is reading." },
      { subjek: "You / We / They", kata_kerja: "are + Verb-ing", contoh: "They are playing." },
    ],
    contohKalimat: [
      { indonesia: "Saya sedang makan sekarang.", inggris: "I am eating right now." },
      { indonesia: "Dia sedang membaca buku.", inggris: "She is reading a book." },
      { indonesia: "Kami sedang belajar bahasa Inggris.", inggris: "We are studying English." },
      { indonesia: "Apakah kamu sedang mendengarkan?", inggris: "Are you listening?" },
    ],
    tips: "Kata kunci: now, right now, at the moment, currently, look!, listen! — menandakan Present Continuous.",
  },
  {
    id: 5, judul: "Future Tense (will & going to)", emoji: "🔮",
    warna: "from-teal-400 to-teal-600", bgLight: "bg-teal-50", border: "border-teal-200",
    penjelasan: "Digunakan untuk menyatakan rencana atau prediksi di masa depan. 'Will' untuk keputusan spontan, 'going to' untuk rencana yang sudah dipikirkan.",
    rumus: [
      { subjek: "Semua subjek (will)", kata_kerja: "will + Verb 1", contoh: "I will call you later." },
      { subjek: "Semua subjek (going to)", kata_kerja: "am/is/are + going to + Verb 1", contoh: "She is going to study tonight." },
      { subjek: "Negatif (will)", kata_kerja: "will not (won't) + Verb 1", contoh: "I won't be late." },
    ],
    contohKalimat: [
      { indonesia: "Saya akan meneleponmu nanti.", inggris: "I will call you later." },
      { indonesia: "Kami akan pergi ke Bali minggu depan.", inggris: "We are going to go to Bali next week." },
      { indonesia: "Dia tidak akan hadir besok.", inggris: "She won't come tomorrow." },
      { indonesia: "Apakah kamu akan datang ke pesta?", inggris: "Will you come to the party?" },
    ],
    tips: "Gunakan 'will' untuk keputusan mendadak (Oh, I'll help you!) dan 'going to' untuk rencana yang sudah terencana (I'm going to study tonight).",
  },
  {
    id: 6, judul: "Modal Verbs (can, must, should)", emoji: "🎛️",
    warna: "from-pink-400 to-pink-600", bgLight: "bg-pink-50", border: "border-pink-200",
    penjelasan: "Modal verbs digunakan untuk menyatakan kemampuan, keharusan, atau saran. Selalu diikuti Verb 1 (bentuk dasar).",
    rumus: [
      { subjek: "can", kata_kerja: "kemampuan / izin", contoh: "I can swim. Can I go?" },
      { subjek: "must", kata_kerja: "keharusan kuat", contoh: "You must wear a seatbelt." },
      { subjek: "should", kata_kerja: "saran / anjuran", contoh: "You should sleep early." },
      { subjek: "may / might", kata_kerja: "kemungkinan", contoh: "It may rain today." },
    ],
    contohKalimat: [
      { indonesia: "Saya bisa berbahasa Inggris.", inggris: "I can speak English." },
      { indonesia: "Kamu harus belajar lebih keras.", inggris: "You must study harder." },
      { indonesia: "Sebaiknya kamu pergi ke dokter.", inggris: "You should see a doctor." },
      { indonesia: "Mungkin hujan nanti malam.", inggris: "It might rain tonight." },
    ],
    tips: "Modal verbs tidak pernah berubah bentuk (tidak ada -s/-ed). Selalu ikuti dengan Verb 1: She can sing ✓, She can sings ✗.",
  },
  {
    id: 7, judul: "Articles (a, an, the)", emoji: "📌",
    warna: "from-yellow-400 to-yellow-600", bgLight: "bg-yellow-50", border: "border-yellow-200",
    penjelasan: "Articles digunakan sebelum kata benda. 'A/an' untuk benda yang pertama kali disebut atau tidak spesifik, 'the' untuk benda yang sudah diketahui atau spesifik.",
    rumus: [
      { subjek: "a", kata_kerja: "sebelum konsonan (b,c,d...)", contoh: "a book, a cat, a dog" },
      { subjek: "an", kata_kerja: "sebelum vokal (a,e,i,o,u)", contoh: "an apple, an egg, an orange" },
      { subjek: "the", kata_kerja: "benda spesifik / sudah diketahui", contoh: "the sun, the book I told you" },
    ],
    contohKalimat: [
      { indonesia: "Saya punya seekor kucing.", inggris: "I have a cat." },
      { indonesia: "Dia memakan sebuah apel.", inggris: "She ate an apple." },
      { indonesia: "Tutup pintunya!", inggris: "Close the door!" },
      { indonesia: "Matahari terbit di timur.", inggris: "The sun rises in the east." },
    ],
    tips: "Pakai 'an' berdasarkan bunyi, bukan huruf. Contoh: 'an hour' (h-nya tidak berbunyi), 'a university' (u-nya berbunyi 'yu' seperti konsonan).",
  },
  {
    id: 8, judul: "Comparative & Superlative", emoji: "📊",
    warna: "from-red-400 to-red-600", bgLight: "bg-red-50", border: "border-red-200",
    penjelasan: "Digunakan untuk membandingkan dua hal (comparative) atau menyatakan yang paling (superlative).",
    rumus: [
      { subjek: "Kata sifat pendek", kata_kerja: "+ er (comparative) / + est (superlative)", contoh: "tall → taller → tallest" },
      { subjek: "Kata sifat panjang", kata_kerja: "more + adj / most + adj", contoh: "beautiful → more beautiful → most beautiful" },
      { subjek: "Tidak beraturan", kata_kerja: "good→better→best / bad→worse→worst", contoh: "This is better than that." },
    ],
    contohKalimat: [
      { indonesia: "Dia lebih tinggi dari saya.", inggris: "He is taller than me." },
      { indonesia: "Ini adalah film terbaik yang pernah saya tonton.", inggris: "This is the best movie I've ever watched." },
      { indonesia: "Mobil ini lebih mahal dari sepeda motor.", inggris: "This car is more expensive than a motorcycle." },
      { indonesia: "Dia adalah siswa paling pintar di kelas.", inggris: "She is the smartest student in class." },
    ],
    tips: "Untuk kata sifat 1-2 suku kata: tambahkan -er/-est. Untuk 3+ suku kata: gunakan more/most. Jangan gabungkan keduanya: more taller ✗, taller ✓.",
  },
];

export default function GrammarPage() {
  const [topikAktif, setTopikAktif] = useState(null);
  const { recordGrammar } = useProgress();
  const { config } = useLevel();

  // Filter topik berdasarkan level
  const materiTersedia = config
    ? materiGrammar.filter((m) => config.grammarTopics.includes(m.id))
    : materiGrammar;

  function toggleTopik(id) {
    const bukaSekarang = topikAktif !== id;
    setTopikAktif(bukaSekarang ? id : null);
    if (bukaSekarang) recordGrammar(id);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-indigo-500 hover:text-indigo-700 text-2xl">←</Link>
          <div>
            <h1 className="text-xl font-bold text-green-700">✏️ Grammar</h1>
            <p className="text-xs text-gray-400">
              {materiTersedia.length} topik
              {config && <span className={`ml-1 font-semibold ${config.teks}`}>· {config.emoji} {config.label}</span>}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-4 mb-5 border border-green-200 shadow-sm text-sm text-gray-600">
          📌 Pelajari setiap topik secara berurutan. Klik judul topik untuk membuka materi lengkapnya.
        </div>

        <div className="flex flex-col gap-3">
          {materiTersedia.map((materi) => (
            <div key={materi.id} className={`rounded-2xl border ${materi.border} overflow-hidden shadow-sm`}>
              <button
                onClick={() => toggleTopik(materi.id)}
                className={`w-full flex items-center justify-between px-5 py-4 ${materi.bgLight} hover:opacity-90 transition`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${materi.warna} flex items-center justify-center text-xl shadow`}>
                    {materi.emoji}
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-gray-800">{materi.judul}</span>
                    <p className="text-xs text-gray-400 mt-0.5">{materi.rumus.length} rumus · {materi.contohKalimat.length} contoh</p>
                  </div>
                </div>
                <span className="text-gray-400 text-lg">{topikAktif === materi.id ? "▲" : "▼"}</span>
              </button>

              {topikAktif === materi.id && (
                <div className="bg-white px-5 py-5 border-t border-gray-100">
                  <p className="text-gray-600 mb-5 leading-relaxed">{materi.penjelasan}</p>

                  <h3 className="font-bold text-gray-700 mb-3">📐 Rumus</h3>
                  <div className="overflow-x-auto mb-5">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="text-left px-3 py-2 font-semibold text-gray-600 rounded-tl-lg">Bentuk / Subjek</th>
                          <th className="text-left px-3 py-2 font-semibold text-gray-600">Pola</th>
                          <th className="text-left px-3 py-2 font-semibold text-gray-600 rounded-tr-lg">Contoh</th>
                        </tr>
                      </thead>
                      <tbody>
                        {materi.rumus.map((r, i) => (
                          <tr key={i} className="border-t border-gray-100">
                            <td className="px-3 py-2 font-medium text-indigo-600">{r.subjek}</td>
                            <td className="px-3 py-2 text-green-700 font-semibold">{r.kata_kerja}</td>
                            <td className="px-3 py-2 text-gray-500 italic">{r.contoh}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <h3 className="font-bold text-gray-700 mb-3">💬 Contoh Kalimat</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
                    {materi.contohKalimat.map((k, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                        <p className="text-gray-400 text-xs mb-1">{k.indonesia}</p>
                        <p className="text-gray-800 font-semibold text-sm">{k.inggris}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
                    <p className="text-yellow-700 text-sm">💡 <strong>Tips:</strong> {materi.tips}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
