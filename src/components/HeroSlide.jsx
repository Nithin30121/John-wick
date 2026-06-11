import React, { useState, useEffect, useRef } from 'react';

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="currentColor" strokeWidth="2"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="2" y="9" width="4" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="4" cy="4" r="2" fill="none" stroke="currentColor" strokeWidth="2"/>
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

    setTimeout(triggerGlitch, 800);

    const scheduleNext = () => {
      const delay = 4000 + Math.random() * 4000;
      timeoutRef.current = setTimeout(() => {
        triggerGlitch();
        scheduleNext();
      }, delay);
    };
    scheduleNext();

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [text]);

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
      setValue(0);
      return;
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
      } catch (err) {
        const d = new Date();
        setCurrentTime(d.toLocaleTimeString());
      }
    };
    updateNYClock();
    const interval = setInterval(updateNYClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-slide slide" id="home">
      {/* Background */}
      <div className="video-background-container">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="background-video"
          aria-hidden="true"
        >
          <source src="/jw1.mp4" type="video/mp4" />
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

      {/* Left Sidebar Social Handles */}
      <aside className="left-sidebar">
        <div className="sidebar-line"></div>
        <ul className="social-list">
          <li>
            <a href="https://instagram.com" className="social-item" target="_blank" rel="noreferrer">
              <InstagramIcon />
              <span className="social-text">IG/WOODROCH</span>
            </a>
          </li>
          <li>
            <a href="https://github.com" className="social-item" target="_blank" rel="noreferrer">
              <GithubIcon />
              <span className="social-text">GH/WOODROCH</span>
            </a>
          </li>
          <li>
            <a href="https://linkedin.com" className="social-item" target="_blank" rel="noreferrer">
              <LinkedinIcon />
              <span className="social-text">LI/WOODROCH</span>
            </a>
          </li>
        </ul>
      </aside>

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
        <div className="logo-circle">
          <span>N</span>
        </div>
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
