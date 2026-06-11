import { useState, useEffect, useRef } from 'react';

const createHeroPoster = () => {
  const horizontalLines = Array.from({ length: 18 }, (_, index) => (
    `<line x1="0" y1="${index * 50}" x2="1600" y2="${index * 50}" />`
  )).join('');
  const verticalLines = Array.from({ length: 28 }, (_, index) => (
    `<line x1="${index * 60}" y1="0" x2="${index * 60}" y2="900" />`
  )).join('');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="none">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#020203" />
          <stop offset="100%" stop-color="#000000" />
        </linearGradient>
        <linearGradient id="scan" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#ff2b2b" stop-opacity="0" />
          <stop offset="50%" stop-color="#ff2b2b" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#ff2b2b" stop-opacity="0" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#bg)" />
      <g opacity="0.16" stroke="#17171b" stroke-width="1">
        ${horizontalLines}
        ${verticalLines}
      </g>
      <rect y="500" width="1600" height="2" fill="url(#scan)" opacity="0.8" />
      <rect y="508" width="1600" height="1" fill="#ff2b2b" opacity="0.08" />
      <rect y="492" width="1600" height="1" fill="#ff2b2b" opacity="0.08" />
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const heroPosterSrc = createHeroPoster();

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const SignalIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <path d="M12 4v3M12 17v3M4 12h3M17 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ArchiveIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6h16v12H4z" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 10h8M8 14h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const CrosshairIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="12" y1="1" x2="12" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="12" y1="18" x2="12" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="1" y1="12" x2="6" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="18" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const EyeSlashIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ShieldCheckIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 11l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Glitch title chars ───────────────────────────────────────────────────────
const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!%&';

function GlitchText({ text, className, onGlitch }) {
  const [displayed, setDisplayed] = useState(text);
  const [glitching, setGlitching] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const triggerGlitch = () => {
      let iterations = 0;
      const original = text.split('');
      clearInterval(intervalRef.current);
      setGlitching(true);
      onGlitch?.(true);

      intervalRef.current = setInterval(() => {
        setDisplayed(
          original
            .map((char, i) => {
              if (char === '.' || char === ' ') return char;
              if (i < iterations) return original[i];
              return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
            })
            .join('')
        );
        iterations += 0.4;
        if (iterations >= original.length) {
          clearInterval(intervalRef.current);
          setDisplayed(text);
          setGlitching(false);
          onGlitch?.(false);
        }
      }, 30);
    };

    const initialTimer = setTimeout(triggerGlitch, 800);

    const scheduleNext = () => {
      const delay = 4000 + Math.random() * 4000;
      timeoutRef.current = setTimeout(() => {
        triggerGlitch();
        scheduleNext();
      }, delay);
    };
    scheduleNext();

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [text, onGlitch]);

  return <span className={`${className}${glitching ? ' text-scrambling' : ''}`}>{displayed}</span>;
}

// Syncs glitch state across both title lines
function GlitchTitle() {
  const [johnGlitching, setJohnGlitching] = useState(false);
  const [wickGlitching, setWickGlitching] = useState(false);
  return (
    <>
      <h1
        className={`hero-title-outlined${johnGlitching ? ' is-glitching' : ''}`}
        data-text="JOHN."
      >
        <GlitchText text="JOHN" className="glitch-word" onGlitch={setJohnGlitching} />
        <span className="title-dot">.</span>
      </h1>
      <h1
        className={`hero-title-solid${wickGlitching ? ' is-glitching' : ''}`}
        data-text="WICK"
      >
        <GlitchText text="WICK" className="glitch-solid" onGlitch={setWickGlitching} />
      </h1>
    </>
  );
}


