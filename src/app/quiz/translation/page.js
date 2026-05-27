// Quiz Translation — terjemahkan kalimat Indonesia ke Inggris, dibedakan per level
"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QuizEngine from "@/components/QuizEngine";
import { useLevel } from "@/hooks/useLevel";

// ── PEMULA: 12 soal — kalimat sederhana (Simple Present + To Be) ───────────
const soalTranslationPemula = [
  {
    pertanyaan: "\"Saya suka makan apel.\" → Pilih terjemahan yang benar:",
    pilihan: ["I like eat apple.", "I likes to eat apples.", "I like to eat apples.", "I am like apples."],
    jawaban: 2, tag: "Simple Present",
    penjelasan: "I + like + to + Verb. 'I like to eat apples.' adalah yang paling natural."
  },
  {
    pertanyaan: "\"Dia seorang guru.\" → Bahasa Inggrisnya:",
    pilihan: ["She are a teacher.", "She is a teacher.", "She am a teacher.", "She be a teacher."],
    jawaban: 1, tag: "To Be",
    penjelasan: "She → is. Rumus: She is a teacher."
  },
  {
    pertanyaan: "\"Kucing itu tidur di sofa.\" → Pilih yang benar:",
    pilihan: ["The cat sleep on the sofa.", "The cat sleeps on the sofa.", "The cat is sleep on the sofa.", "The cats sleep on the sofa."],
    jawaban: 1, tag: "Simple Present",
    penjelasan: "'The cat' = He/She/It → sleep + s → sleeps."
  },
  {
    pertanyaan: "\"Kami pergi ke sekolah setiap hari.\" → Pilih yang benar:",
    pilihan: ["We going to school every day.", "We goes to school every day.", "We are go to school every day.", "We go to school every day."],
    jawaban: 3, tag: "Simple Present",
    penjelasan: "We → Verb bentuk dasar (tanpa -s). We go to school."
  },
  {
    pertanyaan: "\"Apakah kamu lapar?\" → Bahasa Inggrisnya:",
    pilihan: ["Do you hungry?", "Are you hungry?", "Is you hungry?", "You are hungry?"],
    jawaban: 1, tag: "To Be",
    penjelasan: "You → are. Pertanyaan: Are + you + hungry?"
  },
  {
    pertanyaan: "\"Dia tidak marah.\" → Pilih yang benar:",
    pilihan: ["She isn't angry.", "She doesn't angry.", "She aren't angry.", "She not angry."],
    jawaban: 0, tag: "To Be",
    penjelasan: "She is → negatif: She isn't (is not) angry."
  },
  {
    pertanyaan: "\"Anjing itu berlari cepat.\" → Bahasa Inggrisnya:",
    pilihan: ["The dog run fast.", "The dog is run fast.", "The dog runs fast.", "The dog running fast."],
    jawaban: 2, tag: "Simple Present",
    penjelasan: "'The dog' = He/She/It → run + s → runs."
  },
  {
    pertanyaan: "\"Saya minum air setiap pagi.\" → Pilih yang benar:",
    pilihan: ["I drink water every morning.", "I drinks water every morning.", "I am drink water every morning.", "I drinking water every morning."],
    jawaban: 0, tag: "Simple Present",
    penjelasan: "I → Verb bentuk dasar. I drink water every morning."
  },
  {
    pertanyaan: "\"Mereka senang hari ini.\" → Bahasa Inggrisnya:",
    pilihan: ["They is happy today.", "They are happy today.", "They am happy today.", "They happy today."],
    jawaban: 1, tag: "To Be",
    penjelasan: "They → are. They are happy today."
  },
  {
    pertanyaan: "\"Ini bukan buku saya.\" → Pilih yang benar:",
    pilihan: ["This is not my book.", "This not my book.", "This isn't book mine.", "This don't my book."],
    jawaban: 0, tag: "To Be",
    penjelasan: "This is → negatif: This is not (isn't) my book."
  },
  {
    pertanyaan: "\"Burung itu bernyanyi setiap pagi.\" → Bahasa Inggrisnya:",
    pilihan: ["The bird sing every morning.", "The bird sings every morning.", "The bird is sing every morning.", "The bird singing every morning."],
    jawaban: 1, tag: "Simple Present",
    penjelasan: "'The bird' = He/She/It → sing + s → sings."
  },
  {
    pertanyaan: "\"Kamu adalah pelajar yang baik.\" → Pilih yang benar:",
    pilihan: ["You is a good student.", "You are a good student.", "You am a good student.", "You a good student."],
    jawaban: 1, tag: "To Be",
    penjelasan: "You → are. You are a good student."
  },
];

