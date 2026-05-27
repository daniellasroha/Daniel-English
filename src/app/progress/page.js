// Halaman Progress — tracking kemajuan belajar pengguna
"use client";

import { useState } from "react";
import Link from "next/link";
import { useUsername } from "@/hooks/useUsername";

// Data aktivitas belajar — simulasi progress pengguna
const aktivitasBelajar = [
  { tanggal: "2026-05-27", fitur: "Vocabulary", skor: 8, total: 10, ikon: "📚" },
  { tanggal: "2026-05-26", fitur: "Quiz", skor: 6, total: 8, ikon: "🧠" },
  { tanggal: "2026-05-25", fitur: "Grammar", skor: null, total: 4, ikon: "✏️" },
  { tanggal: "2026-05-24", fitur: "Listening", skor: null, total: 14, ikon: "🎧" },
  { tanggal: "2026-05-23", fitur: "Vocabulary", skor: 9, total: 10, ikon: "📚" },
  { tanggal: "2026-05-22", fitur: "Quiz", skor: 5, total: 8, ikon: "🧠" },
];

// Data statistik ringkasan
const statistik = [
  { label: "Hari Belajar", nilai: "6", ikon: "🔥", warna: "text-orange-600", bg: "bg-orange-50" },
  { label: "Total Sesi", nilai: "12", ikon: "📖", warna: "text-blue-600", bg: "bg-blue-50" },
  { label: "Rata-rata Skor", nilai: "78%", ikon: "⭐", warna: "text-yellow-600", bg: "bg-yellow-50" },
  { label: "Kata Dipelajari", nilai: "42", ikon: "💬", warna: "text-green-600", bg: "bg-green-50" },
];

// Data target mingguan
const targetMingguan = [
  { hari: "Sen", selesai: true },
  { hari: "Sel", selesai: true },
  { hari: "Rab", selesai: true },
  { hari: "Kam", selesai: true },
  { hari: "Jum", selesai: true },
  { hari: "Sab", selesai: false },
  { hari: "Min", selesai: false },
];

// Format tanggal ke bahasa Indonesia
function formatTanggal(str) {
  const tgl = new Date(str);
  return tgl.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
}

export default function ProgressPage() {
  const [tabAktif, setTabAktif] = useState("ringkasan");
  const [editNama, setEditNama] = useState(false);
  const [inputNama, setInputNama] = useState("");

  const { username, saveUsername } = useUsername();

  function handleSaveNama(e) {
    e.preventDefault();
    if (inputNama.trim()) {
      saveUsername(inputNama.trim());
      setEditNama(false);
      setInputNama("");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-indigo-500 hover:text-indigo-700 text-2xl">
            ←
          </Link>
          <div>
            <h1 className="text-xl font-bold text-pink-700">📊 Progress Belajar</h1>
            <p className="text-xs text-gray-400">Pantau kemajuan belajar kamu</p>
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
                  <button
                    type="submit"
                    className="bg-white text-pink-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-pink-50 transition"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditNama(false)}
                    className="text-pink-200 text-xs hover:text-white transition"
                  >
                    Batal
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">
                    Halo, {username || "Pelajar"}! 👋
                  </h2>
                  <button
                    onClick={() => { setEditNama(true); setInputNama(username); }}
                    title="Ganti nama"
                    className="text-pink-200 hover:text-white text-sm transition"
                  >
                    ✏️
                  </button>
                </div>
              )}
              <p className="text-pink-100 text-sm">Kamu sudah belajar 5 hari berturut-turut. Luar biasa!</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-yellow-300 text-lg">🔥</span>
                <span className="font-bold">Streak: 5 Hari</span>
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

        {/* Konten tab Ringkasan */}
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
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
              <h3 className="font-bold text-gray-700 mb-4">📚 Progress per Fitur</h3>
              {[
                { nama: "Vocabulary", persen: 75, warna: "bg-blue-500" },
                { nama: "Grammar", persen: 50, warna: "bg-green-500" },
                { nama: "Quiz", persen: 65, warna: "bg-purple-500" },
                { nama: "Listening", persen: 40, warna: "bg-orange-500" },
              ].map((fitur, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{fitur.nama}</span>
                    <span className="text-gray-400">{fitur.persen}%</span>
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
          </div>
        )}

        {/* Konten tab Aktivitas */}
        {tabAktif === "aktivitas" && (
          <div className="flex flex-col gap-3">
            {aktivitasBelajar.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-2xl">
                  {item.ikon}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{item.fitur}</p>
                  <p className="text-gray-400 text-xs">{formatTanggal(item.tanggal)}</p>
                </div>
                {item.skor !== null ? (
                  <div className="text-right">
                    <p className="font-bold text-pink-600">{item.skor}/{item.total}</p>
                    <p className="text-xs text-gray-400">
                      {Math.round((item.skor / item.total) * 100)}%
                    </p>
                  </div>
                ) : (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                    Materi
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Konten tab Target */}
        {tabAktif === "target" && (
          <div>
            {/* Target minggu ini */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100 mb-5">
              <h3 className="font-bold text-gray-700 mb-4">📅 Target Minggu Ini</h3>
              <p className="text-sm text-gray-500 mb-4">Belajar minimal 1 sesi setiap hari</p>
              <div className="flex justify-between gap-2">
                {targetMingguan.map((hari, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                        hari.selesai
                          ? "bg-green-500 text-white shadow"
                          : "bg-gray-100 text-gray-300"
                      }`}
                    >
                      {hari.selesai ? "✓" : "○"}
                    </div>
                    <span className="text-xs text-gray-500">{hari.hari}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-green-600 font-semibold mt-4">
                ✅ 5 dari 7 hari selesai — terus semangat!
              </p>
            </div>

            {/* Target belajar */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
              <h3 className="font-bold text-gray-700 mb-4">🎯 Target Belajar</h3>
              {[
                { label: "Pelajari 50 kosakata baru", selesai: 42, total: 50 },
                { label: "Selesaikan semua topik Grammar", selesai: 2, total: 4 },
                { label: "Capai skor Quiz 80%", selesai: 78, total: 80 },
              ].map((target, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{target.label}</span>
                    <span className="text-pink-500 font-bold">
                      {target.selesai}/{target.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-pink-400 h-2 rounded-full"
                      style={{ width: `${Math.min((target.selesai / target.total) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
