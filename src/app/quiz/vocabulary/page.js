// Quiz Vocabulary — soal dibedakan per level (Pemula vs Menengah)
"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QuizEngine from "@/components/QuizEngine";
import { useLevel } from "@/hooks/useLevel";

// ── PEMULA: 25 soal — kata-kata paling dasar + warna + keluarga ───────────
const soalVocabularyPemula = [
  // Buah & Sayur
  { pertanyaan: "Apa arti kata 'Apple'?", pilihan: ["Pisang", "Mangga", "Apel", "Jeruk"], jawaban: 2, tag: "Buah & Sayur" },
  { pertanyaan: "Apa bahasa Inggrisnya 'Pisang'?", pilihan: ["Apple", "Orange", "Banana", "Mango"], jawaban: 2, tag: "Buah & Sayur" },
  // Hewan
  { pertanyaan: "Apa bahasa Inggrisnya 'Kucing'?", pilihan: ["Dog", "Bird", "Fish", "Cat"], jawaban: 3, tag: "Hewan" },
  { pertanyaan: "Apa arti kata 'Dog'?", pilihan: ["Kucing", "Burung", "Ikan", "Anjing"], jawaban: 3, tag: "Hewan" },
  // Perasaan
  { pertanyaan: "Kata 'Happy' artinya...", pilihan: ["Sedih", "Marah", "Takut", "Bahagia"], jawaban: 3, tag: "Perasaan" },
  { pertanyaan: "Kata 'Sad' artinya...", pilihan: ["Senang", "Marah", "Sedih", "Berani"], jawaban: 2, tag: "Perasaan" },
  { pertanyaan: "Apa bahasa Inggrisnya 'Marah'?", pilihan: ["Happy", "Scared", "Angry", "Sad"], jawaban: 2, tag: "Perasaan" },
  // Tempat
  { pertanyaan: "Apa arti kata 'School'?", pilihan: ["Rumah Sakit", "Pasar", "Sekolah", "Pantai"], jawaban: 2, tag: "Tempat" },
  { pertanyaan: "Apa bahasa Inggrisnya 'Rumah Sakit'?", pilihan: ["School", "Market", "Beach", "Hospital"], jawaban: 3, tag: "Tempat" },
  // Kata Kerja
  { pertanyaan: "Apa bahasa Inggrisnya 'Makan'?", pilihan: ["Sleep", "Drink", "Run", "Eat"], jawaban: 3, tag: "Kata Kerja" },
  { pertanyaan: "Apa bahasa Inggrisnya 'Berlari'?", pilihan: ["Jump", "Swim", "Run", "Read"], jawaban: 2, tag: "Kata Kerja" },
  { pertanyaan: "Kata 'Read' artinya...", pilihan: ["Menulis", "Menari", "Bernyanyi", "Membaca"], jawaban: 3, tag: "Kata Kerja" },
  // Alam & Cuaca
  { pertanyaan: "Apa arti kata 'Sun'?", pilihan: ["Bulan", "Bintang", "Matahari", "Awan"], jawaban: 2, tag: "Alam & Cuaca" },
  { pertanyaan: "Apa bahasa Inggrisnya 'Hujan'?", pilihan: ["Cloud", "Sun", "Wind", "Rain"], jawaban: 3, tag: "Alam & Cuaca" },
  // Kata Sifat
  { pertanyaan: "Kata 'Strong' artinya...", pilihan: ["Pintar", "Jujur", "Berani", "Kuat"], jawaban: 3, tag: "Kata Sifat" },
  { pertanyaan: "Kata 'Smart' artinya...", pilihan: ["Kuat", "Jujur", "Pintar", "Berani"], jawaban: 2, tag: "Kata Sifat" },
  // Rumah & Benda
  { pertanyaan: "Apa arti kata 'Table'?", pilihan: ["Kursi", "Lampu", "Tempat Tidur", "Meja"], jawaban: 3, tag: "Rumah & Benda" },
  { pertanyaan: "Apa bahasa Inggrisnya 'Pensil'?", pilihan: ["Pen", "Pencil", "Book", "Lamp"], jawaban: 1, tag: "Rumah & Benda" },
  // Warna (kategori baru!)
  { pertanyaan: "Apa arti kata 'Red'?", pilihan: ["Biru", "Hijau", "Kuning", "Merah"], jawaban: 3, tag: "Warna" },
  { pertanyaan: "Apa bahasa Inggrisnya 'Biru'?", pilihan: ["Green", "Red", "Blue", "Yellow"], jawaban: 2, tag: "Warna" },
  { pertanyaan: "Langit itu berwarna... (Sky is...)?", pilihan: ["Red", "Green", "Black", "Blue"], jawaban: 3, tag: "Warna" },
  { pertanyaan: "Pisang itu berwarna... (Banana is...)?", pilihan: ["Red", "Yellow", "Blue", "Green"], jawaban: 1, tag: "Warna" },
  // Keluarga (kategori baru!)
  { pertanyaan: "Apa arti kata 'Mother'?", pilihan: ["Ayah", "Kakak", "Adik", "Ibu"], jawaban: 3, tag: "Keluarga" },
  { pertanyaan: "Apa bahasa Inggrisnya 'Ayah'?", pilihan: ["Mother", "Brother", "Father", "Sister"], jawaban: 2, tag: "Keluarga" },
  { pertanyaan: "Kata 'Friend' artinya...", pilihan: ["Guru", "Musuh", "Teman", "Dokter"], jawaban: 2, tag: "Keluarga" },
];