// ── MENENGAH: 15 soal — kalimat kompleks (semua grammar) ──────────────────
const soalTranslationMenengah = [
  {
    pertanyaan: "\"Dia sedang memasak makan malam.\" → Bahasa Inggrisnya:",
    pilihan: ["She cook dinner now.", "She is cook dinner.", "She is cooking dinner.", "She are cooking dinner."],
    jawaban: 2, tag: "Present Continuous",
    penjelasan: "Sedang = She is + Verb-ing → She is cooking dinner."
  },
  {
    pertanyaan: "\"Kami pergi ke pantai kemarin.\" → Pilih yang benar:",
    pilihan: ["We go to the beach yesterday.", "We went to the beach yesterday.", "We going to the beach yesterday.", "We were go to the beach yesterday."],
    jawaban: 1, tag: "Simple Past",
    penjelasan: "Kemarin = Simple Past. Go → went (irregular)."
  },
  {
    pertanyaan: "\"Kamu harus belajar lebih keras.\" → Bahasa Inggrisnya:",
    pilihan: ["You should studied harder.", "You must study harder.", "You can to study harder.", "You will studied harder."],
    jawaban: 1, tag: "Modal Verbs",
    penjelasan: "'Harus' (keharusan) = must. must + Verb 1."
  },
  {
    pertanyaan: "\"Mobil ini lebih cepat dari sepeda motor.\" → Pilih yang benar:",
    pilihan: ["This car more fast than a motorcycle.", "This car is more faster than a motorcycle.", "This car is faster than a motorcycle.", "This car faster than motorcycle."],
    jawaban: 2, tag: "Comparative",
    penjelasan: "'Fast' pendek → fast + er = faster. This car is faster than..."
  },
  {
    pertanyaan: "\"Sebaiknya kamu pergi ke dokter.\" → Bahasa Inggrisnya:",
    pilihan: ["You must go to the doctor.", "You will go to the doctor.", "You should go to the doctor.", "You can go to the doctor."],
    jawaban: 2, tag: "Modal Verbs",
    penjelasan: "'Sebaiknya' (saran) = should."
  },
  {
    pertanyaan: "\"Mereka tidak menonton film itu kemarin.\" → Pilih yang benar:",
    pilihan: ["They didn't watch that movie.", "They don't watched that movie.", "They didn't watched that movie.", "They not watch that movie."],
    jawaban: 0, tag: "Simple Past",
    penjelasan: "Negatif Past = didn't + Verb 1. Bukan Verb 2 setelah didn't."
  },
  {
    pertanyaan: "\"Saya akan pergi ke Jakarta besok.\" (going to) → Bahasa Inggrisnya:",
    pilihan: ["I will going to Jakarta.", "I am going to go to Jakarta.", "I going to Jakarta tomorrow.", "I go to Jakarta tomorrow."],
    jawaban: 1, tag: "Future Tense",
    penjelasan: "Going to future = am/is/are + going to + Verb 1."
  },
  {
    pertanyaan: "\"Ini adalah apel yang paling manis.\" → Pilih yang benar:",
    pilihan: ["This is the sweeter apple.", "This is the most sweetest apple.", "This is the sweetest apple.", "This is more sweet apple."],
    jawaban: 2, tag: "Superlative",
    penjelasan: "'Sweet' pendek → sweet + est = sweetest. Superlative: the + kata sifat + est."
  },
  {
    pertanyaan: "\"Bisakah kamu berbicara bahasa Inggris?\" → Bahasa Inggrisnya:",
    pilihan: ["Should you speak English?", "Can you speak English?", "Must you speak English?", "Will you speak English?"],
    jawaban: 1, tag: "Modal Verbs",
    penjelasan: "'Bisa' (kemampuan) = can. Can + Subjek + Verb 1?"
  },
  {
    pertanyaan: "\"Dia tidak pergi ke kantor kemarin.\" → Pilih yang benar:",
    pilihan: ["She didn't go to the office yesterday.", "She doesn't went to the office.", "She didn't went to the office.", "She wasn't go to the office."],
    jawaban: 0, tag: "Simple Past",
    penjelasan: "Negatif Past = didn't + Verb 1 (go, bukan went)."
  },
  {
    pertanyaan: "\"Saya sedang belajar bahasa Inggris sekarang.\" → Bahasa Inggrisnya:",
    pilihan: ["I study English now.", "I am study English now.", "I am studying English now.", "I studying English now."],
    jawaban: 2, tag: "Present Continuous",
    penjelasan: "Sedang = I am + Verb-ing → I am studying."
  },
  {
    pertanyaan: "\"Dia lebih pintar dari kakaknya.\" → Pilih yang benar:",
    pilihan: ["She is more smart than her brother.", "She is smarter than her brother.", "She is most smart than her brother.", "She is smartest than her brother."],
    jawaban: 1, tag: "Comparative",
    penjelasan: "'Smart' pendek → smart + er = smarter."
  },
  {
    pertanyaan: "\"Ini adalah sebuah payung, bukan tas.\" → Pilih yang benar:",
    pilihan: ["This is a umbrella, not a bag.", "This is an umbrella, not a bag.", "This is an umbrella, not bag.", "This is a umbrella, not bag."],
    jawaban: 1, tag: "Articles",
    penjelasan: "'Umbrella' dimulai huruf vokal 'u' → pakai 'an', bukan 'a'."
  },
  {
    pertanyaan: "\"Dia paling tinggi di kelas.\" → Bahasa Inggrisnya:",
    pilihan: ["She is the more tall in class.", "She is taller in class.", "She is the tallest in the class.", "She is most tall in class."],
    jawaban: 2, tag: "Superlative",
    penjelasan: "Superlative 'tall' → the tallest. Gunakan 'the' di depan superlative."
  },
  {
    pertanyaan: "\"Kami akan berlibur ke Bali minggu depan.\" → Pilih yang benar:",
    pilihan: ["We will going to Bali next week.", "We are going to go to Bali next week.", "We going to Bali next week.", "We is going to Bali next week."],
    jawaban: 1, tag: "Future Tense",
    penjelasan: "Going to future: We + are + going to + Verb 1."
  },
];

function TranslationQuizContent() {
  const params = useSearchParams();
  const pakaiTimer = params.get("timer") === "1";
  const { config } = useLevel();

  // Pilih soal sesuai level
  const soalList = config?.vocabLevel === "pemula"
    ? soalTranslationPemula
    : soalTranslationMenengah;

  const judulLevel = config?.vocabLevel === "pemula"
    ? "Translation Quiz 🌱"
    : "Translation Quiz 🚀";

  return (
    <QuizEngine
      judul={judulLevel}
      emoji="🌐"
      soalList={soalList}
      warnaBg="bg-gradient-to-br from-sky-50 to-blue-100"
      warnaBtn="bg-sky-600"
      kategori="translation"
      pakaiTimer={pakaiTimer}
    />
  );
}

export default function TranslationQuizPage() {
  return (
    <Suspense fallback={null}>
      <TranslationQuizContent />
    </Suspense>
  );
}
