'use client';

import { useState, useEffect } from 'react';

export default function ReaderSection() {
  const totalPages = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const prevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const nextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevPage();
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section id="buku-saku" className="section reader-section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Materi Pembelajaran Lengkap</div>
          <h2 className="section-title">Buku Saku Digital Mobile</h2>
          <p className="section-desc">
            Telusuri 8 halaman buku panduan <em>&quot;Pengelolaan Sampah Berbasis Digital Mobile&quot;</em> langsung di layar Anda atau unduh dokumen lengkapnya.
          </p>
        </div>

        <div className="reader-container">
          {/* Toolbar */}
          <div className="reader-toolbar">
            <div className="reader-toolbar__nav">
              <button
                className="btn btn--outline btn--sm"
                onClick={prevPage}
                disabled={currentPage === 1}
                title="Halaman Sebelumnya"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Sebelumnya
              </button>

              <div className="page-indicator">
                Halaman <span className="page-highlight">{currentPage}</span> dari {totalPages}
              </div>

              <button
                className="btn btn--outline btn--sm"
                onClick={nextPage}
                disabled={currentPage === totalPages}
                title="Halaman Berikutnya"
              >
                Berikutnya
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>

            <div className="reader-toolbar__actions">
              <button
                className="btn btn--ghost btn--sm"
                onClick={() => setIsModalOpen(true)}
                title="Perbesar Tampilan"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="11" y1="8" x2="11" y2="14"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
                Perbesar
              </button>
              <a
                href="/buku-saku-pengelolaan-sampah.pdf"
                download
                className="btn btn--primary btn--sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Unduh Buku PDF (16 MB)
              </a>
            </div>
          </div>

          {/* Main Stage */}
          <div className="reader-stage">
            <button
              className="stage-nav stage-nav--prev"
              onClick={prevPage}
              disabled={currentPage === 1}
              aria-label="Halaman Sebelumnya"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <div
              className="reader-stage__content"
              onClick={() => setIsModalOpen(true)}
              style={{ cursor: 'zoom-in' }}
            >
              <img
                src={`/buku-saku/page-${currentPage}.png`}
                alt={`Halaman Buku Saku ${currentPage}`}
                className="reader-page-image"
              />
            </div>

            <button
              className="stage-nav stage-nav--next"
              onClick={nextPage}
              disabled={currentPage === totalPages}
              aria-label="Halaman Berikutnya"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          {/* Thumbnails */}
          <div className="reader-thumbnails">
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              return (
                <div
                  key={p}
                  className={`thumb-card ${currentPage === p ? 'is-active' : ''}`}
                  onClick={() => setCurrentPage(p)}
                >
                  <img src={`/buku-saku/page-${p}.png`} alt={`Thumbnail ${p}`} />
                  <span>Hal {p}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isModalOpen && (
        <div className="modal is-open" role="dialog" aria-modal="true">
          <div className="modal__backdrop" onClick={() => setIsModalOpen(false)}></div>
          <div className="modal__dialog">
            <button
              className="modal__close"
              onClick={() => setIsModalOpen(false)}
              aria-label="Tutup"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="modal__body">
              <img
                src={`/buku-saku/page-${currentPage}.png`}
                alt={`Halaman ${currentPage}`}
              />
            </div>
            <div className="modal__caption">
              Buku Saku Pengelolaan Sampah - Halaman {currentPage} dari {totalPages}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

