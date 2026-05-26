import "./globals.css";

export const metadata = {
  title: "Daniel English",
  description: "Aplikasi belajar bahasa Inggris Daniel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
