// Data kosakata lengkap — 112 kata dalam 8 kategori
// level: "pemula"  → ~5 kata paling dasar per kategori (total 40 kata)
// level: "menengah" → kata lebih lanjut (Menengah melihat SEMUA 112 kata)
export const kosakata = [
  // === BUAH & SAYUR ===
  // Pemula (5 kata): buah/sayur yang paling umum dikenal
  { id: 1,  english: "Apple",       indonesian: "Apel",           emoji: "🍎", kategori: "Buah & Sayur", level: "pemula",   contoh: "I eat an apple every morning." },
  { id: 2,  english: "Banana",      indonesian: "Pisang",         emoji: "🍌", kategori: "Buah & Sayur", level: "pemula",   contoh: "Monkeys love bananas." },
  { id: 3,  english: "Orange",      indonesian: "Jeruk",          emoji: "🍊", kategori: "Buah & Sayur", level: "pemula",   contoh: "This orange juice is very fresh." },
  { id: 4,  english: "Mango",       indonesian: "Mangga",         emoji: "🥭", kategori: "Buah & Sayur", level: "pemula",   contoh: "Mango is my favorite fruit." },
  { id: 5,  english: "Watermelon",  indonesian: "Semangka",       emoji: "🍉", kategori: "Buah & Sayur", level: "pemula",   contoh: "We eat watermelon in summer." },
  // Menengah
  { id: 6,  english: "Carrot",      indonesian: "Wortel",         emoji: "🥕", kategori: "Buah & Sayur", level: "menengah", contoh: "Carrots are good for your eyes." },
  { id: 7,  english: "Tomato",      indonesian: "Tomat",          emoji: "🍅", kategori: "Buah & Sayur", level: "menengah", contoh: "She puts tomato in the salad." },
  { id: 8,  english: "Potato",      indonesian: "Kentang",        emoji: "🥔", kategori: "Buah & Sayur", level: "menengah", contoh: "French fries are made from potatoes." },
  { id: 65, english: "Strawberry",  indonesian: "Stroberi",       emoji: "🍓", kategori: "Buah & Sayur", level: "menengah", contoh: "She loves strawberry ice cream." },
  { id: 66, english: "Grape",       indonesian: "Anggur",         emoji: "🍇", kategori: "Buah & Sayur", level: "menengah", contoh: "Grapes are used to make wine." },
  { id: 67, english: "Pineapple",   indonesian: "Nanas",          emoji: "🍍", kategori: "Buah & Sayur", level: "menengah", contoh: "Pineapple pizza is controversial." },
  { id: 68, english: "Corn",        indonesian: "Jagung",         emoji: "🌽", kategori: "Buah & Sayur", level: "menengah", contoh: "We roast corn at the campfire." },
  { id: 69, english: "Spinach",     indonesian: "Bayam",          emoji: "🥬", kategori: "Buah & Sayur", level: "menengah", contoh: "Spinach is rich in iron." },
  { id: 70, english: "Cucumber",    indonesian: "Mentimun",       emoji: "🥒", kategori: "Buah & Sayur", level: "menengah", contoh: "Cucumber is cool and refreshing." },

  // === HEWAN ===
  // Pemula (5 kata): hewan yang paling dikenal anak-anak
  { id: 9,  english: "Cat",         indonesian: "Kucing",         emoji: "🐱", kategori: "Hewan",        level: "pemula",   contoh: "The cat is sleeping on the sofa." },
  { id: 10, english: "Dog",         indonesian: "Anjing",         emoji: "🐶", kategori: "Hewan",        level: "pemula",   contoh: "My dog loves to play outside." },
  { id: 11, english: "Bird",        indonesian: "Burung",         emoji: "🐦", kategori: "Hewan",        level: "pemula",   contoh: "The bird sings every morning." },
  { id: 12, english: "Fish",        indonesian: "Ikan",           emoji: "🐟", kategori: "Hewan",        level: "pemula",   contoh: "We saw many fish in the lake." },
  { id: 13, english: "Rabbit",      indonesian: "Kelinci",        emoji: "🐰", kategori: "Hewan",        level: "pemula",   contoh: "The rabbit eats carrots." },
  // Menengah
  { id: 14, english: "Elephant",    indonesian: "Gajah",          emoji: "🐘", kategori: "Hewan",        level: "menengah", contoh: "Elephants are the largest land animals." },
  { id: 15, english: "Tiger",       indonesian: "Harimau",        emoji: "🐯", kategori: "Hewan",        level: "menengah", contoh: "The tiger is a dangerous animal." },
  { id: 16, english: "Butterfly",   indonesian: "Kupu-kupu",      emoji: "🦋", kategori: "Hewan",        level: "menengah", contoh: "The butterfly is very beautiful." },
  { id: 71, english: "Monkey",      indonesian: "Monyet",         emoji: "🐒", kategori: "Hewan",        level: "menengah", contoh: "The monkey climbs the tree quickly." },
  { id: 72, english: "Cow",         indonesian: "Sapi",           emoji: "🐄", kategori: "Hewan",        level: "menengah", contoh: "The cow gives us milk." },
  { id: 73, english: "Horse",       indonesian: "Kuda",           emoji: "🐴", kategori: "Hewan",        level: "menengah", contoh: "She rides a horse every weekend." },
  { id: 74, english: "Duck",        indonesian: "Bebek",          emoji: "🦆", kategori: "Hewan",        level: "menengah", contoh: "The duck swims in the pond." },
  { id: 75, english: "Rooster",     indonesian: "Ayam Jantan",    emoji: "🐓", kategori: "Hewan",        level: "menengah", contoh: "The rooster crows at sunrise." },
  { id: 76, english: "Dolphin",     indonesian: "Lumba-lumba",    emoji: "🐬", kategori: "Hewan",        level: "menengah", contoh: "Dolphins are very intelligent animals." },

  // === TEMPAT ===
  // Pemula (5 kata): tempat yang paling sering ditemui sehari-hari
  { id: 17, english: "School",      indonesian: "Sekolah",        emoji: "🏫", kategori: "Tempat",       level: "pemula",   contoh: "I go to school every morning." },
  { id: 18, english: "Hospital",    indonesian: "Rumah Sakit",    emoji: "🏥", kategori: "Tempat",       level: "pemula",   contoh: "My uncle works at the hospital." },
  { id: 19, english: "Market",      indonesian: "Pasar",          emoji: "🏪", kategori: "Tempat",       level: "pemula",   contoh: "Mom buys vegetables at the market." },
  { id: 23, english: "Beach",       indonesian: "Pantai",         emoji: "🏖️", kategori: "Tempat",       level: "pemula",   contoh: "We swim at the beach on weekends." },
  { id: 24, english: "Mountain",    indonesian: "Gunung",         emoji: "⛰️", kategori: "Tempat",       level: "pemula",   contoh: "The mountain is covered with snow." },
  // Menengah
  { id: 20, english: "Library",     indonesian: "Perpustakaan",   emoji: "📚", kategori: "Tempat",       level: "menengah", contoh: "She reads books at the library." },
  { id: 21, english: "Restaurant",  indonesian: "Restoran",       emoji: "🍽️", kategori: "Tempat",       level: "menengah", contoh: "We had dinner at a nice restaurant." },
  { id: 22, english: "Airport",     indonesian: "Bandara",        emoji: "✈️", kategori: "Tempat",       level: "menengah", contoh: "The plane lands at the airport." },
  { id: 77, english: "Museum",      indonesian: "Museum",         emoji: "🏛️", kategori: "Tempat",       level: "menengah", contoh: "We visited a history museum yesterday." },
  { id: 78, english: "Park",        indonesian: "Taman",          emoji: "🌳", kategori: "Tempat",       level: "menengah", contoh: "Children play in the park after school." },
  { id: 79, english: "Mosque",      indonesian: "Masjid",         emoji: "🕌", kategori: "Tempat",       level: "menengah", contoh: "We pray at the mosque on Friday." },
  { id: 80, english: "Stadium",     indonesian: "Stadion",        emoji: "🏟️", kategori: "Tempat",       level: "menengah", contoh: "The match was held at the stadium." },
  { id: 81, english: "Mall",        indonesian: "Pusat Perbelanjaan", emoji: "🛍️", kategori: "Tempat",   level: "menengah", contoh: "We go to the mall on weekends." },
  { id: 82, english: "Hotel",       indonesian: "Hotel",          emoji: "🏨", kategori: "Tempat",       level: "menengah", contoh: "We stayed at a 5-star hotel." },

  // === KATA KERJA ===
  // Pemula (5 kata): aktivitas sehari-hari paling dasar
  { id: 83, english: "Sleep",       indonesian: "Tidur",          emoji: "😴", kategori: "Kata Kerja",   level: "pemula",   contoh: "I sleep for eight hours every night." },
  { id: 84, english: "Eat",         indonesian: "Makan",          emoji: "🍽️", kategori: "Kata Kerja",   level: "pemula",   contoh: "We eat breakfast together every morning." },
  { id: 85, english: "Drink",       indonesian: "Minum",          emoji: "🥤", kategori: "Kata Kerja",   level: "pemula",   contoh: "She drinks a glass of water daily." },
  { id: 25, english: "Run",         indonesian: "Berlari",        emoji: "🏃", kategori: "Kata Kerja",   level: "pemula",   contoh: "He runs every morning for exercise." },
  { id: 29, english: "Read",        indonesian: "Membaca",        emoji: "📖", kategori: "Kata Kerja",   level: "pemula",   contoh: "I read a book every night." },
  // Menengah
  { id: 26, english: "Jump",        indonesian: "Melompat",       emoji: "🦘", kategori: "Kata Kerja",   level: "menengah", contoh: "The kids love to jump on the trampoline." },
  { id: 27, english: "Swim",        indonesian: "Berenang",       emoji: "🏊", kategori: "Kata Kerja",   level: "menengah", contoh: "She swims very fast." },
  { id: 28, english: "Cook",        indonesian: "Memasak",        emoji: "👨‍🍳", kategori: "Kata Kerja",  level: "menengah", contoh: "My mother cooks delicious food." },
  { id: 30, english: "Write",       indonesian: "Menulis",        emoji: "✍️", kategori: "Kata Kerja",   level: "menengah", contoh: "She writes in her diary every day." },
  { id: 31, english: "Sing",        indonesian: "Bernyanyi",      emoji: "🎤", kategori: "Kata Kerja",   level: "menengah", contoh: "He sings beautifully on stage." },
  { id: 32, english: "Dance",       indonesian: "Menari",         emoji: "💃", kategori: "Kata Kerja",   level: "menengah", contoh: "She loves to dance to music." },
  { id: 86, english: "Study",       indonesian: "Belajar",        emoji: "📝", kategori: "Kata Kerja",   level: "menengah", contoh: "He studies English every afternoon." },
  { id: 87, english: "Play",        indonesian: "Bermain",        emoji: "🎮", kategori: "Kata Kerja",   level: "menengah", contoh: "Children play in the park after school." },
  { id: 88, english: "Travel",      indonesian: "Bepergian / Melakukan perjalanan", emoji: "🧳", kategori: "Kata Kerja", level: "menengah", contoh: "She loves to travel around the world." },

  // === KATA SIFAT ===
  // Pemula (5 kata): sifat paling umum dan mudah dipahami
  { id: 33, english: "Beautiful",   indonesian: "Cantik / Indah", emoji: "🌸", kategori: "Kata Sifat",   level: "pemula",   contoh: "The garden is very beautiful." },
  { id: 34, english: "Strong",      indonesian: "Kuat",           emoji: "💪", kategori: "Kata Sifat",   level: "pemula",   contoh: "He is very strong." },
  { id: 35, english: "Smart",       indonesian: "Pintar / Cerdas",emoji: "🧠", kategori: "Kata Sifat",   level: "pemula",   contoh: "She is the smartest student in class." },
  { id: 36, english: "Brave",       indonesian: "Berani",         emoji: "🦁", kategori: "Kata Sifat",   level: "pemula",   contoh: "The firefighter is very brave." },
  { id: 37, english: "Honest",      indonesian: "Jujur",          emoji: "🤝", kategori: "Kata Sifat",   level: "pemula",   contoh: "Always be honest with your friends." },
  // Menengah
  { id: 38, english: "Lazy",        indonesian: "Malas",          emoji: "😴", kategori: "Kata Sifat",   level: "menengah", contoh: "Don't be lazy — study hard!" },
  { id: 39, english: "Careful",     indonesian: "Hati-hati / Teliti", emoji: "🎯", kategori: "Kata Sifat", level: "menengah", contoh: "Be careful when crossing the street." },
  { id: 40, english: "Generous",    indonesian: "Dermawan / Murah hati", emoji: "🎁", kategori: "Kata Sifat", level: "menengah", contoh: "She is very generous with her time." },
  { id: 89, english: "Delicious",   indonesian: "Lezat",          emoji: "😋", kategori: "Kata Sifat",   level: "menengah", contoh: "This food is really delicious!" },
  { id: 90, english: "Quiet",       indonesian: "Tenang / Sunyi", emoji: "🤫", kategori: "Kata Sifat",   level: "menengah", contoh: "Please be quiet in the library." },
  { id: 91, english: "Busy",        indonesian: "Sibuk",          emoji: "⏰", kategori: "Kata Sifat",   level: "menengah", contoh: "She is very busy with her work." },
  { id: 92, english: "Friendly",    indonesian: "Ramah",          emoji: "😄", kategori: "Kata Sifat",   level: "menengah", contoh: "The teacher is very friendly." },
  { id: 93, english: "Difficult",   indonesian: "Sulit / Susah",  emoji: "😤", kategori: "Kata Sifat",   level: "menengah", contoh: "This math problem is very difficult." },
  { id: 94, english: "Lucky",       indonesian: "Beruntung",      emoji: "🍀", kategori: "Kata Sifat",   level: "menengah", contoh: "I feel lucky today!" },

  // === PERASAAN & EMOSI ===
  // Pemula (5 kata): emosi paling dasar yang dikenal semua orang
  { id: 41, english: "Happy",       indonesian: "Bahagia / Senang", emoji: "😊", kategori: "Perasaan",   level: "pemula",   contoh: "I am very happy today!" },
  { id: 42, english: "Sad",         indonesian: "Sedih",          emoji: "😢", kategori: "Perasaan",     level: "pemula",   contoh: "She felt sad after the bad news." },
  { id: 43, english: "Angry",       indonesian: "Marah",          emoji: "😠", kategori: "Perasaan",     level: "pemula",   contoh: "He was angry when he lost his keys." },
  { id: 44, english: "Scared",      indonesian: "Takut",          emoji: "😨", kategori: "Perasaan",     level: "pemula",   contoh: "The child was scared of the dark." },
  { id: 45, english: "Excited",     indonesian: "Bersemangat / Antusias", emoji: "🤩", kategori: "Perasaan", level: "pemula", contoh: "She was excited about her birthday." },
  // Menengah
  { id: 46, english: "Bored",       indonesian: "Bosan",          emoji: "😑", kategori: "Perasaan",     level: "menengah", contoh: "He was bored during the long meeting." },
  { id: 47, english: "Proud",       indonesian: "Bangga",         emoji: "🥹", kategori: "Perasaan",     level: "menengah", contoh: "Her parents were proud of her results." },
  { id: 48, english: "Nervous",     indonesian: "Gugup",          emoji: "😰", kategori: "Perasaan",     level: "menengah", contoh: "I was nervous before the exam." },
  { id: 95, english: "Confused",    indonesian: "Bingung",        emoji: "😕", kategori: "Perasaan",     level: "menengah", contoh: "I was confused by the question." },
  { id: 96, english: "Tired",       indonesian: "Lelah",          emoji: "😩", kategori: "Perasaan",     level: "menengah", contoh: "She was tired after a long day." },
  { id: 97, english: "Grateful",    indonesian: "Bersyukur",      emoji: "🙏", kategori: "Perasaan",     level: "menengah", contoh: "I am grateful for everything I have." },
  { id: 98, english: "Jealous",     indonesian: "Cemburu / Iri",  emoji: "😒", kategori: "Perasaan",     level: "menengah", contoh: "He felt jealous of his friend's success." },
  { id: 99, english: "Embarrassed", indonesian: "Malu",           emoji: "😳", kategori: "Perasaan",     level: "menengah", contoh: "She was embarrassed when she fell." },
  { id: 100, english: "Hopeful",    indonesian: "Penuh Harapan",  emoji: "🌟", kategori: "Perasaan",     level: "menengah", contoh: "He felt hopeful about the future." },

  // === RUMAH & BENDA ===
  // Pemula (5 kata): benda rumah yang paling dikenal
  { id: 49, english: "Chair",       indonesian: "Kursi",          emoji: "🪑", kategori: "Rumah & Benda", level: "pemula",   contoh: "Please sit on the chair." },
  { id: 50, english: "Table",       indonesian: "Meja",           emoji: "🪵", kategori: "Rumah & Benda", level: "pemula",   contoh: "Put the book on the table." },
  { id: 52, english: "Lamp",        indonesian: "Lampu",          emoji: "💡", kategori: "Rumah & Benda", level: "pemula",   contoh: "Turn off the lamp before sleeping." },
  { id: 101, english: "Bed",        indonesian: "Tempat Tidur",   emoji: "🛏️", kategori: "Rumah & Benda", level: "pemula",   contoh: "I make my bed every morning." },
  { id: 104, english: "Pencil",     indonesian: "Pensil",         emoji: "✏️", kategori: "Rumah & Benda", level: "pemula",   contoh: "Write your name with a pencil." },
  // Menengah
  { id: 51, english: "Window",      indonesian: "Jendela",        emoji: "🪟", kategori: "Rumah & Benda", level: "menengah", contoh: "Please open the window." },
  { id: 53, english: "Pillow",      indonesian: "Bantal",         emoji: "🛏️", kategori: "Rumah & Benda", level: "menengah", contoh: "I sleep with two pillows." },
  { id: 54, english: "Mirror",      indonesian: "Cermin",         emoji: "🪞", kategori: "Rumah & Benda", level: "menengah", contoh: "She looks in the mirror every morning." },
  { id: 55, english: "Refrigerator",indonesian: "Kulkas",         emoji: "🧊", kategori: "Rumah & Benda", level: "menengah", contoh: "Put the milk in the refrigerator." },
  { id: 56, english: "Umbrella",    indonesian: "Payung",         emoji: "☂️", kategori: "Rumah & Benda", level: "menengah", contoh: "Bring your umbrella — it might rain." },
  { id: 102, english: "Bag",        indonesian: "Tas",            emoji: "👜", kategori: "Rumah & Benda", level: "menengah", contoh: "She carries a bag to school." },
  { id: 103, english: "Clock",      indonesian: "Jam Dinding",    emoji: "🕐", kategori: "Rumah & Benda", level: "menengah", contoh: "The clock on the wall is broken." },
  { id: 105, english: "Telephone",  indonesian: "Telepon",        emoji: "📱", kategori: "Rumah & Benda", level: "menengah", contoh: "She called me on the telephone." },
  { id: 106, english: "Television", indonesian: "Televisi",       emoji: "📺", kategori: "Rumah & Benda", level: "menengah", contoh: "We watch television after dinner." },

  // === ALAM & CUACA ===
  // Pemula (5 kata): fenomena alam yang paling dikenal
  { id: 57, english: "Rain",        indonesian: "Hujan",          emoji: "🌧️", kategori: "Alam & Cuaca", level: "pemula",   contoh: "It rains heavily in December." },
  { id: 58, english: "Sun",         indonesian: "Matahari",       emoji: "☀️", kategori: "Alam & Cuaca", level: "pemula",   contoh: "The sun rises in the east." },
  { id: 60, english: "Cloud",       indonesian: "Awan",           emoji: "☁️", kategori: "Alam & Cuaca", level: "pemula",   contoh: "Dark clouds mean rain is coming." },
  { id: 61, english: "River",       indonesian: "Sungai",         emoji: "🏞️", kategori: "Alam & Cuaca", level: "pemula",   contoh: "Fish live in the river." },
  { id: 64, english: "Rainbow",     indonesian: "Pelangi",        emoji: "🌈", kategori: "Alam & Cuaca", level: "pemula",   contoh: "A rainbow appears after the rain." },
  // Menengah
  { id: 59, english: "Wind",        indonesian: "Angin",          emoji: "💨", kategori: "Alam & Cuaca", level: "menengah", contoh: "The wind is very strong today." },
  { id: 62, english: "Forest",      indonesian: "Hutan",          emoji: "🌲", kategori: "Alam & Cuaca", level: "menengah", contoh: "Many animals live in the forest." },
  { id: 63, english: "Earthquake",  indonesian: "Gempa Bumi",     emoji: "🌍", kategori: "Alam & Cuaca", level: "menengah", contoh: "The earthquake destroyed many buildings." },
  { id: 107, english: "Snow",       indonesian: "Salju",          emoji: "❄️", kategori: "Alam & Cuaca", level: "menengah", contoh: "Snow falls in winter in cold countries." },
  { id: 108, english: "Storm",      indonesian: "Badai",          emoji: "⛈️", kategori: "Alam & Cuaca", level: "menengah", contoh: "A storm is coming — stay inside!" },
  { id: 109, english: "Volcano",    indonesian: "Gunung Berapi",  emoji: "🌋", kategori: "Alam & Cuaca", level: "menengah", contoh: "The volcano erupted last night." },
  { id: 110, english: "Ocean",      indonesian: "Samudra / Lautan", emoji: "🌊", kategori: "Alam & Cuaca", level: "menengah", contoh: "The ocean is vast and deep." },
  { id: 111, english: "Desert",     indonesian: "Gurun",          emoji: "🏜️", kategori: "Alam & Cuaca", level: "menengah", contoh: "The Sahara is the world's largest desert." },
  { id: 112, english: "Flood",      indonesian: "Banjir",         emoji: "🌊", kategori: "Alam & Cuaca", level: "menengah", contoh: "The flood destroyed many homes." },
];

// Daftar semua kategori unik
export const kategoriList = [...new Set(kosakata.map((k) => k.kategori))];
