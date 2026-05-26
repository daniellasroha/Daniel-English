# English Learning App — Project Context for Claude Code

## Tujuan Proyek
Membangun aplikasi web belajar bahasa Inggris yang interaktif dan kompleks untuk pemula.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Language:** JavaScript (bukan TypeScript)
- **Runtime:** Node.js v24.x

## Struktur Folder
```
english-app/
├── src/
│   ├── app/           ← halaman-halaman (Next.js App Router)
│   ├── components/    ← komponen UI yang bisa dipakai ulang
│   └── data/          ← data konten pelajaran (kosakata, grammar, dll)
├── public/            ← file statis (gambar, audio)
├── CLAUDE.md          ← file ini
└── package.json
```

## Konvensi Koding
- Gunakan JavaScript biasa (bukan TypeScript)
- Nama komponen: PascalCase (contoh: VocabCard.js)
- Nama file halaman: gunakan folder dengan page.js di dalam
- CSS: Tailwind utility classes, hindari CSS custom kecuali perlu
- Komentar dalam bahasa Indonesia agar mudah dipahami Daniel

## Fitur yang Direncanakan
1. **Halaman Beranda** — menu utama dengan pilihan kategori pelajaran
2. **Vocabulary** — belajar kosakata dengan gambar dan audio
3. **Grammar** — latihan tata bahasa dengan penjelasan
4. **Quiz** — kuis interaktif dengan penilaian
5. **Listening** — latihan mendengar dengan Web Speech API
6. **Progress** — tracking kemajuan belajar pengguna

## Perintah Penting
```bash
npm run dev      # jalankan server development (http://localhost:3000)
npm run build    # build untuk production
npm run lint     # cek error kode
```

## Catatan untuk Developer (Daniel)
- Kamu pemula di coding — tanyakan apapun yang tidak dimengerti
- Setiap fitur dibangun bertahap, satu per satu
- Test selalu di browser setelah setiap perubahan
