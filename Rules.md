# Rules.md - Engineering & Security Standards

Dokumen ini berisi aturan standar pengkodean (coding standards), pedoman keamanan (security rules), serta kriteria refactoring untuk mencegah dead code dan kebocoran memori pada aplikasi Web Photobooth.

---

## 1. Aturan Keamanan & Sanitasi (Security Engineering Rules)

### 1.1 SVG Sanitization (Anti-XSS)
- **Aturan:** Dilarang keras menggunakan `dangerouslySetInnerHTML` untuk merender berkas bingkai (SVG).
- **Implementasi:** Semua SVG overlay harus di-load via tag `<Image>` atau di-parse menggunakan `DOMParser` dengan sanitasi `DOMPurify` sebelum dirender ke HTML5 Canvas.

```typescript
// BAD: Rentan XSS
<div dangerouslySetInnerHTML={{ __html: frameSvgContent }} />

// GOOD: Sanitasi sebelum konsumsi Canvas
import DOMPurify from 'isomorphic-dompurify';
const cleanSvg = DOMPurify.sanitize(frameSvgContent, { USE_PROFILES: { svg: true } });
1.2 WebRTC & Media Stream Cleanup
Aturan: Setiap kali komponen CameraPreview di-unmount atau pengguna berpindah langkah, semua track kamera wajib dihentikan (stop()).

Implementasi:

TypeScript
useEffect(() => {
  return () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };
}, []);
1.3 Memory Leak & Canvas Disposal
Aturan: Setiap objek HTMLImageElement atau OffscreenCanvas yang dibuat secara terpisah harus dilepas dari memori (image.onload = null, canvas.width = 0).

Implementasi: Panggil URL.revokeObjectURL(blobUrl) segera setelah URL Blob selesai digunakan untuk ekspor foto atau print.

2. Refactoring & Dead Code Elimination
2.1 Pembersihan Dead Code
Hapus semua pustaka berlebih seperti lodash utuh (gunakan lodash-es atau fungsi native JavaScript).

Gunakan ESLint rule no-unused-vars dan import/no-unused-modules.

Matikan console.log pada lingkungan produksi menggunakan konfigurasi Next.js (compiler.removeConsole).

2.2 Struktur Kode Multi-Role (Skill Separation)
Setiap modularitas tugas dipisahkan sesuai peran:

Product Manager: PRD.md & Schema.md

Security Engineer: Architecture.md (bagian threat model) & Rules.md

Product Designer: Design.md

3. Standard UI & Performa (Framer Motion & Rendering)
Re-render Prevention: Bungkus elemen canvas dan editor slot foto dalam React.memo atau useCallback agar interaksi drag/zoom tidak memicu re-render pada komponen UI sekitarnya.

Layout Shift (CLS): Tentukan rasio aspek tetap (aspect-square atau aspect-[2/3]) pada pembungkus frame menggunakan CSS agar tidak terjadi perpindahan tata letak saat gambar frame selesai dimuat.

Print Media Rules: Gunakan @media print dengan ukuran tetap @page { size: A6 portrait; margin: 0; } agar hasil cetak pas di kertas foto tanpa memunculkan header/footer browser.

4. Code Review Checklist (Sebelum Commit)
[ ] Apakah semua media stream (kamera) sudah di-stop saat unmount?

[ ] Apakah URL.revokeObjectURL dipanggil setelah ekspor/cetak gambar?

[ ] Apakah SVG frame disanitasi menggunakan DOMPurify?

[ ] Apakah animasi AnimatePresence pada Framer Motion menggunakan mode="wait"?

[ ] Apakah tidak ada console.log atau variabel yang tidak terpakai (unused variables)?