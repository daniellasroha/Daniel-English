// Quiz Translation — terjemah Indonesia → Inggris, diacak tiap sesi
"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QuizEngine from "@/components/QuizEngine";
import { useLevel } from "@/hooks/useLevel";

// ── PEMULA: 28 soal ─────────────────────────────────────────
const soalTranslationPemula = [
  { pertanyaan: "Terjemahkan: 'Saya adalah seorang pelajar.'", pilihan: ["I are a student.", "I is a student.", "I am a student.", "I be a student."], jawaban: 2, tag: "To Be" },
  { pertanyaan: "Terjemahkan: 'Dia (pria) adalah guru.'", pilihan: ["He am a teacher.", "He are a teacher.", "He is a teacher.", "He be a teacher."], jawaban: 2, tag: "To Be" },
  { pertanyaan: "Terjemahkan: 'Kami adalah teman.'", pilihan: ["We am friends.", "We is friends.", "We be friends.", "We are friends."], jawaban: 3, tag: "To Be" },
  { pertanyaan: "Terjemahkan: 'Nama saya adalah Sari.'", pilihan: ["My name are Sari.", "My name is Sari.", "I name is Sari.", "Name my is Sari."], jawaban: 1, tag: "Perkenalan" },
  { pertanyaan: "Terjemahkan: 'Saya dari Indonesia.'", pilihan: ["I am at Indonesia.", "I am in Indonesia.", "I am from Indonesia.", "I from am Indonesia."], jawaban: 2, tag: "Perkenalan" },
  { pertanyaan: "Terjemahkan: 'Saya tidak sedih.'", pilihan: ["I am not sad.", "I is not sad.", "I not am sad.", "I are not sad."], jawaban: 0, tag: "To Be" },
  { pertanyaan: "Terjemahkan: 'Apakah kamu senang?'", pilihan: ["You are happy?", "Is you happy?", "Are you happy?", "Do you happy?"], jawaban: 2, tag: "To Be" },
  { pertanyaan: "Terjemahkan: 'Saya makan nasi setiap hari.'", pilihan: ["I eating rice every day.", "I eat rice every day.", "I eats rice every day.", "I am eat rice every day."], jawaban: 1, tag: "Simple Present" },
  { pertanyaan: "Terjemahkan: 'Dia (wanita) belajar setiap malam.'", pilihan: ["She study every night.", "She studying every night.", "She studies every night.", "She is studies every night."], jawaban: 2, tag: "Simple Present" },
  { pertanyaan: "Terjemahkan: 'Saya tidak suka ikan.'", pilihan: ["I don't like fish.", "I doesn't like fish.", "I am not like fish.", "I not like fish."], jawaban: 0, tag: "Simple Present" },
  { pertanyaan: "Terjemahkan: 'Apakah kamu suka kopi?'", pilihan: ["Are you like coffee?", "Do you like coffee?", "Does you like coffee?", "Is you like coffee?"], jawaban: 1, tag: "Simple Present" },
  { pertanyaan: "Terjemahkan: 'Kucing itu hitam.'", pilihan: ["The cat are black.", "The cat am black.", "The cat is black.", "The cat be black."], jawaban: 2, tag: "Deskripsi" },
  { pertanyaan: "Terjemahkan: 'Langit berwarna biru.'", pilihan: ["The sky are blue.", "The sky is blue.", "The sky am blue.", "Sky is blue the."], jawaban: 1, tag: "Deskripsi" },
  { pertanyaan: "Terjemahkan: 'Ayah saya adalah dokter.'", pilihan: ["My father are a doctor.", "My father am a doctor.", "Father my is a doctor.", "My father is a doctor."], jawaban: 3, tag: "Keluarga" },
  { pertanyaan: "Terjemahkan: 'Kakak perempuan saya cantik.'", pilihan: ["My sister is beautiful.", "My sister are beautiful.", "My sister am beautiful.", "My beautiful sister is."], jawaban: 0, tag: "Keluarga" },
  { pertanyaan: "Terjemahkan: 'Saya pergi ke sekolah setiap hari.'", pilihan: ["I goes to school every day.", "I am going school every day.", "I go to school every day.", "I going to school every day."], jawaban: 2, tag: "Simple Present" },
  { pertanyaan: "Terjemahkan: 'Dia (pria) tidak datang.'", pilihan: ["He doesn't comes.", "He don't come.", "He doesn't come.", "He isn't come."], jawaban: 2, tag: "Simple Present" },
  { pertanyaan: "Terjemahkan: 'Apakah dia (wanita) seorang pelajar?'", pilihan: ["She is a student?", "Is she a student?", "Does she is a student?", "Are she a student?"], jawaban: 1, tag: "To Be" },
  { pertanyaan: "Terjemahkan: 'Buku itu ada di atas meja.'", pilihan: ["The book is in the table.", "The book is at the table.", "The book is on the table.", "The book is under the table."], jawaban: 2, tag: "Preposisi" },
  { pertanyaan: "Terjemahkan: 'Kucing ada di dalam kotak.'", pilihan: ["The cat is on the box.", "The cat is in the box.", "The cat is at the box.", "The cat is near the box."], jawaban: 1, tag: "Preposisi" },
  { pertanyaan: "Terjemahkan: 'Saya bangun pukul 6 pagi.'", pilihan: ["I wake up at 6 AM.", "I wakes up at 6 AM.", "I am wake up at 6 AM.", "I wake up in 6 AM."], jawaban: 0, tag: "Waktu" },
  { pertanyaan: "Terjemahkan: 'Mereka bermain sepak bola.'", pilihan: ["They plays football.", "They is playing football.", "They play football.", "They playing football."], jawaban: 2, tag: "Simple Present" },
  { pertanyaan: "Terjemahkan: 'Ini adalah seekor anjing.'", pilihan: ["This are a dog.", "This is a dog.", "This am a dog.", "This be a dog."], jawaban: 1, tag: "To Be" },
  { pertanyaan: "Terjemahkan: 'Selamat pagi, apa kabar?'", pilihan: ["Good morning, how are you?", "Good morning, who are you?", "Morning good, how you are?", "Good morning, how you?"], jawaban: 0, tag: "Salam" },
  { pertanyaan: "Terjemahkan: 'Saya tidak bermain setiap hari.'", pilihan: ["I doesn't play every day.", "I don't plays every day.", "I don't play every day.", "I am not play every day."], jawaban: 2, tag: "Simple Present" },
  { pertanyaan: "Terjemahkan: 'Rumah kami besar.'", pilihan: ["Our house are big.", "Our house am big.", "Our house is big.", "Our is house big."], jawaban: 2, tag: "To Be" },
  { pertanyaan: "Terjemahkan: 'Saya minum susu setiap pagi.'", pilihan: ["I drink milk every morning.", "I drinks milk every morning.", "I am drink milk every morning.", "I drinking milk every morning."], jawaban: 0, tag: "Simple Present" },
  { pertanyaan: "Terjemahkan: 'Di mana kamu tinggal?'", pilihan: ["What do you live?", "Where you live?", "Where do you live?", "Where are you living at?"], jawaban: 2, tag: "Kalimat Tanya" },
];

