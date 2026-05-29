// src/app/leaderboard/page.js
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { fetchLeaderboard } from "@/lib/leaderboard";
import { useUsername } from "@/hooks/useUsername";

const TABS = [
  { key: "semua", label: "Semua", emoji: "🌐" },
  { key: "a1",    label: "A1",    emoji: "🌱" },
  { key: "a2",    label: "A2",    emoji: "📗" },
  { key: "b1",    label: "B1",    emoji: "🚀" },
];

function MedalIcon({ rank }) {
  if (rank === 1) return <span className="text-2xl">🥇</span>;
  if (rank === 2) return <span className="text-2xl">🥈</span>;
  if (rank === 3) return <span className="text-2xl">🥉</span>;
  return (
    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 text-sm font-bold">
      {rank}
    </span>
  );
}

function LevelBadge({ level }) {
  if (level === "b1" || level === "menengah")
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 font-semibold">
        🚀 B1
      </span>
    );
  if (level === "a2")
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 font-semibold">
        📗 A2
      </span>
    );
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-600 font-semibold">
      🌱 A1
    </span>
  );
}

export default function LeaderboardPage() {
  const [tab, setTab] = useState("semua");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username } = useUsername();

  const load = useCallback(async (level) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLeaderboard(level, 50);
      setRows(data);
    } catch (e) {
      setError("Gagal memuat data. Cek koneksi internet.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(tab);
  }, [tab, load]);

  const myRank = username
    ? rows.findIndex((r) => r.username.toLowerCase() === username.toLowerCase()) + 1
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="text-orange-500 hover:text-orange-700 text-2xl">
            ←
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-extrabold text-gray-800">🏆 Leaderboard</h1>
            <p className="text-xs text-gray-400">Ranking berdasarkan skor belajar & quiz</p>
          </div>
          <button
            onClick={() => load(tab)}
            className="text-sm text-orange-500 font-semibold hover:text-orange-700"
          >
            ↻ Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-xl mx-auto px-4 pb-3 flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                tab === t.key
                  ? "bg-orange-500 text-white shadow"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-6">
        {/* Posisi kamu */}
        {username && myRank > 0 && (
          <div className="mb-4 bg-orange-500 text-white rounded-2xl px-5 py-3 flex items-center gap-3 shadow-lg">
            <span className="text-3xl">🙋</span>
            <div>
              <p className="font-bold text-lg">{username}</p>
              <p className="text-orange-100 text-sm">
                Posisimu: #{myRank} · {rows[myRank - 1]?.totalPoin ?? 0} poin
              </p>
            </div>
          </div>
        )}
        {username && myRank === 0 && !loading && rows.length > 0 && (
          <div className="mb-4 bg-white border border-orange-200 rounded-2xl px-5 py-3 text-center text-sm text-gray-500">
            Kamu belum masuk leaderboard tab ini. Selesaikan lebih banyak pelajaran!
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3 animate-bounce">⏳</div>
            <p className="text-gray-400">Memuat ranking...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">😕</div>
            <p className="text-gray-500">{error}</p>
            <button
              onClick={() => load(tab)}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-xl font-bold"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && rows.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🏁</div>
            <p className="text-gray-500 font-semibold">Belum ada peserta.</p>
            <p className="text-gray-400 text-sm mt-1">
              Jadilah yang pertama menyelesaikan pelajaran!
            </p>
          </div>
        )}

        {/* Daftar ranking */}
        {!loading && !error && rows.length > 0 && (
          <div className="space-y-3">
            {rows.map((row, i) => {
              const rank = i + 1;
              const isMe =
                username &&
                row.username.toLowerCase() === username.toLowerCase();
              return (
                <div
                  key={row.id}
                  className={`rounded-2xl border-2 px-4 py-3 flex items-center gap-3 transition-all ${
                    isMe
                      ? "border-orange-400 bg-orange-50 shadow-md"
                      : rank <= 3
                      ? "border-yellow-300 bg-yellow-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  {/* Medali / nomor */}
                  <div className="w-8 flex-shrink-0 flex justify-center">
                    <MedalIcon rank={rank} />
                  </div>

                  {/* Info user */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-bold text-base truncate ${isMe ? "text-orange-600" : "text-gray-800"}`}>
                        {row.username}
                        {isMe && <span className="ml-1 text-xs text-orange-400">(kamu)</span>}
                      </span>
                      {tab === "semua" && <LevelBadge level={row.level} />}
                    </div>
                    <div className="flex gap-3 mt-1">
                      <span className="text-xs text-gray-400">
                        📚 {row.belajarPoin ?? 0} poin belajar
                      </span>
                      <span className="text-xs text-gray-400">
                        🧠 {row.quizPoin ?? 0} poin quiz
                      </span>
                    </div>
                  </div>

                  {/* Total poin */}
                  <div className="text-right flex-shrink-0">
                    <p className={`text-xl font-extrabold ${isMe ? "text-orange-500" : rank <= 3 ? "text-yellow-600" : "text-gray-700"}`}>
                      {row.totalPoin ?? 0}
                    </p>
                    <p className="text-xs text-gray-400">poin</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cara hitung poin */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="font-bold text-gray-700 mb-3">📊 Cara Hitung Poin</h3>
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="text-lg">📚</span>
              <span><strong className="text-gray-700">Belajar Terstruktur</strong> — 10 poin per pelajaran selesai</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🧠</span>
              <span><strong className="text-gray-700">Quiz Harian</strong> — skor % per sesi (mis. 8/10 = 80 poin)</span>
            </div>
            <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">
              Skor diperbarui otomatis setiap kamu menyelesaikan pelajaran atau quiz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
