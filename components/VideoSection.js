'use client';

import { useState, useRef, useEffect } from 'react';

export default function VideoSection() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(102);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(console.warn);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const jumpToTime = (timeInSeconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timeInSeconds;
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(console.warn);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen().catch(console.warn);
      } else {
        document.exitFullscreen();
      }
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <section id="video-edukasi" className="section video-section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">Media Pembelajaran Visual</div>
          <h2 className="section-title">Video Edukasi Pengelolaan Sampah</h2>
          <p className="section-desc">
            Saksikan tayangan panduan pengelolaan dan pemilahan sampah praktis yang dapat langsung diterapkan saat berwisata di Kampoeng Radja Jambi maupun di rumah.
          </p>
        </div>

        <div className="video-grid">
          {/* Video Frame */}
          <div className="video-frame-column">
            <div className="phone-mockup">
              <div className="phone-mockup__speaker"></div>
              <div className="video-wrapper">
                <video
                  ref={videoRef}
                  playsInline
                  preload="metadata"
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                  onClick={togglePlay}
                >
                  <source src="/video_edukasi_h264.mp4" type="video/mp4" />
                  Peramban Anda tidak mendukung pemutar video HTML5.
                </video>

                <div
                  className={`video-overlay ${isPlaying ? 'is-hidden' : ''}`}
                  onClick={togglePlay}
                >
                  <button className="video-play-btn" aria-label="Putar Video">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </button>
                  <span className="video-overlay__hint">Klik untuk Memutar Tayangan</span>
                </div>
              </div>

              {/* Controls */}
              <div className="video-controls-bar">
                <button className="v-btn" onClick={togglePlay} title="Play/Pause">
                  {isPlaying ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16"></rect>
                      <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  )}
                </button>
                <div className="v-time">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
                <div
                  className="v-progress-container"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pos = (e.clientX - rect.left) / rect.width;
                    if (videoRef.current) {
                      videoRef.current.currentTime = pos * duration;
                    }
                  }}
                >
                  <div className="v-progress-bar" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <button className="v-btn" onClick={toggleMute} title="Mute/Unmute">
                  {isMuted ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                  )}
                </button>
                <button className="v-btn" onClick={toggleFullscreen} title="Layar Penuh">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Chapters */}
          <div className="video-info-column">
            <div className="info-card">
              <span className="badge-mini">Format Edukasi Vertikal (9:16)</span>
              <h3>Poin Utama Video Pembelajaran</h3>
              <p>Materi dalam video ini dirancang ringkas, mudah dipahami generasi muda, dan fokus pada aksi konkret di lapangan:</p>

              <div className="chapter-list">
                <div className="chapter-item" onClick={() => jumpToTime(0)}>
                  <div className="chapter-item__time">00:00</div>
                  <div className="chapter-item__text">
                    <strong>Urgensi Pengelolaan Sampah</strong>
                    <p>Dampak penumpukan sampah bagi ekosistem dan keindahan lingkungan wisata.</p>
                  </div>
                </div>

                <div className="chapter-item" onClick={() => jumpToTime(25)}>
                  <div className="chapter-item__time">00:25</div>
                  <div className="chapter-item__text">
                    <strong>Metode Pemilahan dari Sumber</strong>
                    <p>Membedakan jenis sampah organik, anorganik, dan sampah beracun (B3).</p>
                  </div>
                </div>

                <div className="chapter-item" onClick={() => jumpToTime(50)}>
                  <div className="chapter-item__time">00:50</div>
                  <div className="chapter-item__text">
                    <strong>Penerapan 3R di Tempat Wisata</strong>
                    <p>Reduce, Reuse, Recycle saat menikmati wahana di Kampoeng Radja Jambi.</p>
                  </div>
                </div>

                <div className="chapter-item" onClick={() => jumpToTime(75)}>
                  <div className="chapter-item__time">01:15</div>
                  <div className="chapter-item__text">
                    <strong>Kolaborasi & Aksi Berkelanjutan</strong>
                    <p>Komitmen bersama pengelola dan pengunjung demi lingkungan bebas polusi.</p>
                  </div>
                </div>
              </div>

              <div className="video-action-box">
                <p>Ingin mempelajari materi lebih komprehensif dalam bentuk lembar kerja bacaan?</p>
                <a href="#buku-saku" className="btn btn--primary btn--sm">Buka Buku Saku Digital</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

