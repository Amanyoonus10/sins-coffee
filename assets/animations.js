/**
 * SIN'S COFFEE — Luxury Animations & Motion Controller
 * Supports GSAP / ScrollTrigger with pure Vanilla JS IntersectionObserver fallback
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', initAnimations);

  function initAnimations() {
    initHeroVideoSlowMotion();
    initCinematicVideoIntro();
    initHeaderScroll();
    initScrollVideo();
    initScrollReveals();
    initParallax();
  }

  // 0. Slow-Motion Background Hero Video (Unhurried Cinematic Luxury Pace)
  function initHeroVideoSlowMotion() {
    const heroVideos = document.querySelectorAll('#sinsHeroVideo, .sins-hero__video');
    if (!heroVideos.length) return;

    const SLOW_RATE = 0.65; // ~35% slower for a relaxed, velvety, high-end editorial feel

    heroVideos.forEach(video => {
      const applyRate = () => {
        try {
          video.playbackRate = SLOW_RATE;
          video.defaultPlaybackRate = SLOW_RATE;
        } catch (e) {}
      };

      applyRate();
      video.addEventListener('loadedmetadata', applyRate);
      video.addEventListener('canplay', applyRate);
      video.addEventListener('play', applyRate);
      video.addEventListener('playing', applyRate);
      video.addEventListener('ratechange', () => {
        if (video.playbackRate !== SLOW_RATE && !video.paused) {
          applyRate();
        }
      });
    });
  }

  // 1. Cinematic Video Intro Controller (Plays before website starts)
  function initCinematicVideoIntro() {
    const introModal = document.getElementById('sins-video-intro');
    const introVideo = document.getElementById('sinsIntroVideo');
    const skipBtn = document.getElementById('introSkipBtn');

    if (!introModal || !introVideo) return;

    // Lock page scrolling while intro is active
    document.body.style.overflow = 'hidden';

    // Auto-play intro video smoothly
    introVideo.muted = true;
    try {
      introVideo.playbackRate = 0.85;
      introVideo.defaultPlaybackRate = 0.85;
    } catch (e) {}
    const playPromise = introVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }

    let isDismissed = false;
    const dismissIntro = () => {
      if (isDismissed) return;
      isDismissed = true;

      introModal.classList.add('dismissed');
      document.body.style.overflow = '';

      const heroVideo = document.getElementById('sinsHeroVideo') || document.querySelector('.sins-hero__video');
      if (heroVideo) {
        try {
          heroVideo.playbackRate = 0.65;
          heroVideo.defaultPlaybackRate = 0.65;
        } catch (e) {}
        heroVideo.play().catch(e => console.log('Hero autoplay:', e));
      }

      setTimeout(() => {
        introVideo.pause();
        triggerHeroEntrance();
      }, 800);
    };

    // Click anywhere on the intro screen to enter immediately
    introModal.addEventListener('click', dismissIntro);
    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dismissIntro();
      });
    }

    // Scroll wheel on intro also seamlessly enters the site
    window.addEventListener('wheel', (e) => {
      if (!isDismissed && Math.abs(e.deltaY) > 20) {
        dismissIntro();
      }
    }, { passive: true });

    // Automatically transition to website when video reaches the end
    introVideo.addEventListener('ended', () => {
      setTimeout(dismissIntro, 400);
    });
  }

  // 2. Hero Text Stagger Entrance
  function triggerHeroEntrance() {
    if (window.gsap) {
      gsap.fromTo('.sins-anim-fade-up', 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
      );
      gsap.fromTo('.sins-anim-title', 
        { opacity: 0, y: 40 }, 
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.4 }
      );
      gsap.fromTo('.sins-anim-subtext', 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.6 }
      );
      gsap.fromTo('.sins-anim-cta', 
        { opacity: 0, y: 25 }, 
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.8 }
      );
    } else {
      const elements = document.querySelectorAll('.sins-anim-fade-up, .sins-anim-title, .sins-anim-subtext, .sins-anim-cta');
      elements.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }
  }

  // 3. Header Scrolled State
  function initHeaderScroll() {
    const header = document.getElementById('sins-site-header');
    if (!header) return;

    const onScroll = () => {
      if (window.scrollY > 60) {
        header.classList.add('sins-header--scrolled');
      } else {
        header.classList.remove('sins-header--scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 4. Scroll-Triggered Reveal Animations
  function initScrollReveals() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (!revealElements.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.getAttribute('data-delay') || 0;
            
            setTimeout(() => {
              el.classList.add('is-revealed');
              if (window.gsap) {
                const animType = el.getAttribute('data-reveal');
                if (animType === 'fade-up') {
                  gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
                } else if (animType === 'fade-in-right') {
                  gsap.fromTo(el, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out' });
                } else if (animType === 'fade-in-left') {
                  gsap.fromTo(el, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out' });
                } else if (animType === 'scale-up') {
                  gsap.fromTo(el, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' });
                }
              }
            }, parseInt(delay, 10));

            obs.unobserve(el);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      });

      revealElements.forEach(el => observer.observe(el));
    } else {
      revealElements.forEach(el => el.classList.add('is-revealed'));
    }
  }

  // 6. 4K Scroll-Driven Video Controller
  function initScrollVideo() {
    const section = document.getElementById('sins-scroll-video');
    const video = document.getElementById('sinsScrollVideo');
    const content = document.getElementById('sinsScrollHeroContent');

    if (!section || !video) return;

    video.muted = true;
    video.playsInline = true;

    let isVideoReady = false;
    const onMetadataLoaded = () => {
      isVideoReady = true;
    };

    if (video.readyState >= 1) {
      onMetadataLoaded();
    } else {
      video.addEventListener('loadedmetadata', onMetadataLoaded);
    }

    let targetProgress = 0;
    let currentProgress = 0;
    let isTicking = false;

    const calculateScrollProgress = () => {
      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight;
      const trackH = section.offsetHeight;
      const maxScroll = trackH - windowH;

      if (maxScroll <= 0) return 0;
      const scrolled = -rect.top;
      return Math.max(0, Math.min(1, scrolled / maxScroll));
    };

    const renderLoop = () => {
      currentProgress += (targetProgress - currentProgress) * 0.12;

      if (isVideoReady && video.duration) {
        const targetTime = currentProgress * video.duration;
        if (Math.abs(video.currentTime - targetTime) > 0.02) {
          video.currentTime = targetTime;
        }
      }

      // Smoothly fade & glide hero content out on scroll so pure 4K cinema shines
      if (content) {
        const fadeOutProgress = Math.min(1, currentProgress / 0.22);
        const opacity = Math.max(0, 1 - fadeOutProgress);
        const translateY = -fadeOutProgress * 40;
        content.style.opacity = opacity.toFixed(3);
        content.style.transform = `translateY(${translateY.toFixed(1)}px)`;
        content.style.pointerEvents = opacity <= 0.05 ? 'none' : 'auto';
      }

      if (Math.abs(targetProgress - currentProgress) > 0.001) {
        window.requestAnimationFrame(renderLoop);
      } else {
        isTicking = false;
      }
    };

    const onScroll = () => {
      targetProgress = calculateScrollProgress();
      if (!isTicking) {
        window.requestAnimationFrame(renderLoop);
        isTicking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

})();

