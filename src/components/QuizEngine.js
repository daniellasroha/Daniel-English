// Komponen QuizEngine — mesin kuis yang dipakai ulang untuk semua kategori
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";

export default function QuizEngine({ judul, emoji, soalList, warnaBg, warnaBtn, kategori }) {
  const { recordQuiz } = useProgress();
  const [soalAktif, setSoalAktif] = useState(0);
  const [pilihanDipilih, setPilihanDipilih] = useState(null);
  const [sudahDijawab, setSudahDijawab] = useState(false);
  const [skor, setSkor] = useState(0);
  const [selesai, setSelesai] = useState(false);
  const [riwayat, setRiwayat] = useState([]);

  const soal = soalList[soalAktif];
  const totalSoal = soalList.length;

  function pilihJawaban(index) {
    if (sudahDijawab) return;
    setPilihanDipilih(index);
    setSudahDijawab(true);
    const benar = index === soal.jawaban;
    if (benar) setSkor((s) => s + 1);
    setRiwayat((prev) => [...prev, { benar, soal: soal.pertanyaan }]);
  }

  function soalBerikutnya() {
    if (soalAktif + 1 >= totalSoal) {
      setSelesai(true);
      recordQuiz(kategori || "umum", skor + (pilihanDipilih === soal.jawaban ? 1 : 0), totalSoal);
    } else {
      setSoalAktif((s) => s + 1);
      setPilihanDipilih(null);
      setSudahDijawab(false);
    }
  }

  function ulangi() {
    setSoalAktif(0); setPilihanDipilih(null);
    setSudahDijawab(false); setSkor(0);
    setSelesai(false); setRiwayat([]);
  }

  // Halaman hasil
  if (selesai) {
    const persen = Math.round((skor / totalSoal) * 100);
    const nilaiHuruf = persen >= 90 ? "A" : persen >= 75 ? "B" : persen >= 60 ? "C" : persen >= 50 ? "D" : "E";
    const pesan = persen >= 90 ? "Luar biasa! Kamu sangat hebat! 🏆"
      : persen >= 75 ? "Bagus sekali! Terus berlatih! 🌟"
      : persen >= 60 ? "Cukup baik! Masih bisa lebih baik! 💪"
      : "Jangan menyerah! Pelajari lagi materinya! 📖";

    return (
      <main className={`min-h-screen ${warnaBg} flex flex-col`}>
        <header className="bg-white shadow-sm">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link href="/quiz" className="text-indigo-500 hover:text-indigo-700 text-2xl">←</Link>
            <h1 className="text-xl font-bold text-indigo-700">{emoji} {judul}</h1>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-4 py-10">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-3">{persen >= 75 ? "🏆" : persen >= 50 ? "⭐" : "📖"}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Kuis Selesai!</h2>
            <p className="text-gray-500 text-sm mb-5">{pesan}</p>

            <div className={`w-28 h-28 rounded-full ${warnaBtn} flex flex-col items-center justify-center mx-auto mb-4 shadow-lg`}>
              <span className="text-3xl font-extrabold text-white">{nilaiHuruf}</span>
              <span className="text-white text-sm font-semibold">{persen}%</span>
            </div>
            <p className="text-gray-500 text-sm mb-2">Benar: <strong className="text-gray-800">{skor}</strong> dari <strong className="text-gray-800">{totalSoal}</strong> soal</p>

            {/* Review jawaban */}
            <div className="text-left mb-5 max-h-40 overflow-y-auto">
              {riwayat.map((r, i) => (
                <div key={i} className={`flex items-start gap-2 text-xs py-1.5 border-b border-gray-100`}>
                  <span>{r.benar ? "✅" : "❌"}</span>
                  <span className="text-gray-600">{r.soal}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-center">
              <button onClick={ulangi} className={`${warnaBtn} text-white px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition`}>
                🔄 Ulangi
              </button>
              <Link href="/quiz">
                <button className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition">
                  ← Pilih Kuis Lain
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Halaman soal
  return (
    <main className={`min-h-screen ${warnaBg}`}>
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/quiz" className="text-indigo-500 hover:text-indigo-700 text-2xl">←</Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-indigo-700">{emoji} {judul}</h1>
            <p className="text-xs text-gray-400">Soal {soalAktif + 1} dari {totalSoal}</p>
          </div>
          <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
            ⭐ {skor} poin
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(soalAktif / totalSoal) * 100}%` }} />
        </div>

        {/* Kartu soal */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-5">
          {soal.tag && (
            <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-semibold mb-2 inline-block">{soal.tag}</span>
          )}
          <p className="text-xs font-semibold text-indigo-400 uppercase mb-2">Soal {soalAktif + 1}</p>
          <h2 className="text-lg font-bold text-gray-800 leading-relaxed">{soal.pertanyaan}</h2>
        </div>

        {/* Pilihan jawaban */}
        <div className="flex flex-col gap-3 mb-4">
          {soal.pilihan.map((pilihan, idx) => {
            let style = "border-2 border-gray-200 bg-white hover:border-indigo-400 hover:bg-indigo-50";
            if (sudahDijawab) {
              if (idx === soal.jawaban) style = "border-2 border-green-500 bg-green-50";
              else if (idx === pilihanDipilih) style = "border-2 border-red-400 bg-red-50";
              else style = "border-2 border-gray-100 bg-gray-50 opacity-50";
            }
            return (
              <button key={idx} onClick={() => pilihJawaban(idx)} disabled={sudahDijawab}
                className={`w-full text-left px-4 py-3.5 rounded-xl font-medium text-gray-700 transition-all ${style}`}>
                <span className="font-bold text-indigo-400 mr-2">{["A", "B", "C", "D"][idx]}.</span>
                {pilihan}
                {sudahDijawab && idx === soal.jawaban && <span className="float-right text-green-600 font-bold">✓</span>}
                {sudahDijawab && idx === pilihanDipilih && idx !== soal.jawaban && <span className="float-right text-red-500 font-bold">✗</span>}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {sudahDijawab && (
          <div>
            <div className={`p-4 rounded-xl mb-3 text-center font-semibold text-sm ${pilihanDipilih === soal.jawaban ? "bg-green-100 text-green-700" : "bg-red-50 text-red-600"}`}>
              {pilihanDipilih === soal.jawaban ? "🎉 Benar! Bagus sekali!" : `❌ Salah. Jawaban benar: "${soal.pilihan[soal.jawaban]}"`}
              {soal.penjelasan && <p className="text-gray-500 font-normal mt-1 text-xs">{soal.penjelasan}</p>}
            </div>
            <button onClick={soalBerikutnya}
              className={`w-full ${warnaBtn} text-white py-4 rounded-xl font-bold text-base hover:opacity-90 transition`}>
              {soalAktif + 1 >= totalSoal ? "Lihat Hasil →" : "Soal Berikutnya →"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
