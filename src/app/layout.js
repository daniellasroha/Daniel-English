import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";

// metadataBase dipakai untuk membuat URL absolut og-image saat dibagikan.
// Setelah deploy, set NEXT_PUBLIC_SITE_URL di environment (mis. https://daniel-english.vercel.app)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Daniel English — Belajar Bahasa Inggris",
    template: "%s · Daniel English",
  },
  description:
    "Belajar bahasa Inggris mudah & menyenangkan: 72 unit belajar terstruktur CEFR A1–B1, kuis interaktif, listening, reading, dan speaking — gratis dalam bahasa Indonesia.",
  keywords: [
    "belajar bahasa inggris",
    "bahasa inggris pemula",
    "CEFR A1",
    "grammar",
    "kosakata bahasa inggris",
    "latihan bahasa inggris gratis",
  ],
  openGraph: {
    title: "Daniel English — Belajar Bahasa Inggris",
    description:
      "72 unit belajar terstruktur CEFR A1–B1, kuis interaktif, listening, reading, dan speaking — gratis dalam bahasa Indonesia.",
    url: siteUrl,
    siteName: "Daniel English",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daniel English — Belajar Bahasa Inggris",
    description:
      "Belajar bahasa Inggris mudah & menyenangkan — 72 unit CEFR A1–B1, gratis dalam bahasa Indonesia.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* Aktifkan dark mode sebelum halaman render agar tidak ada flash putih */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('daniel_english_dark')==='true'){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
      </head>
      <body>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
