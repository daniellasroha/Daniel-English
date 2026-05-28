// Halaman Grammar — topik + latihan langsung per topik
"use client";

import { useState } from "react";
import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { useLevel } from "@/hooks/useLevel";

// ─── SOAL LATIHAN per topik (5 soal) ──────────────────────────────────────────
const soalPerTopik = {
  1: [ // Simple Present
    { p: "She ___ (go) to school every morning.", opts: ["go","goes","went","going"], j: 1 },
    { p: "They ___ (play) football on Sundays.", opts: ["plays","play","played","playing"], j: 1 },
    { p: "Kalimat negatif: He ___ like coffee.", opts: ["not","don't","doesn't","isn't"], j: 2 },
    { p: "Kalimat tanya: ___ she speak French?", opts: ["Do","Does","Is","Has"], j: 1 },
    { p: "He ___ (watch) TV every night.", opts: ["watch","watchs","watches","watching"], j: 2 },
  ],
  2: [ // Simple Past
    { p: "Past tense dari 'go' adalah...", opts: ["goed","goes","went","gone"], j: 2 },
    { p: "Past tense dari 'eat' adalah...", opts: ["eated","aten","ate","eats"], j: 2 },
    { p: "She ___ (not come) yesterday.", opts: ["doesn't come","didn't come","wasn't come","hadn't come"], j: 1 },
    { p: "___ you finish the homework last night?", opts: ["Do","Does","Did","Have"], j: 2 },
    { p: "Past tense dari 'buy' adalah...", opts: ["buyed","boughten","bought","buys"], j: 2 },
  ],
  3: [ // To Be
    { p: "Pilih To Be: 'I ___ a student.'", opts: ["is","am","are","be"], j: 1 },
    { p: "Pilih To Be: 'She ___ happy.'", opts: ["am","is","are","be"], j: 1 },
    { p: "Pilih To Be: 'They ___ my friends.'", opts: ["is","am","are","be"], j: 2 },
    { p: "Bentuk lampau: 'I ___ tired yesterday.'", opts: ["am","is","was","were"], j: 2 },
    { p: "Bentuk lampau: 'They ___ at school.'", opts: ["was","were","are","been"], j: 1 },
  ],
  4: [ // Present Continuous
    { p: "She ___ eating now.", opts: ["is","are","was","be"], j: 0 },
    { p: "They ___ (play) outside right now.", opts: ["is playing","are playing","was playing","plays"], j: 1 },
    { p: "Bentuk -ing dari 'run': He is ___.", opts: ["runing","running","runned","runs"], j: 1 },
    { p: "___ you studying now?", opts: ["Do","Are","Is","Have"], j: 1 },
    { p: "Bentuk -ing dari 'swim': She is ___.", opts: ["swiming","swimming","swammed","swims"], j: 1 },
  ],
  5: [ // Future
    { p: "I ___ call you later.", opts: ["am","was","will","have"], j: 2 },
    { p: "She ___ going to study tonight.", opts: ["will","is","are","was"], j: 1 },
    { p: "Future negatif: We ___ go.", opts: ["don't will","won't","will not to","aren't will"], j: 1 },
    { p: "Terjemahkan: 'Saya akan pergi ke Jakarta.'", opts: ["I go to Jakarta.","I went to Jakarta.","I will go to Jakarta.","I am going Jakarta."], j: 2 },
    { p: "They ___ going to visit us next week.", opts: ["will","is","are","was"], j: 2 },
  ],
  6: [ // Modal
    { p: "I ___ speak English well.", opts: ["will","can","must","should"], j: 1 },
    { p: "You ___ wear a seatbelt. (kewajiban)", opts: ["can","might","must","would"], j: 2 },
    { p: "You ___ rest more. (saran)", opts: ["must","can","should","will"], j: 2 },
    { p: "It ___ rain today. (kemungkinan)", opts: ["must","might","should","can"], j: 1 },
    { p: "___ I borrow your pen? (izin sopan)", opts: ["Must","Should","May","Will"], j: 2 },
  ],
  7: [ // Articles
    { p: "Pilih artikel: '___ apple'", opts: ["a","an","the","—"], j: 1 },
    { p: "Pilih artikel: '___ book'", opts: ["a","an","the","—"], j: 0 },
    { p: "Artikel spesifik: 'Close ___ door.'", opts: ["a","an","the","—"], j: 2 },
    { p: "Pilih artikel: '___ hour'", opts: ["a","an","the","—"], j: 1 },
    { p: "Superlative: 'She is ___ best.'", opts: ["a","an","the","—"], j: 2 },
  ],
  8: [ // Comparative & Superlative
    { p: "She is ___ than her sister. (tall)", opts: ["more tall","tallest","taller","tall"], j: 2 },
    { p: "He is the ___ student. (smart)", opts: ["smarter","more smart","smartest","smart"], j: 2 },
    { p: "Comparative 'good': This is ___ than that.", opts: ["gooder","more good","better","best"], j: 2 },
    { p: "Superlative 'bad': the ___ day.", opts: ["baddest","most bad","worse","worst"], j: 3 },
    { p: "This room is ___ than mine. (big)", opts: ["more big","bigger","biggest","bigest"], j: 1 },
  ],
  9: [ // Salam
    { p: "Sapaan di pagi hari adalah...", opts: ["Good night","Good afternoon","Good morning","Good evening"], j: 2 },
    { p: "Cara memperkenalkan nama: '___ is Daniel'", opts: ["I name","My name","Your name","Name I"], j: 1 },
    { p: "Apa arti 'Nice to meet you'?", opts: ["Apa kabar?","Sampai jumpa","Senang bertemu","Terima kasih"], j: 2 },
    { p: "Sapaan perpisahan yang umum:", opts: ["Hello","Sorry","Goodbye","Please"], j: 2 },
    { p: "Jawaban umum untuk 'How are you?'", opts: ["My name is...","I am fine, thank you.","Nice to meet you.","Good morning!"], j: 1 },
  ],
  10: [ // Kata Ganti
    { p: "Kata ganti untuk 'dia (perempuan)' adalah...", opts: ["He","She","It","They"], j: 1 },
    { p: "Kata ganti jamak untuk orang adalah...", opts: ["It","We","He","She"], j: 1 },
    { p: "Possessive untuk 'he': ___ bag is red.", opts: ["He","Him","His","Himself"], j: 2 },
    { p: "Possessive untuk 'I': This is ___ book.", opts: ["I","Me","My","Mine"], j: 2 },
    { p: "Kata ganti untuk benda mati: ___ is a table.", opts: ["He","She","It","They"], j: 2 },
  ],
};

