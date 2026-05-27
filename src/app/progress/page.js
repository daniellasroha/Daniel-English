// Halaman Progress — tracking kemajuan belajar real dari localStorage
"use client";

import { useState } from "react";
import Link from "next/link";
import { useUsername } from "@/hooks/useUsername";
import { useProgress, hitungStreak, hitungRataQuiz } from "@/hooks/useProgress";

// Format tanggal ke bahasa Indonesia
function formatTanggal(str) {
  const tgl = new Date(str);
  return tgl.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
}

// Label nilai huruf
function nilaiHuruf(persen) {
  if (persen >= 90) return { huruf: "A", warna: "text-green-600" };
  if (persen >= 75) return { huruf: "B", warna: "text-blue-600" };
  if (persen >= 60) return { huruf: "C", warna: "text-yellow-600" };
  if (persen >= 50) return { huruf: "D", warna: "text-orange-500" };
  return { huruf: "E", warna: "text-red-500" };
}

// 7 hari terakhir untuk kalender streak
function tujuhHariTerakhir() {
  const hari = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      label: hari[d.getDay()],
      date: d.toISOString().split("T")[0],
    };
  });
}

export default function ProgressPage() {
  const [tabAktif, setTabAktif] = useState("ringkasan");
  const [editNama, setEditNama] = useState(false);
  const [inputNama, setInputNama] = useState("");

  const { username, saveUsername } = useUsername();
  const { data } = useProgress();

  // Hitung statistik real
  const streak = data ? hitungStreak(data.sessions) : 0;
  const rataQuiz = data ? hitungRataQuiz(data.quiz) : 0;
  const totalVocab = data ? data.vocabSeen.length : 0;
  const totalGrammar = data ? data.grammarSeen.length : 0;
  const totalSesi = data ? data.sessions.length : 0;
  const totalListening = data ? (data.listeningPlayed || 0) : 0;

  // Quiz per kategori
  const quizVocab = data ? data.quiz.filter(q => q.category === "vocabulary") : [];
  const quizGrammar = data ? data.quiz.filter(q => q.category === "grammar") : [];
  const quizMixed = data ? data.quiz.filter(q => q.category === "mixed") : [];

  const avgVocabQuiz = hitungRataQuiz(quizVocab);
  const avgGrammarQuiz = hitungRataQuiz(quizGrammar);
  const avgMixedQuiz = hitungRataQuiz(quizMixed);

  // Progress per fitur (0–100)
  const progVocab = Math.min(Math.round((totalVocab / 64) * 100), 100);
  const progGrammar = Math.min(Math.round((totalGrammar / 8) * 100), 100);
  const progQuiz = Math.min(rataQuiz, 100);
  const progListening = Math.min(totalListening * 5, 100); // setiap 1 play = 5%

  // Riwayat quiz untuk tab aktivitas
  const riwayatQuiz = data
    ? [...data.quiz].reverse().slice(0, 10)
    : [];

  // Kalender 7 hari
  const kalender = tujuhHariTerakhir();

  function handleSaveNama(e) {
    e.preventDefault();
    if (inputNama.trim()) {
      saveUsername(inputNama.trim());
      setEditNama(false);
      setInputNama("");
    }
  }

  const statistik = [
    { label: "Hari Belajar", nilai: totalSesi.toString(), ikon: "🔥", warna: "text-orange-600", bg: "bg-orange-50" },
    { label: "Quiz Dilakukan", nilai: (data?.quiz.length || 0).toString(), ikon: "🧠", warna: "text-purple-600", bg: "bg-purple-50" },
    { label: "Rata-rata Quiz", nilai: rataQuiz ? `${rataQuiz}%` : "—", ikon: "⭐", warna: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Kata Dipelajari", nilai: totalVocab.toString(), ikon: "💬", warna: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-indigo-500 hover:text-indigo-700 text-2xl">←</Link>
          <div>
            <h1 className="text-xl font-bold text-pink-700">📊 Progress Belajar</h1>
            <p className="text-xs text-gray-400">Data real dari aktivitas kamu</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Kartu sambutan */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-6 mb-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-4xl">
              👤
            </div>
            <div className="flex-1">
              {editNama ? (
                <form onSubmit={handleSaveNama} className="flex gap-2 items-center">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Nama baru kamu..."
                    value={inputNama}
                    onChange={(e) => setInputNama(e.target.value)}
                    maxLength={30}
                    className="flex-1 px-3 py-1.5 rounded-lg text-gray-800 text-sm font-semibold focus:outline-none"
                  />
                  <button type="submit" className="bg-white text-pink-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-pink-50 transition">
                    Simpan
                  </button>
                  <button type="button" onClick={() => setEditNama(false)} className="text-pink-200 text-xs hover:text-white transition">
                    Batal
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">Halo, {username || "Pelajar"}! 👋</h2>
                  <button
                    onClick={() => { setEditNama(true); setInputNama(username); }}
                    title="Ganti nama"
                    className="text-pink-200 hover:text-white text-sm transition"
                  >
                    ✏️
                  </button>
                </div>
              )}
              <p className="text-pink-100 text-sm">
                {streak > 0
                  ? `Kamu sudah belajar ${streak} hari berturut-turut. Luar biasa!`
                  : totalSesi > 0
                  ? `Total ${totalSesi} hari belajar. Terus semangat!`
                  : "Mulai belajar untuk melihat progressmu di sini!"}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-yellow-300 text-lg">🔥</span>
                <span className="font-bold">Streak: {streak} Hari</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab navigasi */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm border border-pink-100">
          {["ringkasan", "aktivitas", "target"].map((tab) => (
            <button
              key={tab}
              onClick={() => setTabAktif(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition ${
                tabAktif === tab
                  ? "bg-pink-500 text-white shadow"
                  : "text-gray-500 hover:bg-pink-50"
              }`}
            >
              {tab === "ringkasan" ? "📈 Ringkasan" : tab === "aktivitas" ? "📋 Aktivitas" : "🎯 Target"}
            </button>
          ))}
        </div>

        {/* TAB: Ringkasan */}
        {tabAktif === "ringkasan" && (
          <div>
            {/* Grid statistik */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {statistik.map((stat, i) => (
                <div key={i} className={`${stat.bg} rounded-2xl p-4 border border-gray-100 shadow-sm`}>
                  <div className="text-3xl mb-2">{stat.ikon}</div>
                  <div className={`text-2xl font-extrabold ${stat.warna}`}>{stat.nilai}</div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Progress per fitur */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100 mb-4">
              <h3 className="font-bold text-gray-700 mb-4">📚 Progress per Fitur</h3>
              {[
                { nama: "Vocabulary", persen: progVocab, sub: `${totalVocab}/64 kata`, warna: "bg-blue-500" },
                { nama: "Grammar", persen: progGrammar, sub: `${totalGrammar}/8 topik`, warna: "bg-green-500" },
                { nama: "Quiz", persen: progQuiz, sub: rataQuiz ? `Rata-rata ${rataQuiz}%` : "Belum ada quiz", warna: "bg-purple-500" },
                { nama: "Listening", persen: progListening, sub: `${totalListening}x diputar`, warna: "bg-orange-500" },
              ].map((fitur, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{fitur.nama}</span>
                    <span className="text-gray-400">{fitur.sub}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className={`${fitur.warna} h-3 rounded-full transition-all duration-700`}
                      style={{ width: `${fitur.persen}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Skor quiz per kategori */}
            {(quizVocab.length > 0 || quizGrammar.length > 0 || quizMixed.length > 0) && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
                <h3 className="font-bold text-gray-700 mb-4">🧠 Skor Quiz per Kategori</h3>
                {[
                  { nama: "Vocabulary", avg: avgVocabQuiz, count: quizVocab.length, warna: "text-blue-600" },
                  { nama: "Grammar", avg: avgGrammarQuiz, count: quizGrammar.length, warna: "text-green-600" },
                  { nama: "Mixed", avg: avgMixedQuiz, count: quizMixed.length, warna: "text-purple-600" },
                ]
                  .filter(k => k.count > 0)
                  .map((k, i) => {
                    const nv = nilaiHuruf(k.avg);
                    return (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="font-medium text-gray-700">{k.nama}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400">{k.count}x dimainkan</span>
                          <span className={`font-bold text-lg ${nv.warna}`}>{nv.huruf}</span>
                          <span className={`font-semibold ${k.warna}`}>{k.avg}%</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Belum ada data */}
            {totalSesi === 0 && (
              <div className="text-center py-10 text-gray-400">
                <p className="text-4xl mb-3">📭</p>
                <p>Belum ada data progress. Mulai belajar dulu yuk!</p>
              </div>
            )}
          </div>
        )}

        {/* TAB: Aktivitas */}
        {tabAktif === "aktivitas" && (
          <div>
            {riwayatQuiz.length > 0 ? (
              <div className="flex flex-col gap-3">
                {riwayatQuiz.map((item, i) => {
                  const persen = Math.round((item.score / item.total) * 100);
                  const nv = nilaiHuruf(persen);
                  const ikoMap = { vocabulary: "📚", grammar: "✏️", mixed: "🎯" };
                  return (
                    <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100 flex items-center gap-4">
                      <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-2xl">
                        {ikoMap[item.category] || "🧠"}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 capitalize">Quiz {item.category}</p>
                        <p className="text-gray-400 text-xs">{formatTanggal(item.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-extrabold text-lg ${nv.warna}`}>{nv.huruf}</p>
                        <p className="font-bold text-pink-600">{item.score}/{item.total}</p>
                        <p className="text-xs text-gray-400">{persen}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <p className="text-5xl mb-3">📋</p>
                <p>Belum ada riwayat quiz. Coba Quiz dulu!</p>
              </div>
            )}
          </div>
        )}

        {/* TAB: Target */}
        {tabAktif === "target" && (
          <div>
            {/* Kalender 7 hari terakhir */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100 mb-5">
              <h3 className="font-bold text-gray-700 mb-2">📅 7 Hari Terakhir</h3>
              <p className="text-sm text-gray-400 mb-4">Hari-hari kamu aktif belajar</p>
              <div className="flex justify-between gap-1">
                {kalender.map((hari, i) => {
                  const aktif = data?.sessions.includes(hari.date);
                  return (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                        aktif ? "bg-green-500 text-white shadow" : "bg-gray-100 text-gray-300"
                      }`}>
                        {aktif ? "✓" : "○"}
                      </div>
                      <span className="text-xs text-gray-500">{hari.label}</span>
                    </div>
                  );
                })}
              </div>
              {streak > 0 && (
                <p className="text-sm text-green-600 font-semibold mt-4">
                  🔥 Streak {streak} hari — pertahankan terus!
                </p>
              )}
            </div>

            {/* Target belajar */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
              <h3 className="font-bold text-gray-700 mb-4">🎯 Target Belajar</h3>
              {[
                { label: "Pelajari 64 kosakata", selesai: totalVocab, total: 64 },
                { label: "Buka semua topik Grammar (8)", selesai: totalGrammar, total: 8 },
                { label: "Capai rata-rata Quiz 80%", selesai: rataQuiz, total: 80 },
                { label: "Belajar 30 hari total", selesai: totalSesi, total: 30 },
              ].map((target, i) => {
                const persen = Math.min((target.selesai / target.total) * 100, 100);
                const selesai = persen >= 100;
                return (
                  <div key={i} className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className={`${selesai ? "text-green-600 font-semibold" : "text-gray-700"}`}>
                        {selesai ? "✅ " : ""}{target.label}
                      </span>
                      <span className={`font-bold ${selesai ? "text-green-500" : "text-pink-500"}`}>
                        {target.selesai}/{target.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-700 ${selesai ? "bg-green-400" : "bg-pink-400"}`}
                        style={{ width: `${persen}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
