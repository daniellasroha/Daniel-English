// OG Image — gambar yang tampil saat link dibagikan ke WhatsApp/FB/Twitter/dll
// Di-generate otomatis oleh Next.js (next/og) — tidak perlu file PNG manual
import { ImageResponse } from "next/og";

export const alt = "Daniel English — Belajar bahasa Inggris mudah & menyenangkan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#6C5CE0",
          backgroundImage: "linear-gradient(135deg, #6C5CE0 0%, #8B7DE8 100%)",
        }}
      >
        {/* Logo bulat */}
        <div
          style={{
            width: 130,
            height: 130,
            borderRadius: 32,
            backgroundColor: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 80,
            fontWeight: 700,
            color: "#6C5CE0",
            marginBottom: 36,
            fontFamily: "Georgia, serif",
          }}
        >
          D
        </div>

        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            color: "#FFFFFF",
            fontFamily: "Georgia, serif",
            marginBottom: 16,
          }}
        >
          Daniel English
        </div>

        <div style={{ fontSize: 34, color: "#E5DFF5", marginBottom: 44 }}>
          Belajar bahasa Inggris mudah &amp; menyenangkan
        </div>

        {/* Pills fitur */}
        <div style={{ display: "flex", gap: 16 }}>
          {["📚 72 Unit Belajar", "🎯 CEFR A1–B1", "🎤 4 Keterampilan"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                padding: "14px 30px",
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.18)",
                color: "#FFFFFF",
                fontSize: 27,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