// ─── Komponen Mini Quiz Grammar ───────────────────────────────────────────────
function MiniQuizGrammar({ topikId, warna, border, bg }) {
  const soalList = soalPerTopik[topikId] || [];
  const [idx, setIdx] = useState(0);
  const [dipilih, setDipilih] = useState(null);
  const [benar, setBenar] = useState(0);
  const [selesai, setSelesai] = useState(false);

  if (!soalList.length) return null;

  const soal = soalList[idx];

  function pilih(i) {
    if (dipilih !== null) return;
    setDipilih(i);
    if (i === soal.j) setBenar(b => b + 1);
  }

  function lanjut() {
    if (idx >= soalList.length - 1) {
      setSelesai(true);
    } else {
      setIdx(n => n + 1);
      setDipilih(null);
    }
  }

  function ulangi() {
    setIdx(0);
    setDipilih(null);
    setBenar(0);
    setSelesai(false);
  }

  if (selesai) {
    const persen = Math.round((benar / soalList.length) * 100);
    return (
      <div className="mt-4 text-center py-6 bg-gray-50 rounded-2xl border border-gray-200">
        <div className="text-5xl mb-2">{persen === 100 ? "🏆" : persen >= 60 ? "⭐" : "💪"}</div>
        <p className="font-extrabold text-gray-800 text-xl">{persen === 100 ? "Sempurna!" : persen >= 60 ? "Bagus!" : "Terus Berlatih!"}</p>
        <p className="text-gray-500 text-sm mt-1">{benar}/{soalList.length} benar · {persen}%</p>
        <button onClick={ulangi} className={`mt-4 px-6 py-2 rounded-xl text-white font-bold bg-gradient-to-r ${warna} hover:scale-105 transition-transform shadow`}>
          🔄 Ulangi Latihan
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs text-gray-400 mb-2">
        <span>Soal {idx + 1}/{soalList.length}</span>
        <span>{benar} benar</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4">
        <div className={`h-full rounded-full bg-gradient-to-r ${warna} transition-all`} style={{ width: `${(idx / soalList.length) * 100}%` }} />
      </div>

      <div className={`rounded-xl border-2 ${border} ${bg} p-4 mb-4`}>
        <p className="font-semibold text-gray-800">{soal.p}</p>
      </div>

      <div className="flex flex-col gap-2 mb-3">
        {soal.opts.map((o, i) => {
          let style = "border-2 border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50";
          let icon = null;
          if (dipilih !== null) {
            if (i === soal.j) { style = "border-2 border-green-400 bg-green-50 text-green-700"; icon = <span className="ml-1 font-bold">✓</span>; }
            else if (i === dipilih) { style = "border-2 border-red-400 bg-red-50 text-red-700"; icon = <span className="ml-1 font-bold">✗</span>; }
            else style = "border-2 border-gray-200 bg-white text-gray-400 opacity-50";
          }
          return (
            <button key={i} onClick={() => pilih(i)} className={`w-full text-left px-4 py-2.5 rounded-xl font-medium transition-all text-sm ${style}`}>
              <span className="text-xs text-gray-400 mr-2">{["A","B","C","D"][i]}.</span>
              {o}{icon}
            </button>
          );
        })}
      </div>

      {dipilih !== null && (
        <button onClick={lanjut} className={`w-full py-2.5 rounded-xl text-white font-bold bg-gradient-to-r ${warna} hover:scale-105 transition-transform shadow`}>
          {idx < soalList.length - 1 ? "Soal Berikutnya →" : "Lihat Hasil"}
        </button>
      )}
    </div>
  );
}

// ─── Data materi grammar ──────────────────────────────────────────────────────
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
    penjelasan: "To Be menghubungkan subjek dengan keadaan, profesi, atau sifat.",
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
    penjelasan: "Digunakan untuk kejadian yang sedang berlangsung saat ini.",
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
    tips: "Kata kunci: now, right now, at the moment, currently, look!, listen!",
  },
  {
    id: 5, judul: "Future Tense (will & going to)", emoji: "🔮",
    warna: "from-teal-400 to-teal-600", bgLight: "bg-teal-50", border: "border-teal-200",
    penjelasan: "'Will' untuk keputusan spontan, 'going to' untuk rencana yang sudah dipikirkan.",
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
    tips: "Gunakan 'will' untuk keputusan mendadak dan 'going to' untuk rencana yang sudah terencana.",
  },
  {
    id: 6, judul: "Modal Verbs (can, must, should)", emoji: "🎛️",
    warna: "from-pink-400 to-pink-600", bgLight: "bg-pink-50", border: "border-pink-200",
    penjelasan: "Modal verbs digunakan untuk menyatakan kemampuan, keharusan, atau saran. Selalu diikuti Verb 1.",
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
    tips: "Modal verbs tidak pernah berubah bentuk. Selalu ikuti dengan Verb 1: She can sing ✓, She can sings ✗.",
  },
  {
    id: 7, judul: "Articles (a, an, the)", emoji: "📌",
    warna: "from-yellow-400 to-yellow-600", bgLight: "bg-yellow-50", border: "border-yellow-200",
    penjelasan: "'A/an' untuk benda tidak spesifik, 'the' untuk benda yang sudah diketahui atau spesifik.",
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
    tips: "Pakai 'an' berdasarkan bunyi: 'an hour' (h-nya tak berbunyi), 'a university' (u-nya berbunyi 'yu').",
  },
  {
    id: 8, judul: "Comparative & Superlative", emoji: "📊",
    warna: "from-red-400 to-red-600", bgLight: "bg-red-50", border: "border-red-200",
    penjelasan: "Comparative untuk membandingkan dua hal, superlative untuk menyatakan yang paling.",
    rumus: [
      { subjek: "Kata sifat pendek", kata_kerja: "+ er / + est", contoh: "tall → taller → tallest" },
      { subjek: "Kata sifat panjang", kata_kerja: "more + adj / most + adj", contoh: "beautiful → more beautiful → most beautiful" },
      { subjek: "Tidak beraturan", kata_kerja: "good→better→best / bad→worse→worst", contoh: "This is better than that." },
    ],
    contohKalimat: [
      { indonesia: "Dia lebih tinggi dari saya.", inggris: "He is taller than me." },
      { indonesia: "Ini adalah film terbaik.", inggris: "This is the best movie." },
      { indonesia: "Mobil ini lebih mahal.", inggris: "This car is more expensive than a motorcycle." },
      { indonesia: "Dia siswa paling pintar.", inggris: "She is the smartest student in class." },
    ],
    tips: "1-2 suku kata: tambahkan -er/-est. 3+ suku kata: gunakan more/most. Jangan gabungkan: more taller ✗",
  },
  {
    id: 9, judul: "Salam & Perkenalan", emoji: "👋",
    warna: "from-yellow-400 to-orange-500", bgLight: "bg-yellow-50", border: "border-yellow-200",
    penjelasan: "Ungkapan salam dan perkenalan diri adalah hal pertama yang dipelajari dalam bahasa Inggris.",
    rumus: [
      { subjek: "Salam harian", kata_kerja: "Good morning / afternoon / evening / night", contoh: "Good morning, how are you?" },
      { subjek: "Perkenalan", kata_kerja: "My name is... / I am...", contoh: "My name is Daniel." },
      { subjek: "Menanyakan kabar", kata_kerja: "How are you? → I am fine, thank you.", contoh: "How are you? — I am fine!" },
      { subjek: "Perpisahan", kata_kerja: "Goodbye / See you / Bye", contoh: "Goodbye! See you tomorrow." },
    ],
    contohKalimat: [
      { indonesia: "Selamat pagi! Apa kabar?", inggris: "Good morning! How are you?" },
      { indonesia: "Nama saya Daniel.", inggris: "My name is Daniel." },
      { indonesia: "Saya baik-baik saja, terima kasih.", inggris: "I am fine, thank you." },
      { indonesia: "Senang bertemu denganmu.", inggris: "Nice to meet you." },
    ],
    tips: "Gunakan 'Good morning' sampai jam 12, 'Good afternoon' sampai jam 6 sore, 'Good evening' setelahnya.",
  },
  {
    id: 10, judul: "Kata Ganti Orang", emoji: "👤",
    warna: "from-lime-400 to-green-500", bgLight: "bg-lime-50", border: "border-lime-200",
    penjelasan: "Kata ganti orang (pronouns) menggantikan nama. Ini adalah pondasi dari semua kalimat bahasa Inggris.",
    rumus: [
      { subjek: "Tunggal", kata_kerja: "I · You · He · She · It", contoh: "I am happy. She is a teacher." },
      { subjek: "Jamak", kata_kerja: "We · You · They", contoh: "We are students. They are friends." },
      { subjek: "Kepemilikan", kata_kerja: "My · Your · His · Her · Its · Our · Their", contoh: "My name is... / Her book is red." },
    ],
    contohKalimat: [
      { indonesia: "Saya seorang pelajar.", inggris: "I am a student." },
      { indonesia: "Dia (perempuan) seorang guru.", inggris: "She is a teacher." },
      { indonesia: "Mereka teman saya.", inggris: "They are my friends." },
      { indonesia: "Namanya Daniel. (laki-laki)", inggris: "His name is Daniel." },
    ],
    tips: "'He' untuk laki-laki, 'She' untuk perempuan, 'It' untuk benda atau hewan. Jangan sampai tertukar!",
  },
];

