// src/app/leaderboard/page.js
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { fetchLeaderboard } from "@/lib/leaderboard";
import { useUsername } from "@/hooks/useUsername";

const PERIOD_TABS = [
  { key: "harian",   label: "Harian",   emoji: "⚡", desc: "Reset tiap hari" },
  { key: "mingguan", label: "Mingguan", emoji: "📅", desc: "Reset tiap Senin" },
];

const LEVEL_TABS = [
  { key: "semua", label: "Semua", emoji: "👥" },
  { key: "a1",    label: "A1",    emoji: "🌱" },
  { key: "a2",    label: "A2",    emoji: "📗" },
  { key: "b1",    label: "B1",    emoji: "🚀" },
];

function MedalIcon({ rank }) {
  if (rank === 1) return <span className="text-2xl">🥇</span>;
  if (rank === 2) return <span className="text-2xl">🥈</span>;
  if (rank === 3) return <span className="text-2xl">🥉</span>;
  return (
    <span
      className="w-8 h-8 flex items-center justify-center rounded-full font-sans text-sm font-bold"
      style={{ backgroundColor: "var(--bg-subtle)", color: "var(--text-muted)" }}
    >
      {rank}
    </span>
  );
}

function LevelBadge({ level }) {
  if (level === "b1") return <span className="font-sans text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "#EDE9FE", color: "#7C3AED" }}>🚀 B1</span>;
  if (level === "a2") return <span className="font-sans text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "#DBEAFE", color: "#1D4ED8" }}>📗 A2</span>;
  return                     <span className="font-sans text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "#D1FAE5", color: "#065F46" }}>🌱 A1</span>;
}

function getPoin(row, period) {
  if (period === "harian")   return row.dailyPoin  ?? 0;
  if (period === "mingguan") return row.weeklyPoin ?? 0;
  return row.totalPoin ?? 0;
}

function getPoinLabel(period) {
  return period === "harian" ? "poin hari ini" : "poin minggu ini";
}