// ── MENENGAH: 20 soal — kata-kata lebih sulit ──────────────────────────────
const soalVocabularyMenengah = [
  { pertanyaan: "Apa arti kata 'Elephant'?", pilihan: ["Kelinci", "Harimau", "Gajah", "Ular"], jawaban: 2, tag: "Hewan" },
  { pertanyaan: "Kata 'Generous' artinya...", pilihan: ["Pemalas", "Dermawan", "Penakut", "Sombong"], jawaban: 1, tag: "Kata Sifat" },
  { pertanyaan: "Apa bahasa Inggrisnya 'Perpustakaan'?", pilihan: ["Laboratory", "Library", "Lavatory", "Laundry"], jawaban: 1, tag: "Tempat" },
  { pertanyaan: "Kata 'Nervous' artinya...", pilihan: ["Marah", "Bahagia", "Gugup", "Bosan"], jawaban: 2, tag: "Perasaan" },
  { pertanyaan: "Apa arti kata 'Watermelon'?", pilihan: ["Semangka", "Melon", "Pisang", "Mangga"], jawaban: 0, tag: "Buah & Sayur" },
  { pertanyaan: "Apa bahasa Inggrisnya 'Berenang'?", pilihan: ["Run", "Jump", "Dance", "Swim"], jawaban: 3, tag: "Kata Kerja" },
  { pertanyaan: "Kata 'Brave' artinya...", pilihan: ["Pintar", "Kuat", "Berani", "Jujur"], jawaban: 2, tag: "Kata Sifat" },
  { pertanyaan: "Apa arti kata 'Refrigerator'?", pilihan: ["Kompor", "Kulkas", "Mesin Cuci", "Kipas Angin"], jawaban: 1, tag: "Rumah & Benda" },
  { pertanyaan: "Apa bahasa Inggrisnya 'Gempa Bumi'?", pilihan: ["Volcano", "Tornado", "Earthquake", "Tsunami"], jawaban: 2, tag: "Alam & Cuaca" },
  { pertanyaan: "Kata 'Excited' artinya...", pilihan: ["Lelah", "Bersemangat", "Kecewa", "Bingung"], jawaban: 1, tag: "Perasaan" },
  { pertanyaan: "Apa arti kata 'Butterfly'?", pilihan: ["Lebah", "Lalat", "Kupu-kupu", "Semut"], jawaban: 2, tag: "Hewan" },
  { pertanyaan: "Apa bahasa Inggrisnya 'Memasak'?", pilihan: ["Clean", "Cook", "Cut", "Carry"], jawaban: 1, tag: "Kata Kerja" },
  { pertanyaan: "Kata 'Honest' artinya...", pilihan: ["Rajin", "Sopan", "Jujur", "Sabar"], jawaban: 2, tag: "Kata Sifat" },
  { pertanyaan: "Apa arti kata 'Airport'?", pilihan: ["Pelabuhan", "Stasiun", "Terminal Bus", "Bandara"], jawaban: 3, tag: "Tempat" },
  { pertanyaan: "Apa bahasa Inggrisnya 'Bernyanyi'?", pilihan: ["Dance", "Sing", "Play", "Act"], jawaban: 1, tag: "Kata Kerja" },
  { pertanyaan: "Kata 'Proud' artinya...", pilihan: ["Marah", "Sedih", "Bangga", "Malu"], jawaban: 2, tag: "Perasaan" },
  { pertanyaan: "Apa arti kata 'Rainbow'?", pilihan: ["Badai", "Pelangi", "Petir", "Kabut"], jawaban: 1, tag: "Alam & Cuaca" },
  { pertanyaan: "Apa bahasa Inggrisnya 'Cermin'?", pilihan: ["Window", "Mirror", "Door", "Wall"], jawaban: 1, tag: "Rumah & Benda" },
  { pertanyaan: "Kata 'Careful' artinya...", pilihan: ["Ceroboh", "Hati-hati", "Berani", "Cepat"], jawaban: 1, tag: "Kata Sifat" },
  { pertanyaan: "Apa arti kata 'Forest'?", pilihan: ["Ladang", "Padang Rumput", "Hutan", "Rawa"], jawaban: 2, tag: "Alam & Cuaca" },
];

function VocabularyQuizContent() {
  const params = useSearchParams();
  const pakaiTimer = params.get("timer") === "1";
  const { config } = useLevel();

  // Pilih soal sesuai level — default ke Menengah jika belum pilih level
  const soalList = config?.vocabLevel === "pemula"
    ? soalVocabularyPemula
    : soalVocabularyMenengah;

  const judulLevel = config?.vocabLevel === "pemula"
    ? "Vocabulary Quiz 🌱"
    : "Vocabulary Quiz 🚀";

  return (
    <QuizEngine
      judul={judulLevel}
      emoji="📚"
      soalList={soalList}
      warnaBg="bg-gradient-to-br from-blue-50 to-indigo-100"
      warnaBtn="bg-blue-600"
      kategori="vocabulary"
      pakaiTimer={pakaiTimer}
    />
  );
}

export default function VocabularyQuizPage() {
  return (
    <Suspense fallback={null}>
      <VocabularyQuizContent />
    </Suspense>
  );
}
