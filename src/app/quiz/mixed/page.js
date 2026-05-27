// Quiz Mixed — 20 soal campuran vocabulary + grammar
"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QuizEngine from "@/components/QuizEngine";

const soalMixed = [
  { pertanyaan: "Apa arti 'Perseverance'?", pilihan: ["Keberanian", "Ketekunan / Pantang Menyerah", "Kesabaran", "Kejujuran"], jawaban: 1, tag: "Vocabulary" },
  { pertanyaan: "Pilih kalimat yang benar:", pilihan: ["I am go to school.", "I goes to school.", "I go to school.", "I going to school."], jawaban: 2, tag: "Grammar", penjelasan: "I → pakai Verb bentuk dasar tanpa -s." },
  { pertanyaan: "Apa arti kata 'Generous'?", pilihan: ["Dermawan", "Pemarah", "Pemalu", "Pelupa"], jawaban: 0, tag: "Vocabulary" },
  { pertanyaan: "\"___ he working right now?\" Pilih yang benar:", pilihan: ["Do", "Does", "Is", "Are"], jawaban: 2, tag: "Grammar", penjelasan: "He (He/She/It) + is → Is he working?" },
  { pertanyaan: "Apa bahasa Inggrisnya 'Pelangi'?", pilihan: ["Storm", "Rainbow", "Sunshine", "Cloudy"], jawaban: 1, tag: "Vocabulary" },
  { pertanyaan: "Kalimat comparative yang benar:", pilihan: ["This is more cheap than that.", "This is cheaper than that.", "This is more cheaper than that.", "This is cheapest than that."], jawaban: 1, tag: "Grammar", penjelasan: "'Cheap' pendek → tambahkan -er → cheaper." },
  { pertanyaan: "Apa arti 'Earthquake'?", pilihan: ["Banjir", "Gempa Bumi", "Badai", "Kemarau"], jawaban: 1, tag: "Vocabulary" },
  { pertanyaan: "Pilih penggunaan modal yang tepat untuk saran:", pilihan: ["You must eat vegetables.", "You can eat vegetables.", "You should eat vegetables.", "You will eat vegetables."], jawaban: 2, tag: "Grammar", penjelasan: "'Should' untuk saran/anjuran." },
  { pertanyaan: "Apa arti kata 'Enormous'?", pilihan: ["Sangat Kecil", "Sangat Besar", "Sangat Cepat", "Sangat Indah"], jawaban: 1, tag: "Vocabulary" },
  { pertanyaan: "\"Saya sedang membaca buku.\" → Bahasa Inggrisnya?", pilihan: ["I read a book.", "I am read a book.", "I reading a book.", "I am reading a book."], jawaban: 3, tag: "Grammar", penjelasan: "Sedang = am/is/are + Verb-ing → I am reading." },
  { pertanyaan: "Kata 'Stubborn' artinya...", pilihan: ["Rajin", "Keras kepala", "Penakut", "Pemaaf"], jawaban: 1, tag: "Vocabulary" },
  { pertanyaan: "Mana artikel yang benar?", pilihan: ["a elephant", "an university", "an honest man", "a apple"], jawaban: 2, tag: "Grammar", penjelasan: "'Honest' → h-nya diam, bunyinya 'onest' (vokal) → an honest." },
  { pertanyaan: "Apa arti 'Magnificent'?", pilihan: ["Mengerikan", "Biasa saja", "Megah / Luar biasa indah", "Membosankan"], jawaban: 2, tag: "Vocabulary" },
  { pertanyaan: "\"Dia tidak suka kopi.\" (Simple Present) → Bahasa Inggrisnya?", pilihan: ["She don't like coffee.", "She not likes coffee.", "She doesn't like coffee.", "She isn't like coffee."], jawaban: 2, tag: "Grammar", penjelasan: "She → doesn't + Verb 1 (tanpa -s)." },
  { pertanyaan: "Apa arti kata 'Ambitious'?", pilihan: ["Pemalu", "Ambisius / Bersemangat tinggi", "Mudah menyerah", "Tidak peduli"], jawaban: 1, tag: "Vocabulary" },
  { pertanyaan: "Superlative dari 'bad' adalah...", pilihan: ["baddest", "more bad", "worst", "most bad"], jawaban: 2, tag: "Grammar", penjelasan: "Irregular: bad → worse → worst." },
  { pertanyaan: "Apa arti 'Exhausted'?", pilihan: ["Bersemangat", "Sangat lelah / Kelelahan", "Lapar sekali", "Sangat senang"], jawaban: 1, tag: "Vocabulary" },
  { pertanyaan: "\"Kami akan pergi ke pantai besok.\" Gunakan 'going to':", pilihan: ["We will going to the beach.", "We are go to the beach.", "We are going to go to the beach.", "We going to the beach."], jawaban: 2, tag: "Grammar", penjelasan: "Going to future = are + going to + Verb 1." },
  { pertanyaan: "Kata 'Fluent' dalam konteks bahasa artinya...", pilihan: ["Lambat berbicara", "Fasih / Lancar", "Tidak bisa berbicara", "Baru belajar"], jawaban: 1, tag: "Vocabulary" },
  { pertanyaan: "Pilih kalimat past tense yang benar:", pilihan: ["I buyed a new phone.", "I buyed a new phone yesterday.", "I bought a new phone yesterday.", "I was buy a new phone."], jawaban: 2, tag: "Grammar", penjelasan: "Irregular: buy → bought (bukan buyed)." },
];

function MixedQuizContent() {
  const params = useSearchParams();
  const pakaiTimer = params.get("timer") === "1";
  return (
    <QuizEngine
      judul="Mixed Quiz"
      emoji="🎯"
      soalList={soalMixed}
      warnaBg="bg-gradient-to-br from-purple-50 to-indigo-100"
      warnaBtn="bg-purple-600"
      kategori="mixed"
      pakaiTimer={pakaiTimer}
    />
  );
}

export default function MixedQuizPage() {
  return (
    <Suspense fallback={null}>
      <MixedQuizContent />
    </Suspense>
  );
}
