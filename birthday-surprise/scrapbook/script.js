/* ==========================================================================
   OUR SCRAPBOOK — SCRIPT
   Handles: cover page-turn reveal, ambient floating hearts/petals,
   scroll reveal animations, polaroid tilt, letter flip-book, sticky note
   board, moment cards (pure CSS hover, no JS needed), music player,
   live countdown, bucket-list checkboxes, and the final surprise reveal.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------
     CONFIG — edit these two lines to personalize the page
     ------------------------------------------------------------ */
  // The date your relationship began, used by the live countdown below.
  const RELATIONSHIP_START = new Date("2026-02-14T00:00:00");

  /* ------------------------------------------------------------
     1) COVER PAGE-TURN REVEAL
     ------------------------------------------------------------ */
  const cover = document.getElementById('cover');
  const openBtn = document.getElementById('open-btn');
  const scrapbook = document.getElementById('scrapbook');

  openBtn.addEventListener('click', () => {
    cover.classList.add('turning');
    // Wait for the page-turn animation to finish, then swap views
    setTimeout(() => {
      cover.style.display = 'none';
      scrapbook.classList.add('visible');
      // Kick off reveal-on-scroll check immediately for above-the-fold items
      checkReveals();
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    }, 1050);
  });

  /* ------------------------------------------------------------
     2) AMBIENT FLOATING HEARTS + FALLING PETALS
     ------------------------------------------------------------ */
  const ambientLayer = document.getElementById('ambient-layer');
  const heartSymbols = ['🤍', '💙', '💫', '⭐'];
  const petalSymbols = ['❄️', '🌿', '✦'];

  function spawnFloaty(kind){
    const el = document.createElement('span');
    el.className = 'floaty ' + kind;
    el.textContent = kind === 'heart'
      ? heartSymbols[Math.floor(Math.random() * heartSymbols.length)]
      : petalSymbols[Math.floor(Math.random() * petalSymbols.length)];

    const startX = Math.random() * 100; // vw
    const duration = 10 + Math.random() * 8; // seconds
    el.style.left = startX + 'vw';
    el.style.animationDuration = duration + 's';
    el.style.fontSize = (14 + Math.random() * 14) + 'px';

    ambientLayer.appendChild(el);
    // Clean up after the animation finishes so the DOM doesn't grow forever
    setTimeout(() => el.remove(), duration * 1000 + 500);
  }

  // Gentle, low-frequency spawning so it stays subtle rather than busy
  setInterval(() => spawnFloaty('heart'), 2200);
  setInterval(() => spawnFloaty('petal'), 3100);

  /* ------------------------------------------------------------
     3) SCROLL REVEAL (fade + rise) FOR SECTIONS
     ------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');

  function checkReveals(){
    const viewportBottom = window.innerHeight;
    revealEls.forEach(el => {
      if (el.classList.contains('in-view')) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < viewportBottom - 60) {
        el.classList.add('in-view');
      }
    });
  }

  const revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('in-view');
        });
      }, { threshold: 0.15 })
    : null;

  if (revealObserver){
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    window.addEventListener('scroll', checkReveals);
    checkReveals();
  }

  /* ------------------------------------------------------------
     4) LOVE LETTERS — flip-book navigation
     ------------------------------------------------------------ */
  const letterPages = Array.from(document.querySelectorAll('.letter-page'));
  const letterPrev = document.getElementById('letter-prev');
  const letterNext = document.getElementById('letter-next');
  const letterCount = document.getElementById('letter-count');
  let currentLetter = 0;

  function renderLetter(){
    letterPages.forEach((page, i) => page.classList.toggle('active', i === currentLetter));
    letterCount.textContent = `${currentLetter + 1} / ${letterPages.length}`;
    letterPrev.disabled = currentLetter === 0;
    letterNext.disabled = currentLetter === letterPages.length - 1;
  }

  if (letterPages.length){
    letterPrev.addEventListener('click', () => {
      if (currentLetter > 0){ currentLetter--; renderLetter(); }
    });
    letterNext.addEventListener('click', () => {
      if (currentLetter < letterPages.length - 1){ currentLetter++; renderLetter(); }
    });
    renderLetter();
  }

  /* ------------------------------------------------------------
     5) MUSIC CORNER — vinyl play/pause
     ------------------------------------------------------------ */
  const song = document.getElementById('our-song');
  const playBtn = document.getElementById('play-btn');
  const vinyl = document.getElementById('vinyl');

  if (playBtn){
    playBtn.addEventListener('click', () => {
      if (song.paused){
        const playPromise = song.play();
        if (playPromise !== undefined){
          playPromise
            .then(() => {
              vinyl.classList.add('spinning');
              playBtn.textContent = '⏸ Pause';
            })
            .catch(() => {
              // No audio file added yet — let them know gently instead of erroring silently
              playBtn.textContent = '🎵 Add a song first!';
              setTimeout(() => { playBtn.textContent = '▶ Play'; }, 2200);
            });
        }
      } else {
        song.pause();
        vinyl.classList.remove('spinning');
        playBtn.textContent = '▶ Play';
      }
    });

    song.addEventListener('ended', () => {
      vinyl.classList.remove('spinning');
      playBtn.textContent = '▶ Play';
    });
  }

  /* ------------------------------------------------------------
     6) LIVE COUNTDOWN — time spent together
     ------------------------------------------------------------ */
  const cdYears = document.getElementById('cd-years');
  const cdMonths = document.getElementById('cd-months');
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins = document.getElementById('cd-mins');
  const cdSecs = document.getElementById('cd-secs');

  function updateCountdown(){
    const now = new Date();
    let diffMs = now - RELATIONSHIP_START;
    if (diffMs < 0) diffMs = 0;

    // Break down into years / months / days using calendar-aware math
    let years = now.getFullYear() - RELATIONSHIP_START.getFullYear();
    let months = now.getMonth() - RELATIONSHIP_START.getMonth();
    let days = now.getDate() - RELATIONSHIP_START.getDate();
    let hours = now.getHours() - RELATIONSHIP_START.getHours();
    let mins = now.getMinutes() - RELATIONSHIP_START.getMinutes();
    let secs = now.getSeconds() - RELATIONSHIP_START.getSeconds();

    if (secs < 0){ secs += 60; mins--; }
    if (mins < 0){ mins += 60; hours--; }
    if (hours < 0){ hours += 24; days--; }
    if (days < 0){
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }
    if (months < 0){ months += 12; years--; }

    cdYears.textContent = Math.max(years, 0);
    cdMonths.textContent = Math.max(months, 0);
    cdDays.textContent = Math.max(days, 0);
    cdHours.textContent = hours;
    cdMins.textContent = mins;
    cdSecs.textContent = secs;
  }

  if (cdYears){
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* ------------------------------------------------------------
     7) FUTURE DREAMS — checklist strike-through + save state
     ------------------------------------------------------------ */
  const dreamBoxes = document.querySelectorAll('.dream-item input[type="checkbox"]');

  dreamBoxes.forEach(box => {
    const savedState = localStorage.getItem('dream:' + box.id);
    if (savedState === 'true'){
      box.checked = true;
      box.closest('.dream-item').classList.add('done');
    }
    box.addEventListener('change', () => {
      box.closest('.dream-item').classList.toggle('done', box.checked);
      localStorage.setItem('dream:' + box.id, box.checked);
    });
  });

  /* ------------------------------------------------------------
     8) FINAL SURPRISE — reveal hidden letter + a little heart burst
     ------------------------------------------------------------ */
  const surpriseBtn = document.getElementById('surprise-btn');
  const hiddenLetter = document.getElementById('hidden-letter');

  if (surpriseBtn){
    surpriseBtn.addEventListener('click', () => {
      hiddenLetter.classList.add('show');
      hiddenLetter.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // A little burst of hearts to celebrate the moment
      for (let i = 0; i < 14; i++){
        setTimeout(() => spawnFloaty('heart'), i * 90);
      }
    });
  }

});
