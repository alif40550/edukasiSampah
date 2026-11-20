import './globals.css';

export const metadata = {
  title: 'Edukasi Pengelolaan Sampah | Mitra Kampoeng Radja Jambi',
  description: 'Dashboard edukasi pengelolaan sampah berbasis digital mobile berkolaborasi dengan Kampoeng Radja Jambi. Akses video edukasi, buku saku digital, dan kalkulator dampak lingkungan.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* Google Identity Services for Google OAuth */}
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body>{children}</body>
    </html>
  );
}

