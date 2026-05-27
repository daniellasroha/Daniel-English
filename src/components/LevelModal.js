"use client";

import { LEVEL_CONFIG } from "@/hooks/useLevel";

export default function LevelModal({ onSave, bolehTutup = false, onTutup }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🎯</div>
          <h2 className="text-2xl font-extrabold text-gray-800">Pilih Level Kamu</h2>
          <p className="text-gray-400 text-sm mt-1">
            Konten akan disesuaikan dengan levelmu
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
                <div className={`w-12 h-12 rounded-xl ${cfg.warna} flex items-center justify-center text-2xl shadow`}>
                  {cfg.emoji}
                </div>
                <div className="flex-1">
                  <p className={`font-extrabold text-lg ${cfg.teks}`}>{cfg.label}</p>
                  <p className="text-gray-500 text-xs leading-snug">{cfg.deskripsi}</p>
                </div>
                <span className="text-gray-400 text-xl">›</span>
              </div>

              {/* Detail konten */}
              <div className={`mt-3 pt-3 border-t ${cfg.border} flex flex-wrap gap-1`}>
                {key === "pemula" && (
                  <>
                    <span className="text-xs bg-white px-2 py-0.5 rounded-full border border-gray-200 text-gray-500">📚 64 kata</span>
                    <span className="text-xs bg-white px-2 py-0.5 rounded-full border border-gray-200 text-gray-500">✏️ 4 topik grammar</span>
                    <span className="text-xs bg-white px-2 py-0.5 rounded-full border border-gray-200 text-gray-500">🧠 2 jenis quiz</span>
                  </>
                )}
                {key === "menengah" && (
                  <>
                    <span className="text-xs bg-white px-2 py-0.5 rounded-full border border-gray-200 text-gray-500">📚 112 kata</span>
                    <span className="text-xs bg-white px-2 py-0.5 rounded-full border border-gray-200 text-gray-500">✏️ 8 topik grammar</span>
                    <span className="text-xs bg-white px-2 py-0.5 rounded-full border border-gray-200 text-gray-500">🧠 4 jenis quiz</span>
                  </>
                )}
              </div>
            </button>
          ))}
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
