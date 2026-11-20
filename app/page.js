'use client';

import { useState } from 'react';
import AttendanceModal from '@/components/AttendanceModal';
import VideoSection from '@/components/VideoSection';
import ReaderSection from '@/components/ReaderSection';
import CalculatorSection from '@/components/CalculatorSection';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Attendance Modal Check (1 day 1 time per user) */}
      <AttendanceModal />


      {/* Header */}
      <header className="header">
        <div className="container header__inner">
          <a href="#" className="brand">
            <div className="brand__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M7 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"></path>
                <path d="M12 9v6"></path>
                <path d="M9 12h6"></path>
              </svg>
            </div>
            <div className="brand__text">
              <span className="brand__title">EdukasiSampah</span>
              <span className="brand__subtitle">x Kampoeng Radja Jambi</span>
            </div>
          </a>

          <nav className={`nav ${mobileMenuOpen ? 'is-open' : ''}`}>
            <ul className="nav__list">
              <li>
                <a href="#video-edukasi" className="nav__link" onClick={() => setMobileMenuOpen(false)}>
                  Video Edukasi
                </a>
              </li>
              <li>
                <a href="#buku-saku" className="nav__link" onClick={() => setMobileMenuOpen(false)}>
                  Buku Saku
                </a>
              </li>
              <li>
                <a href="#kategori-sampah" className="nav__link" onClick={() => setMobileMenuOpen(false)}>
                  Panduan Pemilahan
                </a>
              </li>
              <li>
                <a href="#kalkulator-dampak" className="nav__link" onClick={() => setMobileMenuOpen(false)}>
                  Kalkulator Jejak
                </a>
              </li>
              <li>
                <a href="#mitra" className="nav__link" onClick={() => setMobileMenuOpen(false)}>
                  Tentang Mitra
                </a>
              </li>
            </ul>
          </nav>

          <div className="header__action">
            <a href="/admin" className="btn btn--outline btn--sm" title="Akses Halaman Admin">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>Admin</span>
            </a>
            <a href="/buku-saku-pengelolaan-sampah.pdf" download className="btn btn--primary btn--sm btn-header-pdf">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Unduh PDF</span>
            </a>
            {/* Hamburger Toggle */}
            <button
              className="btn-hamburger"
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="container hero__inner">
            <div className="hero__content">
              <div className="hero__tag">
                <span className="dot-indicator"></span>
                Wisata Bersih & Lingkungan Asri
              </div>
              <h1 className="hero__title">
                Wujudkan Destinasi Hijau dengan Pengelolaan Sampah Modern
              </h1>
              <p className="hero__desc">
                Panduan interaktif dan terpadu berbasis digital mobile untuk pengunjung wisata, komunitas, dan pengelola. Mulai langkah nyata kurangi timbunan sampah dari diri sendiri, keluarga, hingga tempat rekreasi.
              </p>

              <div className="hero__cta">
                <a href="#video-edukasi" className="btn btn--primary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  Tonton Video Edukasi
                </a>
                <a href="#buku-saku" className="btn btn--secondary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  Buka Buku Saku Digital
                </a>
              </div>

              <div className="hero__metrics">
                <div className="metric-item">
                  <span className="metric-item__num">8</span>
                  <span className="metric-item__label">Halaman Panduan Praktis</span>
                </div>
                <div className="metric-divider"></div>
                <div className="metric-item">
                  <span className="metric-item__num">4</span>
                  <span className="metric-item__label">Kategori Pemilahan Sampah</span>
                </div>
                <div className="metric-divider"></div>
                <div className="metric-item">
                  <span className="metric-item__num">100%</span>
                  <span className="metric-item__label">Aksi Nyata Berkelanjutan</span>
                </div>
              </div>
            </div>

            <div className="hero__visual">
              <div className="hero__card-preview">
                <div className="preview-badge">Mitra Edukasi Resmi</div>
                <div className="preview-image-wrap">
                  <img
                    src="/buku-saku/page-1.png"
                    alt="Sampul Buku Saku"
                    className="preview-cover"
                  />
                </div>
                <div className="preview-info">
                  <h3>Buku Saku Digital Mobile</h3>
                  <p>Oleh Erris, Bambang Swerda, Bambang Ariyadi, V.A Irmayanti Harahap</p>
                  <div className="preview-tags">
                    <span>Edukasi 3R</span>
                    <span>Pilah Sampah</span>
                    <span>Kampoeng Radja</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Video */}
        <VideoSection />

        {/* Section 2: Reader */}
        <ReaderSection />

        {/* Section 3: Categories */}
        <section id="kategori-sampah" className="section categories-section">
          <div className="container">
            <div className="section-header">
              <div className="section-tag">Praktik Lapangan</div>
              <h2 className="section-title">Panduan Pemilahan Sampah Terpadu</h2>
              <p className="section-desc">
                Pilah sampah sesuai wadah dan kategorinya saat berkunjung ke Kampoeng Radja Jambi guna memudahkan proses daur ulang dan komposting.
              </p>
            </div>

            <div className="categories-grid">
              {/* Organik */}
              <div className="waste-card waste-card--organic">
                <div className="waste-card__badge">Wadah Hijau</div>
                <div className="waste-card__icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9a9 9 0 0 1-9-9 9 9 0 0 1 9-9z"></path>
                    <path d="M12 11c0 3 2 5 5 5"></path>
                    <path d="M12 7c-3 0-5 2-5 5"></path>
                  </svg>
                </div>
                <h3 className="waste-card__title">Sampah Organik</h3>
                <p className="waste-card__desc">Sampah alami yang mudah membusuk dan terurai secara hayati oleh mikroorganisme tanah.</p>
                <ul className="waste-card__items">
                  <li>Sisa makanan, kulit buah, & sayuran</li>
                  <li>Daun gugur dan ranting tanaman taman</li>
                  <li>Ampas kopi, teh, dan cangkang telur</li>
                </ul>
                <div className="waste-card__action-hint">
                  <strong>Pengolahan:</strong> Dijadikan kompos alami untuk pupuk taman hijau Kampoeng Radja.
                </div>
              </div>

              {/* Anorganik */}
              <div className="waste-card waste-card--inorganic">
                <div className="waste-card__badge">Wadah Kuning</div>
                <div className="waste-card__icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                </div>
                <h3 className="waste-card__title">Sampah Anorganik</h3>
                <p className="waste-card__desc">Sampah sintetis non-hayati yang tidak mudah membusuk namun memiliki nilai daur ulang tinggi.</p>
                <ul className="waste-card__items">
                  <li>Botol plastik PET, gelas mineral, sedotan</li>
                  <li>Kaleng minuman & wadah aluminium</li>
                  <li>Kardus, kertas bersih, dan karton kemasan</li>
                </ul>
                <div className="waste-card__action-hint">
                  <strong>Pengolahan:</strong> Dikumpulkan untuk bank sampah & daur ulang industri kreatif.
                </div>
              </div>

              {/* B3 */}
              <div className="waste-card waste-card--b3">
                <div className="waste-card__badge">Wadah Merah</div>
                <div className="waste-card__icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <h3 className="waste-card__title">Limbah B3 (Berbahaya)</h3>
                <p className="waste-card__desc">Bahan Berbahaya dan Beracun yang dapat membahayakan kesehatan serta mencemari tanah/air.</p>
                <ul className="waste-card__items">
                  <li>Baterai bekas, aki, dan kabel rusak</li>
                  <li>Kemasan pestisida, racun serangga, obat</li>
                  <li>Pecahan lampu neon & elektronik rusak</li>
                </ul>
                <div className="waste-card__action-hint">
                  <strong>Pengolahan:</strong> Penanganan terpisah dengan prosedur limbah khusus berizin.
                </div>
              </div>

              {/* Residu */}
              <div className="waste-card waste-card--residual">
                <div className="waste-card__badge">Wadah Abu-abu</div>
                <div className="waste-card__icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </div>
                <h3 className="waste-card__title">Sampah Residu</h3>
                <p className="waste-card__desc">Sampah yang sulit didaur ulang secara ekonomis maupun teknis saat ini dan harus berakhir di TPA.</p>
                <ul className="waste-card__items">
                  <li>Tisu kotor, masker medis sekali pakai</li>
                  <li>Pembalut, popok bekas, kapas kosmetik</li>
                  <li>Styrofoam kotor berminyak & plastik sobek kecil</li>
                </ul>
                <div className="waste-card__action-hint">
                  <strong>Pengolahan:</strong> Diangkut langsung ke Tempat Pemrosesan Akhir secara higienis.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Kalkulator */}
        <CalculatorSection />

        {/* Section 5: Mitra */}
        <section id="mitra" className="section mitra-section">
          <div className="container">
            <div className="mitra-grid">
              <div className="mitra-card">
                <div className="mitra-badge">Mitra Destinasi & Edukasi</div>
                <h2>Kampoeng Radja Jambi</h2>
                <p>
                  <strong>Kampoeng Radja</strong> merupakan salah satu ikon destinasi wisata keluarga, rekreasi, dan edukasi terkemuka di Kota Jambi. Berkomitmen menghadirkan kawasan yang asri, bersih, dan ramah lingkungan bagi seluruh pengunjung.
                </p>
                <p>
                  Melalui program kolaborasi ini, Kampoeng Radja mengedukasi wisatawan mengenai pentingnya menjaga kebersihan wahana, pemilahan sampah organik dan anorganik di titik-titik rekreasi, serta membangun kebiasaan peduli lingkungan berkelanjutan.
                </p>
                <div className="mitra-features">
                  <div className="mitra-feat">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>Tempat Sampah Terpilah di Setiap Wahana</span>
                  </div>
                  <div className="mitra-feat">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>Edukasi Konservasi Alam & Ruang Terbuka Hijau</span>
                  </div>
                  <div className="mitra-feat">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>Dukungan Materi Digital Mobile Bagi Pengunjung</span>
                  </div>
                </div>
              </div>

              <div className="author-card">
                <div className="author-header">
                  <h3>Tim Penyusun Materi Buku Saku</h3>
                  <p>Materi edukasi disusun secara terpadu untuk penguatan literasi lingkungan hidup:</p>
                </div>

                <ul className="author-list">
                  <li>
                    <div className="author-avatar">E</div>
                    <div>
                      <strong>Erris</strong>
                      <span>Penyusun & Peneliti Edukasi Lingkungan</span>
                    </div>
                  </li>
                  <li>
                    <div className="author-avatar">BS</div>
                    <div>
                      <strong>Bambang Swerda</strong>
                      <span>Penyusun & Praktisi Pengelolaan Lingkungan</span>
                    </div>
                  </li>
                  <li>
                    <div className="author-avatar">BA</div>
                    <div>
                      <strong>Bambang Ariyadi</strong>
                      <span>Penyusun & Pengembang Materi Edukasi</span>
                    </div>
                  </li>
                  <li>
                    <div className="author-avatar">VI</div>
                    <div>
                      <strong>V.A Irmayanti Harahap</strong>
                      <span>Penyusun & Kolaborator Program</span>
                    </div>
                  </li>
                </ul>

                <div className="author-footer">
                  <a href="/buku-saku-pengelolaan-sampah.pdf" download className="btn btn--secondary btn--block">
                    Unduh Buku Saku Asli (.PDF)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__brand">
            <div className="brand brand--footer">
              <div className="brand__icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M7 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"></path>
                  <path d="M12 9v6"></path>
                  <path d="M9 12h6"></path>
                </svg>
              </div>
              <span className="brand__title">Edukasi Pengelolaan Sampah</span>
            </div>
            <p className="footer__desc">
              Inisiatif kolaboratif edukasi lingkungan hidup bersama Kampoeng Radja Jambi. Mari jaga bumi tetap bersih mulai dari langkah kecil hari ini.
            </p>
          </div>

          <div className="footer__links">
            <div className="footer__col">
              <h4>Navigasi Halaman</h4>
              <ul>
                <li><a href="#video-edukasi">Video Edukasi (H.264)</a></li>
                <li><a href="#buku-saku">Buku Saku Digital 8 Hal</a></li>
                <li><a href="#kategori-sampah">Panduan 4 Jenis Sampah</a></li>
                <li><a href="#kalkulator-dampak">Kalkulator Simulasi Jejak</a></li>
              </ul>
            </div>
            <div className="footer__col">
              <h4>Admin & Aset</h4>
              <ul>
                <li><a href="/admin">Dashboard Admin Kunjungan</a></li>
                <li><a href="/buku-saku-pengelolaan-sampah.pdf" download>Unduh PDF Buku Saku</a></li>
                <li><a href="/video_edukasi_h264.mp4" download>Unduh Video Edukasi</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="container footer__bottom-inner">
            <p>&copy; 2026 Edukasi Pengelolaan Sampah & Kampoeng Radja Jambi. All rights reserved.</p>
            <p className="footer__credit">Berbasis Digital Mobile untuk Kelestarian Lingkungan.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

