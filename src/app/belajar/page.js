// Halaman Belajar Terstruktur — Busuu-style learning path
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { learningPath as unitBelajar } from "@/data/learningPath";
import { useLearning } from "@/hooks/useLearning";
import { useLevel } from "@/hooks/useLevel";
import { useSRS } from "@/hooks/useSRS";
import { speak } from "@/lib/speech";

// ─── SOUND EFFECTS (Web Audio API, no external files) ─────────────────────────
// Logika audio tidak diubah sama sekali
function playBenar() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.15].forEach((offset, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(i === 0 ? 880 : 1100, ctx.currentTime + offset);
      gain.gain.setValueAtTime(0.25, ctx.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.25);
      osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 0.25);
    });
  } catch {}
}

function playSalah() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch {}
}

// ─── KOMPONEN: Confetti ───────────────────────────────────────────────────────
// Perayaan saat pelajaran selesai — 36 kepingan jatuh dengan posisi & delay acak
function Confetti() {
  const warna = ["#2D5A3D", "#C9933A", "#1D4ED8", "#DC2626", "#7C3AED", "#059669"];
  const [pieces] = useState(() =>
    Array.from({ length: 36 }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 1.2,
      color: warna[i % warna.length],
      size: 8 + Math.random() * 8,
    }))
  );
  return (
    <div aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size * 1.4}px`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── KOMPONEN: Kartu Vocab (flashcard) ────────────────────────────────────────
// meta.border & meta.bg dipertahankan — warna identitas per unit dari data
// registerCard & lessonId dipakai untuk SRS
function VocabCard({ kartu, meta, index, total, lessonId, registerCard, autoPlay }) {
  const [terbuka, setTerbuka] = useState(false);

  // Audio otomatis: ucapkan kata saat kartu muncul (komponen di-key per kartu)
  useEffect(() => {
    if (!autoPlay) return;
    const t = setTimeout(() => speak(kartu.kata), 400);
    return () => clearTimeout(t);
  }, []);

  function handleFlip() {
    if (!terbuka && registerCard && lessonId) {
      // Daftarkan ke SRS saat kartu pertama kali dibuka
      registerCard(`belajar-${lessonId}-${index}`, {
        type       : "belajar",
        english    : kartu.kata,
        indonesian : kartu.arti,
        emoji      : kartu.emoji,
        contoh     : kartu.contoh,
      });
    }
    setTerbuka(!terbuka);
  }

  return (
    <div
      onClick={handleFlip}
      className={`rounded-2xl border-2 ${meta.border} ${meta.bg} cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5`}
    >
      <div className="flex items-center gap-4 mb-3">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${meta.warna} flex items-center justify-center text-3xl shadow flex-shrink-0`}>
          {kartu.emoji}
        </div>
        <div className="flex-1">
          <p className="font-sans text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>
            {index + 1} / {total}
          </p>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
              {kartu.kata}
            </h3>
            {/* Tombol TTS — stopPropagation agar tidak trigger flip */}
            <button
              onClick={(e) => { e.stopPropagation(); speak(kartu.kata); }}
              className="text-lg opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
              title="Dengarkan pengucapan"
            >🔊</button>
          </div>
          {!terbuka && (
            <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
              Klik untuk lihat arti
            </p>
          )}
        </div>
      </div>

      {terbuka ? (
        <div className={`rounded-xl p-3 border ${meta.border}`} style={{ backgroundColor: "rgba(255,255,255,0.7)" }}>
          <p className={`font-sans font-bold text-base ${meta.teks}`}>{kartu.arti}</p>
          <p className="font-sans text-xs mt-1 italic" style={{ color: "var(--text-muted)" }}>
            &ldquo;{kartu.contoh}&rdquo;
          </p>
        </div>
      ) : (
        <div
          className="h-10 rounded-xl border border-dashed flex items-center justify-center"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "rgba(255,255,255,0.3)" }}
        >
          <span className="font-sans text-sm" style={{ color: "var(--border-strong)" }}>• • •</span>
        </div>
      )}
    </div>
  );
}

// ─── SESI LATIHAN MULTI-TIPE ──────────────────────────────────────────────────
// Tipe item: "mc" (pilihan ganda) | "listening" | "matching" | "susun"
// Semua tipe baru di-generate otomatis dari kartu pelajaran — tidak perlu ubah data

