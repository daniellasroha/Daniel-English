// Data bacaan untuk fitur Reading — teks + soal pemahaman per level CEFR
// A1: 50-80 kata | A2: 100-130 kata | B1: 150-200 kata

export const bacaan = [
  // ═══════════════════ LEVEL A1 ═══════════════════
  {
    id: 1,
    judul: "My Family",
    emoji: "👨‍👩‍👧",
    level: "a1",
    teks: "My name is Sari. I live in Bandung with my family. There are four people in my family: my father, my mother, my brother, and me. My father is a teacher. He teaches math at a school. My mother is a nurse. She works at a hospital. My brother is ten years old. He likes to play football. We are a happy family.",
    soal: [
      { pertanyaan: "How many people are in Sari's family?", pilihan: ["Three", "Four", "Five", "Six"], jawaban: 1 },
      { pertanyaan: "What is her father's job?", pilihan: ["Nurse", "Doctor", "Teacher", "Driver"], jawaban: 2 },
      { pertanyaan: "Where does her mother work?", pilihan: ["At a school", "At a hospital", "At a bank", "At home"], jawaban: 1 },
      { pertanyaan: "What does her brother like?", pilihan: ["Football", "Swimming", "Reading", "Music"], jawaban: 0 },
    ],
  },
  {
    id: 2,
    judul: "A Day at School",
    emoji: "🏫",
    level: "a1",
    teks: "Budi goes to school every morning. He gets up at five o'clock. He takes a shower and eats breakfast. He eats rice and an egg. He goes to school by bicycle. School starts at seven o'clock. Budi likes English and math. After school, he plays with his friends. He goes home at three o'clock in the afternoon.",
    soal: [
      { pertanyaan: "What time does Budi get up?", pilihan: ["Five o'clock", "Six o'clock", "Seven o'clock", "Eight o'clock"], jawaban: 0 },
      { pertanyaan: "What does Budi eat for breakfast?", pilihan: ["Bread and milk", "Rice and an egg", "Noodles", "Fruit"], jawaban: 1 },
      { pertanyaan: "How does Budi go to school?", pilihan: ["By bus", "By car", "By bicycle", "On foot"], jawaban: 2 },
      { pertanyaan: "What time does he go home?", pilihan: ["At seven o'clock", "At twelve o'clock", "At three o'clock", "At five o'clock"], jawaban: 2 },
    ],
  },
  {
    id: 3,
    judul: "My Cat Milo",
    emoji: "🐱",
    level: "a1",
    teks: "I have a cat. His name is Milo. He is two years old. Milo is orange and white. He is small but very fast. Milo likes to eat fish. He sleeps on my bed every night. In the morning, he wakes me up. Milo likes to play with a small ball. I love my cat very much.",
    soal: [
      { pertanyaan: "What is the cat's name?", pilihan: ["Max", "Milo", "Mimi", "Momo"], jawaban: 1 },
      { pertanyaan: "How old is the cat?", pilihan: ["One year old", "Two years old", "Three years old", "Four years old"], jawaban: 1 },
      { pertanyaan: "What does Milo like to eat?", pilihan: ["Rice", "Bread", "Fish", "Chicken"], jawaban: 2 },
      { pertanyaan: "Where does Milo sleep?", pilihan: ["On the sofa", "On the floor", "In the kitchen", "On the writer's bed"], jawaban: 3 },
    ],
  },

  // ═══════════════════ LEVEL A2 ═══════════════════
  {
    id: 4,
    judul: "A Trip to the Beach",
    emoji: "🏖️",
    level: "a2",
    teks: "Last weekend, my family and I went to the beach. We left home early in the morning because the beach is far from our house. The journey took about three hours by car. When we arrived, the weather was sunny and the sea was beautiful. My brother and I swam in the sea while my parents sat under a big umbrella. At noon, we ate fried rice and grilled fish at a small restaurant near the beach. In the afternoon, we built a sandcastle and collected seashells. We went home in the evening. I was tired, but it was one of the best days of my holiday.",
    soal: [
      { pertanyaan: "How long was the journey to the beach?", pilihan: ["One hour", "Two hours", "Three hours", "Four hours"], jawaban: 2 },
      { pertanyaan: "What did the parents do at the beach?", pilihan: ["They swam in the sea", "They sat under an umbrella", "They built a sandcastle", "They played football"], jawaban: 1 },
      { pertanyaan: "What did they eat at noon?", pilihan: ["Fried rice and grilled fish", "Noodles and chicken", "Bread and soup", "Pizza and salad"], jawaban: 0 },
      { pertanyaan: "When did they go home?", pilihan: ["At noon", "In the morning", "In the afternoon", "In the evening"], jawaban: 3 },
    ],
  },
  {
    id: 5,
    judul: "Rini's New Hobby",
    emoji: "🌱",
    level: "a2",
    teks: "Rini started a new hobby last month: gardening. At first, she didn't know anything about plants. She watched videos on the internet and read some books about gardening. Then she bought seeds, soil, and some small pots. She planted tomatoes and chilies on the balcony of her apartment. Every morning before work, she waters the plants. Last week, she saw the first small tomatoes growing. She was very happy and took many photos. Rini says gardening makes her feel calm and patient. Next month, she wants to plant flowers too.",
    soal: [
      { pertanyaan: "When did Rini start gardening?", pilihan: ["Last week", "Last month", "Last year", "Yesterday"], jawaban: 1 },
      { pertanyaan: "How did she learn about gardening?", pilihan: ["From her mother", "From a gardening class", "From videos and books", "From her neighbor"], jawaban: 2 },
      { pertanyaan: "What did she plant?", pilihan: ["Flowers and grass", "Tomatoes and chilies", "Mangoes and bananas", "Carrots and potatoes"], jawaban: 1 },
      { pertanyaan: "How does gardening make Rini feel?", pilihan: ["Tired and bored", "Calm and patient", "Sad and lonely", "Busy and stressed"], jawaban: 1 },
    ],
  },
  {
    id: 6,
    judul: "The New Student",
    emoji: "🎒",
    level: "a2",
    teks: "Yesterday, a new student joined our class. His name is Kevin and he comes from Singapore. His family moved to Jakarta because of his father's job. At first, Kevin looked nervous and didn't talk much. Our teacher asked me to help him because I sit next to him. I showed him around the school: the library, the canteen, and the sports hall. At lunchtime, Kevin told me about his old school in Singapore. He said the lessons there were similar, but the school food was very different. He misses his old friends, but he is excited to make new ones. I think Kevin and I will be good friends.",
    soal: [
      { pertanyaan: "Where does Kevin come from?", pilihan: ["Malaysia", "Singapore", "Thailand", "Vietnam"], jawaban: 1 },
      { pertanyaan: "Why did Kevin's family move to Jakarta?", pilihan: ["For a holiday", "Because of his father's job", "To visit family", "For better weather"], jawaban: 1 },
      { pertanyaan: "How did Kevin feel at first?", pilihan: ["Excited", "Angry", "Nervous", "Happy"], jawaban: 2 },
      { pertanyaan: "What did the writer show Kevin?", pilihan: ["The library, canteen, and sports hall", "The teacher's office", "The parking area", "The school garden"], jawaban: 0 },
    ],
  },

  // ═══════════════════ LEVEL B1 ═══════════════════
  {
    id: 7,
    judul: "Working From Home",
    emoji: "💻",
    level: "b1",
    teks: "Over the past few years, working from home has become increasingly common around the world. Many companies have realized that their employees can be just as productive at home as they are in the office. There are several advantages to this way of working. Employees save time and money because they don't have to travel to work every day. They can also organize their schedule more flexibly, which often leads to a better balance between work and personal life. However, working from home also has its challenges. Some people feel isolated because they miss talking to their colleagues face to face. Others find it difficult to concentrate at home, especially if they have small children or noisy neighbors. Experts suggest that the best solution might be a hybrid model, where employees work from home for part of the week and come to the office for the rest. This way, they can enjoy the benefits of both worlds.",
    soal: [
      { pertanyaan: "What have many companies realized about working from home?", pilihan: ["It is always worse than office work", "Employees can be just as productive at home", "It costs companies more money", "It only works for small companies"], jawaban: 1 },
      { pertanyaan: "Which is mentioned as an advantage of working from home?", pilihan: ["Meeting more people", "Bigger salary", "Saving time and money on travel", "Free lunch"], jawaban: 2 },
      { pertanyaan: "Why do some people feel isolated when working from home?", pilihan: ["They miss face-to-face conversations with colleagues", "Their internet is slow", "They work longer hours", "Their house is too small"], jawaban: 0 },
      { pertanyaan: "What do experts suggest as the best solution?", pilihan: ["Working only from home", "Working only in the office", "A hybrid model", "Working fewer hours"], jawaban: 2 },
    ],
  },
  {
    id: 8,
    judul: "The Importance of Sleep",
    emoji: "😴",
    level: "b1",
    teks: "Many people believe that sleeping less means having more time to be productive. However, scientists have discovered that the opposite is often true. When we don't get enough sleep, our brain cannot work properly. We find it harder to concentrate, remember information, and make good decisions. Research shows that adults need between seven and nine hours of sleep every night, while teenagers need even more. Unfortunately, modern lifestyle makes it difficult for many people to sleep well. Using phones and computers before bed is one of the biggest problems, because the blue light from screens tells our brain to stay awake. Experts recommend avoiding screens at least one hour before bedtime, keeping the bedroom dark and quiet, and going to bed at the same time every night. If you improve your sleep, you will probably notice that you have more energy, a better mood, and improved performance at school or work.",
    soal: [
      { pertanyaan: "What happens when we don't get enough sleep?", pilihan: ["We become more creative", "Our brain cannot work properly", "We need less food", "We become stronger"], jawaban: 1 },
      { pertanyaan: "How many hours of sleep do adults need?", pilihan: ["Five to six hours", "Six to seven hours", "Seven to nine hours", "Ten to twelve hours"], jawaban: 2 },
      { pertanyaan: "Why is using phones before bed a problem?", pilihan: ["Phones are too heavy", "The blue light tells our brain to stay awake", "Phones are expensive", "We might drop the phone"], jawaban: 1 },
      { pertanyaan: "Which is NOT mentioned as a tip for better sleep?", pilihan: ["Avoiding screens before bedtime", "Keeping the bedroom dark", "Going to bed at the same time", "Drinking coffee at night"], jawaban: 3 },
    ],
  },
  {
    id: 9,
    judul: "Plastic and Our Oceans",
    emoji: "🌊",
    level: "b1",
    teks: "Every year, millions of tons of plastic waste end up in the world's oceans. This pollution has become one of the most serious environmental problems of our time. Sea animals often mistake plastic for food. Turtles, for example, eat plastic bags because they look like jellyfish, their favorite meal. Fish and seabirds also swallow small pieces of plastic, which can make them sick or even kill them. Scientists have warned that if we don't change our habits, there could be more plastic than fish in the ocean by 2050. The good news is that everyone can help solve this problem. Simple actions make a big difference: bringing your own shopping bag, refusing plastic straws, using a refillable water bottle, and recycling properly. Some countries have already banned single-use plastic bags, and many companies are developing packaging made from natural materials. Protecting the ocean is not only the government's job — it is a responsibility that all of us share.",
    soal: [
      { pertanyaan: "Why do turtles eat plastic bags?", pilihan: ["They are hungry all the time", "Plastic bags look like jellyfish", "Plastic bags smell good", "They like the color"], jawaban: 1 },
      { pertanyaan: "What could happen by 2050 according to scientists?", pilihan: ["There could be more plastic than fish in the ocean", "All plastic will disappear", "The ocean will become bigger", "Fish will learn to avoid plastic"], jawaban: 0 },
      { pertanyaan: "Which action is suggested to help solve the problem?", pilihan: ["Buying more plastic bottles", "Using a refillable water bottle", "Throwing waste into rivers", "Using more plastic straws"], jawaban: 1 },
      { pertanyaan: "According to the text, whose responsibility is protecting the ocean?", pilihan: ["Only the government's", "Only scientists'", "Only companies'", "Everyone's"], jawaban: 3 },
    ],
  },
];
