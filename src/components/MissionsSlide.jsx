import React, { useEffect, useRef, useState } from 'react';

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const CrosshairIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" />
    <line x1="12" y1="1" x2="12" y2="6" strokeLinecap="round" />
    <line x1="12" y1="18" x2="12" y2="23" strokeLinecap="round" />
    <line x1="1" y1="12" x2="6" y2="12" strokeLinecap="round" />
    <line x1="18" y1="12" x2="23" y2="12" strokeLinecap="round" />
  </svg>
);
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" /><ellipse cx="12" cy="12" rx="4" ry="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M6 6c2 1.5 4 2 6 2s4-.5 6-2" /><path d="M6 18c2-1.5 4-2 6-2s4 .5 6 2" />
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const SkullIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2a9 9 0 0 1 9 9c0 3.5-2 6.5-5 8v3H8v-3c-3-1.5-5-4.5-5-8a9 9 0 0 1 9-9z" />
    <path d="M9 17v1M15 17v1" strokeLinecap="round" />
    <circle cx="9" cy="12" r="1.5" fill="currentColor" />
    <circle cx="15" cy="12" r="1.5" fill="currentColor" />
  </svg>
);
const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// ─── Skull difficulty ─────────────────────────────────────────────────────────
const SkullRating = ({ count, max = 5 }) => (
  <div className="ms2-skull-rating" aria-label={`Difficulty ${count} of ${max}`}>
    {Array.from({ length: max }, (_, i) => (
      <span key={i} className={`ms2-skull-icon ${i < count ? 'ms2-skull-icon--active' : ''}`}>
        <SkullIcon />
      </span>
    ))}
  </div>
);

// ─── Mission Data ─────────────────────────────────────────────────────────────
const MISSIONS = [
  {
    id: 1, num: '01', icon: CrosshairIcon,
    title: 'THE IMPOSSIBLE TASK',
    desc: 'Neutralized high-value targets in seemingly impossible scenarios.',
    status: 'COMPLETED', statusColor: '#22c55e',
    classified: false,
    location: 'NEW YORK',
    difficulty: 4,
  },
  {
    id: 2, num: '02', icon: GlobeIcon,
    title: 'HIGH TABLE OPERATIONS',
    desc: 'Executed covert missions on behalf of the High Table.',
    status: 'COMPLETED', statusColor: '#22c55e',
    classified: false,
    location: 'ROME',
    difficulty: 5,
  },
  {
    id: 3, num: '03', icon: ShieldIcon,
    title: 'CONTINENTAL RECOVERY',
    desc: 'Recovered assets and eliminated threats across multiple continents.',
    status: 'ACTIVE', statusColor: '#ff2b2b',
    classified: true,
    location: 'CASABLANCA',
    difficulty: 3,
  },
  {
    id: 4, num: '04', icon: SkullIcon,
    title: 'GLOBAL PURSUIT',
    desc: 'Hunted relentlessly across the globe, leaving no one behind.',
    status: 'CLASSIFIED', statusColor: '#f59e0b',
    classified: false,
    location: 'PARIS',
    difficulty: 5,
  },
];

// ─── Typewriter hook ──────────────────────────────────────────────────────────
function useTypewriter(text, active, delay = 0) {
  const [displayed, setDisplayed] = useState('');
  const timerRef = useRef(null);
  useEffect(() => {
    if (!active) { setDisplayed(''); return; }
    let i = 0;
    setDisplayed('');
    timerRef.current = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, 22);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timerRef.current);
  }, [text, active, delay]);
  return displayed;
}

// ─── Hover-glitch title ───────────────────────────────────────────────────────
const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#@!%&';
function GlitchTitle({ text }) {
  const [display, setDisplay] = useState(text);
  const [glitching, setGlitching] = useState(false);
  const intervalRef = useRef(null);

  const startGlitch = () => {
    let iter = 0;
    setGlitching(true);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDisplay(
        text.split('').map((ch, i) => {
          if (ch === ' ') return ' ';
          if (i < iter) return text[i];
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        }).join('')
      );
      iter += 0.6;
      if (iter >= text.length) {
        clearInterval(intervalRef.current);
        setDisplay(text);
        setGlitching(false);
      }
    }, 28);
  };

  return (
    <h3
      className={`ms2-card-title${glitching ? ' ms2-card-title--glitch' : ''}`}
      onMouseEnter={startGlitch}
    >
      {display}
    </h3>
  );
}