function acakArr(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Kartu yang cocok untuk listening/matching: kata pendek, bukan rumus grammar
function kartuSederhana(kartu) {
  return (kartu || []).filter(
    (k) => k.kata.length <= 22 && !k.kata.includes("/") && !k.kata.includes("+") && !k.kata.includes("...")
  );
}

// Bangun sesi campuran: soal MC dari data + listening + matching + susun kalimat
function buatSesiLatihan(soalData, kartu) {
  const mc = (soalData && soalData.length ? soalData : generateSoalFromKartu(kartu || []))
    .map((s) => ({ ...s, tipe: "mc" }));

  const sederhana = kartuSederhana(kartu);
  if (sederhana.length < 4) return mc; // kartu grammar/rumus → MC saja

  const ekstra = [];

  // 2 soal listening: dengarkan kata, pilih yang benar
  acakArr(sederhana).slice(0, 2).forEach((k) => {
    const lain = acakArr(sederhana.filter((x) => x.kata !== k.kata)).slice(0, 3).map((x) => x.kata);
    const pilihan = acakArr([k.kata, ...lain]);
    ekstra.push({ tipe: "listening", kata: k.kata, pilihan, jawaban: pilihan.indexOf(k.kata) });
  });

  // 1 ronde mencocokkan: 4 pasang kata ↔ arti (arti pendek saja agar muat)
  const pasanganCalon = sederhana.filter((k) => k.arti.length <= 35);
  if (pasanganCalon.length >= 4) {
    ekstra.push({
      tipe: "matching",
      pasangan: acakArr(pasanganCalon).slice(0, 4).map((k) => ({ kata: k.kata, arti: k.arti })),
    });
  }

  // 1 soal susun kalimat: dari contoh kalimat 3–8 kata
  const susunCalon = sederhana.filter((k) => {
    const n = (k.contoh || "").split(" ").length;
    return n >= 3 && n <= 8;
  });
  if (susunCalon.length > 0) {
    const k = susunCalon[Math.floor(Math.random() * susunCalon.length)];
    ekstra.push({ tipe: "susun", kalimat: k.contoh, kataKunci: k.kata, artiKunci: k.arti });
  }

  // Sisipkan item ekstra di posisi acak (setelah soal pertama)
  const hasil = [...mc];
  ekstra.forEach((e) => {
    const pos = 1 + Math.floor(Math.random() * Math.max(hasil.length, 1));
    hasil.splice(pos, 0, e);
  });
  return hasil;
}

// ─── KOMPONEN: Latihan Mencocokkan ────────────────────────────────────────────
// Tap kata di kiri, lalu tap arti di kanan. Benar → hijau permanen, salah → flash merah.
function MatchingItem({ pasangan, meta, onDone }) {
  const [kiri]  = useState(() => acakArr(pasangan.map((p) => p.kata)));
  const [kanan] = useState(() => acakArr(pasangan.map((p) => p.arti)));
  const [pilihKata, setPilihKata] = useState(null);
  const [cocok, setCocok] = useState([]);     // daftar kata yang sudah berpasangan
  const [salahCount, setSalahCount] = useState(0);
  const [flashSalah, setFlashSalah] = useState(null); // arti yang di-flash merah

  const semuaCocok = cocok.length === pasangan.length;

  function tapArti(arti) {
    if (!pilihKata || flashSalah) return;
    const pasanganBenar = pasangan.find((p) => p.kata === pilihKata);
    if (pasanganBenar.arti === arti) {
      setCocok((c) => [...c, pilihKata]);
      setPilihKata(null);
      playBenar();
    } else {
      setSalahCount((s) => s + 1);
      setFlashSalah(arti);
      playSalah();
      setTimeout(() => setFlashSalah(null), 600);
    }
  }

  const artiKe = (kata) => pasangan.find((p) => p.kata === kata)?.arti;

  return (
    <div>
      <div className={`rounded-2xl border-2 ${meta.border} ${meta.bg} p-5 mb-6 text-center`}>
        <p className="font-serif text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          🔗 Cocokkan kata dengan artinya
        </p>
        <p className="font-sans text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          Tap kata bahasa Inggris, lalu tap artinya
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Kolom kata (Inggris) */}
        <div className="flex flex-col gap-3">
          {kiri.map((kata) => {
            const sudah = cocok.includes(kata);
            const aktif = pilihKata === kata;
            return (
              <button
                key={kata}
                onClick={() => !sudah && setPilihKata(aktif ? null : kata)}
                disabled={sudah}
                className={`px-3 py-3 rounded-xl font-sans font-semibold text-sm border-2 transition-all ${
                  sudah
                    ? "border-green-400 bg-green-50 text-green-700 opacity-60"
                    : aktif
                    ? `${meta.border} ${meta.bg} ${meta.teks} scale-105 shadow-md`
                    : ""
                }`}
                style={
                  !sudah && !aktif
                    ? { borderColor: "var(--border)", backgroundColor: "var(--bg-paper)", color: "var(--text-primary)" }
                    : {}
                }
              >
                {sudah ? "✓ " : ""}{kata}
              </button>
            );
          })}
        </div>

        {/* Kolom arti (Indonesia) */}
        <div className="flex flex-col gap-3">
          {kanan.map((arti) => {
            const sudah = cocok.some((kata) => artiKe(kata) === arti);
            const salah = flashSalah === arti;
            return (
              <button
                key={arti}
                onClick={() => !sudah && tapArti(arti)}
                disabled={sudah}
                className={`px-3 py-3 rounded-xl font-sans font-medium text-sm border-2 transition-all ${
                  sudah
                    ? "border-green-400 bg-green-50 text-green-700 opacity-60"
                    : salah
                    ? "border-red-400 bg-red-50 text-red-600"
                    : ""
                }`}
                style={
                  !sudah && !salah
                    ? { borderColor: "var(--border)", backgroundColor: "var(--bg-paper)", color: "var(--text-secondary)" }
                    : {}
                }
              >
                {sudah ? "✓ " : ""}{arti}
              </button>
            );
          })}
        </div>
      </div>

      {semuaCocok && (
        <button
          onClick={() => onDone(salahCount <= 1)}
          className={`w-full py-3 rounded-2xl text-white font-sans font-bold bg-gradient-to-r ${meta.warna} hover:scale-105 transition-transform shadow-md`}
        >
          {salahCount <= 1 ? "🎉 Hebat! Lanjut →" : "Lanjut →"}
        </button>
      )}
    </div>
  );
}

