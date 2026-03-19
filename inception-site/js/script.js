// We wait for DOM and GSAP to load
document.addEventListener("DOMContentLoaded", () => {
  // Ensure GSAP plugins are ready
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.error("GSAP or ScrollTrigger not loaded.");
    return;
  }
  
  gsap.registerPlugin(ScrollTrigger);

  initPreloader(); // Replaces direct calls to handle first-visit logic
});

// --- Preloader Logic (Fires on First Visit Only) ---
function initPreloader() {
  const preloader = document.querySelector('.preloader');
  const preloaderLogo = document.querySelector('.preloader-logo');
  
  // Failsafe: if not on homepage or elements missing, just run normal init
  if (!preloader || !preloaderLogo) {
    runMainSetup();
    return;
  }

  const hasVisited = sessionStorage.getItem('inception_visited');

  if (hasVisited) {
    // Visitor has already seen the animation this session.
    // Hide preloader instantly and fire normal animations.
    preloader.style.display = 'none';
    runMainSetup();
  } else {
    // First visit: Run the sequence
    const tl = gsap.timeline({
      onComplete: () => {
        // Mark session as visited and trigger main animations
        sessionStorage.setItem('inception_visited', 'true');
        preloader.style.display = 'none';
        runMainSetup();
      }
    });

    // 1. Logo fades in from the black
    tl.to(preloaderLogo, {
      opacity: 1,
      duration: 1.5,
      ease: "power2.inOut",
      delay: 0.5
    })
    // 2. Logo stays visible for a moment
    .to(preloaderLogo, {
      opacity: 1,
      duration: 0.8
    })
    // 3. Logo and black curtain fade/slide away to reveal the site
    .to(preloaderLogo, {
      opacity: 0,
      y: -20,
      duration: 1,
      ease: "power2.inOut"
    })
    .to(preloader, {
      yPercent: -100, // slide up
      duration: 1.2,
      ease: "power4.inOut"
    }, "-=0.8"); // start sliding up slightly before logo disappears completely
  }
}

// Helper to group the standard initialization
function runMainSetup() {
  initHeroAnimations();
  initScrollReveals();
  initParallax();
  initAestheticEnhancements();
  initWebGLRipples();
}

// --- Aesthetic Enhancements (Cursor, Noise, Gradient) ---
function initAestheticEnhancements() {
  // 1. Noise Overlay (Original, subtle, non-animated)
  const noise = document.createElement('div');
  noise.classList.add('noise-overlay');
  document.body.appendChild(noise);

  // 2. Ambient Gradient
  const gradient = document.createElement('div');
  gradient.classList.add('ambient-gradient');
  document.body.appendChild(gradient);

  // 3. Custom Cursor (Desktop/mouse only — skip on touch devices)
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  if (!isTouchDevice) {
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('custom-cursor-dot');
    document.body.appendChild(cursorDot);

    const cursorRing = document.createElement('div');
    cursorRing.classList.add('custom-cursor-ring');
    document.body.appendChild(cursorRing);

    // Define interactive elements for cursor hover states
    const interactiveElements = document.querySelectorAll('a, button, .music-cta');

    // Mouse Move Event
    document.addEventListener('mousemove', (e) => {
        // Move Cursor Dot instantly
        gsap.to(cursorDot, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: "power2.out"
        });

        // Move Cursor Ring with slight delay
        gsap.to(cursorRing, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.3,
            ease: "power2.out"
        });

        // Move Ambient Gradient subtly based on mouse position
        const xOffset = (e.clientX / window.innerWidth - 0.5) * 40;
        const yOffset = (e.clientY / window.innerHeight - 0.5) * 40;
        
        gsap.to(gradient, {
            x: xOffset,
            y: yOffset,
            duration: 1,
            ease: "power1.out"
        });
    });

    // Hover States
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorRing.classList.add('hover-active');
        });
        el.addEventListener('mouseleave', () => {
            cursorRing.classList.remove('hover-active');
        });
    });
  }
}

// --- WebGL Water Ripples ---
function initWebGLRipples() {
  // Check if jQuery (.ripples) is loaded successfully
  if (typeof $ !== 'undefined' && $.fn.ripples) {
    const $rippleTarget = $('.hero-ripple');
    
    if ($rippleTarget.length > 0) {
      try {
        $rippleTarget.ripples({
          resolution: 512,
          dropRadius: 20, // Size of the ripple
          perturbance: 0.04, // Refraction height
        });

        // Automatically drop a ripple when the page loads to show interactivity
        setTimeout(() => {
          const x = $rippleTarget.width() / 2;
          const y = $rippleTarget.height() / 2;
          $rippleTarget.ripples('drop', x, y, 40, 0.05);
        }, 1500);

        // Periodically drop subtle random ripples to keep the background 'alive'
        setInterval(() => {
          const x = Math.random() * $rippleTarget.width();
          const y = Math.random() * $rippleTarget.height();
          $rippleTarget.ripples('drop', x, y, 30, 0.02);
        }, 4000);
      } catch (e) {
        console.error("Ripples failed to initialize", e);
      }
    }
  }
}

function initHeroAnimations() {
  const heroLines = document.querySelectorAll('.hero-line');
  
  if (heroLines.length > 0) {
    // Initial hero text animation
    gsap.to(heroLines, {
      y: '0%',
      duration: 1.4,
      stagger: 0.15,
      ease: "power4.out",
      delay: 0.2
    });
  }

  // Fade in header and scroll indicator
  gsap.to(['.header', '.scroll-indicator'], {
    autoAlpha: 1,
    duration: 1.5,
    delay: 1.2,
    ease: "power2.out"
  });
  
  // Hero background slight zoom out for cinematic effect
  gsap.fromTo('.hero-bg-media',
    { scale: 1.1 },
    { scale: 1, duration: 4, ease: "power2.out" }
  );
}

function initScrollReveals() {
  const revealElements = document.querySelectorAll('.gs-reveal:not(.header):not(.scroll-indicator)');

  revealElements.forEach((elem) => {
    // Set initial state
    gsap.set(elem, { autoAlpha: 0, y: 50 });

    ScrollTrigger.create({
      trigger: elem,
      start: "top 85%", // when top of element hits 85% of viewport height
      once: true,
      onEnter: () => {
        gsap.to(elem, {
          autoAlpha: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out"
        });
      }
    });
  });
}

function initParallax() {
  // Simple parallax for hero background
  const heroBg = document.querySelector('.hero-bg-media');
  if (heroBg) {
    gsap.to(heroBg, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }

  // Add parallax depth to expertise numbers
  const expertiseNumbers = document.querySelectorAll('.expertise-number');
  expertiseNumbers.forEach((num) => {
    gsap.to(num, {
      y: -60, // Move up slightly faster than the text
      ease: "none",
      scrollTrigger: {
        trigger: num.parentElement,
        start: "top 90%",
        end: "bottom 20%",
        scrub: 1 // smooth scrubbing
      }
    });
  });

  // Add parallax depth to special content blocks
  const parallaxBlocks = document.querySelectorAll('.gs-parallax');
  parallaxBlocks.forEach((block) => {
    gsap.fromTo(block, 
      { y: 40 },
      {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: block.parentElement,
          start: "top 85%",
          end: "bottom 30%",
          scrub: 1.5
        }
      }
    );
  });
}
