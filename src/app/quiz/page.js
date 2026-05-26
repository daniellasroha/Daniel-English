// Halaman Quiz — pilih kategori kuis
import Link from "next/link";

const kategoriKuis = [
  {
    href: "/quiz/vocabulary",
    emoji: "📚",
    judul: "Vocabulary Quiz",
    deskripsi: "Uji hafalan kosakata bahasa Inggris kamu",
    warna: "from-blue-400 to-blue-600",
    bgLight: "bg-blue-50",
    border: "border-blue-200",
    soal: "20 soal",
  },
  {
    href: "/quiz/grammar",
    emoji: "✏️",
    judul: "Grammar Quiz",
    deskripsi: "Uji pemahaman tata bahasa Inggris kamu",
    warna: "from-green-400 to-green-600",
    bgLight: "bg-green-50",
    border: "border-green-200",
    soal: "16 soal",
  },
  {
    href: "/quiz/mixed",
    emoji: "🎯",
    judul: "Mixed Quiz",
    deskripsi: "Campuran semua materi — tantangan terbesar!",
    warna: "from-purple-400 to-purple-600",
    bgLight: "bg-purple-50",
    border: "border-purple-200",
    soal: "20 soal",
    badge: "⚡ Tantangan",
  },
];

export default function QuizPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-indigo-500 hover:text-indigo-700 text-2xl">←</Link>
          <div>
            <h1 className="text-xl font-bold text-indigo-700">🧠 Quiz</h1>
            <p className="text-xs text-gray-400">Pilih kategori untuk mulai</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Pilih Kategori Kuis</h2>
          <p className="text-gray-500 text-sm">Setiap kategori punya soal yang berbeda. Selamat mencoba! 💪</p>
        </div>

        <div className="flex flex-col gap-4">
          {kategoriKuis.map((kat) => (
            <Link key={kat.href} href={kat.href}>
              <div className={`rounded-2xl border ${kat.border} ${kat.bgLight} p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer relative`}>
                {kat.badge && (
                  <span className="absolute top-3 right-3 bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {kat.badge}
                  </span>
                )}
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${kat.warna} flex items-center justify-center text-3xl shadow-md flex-shrink-0`}>
                    {kat.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">{kat.judul}</h3>
                    <p className="text-gray-500 text-sm">{kat.deskripsi}</p>
                    <span className="text-xs bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full mt-1 inline-block">
                      {kat.soal}
                    </span>
                  </div>
                  <span className="text-gray-400 text-2xl">›</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