// ─── KOMPONEN: Latihan Susun Kalimat ──────────────────────────────────────────
// Tap kata acak untuk menyusun kalimat. Tap kata tersusun untuk membatalkan.
function SusunItem({ kalimat, kataKunci, artiKunci, meta, onDone }) {
  // Setiap kata diberi id unik agar kata kembar tidak tertukar
  const [pool] = useState(() =>
    acakArr(kalimat.split(" ").map((w, i) => ({ id: i, w })))
  );
  const [jawab, setJawab] = useState([]);   // array id terurut
  const [hasil, setHasil] = useState(null); // null | "benar" | "salah"

  const sisaPool = pool.filter((p) => !jawab.includes(p.id));
  const kalimatJawab = jawab.map((id) => pool.find((p) => p.id === id).w).join(" ");
  const benar = kalimatJawab === kalimat;

  function periksa() {
    setHasil(benar ? "benar" : "salah");
    if (benar) playBenar(); else playSalah();
  }

  return (
    <div>
      <div className={`rounded-2xl border-2 ${meta.border} ${meta.bg} p-5 mb-4 text-center`}>
        <p className="font-serif text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          🧩 Susun kalimatnya
        </p>
        <p className="font-sans text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          Petunjuk: <strong>{kataKunci}</strong> = {artiKunci}
        </p>
      </div>

      {/* Area jawaban */}
      <div
        className="min-h-[3.5rem] rounded-xl border-2 border-dashed p-3 mb-4 flex flex-wrap gap-2 items-center justify-center"
        style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-paper)" }}
      >
        {jawab.length === 0 && (
          <span className="font-sans text-sm" style={{ color: "var(--text-muted)" }}>
            Tap kata di bawah untuk menyusun...
          </span>
        )}
        {jawab.map((id) => (
          <button
            key={id}
            onClick={() => hasil === null && setJawab((j) => j.filter((x) => x !== id))}
            className={`px-3 py-1.5 rounded-lg font-sans font-semibold text-sm border-2 ${meta.border} ${meta.bg} ${meta.teks} transition`}
          >
            {pool.find((p) => p.id === id).w}
          </button>
        ))}
      </div>

      {/* Pool kata acak */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {sisaPool.map((p) => (
          <button
            key={p.id}
            onClick={() => hasil === null && setJawab((j) => [...j, p.id])}
            className="px-3 py-1.5 rounded-lg font-sans font-semibold text-sm border-2 transition hover:scale-105"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-paper)", color: "var(--text-primary)" }}
          >
            {p.w}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {hasil && (
        <div className={`rounded-xl p-4 mb-4 text-center font-sans text-sm font-semibold ${
          hasil === "benar" ? "bg-green-50 text-green-700 border-2 border-green-200" : "bg-red-50 text-red-600 border-2 border-red-200"
        }`}>
          {hasil === "benar" ? "🎉 Benar! Kalimat tersusun sempurna!" : (
            <>❌ Belum tepat. Kalimat yang benar:<br />
              <span className="font-bold">&ldquo;{kalimat}&rdquo;</span>
            </>
          )}
        </div>
      )}

      {hasil === null ? (
        <button
          onClick={periksa}
          disabled={sisaPool.length > 0}
          className={`w-full py-3 rounded-2xl text-white font-sans font-bold transition shadow-md ${
            sisaPool.length === 0
              ? `bg-gradient-to-r ${meta.warna} hover:scale-105`
              : "opacity-40 cursor-not-allowed bg-gray-300"
          }`}
        >
          Periksa Jawaban
        </button>
      ) : (
        <button
          onClick={() => onDone(hasil === "benar")}
          className={`w-full py-3 rounded-2xl text-white font-sans font-bold bg-gradient-to-r ${meta.warna} hover:scale-105 transition-transform shadow-md`}
        >
          Lanjut →
        </button>
      )}
    </div>
  );
}

// ─── KOMPONEN: Mini Quiz (multi-tipe) ─────────────────────────────────────────
// meta.warna dipertahankan untuk identitas unit. Green/red feedback tetap.
function MiniQuiz({ soalList, meta, onSelesai }) {
  const [idx, setIdx] = useState(0);
  const [dipilih, setDipilih] = useState(null);
  const [benar, setBenar] = useState(0);

  const soal = soalList[idx];
  const selesai = idx >= soalList.length;
  const tipe = soal?.tipe || "mc";

  // Listening: ucapkan kata otomatis saat soal muncul
  useEffect(() => {
    if (!selesai && tipe === "listening") {
      const t = setTimeout(() => speak(soal.kata), 350);
      return () => clearTimeout(t);
    }
  }, [idx]);

  function pilih(i) {
    if (dipilih !== null) return;
    setDipilih(i);
    if (i === soal.jawaban) {
      setBenar((b) => b + 1);
      playBenar();
    } else {
      playSalah();
    }
  }

  function lanjut() {
    setDipilih(null);
    setIdx((n) => n + 1);
  }

  // Dipanggil oleh MatchingItem / SusunItem saat selesai
  function itemDone(hasilBenar) {
    if (hasilBenar) setBenar((b) => b + 1);
    setDipilih(null);
    setIdx((n) => n + 1);
  }

  // ── Layar selesai ──
  if (selesai) {
    const persen = Math.round((benar / soalList.length) * 100);
    const lulus = persen >= 60;
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">{lulus ? "🎉" : "💪"}</div>
        <h3 className="font-serif text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
          {lulus ? "Luar Biasa!" : "Hampir Benar!"}
        </h3>
        <p className="font-sans mb-1" style={{ color: "var(--text-secondary)" }}>
          {benar} dari {soalList.length} soal benar
        </p>
        <p className={`font-sans text-2xl font-bold mb-6 ${lulus ? "text-green-600" : "text-orange-500"}`}>
          {persen}%
        </p>
        <button
          onClick={() => onSelesai(lulus)}
          className={`px-8 py-3 rounded-2xl text-white font-sans font-bold text-lg shadow-lg bg-gradient-to-r ${meta.warna} hover:scale-105 transition-transform`}
        >
          {lulus ? "Selesai & Lanjut ✓" : "Coba Lagi"}
        </button>
      </div>
    );
  }

  // ── Layar soal ──
  return (
    <div>
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between font-sans text-xs mb-1" style={{ color: "var(--text-muted)" }}>
          <span>Soal {idx + 1} dari {soalList.length}</span>
          <span>{benar} benar</span>
        </div>
        <div className="w-full h-2 rounded-full" style={{ backgroundColor: "var(--bg-subtle)" }}>
          <div
            className={`h-full rounded-full bg-gradient-to-r ${meta.warna} transition-all`}
            style={{ width: `${(idx / soalList.length) * 100}%` }}
          />
        </div>
      </div>

      {/* ── Tipe: mencocokkan ── */}
      {tipe === "matching" && (
        <MatchingItem key={idx} pasangan={soal.pasangan} meta={meta} onDone={itemDone} />
      )}

      {/* ── Tipe: susun kalimat ── */}
      {tipe === "susun" && (
        <SusunItem key={idx} kalimat={soal.kalimat} kataKunci={soal.kataKunci} artiKunci={soal.artiKunci} meta={meta} onDone={itemDone} />
      )}

      {/* ── Tipe: listening — kartu speaker, bukan teks ── */}
      {tipe === "listening" && (
        <div className={`rounded-2xl border-2 ${meta.border} ${meta.bg} p-6 mb-6 text-center`}>
          <p className="font-serif text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            🎧 Dengarkan, lalu pilih kata yang kamu dengar
          </p>
          <button
            onClick={() => speak(soal.kata)}
            className={`w-16 h-16 rounded-full text-3xl bg-gradient-to-br ${meta.warna} text-white shadow-lg hover:scale-110 transition-transform`}
            title="Putar lagi"
          >
            🔊
          </button>
          <p className="font-sans text-xs mt-2" style={{ color: "var(--text-muted)" }}>
            Tap untuk dengar lagi
          </p>
        </div>
      )}

      {/* ── Tipe: pilihan ganda — kartu pertanyaan ── */}
      {tipe === "mc" && (
        <div className={`rounded-2xl border-2 ${meta.border} ${meta.bg} p-6 mb-6`}>
          <p className="font-serif text-lg font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>
            {soal.pertanyaan}
          </p>
        </div>
      )}

      {/* Pilihan jawaban — hanya untuk mc & listening */}
      {(tipe === "mc" || tipe === "listening") && (
      <>
      <div className="grid grid-cols-1 gap-3 mb-4">
        {soal.pilihan.map((pilihan, i) => {
          // State: belum dijawab
          if (dipilih === null) {
            return (
              <button
                key={i}
                onClick={() => pilih(i)}
                className="w-full text-left px-4 py-3 rounded-xl font-sans font-medium border-2 transition-all hover:border-indigo-300"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--bg-paper)",
                  color: "var(--text-primary)",
                }}
              >
                <span className="text-xs mr-2" style={{ color: "var(--text-muted)" }}>
                  {["A", "B", "C", "D"][i]}.
                </span>
                {pilihan}
              </button>
            );
          }
          // State: sudah dijawab — tampilkan feedback
          if (i === soal.jawaban) {
            return (
              <button key={i} className="w-full text-left px-4 py-3 rounded-xl font-sans font-medium border-2 border-green-400 bg-green-50 text-green-700 transition-all">
                <span className="text-xs mr-2 text-green-400">{["A", "B", "C", "D"][i]}.</span>
                {pilihan}
                <span className="ml-2 font-bold">✓</span>
              </button>
            );
          }
          if (i === dipilih) {
            return (
              <button key={i} className="w-full text-left px-4 py-3 rounded-xl font-sans font-medium border-2 border-red-400 bg-red-50 text-red-700 transition-all">
                <span className="text-xs mr-2 text-red-400">{["A", "B", "C", "D"][i]}.</span>
                {pilihan}
                <span className="ml-2 font-bold">✗</span>
              </button>
            );
          }
          return (
            <button
              key={i}
              className="w-full text-left px-4 py-3 rounded-xl font-sans font-medium border-2 opacity-50 transition-all"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-paper)", color: "var(--text-muted)" }}
            >
              <span className="text-xs mr-2">{["A", "B", "C", "D"][i]}.</span>
              {pilihan}
            </button>
          );
        })}
      </div>

      {dipilih !== null && (
        <button
          onClick={lanjut}
          className={`w-full py-3 rounded-2xl text-white font-sans font-bold bg-gradient-to-r ${meta.warna} hover:scale-105 transition-transform shadow-md`}
        >
          {idx < soalList.length - 1 ? "Soal Berikutnya →" : "Lihat Hasil"}
        </button>
      )}
      </>
      )}
    </div>
  );
}

