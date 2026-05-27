// Quiz Vocabulary — 20 soal kosakata dari berbagai kategori
"use client";
import { useSearchParams } from "next/navigation";
import QuizEngine from "@/components/QuizEngine";

const soalVocabulary = [
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

export default function VocabularyQuizPage() {
  const params = useSearchParams();
  const pakaiTimer = params.get("timer") === "1";
  return (
    <QuizEngine
      judul="Vocabulary Quiz"
      emoji="📚"
      soalList={soalVocabulary}
      warnaBg="bg-gradient-to-br from-blue-50 to-indigo-100"
      warnaBtn="bg-blue-600"
      kategori="vocabulary"
      pakaiTimer={pakaiTimer}
    />
  );
}
