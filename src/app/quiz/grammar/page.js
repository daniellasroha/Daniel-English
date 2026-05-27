// Quiz Grammar — 16 soal tata bahasa dari berbagai topik
"use client";
import { useSearchParams } from "next/navigation";
import QuizEngine from "@/components/QuizEngine";

const soalGrammar = [
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
    jawaban: 2, tag: "Articles", penjelasan: "'Umbrella' diawali vokal 'u' → pakai 'an'. 'Hour' h-nya diam, bunyinya 'aur' → an hour."
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
    pertanyaan: "Mana yang benar untuk 'The most beautiful'?",
    pilihan: ["Most beautifulest", "The most beautiful", "The beautifulest", "More most beautiful"],
    jawaban: 1, tag: "Superlative", penjelasan: "Kata sifat panjang (3+ suku kata) → the most + kata sifat."
  },
  {
    pertanyaan: "\"I ___ very tired yesterday.\" Pilih yang benar:",
    pilihan: ["am", "is", "are", "was"],
    jawaban: 3, tag: "To Be", penjelasan: "I + was (masa lalu). I am (sekarang) → I was (kemarin)."
  },
  {
    pertanyaan: "Kalimat mana yang menggunakan Present Continuous dengan benar?",
    pilihan: ["She is cook dinner.", "She cooking dinner now.", "She is cooking dinner.", "She are cooking dinner."],
    jawaban: 2, tag: "Present Continuous", penjelasan: "She (He/She/It) + is + Verb-ing → She is cooking."
  },
  {
    pertanyaan: "\"___ you speak English?\" Pilih modal yang tepat untuk kemampuan:",
    pilihan: ["Must", "Should", "Can", "Will"],
    jawaban: 2, tag: "Modal Verbs", penjelasan: "'Can' digunakan untuk kemampuan. 'Can you speak English?' = Bisakah kamu berbicara bahasa Inggris?"
  },
  {
    pertanyaan: "Mana perbandingan yang benar? (good → better → ___)",
    pilihan: ["goodest", "most good", "better", "best"],
    jawaban: 3, tag: "Superlative", penjelasan: "'Good' adalah irregular: good → better → best."
  },
];

export default function GrammarQuizPage() {
  const params = useSearchParams();
  const pakaiTimer = params.get("timer") === "1";
  return (
    <QuizEngine
      judul="Grammar Quiz"
      emoji="✏️"
      soalList={soalGrammar}
      warnaBg="bg-gradient-to-br from-green-50 to-teal-100"
      warnaBtn="bg-green-600"
      kategori="grammar"
      pakaiTimer={pakaiTimer}
    />
  );
}
