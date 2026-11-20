/**
 * Edukasi Pengelolaan Sampah x Kampoeng Radja Jambi
 * Interactive Logic (Video Player, Digital Reader, Impact Calculator, Lightbox)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Digital Reader (Buku Saku) Module
  initReaderModule();

  // 2. Video Player Module
  initVideoPlayerModule();

  // 3. Impact Calculator Module
  initImpactCalculatorModule();

  // 4. Smooth Anchor Scrolling
  initSmoothScroll();
});

/* ==========================================================================
   1. Reader Module (Buku Saku 8 Halaman)
   ========================================================================== */
function initReaderModule() {
  const totalPages = 8;
  let currentPage = 1;

  const activePageImg = document.getElementById('activePageImage');
  const currentPageNum = document.getElementById('currentPageNum');
  const prevPageBtn = document.getElementById('prevPageBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');
  const stagePrev = document.getElementById('stagePrev');
  const stageNext = document.getElementById('stageNext');
  const zoomBtn = document.getElementById('zoomPageBtn');
  const thumbCards = document.querySelectorAll('.thumb-card');

  // Lightbox elements
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImage');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const lightboxCaption = document.getElementById('lightboxCaption');

  function updatePage(newPage) {
    if (newPage < 1 || newPage > totalPages) return;
    currentPage = newPage;

    // Update main image with subtle fade transition
    activePageImg.style.opacity = '0.5';
    setTimeout(() => {
      activePageImg.src = `assets/buku-saku/page-${currentPage}.png`;
      activePageImg.alt = `Halaman Buku Saku ${currentPage}`;
      activePageImg.style.opacity = '1';
    }, 80);

    // Update page text
    if (currentPageNum) currentPageNum.textContent = currentPage;

    // Update active thumb
    thumbCards.forEach(card => {
      const page = parseInt(card.getAttribute('data-page'), 10);
      if (page === currentPage) {
        card.classList.add('is-active');
        // Ensure thumb is scrolled into view smoothly
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        card.classList.remove('is-active');
      }
    });

    // Update buttons disabled state
    if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
    if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages;
  }

  // Prev / Next button listeners
  if (prevPageBtn) prevPageBtn.addEventListener('click', () => updatePage(currentPage - 1));
  if (nextPageBtn) nextPageBtn.addEventListener('click', () => updatePage(currentPage + 1));
  if (stagePrev) stagePrev.addEventListener('click', () => updatePage(currentPage - 1));
  if (stageNext) stageNext.addEventListener('click', () => updatePage(currentPage + 1));

  // Thumbnail click
  thumbCards.forEach(card => {
    card.addEventListener('click', () => {
      const page = parseInt(card.getAttribute('data-page'), 10);
      updatePage(page);
    });
  });

  // Zoom / Lightbox functionality
  function openLightbox() {
    if (!modal) return;
    modalImg.src = `assets/buku-saku/page-${currentPage}.png`;
    lightboxCaption.textContent = `Buku Saku Pengelolaan Sampah - Halaman ${currentPage} dari ${totalPages}`;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (activePageImg) activePageImg.addEventListener('click', openLightbox);
  if (zoomBtn) zoomBtn.addEventListener('click', openLightbox);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeLightbox);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeLightbox);

  // Keyboard navigation for reader
  document.addEventListener('keydown', (e) => {
    if (modal && modal.classList.contains('is-open')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft' && currentPage > 1) {
        updatePage(currentPage - 1);
        modalImg.src = `assets/buku-saku/page-${currentPage}.png`;
      }
      if (e.key === 'ArrowRight' && currentPage < totalPages) {
        updatePage(currentPage + 1);
        modalImg.src = `assets/buku-saku/page-${currentPage}.png`;
      }
    } else {
      // If reader is in viewport
      const rect = document.getElementById('buku-saku')?.getBoundingClientRect();
      if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
        if (e.key === 'ArrowLeft' && currentPage > 1) updatePage(currentPage - 1);
        if (e.key === 'ArrowRight' && currentPage < totalPages) updatePage(currentPage + 1);
      }
    }
  });
}

/* ==========================================================================
   2. Video Player Module (Vertikal 9:16 H.264)
   ========================================================================== */