export default function LeaderboardPage() {
  const [period, setPeriod] = useState("harian");
  const [level, setLevel]   = useState("semua");
  const [rows, setRows]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const { username }        = useUsername();

  const load = useCallback(async (lvl, per) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLeaderboard(lvl, 50, per);
      setRows(data);
    } catch {
      setError("Gagal memuat data. Cek koneksi internet.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(level, period); }, [level, period, load]);

  const myRank = username ? rows.findIndex((r) => r.username.toLowerCase() === username.toLowerCase()) + 1 : 0;
  const myPoin = myRank > 0 ? getPoin(rows[myRank - 1], period) : 0;
  const activePeriod = PERIOD_TABS.find((t) => t.key === period) ?? PERIOD_TABS[0];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      {/* Header */}
      <header className="sticky top-0 z-10" style={{ backgroundColor: "var(--bg-paper)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-xl mx-auto px-5 py-4 flex items-center gap-3">
          <Link href="/" className="text-2xl transition-opacity hover:opacity-70" style={{ color: "var(--brand)" }}>←</Link>
          <div className="flex-1">
            <h1 className="font-serif text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
              🏆 Leaderboard
            </h1>
            <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
              Ranking berdasarkan poin belajar & quiz
            </p>
          </div>
          <button
            onClick={() => load(level, period)}
            className="font-sans text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: "var(--brand)" }}
          >
            ↻ Refresh
          </button>
        </div>

        {/* Tab Periode */}
        <div className="max-w-xl mx-auto px-5 pb-2 flex gap-2">
          {PERIOD_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setPeriod(t.key)}
              className="flex-1 py-2 rounded-xl font-sans text-xs font-bold transition-all"
              style={
                period === t.key
                  ? { backgroundColor: "var(--brand)", color: "var(--text-inverse)" }
                  : { backgroundColor: "var(--bg-subtle)", color: "var(--text-muted)", border: "1px solid var(--border)" }
              }
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>

        {/* Tab Level */}
        <div className="max-w-xl mx-auto px-5 pb-3 flex gap-2">
          {LEVEL_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setLevel(t.key)}
              className="flex-1 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all"
              style={
                level === t.key
                  ? { backgroundColor: "var(--text-primary)", color: "var(--bg-paper)" }
                  : { backgroundColor: "var(--bg-subtle)", color: "var(--text-muted)", border: "1px solid var(--border)" }
              }
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-xl mx-auto px-5 py-6">
        {/* Info reset */}
        <div className="card-de px-4 py-3 flex items-center gap-3 mb-4">
          <span className="text-2xl">{activePeriod?.emoji}</span>
          <div>
            <p className="font-sans text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {period === "harian" ? "Leaderboard Harian" : "Leaderboard Mingguan"}
            </p>
            <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
              {period === "harian"
                ? "Poin yang dikumpulkan HARI INI saja. Reset otomatis setiap tengah malam."
                : "Poin yang dikumpulkan MINGGU INI saja. Reset setiap Senin pagi."}
            </p>
          </div>
        </div>

        {/* Posisi kamu */}
        {username && myRank > 0 && (
          <div
            className="mb-4 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-lg text-white"
            style={{ backgroundColor: "var(--brand)" }}
          >
            <span className="text-3xl">🙋</span>
            <div>
              <p className="font-sans font-bold text-lg">{username}</p>
              <p className="font-sans text-sm opacity-90">
                Posisimu: #{myRank} · {myPoin} {getPoinLabel(period)}
              </p>
            </div>
          </div>
        )}
        {username && myRank === 0 && !loading && (
          <div
            className="mb-4 rounded-2xl px-5 py-3 text-center font-sans text-sm"
            style={{ backgroundColor: "var(--bg-paper)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
          >
            {period === "harian"
              ? "Kamu belum aktif hari ini. Selesaikan pelajaran atau quiz untuk masuk ranking!"
              : "Kamu belum aktif minggu ini. Ayo belajar sekarang!"}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>
            <div className="text-4xl mb-3 animate-bounce">⏳</div>
            <p className="font-sans">Memuat ranking...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>
            <div className="text-4xl mb-3">😕</div>
            <p className="font-sans">{error}</p>
            <button
              onClick={() => load(level, period)}
              className="btn-primary mt-4 px-6 py-2 rounded-xl font-bold"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && rows.length === 0 && (
          <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>
            <div className="text-5xl mb-3">{period === "harian" ? "⚡" : "📅"}</div>
            <p className="font-sans font-semibold" style={{ color: "var(--text-secondary)" }}>
              {period === "harian" ? "Belum ada yang aktif hari ini." : "Belum ada yang aktif minggu ini."}
            </p>
            <p className="font-sans text-sm mt-1">Jadilah yang pertama menyelesaikan pelajaran!</p>
          </div>
        )}

        {/* Daftar ranking */}
        {!loading && !error && rows.length > 0 && (
          <div className="space-y-3">
            {rows.map((row, i) => {
              const rank = i + 1;
              const isMe = username && row.username.toLowerCase() === username.toLowerCase();
              const poin = getPoin(row, period);
              return (
                <div
                  key={row.id}
                  className="rounded-2xl px-4 py-3 flex items-center gap-3 transition-all"
                  style={
                    isMe
                      ? { border: `2px solid var(--brand)`, backgroundColor: "var(--brand-light)", boxShadow: "var(--shadow-card)" }
                      : rank <= 3
                      ? { border: "2px solid var(--gold)", backgroundColor: "var(--gold-light)" }
                      : { border: "1px solid var(--border)", backgroundColor: "var(--bg-paper)" }
                  }
                >
                  <div className="w-8 flex-shrink-0 flex justify-center">
                    <MedalIcon rank={rank} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="font-sans font-bold text-base truncate"
                        style={{ color: isMe ? "var(--brand)" : "var(--text-primary)" }}
                      >
                        {row.username}
                        {isMe && <span className="ml-1 font-sans text-xs" style={{ color: "var(--brand)" }}>(kamu)</span>}
                      </span>
                      {level === "semua" && <LevelBadge level={row.level} />}
                    </div>
                    <div className="flex gap-3 mt-1">
                      <span className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>📚 {row.belajarPoin ?? 0} belajar</span>
                      <span className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>🧠 {row.quizPoin ?? 0} quiz</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-serif text-xl font-semibold" style={{ color: isMe ? "var(--brand)" : rank <= 3 ? "var(--gold)" : "var(--text-primary)" }}>
                      {poin}
                    </p>
                    <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>{getPoinLabel(period)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cara hitung poin */}
        <div className="card-de mt-8 p-5">
          <h3 className="font-serif font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            📊 Cara Hitung Poin
          </h3>
          <div className="space-y-2 font-sans text-sm" style={{ color: "var(--text-secondary)" }}>
            <div className="flex items-center gap-2">
              <span className="text-lg">📚</span>
              <span><strong style={{ color: "var(--text-primary)" }}>Belajar Terstruktur</strong> — 10 poin per pelajaran selesai</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🧠</span>
              <span><strong style={{ color: "var(--text-primary)" }}>Quiz</strong> — skor % per sesi (mis. 8/10 = 80 poin)</span>
            </div>
            <div className="mt-3 pt-3 space-y-1" style={{ borderTop: "1px solid var(--border)" }}>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}><strong>⚡ Harian</strong> — hanya poin yang dikumpulkan hari ini, reset tiap tengah malam</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}><strong>📅 Mingguan</strong> — hanya poin yang dikumpulkan minggu ini, reset tiap Senin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