// ─── KOMPONEN: Tampilan Pelajaran ─────────────────────────────────────────────
// Semua logika state & navigasi tidak diubah
function TampilanPelajaran({
  unit,
  pelajaran,
  lessonIndex,
  onKembali,
  onSelesai,
  sudahSelesai,
  nextLesson,
  onNextLesson,
  nextUnit,
  onNextUnit,
  registerCard,  // dari useSRS — untuk SRS registration
}) {
  const meta = unit;
  const [fase, setFase] = useState("vocab");
  const [vocabIdx, setVocabIdx] = useState(0);

  const isVocab = pelajaran.tipe === "vocab";
  const isQuiz  = pelajaran.tipe === "quiz";

  // Sesi latihan campuran dibangun SEKALI per pelajaran (komponen di-key per lesson)
  // agar urutan soal tidak teracak ulang setiap render
  const [sesiLatihan] = useState(() =>
    pelajaran.tipe === "vocab" ? buatSesiLatihan(pelajaran.soal, pelajaran.kartu) : []
  );

  // Preferensi audio otomatis flashcard — tersimpan di localStorage
  const [autoPlay, setAutoPlay] = useState(true);
  useEffect(() => {
    try { setAutoPlay(localStorage.getItem("daniel_english_autoplay") !== "false"); } catch {}
  }, []);
  function toggleAutoPlay() {
    const next = !autoPlay;
    setAutoPlay(next);
    try { localStorage.setItem("daniel_english_autoplay", String(next)); } catch {}
  }

  function handleVocabNext() {
    if (isVocab && vocabIdx < pelajaran.kartu.length - 1) {
      setVocabIdx(vocabIdx + 1);
    } else {
      setFase("quiz");
    }
  }

  function handleVocabPrev() {
    if (vocabIdx > 0) setVocabIdx(vocabIdx - 1);
  }

  function handleQuizSelesai(lulus) {
    if (lulus) {
      setFase("done");
      onSelesai();
    } else {
      setFase("vocab");
      setVocabIdx(0);
    }
  }

  // ── Pure quiz (no vocab) ──
  if (isQuiz && fase !== "done") {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
        <header
          className="sticky top-0 z-10"
          style={{ backgroundColor: "var(--bg-paper)", borderBottom: "1px solid var(--border)" }}
        >
          <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-3">
            <button
              onClick={onKembali}
              className="text-2xl transition hover:opacity-70"
              style={{ color: "var(--brand)" }}
            >←</button>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.warna} flex items-center justify-center text-xl shadow flex-shrink-0`}>
              {pelajaran.emoji}
            </div>
            <div className="flex-1">
              <h1 className="font-serif text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                {pelajaran.judul}
              </h1>
              <p className={`font-sans text-xs font-semibold ${meta.teks}`}>{unit.judul}</p>
            </div>
          </div>
        </header>
        <div className="max-w-xl mx-auto px-4 py-6">
          <MiniQuiz soalList={pelajaran.soal} meta={meta} onSelesai={handleQuizSelesai} />
        </div>
      </div>
    );
  }

  // ── Selesai / Done screen ──
  if (fase === "done") {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "var(--bg-base)" }}
      >
        <Confetti />
        <div className="card-de p-8 max-w-sm w-full text-center">
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="font-serif text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            Pelajaran Selesai!
          </h2>
          <p className="font-sans text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
            {pelajaran.judul}
          </p>
          <p className={`font-sans font-semibold ${meta.teks} text-sm mb-6`}>{unit.judul}</p>

          <div className="flex flex-col gap-3">
            {nextLesson && (
              <button
                onClick={onNextLesson}
                className={`w-full py-3 rounded-2xl text-white font-sans font-bold bg-gradient-to-r ${meta.warna} shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2`}
              >
                <span>Pelajaran Berikutnya</span>
                <span className="text-xl">→</span>
              </button>
            )}
            {!nextLesson && nextUnit && (
              <button
                onClick={onNextUnit}
                className={`w-full py-3 rounded-2xl text-white font-sans font-bold bg-gradient-to-r ${meta.warna} shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2`}
              >
                <span>Unit Berikutnya</span>
                <span className="text-xl">→</span>
              </button>
            )}

            <button
              onClick={() => { setFase(isVocab ? "vocab" : "quiz"); setVocabIdx(0); }}
              className="w-full py-3 rounded-2xl font-sans font-semibold border transition flex items-center justify-center gap-2"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)", backgroundColor: "var(--bg-subtle)" }}
            >
              <span>🔄</span> Ulangi Pelajaran
            </button>

            <button
              onClick={onKembali}
              className={`w-full py-3 rounded-2xl font-sans font-bold border-2 transition hover:shadow-md ${
                nextLesson || nextUnit
                  ? `${meta.border} ${meta.bg} ${meta.teks}`
                  : `text-white bg-gradient-to-r ${meta.warna} shadow-lg hover:scale-105`
              }`}
            >
              Kembali ke Unit
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Vocab phase ──
  if (fase === "vocab" && isVocab) {
    const kartu  = pelajaran.kartu[vocabIdx];
    const isLast = vocabIdx === pelajaran.kartu.length - 1;
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
        <header
          className="sticky top-0 z-10"
          style={{ backgroundColor: "var(--bg-paper)", borderBottom: "1px solid var(--border)" }}
        >
          <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-3">
            <button
              onClick={onKembali}
              className="text-2xl transition hover:opacity-70"
              style={{ color: "var(--brand)" }}
            >←</button>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.warna} flex items-center justify-center text-xl shadow flex-shrink-0`}>
              {pelajaran.emoji}
            </div>
            <div className="flex-1">
              <h1 className="font-serif text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                {pelajaran.judul}
              </h1>
              <p className={`font-sans text-xs font-semibold ${meta.teks}`}>{unit.judul}</p>
            </div>
            <span className="font-sans text-xs font-mono" style={{ color: "var(--text-muted)" }}>
              {vocabIdx + 1}/{pelajaran.kartu.length}
            </span>
          </div>
          {/* Progress bar */}
          <div className="max-w-xl mx-auto px-4 pb-3">
            <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: "var(--bg-subtle)" }}>
              <div
                className={`h-full rounded-full bg-gradient-to-r ${meta.warna} transition-all`}
                style={{ width: `${((vocabIdx + 1) / pelajaran.kartu.length) * 100}%` }}
              />
            </div>
          </div>
        </header>

        <div className="max-w-xl mx-auto px-4 py-6">
          <div className="mb-4 flex items-center justify-center gap-3">
            <p className="font-sans text-xs uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              Kartu Kosakata
            </p>
            {/* Toggle audio otomatis */}
            <button
              onClick={toggleAutoPlay}
              className="font-sans text-xs font-semibold px-2.5 py-1 rounded-full border transition hover:opacity-80"
              style={
                autoPlay
                  ? { borderColor: "var(--brand)", backgroundColor: "var(--brand-light)", color: "var(--brand)" }
                  : { borderColor: "var(--border)", backgroundColor: "var(--bg-subtle)", color: "var(--text-muted)" }
              }
              title={autoPlay ? "Audio otomatis aktif — klik untuk mematikan" : "Audio otomatis mati — klik untuk menyalakan"}
            >
              {autoPlay ? "🔊 Auto" : "🔇 Mati"}
            </button>
          </div>

          {/* key={vocabIdx} → state flip kartu di-reset setiap pindah kartu */}
          <VocabCard
            key={vocabIdx}
            kartu={kartu}
            meta={meta}
            index={vocabIdx}
            total={pelajaran.kartu.length}
            lessonId={pelajaran.id}
            registerCard={registerCard}
            autoPlay={autoPlay}
          />

          <div className="flex gap-3 mt-6">
            {vocabIdx > 0 && (
              <button
                onClick={handleVocabPrev}
                className="flex-1 py-3 rounded-2xl border font-sans font-semibold transition"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)", backgroundColor: "var(--bg-paper)" }}
              >
                ← Sebelumnya
              </button>
            )}
            <button
              onClick={handleVocabNext}
              className={`flex-1 py-3 rounded-2xl text-white font-sans font-bold bg-gradient-to-r ${meta.warna} shadow-md hover:scale-105 transition-transform`}
            >
              {isLast ? "Mulai Kuis →" : "Berikutnya →"}
            </button>
          </div>

          {/* Chip navigasi kata — sengaja kecil agar beda dari tombol utama */}
          <div className="mt-8">
            <p className="font-sans text-xs mb-3 text-center uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              Lompat ke kata
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {pelajaran.kartu.map((k, i) => {
                const aktif  = i === vocabIdx;
                const lewat  = i < vocabIdx; // sudah dilewati
                return (
                  <button
                    key={i}
                    onClick={() => setVocabIdx(i)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-sans text-xs font-semibold border transition-all ${
                      aktif ? `${meta.border} ${meta.bg} ${meta.teks} border-2 scale-105 shadow-sm` : ""
                    }`}
                    style={
                      aktif
                        ? {}
                        : lewat
                        ? { borderColor: "var(--border)", backgroundColor: "var(--bg-subtle)", color: "var(--text-secondary)" }
                        : { borderColor: "var(--border)", backgroundColor: "var(--bg-paper)", color: "var(--text-muted)" }
                    }
                  >
                    <span className="text-sm">{lewat ? "✓" : k.emoji}</span>
                    {k.kata}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz phase (setelah vocab) ──
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      <header
        className="sticky top-0 z-10"
        style={{ backgroundColor: "var(--bg-paper)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => setFase("vocab")}
            className="text-2xl transition hover:opacity-70"
            style={{ color: "var(--brand)" }}
          >←</button>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.warna} flex items-center justify-center text-xl shadow flex-shrink-0`}>
            🧠
          </div>
          <div className="flex-1">
            <h1 className="font-serif text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              Kuis: {pelajaran.judul}
            </h1>
            <p className={`font-sans text-xs font-semibold ${meta.teks}`}>{unit.judul}</p>
          </div>
        </div>
      </header>
      <div className="max-w-xl mx-auto px-4 py-6">
        <MiniQuiz
          soalList={sesiLatihan}
          meta={meta}
          onSelesai={handleQuizSelesai}
        />
      </div>
    </div>
  );
}

// Auto-generate quiz dari kartu jika tidak ada soal (logika tidak diubah)
function generateSoalFromKartu(kartu) {
  if (!kartu || kartu.length < 4) return [];
  return kartu.slice(0, Math.min(5, kartu.length)).map((k, i) => {
    const salah = kartu.filter((_, j) => j !== i).sort(() => Math.random() - 0.5).slice(0, 3);
    const allPilihan = [k.arti, ...salah.map((s) => s.arti)].sort(() => Math.random() - 0.5);
    return {
      pertanyaan: `Apa arti kata "${k.kata}"?`,
      pilihan: allPilihan,
      jawaban: allPilihan.indexOf(k.arti),
    };
  });
}

// ─── HALAMAN UTAMA — 3 VIEW ───────────────────────────────────────────────────
export default function BelajarPage() {
  // Semua state & logika tidak diubah
  const [unitDipilih, setUnitDipilih]         = useState(null);
  const [pelajaranDipilih, setPelajaranDipilih] = useState(null);

  const { isLessonDone, isLessonUnlocked, getUnitProgress, completeLesson, loaded } = useLearning();
  const { config, level } = useLevel();
  const { registerCard } = useSRS();
  const userLevel = level || "a1";

  const unitsTampil = userLevel === "a1"
    ? unitBelajar.filter((u) => u.level === "a1")
    : userLevel === "a2"
    ? unitBelajar.filter((u) => u.level === "a1" || u.level === "a2")
    : unitBelajar;

  // ── View 3: Pelajaran ──
  if (pelajaranDipilih && unitDipilih) {
    const unit        = unitBelajar.find((u) => u.id === unitDipilih);
    const lessonIndex = unit.pelajaran.findIndex((p) => p.id === pelajaranDipilih);
    const pelajaran   = unit.pelajaran[lessonIndex];
    const nextLesson  = unit.pelajaran[lessonIndex + 1] || null;
    const currentUnitIdx = unitsTampil.findIndex((u) => u.id === unitDipilih);
    const nextUnit    = unitsTampil[currentUnitIdx + 1] || null;

    function handleSelesai()    { completeLesson(pelajaran.id); }
    function handleNextLesson() { if (nextLesson) setPelajaranDipilih(nextLesson.id); }
    function handleNextUnit()   { if (nextUnit) { setPelajaranDipilih(null); setUnitDipilih(nextUnit.id); } }

    return (
      <TampilanPelajaran
        key={pelajaranDipilih}
        unit={unit}
        pelajaran={pelajaran}
        lessonIndex={lessonIndex}
        onKembali={() => setPelajaranDipilih(null)}
        onSelesai={handleSelesai}
        sudahSelesai={isLessonDone(pelajaran.id)}
        nextLesson={nextLesson}
        onNextLesson={handleNextLesson}
        nextUnit={nextUnit}
        onNextUnit={handleNextUnit}
        registerCard={registerCard}
      />
    );
  }

  // ── View 2: Unit (daftar pelajaran) ──
  if (unitDipilih) {
    const unit = unitBelajar.find((u) => u.id === unitDipilih);
    const { done, total } = getUnitProgress(unitDipilih);
    const currentUnitIdx  = unitsTampil.findIndex((u) => u.id === unitDipilih);
    const nextUnit        = unitsTampil[currentUnitIdx + 1] || null;

    return (
      <main className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
        <header
          className="sticky top-0 z-10"
          style={{ backgroundColor: "var(--bg-paper)", borderBottom: "1px solid var(--border)" }}
        >
          <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-3">
            <button
              onClick={() => setUnitDipilih(null)}
              className="text-2xl transition hover:opacity-70"
              style={{ color: "var(--brand)" }}
            >←</button>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${unit.warna} flex items-center justify-center text-xl shadow flex-shrink-0`}>
              {unit.emoji}
            </div>
            <div className="flex-1">
              <h1 className={`font-serif text-lg font-semibold ${unit.teks}`}>{unit.judul}</h1>
              <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
                {done}/{total} pelajaran selesai
              </p>
            </div>
          </div>
        </header>

        <div className="max-w-xl mx-auto px-4 py-6">
          {/* Deskripsi unit */}
          <div className={`rounded-2xl border-2 ${unit.border} ${unit.bg} p-4 mb-6`}>
            <p className="font-sans text-sm" style={{ color: "var(--text-secondary)" }}>{unit.deskripsi}</p>
            <div className="mt-3 w-full h-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.5)" }}>
              <div
                className={`h-full rounded-full bg-gradient-to-r ${unit.warna} transition-all`}
                style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Daftar pelajaran */}
          <div className="flex flex-col gap-4">
            {unit.pelajaran.map((pelajaran, idx) => {
              const unlocked = isLessonUnlocked(unitDipilih, idx);
              const done     = isLessonDone(pelajaran.id);
              return (
                <button
                  key={pelajaran.id}
                  onClick={() => unlocked && setPelajaranDipilih(pelajaran.id)}
                  disabled={!unlocked}
                  className={`w-full text-left p-4 transition-all ${
                    done
                      ? `rounded-2xl border-2 ${unit.border} ${unit.bg} shadow-md`
                      : unlocked
                      ? "card-de"
                      : "rounded-2xl border opacity-60 cursor-not-allowed"
                  }`}
                  style={
                    !done && !unlocked
                      ? { borderColor: "var(--border)", backgroundColor: "var(--bg-subtle)" }
                      : {}
                  }
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                        done ? `bg-gradient-to-br ${unit.warna} shadow` : ""
                      }`}
                      style={!done ? { backgroundColor: "var(--bg-subtle)" } : {}}
                    >
                      {done ? "⭐" : unlocked ? pelajaran.emoji : "🔒"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p
                          className={`font-serif font-semibold text-base ${done ? unit.teks : ""}`}
                          style={!done ? { color: unlocked ? "var(--text-primary)" : "var(--text-muted)" } : {}}
                        >
                          {pelajaran.judul}
                        </p>
                        {done && (
                          <span
                            className="font-sans text-xs rounded-full px-2 py-0.5 border border-green-200 text-green-600 font-semibold"
                            style={{ backgroundColor: "var(--bg-paper)" }}
                          >
                            Selesai ✓
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {pelajaran.tipe === "vocab"
                          ? `${pelajaran.kartu.length} kartu kata + kuis`
                          : `${pelajaran.soal.length} soal kuis`}
                        {!unlocked && " · Selesaikan pelajaran sebelumnya"}
                      </p>
                    </div>
                    {unlocked && !done && (
                      <span className={`text-2xl ${unit.teks}`}>›</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigasi bawah */}
          <div className="mt-8 flex flex-col gap-3">
            {nextUnit && done === total && (
              <button
                onClick={() => setUnitDipilih(nextUnit.id)}
                className={`w-full py-4 rounded-2xl text-white font-sans font-bold text-base bg-gradient-to-r ${nextUnit.warna} shadow-lg hover:scale-105 transition-transform flex items-center justify-between px-6`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">{nextUnit.emoji}</span>
                  <span>
                    <span className="block font-sans text-xs font-normal opacity-80">Unit Berikutnya</span>
                    {nextUnit.judul}
                  </span>
                </span>
                <span className="text-2xl">→</span>
              </button>
            )}
            <button
              onClick={() => setUnitDipilih(null)}
              className="w-full py-3 rounded-2xl border font-sans font-semibold transition text-sm"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)", backgroundColor: "var(--bg-subtle)" }}
            >
              ← Kembali ke Semua Unit
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── View 1: Learning path overview ──
  const { totalDone, totalAll } = loaded
    ? unitsTampil.reduce(
        (acc, u) => {
          const p = getUnitProgress(u.id);
          return { totalDone: acc.totalDone + p.done, totalAll: acc.totalAll + p.total };
        },
        { totalDone: 0, totalAll: 0 }
      )
    : { totalDone: 0, totalAll: 0 };
  const totalPersen = totalAll > 0 ? Math.round((totalDone / totalAll) * 100) : 0;

  // Unit pertama yang terbuka tapi belum selesai — untuk tombol "Lanjutkan Belajar"
  const unitLanjut = loaded
    ? unitsTampil.find((u) => {
        const p = getUnitProgress(u.id);
        return isLessonUnlocked(u.id, 0) && p.done < p.total;
      })
    : null;

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      <header
        className="sticky top-0 z-10"
        style={{ backgroundColor: "var(--bg-paper)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-2xl transition hover:opacity-70" style={{ color: "var(--brand)" }}>
            ←
          </Link>
          <div>
            <h1 className="font-serif text-xl font-semibold" style={{ color: "var(--brand)" }}>
              🗺️ Belajar Terstruktur
            </h1>
            <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
              {totalDone}/{totalAll} pelajaran selesai · {unitsTampil.length} unit
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-6">

        {/* Kartu progress keseluruhan */}
        <div className="card-de p-5 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ backgroundColor: "var(--brand-light)", border: "1px solid var(--border)" }}
            >
              🎯
            </div>
            <div className="flex-1">
              <p className="font-serif font-semibold" style={{ color: "var(--text-primary)" }}>
                Progress Keseluruhan
              </p>
              <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
                Ikuti alur belajar dari awal hingga mahir
              </p>
            </div>
            <span className="font-sans text-2xl font-extrabold" style={{ color: "var(--brand)" }}>
              {totalPersen}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full" style={{ backgroundColor: "var(--bg-subtle)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${totalPersen}%`, backgroundColor: "var(--brand)" }}
            />
          </div>
        </div>

        {/* Tombol lanjutkan belajar — langsung ke unit yang sedang dikerjakan */}
        {totalDone > 0 && unitLanjut && (
          <button
            onClick={() => setUnitDipilih(unitLanjut.id)}
            className="w-full mb-6 py-4 px-6 rounded-2xl text-white font-sans font-bold flex items-center justify-between transition hover:opacity-90"
            style={{ backgroundColor: "var(--brand)", boxShadow: "var(--shadow-btn)" }}
          >
            <span className="flex items-center gap-3 text-left">
              <span className="text-2xl">{unitLanjut.emoji}</span>
              <span>
                <span className="block font-sans text-xs font-normal opacity-80">Lanjutkan Belajar</span>
                {unitLanjut.judul}
              </span>
            </span>
            <span className="text-2xl">→</span>
          </button>
        )}

        {/* Learning path */}
        <div className="relative">
          {/* Garis vertikal kiri */}
          <div
            className="absolute left-7 top-8 bottom-8 w-0.5"
            style={{ backgroundColor: "var(--border)" }}
          />

          <div className="flex flex-col gap-4">
            {unitsTampil.map((unit, unitIdx) => {
              const { done, total }     = loaded ? getUnitProgress(unit.id) : { done: 0, total: 0 };
              const firstLessonUnlocked = loaded ? isLessonUnlocked(unit.id, 0) : unitIdx === 0;
              const allDone  = done === total && total > 0;
              const persen   = total > 0 ? Math.round((done / total) * 100) : 0;

              const showA2Separator = unit.level === "a2" &&
                (unitIdx === 0 || unitsTampil[unitIdx - 1].level === "a1");
              const showB1Separator = unit.level === "b1" &&
                (unitIdx === 0 || unitsTampil[unitIdx - 1].level !== "b1");

              return (
                <div key={unit.id}>
                  {/* Separator A2 */}
                  {showA2Separator && (
                    <div className="relative pl-16 mb-2">
                      <div
                        className="rounded-2xl border px-5 py-3 flex items-center gap-3"
                        style={{ backgroundColor: "var(--a2-light)", borderColor: "var(--a2)" }}
                      >
                        <span className="text-2xl">📗</span>
                        <div>
                          <p className="font-serif font-semibold text-sm" style={{ color: "var(--a2)" }}>
                            Materi A2
                          </p>
                          <p className="font-sans text-xs" style={{ color: "var(--a2)", opacity: 0.75 }}>
                            Lanjutan setelah menguasai A1
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Separator B1 */}
                  {showB1Separator && (
                    <div className="relative pl-16 mb-2">
                      <div
                        className="rounded-2xl border px-5 py-3 flex items-center gap-3"
                        style={{ backgroundColor: "var(--b1-light)", borderColor: "var(--b1)" }}
                      >
                        <span className="text-2xl">🚀</span>
                        <div>
                          <p className="font-serif font-semibold text-sm" style={{ color: "var(--b1)" }}>
                            Materi B1
                          </p>
                          <p className="font-sans text-xs" style={{ color: "var(--b1)", opacity: 0.75 }}>
                            Level menengah CEFR — setelah menguasai A2
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="relative pl-16">
                    {/* Circle connector */}
                    <div
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-md border-2 border-white ${
                        allDone
                          ? `bg-gradient-to-br ${unit.warna}`
                          : firstLessonUnlocked
                          ? `bg-gradient-to-br ${unit.warna} opacity-70`
                          : "bg-gray-200"
                      }`}
                    >
                      {allDone ? "✓" : firstLessonUnlocked ? unit.emoji : "🔒"}
                    </div>

                    {/* Kartu unit */}
                    <button
                      onClick={() => firstLessonUnlocked && setUnitDipilih(unit.id)}
                      disabled={!firstLessonUnlocked}
                      className={`w-full text-left p-4 transition-all ${
                        allDone
                          ? `rounded-2xl border-2 ${unit.border} ${unit.bg} shadow-md`
                          : firstLessonUnlocked
                          ? "card-de"
                          : "rounded-2xl border opacity-50 cursor-not-allowed"
                      }`}
                      style={
                        !firstLessonUnlocked && !allDone
                          ? { borderColor: "var(--border)", backgroundColor: "var(--bg-subtle)" }
                          : {}
                      }
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          {/* Badge baris atas */}
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-sans text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                              Unit {unitIdx + 1}
                            </span>
                            {unit.level === "a2" && (
                              <span
                                className="font-sans text-xs rounded-full px-2 py-0.5 font-semibold"
                                style={{ backgroundColor: "var(--a2-light)", color: "var(--a2)" }}
                              >A2</span>
                            )}
                            {unit.level === "b1" && (
                              <span
                                className="font-sans text-xs rounded-full px-2 py-0.5 font-semibold"
                                style={{ backgroundColor: "var(--b1-light)", color: "var(--b1)" }}
                              >B1</span>
                            )}
                            {allDone && (
                              <span
                                className="font-sans text-xs rounded-full px-2 py-0.5 border border-green-200 text-green-600 font-semibold"
                                style={{ backgroundColor: "var(--bg-paper)" }}
                              >Selesai ✓</span>
                            )}
                            {!firstLessonUnlocked && (
                              <span
                                className="font-sans text-xs rounded-full px-2 py-0.5"
                                style={{ backgroundColor: "var(--bg-subtle)", color: "var(--text-muted)" }}
                              >Terkunci</span>
                            )}
                          </div>

                          {/* Judul unit */}
                          <p
                            className={`font-serif font-semibold text-base ${firstLessonUnlocked ? unit.teks : ""}`}
                            style={!firstLessonUnlocked ? { color: "var(--text-muted)" } : {}}
                          >
                            {unit.judul}
                          </p>

                          {/* Deskripsi */}
                          <p className="font-sans text-xs mt-0.5 leading-snug" style={{ color: "var(--text-muted)" }}>
                            {unit.deskripsi}
                          </p>

                          {/* Progress bar unit */}
                          {firstLessonUnlocked && (
                            <div className="mt-2">
                              <div className="flex justify-between font-sans text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                                <span>{done}/{total} pelajaran</span>
                                <span>{persen}%</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: "var(--bg-subtle)" }}>
                                <div
                                  className={`h-full rounded-full bg-gradient-to-r ${unit.warna} transition-all`}
                                  style={{ width: `${persen}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
            Ikuti urutan unit untuk hasil belajar terbaik 🎓
          </p>
        </div>
      </div>
    </main>
  );
}
