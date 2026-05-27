// Quiz Grammar — soal dibedakan per level (Pemula vs Menengah)
"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QuizEngine from "@/components/QuizEngine";
import { useLevel } from "@/hooks/useLevel";

// ── PEMULA: 10 soal — hanya Simple Present Tense & To Be ──────────────────
const soalGrammarPemula = [
  {
    pertanyaan: "Pilih kalimat yang benar (Simple Present):",
    pilihan: ["She go to school every day.", "She goes to school every day.", "She going to school every day.", "She is go to school."],
    jawaban: 1, tag: "Simple Present",
    penjelasan: "Subjek 'She' (He/She/It) → Verb + s/es. Go → goes."
  },
  {
    pertanyaan: "\"Saya seorang pelajar.\" → Bahasa Inggrisnya:",
    pilihan: ["I are a student.", "I is a student.", "I am a student.", "I be a student."],
    jawaban: 2, tag: "To Be",
    penjelasan: "I → am. Rumus: I + am."
  },
  {
    pertanyaan: "Pilih yang benar untuk mengisi: \"___ you a teacher?\"",
    pilihan: ["Am", "Is", "Do", "Are"],
    jawaban: 3, tag: "To Be",
    penjelasan: "You → are. Pertanyaan: Are + you?"
  },
  {
    pertanyaan: "\"Dia tidak suka kopi.\" (Simple Present) → Pilih yang benar:",
    pilihan: ["She don't like coffee.", "She not like coffee.", "She doesn't like coffee.", "She isn't like coffee."],
    jawaban: 2, tag: "Simple Present",
    penjelasan: "He/She/It → doesn't + Verb 1 (tanpa -s)."
  },
  {
    pertanyaan: "\"Mereka ___ pelajar.\" → Bahasa Inggrisnya: They ___ students.",
    pilihan: ["am", "is", "are", "be"],
    jawaban: 2, tag: "To Be",
    penjelasan: "They → are. Rumus: They + are."
  },
  {
    pertanyaan: "Pilih kalimat pertanyaan yang benar (Simple Present):",
    pilihan: ["Does he speaks English?", "Do he speak English?", "Does he speak English?", "Is he speak English?"],
    jawaban: 2, tag: "Simple Present",
    penjelasan: "He/She/It → Does + Subjek + Verb 1 (tanpa -s)."
  },
  {
    pertanyaan: "\"Dia bukan seorang dokter.\" → Bahasa Inggrisnya:",
    pilihan: ["She don't a doctor.", "She isn't a doctor.", "She aren't a doctor.", "She not is a doctor."],
    jawaban: 1, tag: "To Be",
    penjelasan: "She + is not (isn't) → She isn't a doctor."
  },
  {
    pertanyaan: "\"Saya tidak suka sayur.\" → Pilih yang benar:",
    pilihan: ["I doesn't like vegetables.", "I not like vegetables.", "I am not like vegetables.", "I don't like vegetables."],
    jawaban: 3, tag: "Simple Present",
    penjelasan: "I/You/We/They → don't + Verb 1."
  },
  {
    pertanyaan: "Pilih kalimat yang benar tentang fakta umum:",
    pilihan: ["The sun rise in the east.", "The sun rises in the east.", "The sun is rise in the east.", "The sun rising in the east."],
    jawaban: 1, tag: "Simple Present",
    penjelasan: "Fakta umum → Simple Present. 'The sun' = He/She/It → rises."
  },
  {
    pertanyaan: "\"Apakah mereka di sini?\" → Bahasa Inggrisnya:",
    pilihan: ["Do they here?", "Is they here?", "Are they here?", "Am they here?"],
    jawaban: 2, tag: "To Be",
    penjelasan: "They → are. Pertanyaan: Are + they + here?"
  },
];

