"use client";

import { LEVEL_CONFIG } from "@/hooks/useLevel";
import { learningPathIndex as learningPath } from "@/data/learningPathIndex";
import { kosakata } from "@/data/vocabulary";

// Warna per level dari CSS vars Academia — otomatis adaptasi dark mode
const levelStyle = {
  a1: { accent: "var(--a1)", light: "var(--a1-light)" },
  a2: { accent: "var(--a2)", light: "var(--a2-light)" },
  b1: { accent: "var(--b1)", light: "var(--b1-light)" },
};

// Hitung otomatis dari data asli agar tidak perlu update manual
function hitungDetailKonten(levelKey, cfg) {
  const totalUnit = learningPath.length;
  const unitA1 = learningPath.filter(u => u.level === "a1").length;
  const unitA2 = learningPath.filter(u => u.level === "a1" || u.level === "a2").length;

  const vocabA1 = kosakata.filter(k => k.level === "a1").length;
  const vocabA2 = kosakata.filter(k => k.level === "a1" || k.level === "a2").length;
  const vocabTotal = kosakata.length;

  const grammarCount = cfg.grammarTopics.length;
  const quizCount = cfg.quizRoutes.length;

  if (levelKey === "a1") {
    return [
      `📚 ${vocabA1} kata dasar`,
      `✏️ ${grammarCount} topik grammar`,
      `🧠 ${unitA1} unit belajar`,
      `🎯 ${quizCount} jenis quiz`,
    ];
  }
  if (levelKey === "a2") {
    return [
      `📚 ${vocabA2} kata (A1 + A2)`,
      `✏️ ${grammarCount} topik grammar`,
      `🧠 ${unitA2} unit belajar`,
      `🎯 ${quizCount} jenis quiz`,
    ];
  }
  // b1
  return [
    `📚 ${vocabTotal} kata lengkap`,
    `✏️ ${grammarCount} topik grammar`,
    `🧠 ${totalUnit} unit belajar`,
    `🎯 ${quizCount} jenis quiz + latihan lanjut`,
  ];
}

export default function LevelModal({ onSave, bolehTutup = false, onTutup }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(28,26,23,0.5)" }}>
      <div
        className="rounded-3xl shadow-2xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "var(--bg-paper)", border: "1px solid var(--border)" }}
      >
        {/* Header */}
        <div className="text-center mb-5">
          <div className="text-5xl mb-3">🎯</div>
          <h2 className="font-serif text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
            Pilih Level CEFR
          </h2>
          <p className="font-sans text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Konten dan materi akan disesuaikan dengan levelmu
          </p>
        </div>

        {/* Kartu level */}
        <div className="flex flex-col gap-3 mb-4">
          {Object.entries(LEVEL_CONFIG).map(([key, cfg]) => {
            const st = levelStyle[key] ?? levelStyle.a1;
            return (
              <button
                key={key}
                onClick={() => onSave(key)}
                className="w-full rounded-2xl p-4 text-left hover:shadow-md hover:-translate-y-0.5 transition-all"
                style={{ border: `2px solid ${st.accent}`, backgroundColor: st.light }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: "var(--bg-paper)", border: "1px solid var(--border)" }}
                  >
                    {cfg.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-serif font-semibold text-xl" style={{ color: st.accent }}>
                        {cfg.label}
                      </p>
                      <span
                        className="font-sans text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "var(--bg-paper)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
                      >
                        {cfg.sublabel}
                      </span>
                    </div>
                    <p className="font-sans text-xs leading-snug mt-0.5" style={{ color: "var(--text-secondary)" }}>
                      {cfg.deskripsi}
                    </p>
                  </div>
                  <span className="text-xl" style={{ color: st.accent }}>›</span>
                </div>

                {/* Detail konten */}
                <div className="mt-3 pt-3 flex flex-wrap gap-1.5" style={{ borderTop: `1px solid ${st.accent}40` }}>
                  {hitungDetailKonten(key, cfg).map((item, i) => (
                    <span
                      key={i}
                      className="font-sans text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "var(--bg-paper)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Panduan pilih level */}
        <div
          className="rounded-2xl p-3 mb-4 font-sans text-xs"
          style={{ backgroundColor: "var(--bg-subtle)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
        >
          <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>💡 Tidak tahu pilih yang mana?</p>
          <p>• <strong>A1</strong> — Baru mulai belajar bahasa Inggris</p>
          <p>• <strong>A2</strong> — Sudah kenal kosakata dasar, ingin lanjut</p>
          <p>• <strong>B1</strong> — Sudah paham A1+A2, mau ke level lebih tinggi</p>
        </div>

        {bolehTutup && (
          <button
            onClick={onTutup}
            className="w-full py-2 font-sans text-sm transition hover:opacity-70"
            style={{ color: "var(--text-muted)" }}
          >
            Batal
          </button>
        )}
      </div>
    </div>
  );
}