// ─── Animated counter ────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', duration = 1800, startDelay = 0, active }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      const resetTimer = setTimeout(() => setValue(0), 0);
      return () => clearTimeout(resetTimer);
    }
    const timer = setTimeout(() => {
      const startTime = performance.now();
      const animate = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.floor(eased * target));
        if (progress < 1) requestAnimationFrame(animate);
        else setValue(target);
      };
      requestAnimationFrame(animate);
    }, startDelay);
    return () => clearTimeout(timer);
  }, [active, target, duration, startDelay]);

  return (
    <div className="stat-value">
      {value}{suffix}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HeroSlide({ active }) {
  const [currentTime, setCurrentTime] = useState('');
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef(null);
  const backgroundVideoSrc = `${import.meta.env.BASE_URL}jw1.mp4`;

  useEffect(() => {
    const updateNYClock = () => {
      try {
        const timeStr = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/New_York',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }).format(new Date());
        setCurrentTime(timeStr);
      } catch {
        const d = new Date();
        setCurrentTime(d.toLocaleTimeString());
      }
    };
    updateNYClock();
    const interval = setInterval(updateNYClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const logPrefix = '[Hero video]';
    const attemptPlayback = async (reason) => {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');

      try {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
        setVideoReady(true);
        setVideoFailed(false);
        console.info(`${logPrefix} autoplay started`, { reason, sourceUrl: video.currentSrc || backgroundVideoSrc });
      } catch (error) {
        setVideoFailed(true);
        console.warn(`${logPrefix} autoplay failed`, { reason, sourceUrl: video.currentSrc || backgroundVideoSrc, error });
      }
    };

    const handleLoadedData = () => {
      setVideoFailed(false);
      console.info(`${logPrefix} video loaded`, { sourceUrl: video.currentSrc || backgroundVideoSrc });
      attemptPlayback('loadeddata');
    };

    const handleCanPlay = () => {
      setVideoReady(true);
      setVideoFailed(false);
      console.info(`${logPrefix} video can play`, { sourceUrl: video.currentSrc || backgroundVideoSrc });
      attemptPlayback('canplay');
    };

    const handleError = () => {
      setVideoFailed(true);
      console.error(`${logPrefix} video failed to load`, {
        sourceUrl: video.currentSrc || backgroundVideoSrc,
        error: video.error,
      });
    };

    console.info(`${logPrefix} source URL`, backgroundVideoSrc);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    attemptPlayback('mount');

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [backgroundVideoSrc]);

  return (
    <div className="hero-slide slide" id="home">
      {/* Background */}
      <div className="video-background-container">
        <img
          src={heroPosterSrc}
          alt=""
          className="video-poster-fallback"
          aria-hidden="true"
          draggable={false}
        />
        <video
          ref={videoRef}
          autoPlay
          muted
          defaultMuted
          loop
          playsInline
          webkit-playsinline="true"
          preload="auto"
          poster={heroPosterSrc}
          className={`background-video${videoFailed ? ' is-failed' : ''}${videoReady ? ' is-ready' : ''}`}
          aria-hidden="true"
        >
          <source src={backgroundVideoSrc} type="video/mp4" />
        </video>
        <div className="video-fallback-gradient"></div>
      </div>

      <div className="grid-overlay"></div>

      {/* Top Navigation Header */}
      <header className="header-nav">
        <div className="nav-clock">
          <span>NEW YORK TIME - {currentTime || '11:47:32 PM'}</span>
        </div>
        <nav>
          <ul className="nav-links">
            <li><a href="#home">HOME</a></li>
            <li><a href="#missions">MISSIONS</a></li>
            <li><a href="#achievements">TARGETS</a></li>
            <li><a href="#arsenal">ARSENAL</a></li>
            <li><a href="#legend">ASSESSMENT</a></li>
          </ul>
        </nav>
        <a href="mailto:contact@johnwick.com" className="email-btn">
          <span className="email-dot"></span>
          EMAIL ME
        </a>
      </header>

      {/* Main Content Area */}
      <main className="hero-content">
        <span className="hero-subtitle">
          LEGEND. MYTH. GHOST.
        </span>
        <div className="title-container">
          <GlitchTitle />
        </div>
        <div className="hero-footer">
          <div className="footer-line-accent">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <div className="line-bar"></div>
          </div>
          <span className="hero-motto">
            STAY FOCUSED. STAY DEADLY.
          </span>
        </div>
      </main>

      {/* Bottom Left Scroll Indicator */}
      <div className="bottom-left-section">
        <a href="#missions" className="scroll-indicator">
          <span className="scroll-text">SCROLL DOWN</span>
          <div className="scroll-line-container">
            <div className="scroll-line-fill"></div>
          </div>
        </a>
      </div>

      {/* Bottom Right Stats Section — Animated Counters */}
      <section className="bottom-right-stats" aria-label="Target Performance Statistics">
        <div className="stat-card">
          <div className="stat-card-accent-lines"></div>
          <div className="stat-card-grid"></div>
          <div className="stat-icon" aria-hidden="true">
            <CrosshairIcon />
          </div>
          <AnimatedCounter target={387} duration={1600} startDelay={200} active={active} />
          <div className="stat-label">KILLS</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-accent-lines"></div>
          <div className="stat-card-grid"></div>
          <div className="stat-icon" aria-hidden="true">
            <EyeSlashIcon />
          </div>
          <AnimatedCounter target={0} duration={800} startDelay={400} active={active} />
          <div className="stat-label">WITNESSES</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-accent-lines"></div>
          <div className="stat-card-grid"></div>
          <div className="stat-icon" aria-hidden="true">
            <ShieldCheckIcon />
          </div>
          <AnimatedCounter target={100} suffix="%" duration={1400} startDelay={600} active={active} />
          <div className="stat-label">SUCCESS RATE</div>
        </div>
      </section>
    </div>
  );
}
