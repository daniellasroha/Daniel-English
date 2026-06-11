// Halaman Progress — tracking kemajuan belajar real dari localStorage
"use client";

import { useState } from "react";
import Link from "next/link";
import { useUsername } from "@/hooks/useUsername";
import { useProgress, hitungStreak, hitungRataQuiz } from "@/hooks/useProgress";
import { useLearning } from "@/hooks/useLearning";
import { useBadges } from "@/hooks/useBadges";
import { learningPathIndex as unitBelajar } from "@/data/learningPathIndex";

function formatTanggal(str) {
  const tgl = new Date(str);
  return tgl.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
}

function nilaiHuruf(persen) {
  if (persen >= 90) return { huruf: "A", color: "#059669" };
  if (persen >= 75) return { huruf: "B", color: "#1D4ED8" };
  if (persen >= 60) return { huruf: "C", color: "#D97706" };
  if (persen >= 50) return { huruf: "D", color: "#D97706" };
  return                    { huruf: "E", color: "#DC2626" };
}

function tujuhHariTerakhir() {
  const hari = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { label: hari[d.getDay()], date: d.toISOString().split("T")[0] };
  });
}

export default function ProgressPage() {
  const [tabAktif, setTabAktif] = useState("ringkasan");
  const [editNama, setEditNama] = useState(false);
  const [inputNama, setInputNama] = useState("");

  const { username, saveUsername } = useUsername();
  const { data } = useProgress();
  const { completedLessons } = useLearning();

  const streak = data ? hitungStreak(data.sessions) : 0;
  const rataQuiz = data ? hitungRataQuiz(data.quiz) : 0;
  const totalVocab = data ? data.vocabSeen.length : 0;
  const totalGrammar = data ? data.grammarSeen.length : 0;
  const totalSesi = data ? data.sessions.length : 0;
  const totalListening = data ? (data.listeningPlayed || 0) : 0;

  const quizVocab   = data ? data.quiz.filter((q) => q.category === "vocabulary") : [];
  const quizGrammar = data ? data.quiz.filter((q) => q.category === "grammar")    : [];
  const quizMixed   = data ? data.quiz.filter((q) => q.category === "mixed")      : [];

  const avgVocabQuiz   = hitungRataQuiz(quizVocab);
  const avgGrammarQuiz = hitungRataQuiz(quizGrammar);
  const avgMixedQuiz   = hitungRataQuiz(quizMixed);

  const progVocab     = Math.min(Math.round((totalVocab   / 64) * 100), 100);
  const progGrammar   = Math.min(Math.round((totalGrammar / 8)  * 100), 100);
  const progQuiz      = Math.min(rataQuiz, 100);
  const progListening = Math.min(totalListening * 5, 100);

  const riwayatQuiz = data ? [...data.quiz].reverse().slice(0, 10) : [];
  const kalender    = tujuhHariTerakhir();

  const badges     = useBadges({ completedLessons, streak, progressData: data, unitBelajar });
  const earnedCount = badges.filter((b) => b.earned).length;

  function handleSaveNama(e) {
    e.preventDefault();
    if (inputNama.trim()) { saveUsername(inputNama.trim()); setEditNama(false); setInputNama(""); }
  }

  const statistik = [
    { label: "Hari Belajar",  nilai: totalSesi.toString(),                  ikon: "🔥", accent: "#D97706", iconBg: "#FEF3C7" },
    { label: "Quiz Dilakukan",nilai: (data?.quiz.length || 0).toString(),   ikon: "🧠", accent: "#7C3AED", iconBg: "#EDE9FE" },
    { label: "Rata-rata Quiz",nilai: rataQuiz ? `${rataQuiz}%` : "—",       ikon: "⭐", accent: "#C9933A", iconBg: "#FDF3E3" },
    { label: "Kata Dipelajari",nilai: totalVocab.toString(),                ikon: "💬", accent: "#059669", iconBg: "#D1FAE5" },
  ];

  const tabs = [
    { key: "ringkasan", label: "📈 Ringkasan" },
    { key: "badge",     label: "🏅 Badge" },
    { key: "aktivitas", label: "📋 Aktivitas" },
    { key: "target",    label: "🎯 Target" },
  ];

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      {/* Header */}
      <header className="sticky top-0 z-10" style={{ backgroundColor: "var(--bg-paper)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center gap-4">
          <Link href="/" aria-label="Kembali" className="text-2xl transition-opacity hover:opacity-70" style={{ color: "var(--brand)" }}>←</Link>
          <div>
            <h1 className="font-serif text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
              📊 Progress Belajar
            </h1>
            <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
              Data real dari aktivitas kamu
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-8">
        {/* Kartu sambutan */}
        <div
          className="rounded-2xl p-6 mb-6 text-white shadow-lg relative overflow-hidden"
          style={{ backgroundColor: "var(--brand)" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
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
                    className="flex-1 px-3 py-1.5 rounded-lg font-sans text-sm font-semibold focus:outline-none"
                    style={{ color: "var(--text-primary)", backgroundColor: "var(--bg-paper)" }}
                  />
                  <button type="submit" className="font-sans text-xs font-bold px-3 py-1.5 rounded-lg transition"
                    style={{ backgroundColor: "var(--bg-paper)", color: "var(--brand)" }}>
                    Simpan
                  </button>
                  <button type="button" onClick={() => setEditNama(false)} className="font-sans text-xs opacity-70 hover:opacity-100 transition text-white">
                    Batal
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-xl font-semibold">Halo, {username || "Pelajar"}! 👋</h2>
                  <button onClick={() => { setEditNama(true); setInputNama(username); }} className="opacity-70 hover:opacity-100 transition text-sm">✏️</button>
                </div>
              )}
              <p className="font-sans text-sm mt-0.5 opacity-90">
                {streak > 0
                  ? `Kamu sudah belajar ${streak} hari berturut-turut. Luar biasa!`
                  : totalSesi > 0
                  ? `Total ${totalSesi} hari belajar. Terus semangat!`
                  : "Mulai belajar untuk melihat progressmu di sini!"}
              </p>
              <div className="flex items-center gap-1 mt-1 font-sans font-bold text-sm">
                <span>🔥</span>
                <span>Streak: {streak} Hari</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab navigasi */}
        <div
          className="flex gap-1 mb-6 rounded-xl p-1"
          style={{ backgroundColor: "var(--bg-paper)", border: "1px solid var(--border)" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTabAktif(tab.key)}
              className="flex-1 py-2 rounded-lg font-sans text-xs font-semibold capitalize transition"
              style={
                tabAktif === tab.key
                  ? { backgroundColor: "var(--brand)", color: "var(--text-inverse)" }
                  : { color: "var(--text-muted)" }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── TAB: Ringkasan ──────────────────────────────────────────────────── */}
        {tabAktif === "ringkasan" && (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {statistik.map((stat, i) => (
                <div
                  key={i}
                  className="card-de p-4"
                >
                  <div className="text-3xl mb-2">{stat.ikon}</div>
                  <div className="font-serif text-2xl font-semibold" style={{ color: stat.accent }}>{stat.nilai}</div>
                  <div className="font-sans text-sm" style={{ color: "var(--text-muted)" }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Progress per fitur */}
            <div className="card-de p-5 mb-4">
              <h3 className="font-serif font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                📚 Progress per Fitur
              </h3>
              {[
                { nama: "Vocabulary", persen: progVocab,     sub: `${totalVocab}/64 kata`,                     accent: "#1D4ED8" },
                { nama: "Grammar",    persen: progGrammar,   sub: `${totalGrammar}/8 topik`,                   accent: "#059669" },
                { nama: "Quiz",       persen: progQuiz,      sub: rataQuiz ? `Rata-rata ${rataQuiz}%` : "Belum ada quiz", accent: "#7C3AED" },
                { nama: "Listening",  persen: progListening, sub: `${totalListening}x diputar`,                accent: "#D97706" },
              ].map((fitur, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between font-sans text-sm mb-1">
                    <span className="font-medium" style={{ color: "var(--text-primary)" }}>{fitur.nama}</span>
                    <span style={{ color: "var(--text-muted)" }}>{fitur.sub}</span>
                  </div>
                  <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-subtle)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${fitur.persen}%`, backgroundColor: fitur.accent }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Skor quiz per kategori */}
            {(quizVocab.length > 0 || quizGrammar.length > 0 || quizMixed.length > 0) && (
              <div className="card-de p-5">
                <h3 className="font-serif font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                  🧠 Skor Quiz per Kategori
                </h3>
                {[
                  { nama: "Vocabulary", avg: avgVocabQuiz,   count: quizVocab.length,   accent: "#1D4ED8" },
                  { nama: "Grammar",    avg: avgGrammarQuiz, count: quizGrammar.length, accent: "#059669" },
                  { nama: "Mixed",      avg: avgMixedQuiz,   count: quizMixed.length,   accent: "#7C3AED" },
                ]
                  .filter((k) => k.count > 0)
                  .map((k, i) => {
                    const nv = nilaiHuruf(k.avg);
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2"
                        style={{ borderBottom: "1px solid var(--border)" }}
                      >
                        <span className="font-sans font-medium" style={{ color: "var(--text-primary)" }}>{k.nama}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>{k.count}x dimainkan</span>
                          <span className="font-serif font-bold text-lg" style={{ color: nv.color }}>{nv.huruf}</span>
                          <span className="font-sans font-semibold" style={{ color: k.accent }}>{k.avg}%</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {totalSesi === 0 && (
              <div className="text-center py-10" style={{ color: "var(--text-muted)" }}>
                <p className="text-4xl mb-3">📭</p>
                <p className="font-sans">Belum ada data progress. Mulai belajar dulu yuk!</p>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB: Badge ──────────────────────────────────────────────────────── */}
        {tabAktif === "badge" && (
          <div>
            <div
              className="rounded-2xl p-5 mb-5 text-white shadow-lg"
              style={{ backgroundColor: "var(--gold)" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-4xl">🏅</span>
                <div>
                  <p className="font-serif font-semibold text-xl">{earnedCount} / {badges.length} Badge</p>
                  <p className="font-sans text-sm opacity-90">Terus belajar untuk membuka semua badge!</p>
                </div>
              </div>
              <div className="mt-3 w-full rounded-full h-3 overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.3)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700 bg-white"
                  style={{ width: `${Math.round((earnedCount / badges.length) * 100)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="rounded-2xl p-4 transition-all"
                  style={
                    badge.earned
                      ? { backgroundColor: "var(--bg-paper)", border: `2px solid ${badge.accent || "var(--brand)"}`, boxShadow: "var(--shadow-card)" }
                      : { backgroundColor: "var(--bg-subtle)", border: "2px solid var(--border)", opacity: 0.5, filter: "grayscale(1)" }
                  }
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{badge.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-sans font-bold text-sm truncate"
                        style={{ color: badge.earned ? (badge.accent || "var(--brand)") : "var(--text-muted)" }}
                      >
                        {badge.judul}
                      </p>
                      <p className="font-sans text-xs mt-0.5 leading-tight" style={{ color: "var(--text-muted)" }}>
                        {badge.deskripsi}
                      </p>
                    </div>
                  </div>
                  {badge.earned && (
                    <div className="mt-2 font-sans text-xs font-semibold flex items-center gap-1" style={{ color: badge.accent || "var(--brand)" }}>
                      <span>✓</span> Diraih!
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB: Aktivitas ──────────────────────────────────────────────────── */}
        {tabAktif === "aktivitas" && (
          <div>
            {riwayatQuiz.length > 0 ? (
              <div className="flex flex-col gap-3">
                {riwayatQuiz.map((item, i) => {
                  const persen = Math.round((item.score / item.total) * 100);
                  const nv = nilaiHuruf(persen);
                  const ikoMap = { vocabulary: "📚", grammar: "✏️", mixed: "🎯" };
                  return (
                    <div key={i} className="card-de p-4 flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ backgroundColor: "var(--bg-subtle)" }}
                      >
                        {ikoMap[item.category] || "🧠"}
                      </div>
                      <div className="flex-1">
                        <p className="font-sans font-bold capitalize" style={{ color: "var(--text-primary)" }}>
                          Quiz {item.category}
                        </p>
                        <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
                          {formatTanggal(item.date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-serif font-bold text-lg" style={{ color: nv.color }}>{nv.huruf}</p>
                        <p className="font-sans font-bold text-sm" style={{ color: "var(--brand)" }}>
                          {item.score}/{item.total}
                        </p>
                        <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>{persen}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>
                <p className="text-5xl mb-3">📋</p>
                <p className="font-sans">Belum ada riwayat quiz. Coba Quiz dulu!</p>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB: Target ─────────────────────────────────────────────────────── */}
        {tabAktif === "target" && (
          <div>
            {/* Kalender 7 hari */}
            <div className="card-de p-5 mb-5">
              <h3 className="font-serif font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                📅 7 Hari Terakhir
              </h3>
              <p className="font-sans text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                Hari-hari kamu aktif belajar
              </p>
              <div className="flex justify-between gap-1">
                {kalender.map((hari, i) => {
                  const aktif = data?.sessions.includes(hari.date);
                  return (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold font-sans"
                        style={
                          aktif
                            ? { backgroundColor: "var(--brand)", color: "var(--text-inverse)" }
                            : { backgroundColor: "var(--bg-subtle)", color: "var(--border-strong)" }
                        }
                      >
                        {aktif ? "✓" : "○"}
                      </div>
                      <span className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>{hari.label}</span>
                    </div>
                  );
                })}
              </div>
              {streak > 0 && (
                <p className="font-sans text-sm font-semibold mt-4" style={{ color: "var(--brand)" }}>
                  🔥 Streak {streak} hari — pertahankan terus!
                </p>
              )}
            </div>

            {/* Target belajar */}
            <div className="card-de p-5">
              <h3 className="font-serif font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                🎯 Target Belajar
              </h3>
              {[
                { label: "Pelajari 64 kosakata",        selesai: totalVocab,   total: 64 },
                { label: "Buka semua topik Grammar (8)", selesai: totalGrammar, total: 8  },
                { label: "Capai rata-rata Quiz 80%",     selesai: rataQuiz,     total: 80 },
                { label: "Belajar 30 hari total",        selesai: totalSesi,    total: 30 },
              ].map((target, i) => {
                const persen  = Math.min((target.selesai / target.total) * 100, 100);
                const selesai = persen >= 100;
                return (
                  <div key={i} className="mb-4">
                    <div className="flex justify-between font-sans text-sm mb-1">
                      <span style={{ color: selesai ? "#059669" : "var(--text-primary)", fontWeight: selesai ? 600 : 400 }}>
                        {selesai ? "✅ " : ""}{target.label}
                      </span>
                      <span className="font-bold" style={{ color: selesai ? "#059669" : "var(--brand)" }}>
                        {target.selesai}/{target.total}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-subtle)" }}>
                      <div
                        className="h-2 rounded-full transition-all duration-700"
                        style={{ width: `${persen}%`, backgroundColor: selesai ? "#059669" : "var(--brand)" }}
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
