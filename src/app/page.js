// Halaman utama — navigasi kategori → sub-item
"use client";

import { useState } from "react";
import Link from "next/link";
import { useUsername } from "@/hooks/useUsername";
import { useLevel } from "@/hooks/useLevel";
import { useSRS } from "@/hooks/useSRS";
import { useProgress, hitungStreak, hitungRataQuiz } from "@/hooks/useProgress";
import { useLearning } from "@/hooks/useLearning";
import { learningPathIndex as learningPath } from "@/data/learningPathIndex";
import UsernameModal from "@/components/UsernameModal";
import LevelModal from "@/components/LevelModal";
import DarkModeToggle from "@/components/DarkModeToggle";

const kategori = [
  {
    id: "belajar",
    emoji: "📚",
    title: "Belajar",
    deskripsi: "Pelajari kosakata, grammar, dan percakapan",
    accentColor: "#2D5A3D",
    iconBg: "#E8F0EB",
    items: [
      {
        href: "/belajar",
        emoji: "🗺️",
        title: "Belajar Terstruktur",
        description: "Alur belajar bertahap seperti Busuu — dari salam pertama hingga percakapan sehari-hari",
        accentColor: "#2D5A3D",
        iconBg: "#E8F0EB",
        badge: "✨ Baru",
      },
      {
        href: "/vocabulary",
        emoji: "📖",
        title: "Vocabulary",
        description: "Belajar kosakata baru dengan gambar dan contoh kalimat",
        accentColor: "#1D4ED8",
        iconBg: "#DBEAFE",
      },
      {
        href: "/grammar",
        emoji: "✏️",
        title: "Grammar",
        description: "Pelajari tata bahasa Inggris dengan penjelasan mudah",
        accentColor: "#059669",
        iconBg: "#D1FAE5",
      },
      {
        href: "/listening",
        emoji: "🎧",
        title: "Listening",
        description: "Latih kemampuan mendengar bahasa Inggris",
        accentColor: "#D97706",
        iconBg: "#FEF3C7",
      },
      {
        href: "/reading",
        emoji: "📰",
        title: "Reading",
        description: "Baca teks bahasa Inggris dan jawab soal pemahaman",
        accentColor: "#0369A1",
        iconBg: "#E0F2FE",
      },
      {
        href: "/speaking",
        emoji: "🎤",
        title: "Speaking",
        description: "Ucapkan kata bahasa Inggris — pengucapanmu dinilai langsung",
        accentColor: "#DC2626",
        iconBg: "#FEE2E2",
        badge: "✨ Baru",
      },
      {
        href: "/phrasebook",
        emoji: "💬",
        title: "Phrasebook",
        description: "Kalimat percakapan sehari-hari siap pakai dengan audio",
        accentColor: "#0369A1",
        iconBg: "#E0F2FE",
      },
    ],
  },
  {
    id: "latihan",
    emoji: "🎯",
    title: "Latihan",
    deskripsi: "Uji dan asah kemampuanmu dengan berbagai soal",
    accentColor: "#7C3AED",
    iconBg: "#EDE9FE",
    items: [
      {
        href: "/quiz",
        emoji: "🧠",
        title: "Quiz",
        description: "Uji kemampuanmu dengan soal-soal interaktif",
        accentColor: "#7C3AED",
        iconBg: "#EDE9FE",
      },
      {
        href: "/daily",
        emoji: "⚡",
        title: "Daily Challenge",
        description: "1 soal spesial setiap hari — bangun streak kamu!",
        accentColor: "#C9933A",
        iconBg: "#FDF3E3",
        badge: "🔥 Harian",
      },
      {
        href: "/review",
        emoji: "🔄",
        title: "Review Harian",
        description: "Ulangi kata-kata yang sudah dipelajari sebelum terlupakan",
        accentColor: "#2D5A3D",
        iconBg: "#E8F0EB",
      },
    ],
  },
  {
    id: "progress",
    emoji: "🏆",
    title: "Progress & Ranking",
    deskripsi: "Pantau kemajuan belajar dan bandingkan dengan pelajar lain",
    accentColor: "#BE185D",
    iconBg: "#FCE7F3",
    items: [
      {
        href: "/progress",
        emoji: "📊",
        title: "Progress",
        description: "Lihat perkembangan belajarmu dari waktu ke waktu",
        accentColor: "#BE185D",
        iconBg: "#FCE7F3",
      },
      {
        href: "/leaderboard",
        emoji: "🏆",
        title: "Leaderboard",
        description: "Lihat ranking kamu dibanding semua pelajar lainnya",
        accentColor: "#C9933A",
        iconBg: "#FDF3E3",
        badge: "🔥 Baru",
      },
    ],
  },
];