function initVideoPlayerModule() {
  const video = document.getElementById('mainVideo');
  const overlay = document.getElementById('videoOverlay');
  const playOverlayBtn = document.getElementById('playOverlayBtn');
  const togglePlayBtn = document.getElementById('togglePlayBtn');
  const toggleMuteBtn = document.getElementById('toggleMuteBtn');
  const toggleFullscreenBtn = document.getElementById('toggleFullscreenBtn');
  const playIcon = document.getElementById('playIcon');
  const soundIcon = document.getElementById('soundIcon');
  const videoTime = document.getElementById('videoTime');
  const progressContainer = document.getElementById('progressContainer');
  const progressBar = document.getElementById('progressBar');
  const chapters = document.querySelectorAll('.chapter-item');

  if (!video) return;

  function togglePlay() {
    if (video.paused || video.ended) {
      video.play().then(() => {
        overlay.classList.add('is-hidden');
        updatePlayIcon(true);
      }).catch(err => {
        console.warn('Auto-play prevented:', err);
      });
    } else {
      video.pause();
      overlay.classList.remove('is-hidden');
      updatePlayIcon(false);
    }
  }

  function updatePlayIcon(isPlaying) {
    if (!playIcon) return;
    if (isPlaying) {
      playIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
    } else {
      playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
    }
  }

  // Time format helper (mm:ss)
  function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  // Listeners
  if (overlay) overlay.addEventListener('click', togglePlay);
  if (video) video.addEventListener('click', togglePlay);
  if (togglePlayBtn) togglePlayBtn.addEventListener('click', togglePlay);

  video.addEventListener('timeupdate', () => {
    const cur = video.currentTime;
    const dur = video.duration || 102; // Default to probed duration if not loaded
    if (videoTime) {
      videoTime.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;
    }
    if (progressBar) {
      const pct = (cur / dur) * 100;
      progressBar.style.width = `${pct}%`;
    }
  });

  video.addEventListener('ended', () => {
    overlay.classList.remove('is-hidden');
    updatePlayIcon(false);
  });

  // Mute / Unmute
  if (toggleMuteBtn) {
    toggleMuteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      if (video.muted) {
        soundIcon.innerHTML = '<line x1="1" y1="1" x2="23" y2="23"></line><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>';
      } else {
        soundIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
      }
    });
  }

  // Fullscreen
  if (toggleFullscreenBtn) {
    toggleFullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        video.requestFullscreen().catch(err => {
          console.warn('Fullscreen error:', err);
        });
      } else {
        document.exitFullscreen();
      }
    });
  }

  // Progress Bar Seek
  if (progressContainer) {
    progressContainer.addEventListener('click', (e) => {
      const rect = progressContainer.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const dur = video.duration || 102;
      video.currentTime = pos * dur;
    });
  }

  // Chapter Click Seek
  chapters.forEach(ch => {
    ch.addEventListener('click', () => {
      const targetTime = parseFloat(ch.getAttribute('data-time'));
      if (!isNaN(targetTime)) {
        video.currentTime = targetTime;
        if (video.paused) {
          video.play();
          overlay.classList.add('is-hidden');
          updatePlayIcon(true);
        }
      }
    });
  });
}

/* ==========================================================================
   3. Impact Calculator Module
   ========================================================================== */
function initImpactCalculatorModule() {
  const checkboxes = document.querySelectorAll('.calc-habits input[type="checkbox"]');
  const resPlastic = document.getElementById('resPlastic');
  const resCarbon = document.getElementById('resCarbon');
  const resTrees = document.getElementById('resTrees');

  function calculateImpact() {
    let weeklyPlasticKg = 0;
    let weeklyCarbonKg = 0;

    checkboxes.forEach(chk => {
      if (chk.checked) {
        const plastic = parseFloat(chk.getAttribute('data-plastic')) || 0;
        const carbon = parseFloat(chk.getAttribute('data-carbon')) || 0;
        weeklyPlasticKg += plastic;
        weeklyCarbonKg += carbon;
      }
    });

    // 1 year = 52 weeks
    const annualPlastic = weeklyPlasticKg * 52;
    const annualCarbon = weeklyCarbonKg * 52;

    // 1 tree absorbs ~21 kg of CO2/year
    const treesEquivalent = Math.max(0.2, (annualCarbon / 10)).toFixed(1);

    if (resPlastic) resPlastic.textContent = `${annualPlastic.toFixed(1)} kg`;
    if (resCarbon) resCarbon.textContent = `${annualCarbon.toFixed(1)} kg`;
    if (resTrees) {
      if (annualPlastic === 0 && annualCarbon === 0) {
        resTrees.textContent = '0 Pohon';
      } else {
        resTrees.textContent = `~${treesEquivalent} Pohon`;
      }
    }
  }

  checkboxes.forEach(chk => {
    chk.addEventListener('change', calculateImpact);
  });

  // Run initial calculation
  calculateImpact();
}

/* ==========================================================================
   4. Smooth Scrolling for Internal Links
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

