import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

/* ─── Data ────────────────────────────────────────────────────────── */
const TERMINAL_LINES = [
  '> INITIALIZING ARSENAL...',
  '> LOADING OPERATOR PROFILE...',
  '> VERIFYING SECURITY CLEARANCE...',
  '> ESTABLISHING SECURE CHANNEL...',
  '> READING CAPABILITY MATRIX...',
  '> FINALIZING PROTOCOLS...',
];

const CAPABILITIES = [
  {
    num: '01',
    title: 'CLOSE QUARTERS COMBAT',
    subLabel: 'SPECIALIZATION',
    tags: ['KRAV MAGA', 'JUDO', 'KNIFE DEFENSE'],
    threat: 10,
    direction: 'left',
  },
  {
    num: '02',
    title: 'TACTICAL MARKSMANSHIP',
    subLabel: 'PLATFORMS',
    tags: ['HANDGUNS', 'CARBINES', 'PRECISION RIFLES'],
    threat: 9,
    direction: 'right',
  },
  {
    num: '03',
    title: 'STEALTH OPERATIONS',
    subLabel: 'CAPABILITIES',
    tags: ['SILENT ENTRY', 'SURVEILLANCE', 'TRACKING'],
    threat: 10,
    direction: 'left',
  },
  {
    num: '04',
    title: 'EVASION & MOBILITY',
    subLabel: 'CAPABILITIES',
    tags: ['PARKOUR', 'TACTICAL DRIVING', 'RAPID EXTRACTION'],
    threat: 8,
    direction: 'right',
  },
];

/* ─── Terminal Component ──────────────────────────────────────────── */
const SystemTerminal = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState('');
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done, setDone] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (isInView && !started) setStarted(true);
  }, [isInView, started]);

  useEffect(() => {
    if (!started || done) return;
    if (lineIdx >= TERMINAL_LINES.length) {
      setDone(true);
      onComplete?.();
      return;
    }
    const fullLine = TERMINAL_LINES[lineIdx];
    if (charIdx <= fullLine.length) {
      const timer = setTimeout(() => {
        setCurrentLine(fullLine.slice(0, charIdx));
        setCharIdx(c => c + 1);
      }, 30);
      return () => clearTimeout(timer);
    } else {
      setLines(prev => [...prev, fullLine]);
      setCurrentLine('');
      setCharIdx(0);
      setLineIdx(i => i + 1);
    }
  }, [started, done, lineIdx, charIdx, onComplete]);

  return (
    <div className="ms4-terminal" ref={ref}>
      <div className="ms4-terminal-header">
        <span className="ms4-terminal-icon">{'>'}_</span>
        <span className="ms4-terminal-title">SYSTEM TERMINAL</span>
        <div className="ms4-terminal-dots">
          <span className="ms4-dot ms4-dot--orange" />
          <span className="ms4-dot ms4-dot--pink" />
          <span className="ms4-dot ms4-dot--purple" />
        </div>
      </div>
      <div className="ms4-terminal-body">
        {lines.map((line, i) => (
          <div key={i} className="ms4-terminal-line">{line}</div>
        ))}
        {!done && currentLine && (
          <div className="ms4-terminal-line">
            {currentLine}<span className="ms4-cursor">█</span>
          </div>
        )}
        {done && (
          <div className="ms4-terminal-line ms4-terminal-line--granted">
            {'>'} ACCESS GRANTED
          </div>
        )}
      </div>
      {/* Continental seal watermark */}
      <div className="ms4-terminal-seal">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.08">
          <circle cx="50" cy="50" r="45" />
          <circle cx="50" cy="50" r="38" />
          <circle cx="50" cy="50" r="30" />
          <text x="50" y="52" textAnchor="middle" fontSize="6" fill="currentColor" stroke="none" opacity="0.3">FORTIS FORTUNA ADIUVAT</text>
        </svg>
      </div>
    </div>
  );
};