function getLevelPillStyle(level) {
  const map = {
    a1: { background: "var(--a1-light)", color: "var(--a1)" },
    a2: { background: "var(--a2-light)", color: "var(--a2)" },
    b1: { background: "var(--b1-light)", color: "var(--b1)" },
  };
  return map[level] ?? { background: "var(--bg-subtle)", color: "var(--text-muted)" };
}

export default function Home() {
  const { username, saveUsername, loaded: loadedUser } = useUsername();
  const { level, setLevel, config, loaded: loadedLevel } = useLevel();
  const { dueCount } = useSRS();
  const [gantiLevel, setGantiLevel] = useState(false);
  const [aktif, setAktif] = useState(null); // null = tampilkan 3 kartu kategori

  const showNameModal  = loadedUser && !username;
  const showLevelModal = loadedUser && loadedLevel && username && !level;

  const kat = aktif ? kategori.find((k) => k.id === aktif) : null;

  // ─── Statistik untuk hero dashboard ─────────────────────────────────────────
  const { data } = useProgress();
  const { isLessonUnlocked, getUnitProgress, loaded: loadedLearn } = useLearning();

  const streak     = data ? hitungStreak(data.sessions) : 0;
  const totalVocab = data ? data.vocabSeen.length : 0;
  const rataQuiz   = data ? hitungRataQuiz(data.quiz) : 0;
  const totalSesi  = data ? data.sessions.length : 0;

  // Unit sesuai level user (sama dengan filter di halaman Belajar)
  const userLevel  = level || "a1";
  const unitsTampil =
    userLevel === "a1"
      ? learningPath.filter((u) => u.level === "a1")
      : userLevel === "a2"
      ? learningPath.filter((u) => u.level === "a1" || u.level === "a2")
      : learningPath;

  const { lessonsDone, lessonsAll } = loadedLearn
    ? unitsTampil.reduce(
        (acc, u) => {
          const p = getUnitProgress(u.id);
          return { lessonsDone: acc.lessonsDone + p.done, lessonsAll: acc.lessonsAll + p.total };
        },
        { lessonsDone: 0, lessonsAll: 0 }
      )
    : { lessonsDone: 0, lessonsAll: 0 };

  // Unit yang sedang dikerjakan — untuk tombol "Lanjutkan Belajar"
  const unitLanjut = loadedLearn
    ? unitsTampil.find((u) => {
        const p = getUnitProgress(u.id);
        return isLessonUnlocked(u.id, 0) && p.done < p.total;
      })
    : null;

  // Progress mini per kartu kategori
  const progKategori = {
    belajar: {
      persen: lessonsAll > 0 ? Math.round((lessonsDone / lessonsAll) * 100) : 0,
      label: `${lessonsDone}/${lessonsAll} pelajaran`,
    },
    latihan: {
      persen: rataQuiz,
      label: rataQuiz ? `rata-rata quiz ${rataQuiz}%` : "belum ada quiz",
    },
    progress: {
      persen: Math.min(Math.round((totalSesi / 30) * 100), 100),
      label: `${totalSesi} hari belajar`,
    },
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>

      {showNameModal && <UsernameModal onSave={saveUsername} />}
      {(showLevelModal || gantiLevel) && (
        <LevelModal
          onSave={(lvl) => { setLevel(lvl); setGantiLevel(false); }}
          bolehTutup={gantiLevel}
          onTutup={() => setGantiLevel(false)}
        />
      )}

      {/* ─── Header ────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-10"
        style={{ backgroundColor: "var(--bg-paper)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Tombol kembali ke kategori */}
            {aktif && (
              <button
                onClick={() => setAktif(null)}
                className="text-2xl transition-opacity hover:opacity-70 mr-1"
                style={{ color: "var(--brand)" }}
              >
                ←
              </button>
            )}
            <span className="text-2xl select-none">🇬🇧</span>
            <div>
              <h1 className="font-serif text-xl font-semibold leading-tight" style={{ color: "var(--brand)" }}>
                Daniel English
              </h1>
              <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
                {kat ? kat.title : "Belajar bahasa Inggris mudah & menyenangkan"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setGantiLevel(true)}
              className="level-pill"
              style={level ? getLevelPillStyle(level) : { background: "var(--bg-subtle)", color: "var(--text-muted)" }}
              title="Klik untuk ganti level"
            >
              {config ? `${config.emoji} ${config.label}` : "Pilih Level"}
            </button>
            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* ─── Hero dashboard ────────────────────────────────────────────────── */}
      {!aktif && (
        <section className="max-w-4xl mx-auto px-5 pt-10 pb-6">
          {/* Sapaan + streak */}
          <div className="fade-up flex items-center justify-between gap-3 flex-wrap mb-5">
            <div>
              <h2
                className="font-serif text-3xl sm:text-4xl font-semibold leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {username ? <>Halo, <em>{username}</em>! 👋</> : "Halo, Selamat Datang! 👋"}
              </h2>
              {config && (
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-sans text-xs font-semibold mt-2"
                  style={getLevelPillStyle(level)}
                >
                  {config.emoji} Level {config.label} — {config.deskripsi.split(",")[0]}
                </div>
              )}
            </div>
            {/* Streak pill */}
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full font-sans text-sm font-bold"
              style={{ backgroundColor: "var(--gold-light)", color: "var(--gold)", border: "1px solid var(--border)" }}
              title="Hari belajar berturut-turut"
            >
              🔥 {streak} hari
            </div>
          </div>

          {/* Statistik ringkas */}
          <div className="fade-up grid grid-cols-3 gap-3 mb-5" style={{ animationDelay: "0.08s" }}>
            {[
              { nilai: totalVocab,  label: "kata dipelajari",   emoji: "📚" },
              { nilai: lessonsDone, label: "pelajaran selesai", emoji: "⭐" },
              { nilai: rataQuiz ? `${rataQuiz}%` : "—", label: "rata-rata quiz", emoji: "🧠" },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-2xl px-3 py-3.5 text-center"
                style={{ backgroundColor: "var(--bg-paper)", border: "1px solid var(--border)" }}
              >
                <p className="font-serif text-2xl font-semibold leading-none" style={{ color: "var(--brand)" }}>
                  {s.nilai}
                </p>
                <p className="font-sans text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
                  {s.emoji} {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Tombol lanjutkan belajar */}
          {unitLanjut && lessonsDone > 0 && (
            <Link href="/belajar" className="fade-up block" style={{ animationDelay: "0.16s" }}>
              <div
                className="rounded-2xl px-5 py-4 flex items-center justify-between text-white transition hover:opacity-90"
                style={{ backgroundColor: "var(--brand)", boxShadow: "var(--shadow-btn)" }}
              >
                <span className="flex items-center gap-3">
                  <span className="text-2xl">{unitLanjut.emoji}</span>
                  <span>
                    <span className="block font-sans text-xs opacity-80">Lanjutkan Belajar</span>
                    <span className="font-sans font-bold">{unitLanjut.judul}</span>
                  </span>
                </span>
                <span className="text-2xl">→</span>
              </div>
            </Link>
          )}
        </section>
      )}

      {/* ─── Tampilan: 3 Kartu Kategori ────────────────────────────────────── */}
      {!aktif && (
        <section className="max-w-4xl mx-auto px-5 pb-16">
          <div className="flex flex-col gap-4">
            {kategori.map((kat, katIdx) => {
              const prog = progKategori[kat.id] ?? { persen: 0, label: "" };
              return (
                <button
                  key={kat.id}
                  onClick={() => setAktif(kat.id)}
                  className="card-de fade-up relative overflow-hidden text-left w-full group"
                  style={{ animationDelay: `${0.24 + katIdx * 0.08}s` }}
                >
                  {/* Strip aksen kiri */}
                  <div
                    className="absolute inset-y-0 left-0 w-[3px]"
                    style={{ backgroundColor: kat.accentColor }}
                  />

                  <div className="pl-6 pr-5 py-6 flex items-center gap-5">
                    {/* Ikon besar */}
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                      style={{ backgroundColor: kat.iconBg, border: "1px solid var(--border)" }}
                    >
                      {kat.emoji}
                    </div>

                    {/* Teks */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h2 className="font-serif text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
                          {kat.title}
                        </h2>
                        <span
                          className="font-sans text-xs font-semibold px-2.5 py-0.5 rounded-full"
                          style={{ backgroundColor: kat.iconBg, color: kat.accentColor, border: `1px solid ${kat.accentColor}30` }}
                        >
                          {kat.items.length} modul
                        </span>
                      </div>
                      <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {kat.deskripsi}
                      </p>

                      {/* Progress bar mini */}
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-subtle)" }}>
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${prog.persen}%`, backgroundColor: kat.accentColor }}
                          />
                        </div>
                        <span className="font-sans text-xs flex-shrink-0" style={{ color: "var(--text-muted)" }}>
                          {prog.label}
                        </span>
                      </div>
                    </div>

                    {/* Panah */}
                    <span
                      className="text-2xl flex-shrink-0 transition-transform group-hover:translate-x-1"
                      style={{ color: kat.accentColor }}
                    >
                      →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── Tampilan: Sub-item kategori terpilih ──────────────────────────── */}
      {aktif && kat && (
        <section className="max-w-4xl mx-auto px-5 pt-6 pb-16">
          {/* Sub-header kategori */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ backgroundColor: kat.iconBg, border: "1px solid var(--border)" }}
            >
              {kat.emoji}
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
                {kat.title}
              </h2>
              <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
                {kat.items.length} modul tersedia
              </p>
            </div>
          </div>

          {/* Grid sub-item */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kat.items.map((item) => (
              <Link key={item.href} href={item.href} className="group">
                <div className="card-de relative h-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 w-[3px]"
                    style={{ backgroundColor: item.accentColor }}
                  />
                  <div className="pl-6 pr-5 py-6">
                    {/* Badge */}
                    {item.href === "/review" && dueCount > 0 ? (
                      <span
                        className="absolute top-4 right-4 font-sans text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: "#DC2626" }}
                      >
                        {dueCount} kartu
                      </span>
                    ) : item.badge ? (
                      <span className="badge-gold absolute top-4 right-4">{item.badge}</span>
                    ) : null}

                    {/* Ikon */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-4 flex-shrink-0"
                      style={{ backgroundColor: item.iconBg, border: "1px solid var(--border)" }}
                    >
                      {item.emoji}
                    </div>

                    {/* Judul */}
                    <h3
                      className="font-serif text-[1.0625rem] font-semibold mb-1.5 leading-snug"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.title}
                    </h3>

                    {/* Deskripsi */}
                    <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Tombol kembali bawah */}
          <button
            onClick={() => setAktif(null)}
            className="mt-8 font-sans text-sm font-semibold transition-opacity hover:opacity-70 flex items-center gap-1"
            style={{ color: "var(--text-muted)" }}
          >
            ← Kembali ke semua kategori
          </button>
        </section>
      )}

      {/* ─── Footer ────────────────────────────────────────────────────────── */}
      {!aktif && (
        <footer className="text-center pb-10 space-y-1.5">
          <p className="font-sans text-sm" style={{ color: "var(--text-muted)" }}>
            💪 Belajar 15 menit sehari lebih baik dari 2 jam sebulan sekali!
          </p>
          <p className="font-sans text-xs" style={{ color: "var(--border-strong)" }}>
            Made with ❤️ by{" "}
            <span className="font-semibold" style={{ color: "var(--brand)" }}>
              Daniel Lasroha
            </span>
          </p>
        </footer>
      )}
    </main>
  );
}
