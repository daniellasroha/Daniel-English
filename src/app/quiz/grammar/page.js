// Quiz Grammar — soal dibedakan per level, diacak tiap sesi
"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QuizEngine from "@/components/QuizEngine";
import { useLevel } from "@/hooks/useLevel";

// ── PEMULA: 32 soal — Simple Present + To Be + Salam + Kata Ganti ──
const soalGrammarPemula = [
  // To Be
  { pertanyaan: "Pilih To Be yang benar: 'I ___ a student.'", pilihan: ["is", "are", "am", "be"], jawaban: 2, tag: "To Be" },
  { pertanyaan: "Pilih To Be yang benar: 'She ___ happy.'", pilihan: ["am", "are", "be", "is"], jawaban: 3, tag: "To Be" },
  { pertanyaan: "Pilih To Be yang benar: 'They ___ my friends.'", pilihan: ["is", "am", "are", "be"], jawaban: 2, tag: "To Be" },
  { pertanyaan: "Pilih To Be yang benar: 'He ___ a doctor.'", pilihan: ["am", "are", "is", "be"], jawaban: 2, tag: "To Be" },
  { pertanyaan: "Pilih To Be yang benar: 'We ___ students.'", pilihan: ["am", "is", "be", "are"], jawaban: 3, tag: "To Be" },
  { pertanyaan: "Pilih To Be yang benar: 'It ___ a cat.'", pilihan: ["am", "are", "is", "be"], jawaban: 2, tag: "To Be" },
  { pertanyaan: "Kalimat negatif: 'I ___ not a teacher.'", pilihan: ["is", "are", "am", "be"], jawaban: 2, tag: "To Be" },
  { pertanyaan: "Membuat kalimat tanya: '___ she a teacher?'", pilihan: ["Am", "Are", "Is", "Be"], jawaban: 2, tag: "To Be" },
  { pertanyaan: "Singkatan dari 'are not' adalah...", pilihan: ["arent", "aren't", "are'nt", "arnot"], jawaban: 1, tag: "To Be" },
  { pertanyaan: "Kalimat yang benar adalah...", pilihan: ["I are happy.", "I am happy.", "I is happy.", "I be happy."], jawaban: 1, tag: "To Be" },
  // Simple Present
  { pertanyaan: "Pilih kata kerja yang benar: 'She ___ to school every day.'", pilihan: ["go", "goes", "going", "went"], jawaban: 1, tag: "Simple Present" },
  { pertanyaan: "Pilih kata kerja yang benar: 'They ___ football.'", pilihan: ["plays", "playing", "play", "played"], jawaban: 2, tag: "Simple Present" },
  { pertanyaan: "Pilih kata kerja yang benar: 'He ___ rice every day.'", pilihan: ["eat", "eating", "eats", "ate"], jawaban: 2, tag: "Simple Present" },
  { pertanyaan: "Kalimat Simple Present yang benar:", pilihan: ["She go to school.", "She goes to school.", "She going to school.", "She gone to school."], jawaban: 1, tag: "Simple Present" },
  { pertanyaan: "Kalimat negatif: 'I ___ not like fish.'", pilihan: ["is", "am", "does", "do"], jawaban: 3, tag: "Simple Present" },
  { pertanyaan: "Kalimat tanya: '___ you like coffee?'", pilihan: ["Is", "Am", "Does", "Do"], jawaban: 3, tag: "Simple Present" },
  { pertanyaan: "Kalimat tanya untuk He/She: '___ she like tea?'", pilihan: ["Do", "Am", "Are", "Does"], jawaban: 3, tag: "Simple Present" },
  { pertanyaan: "Kata kunci Simple Present tense adalah...", pilihan: ["Yesterday", "Tomorrow", "Right now", "Every day"], jawaban: 3, tag: "Simple Present" },
  { pertanyaan: "Kalimat yang benar:", pilihan: ["He go to work.", "He goes to work.", "He going to work.", "He gone to work."], jawaban: 1, tag: "Simple Present" },
  { pertanyaan: "Singkatan 'does not' adalah...", pilihan: ["doen't", "doesn't", "do'nt", "dont"], jawaban: 1, tag: "Simple Present" },
  // Kata Ganti
  { pertanyaan: "Kata ganti untuk diri sendiri adalah...", pilihan: ["You", "He", "I", "We"], jawaban: 2, tag: "Pronouns" },
  { pertanyaan: "Kata ganti untuk seorang wanita adalah...", pilihan: ["He", "It", "They", "She"], jawaban: 3, tag: "Pronouns" },
  { pertanyaan: "Pasangan yang benar: I → ___", pilihan: ["Your", "His", "My", "Our"], jawaban: 2, tag: "Pronouns" },
  { pertanyaan: "Pasangan yang benar: She → ___", pilihan: ["His", "Its", "Her", "Our"], jawaban: 2, tag: "Pronouns" },
  { pertanyaan: "Pasangan yang benar: They → ___", pilihan: ["Our", "Their", "Its", "My"], jawaban: 1, tag: "Pronouns" },
  { pertanyaan: "'We' digunakan untuk...", pilihan: ["Satu orang", "Dua orang atau lebih termasuk saya", "Satu benda", "Satu pria"], jawaban: 1, tag: "Pronouns" },
  // Salam & Perkenalan
  { pertanyaan: "Kalimat perkenalan yang benar:", pilihan: ["I from name Daniel.", "My name is Daniel.", "Name my Daniel is.", "Daniel is my name am."], jawaban: 1, tag: "Salam" },
  { pertanyaan: "Jawaban untuk 'How are you?':", pilihan: ["My name is Sari.", "I am from Jakarta.", "I am fine, thank you.", "Nice to meet you."], jawaban: 2, tag: "Salam" },
  { pertanyaan: "Melengkapi: 'I am ___ Indonesia.'", pilihan: ["at", "in", "from", "on"], jawaban: 2, tag: "Salam" },
  { pertanyaan: "Sapaan yang digunakan di pagi hari:", pilihan: ["Good night", "Good afternoon", "Good morning", "Goodbye"], jawaban: 2, tag: "Salam" },
  { pertanyaan: "Cara bertanya nama seseorang:", pilihan: ["How are you?", "Where are you from?", "What is your name?", "How old are you?"], jawaban: 2, tag: "Salam" },
  { pertanyaan: "Terjemahkan: 'Saya berumur 15 tahun.'", pilihan: ["I have 15 years.", "I am 15 years old.", "My age is 15 years.", "I years old 15."], jawaban: 1, tag: "Salam" },
];