/* ─── Threat Bar Component ────────────────────────────────────────── */
const ThreatBar = ({ level, animate }) => {
  const totalBars = 10;
  const fillPercent = (level / 10) * 100;

  return (
    <div className="ms4-threat">
      <span className="ms4-threat-label">THREAT LEVEL</span>
      <div className="ms4-threat-bar-wrap">
        <div className="ms4-threat-bar-bg">
          <motion.div
            className="ms4-threat-bar-fill"
            initial={{ width: '0%' }}
            animate={animate ? { width: `${fillPercent}%` } : { width: '0%' }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
          {animate && <div className="ms4-threat-scanner" />}
        </div>
        <span className="ms4-threat-score">
          <span className="ms4-threat-score-big">{level}</span>/10
        </span>
      </div>
    </div>
  );
};

/* ─── Capability Card Component ───────────────────────────────────── */
const CapabilityCard = ({ cap, index, show }) => {
  const xOffset = cap.direction === 'left' ? -120 : 120;

  return (
    <motion.div
      className="ms4-card"
      initial={{ x: xOffset, opacity: 0 }}
      animate={show ? { x: 0, opacity: 1 } : { x: xOffset, opacity: 0 }}
      transition={{
        duration: 0.8,
        delay: index * 0.2,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Card number */}
      <div className="ms4-card-num">{cap.num}</div>

      {/* Card content */}
      <div className="ms4-card-body">
        <h3 className="ms4-card-title">{cap.title}</h3>
        <span className="ms4-card-sublabel">{cap.subLabel}</span>
        <div className="ms4-card-tags">
          {cap.tags.map((tag, i) => (
            <React.Fragment key={i}>
              <span className="ms4-card-tag">{tag}</span>
              {i < cap.tags.length - 1 && <span className="ms4-card-sep">•</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Threat bar */}
      <ThreatBar level={cap.threat} animate={show} />

      {/* Hover glow scanline */}
      <div className="ms4-card-glow-line" />
    </motion.div>
  );
};

/* ─── Rain Effect ─────────────────────────────────────────────────── */
const RainEffect = () => {
  const drops = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 3}s`,
    duration: `${0.4 + Math.random() * 0.6}s`,
    height: `${15 + Math.random() * 25}px`,
    opacity: 0.08 + Math.random() * 0.12,
  }));

  return (
    <div className="ms4-rain">
      {drops.map(d => (
        <div
          key={d.id}
          className="ms4-raindrop"
          style={{
            left: d.left,
            animationDelay: d.delay,
            animationDuration: d.duration,
            height: d.height,
            opacity: d.opacity,
          }}
        />
      ))}
    </div>
  );
};

/* ─── Main Arsenal Slide ──────────────────────────────────────────── */
export default function ArsenalSlide() {
  const [terminalDone, setTerminalDone] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const handleTerminalComplete = useCallback(() => {
    setTerminalDone(true);
  }, []);

  return (
    <div className="slide ms4-slide" id="arsenal" ref={sectionRef}>

      {/* ── Background Effects ── */}
      <div className="ms4-bg-effects">
        <div className="ms4-neon-bloom ms4-neon-bloom--left" />
        <div className="ms4-neon-bloom ms4-neon-bloom--right" />
        <div className="ms4-grid-overlay" />
        <div className="ms4-scanline-sweep" />
        <RainEffect />
        <div className="ms4-fog ms4-fog--1" />
        <div className="ms4-fog ms4-fog--2" />
        <div className="ms4-dust-particles" />
      </div>

      {/* ── Flicker overlay ── */}
      <div className="ms4-flicker" />

      {/* ── Top decorative line ── */}
      <div className="ms4-top-line" />

      {/* ── Main Content ── */}
      <div className="ms4-content">

        {/* Header */}
        <motion.div
          className="ms4-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="ms4-header-tagline">THE MAN. THE MYTH. THE BABA YAGA.</p>
          <h2 className="ms4-header-title">ARSENAL</h2>
          <p className="ms4-header-sub">OPERATIONAL CAPABILITIES</p>
          <div className="ms4-header-divider" />
        </motion.div>

        {/* Two-column layout */}
        <div className="ms4-columns">

          {/* Left: Terminal */}
          <div className="ms4-col-left">
            <SystemTerminal onComplete={handleTerminalComplete} />

            {/* Decorative: encrypted feed */}
            <div className="ms4-encrypted-feed">
              <span className="ms4-feed-bar" />
              <span className="ms4-feed-text">█▓▒░ ENCRYPTED FEED ░▒▓█</span>
            </div>
          </div>

          {/* Right: Capability Cards */}
          <div className="ms4-col-right">
            {CAPABILITIES.map((cap, idx) => (
              <CapabilityCard
                key={cap.num}
                cap={cap}
                index={idx}
                show={terminalDone}
              />
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <motion.div
          className="ms4-bottom-quote"
          initial={{ opacity: 0 }}
          animate={terminalDone ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <p className="ms4-quote-text">"PEOPLE KEEP ASKING IF I'M BACK. YEAH, I'M THINKING I'M BACK."</p>
          <p className="ms4-quote-author">— JOHN WICK</p>
        </motion.div>
      </div>
    </div>
  );
}