// ── MENENGAH: 30 soal ────────────────────────────────────────
const soalTranslationMenengah = [
  { pertanyaan: "Terjemahkan: 'Saya sudah makan tadi.'", pilihan: ["I eat already.", "I already eaten.", "I have already eaten.", "I was eat already."], jawaban: 2, tag: "Present Perfect" },
  { pertanyaan: "Terjemahkan: 'Dia pergi ke pasar kemarin.'", pilihan: ["She go to the market yesterday.", "She goes to the market yesterday.", "She went to the market yesterday.", "She is going to the market yesterday."], jawaban: 2, tag: "Simple Past" },
  { pertanyaan: "Terjemahkan: 'Saya sedang belajar sekarang.'", pilihan: ["I study now.", "I am studying now.", "I studies now.", "I studying now."], jawaban: 1, tag: "Present Continuous" },
  { pertanyaan: "Terjemahkan: 'Mereka tidak datang kemarin.'", pilihan: ["They don't come yesterday.", "They didn't come yesterday.", "They doesn't come yesterday.", "They wasn't come yesterday."], jawaban: 1, tag: "Simple Past" },
  { pertanyaan: "Terjemahkan: 'Saya akan pergi ke Bali besok.'", pilihan: ["I go to Bali tomorrow.", "I will goes to Bali tomorrow.", "I will go to Bali tomorrow.", "I am go to Bali tomorrow."], jawaban: 2, tag: "Simple Future" },
  { pertanyaan: "Terjemahkan: 'Apakah dia sedang menangis?'", pilihan: ["Does she crying?", "Is she cry?", "Is she crying?", "Does she cry?"], jawaban: 2, tag: "Present Continuous" },
  { pertanyaan: "Terjemahkan: 'Buku ini lebih tebal dari buku itu.'", pilihan: ["This book is more thick than that book.", "This book is thick than that book.", "This book is thicker than that book.", "This book is thickest than that book."], jawaban: 2, tag: "Comparative" },
  { pertanyaan: "Terjemahkan: 'Dia adalah siswa terbaik di kelas.'", pilihan: ["She is the gooder student in class.", "She is the best student in class.", "She is the most good student in class.", "She is better student in class."], jawaban: 1, tag: "Superlative" },
  { pertanyaan: "Terjemahkan: 'Kamu sebaiknya belajar lebih rajin.'", pilihan: ["You must study harder.", "You can study harder.", "You should study harder.", "You will study harder."], jawaban: 2, tag: "Modal" },
  { pertanyaan: "Terjemahkan: 'Saya bisa berbicara bahasa Inggris.'", pilihan: ["I must speak English.", "I should speak English.", "I will speak English.", "I can speak English."], jawaban: 3, tag: "Modal" },
  { pertanyaan: "Terjemahkan: 'Makanan ini lebih enak daripada itu.'", pilihan: ["This food is more delicious than that.", "This food is deliciouser than that.", "This food is most delicious than that.", "This food is the most delicious than that."], jawaban: 0, tag: "Comparative" },
  { pertanyaan: "Terjemahkan: 'Ketika saya kecil, saya suka bermain.'", pilihan: ["When I was small, I liked to play.", "When I am small, I like to play.", "When I small, I like play.", "When I was small, I like to play."], jawaban: 0, tag: "Simple Past" },
  { pertanyaan: "Terjemahkan: 'Tolong jangan berisik.'", pilihan: ["Don't be noisy, please.", "Please not noisy.", "Please not be noisy.", "Don't noisy, please."], jawaban: 0, tag: "Imperative" },
  { pertanyaan: "Terjemahkan: 'Sebuah apel sehari membuat dokter menjauh.'", pilihan: ["A apple a day keeps the doctor away.", "An apple a day keeps the doctor away.", "The apple a day keeps the doctor away.", "Apple a day keeps the doctor away."], jawaban: 1, tag: "Articles" },
  { pertanyaan: "Terjemahkan: 'Berapa banyak siswa di kelas ini?'", pilihan: ["How much students are in this class?", "How many students are in this class?", "How many students is in this class?", "How many students in this class?"], jawaban: 1, tag: "Question" },
  { pertanyaan: "Terjemahkan: 'Saya tidak pernah makan daging.'", pilihan: ["I don't ever eat meat.", "I have never eat meat.", "I have never eaten meat.", "I never eat meat never."], jawaban: 2, tag: "Present Perfect" },
  { pertanyaan: "Terjemahkan: 'Matahari terbit di timur.'", pilihan: ["The sun rises in the east.", "The sun rise in the east.", "The sun rising in the east.", "Sun rises in the east."], jawaban: 0, tag: "Simple Present" },
  { pertanyaan: "Terjemahkan: 'Dia lebih tinggi dari saya.'", pilihan: ["He is tall than me.", "He is more tall than me.", "He is tallest than me.", "He is taller than me."], jawaban: 3, tag: "Comparative" },
  { pertanyaan: "Terjemahkan: 'Apa yang sedang kamu lakukan?'", pilihan: ["What do you doing?", "What you are doing?", "What are you doing?", "What you doing?"], jawaban: 2, tag: "Present Continuous" },
  { pertanyaan: "Terjemahkan: 'Saya belum pernah ke Jepang.'", pilihan: ["I have never been to Japan.", "I never go to Japan.", "I have not go to Japan.", "I was never to Japan."], jawaban: 0, tag: "Present Perfect" },
  { pertanyaan: "Terjemahkan: 'Jika saya kaya, saya akan keliling dunia.'", pilihan: ["If I am rich, I travel the world.", "If I was rich, I would travel the world.", "If I were rich, I will travel the world.", "If I rich, I travel the world."], jawaban: 1, tag: "Conditional" },
  { pertanyaan: "Terjemahkan: 'Saya sedang menunggu bus.'", pilihan: ["I wait the bus.", "I am waiting for the bus.", "I am wait for the bus.", "I waiting for the bus."], jawaban: 1, tag: "Present Continuous" },
  { pertanyaan: "Terjemahkan: 'Dia tidak boleh merokok di sini.'", pilihan: ["He can't smoke here.", "He mustn't smoke here.", "He shouldn't smoke here.", "He won't smoke here."], jawaban: 1, tag: "Modal" },
  { pertanyaan: "Terjemahkan: 'Kapan kamu lahir?'", pilihan: ["Where were you born?", "When you were born?", "When were you born?", "When are you born?"], jawaban: 2, tag: "Question" },
  { pertanyaan: "Terjemahkan: 'Saya sudah tinggal di Jakarta selama 5 tahun.'", pilihan: ["I lived in Jakarta for 5 years.", "I live in Jakarta since 5 years.", "I have lived in Jakarta for 5 years.", "I am living in Jakarta since 5 years."], jawaban: 2, tag: "Present Perfect" },
  { pertanyaan: "Terjemahkan: 'Ini adalah buku yang paling menarik.'", pilihan: ["This is a more interesting book.", "This is the interesting book.", "This is the most interesting book.", "This is most interesting the book."], jawaban: 2, tag: "Superlative" },
  { pertanyaan: "Terjemahkan: 'Mengapa kamu terlambat?'", pilihan: ["What you are late?", "Why you are late?", "Why are you late?", "Where are you late?"], jawaban: 2, tag: "Question" },
  { pertanyaan: "Terjemahkan: 'Saya sedang belajar ketika dia telepon.'", pilihan: ["I study when he called.", "I was studying when he called.", "I am studying when he called.", "I studied when he was calling."], jawaban: 1, tag: "Past Continuous" },
  { pertanyaan: "Terjemahkan: 'Ada banyak orang di pasar.'", pilihan: ["There is many people at the market.", "There are much people at the market.", "There are many people at the market.", "There were many peoples at the market."], jawaban: 2, tag: "There is/are" },
  { pertanyaan: "Terjemahkan: 'Saya ingin menjadi dokter.'", pilihan: ["I want become a doctor.", "I want to become a doctor.", "I am want to become a doctor.", "I wanting to become a doctor."], jawaban: 1, tag: "Infinitive" },
];

function TranslationQuizContent() {
  const params = useSearchParams();
  const pakaiTimer = params.get("timer") === "1";
  const { config } = useLevel();

  const soalList = config?.vocabLevel === "a1"
    ? soalTranslationPemula
    : soalTranslationMenengah;

  const judulLevel = config?.vocabLevel === "a1"
    ? "Translation Quiz 🌱"
    : "Translation Quiz 🚀";

  return (
    <QuizEngine
      judul={judulLevel}
      emoji="🌐"
      soalList={soalList}
      maxSoal={10}
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
