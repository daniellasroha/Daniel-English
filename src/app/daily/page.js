// Halaman Daily Challenge — 3 soal setiap hari, streak dari useProgress
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useProgress, hitungStreak } from "@/hooks/useProgress";
import { useSound } from "@/hooks/useSound";

// ─── POOL SOAL (150+ soal) ────────────────────────────────────────────────────
const soalPool = [
  // === VOCABULARY: Hewan ===
  { pertanyaan: "Apa arti 'Elephant'?", pilihan: ["Kelinci", "Harimau", "Gajah", "Ular"], jawaban: 2 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Kupu-kupu'?", pilihan: ["Bee", "Butterfly", "Dragonfly", "Ant"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Rooster'?", pilihan: ["Bebek", "Ayam Betina", "Ayam Jantan", "Burung"], jawaban: 2 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Kuda'?", pilihan: ["Cow", "Horse", "Sheep", "Goat"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Dolphin'?", pilihan: ["Hiu", "Paus", "Lumba-lumba", "Gurita"], jawaban: 2 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Singa'?", pilihan: ["Tiger", "Bear", "Lion", "Wolf"], jawaban: 2 },
  { pertanyaan: "Apa arti 'Giraffe'?", pilihan: ["Zebra", "Jerapah", "Kuda Nil", "Badak"], jawaban: 1 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Lebah'?", pilihan: ["Ant", "Fly", "Bee", "Worm"], jawaban: 2 },
  { pertanyaan: "Apa arti 'Penguin'?", pilihan: ["Pinguin", "Elang", "Merpati", "Flamingo"], jawaban: 0 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Kucing'?", pilihan: ["Dog", "Cat", "Bird", "Fish"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Rabbit'?", pilihan: ["Tikus", "Kelinci", "Hamster", "Tupai"], jawaban: 1 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Ular'?", pilihan: ["Lizard", "Crocodile", "Snake", "Frog"], jawaban: 2 },
  // === VOCABULARY: Buah & Makanan ===
  { pertanyaan: "Apa bahasa Inggrisnya 'Apel'?", pilihan: ["Orange", "Mango", "Apple", "Grape"], jawaban: 2 },
  { pertanyaan: "Apa arti 'Watermelon'?", pilihan: ["Melon", "Semangka", "Pisang", "Mangga"], jawaban: 1 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Nanas'?", pilihan: ["Peach", "Plum", "Pineapple", "Papaya"], jawaban: 2 },
  { pertanyaan: "Apa arti 'Strawberry'?", pilihan: ["Blueberry", "Stroberi", "Anggur", "Ceri"], jawaban: 1 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Mangga'?", pilihan: ["Melon", "Lemon", "Mango", "Guava"], jawaban: 2 },
  { pertanyaan: "Apa arti 'Coconut'?", pilihan: ["Kelapa", "Alpukat", "Durian", "Rambutan"], jawaban: 0 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Tomat'?", pilihan: ["Potato", "Tomato", "Carrot", "Onion"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Spinach'?", pilihan: ["Brokoli", "Bayam", "Kangkung", "Selada"], jawaban: 1 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Telur'?", pilihan: ["Milk", "Egg", "Meat", "Fish"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Bread'?", pilihan: ["Kue", "Nasi", "Roti", "Mie"], jawaban: 2 },
  // === VOCABULARY: Kata Sifat ===
  { pertanyaan: "Kata 'Beautiful' artinya...", pilihan: ["Jelek", "Cantik/Indah", "Marah", "Sedih"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Nervous'?", pilihan: ["Marah", "Bahagia", "Gugup", "Bosan"], jawaban: 2 },
  { pertanyaan: "Kata 'Generous' artinya...", pilihan: ["Pemalas", "Dermawan", "Penakut", "Sombong"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Delicious'?", pilihan: ["Hambar", "Pahit", "Lezat", "Asam"], jawaban: 2 },
  { pertanyaan: "Apa arti 'Proud'?", pilihan: ["Malu", "Bangga", "Sedih", "Takut"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Courage'?", pilihan: ["Kesabaran", "Keberanian", "Kebijakan", "Kejujuran"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Exhausted'?", pilihan: ["Senang", "Kelelahan", "Lapar", "Ngantuk"], jawaban: 1 },
  { pertanyaan: "Kata 'Honest' artinya...", pilihan: ["Pintar", "Jujur", "Rajin", "Pemberani"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Furious'?", pilihan: ["Sedih", "Takut", "Sangat Marah", "Bingung"], jawaban: 2 },
  { pertanyaan: "Kata 'Shy' artinya...", pilihan: ["Pemalu", "Pemarah", "Pemalas", "Pelit"], jawaban: 0 },
  { pertanyaan: "Apa arti 'Clever'?", pilihan: ["Kuat", "Cepat", "Pintar", "Baik"], jawaban: 2 },
  { pertanyaan: "Kata 'Brave' artinya...", pilihan: ["Penakut", "Pemberani", "Pemalu", "Pemalas"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Lonely'?", pilihan: ["Ramai", "Kesepian", "Gembira", "Bosan"], jawaban: 1 },
  // === VOCABULARY: Kata Kerja ===
  { pertanyaan: "Apa bahasa Inggrisnya 'Berlari'?", pilihan: ["Jump", "Run", "Walk", "Swim"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Laugh'?", pilihan: ["Menangis", "Tidur", "Tertawa", "Berlari"], jawaban: 2 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Memasak'?", pilihan: ["Clean", "Cook", "Wash", "Eat"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Listen'?", pilihan: ["Melihat", "Mendengarkan", "Berbicara", "Membaca"], jawaban: 1 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Menulis'?", pilihan: ["Read", "Draw", "Write", "Print"], jawaban: 2 },
  { pertanyaan: "Apa arti 'Carry'?", pilihan: ["Menjatuhkan", "Membawa", "Menaruh", "Mengangkat"], jawaban: 1 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Belajar'?", pilihan: ["Teach", "Study", "Know", "Think"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Choose'?", pilihan: ["Membeli", "Memilih", "Mencari", "Menemukan"], jawaban: 1 },
  // === VOCABULARY: Tempat & Benda ===
  { pertanyaan: "Apa arti 'Library'?", pilihan: ["Laboratorium", "Perpustakaan", "Kantor", "Toko"], jawaban: 1 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Rumah Sakit'?", pilihan: ["Hotel", "Hospital", "School", "Market"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Mountain'?", pilihan: ["Pantai", "Sungai", "Gunung", "Danau"], jawaban: 2 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Jembatan'?", pilihan: ["Road", "Bridge", "Tunnel", "Gate"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Pharmacy'?", pilihan: ["Toko Buku", "Apotek", "Warung", "Klinik"], jawaban: 1 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Stasiun'?", pilihan: ["Airport", "Harbor", "Station", "Terminal"], jawaban: 2 },
  { pertanyaan: "Apa arti 'Umbrella'?", pilihan: ["Tas", "Payung", "Topi", "Sarung Tangan"], jawaban: 1 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Kunci'?", pilihan: ["Lock", "Key", "Door", "Handle"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Pillow'?", pilihan: ["Selimut", "Kasur", "Bantal", "Sprei"], jawaban: 2 },
  // === GRAMMAR: To Be ===
  { pertanyaan: "To Be untuk 'They': They ___ students.", pilihan: ["is", "am", "are", "be"], jawaban: 2 },
  { pertanyaan: "Pilih To Be yang benar: 'I ___ a student.'", pilihan: ["is", "am", "are", "be"], jawaban: 1 },
  { pertanyaan: "Pilih To Be yang benar: 'She ___ happy.'", pilihan: ["am", "is", "are", "be"], jawaban: 1 },
  { pertanyaan: "Kalimat negatif: 'He ___ not a teacher.'", pilihan: ["am", "is", "are", "be"], jawaban: 1 },
  { pertanyaan: "Bentuk lampau To Be untuk 'I': I ___ tired yesterday.", pilihan: ["am", "is", "was", "were"], jawaban: 2 },
  { pertanyaan: "Bentuk lampau To Be untuk 'They': They ___ happy.", pilihan: ["was", "were", "are", "been"], jawaban: 1 },
  // === GRAMMAR: Simple Present ===
  { pertanyaan: "Simple Present 'She': She ___ (go) to school.", pilihan: ["go", "goes", "went", "going"], jawaban: 1 },
  { pertanyaan: "Kalimat negatif: He ___ like coffee.", pilihan: ["not", "don't", "doesn't", "isn't"], jawaban: 2 },
  { pertanyaan: "Kalimat tanya: ___ she speak English?", pilihan: ["Do", "Does", "Is", "Has"], jawaban: 1 },
  { pertanyaan: "Simple Present 'They': They ___ (play) football.", pilihan: ["plays", "play", "played", "playing"], jawaban: 1 },
  { pertanyaan: "Simple Present 'He': He ___ (watch) TV every night.", pilihan: ["watch", "watchs", "watches", "watching"], jawaban: 2 },
  { pertanyaan: "Kalimat negatif: I ___ like hot weather.", pilihan: ["doesn't", "isn't", "don't", "not"], jawaban: 2 },
  // === GRAMMAR: Simple Past ===
  { pertanyaan: "Past tense dari 'go' adalah...", pilihan: ["goed", "goes", "went", "gone"], jawaban: 2 },
  { pertanyaan: "Past tense dari 'eat' adalah...", pilihan: ["eated", "aten", "ate", "eats"], jawaban: 2 },
  { pertanyaan: "Past tense dari 'see' adalah...", pilihan: ["seed", "saw", "seen", "sees"], jawaban: 1 },
  { pertanyaan: "Kalimat negatif past: She ___ come yesterday.", pilihan: ["doesn't", "didn't", "wasn't", "hadn't"], jawaban: 1 },
  { pertanyaan: "Kalimat tanya past: ___ you finish the homework?", pilihan: ["Do", "Does", "Did", "Have"], jawaban: 2 },
  { pertanyaan: "Past tense dari 'buy' adalah...", pilihan: ["buyed", "boughten", "bought", "buys"], jawaban: 2 },
  { pertanyaan: "Past tense dari 'make' adalah...", pilihan: ["maked", "maked", "makes", "made"], jawaban: 3 },
  // === GRAMMAR: Present Continuous ===
  { pertanyaan: "Present Continuous: She ___ eating now.", pilihan: ["is", "are", "was", "be"], jawaban: 0 },
  { pertanyaan: "Present Continuous: They ___ (play) outside.", pilihan: ["is playing", "are playing", "was playing", "plays"], jawaban: 1 },
  { pertanyaan: "Bentuk -ing dari 'run': He is ___.", pilihan: ["runing", "running", "runned", "runs"], jawaban: 1 },
  { pertanyaan: "Kalimat tanya: ___ you studying now?", pilihan: ["Do", "Are", "Is", "Have"], jawaban: 1 },
  // === GRAMMAR: Articles ===
  { pertanyaan: "Artikel untuk kata benda dimulai huruf vokal: ___ apple.", pilihan: ["a", "an", "the", "—"], jawaban: 1 },
  { pertanyaan: "Artikel spesifik: Close ___ door, please.", pilihan: ["a", "an", "the", "—"], jawaban: 2 },
  { pertanyaan: "Pilih artikel yang benar: '___ hour'", pilihan: ["a", "an", "the", "—"], jawaban: 1 },
  { pertanyaan: "Pilih artikel yang benar: '___ university'", pilihan: ["a", "an", "the", "—"], jawaban: 0 },
  { pertanyaan: "Nama negara: She lives in ___ Indonesia.", pilihan: ["a", "an", "the", "—"], jawaban: 3 },
  { pertanyaan: "Superlative: She is ___ best student.", pilihan: ["a", "an", "the", "—"], jawaban: 2 },
  // === GRAMMAR: Modal Verbs ===
  { pertanyaan: "Modal verb untuk kemampuan: I ___ speak English.", pilihan: ["will", "can", "must", "should"], jawaban: 1 },
  { pertanyaan: "Modal untuk kewajiban kuat: You ___ wear a helmet.", pilihan: ["can", "might", "must", "would"], jawaban: 2 },
  { pertanyaan: "Modal untuk saran: You ___ rest more.", pilihan: ["must", "can", "should", "will"], jawaban: 2 },
  { pertanyaan: "Modal untuk kemungkinan: It ___ rain today.", pilihan: ["must", "might", "should", "can"], jawaban: 1 },
  { pertanyaan: "Modal untuk izin sopan: ___ I borrow your pen?", pilihan: ["Must", "Should", "May", "Will"], jawaban: 2 },
  // === GRAMMAR: Comparative & Superlative ===
  { pertanyaan: "Comparative: She is ___ than her sister. (tall)", pilihan: ["more tall", "tallest", "taller", "tall"], jawaban: 2 },
  { pertanyaan: "Superlative: He is the ___ student. (smart)", pilihan: ["smarter", "more smart", "smartest", "smart"], jawaban: 2 },
  { pertanyaan: "Comparative 'good': This book is ___ than that one.", pilihan: ["gooder", "more good", "better", "best"], jawaban: 2 },
  { pertanyaan: "Superlative 'bad': It was the ___ day of my life.", pilihan: ["baddest", "most bad", "worse", "worst"], jawaban: 3 },
  { pertanyaan: "Comparative 'big': This room is ___ than mine.", pilihan: ["more big", "bigger", "biggest", "bigest"], jawaban: 1 },
  // === GRAMMAR: Future ===
  { pertanyaan: "Future tense: I ___ visit you tomorrow.", pilihan: ["am", "was", "will", "have"], jawaban: 2 },
  { pertanyaan: "Future dengan 'going to': She ___ going to study tonight.", pilihan: ["will", "is", "are", "was"], jawaban: 1 },
  { pertanyaan: "Future negatif: We ___ attend the party.", pilihan: ["don't will", "won't", "will not to", "aren't will"], jawaban: 1 },
  // === GRAMMAR: Pronouns ===
  { pertanyaan: "Kata ganti objek untuk 'she' adalah...", pilihan: ["her", "she", "hers", "herself"], jawaban: 0 },
  { pertanyaan: "Kata ganti objek untuk 'they' adalah...", pilihan: ["their", "them", "they", "themselves"], jawaban: 1 },
  { pertanyaan: "Possessive untuk 'he': ___ bag is red.", pilihan: ["He", "Him", "His", "Himself"], jawaban: 2 },
  { pertanyaan: "Possessive untuk 'I': This is ___ book.", pilihan: ["I", "Me", "My", "Mine"], jawaban: 2 },
  { pertanyaan: "Kata ganti objek untuk 'I' adalah...", pilihan: ["my", "me", "mine", "myself"], jawaban: 1 },
  // === GRAMMAR: Prepositions ===
  { pertanyaan: "Preposisi waktu: I was born ___ 2005.", pilihan: ["in", "on", "at", "by"], jawaban: 0 },
  { pertanyaan: "Preposisi waktu: The meeting is ___ Monday.", pilihan: ["in", "on", "at", "by"], jawaban: 1 },
  { pertanyaan: "Preposisi waktu: We eat dinner ___ 7 o'clock.", pilihan: ["in", "on", "at", "by"], jawaban: 2 },
  { pertanyaan: "Preposisi tempat: The cat is ___ the table. (di atas)", pilihan: ["under", "behind", "on", "in"], jawaban: 2 },
  { pertanyaan: "Preposisi tempat: The dog is ___ the bed. (di bawah)", pilihan: ["on", "under", "above", "over"], jawaban: 1 },
  // === GRAMMAR: Conjunctions ===
  { pertanyaan: "Pilih conjunction yang benar: I like tea ___ coffee.", pilihan: ["but", "or", "because", "although"], jawaban: 1 },
  { pertanyaan: "I was tired, ___ I kept working.", pilihan: ["so", "but", "because", "and"], jawaban: 1 },
  { pertanyaan: "She cried ___ she was sad.", pilihan: ["but", "although", "because", "however"], jawaban: 2 },
  { pertanyaan: "He studied hard, ___ he passed the exam.", pilihan: ["but", "although", "so", "because"], jawaban: 2 },
  // === GRAMMAR: Present Perfect ===
  { pertanyaan: "Present Perfect: She ___ never been to Japan.", pilihan: ["is", "has", "have", "had"], jawaban: 1 },
  { pertanyaan: "Present Perfect: I ___ already finished my homework.", pilihan: ["is", "has", "have", "had"], jawaban: 2 },
  { pertanyaan: "Present Perfect: Have you ___ eaten sushi?", pilihan: ["never", "ever", "already", "yet"], jawaban: 1 },
  { pertanyaan: "Present Perfect: He hasn't arrived ___.", pilihan: ["already", "ever", "yet", "never"], jawaban: 2 },
  { pertanyaan: "Past Participle dari 'write' adalah...", pilihan: ["wrote", "writed", "written", "writing"], jawaban: 2 },
  { pertanyaan: "Past Participle dari 'speak' adalah...", pilihan: ["spoke", "speaked", "speaking", "spoken"], jawaban: 3 },
  // === GRAMMAR: Question Words ===
  { pertanyaan: "Kata tanya untuk menanyakan tempat: ___?", pilihan: ["What", "Who", "Where", "When"], jawaban: 2 },
  { pertanyaan: "Kata tanya untuk menanyakan waktu: ___?", pilihan: ["Why", "How", "Where", "When"], jawaban: 3 },
  { pertanyaan: "Kata tanya untuk menanyakan alasan: ___?", pilihan: ["What", "Why", "Who", "Which"], jawaban: 1 },
  { pertanyaan: "Kata tanya untuk menanyakan cara: ___?", pilihan: ["Why", "When", "How", "What"], jawaban: 2 },
  { pertanyaan: "Kata tanya untuk jumlah yang bisa dihitung: How ___?", pilihan: ["much", "many", "long", "far"], jawaban: 1 },
  { pertanyaan: "Kata tanya untuk jumlah yang tidak bisa dihitung: How ___?", pilihan: ["many", "much", "often", "long"], jawaban: 1 },
  // === VOCABULARY: Angka & Waktu ===
  { pertanyaan: "Apa bahasa Inggrisnya 'Seratus'?", pilihan: ["Thousand", "Hundred", "Million", "Billion"], jawaban: 1 },
  { pertanyaan: "Apa arti 'Midnight'?", pilihan: ["Tengah hari", "Fajar", "Tengah malam", "Sore"], jawaban: 2 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Kemarin'?", pilihan: ["Today", "Tomorrow", "Yesterday", "Lately"], jawaban: 2 },
  { pertanyaan: "Apa arti 'Fortnight'?", pilihan: ["Satu minggu", "Dua minggu", "Satu bulan", "Dua hari"], jawaban: 1 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Sekarang'?", pilihan: ["Then", "Soon", "Later", "Now"], jawaban: 3 },
  // === VOCABULARY: Pakaian & Profesi ===
  { pertanyaan: "Apa arti 'Jacket'?", pilihan: ["Celana", "Kemeja", "Jaket", "Kaos"], jawaban: 2 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Sepatu'?", pilihan: ["Sandal", "Boots", "Shoes", "Socks"], jawaban: 2 },
  { pertanyaan: "Apa arti 'Gloves'?", pilihan: ["Topi", "Syal", "Kacamata", "Sarung Tangan"], jawaban: 3 },
  { pertanyaan: "Apa arti 'Accountant'?", pilihan: ["Arsitek", "Akuntan", "Dokter", "Pengacara"], jawaban: 1 },
  { pertanyaan: "Apa bahasa Inggrisnya 'Dokter Gigi'?", pilihan: ["Doctor", "Surgeon", "Dentist", "Nurse"], jawaban: 2 },
  { pertanyaan: "Apa arti 'Carpenter'?", pilihan: ["Tukang Listrik", "Tukang Las", "Tukang Kayu", "Tukang Batu"], jawaban: 2 },
  // === FILL IN THE BLANK ===
  { pertanyaan: "Lengkapi: 'My name ___ Daniel.'", pilihan: ["am", "is", "are", "be"], jawaban: 1 },
  { pertanyaan: "Lengkapi: 'She ___ from Jakarta.'", pilihan: ["am", "is", "are", "come"], jawaban: 1 },
  { pertanyaan: "Lengkapi: 'They ___ playing football now.'", pilihan: ["is", "are", "was", "be"], jawaban: 1 },
  { pertanyaan: "Lengkapi: 'I ___ my homework last night.'", pilihan: ["do", "does", "did", "done"], jawaban: 2 },
  { pertanyaan: "Lengkapi: 'We ___ go to school tomorrow.'", pilihan: ["are", "will", "do", "have"], jawaban: 1 },
  { pertanyaan: "Lengkapi: '___ you like ice cream?'", pilihan: ["Is", "Are", "Do", "Does"], jawaban: 2 },
  { pertanyaan: "Lengkapi: 'She has ___ visited Paris.' (belum)", pilihan: ["already", "ever", "never", "yet"], jawaban: 2 },
  { pertanyaan: "Lengkapi: 'I woke up ___ 6 in the morning.'", pilihan: ["in", "on", "at", "by"], jawaban: 2 },
  // === TERJEMAHAN ===
  { pertanyaan: "Terjemahkan: 'Saya suka belajar bahasa Inggris.'", pilihan: ["I liked study English.", "I like to study English.", "I am like English.", "I study like English."], jawaban: 1 },
  { pertanyaan: "Terjemahkan: 'Dia tidak pergi ke sekolah kemarin.'", pilihan: ["She doesn't go to school yesterday.", "She didn't went to school yesterday.", "She didn't go to school yesterday.", "She not go to school yesterday."], jawaban: 2 },
  { pertanyaan: "Terjemahkan: 'Berapa harga buku ini?'", pilihan: ["How many is this book?", "How much is this book?", "What price is this book?", "How much this book is?"], jawaban: 1 },
  { pertanyaan: "Terjemahkan: 'Apakah kamu sudah makan siang?'", pilihan: ["Did you eat lunch?", "Do you eat lunch?", "Have you eaten lunch?", "Are you eating lunch?"], jawaban: 2 },
  { pertanyaan: "Terjemahkan: 'Tolong tutup pintunya.'", pilihan: ["Please close the door.", "Please closing the door.", "Please closed the door.", "You close the door please."], jawaban: 0 },
  { pertanyaan: "Terjemahkan: 'Saya belum pernah mencoba sushi.'", pilihan: ["I never try sushi.", "I have never tried sushi.", "I didn't try sushi ever.", "I never tried sushi before."], jawaban: 1 },
];

const KEY_DAILY = "daniel_english_daily";
const SOAL_PER_HARI = 3;

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function getSoalHariIni() {
  const today = todayStr();
  let hash = 0;
  for (let i = 0; i < today.length; i++) hash = (hash * 31 + today.charCodeAt(i)) % soalPool.length;
  const result = [];
  const used = new Set();
  for (let i = 0; i < SOAL_PER_HARI; i++) {
    let idx = (hash + i * 37) % soalPool.length;
    while (used.has(idx)) idx = (idx + 1) % soalPool.length;
    used.add(idx);
    result.push({ ...soalPool[idx], _idx: idx });
  }
  return result;
}

export default function DailyChallengePage() {
  const [soalHariIni] = useState(() => getSoalHariIni());
  const [jawabanUser, setJawabanUser] = useState([]);
  const [soalAktif, setSoalAktif] = useState(0);
  const [sudahSelesai, setSudahSelesai] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const { data, recordSession } = useProgress();
  const { bunyiBenar, bunyiSalah, bunyiSelesai } = useSound();
  const streak = data ? hitungStreak(data.sessions) : 0;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY_DAILY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.date === todayStr()) {
          setJawabanUser(parsed.jawaban || []);
          setSoalAktif(soalHariIni.length);
          setSudahSelesai(true);
        }
      }
    } catch {}
    setLoaded(true);
  }, []);

  function jawab(idx) {
    if (jawabanUser[soalAktif] !== undefined) return;
    const newJawaban = [...jawabanUser];
    newJawaban[soalAktif] = idx;
    setJawabanUser(newJawaban);

    if (idx === soalHariIni[soalAktif]?.jawaban) bunyiBenar();
    else bunyiSalah();

    if (soalAktif === soalHariIni.length - 1) {
      setTimeout(() => {
        setSudahSelesai(true);
        setSoalAktif(soalHariIni.length);
        localStorage.setItem(KEY_DAILY, JSON.stringify({ date: todayStr(), jawaban: newJawaban }));
        recordSession();
        bunyiSelesai();
      }, 800);
    } else {
      setTimeout(() => setSoalAktif(n => n + 1), 800);
    }
  }

  function lanjut() {
    if (soalAktif < soalHariIni.length - 1) setSoalAktif(n => n + 1);
  }

  if (!loaded) return null;

  const benarCount = jawabanUser.filter((j, i) => j === soalHariIni[i]?.jawaban).length;
  const soalSekarang = soalHariIni[soalAktif] || null;
  const sudahJawabSekarang = jawabanUser[soalAktif] !== undefined;

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-indigo-500 hover:text-indigo-700 text-2xl">←</Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-violet-700">⚡ Daily Challenge</h1>
            <p className="text-xs text-gray-400">
              {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-orange-100 text-orange-600 px-3 py-1.5 rounded-full text-sm font-bold">
            🔥 {streak} hari
          </div>
        </div>

        {!sudahSelesai && (
          <div className="max-w-xl mx-auto px-4 pb-3">
            <div className="flex gap-1.5">
              {soalHariIni.map((_, i) => (
                <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${
                  i < soalAktif ? "bg-violet-500" : i === soalAktif ? "bg-violet-300" : "bg-gray-200"
                }`} />
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">Soal {Math.min(soalAktif + 1, soalHariIni.length)} dari {soalHariIni.length}</p>
          </div>
        )}
      </header>

      <div className="max-w-xl mx-auto px-4 py-8">
        {sudahSelesai ? (
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
              <div className="text-6xl mb-3">
                {benarCount === soalHariIni.length ? "🏆" : benarCount >= 2 ? "🌟" : "💪"}
              </div>
              <h2 className="text-2xl font-extrabold text-gray-800 mb-1">
                {benarCount === soalHariIni.length ? "Sempurna!" : benarCount >= 2 ? "Bagus!" : "Tetap Semangat!"}
              </h2>
              <p className="text-gray-500 text-sm mb-3">{benarCount} dari {soalHariIni.length} soal benar</p>
              <div className="flex items-center justify-center gap-4 mb-4">
                {soalHariIni.map((_, i) => (
                  <span key={i} className={`text-3xl ${jawabanUser[i] === soalHariIni[i].jawaban ? "text-green-500" : "text-red-400"}`}>
                    {jawabanUser[i] === soalHariIni[i].jawaban ? "✓" : "✗"}
                  </span>
                ))}
              </div>
              <div className="bg-orange-50 rounded-2xl py-3 px-4 inline-flex items-center gap-2 text-orange-600 font-bold text-sm">
                🔥 Streak kamu: {streak} hari
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-violet-100 p-5">
              <h3 className="font-bold text-gray-700 mb-4">📋 Review Jawaban</h3>
              <div className="flex flex-col gap-4">
                {soalHariIni.map((soal, i) => {
                  const benar = jawabanUser[i] === soal.jawaban;
                  return (
                    <div key={i} className={`rounded-xl p-4 border-2 ${benar ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                      <p className="text-sm font-semibold text-gray-800 mb-2">{i + 1}. {soal.pertanyaan}</p>
                      {!benar && (
                        <p className="text-xs text-red-600 mb-1">
                          Jawabanmu: <span className="font-bold">{soal.pilihan[jawabanUser[i]]}</span>
                        </p>
                      )}
                      <p className={`text-xs font-bold ${benar ? "text-green-700" : "text-gray-700"}`}>
                        ✓ Jawaban benar: {soal.pilihan[soal.jawaban]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-center text-gray-400 text-sm">Kembali lagi besok untuk soal baru! 🌟</p>
          </div>
        ) : (
          soalSekarang && (
            <div className="bg-white rounded-3xl shadow-xl p-7">
              <div className="text-center mb-6">
                <span className="text-5xl">⚡</span>
                <h2 className="text-xl font-extrabold text-gray-800 mt-3 leading-snug">
                  {soalSekarang.pertanyaan}
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {soalSekarang.pilihan.map((p, idx) => {
                  let style = "border-2 border-gray-200 bg-white hover:border-violet-400 hover:bg-violet-50 text-gray-700";
                  let icon = null;
                  if (sudahJawabSekarang) {
                    if (idx === soalSekarang.jawaban) {
                      style = "border-2 border-green-500 bg-green-50 text-green-700";
                      icon = <span className="ml-2 text-green-600 font-bold">✓</span>;
                    } else if (idx === jawabanUser[soalAktif]) {
                      style = "border-2 border-red-400 bg-red-50 text-red-700";
                      icon = <span className="ml-2 text-red-500 font-bold">✗</span>;
                    } else {
                      style = "border-2 border-gray-100 bg-gray-50 text-gray-400 opacity-50";
                    }
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => jawab(idx)}
                      disabled={sudahJawabSekarang}
                      className={`w-full text-left px-4 py-3.5 rounded-xl font-medium transition-all ${style}`}
                    >
                      <span className="font-bold text-violet-400 mr-2">{["A", "B", "C", "D"][idx]}.</span>
                      {p}
                      {icon}
                    </button>
                  );
                })}
              </div>

              {sudahJawabSekarang && soalAktif < soalHariIni.length - 1 && (
                <button
                  onClick={lanjut}
                  className="w-full mt-5 py-3 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold hover:scale-105 transition-transform shadow-md"
                >
                  Soal Berikutnya →
                </button>
              )}
            </div>
          )
        )}
      </div>
    </main>
  );
}