// ── MENENGAH: 16 soal — semua topik grammar ────────────────────────────────
const soalGrammarMenengah = [
  {
    pertanyaan: "Pilih kalimat yang benar:",
    pilihan: ["She go to school every day.", "She goes to school every day.", "She going to school every day.", "She is go to school every day."],
    jawaban: 1, tag: "Simple Present", penjelasan: "Subjek 'She' (He/She/It) harus pakai Verb+s/es → goes."
  },
  {
    pertanyaan: "\"Kemarin saya makan nasi.\" → Bahasa Inggrisnya?",
    pilihan: ["Yesterday I eat rice.", "Yesterday I eats rice.", "Yesterday I ate rice.", "Yesterday I eating rice."],
    jawaban: 2, tag: "Simple Past", penjelasan: "Past tense dari 'eat' adalah 'ate' (irregular verb)."
  },
  {
    pertanyaan: "Pilih yang benar untuk mengisi: \"___ she a doctor?\"",
    pilihan: ["Do", "Does", "Is", "Are"],
    jawaban: 2, tag: "To Be", penjelasan: "Gunakan 'Is' karena subjeknya 'she' (He/She/It → is)."
  },
  {
    pertanyaan: "\"Mereka sedang bermain bola.\" → Bahasa Inggrisnya?",
    pilihan: ["They play football now.", "They plays football now.", "They are playing football.", "They were playing football."],
    jawaban: 2, tag: "Present Continuous", penjelasan: "Sedang = Present Continuous → are + Verb-ing."
  },
  {
    pertanyaan: "Pilih penggunaan 'a' atau 'an' yang benar:",
    pilihan: ["a apple", "an book", "an umbrella", "a hour"],
    jawaban: 2, tag: "Articles", penjelasan: "'Umbrella' diawali vokal 'u' → pakai 'an'. 'Hour' h-nya diam, bunyinya vokal → an hour."
  },
  {
    pertanyaan: "\"Kamu harus belajar lebih keras.\" → Bahasa Inggrisnya?",
    pilihan: ["You can study harder.", "You must study harder.", "You will study harder.", "You should studied harder."],
    jawaban: 1, tag: "Modal Verbs", penjelasan: "'Harus' (keharusan kuat) = must."
  },
  {
    pertanyaan: "Mana kalimat masa depan yang benar?",
    pilihan: ["I will going to the mall.", "I going to the mall tomorrow.", "I am going to go to the mall.", "I go to the mall tomorrow."],
    jawaban: 2, tag: "Future Tense", penjelasan: "Going to future = am/is/are + going to + Verb 1."
  },
  {
    pertanyaan: "\"Dia lebih tinggi dari saya.\" → Bahasa Inggrisnya?",
    pilihan: ["He is more tall than me.", "He is taller than me.", "He is more taller than me.", "He is tallest than me."],
    jawaban: 1, tag: "Comparative", penjelasan: "'Tall' adalah kata sifat pendek → tambahkan -er → taller."
  },
  {
    pertanyaan: "Pilih kalimat negatif yang benar (Simple Present):",
    pilihan: ["He don't like coffee.", "He doesn't likes coffee.", "He doesn't like coffee.", "He not like coffee."],
    jawaban: 2, tag: "Simple Present", penjelasan: "He/She/It + doesn't + Verb 1 (tanpa -s)."
  },
  {
    pertanyaan: "\"Sebaiknya kamu pergi ke dokter.\" → Bahasa Inggrisnya?",
    pilihan: ["You must go to the doctor.", "You can go to the doctor.", "You should go to the doctor.", "You will go to the doctor."],
    jawaban: 2, tag: "Modal Verbs", penjelasan: "'Sebaiknya' (saran) = should."
  },
  {
    pertanyaan: "\"Kami TIDAK menonton film itu kemarin.\" → Bahasa Inggrisnya?",
    pilihan: ["We didn't watch that movie.", "We don't watched that movie.", "We didn't watched that movie.", "We not watch that movie."],
    jawaban: 0, tag: "Simple Past", penjelasan: "Negatif past = didn't + Verb 1 (bukan Verb 2)."
  },
  {
    pertanyaan: "Superlative yang benar dari 'beautiful':",
    pilihan: ["Most beautifulest", "The most beautiful", "The beautifulest", "More most beautiful"],
    jawaban: 1, tag: "Superlative", penjelasan: "Kata sifat panjang (3+ suku kata) → the most + kata sifat."
  },
  {
    pertanyaan: "\"I ___ very tired yesterday.\" Pilih yang benar:",
    pilihan: ["am", "is", "are", "was"],
    jawaban: 3, tag: "To Be", penjelasan: "I + was (masa lalu). I am (sekarang) → I was (kemarin)."
  },
  {
    pertanyaan: "Kalimat Present Continuous yang benar:",
    pilihan: ["She is cook dinner.", "She cooking dinner now.", "She is cooking dinner.", "She are cooking dinner."],
    jawaban: 2, tag: "Present Continuous", penjelasan: "She (He/She/It) + is + Verb-ing → She is cooking."
  },
  {
    pertanyaan: "\"___ you speak English?\" Modal yang tepat untuk kemampuan:",
    pilihan: ["Must", "Should", "Can", "Will"],
    jawaban: 2, tag: "Modal Verbs", penjelasan: "'Can' digunakan untuk kemampuan."
  },
  {
    pertanyaan: "Superlative dari 'good' yang benar: good → better → ___",
    pilihan: ["goodest", "most good", "better", "best"],
    jawaban: 3, tag: "Superlative", penjelasan: "'Good' adalah irregular: good → better → best."
  },
];

function GrammarQuizContent() {
  const params = useSearchParams();
  const pakaiTimer = params.get("timer") === "1";
  const { config } = useLevel();

  // Pilih soal sesuai level
  const soalList = config?.vocabLevel === "pemula"
    ? soalGrammarPemula
    : soalGrammarMenengah;

  const judulLevel = config?.vocabLevel === "pemula"
    ? "Grammar Quiz 🌱"
    : "Grammar Quiz 🚀";

  return (
    <QuizEngine
      judul={judulLevel}
      emoji="✏️"
      soalList={soalList}
      warnaBg="bg-gradient-to-br from-green-50 to-teal-100"
      warnaBtn="bg-green-600"
      kategori="grammar"
      pakaiTimer={pakaiTimer}
    />
  );
}

export default function GrammarQuizPage() {
  return (
    <Suspense fallback={null}>
      <GrammarQuizContent />
    </Suspense>
  );
}
