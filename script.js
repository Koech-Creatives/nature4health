/**
 * Nature for Health (N4H) Presentation — Slide & Interaction Engine v2
 * Handles presentation deck sliders, progress trackers, parallax tilt,
 * alignment calculators, interactive modals, accordion, and copy actions.
 */

(function () {
  'use strict';

  // ---- Presentation Configuration ----
  const TOTAL_SLIDES = 21;
  let currentSlide = 1;
  let isTransitioning = false;
  const TRANSITION_DURATION = 750; // ms — matches CSS speed

  // ---- DOM Selection ----
  const slides = document.querySelectorAll('.s');
  const progressFill = document.getElementById('progressFill');
  const counterCurrent = document.getElementById('counterCurrent');
  const counterTotal = document.getElementById('counterTotal');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const fsBtn = document.getElementById('fsBtn');
  const hint = document.getElementById('hint');
  const dotsContainer = document.getElementById('dots');
  const toast = document.getElementById('toast');

  // Popups & References Modal Data
  const refPopup = document.getElementById('refPopup');
  const popupClose = document.getElementById('popupClose');
  const popupTitle = document.getElementById('popupTitle');
  const popupSub = document.getElementById('popupSub');
  const popupList = document.getElementById('popupList');
  const popupLink = document.getElementById('popupLink');

  // Interactive Reference Databases
  const referenceDatabase = {
    'n4h-curr': {
      title: 'Nature for Health',
      sub: 'Current N4H Website (Baseline)',
      url: 'https://natureforhealth.org',
      takeaways: [
        'Established brand colors and standard leaf icon structure.',
        'Core documentation catalog exists but needs visual polishing.',
        'Trust factor is strong; identity must remain recognizable in redesign.',
        'Navigation paths are functional but lack contemporary mobile flows.'
      ]
    },
    'dswf': {
      title: 'David Shepherd Wildlife Foundation',
      sub: 'Wildlife Conservation Charity Benchmark',
      url: 'https://davidshepherd.org/',
      takeaways: [
        'Outstanding institutional structures for resources and publications.',
        'Clear, highly effective donation pathways and campaign callouts.',
        'Engaging layout combining structured research indices with visual wildlife stories.',
        'Highly structured menus offering swift navigation for multi-tier user paths.'
      ]
    },
    'wci': {
      title: 'Wildlife Coexistence Initiative',
      sub: 'Technical Biodiversity Interface Benchmark',
      url: 'https://wildlifecoexistence.org/',
      takeaways: [
        'Presents complex technical frameworks in clean, minimal data grids.',
        'Exceptional white space implementation delivering high institutional credibility.',
        'Clear organization of field projects, technical manuals, and local maps.',
        'Low-friction document search layouts perfect for environmental policymakers.'
      ]
    },
    'eu': {
      title: 'Erlebnis Unganisha',
      sub: 'Sensory Conservation Experience Benchmark',
      url: 'https://www.erlebnis-unganisha.de/themen/',
      takeaways: [
        'Highly engaging thematic divisions presenting conservation areas.',
        'Excellent content structure facilitating intuitive, organic discovery.',
        'Clean iconography representing complex scientific systems with visual symbols.',
        'Rich educational layouts providing smooth content transitions.'
      ]
    },
    'carbon-direct': {
      title: 'Carbon Direct',
      sub: 'Sleek Corporate Science Benchmark',
      url: 'https://www.carbon-direct.com/',
      takeaways: [
        'Premium, sophisticated dark-mode grid layout that establishes global leadership.',
        'Clean vector DNA/molecule assets and sleek structural container cards.',
        'Seamless micro-interactions and smooth content transitions on scrolling.',
        'Exceptional data visualization showcasing technical outcomes clearly.'
      ]
    },
    'wildfire': {
      title: 'Following Wildfire',
      sub: 'Immersive Editorial Storytelling Benchmark',
      url: 'https://followingwildfire.com/',
      takeaways: [
        'Cinematic, full-bleed imagery giving urgent emotional scale to scientific topics.',
        'Bold, responsive typography pairs that command visitor attention.',
        'Narrative-driven layout that transforms raw statistics into compelling human stories.',
        'Highly dynamic animations providing an immersive documentary feel.'
      ]
    },
    'wildlife-la': {
      title: 'Wildlife LA',
      sub: 'Urban Environmental Advocacy Benchmark',
      url: 'https://www.wildlife.la/',
      takeaways: [
        'Outstanding, modern geometric fonts paired with natural earth tones.',
        'Clean, custom interactive map layouts representing local country projects.',
        'Playful yet premium visual container boxes that organize data smoothly.',
        'Outstanding community-centric calls-to-action that drive high public engagement.'
      ]
    },
    'lakes': {
      title: 'Western Sydney Lakes',
      sub: 'Modern Landscape & Parks Benchmark',
      url: 'https://www.westernsydneylakes.com.au/?ref=land-book.com',
      takeaways: [
        'Fascinating, responsive scroll layouts with curved graphical organic dividers.',
        'Vibrant natural colors paired with modern, wide-container content grids.',
        'Sophisticated background shape shifts that track user scrolling.',
        'Outstanding storytelling highlighting coexistence between community and nature.'
      ]
    },
    'nzon': {
      title: 'Nzon Foot',
      sub: 'Cinematic Nature & Movement Benchmark',
      url: 'https://nzonfoot.com/',
      takeaways: [
        'Deep organic colors creating a striking, high-impact aesthetic.',
        'Ultra-premium minimalist interfaces that spotlight conservation themes.',
        'Smooth micro-movements on hover that breathe life into static pages.',
        'Deep emotional resonance generated via elegant spatial presentation.'
      ]
    }
  };

  // ---- Initialize Dynamic Interface ----
  counterTotal.textContent = String(TOTAL_SLIDES).padStart(2, '0');
  generateDots();
  updateUI();

  // Fade out keyboard navigation hint after 6s
  setTimeout(() => {
    hint.classList.add('hidden');
  }, 7000);

  // ---- Dot Navigation Generation ----
  function generateDots() {
    dotsContainer.innerHTML = '';
    for (let i = 1; i <= TOTAL_SLIDES; i++) {
      const dotBtn = document.createElement('button');
      dotBtn.className = 'dot' + (i === 1 ? ' active' : '');
      dotBtn.setAttribute('data-target', i);
      dotBtn.setAttribute('aria-label', `Navigate to slide ${i}`);
      dotsContainer.appendChild(dotBtn);
    }
  }

  // ---- Navigation Core ----
  function goToSlide(n) {
    if (isTransitioning || n < 1 || n > TOTAL_SLIDES || n === currentSlide) return;

    isTransitioning = true;

    const oldIndex = currentSlide - 1;
    const newIndex = n - 1;

    // Apply sliding out class to active slide if moving forward
    if (n > currentSlide) {
      slides[oldIndex].classList.add('slide-left-out');
    }

    // Handle dots state change
    const dotsList = dotsContainer.querySelectorAll('.dot');
    dotsList[oldIndex].classList.remove('active');
    dotsList[newIndex].classList.add('active');

    // Transition slides active state
    slides[oldIndex].classList.remove('active');
    
    // Tiny delay to trigger neat entry transforms
    setTimeout(() => {
      slides[oldIndex].classList.remove('slide-left-out');
      currentSlide = n;
      slides[newIndex].classList.add('active');
      updateUI();
      isTransitioning = false;
    }, 50);
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function updateUI() {
    // Dynamic Top Progress Fill
    const progressPercent = (currentSlide / TOTAL_SLIDES) * 100;
    progressFill.style.width = progressPercent + '%';

    // Slide Counter update
    counterCurrent.textContent = String(currentSlide).padStart(2, '0');

    // Controls active/disabled checks
    prevBtn.disabled = currentSlide === 1;
    nextBtn.disabled = currentSlide === TOTAL_SLIDES;
  }

  // ---- Event Handlers & Listeners ----

  // Navigation Button Clicks
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  // Dots click navigation handler
  dotsContainer.addEventListener('click', (e) => {
    const dot = e.target.closest('.dot');
    if (!dot) return;
    const target = parseInt(dot.getAttribute('data-target'), 10);
    goToSlide(target);
  });

  // Slide 3 Split Panel Interactive Clicks
  const panel1 = document.getElementById('panelOption1');
  const panel2 = document.getElementById('panelOption2');

  if (panel1 && panel2) {
    panel1.addEventListener('click', (e) => {
      if (e.target.closest('.split-cta')) {
        goToSlide(4); // Jump to Option 1 intro
      } else {
        goToSlide(4);
      }
    });

    panel2.addEventListener('click', (e) => {
      if (e.target.closest('.split-cta')) {
        goToSlide(11); // Jump to Option 2 intro
      } else {
        goToSlide(11);
      }
    });
  }

  // ---- Parallax Tilt Effect (Slide 1 Hero backdrop) ----
  const parallaxBg = document.getElementById('titleParallax');
  const slide1 = document.getElementById('s-1');

  if (slide1 && parallaxBg) {
    slide1.addEventListener('mousemove', (e) => {
      if (!slide1.classList.contains('active')) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Calculate cursor position offset from center (-0.5 to 0.5)
      const mouseX = (e.clientX / width) - 0.5;
      const mouseY = (e.clientY / height) - 0.5;
      
      // Rotate up to 15 degrees, translate up to 25px
      const rotateY = mouseX * 16;
      const rotateX = -mouseY * 16;
      const translateX = mouseX * 25;
      const translateY = mouseY * 25;
      
      parallaxBg.style.transform = `translateY(-50%) translate3d(${translateX}px, ${translateY}px, 0) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    });

    slide1.addEventListener('mouseleave', () => {
      parallaxBg.style.transform = 'translateY(-50%) translate3d(0, 0, 0) rotateY(0) rotateX(0)';
    });
  }

  // ---- Keyboard Shortcuts Navigation ----
  document.addEventListener('keydown', (e) => {
    hint.classList.add('hidden'); // Hide instructions immediately

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'Backspace':
        e.preventDefault();
        prevSlide();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(1);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(TOTAL_SLIDES);
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 'Escape':
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        break;
      default:
        // Numeric slide jumping keys (1 to 9, 0 for 10)
        if (e.key >= '1' && e.key <= '9') {
          e.preventDefault();
          goToSlide(parseInt(e.key, 10));
        } else if (e.key === '0') {
          e.preventDefault();
          goToSlide(19);
        }
        break;
    }
  });

  // ---- Smooth Touch Gesture Swipe Navigation ----
  let touchStartX = 0;
  let touchStartY = 0;
  const SWIPE_THRESHOLD = 50;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    const dy = e.changedTouches[0].screenY - touchStartY;

    // Trigger only on clean horizontal swipes
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }, { passive: true });

  // ---- Passive Mouse Wheel Scroll Navigation ----
  let wheelTimeout = null;
  document.addEventListener('wheel', (e) => {
    // Avoid interfering with interactive scrolling modules on slides
    if (e.target.closest('.ref-grid, .steps-list, .wizard-widget, .col-block')) return;

    e.preventDefault();

    if (wheelTimeout) return;

    if (e.deltaY > 35) {
      nextSlide();
    } else if (e.deltaY < -35) {
      prevSlide();
    }

    wheelTimeout = setTimeout(() => {
      wheelTimeout = null;
    }, 850);
  }, { passive: false });

  // ---- Fullscreen Handling ----
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  }

  fsBtn.addEventListener('click', toggleFullscreen);

  // Click on screen sides to advance slides (desktop accessibility)
  document.addEventListener('click', (e) => {
    if (e.target.closest('button, a, .dot, .nav, .swatch, .ref-card, .step, .wizard-widget')) return;
    
    // Ignore click navigation inside modal popup
    if (e.target.closest('.ref-popup__content')) return;

    const clickX = e.clientX;
    const centerPoint = window.innerWidth / 2;

    if (clickX > centerPoint) {
      nextSlide();
    } else {
      prevSlide();
    }
  });

  // ---- Interactive Reference Modal Popups ----
  const refCards = document.querySelectorAll('.ref-card');
  refCards.forEach((card) => {
    card.addEventListener('click', () => {
      const refKey = card.getAttribute('data-ref');
      const refData = referenceDatabase[refKey];

      if (!refData) return;

      // Populate details dynamically
      popupTitle.textContent = refData.title;
      popupSub.textContent = refData.sub;
      popupLink.setAttribute('href', refData.url);

      popupList.innerHTML = '';
      refData.takeaways.forEach((item) => {
        const li = document.createElement('div');
        li.className = 'ref-popup__item';
        li.innerHTML = `<span class="ref-popup__bullet">→</span><span class="ref-popup__text">${item}</span>`;
        popupList.appendChild(li);
      });

      // Show Popup
      refPopup.classList.add('active');
      refPopup.setAttribute('aria-hidden', 'false');
    });
  });

  function closePopup() {
    refPopup.classList.remove('active');
    refPopup.setAttribute('aria-hidden', 'true');
  }

  popupClose.addEventListener('click', closePopup);
  refPopup.addEventListener('click', (e) => {
    if (e.target === refPopup) closePopup();
  });

  // ---- Interactive Click-to-Copy Swatches ----
  const swatches = document.querySelectorAll('.swatch');
  swatches.forEach((swatch) => {
    swatch.addEventListener('click', () => {
      const hex = swatch.getAttribute('data-hex');
      navigator.clipboard.writeText(hex).then(() => {
        // Trigger Toast active states
        toast.textContent = `Hex Code ${hex} copied to clipboard!`;
        toast.classList.add('active');
        
        setTimeout(() => {
          toast.classList.remove('active');
        }, 2200);
      }).catch(() => {});
    });
  });

  // ---- Interactive Stakeholder Alignment Configurator Wizard ----
  const fill1 = document.getElementById('fillOption1');
  const fill2 = document.getElementById('fillOption2');
  const val1 = document.getElementById('valOption1');
  const val2 = document.getElementById('valOption2');
  const verdictBlock = document.getElementById('verdictBlock');

  const riskGroup = document.getElementById('toggleRisk');
  const valueGroup = document.getElementById('toggleValue');
  const audienceGroup = document.getElementById('toggleAudience');

  let activeRisk = 'low';
  let activeValue = 'ops';
  let activeAudience = 'inst';

  if (riskGroup && valueGroup && audienceGroup) {
    // Toggle active classes on click
    riskGroup.addEventListener('click', (e) => {
      const btn = e.target.closest('.wizard-toggle-btn');
      if (!btn) return;
      riskGroup.querySelectorAll('.wizard-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeRisk = btn.getAttribute('data-val');
      calculateWizardScore();
    });

    valueGroup.addEventListener('click', (e) => {
      const btn = e.target.closest('.wizard-toggle-btn');
      if (!btn) return;
      valueGroup.querySelectorAll('.wizard-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeValue = btn.getAttribute('data-val');
      calculateWizardScore();
    });

    audienceGroup.addEventListener('click', (e) => {
      const btn = e.target.closest('.wizard-toggle-btn');
      if (!btn) return;
      audienceGroup.querySelectorAll('.wizard-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeAudience = btn.getAttribute('data-val');
      calculateWizardScore();
    });
  }

  function calculateWizardScore() {
    // Base Scores
    let scoreOption1 = 60;
    let scoreOption2 = 40;

    // Apply Risk logic
    if (activeRisk === 'low') {
      scoreOption1 += 20;
      scoreOption2 -= 10;
    } else {
      scoreOption1 -= 15;
      scoreOption2 += 30;
    }

    // Apply Value focus logic
    if (activeValue === 'ops') {
      scoreOption1 += 15;
      scoreOption2 -= 10;
    } else {
      scoreOption1 -= 10;
      scoreOption2 += 25;
    }

    // Apply Audience focus logic
    if (activeAudience === 'inst') {
      scoreOption1 += 15;
      scoreOption2 -= 15;
    } else {
      scoreOption1 -= 10;
      scoreOption2 += 20;
    }

    // Clamp values between 15% and 100%
    scoreOption1 = Math.max(15, Math.min(100, scoreOption1));
    scoreOption2 = Math.max(15, Math.min(100, scoreOption2));

    // Update Progress widths and text node values
    fill1.style.width = scoreOption1 + '%';
    fill2.style.width = scoreOption2 + '%';
    val1.textContent = scoreOption1 + '%';
    val2.textContent = scoreOption2 + '%';

    // Formulate tailored verdict text dynamically
    if (scoreOption1 >= 80 && scoreOption2 < 55) {
      verdictBlock.textContent = 'Verdict: Focus on Refine & Improve (Familiar & Low Risk)';
      verdictBlock.style.background = 'rgba(43, 182, 115, 0.1)';
      verdictBlock.style.borderColor = 'rgba(43, 182, 115, 0.2)';
      verdictBlock.style.color = 'var(--green-1)';
    } else if (scoreOption2 >= 80 && scoreOption1 < 55) {
      verdictBlock.textContent = 'Verdict: Bold Redesign — Fresh New Look (High Impact)';
      verdictBlock.style.background = 'rgba(50, 188, 173, 0.1)';
      verdictBlock.style.borderColor = 'rgba(50, 188, 173, 0.2)';
      verdictBlock.style.color = 'var(--teal)';
    } else {
      verdictBlock.textContent = 'Verdict: A Balanced Hybrid Approach (Highly Recommended)';
      verdictBlock.style.background = 'rgba(114, 191, 68, 0.1)';
      verdictBlock.style.borderColor = 'rgba(114, 191, 68, 0.2)';
      verdictBlock.style.color = 'var(--green-2)';
    }
  }

  // Initial Calculation
  calculateWizardScore();

  // ---- Slide 12: Timeline Roadmap Steps Accordion ----
  const steps = document.querySelectorAll('.step');
  steps.forEach((step) => {
    step.addEventListener('click', () => {
      // If already active, toggle it (collapse it) or keep it active
      if (step.classList.contains('active')) {
        // Option to collapse clicked step, but keep at least one expanded
        const activeSteps = document.querySelectorAll('.step.active');
        if (activeSteps.length > 1) {
          step.classList.remove('active');
        }
      } else {
        // Remove active class from all other steps, then add to this one
        steps.forEach(s => s.classList.remove('active'));
        step.classList.add('active');
      }
    });
  });

  // ---- Prefers Reduced Motion Accessibility Check ----
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery.matches) {
    document.documentElement.style.setProperty('--transition-slide', '0.01s linear');
  }

})();