// ── MENENGAH: 36 soal — semua 8 topik grammar ──────────────────
const soalGrammarMenengah = [
  // Simple Present
  { pertanyaan: "Kalimat yang benar (Simple Present):", pilihan: ["She go to school.", "She goes to school.", "She going to school.", "She gone to school."], jawaban: 1, tag: "Simple Present" },
  { pertanyaan: "Kalimat tanya: '___ you speak English?'", pilihan: ["Is", "Am", "Are", "Do"], jawaban: 3, tag: "Simple Present" },
  { pertanyaan: "Kalimat negatif yang benar:", pilihan: ["She not like fish.", "She doesn't likes fish.", "She doesn't like fish.", "She isn't like fish."], jawaban: 2, tag: "Simple Present" },
  { pertanyaan: "Untuk He/She/It, kata kerja mendapat tambahan...", pilihan: ["-ing", "-ed", "-s/-es", "-er"], jawaban: 2, tag: "Simple Present" },
  // Simple Past
  { pertanyaan: "Ubah ke Simple Past: 'I ___ to school yesterday.'", pilihan: ["go", "goes", "going", "went"], jawaban: 3, tag: "Simple Past" },
  { pertanyaan: "Bentuk Past dari 'eat' adalah...", pilihan: ["eated", "eaten", "eats", "ate"], jawaban: 3, tag: "Simple Past" },
  { pertanyaan: "Kalimat Simple Past yang benar:", pilihan: ["She plays football yesterday.", "She played football yesterday.", "She play football yesterday.", "She is play football yesterday."], jawaban: 1, tag: "Simple Past" },
  { pertanyaan: "Kalimat negatif Past: 'He ___ not come yesterday.'", pilihan: ["do", "did", "does", "was"], jawaban: 1, tag: "Simple Past" },
  { pertanyaan: "Kata kunci Simple Past adalah...", pilihan: ["Every day", "Tomorrow", "Yesterday / Last week", "Right now"], jawaban: 2, tag: "Simple Past" },
  { pertanyaan: "Bentuk Past dari 'go' adalah...", pilihan: ["goed", "goes", "going", "went"], jawaban: 3, tag: "Simple Past" },
  // Present Continuous
  { pertanyaan: "Kalimat Present Continuous yang benar:", pilihan: ["She is study now.", "She studying now.", "She is studying now.", "She are studying now."], jawaban: 2, tag: "Present Continuous" },
  { pertanyaan: "Present Continuous digunakan untuk...", pilihan: ["Kebiasaan", "Kejadian yang sedang terjadi sekarang", "Kejadian masa lalu", "Rencana jauh"], jawaban: 1, tag: "Present Continuous" },
  { pertanyaan: "Rumus Present Continuous: S + ___ + V-ing", pilihan: ["do/does", "did", "will", "am/is/are"], jawaban: 3, tag: "Present Continuous" },
  // Simple Future
  { pertanyaan: "Kalimat Simple Future yang benar:", pilihan: ["I will go to Bali tomorrow.", "I will goes to Bali tomorrow.", "I going to Bali tomorrow.", "I am go to Bali tomorrow."], jawaban: 0, tag: "Simple Future" },
  { pertanyaan: "Simple Future menggunakan kata bantu...", pilihan: ["do/does", "did", "will/shall", "am/is/are"], jawaban: 2, tag: "Simple Future" },
  { pertanyaan: "Kalimat negatif Future: 'She ___ not come tomorrow.'", pilihan: ["do", "does", "did", "will"], jawaban: 3, tag: "Simple Future" },
  // Articles
  { pertanyaan: "Pilih artikel yang benar: '___ apple a day.'", pilihan: ["A", "An", "The", "No article"], jawaban: 1, tag: "Articles" },
  { pertanyaan: "Pilih artikel yang benar: '___ sun is bright.'", pilihan: ["A", "An", "The", "No article"], jawaban: 2, tag: "Articles" },
  { pertanyaan: "Artikel 'an' digunakan sebelum...", pilihan: ["Kata yang diawali huruf mati", "Kata yang diawali huruf vokal (a,e,i,o,u)", "Semua kata benda", "Kata benda jamak"], jawaban: 1, tag: "Articles" },
  // Prepositions
  { pertanyaan: "'The cat is ___ the box.' (di dalam)", pilihan: ["on", "at", "in", "near"], jawaban: 2, tag: "Prepositions" },
  { pertanyaan: "'She is ___ school.' (di sekolah)", pilihan: ["in", "on", "at", "near"], jawaban: 2, tag: "Prepositions" },
  { pertanyaan: "'The book is ___ the table.' (di atas)", pilihan: ["in", "on", "at", "under"], jawaban: 1, tag: "Prepositions" },
  // Comparative & Superlative
  { pertanyaan: "Bentuk comparative dari 'tall' adalah...", pilihan: ["tallest", "taller", "more tall", "most tall"], jawaban: 1, tag: "Comparative" },
  { pertanyaan: "Bentuk superlative dari 'big' adalah...", pilihan: ["bigger", "more big", "biggest", "most big"], jawaban: 2, tag: "Comparative" },
  { pertanyaan: "Kalimat comparative yang benar:", pilihan: ["She is more tall than me.", "She is tall than me.", "She is taller than me.", "She is tallest than me."], jawaban: 2, tag: "Comparative" },
  // Modals
  { pertanyaan: "Modal 'can' digunakan untuk...", pilihan: ["Menyatakan keharusan", "Menyatakan kemampuan", "Menyatakan larangan", "Menyatakan rencana"], jawaban: 1, tag: "Modals" },
  { pertanyaan: "Kalimat yang benar:", pilihan: ["She can sings.", "She can sing.", "She cans sing.", "She can to sing."], jawaban: 1, tag: "Modals" },
  { pertanyaan: "Modal 'should' artinya...", pilihan: ["Bisa", "Harus (kewajiban keras)", "Sebaiknya/Seharusnya", "Tidak boleh"], jawaban: 2, tag: "Modals" },
  // Kalimat Tanya
  { pertanyaan: "Kalimat tanya yang benar:", pilihan: ["You where live?", "Where you live?", "Where do you live?", "Do you where live?"], jawaban: 2, tag: "Question" },
  { pertanyaan: "Kata tanya untuk menanyakan ALASAN adalah...", pilihan: ["What", "Where", "When", "Why"], jawaban: 3, tag: "Question" },
  { pertanyaan: "Kalimat tanya untuk 'She works at a hospital.':", pilihan: ["Does she works at a hospital?", "Do she work at a hospital?", "Where does she work?", "Is she works at a hospital?"], jawaban: 2, tag: "Question" },
  { pertanyaan: "Melengkapi: 'How ___ students are in your class?'", pilihan: ["much", "more", "many", "most"], jawaban: 2, tag: "Question" },
  { pertanyaan: "Terjemahkan: 'Mengapa kamu belajar bahasa Inggris?'", pilihan: ["What do you study English?", "Why you study English?", "Why do you study English?", "Where do you study English?"], jawaban: 2, tag: "Question" },
  { pertanyaan: "Kalimat yang benar untuk menanyakan waktu:", pilihan: ["When she comes?", "When does she come?", "When she is come?", "When she coming?"], jawaban: 1, tag: "Question" },
];

function GrammarQuizContent() {
  const params = useSearchParams();
  const pakaiTimer = params.get("timer") === "1";
  const { config } = useLevel();

  const soalList = config?.vocabLevel === "a1"
    ? soalGrammarPemula
    : soalGrammarMenengah;

  const judulLevel = config?.vocabLevel === "a1"
    ? "Grammar Quiz 🌱"
    : "Grammar Quiz 🚀";

  return (
    <QuizEngine
      judul={judulLevel}
      emoji="✏️"
      soalList={soalList}
      maxSoal={12}
      warnaBg="bg-gradient-to-br from-green-50 to-emerald-100"
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
