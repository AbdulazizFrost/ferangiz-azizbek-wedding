/* ==========================================================================
   DARK LUXURY — ORDER #12 (FERANGIZ & AZIZBEK)
   Interactive Engine
   ========================================================================== */

(function () {
  'use strict';

  // Always reset scroll to top on reload
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // Gallery Photos
  const galleryPhotos = [
    'images/photo_1.jpg',
    'images/photo_2.jpg',
    'images/photo_3.jpg'
  ];
  let currentLightboxIndex = 0;

  // DOM Elements
  const audio = document.getElementById('weddingAudio');
  const musicBtn = document.getElementById('musicBtn');
  const vinylLabel = document.getElementById('vinylLabel');
  const coverScreen = document.getElementById('coverScreen');
  const siteContent = document.getElementById('siteContent');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCounter = document.getElementById('lightboxCounter');

  let isAudioPlaying = false;

  /* --------------------------------------------------------------------------
     1. COVER OPENING & MUSIC START
     -------------------------------------------------------------------------- */
  window.openInvitation = function () {
    // 1. Play soundtrack
    if (audio) {
      audio.play().then(() => {
        isAudioPlaying = true;
        updateMusicUI(true);
      }).catch(err => {
        console.log('Audio autoplay prevented:', err);
      });
    }

    if (musicBtn) {
      musicBtn.classList.add('visible');
    }

    // 2. Animate cover opening
    if (coverScreen) {
      coverScreen.classList.add('opened');
    }

    // 3. Unlock body scroll
    document.body.classList.remove('locked');

    // 4. Smooth scroll to main content
    setTimeout(() => {
      if (siteContent) {
        siteContent.scrollIntoView({ behavior: 'smooth' });
      }
    }, 350);
  };

  // NOTE: Open only via the dedicated #openBtn button, not by clicking anywhere on the cover screen

  /* --------------------------------------------------------------------------
     2. MUSIC PLAYER TOGGLE
     -------------------------------------------------------------------------- */
  window.toggleMusic = function () {
    if (!audio) return;

    if (audio.paused) {
      audio.play().then(() => {
        isAudioPlaying = true;
        updateMusicUI(true);
      }).catch(err => console.log('Music error:', err));
    } else {
      audio.pause();
      isAudioPlaying = false;
      updateMusicUI(false);
    }
  };

  function updateMusicUI(playing) {
    if (!musicBtn) return;
    if (playing) {
      musicBtn.classList.add('playing');
      if (vinylLabel) vinylLabel.textContent = 'SOUNDTRACK';
    } else {
      musicBtn.classList.remove('playing');
      if (vinylLabel) vinylLabel.textContent = 'PAUZADA';
    }
  }

  /* --------------------------------------------------------------------------
     3. REAL-TIME COUNTDOWN TIMER (Target: 30.09.2026 19:00:00 UTC+5)
     -------------------------------------------------------------------------- */
  function initCountdown() {
    // 30 September 2026, 19:00 Uzbekistan time (UTC+5)
    const targetDate = new Date('2026-09-30T19:00:00+05:00').getTime();

    const dEl = document.getElementById('cd-days');
    const hEl = document.getElementById('cd-hours');
    const mEl = document.getElementById('cd-mins');
    const sEl = document.getElementById('cd-secs');

    function updateTimer() {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        if (dEl) dEl.textContent = '00';
        if (hEl) hEl.textContent = '00';
        if (mEl) mEl.textContent = '00';
        if (sEl) sEl.textContent = '00';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (dEl) dEl.textContent = days < 10 ? '0' + days : days;
      if (hEl) hEl.textContent = hours < 10 ? '0' + hours : hours;
      if (mEl) mEl.textContent = minutes < 10 ? '0' + minutes : minutes;
      if (sEl) sEl.textContent = seconds < 10 ? '0' + seconds : seconds;
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  /* --------------------------------------------------------------------------
     4. PHOTO GALLERY LIGHTBOX
     -------------------------------------------------------------------------- */
  window.openLightbox = function (index) {
    if (index < 0 || index >= galleryPhotos.length) return;
    currentLightboxIndex = index;
    updateLightboxPhoto();
    if (lightboxModal) {
      lightboxModal.classList.add('active');
    }
  };

  window.closeLightbox = function () {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
    }
  };

  window.nextLightboxPhoto = function () {
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryPhotos.length;
    updateLightboxPhoto();
  };

  window.prevLightboxPhoto = function () {
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryPhotos.length) % galleryPhotos.length;
    updateLightboxPhoto();
  };

  function updateLightboxPhoto() {
    if (lightboxImg) {
      lightboxImg.src = galleryPhotos[currentLightboxIndex];
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${galleryPhotos.length}`;
    }
  }

  // Keyboard navigation for Lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightboxPhoto();
    if (e.key === 'ArrowLeft') prevLightboxPhoto();
  });

  // Touch Swipe for Lightbox on Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 45) {
      if (diff < 0) {
        nextLightboxPhoto();
      } else {
        prevLightboxPhoto();
      }
    }
  }

  /* --------------------------------------------------------------------------
     5. SCROLL REVEAL ANIMATIONS
     -------------------------------------------------------------------------- */
  function initScrollReveal() {
    const blocks = document.querySelectorAll('.reveal-block');
    if (!blocks.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    blocks.forEach(b => observer.observe(b));
  }

  /* --------------------------------------------------------------------------
     6. SUBTLE BACKGROUND STARDUST
     -------------------------------------------------------------------------- */
  function initStardust() {
    const container = document.getElementById('stardustContainer');
    if (!container) return;

    const count = 28;
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star-particle';
      const size = Math.random() * 2.5 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.animationDuration = `${Math.random() * 4 + 3}s`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      container.appendChild(star);
    }
  }

  function initCoverParticles() {
    const container = document.getElementById('coverStageParticles') || document.getElementById('coverParticles');
    if (!container) return;

    container.innerHTML = '';
    const count = 38;
    const colors = ['#fff8e7', '#ffd700', '#f5c26b', '#dfc488', '#fff3cc'];
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'cover-star-particle';
      const size = Math.random() * 2.4 + 1.0;
      const color = colors[Math.floor(Math.random() * colors.length)];
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.background = color;
      star.style.boxShadow = `0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px rgba(255, 215, 0, 0.6)`;
      star.style.top = `${Math.random() * 96 + 2}%`;
      star.style.left = `${Math.random() * 96 + 2}%`;
      star.style.animationDuration = `${Math.random() * 4 + 3}s`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(star);
    }
  }

  /* --------------------------------------------------------------------------
     INITIALIZATION
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initScrollReveal();
    initStardust();
    initCoverParticles();
  });

})();
