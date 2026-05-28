// Quiz Mixed — campuran vocabulary + grammar, diacak tiap sesi
"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QuizEngine from "@/components/QuizEngine";

// ── BANK SOAL: 40 soal campuran ─────────────────────────────
const soalMixed = [
  // Vocabulary — tingkat menengah
  { pertanyaan: "Apa arti 'Perseverance'?", pilihan: ["Keberanian", "Ketekunan / Pantang Menyerah", "Kesabaran", "Kejujuran"], jawaban: 1, tag: "Vocabulary" },
  { pertanyaan: "Apa arti kata 'Generous'?", pilihan: ["Dermawan", "Pemarah", "Pemalu", "Pelupa"], jawaban: 0, tag: "Vocabulary" },
  { pertanyaan: "Apa bahasa Inggrisnya 'Pelangi'?", pilihan: ["Storm", "Rainbow", "Sunshine", "Cloudy"], jawaban: 1, tag: "Vocabulary" },
  { pertanyaan: "Apa arti 'Earthquake'?", pilihan: ["Banjir", "Gempa Bumi", "Badai", "Kemarau"], jawaban: 1, tag: "Vocabulary" },
  { pertanyaan: "Apa arti kata 'Enormous'?", pilihan: ["Sangat Kecil", "Sangat Besar", "Sangat Cepat", "Sangat Indah"], jawaban: 1, tag: "Vocabulary" },
  { pertanyaan: "Kata 'Stubborn' artinya...", pilihan: ["Rajin", "Keras kepala", "Penakut", "Pemaaf"], jawaban: 1, tag: "Vocabulary" },
  { pertanyaan: "Apa arti 'Magnificent'?", pilihan: ["Mengerikan", "Biasa saja", "Megah / Luar biasa indah", "Membosankan"], jawaban: 2, tag: "Vocabulary" },
  { pertanyaan: "Apa arti kata 'Ambitious'?", pilihan: ["Pemalu", "Ambisius / Bersemangat tinggi", "Mudah menyerah", "Tidak peduli"], jawaban: 1, tag: "Vocabulary" },
  { pertanyaan: "Apa arti 'Exhausted'?", pilihan: ["Bersemangat", "Sangat lelah / Kelelahan", "Lapar sekali", "Sangat senang"], jawaban: 1, tag: "Vocabulary" },
  { pertanyaan: "Kata 'Fluent' dalam konteks bahasa artinya...", pilihan: ["Lambat berbicara", "Fasih / Lancar", "Tidak bisa berbicara", "Baru belajar"], jawaban: 1, tag: "Vocabulary" },
  { pertanyaan: "Apa arti kata 'Volunteer'?", pilihan: ["Karyawan", "Relawan", "Pemimpin", "Pendukung"], jawaban: 1, tag: "Vocabulary" },
  { pertanyaan: "Apa arti 'Peculiar'?", pilihan: ["Biasa", "Cantik", "Aneh / Ganjil", "Mahal"], jawaban: 2, tag: "Vocabulary" },
  { pertanyaan: "Apa bahasa Inggrisnya 'Kupu-kupu'?", pilihan: ["Dragonfly", "Bee", "Butterfly", "Mosquito"], jawaban: 2, tag: "Vocabulary" },
  { pertanyaan: "Apa arti 'Accomplish'?", pilihan: ["Gagal", "Mencoba", "Berhasil / Mencapai", "Menyerah"], jawaban: 2, tag: "Vocabulary" },
  { pertanyaan: "Apa arti kata 'Disaster'?", pilihan: ["Keberhasilan", "Bencana", "Perayaan", "Kesempatan"], jawaban: 1, tag: "Vocabulary" },
  { pertanyaan: "Kata 'Ancient' artinya...", pilihan: ["Modern", "Baru", "Kuno", "Tua"], jawaban: 2, tag: "Vocabulary" },
  { pertanyaan: "Apa bahasa Inggrisnya 'Berteriak'?", pilihan: ["Whisper", "Speak", "Shout", "Murmur"], jawaban: 2, tag: "Vocabulary" },
  { pertanyaan: "Kata 'Shy' artinya...", pilihan: ["Sombong", "Pemalu", "Pemarah", "Pemberani"], jawaban: 1, tag: "Vocabulary" },
  // Grammar
  { pertanyaan: "Pilih kalimat yang benar:", pilihan: ["I am go to school.", "I goes to school.", "I go to school.", "I going to school."], jawaban: 2, tag: "Grammar", penjelasan: "I → pakai Verb bentuk dasar tanpa -s." },
  { pertanyaan: "'___ he working right now?' Pilih yang benar:", pilihan: ["Do", "Does", "Is", "Are"], jawaban: 2, tag: "Grammar", penjelasan: "He (He/She/It) + is → Is he working?" },
  { pertanyaan: "Kalimat comparative yang benar:", pilihan: ["This is more cheap than that.", "This is cheaper than that.", "This is more cheaper than that.", "This is cheapest than that."], jawaban: 1, tag: "Grammar", penjelasan: "'Cheap' pendek → tambahkan -er → cheaper." },
  { pertanyaan: "Pilih penggunaan modal yang tepat untuk saran:", pilihan: ["You must eat vegetables.", "You can eat vegetables.", "You should eat vegetables.", "You will eat vegetables."], jawaban: 2, tag: "Grammar", penjelasan: "'Should' untuk saran/anjuran." },
  { pertanyaan: "'Saya sedang membaca buku.' → Bahasa Inggrisnya?", pilihan: ["I read a book.", "I am read a book.", "I reading a book.", "I am reading a book."], jawaban: 3, tag: "Grammar", penjelasan: "Sedang = am/is/are + Verb-ing → I am reading." },
  { pertanyaan: "Mana artikel yang benar?", pilihan: ["a elephant", "an university", "an honest man", "a apple"], jawaban: 2, tag: "Grammar", penjelasan: "'Honest' → h-nya diam, bunyinya vokal → an honest." },
  { pertanyaan: "'Dia tidak suka kopi.' (Simple Present) → Bahasa Inggrisnya?", pilihan: ["She don't like coffee.", "She not likes coffee.", "She doesn't like coffee.", "She isn't like coffee."], jawaban: 2, tag: "Grammar", penjelasan: "She → doesn't + Verb 1 (tanpa -s)." },
  { pertanyaan: "Superlative dari 'bad' adalah...", pilihan: ["baddest", "more bad", "worst", "most bad"], jawaban: 2, tag: "Grammar", penjelasan: "Irregular: bad → worse → worst." },
  { pertanyaan: "'Kami akan pergi ke pantai besok.' Gunakan 'going to':", pilihan: ["We will going to the beach.", "We are go to the beach.", "We are going to go to the beach.", "We going to the beach tomorrow."], jawaban: 2, tag: "Grammar", penjelasan: "Going to future = are + going to + Verb 1." },
  { pertanyaan: "Pilih kalimat past tense yang benar:", pilihan: ["I buyed a new phone.", "I buyed a phone yesterday.", "I bought a new phone yesterday.", "I was buy a new phone."], jawaban: 2, tag: "Grammar", penjelasan: "Irregular: buy → bought (bukan buyed)." },
  { pertanyaan: "Kalimat Simple Present yang benar untuk She:", pilihan: ["She go to work.", "She goes to work.", "She going to work.", "She gone to work."], jawaban: 1, tag: "Grammar" },
  { pertanyaan: "Terjemahkan: 'Saya sudah makan tadi.'", pilihan: ["I eat already.", "I already eaten.", "I have already eaten.", "I was eat already."], jawaban: 2, tag: "Grammar" },
  { pertanyaan: "'The book is ___ the table.' (di atas)", pilihan: ["in", "on", "at", "under"], jawaban: 1, tag: "Grammar" },
  { pertanyaan: "Kalimat tanya yang benar:", pilihan: ["You where live?", "Where you live?", "Where do you live?", "Do you where live?"], jawaban: 2, tag: "Grammar" },
  { pertanyaan: "Pilih artikel yang benar: '___ apple a day keeps the doctor away.'", pilihan: ["A", "An", "The", "No article"], jawaban: 1, tag: "Grammar", penjelasan: "'Apple' diawali vokal → an apple." },
  { pertanyaan: "Bentuk Past dari 'go' adalah...", pilihan: ["goed", "goes", "going", "went"], jawaban: 3, tag: "Grammar" },
  { pertanyaan: "Terjemahkan: 'Apakah kamu sedang belajar sekarang?'", pilihan: ["Do you study now?", "Are you study now?", "Are you studying now?", "Do you studying now?"], jawaban: 2, tag: "Grammar" },
  { pertanyaan: "'She ___ not come to school yesterday.'", pilihan: ["do", "does", "did", "is"], jawaban: 2, tag: "Grammar", penjelasan: "Kalimat negatif past tense → didn't / did not." },
  { pertanyaan: "Superlative dari 'good' adalah...", pilihan: ["gooder", "more good", "best", "goodest"], jawaban: 2, tag: "Grammar", penjelasan: "Irregular: good → better → best." },
  { pertanyaan: "Kata kunci Simple Past tense:", pilihan: ["Every day", "Right now", "Tomorrow", "Yesterday / Last week"], jawaban: 3, tag: "Grammar" },
  { pertanyaan: "Modal 'can' digunakan untuk...", pilihan: ["Kewajiban", "Kemampuan", "Larangan", "Saran"], jawaban: 1, tag: "Grammar" },
  { pertanyaan: "Kalimat yang benar untuk Present Continuous:", pilihan: ["She is study now.", "She studying now.", "She is studying now.", "She are studying now."], jawaban: 2, tag: "Grammar" },
];

function MixedQuizContent() {
  const params = useSearchParams();
  const pakaiTimer = params.get("timer") === "1";
  return (
    <QuizEngine
      judul="Mixed Quiz 🎯"
      emoji="🎯"
      soalList={soalMixed}
      maxSoal={15}
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
