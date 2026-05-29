import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata = {
  title: "Daniel English",
  description: "Aplikasi belajar bahasa Inggris Daniel",
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