// ─── Countdown Timer ──────────────────────────────────────────────────────────
function CountdownTimer() {
  // Fixed target: 72 hours from now (static for cinematic effect)
  const targetRef = useRef(Date.now() + 72 * 60 * 60 * 1000 + 14 * 60 * 1000 + 37 * 1000);
  const [time, setTime] = useState({ h: '72', m: '14', s: '37' });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, targetRef.current - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTime({
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0'),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="ms2-countdown" aria-label="Next mission countdown">
      <div className="ms2-countdown-label">NEXT MISSION IN</div>
      <div className="ms2-countdown-display">
        <div className="ms2-countdown-unit">
          <span className="ms2-countdown-val">{time.h}</span>
          <span className="ms2-countdown-unit-label">HRS</span>
        </div>
        <span className="ms2-countdown-sep">:</span>
        <div className="ms2-countdown-unit">
          <span className="ms2-countdown-val">{time.m}</span>
          <span className="ms2-countdown-unit-label">MIN</span>
        </div>
        <span className="ms2-countdown-sep">:</span>
        <div className="ms2-countdown-unit">
          <span className="ms2-countdown-val">{time.s}</span>
          <span className="ms2-countdown-unit-label">SEC</span>
        </div>
      </div>
    </div>
  );
}

// ─── Mission Card ─────────────────────────────────────────────────────────────
function MissionCard({ mission, index, revealed }) {
  const desc = useTypewriter(mission.desc, revealed, 600 + index * 180);

  return (
    <li className="ms2-card-li">
      {index > 0 && (
        <div
          className="ms2-divider"
          style={{ animationDelay: revealed ? `${0.08 + index * 0.18}s` : '0s' }}
          data-visible={revealed}
        />
      )}
      <div
        className="ms2-mission-card"
        style={{ animationDelay: revealed ? `${0.15 + index * 0.18}s` : '0s' }}
        data-visible={revealed}
      >
        <span className="ms2-card-num" aria-hidden="true">{mission.num}</span>
        {mission.classified && (
          <div className="ms2-classified-stamp" aria-label="Classified">
            <span>CLASSIFIED</span>
          </div>
        )}
        <div className="ms2-card-inner">
          <div className="ms2-card-icon" aria-hidden="true">
            <mission.icon />
            <div className="ms2-icon-glow" />
          </div>
          <div className="ms2-card-text">
            {/* Title row with glitch + status badge */}
            <div className="ms2-card-header-row">
              <GlitchTitle text={mission.title} />
              <span className="ms2-status-badge" style={{ '--badge-color': mission.statusColor }}>
                <span className="ms2-status-dot" />
                {mission.status}
              </span>
            </div>

            {/* Location + difficulty */}
            <div className="ms2-card-meta-row">
              <span className="ms2-card-location">
                <PinIcon />
                {mission.location}
              </span>
              <SkullRating count={mission.difficulty} />
            </div>

            {/* Typewriter description */}
            <p className="ms2-card-desc">
              {desc}
              {desc.length < mission.desc.length && revealed && (
                <span className="ms2-typewriter-cursor">|</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}

// ─── Tactical HUD overlay ─────────────────────────────────────────────────────
function PortraitHUD({ visible }) {
  return (
    <div className={`ms2-hud ${visible ? 'ms2-hud--visible' : ''}`} aria-hidden="true">
      <div className="ms2-hud-bracket ms2-hud-bracket--tl" />
      <div className="ms2-hud-bracket ms2-hud-bracket--tr" />
      <div className="ms2-hud-bracket ms2-hud-bracket--bl" />
      <div className="ms2-hud-bracket ms2-hud-bracket--br" />
      <div className="ms2-hud-reticle">
        <div className="ms2-hud-reticle-ring ms2-hud-reticle-ring--outer" />
        <div className="ms2-hud-reticle-ring ms2-hud-reticle-ring--inner" />
        <div className="ms2-hud-reticle-cross ms2-hud-reticle-cross--h" />
        <div className="ms2-hud-reticle-cross ms2-hud-reticle-cross--v" />
      </div>
      <div className="ms2-hud-data ms2-hud-data--tl">
        <div className="ms2-hud-data-row"><span className="ms2-hud-label">ID</span><span className="ms2-hud-val">JOHN WICK</span></div>
        <div className="ms2-hud-data-row"><span className="ms2-hud-label">STATUS</span><span className="ms2-hud-val ms2-hud-val--red">ACTIVE</span></div>
        <div className="ms2-hud-data-row"><span className="ms2-hud-label">CLEARANCE</span><span className="ms2-hud-val">LEVEL 12</span></div>
      </div>
      <div className="ms2-hud-data ms2-hud-data--br">
        <div className="ms2-hud-data-row"><span className="ms2-hud-label">THREAT</span><span className="ms2-hud-val ms2-hud-val--red">EXTREME</span></div>
        <div className="ms2-hud-data-row"><span className="ms2-hud-label">ALIAS</span><span className="ms2-hud-val">BABA YAGA</span></div>
      </div>
      <div className="ms2-hud-scanline" />
    </div>
  );
}

// ─── Particles ────────────────────────────────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 22 }, (_, i) => ({
    id: i, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
    size: Math.random() * 2.5 + 0.8, delay: Math.random() * 6,
    dur: Math.random() * 5 + 4, opacity: Math.random() * 0.35 + 0.08,
  }));
  return (
    <div className="ms2-particles" aria-hidden="true">
      {particles.map((p) => (
        <span key={p.id} className="ms2-particle" style={{
          left: p.left, top: p.top, width: p.size, height: p.size,
          animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`, opacity: p.opacity,
        }} />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MissionsSlide({ active, direction }) {
  const slideRef = useRef(null);
  const [phase, setPhase] = useState('idle');

  useEffect(() => {
    if (active) {
      const t1 = setTimeout(() => setPhase('sweep'), 100);
      const t2 = setTimeout(() => setPhase('reveal'), 900);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      setPhase('idle');
    }
  }, [active]);

  const revealed = phase === 'reveal';

  return (
    <div 
      className="slide ms2-slide" 
      id="missions" 
      ref={slideRef}
      style={{
        opacity: active ? 1 : 0.3,
        transition: 'opacity 0.6s ease-in-out'
      }}
    >
      <div className={`ms2-bg ${revealed ? 'ms2-bg--zoomed' : ''}`}>
        <div className="ms2-bg-image" />
      </div>
      <Particles />
      <div className={`ms2-laser-sweep ${phase === 'sweep' ? 'ms2-laser-sweep--active' : ''}`} aria-hidden="true">
        <div className="ms2-laser-beam" />
        <div className="ms2-laser-trail" />
      </div>
      <div className={`ms2-fade-overlay ${phase !== 'idle' ? 'ms2-fade-overlay--gone' : ''}`} aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />
      <div className={`ms2-scan-line ${revealed ? 'ms2-scan-line--active' : ''}`} aria-hidden="true" />
      <div className={`ms2-chapter-tag ${revealed ? 'ms2-chapter-tag--visible' : ''}`}>
        <span>SECTION 02</span><span className="ms2-chapter-sep">///</span><span>CHAPTER REVEAL</span>
      </div>

      <div className="ms2-content-grid">
        {/* LEFT — Portrait + HUD */}
        <div className={`ms2-portrait-wrap ${revealed ? 'ms2-portrait-wrap--visible' : ''}`}>
          <img src="/john-portrait.png" alt="John Wick" className="ms2-portrait-img" draggable={false} />
          <PortraitHUD visible={revealed} />
          <div className="ms2-portrait-fade-right" aria-hidden="true" />
          <div className="ms2-portrait-fade-bottom" aria-hidden="true" />
        </div>

        {/* RIGHT — Missions panel */}
        <aside className={`ms2-missions-panel ${revealed ? 'ms2-missions-panel--visible' : ''}`} aria-label="Missions">
          <div className="ms2-missions-header">
            <span className="ms2-missions-label">MISSIONS</span>
            <div className="ms2-header-line" />
          </div>

          <ul className="ms2-mission-list">
            {MISSIONS.map((m, i) => (
              <MissionCard key={m.id} mission={m} index={i} revealed={revealed} />
            ))}
          </ul>

          {/* Countdown timer */}
          <div className={`ms2-countdown-wrap ${revealed ? 'ms2-countdown-wrap--visible' : ''}`}>
            <CountdownTimer />
          </div>

          <div className="ms2-panel-bracket ms2-panel-bracket--tl" aria-hidden="true" />
          <div className="ms2-panel-bracket ms2-panel-bracket--br" aria-hidden="true" />
        </aside>
      </div>
    </div>
  );
}
