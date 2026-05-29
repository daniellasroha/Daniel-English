"use client";

import { LEVEL_CONFIG } from "@/hooks/useLevel";

const DETAIL_KONTEN = {
  a1: [
    "📚 59 kata dasar",
    "✏️ 4 topik grammar",
    "🧠 22 unit belajar",
    "🎯 4 jenis quiz",
  ],
  a2: [
    "📚 132 kata (A1 + A2)",
    "✏️ 8 topik grammar",
    "🧠 41 unit belajar",
    "🎯 6 jenis quiz",
  ],
  b1: [
    "📚 132 kata lengkap",
    "✏️ 8 topik grammar",
    "🧠 42 unit + Present Perfect",
    "🎯 6 jenis quiz + latihan lanjut",
  ],
};

export default function LevelModal({ onSave, bolehTutup = false, onTutup }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="text-5xl mb-3">🎯</div>
          <h2 className="text-2xl font-extrabold text-gray-800">Pilih Level CEFR</h2>
          <p className="text-gray-400 text-sm mt-1">
            Konten dan materi akan disesuaikan dengan levelmu
          </p>
        </div>

        {/* Kartu level */}
        <div className="flex flex-col gap-3 mb-4">
          {Object.entries(LEVEL_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => onSave(key)}
              className={`w-full rounded-2xl border-2 ${cfg.border} ${cfg.warnaLight} p-4 text-left hover:shadow-md hover:-translate-y-0.5 transition-all`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${cfg.warna} flex items-center justify-center text-2xl shadow flex-shrink-0`}>
                  {cfg.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-extrabold text-xl ${cfg.teks}`}>{cfg.label}</p>
                    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {cfg.sublabel}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs leading-snug mt-0.5">{cfg.deskripsi}</p>
                </div>
                <span className="text-gray-400 text-xl">›</span>
              </div>

              {/* Detail konten */}
              <div className={`mt-3 pt-3 border-t ${cfg.border} flex flex-wrap gap-1.5`}>
                {(DETAIL_KONTEN[key] || []).map((item, i) => (
                  <span key={i} className="text-xs bg-white px-2 py-0.5 rounded-full border border-gray-200 text-gray-500">
                    {item}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Panduan pilih level */}
        <div className="bg-gray-50 rounded-2xl p-3 mb-4 text-xs text-gray-500">
          <p className="font-semibold text-gray-600 mb-1">💡 Tidak tahu pilih yang mana?</p>
          <p>• <strong>A1</strong> — Baru mulai belajar bahasa Inggris</p>
          <p>• <strong>A2</strong> — Sudah kenal kosakata dasar, ingin lanjut</p>
          <p>• <strong>B1</strong> — Sudah paham A1+A2, mau ke level lebih tinggi</p>
        </div>

        {bolehTutup && (
          <button
            onClick={onTutup}
            className="w-full py-2 text-gray-400 text-sm hover:text-gray-600 transition"
          >
            Batal
          </button>
        )}
      </div>
    </div>
  );
}