export default function GrammarPage() {
  const [topikAktif, setTopikAktif] = useState(null);
  const [latihanAktif, setLatihanAktif] = useState(null);
  const { recordGrammar } = useProgress();
  const { config } = useLevel();

  const materiTersedia = config
    ? materiGrammar.filter((m) => config.grammarTopics.includes(m.id))
    : materiGrammar;

  function toggleTopik(id) {
    const bukaSekarang = topikAktif !== id;
    setTopikAktif(bukaSekarang ? id : null);
    if (!bukaSekarang) setLatihanAktif(null);
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
          📌 Pelajari setiap topik, lalu uji pemahamanmu dengan tombol <strong>🎯 Latihan</strong> di setiap topik.
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
                    <p className="text-xs text-gray-400 mt-0.5">{materi.rumus.length} rumus · {materi.contohKalimat.length} contoh · 5 soal latihan</p>
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

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-5">
                    <p className="text-yellow-700 text-sm">💡 <strong>Tips:</strong> {materi.tips}</p>
                  </div>

                  {/* Tombol Latihan */}
                  <button
                    onClick={() => setLatihanAktif(latihanAktif === materi.id ? null : materi.id)}
                    className={`w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r ${materi.warna} hover:scale-105 transition-transform shadow-md flex items-center justify-center gap-2`}
                  >
                    🎯 {latihanAktif === materi.id ? "Sembunyikan Latihan" : "Mulai Latihan (5 soal)"}
                  </button>

                  {latihanAktif === materi.id && (
                    <MiniQuizGrammar
                      topikId={materi.id}
                      warna={materi.warna}
                      border={materi.border}
                      bg={materi.bgLight}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
