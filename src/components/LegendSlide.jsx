import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import WorldMap from './WorldMap';

/* ─── Tracking Nodes (Precise World Map Projection Coordinates) ───── */
const NODES = [
  { city: 'NEW YORK', x: 242, y: 345, contracts: 12, percentX: 26.9, percentY: 22.5, dir: 'right' },
  { city: 'CASABLANCA', x: 398, y: 445, contracts: 7, percentX: 46.8, percentY: 44.3, dir: 'left' },
  { city: 'PARIS', x: 415, y: 390, contracts: 10, percentX: 49.0, percentY: 32.4, dir: 'top' },
  { city: 'ROME', x: 428, y: 415, contracts: 9, percentX: 50.7, percentY: 37.8, dir: 'right' },
  { city: 'OSAKA', x: 718, y: 406, contracts: 11, percentX: 87.6, percentY: 35.8, dir: 'left' },
];

/* ─── Stats ───────────────────────────────────────────────────────── */
const STATS = [
  { label: 'CONTRACTS\nACCEPTED', value: 47, icon: '⊕' },
  { label: 'CONTRACTS\nCOMPLETED', value: 46, icon: '◉' },
  { label: 'BOUNTIES\nCOLLECTED', value: 38, icon: '$' },
  { label: 'EXTRACTIONS\nSUCCESSFUL', value: 31, icon: '⇧' },
  { label: 'SURVIVAL\nRATE', value: 98, icon: '♥', suffix: '%' },
];

/* ─── Profile Skills ──────────────────────────────────────────────── */
const SKILLS = [
  { name: 'ELIMINATION', level: 'EXPERT' },
  { name: 'WEAPON PROFICIENCY', level: 'MASTER' },
  { name: 'HAND TO HAND COMBAT', level: 'MASTER' },
  { name: 'STEALTH', level: 'EXPERT' },
  { name: 'STRATEGY & ADAPTABILITY', level: 'MASTER' },
  { name: 'RESOURCEFULNESS', level: 'EXPERT' },
];

/* ─── Animated Counter ────────────────────────────────────────────── */
const Counter = ({ target, suffix = '', isInView, delay = 0 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    const t = setTimeout(() => {
      let start = Date.now();
      const dur = 1800;
      const iv = setInterval(() => {
        const p = Math.min((Date.now() - start) / dur, 1);
        setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
        if (p >= 1) clearInterval(iv);
      }, 16);
    }, delay);
    return () => clearTimeout(t);
  }, [isInView, target, delay]);
  return <>{count}{suffix}</>;
};

/* ─── Radar / World Map Component ─────────────────────────────────── */
const Radar = ({ isInView }) => (
  <div className="ms5r-radar-wrap">
    {/* Absolute overlay container for interactive float cards */}
    <div className="ms5r-map-overlay" style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
      {NODES.map((node, i) => (
        <motion.div
          key={node.city}
          className={`ms5r-map-card ms5r-map-card--${node.dir}`}
          style={{ left: `${node.percentX}%`, top: `${node.percentY}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 1.5 + i * 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="ms5r-map-card-city">{node.city}</span>
          <span className="ms5r-map-card-status">CONTRACT CLOSED</span>
          <span className="ms5r-map-card-contracts">{node.contracts.toString().padStart(2, '0')} MISSIONS</span>
        </motion.div>
      ))}
    </div>

    {/* SVG overlay rendering Map, grid, radar grid, and pulsing points */}
    <svg className="ms5r-radar-svg" viewBox="30.767 241.591 784.077 458.627" style={{ pointerEvents: 'auto' }}>
      <defs>
        <radialGradient id="radarSweepGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00AEEF" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#00AEEF" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#00AEEF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Detailed geographic outlines */}
      <WorldMap />

      {/* Longitude and Latitude grid coordinates (subtle military look) */}
      <g stroke="#00AEEF" strokeWidth="0.3" strokeOpacity="0.08" strokeDasharray="3 3">
        {[100, 200, 300, 400, 500, 600, 700].map(x => (
          <line key={`x-${x}`} x1={x} y1="241.591" x2={x} y2="700.218" />
        ))}
        {[300, 350, 400, 450, 500, 550, 600, 650].map(y => (
          <line key={`y-${y}`} x1="30.767" y1={y} x2="814.844" y2={y} />
        ))}
      </g>

      {/* Central Radar concentric rings */}
      <g>
        {[35, 75, 120, 170].map((r, i) => (
          <circle
            key={i}
            cx="422.8"
            cy="470.9"
            r={r}
            className={`ms5r-radar-circle ${i % 2 !== 0 ? 'ms5r-radar-circle--dashed' : ''}`}
          />
        ))}
        {/* Radar crosshairs */}
        <line x1="422.8" y1="260" x2="422.8" y2="680" className="ms5r-radar-crosshair" />
        <line x1="100" y1="470.9" x2="740" y2="470.9" className="ms5r-radar-crosshair" />
        
        {/* Central target core */}
        <circle cx="422.8" cy="470.9" r="4" className="ms5r-radar-center" />
        <circle cx="422.8" cy="470.9" r="9" fill="none" stroke="#00AEEF" strokeWidth="0.8" strokeOpacity="0.4" />
      </g>

      {/* Conic rotating scan sweep */}
      <g className="ms5r-radar-sweep-group">
        <path
          d="M 422.8 470.9 L 592.8 470.9 A 170 170 0 0 1 507.8 618.1 Z"
          fill="url(#radarSweepGrad)"
        />
        <line x1="422.8" y1="470.9" x2="592.8" y2="470.9" stroke="#00AEEF" strokeWidth="1" strokeOpacity="0.4" />
      </g>

      {/* Tracking lines from radar to markers */}
      <g>
        {NODES.map((node, i) => (
          <motion.line
            key={`line-${node.city}`}
            x1="422.8"
            y1="470.9"
            x2={node.x}
            y2={node.y}
            className="ms5r-radar-line"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ delay: 1.2 + i * 0.2, duration: 0.8 }}
          />
        ))}
      </g>

      {/* Tracking location markers (neon pink) */}
      <g>
        {NODES.map((node, i) => (
          <g key={`marker-${node.city}`}>
            {/* Animating ring */}
            <circle
              cx={node.x}
              cy={node.y}
              r="1"
              className="ms5r-marker-pulse"
              style={{ '--pulse-x': `${node.x}px`, '--pulse-y': `${node.y}px` }}
            />
            {/* Core location dot */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="4"
              className="ms5r-marker-dot"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1.0 + i * 0.2 }}
            />
          </g>
        ))}
      </g>
    </svg>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function LegendSlide() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const portraitSrc = `${import.meta.env.BASE_URL}john-portrait.png`;

  return (
    <div className="slide ms5-slide" id="legend" ref={ref}>

      {/* Background FX */}
      <div className="ms5r-bg">
        <div className="ms5r-bloom ms5r-bloom--bl" />
        <div className="ms5r-bloom ms5r-bloom--mg" />
        <div className="ms5r-grid-bg" />
        <div className="ms5r-scanlines-bg" />
        <div className="ms5r-noise-bg" />
      </div>

      <div className="ms5r-flicker" />

      {/* Content */}
      <div className="ms5r-content">

        {/* ── Top Header ── */}
        <motion.div
          className="ms5r-topheader"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="ms5r-topheader-left">
            <div className="ms5r-logo-small">
              <svg viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="24" height="24" rx="2" />
                <text x="8" y="20" fontSize="11" fill="currentColor" stroke="none" fontFamily="var(--font-display)" letterSpacing="1">JW</text>
              </svg>
            </div>
            <div>
              <span className="ms5r-topheader-sup">HIGH TABLE INTELLIGENCE DIVISION</span>
              <h2 className="ms5r-topheader-title">GLOBAL THREAT ASSESSMENT</h2>
              <span className="ms5r-topheader-tracking">TRACKING ACTIVE ASSET: <strong>JOHN</strong></span>
            </div>
          </div>
          <div className="ms5r-clearance">
            <span className="ms5r-clearance-label">CLEARANCE LEVEL</span>
            <span className="ms5r-clearance-value">OMEGA</span>
            <div className="ms5r-clearance-bars">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="ms5r-clearance-bar" style={{ background: i < 10 ? '#FF2EC4' : 'rgba(255,255,255,0.1)' }} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Split Dashboard ── */}
        <div className="ms5r-split">

          {/* LEFT: Radar + Stats */}
          <div className="ms5r-left">
            <Radar isInView={isInView} />

            {/* Mission Overview */}
            <motion.div
              className="ms5r-mission"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <span className="ms5r-mission-label">MISSION OVERVIEW</span>
              <div className="ms5r-stats-row">
                {STATS.map((s, i) => (
                  <div key={i} className="ms5r-stat-box">
                    <span className="ms5r-stat-icon">{s.icon}</span>
                    <span className="ms5r-stat-val">
                      <Counter target={s.value} suffix={s.suffix || ''} isInView={isInView} delay={1200 + i * 150} />
                    </span>
                    <span className="ms5r-stat-label">{s.label.split('\n').map((l, j) => <React.Fragment key={j}>{l}<br /></React.Fragment>)}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quote + Bottom Warning */}
            <div className="ms5r-left-bottom">
              <div className="ms5r-seal">
                <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.15">
                  <circle cx="30" cy="30" r="27" />
                  <circle cx="30" cy="30" r="22" />
                  <circle cx="30" cy="30" r="16" />
                </svg>
              </div>
              <div className="ms5r-quote-box">
                <p className="ms5r-quote">"PEOPLE KEEP ASKING IF I'M BACK.<br />"YEAH, I'M THINKING I'M BACK."</p>
                <p className="ms5r-quote-author">— JOHN WICK</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Dossier Panel */}
          <motion.div
            className="ms5r-right"
            initial={{ x: 60, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="ms5r-dossier">
              {/* Dossier Header */}
              <div className="ms5r-dossier-header">
                <div className="ms5r-dossier-logo">
                  <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <rect x="2" y="2" width="24" height="24" rx="2" />
                    <text x="6" y="19" fontSize="10" fill="currentColor" stroke="none" fontFamily="var(--font-display)">JW</text>
                  </svg>
                </div>
                <span className="ms5r-dossier-title">HIGH TABLE DOSSIER</span>
                <span className="ms5r-dossier-id">HTID: 82718-JW</span>
              </div>

              {/* Codename */}
              <div className="ms5r-codename-section">
                <div className="ms5r-codename-left">
                  <span className="ms5r-field-label">CODENAME</span>
                  <h2 className="ms5r-codename">JOHN</h2>
                  <div className="ms5r-status-row">
                    <span className="ms5r-field-label">STATUS</span>
                    <span className="ms5r-status-active">ACTIVE</span>
                  </div>
                  <div className="ms5r-threat-row">
                    <span className="ms5r-field-label">THREAT LEVEL</span>
                    <span className="ms5r-threat-red">RED</span>
                    <div className="ms5r-threat-dots">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="ms5r-threat-dot" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="ms5r-codename-photo">
                  <img src={portraitSrc} alt="John Wick" className="ms5r-photo-img" />
                  <div className="ms5r-photo-placeholder" />
                </div>
              </div>

              {/* Divider */}
              <div className="ms5r-dossier-divider" />

              {/* Assassin Profile */}
              <div className="ms5r-profile-section">
                <span className="ms5r-section-title">ASSASSIN PROFILE</span>
                <div className="ms5r-skills-list">
                  {SKILLS.map((skill, i) => (
                    <div key={i} className="ms5r-skill-row">
                      <span className="ms5r-skill-icon">⊙</span>
                      <span className="ms5r-skill-name">{skill.name}</span>
                      <span className={`ms5r-skill-level ${skill.level === 'MASTER' ? 'ms5r-skill-level--master' : ''}`}>
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="ms5r-dossier-divider" />

              {/* Reputation */}
              <div className="ms5r-reputation-section">
                <span className="ms5r-section-title">REPUTATION</span>
                <div className="ms5r-rep-grid">
                  <div className="ms5r-rep-row">
                    <span className="ms5r-rep-label">HIGH TABLE RATING</span>
                    <span className="ms5r-rep-stars">★★★★★</span>
                  </div>
                  <div className="ms5r-rep-row">
                    <span className="ms5r-rep-label">ASSASSIN RANK</span>
                    <span className="ms5r-rep-value">TIER I</span>
                  </div>
                  <div className="ms5r-rep-row">
                    <span className="ms5r-rep-label">BLACKLIST STATUS</span>
                    <span className="ms5r-rep-value ms5r-rep-value--warn">EXCOMMUNICADO</span>
                  </div>
                  <div className="ms5r-rep-row">
                    <span className="ms5r-rep-label">NOTORIETY</span>
                    <span className="ms5r-rep-value">WORLDWIDE</span>
                  </div>
                </div>
              </div>

              {/* Verdict */}
              <div className="ms5r-verdict">
                <span className="ms5r-verdict-label">HIGH TABLE VERDICT</span>
                <h3 className="ms5r-verdict-text">DO NOT ENGAGE</h3>
                <span className="ms5r-verdict-sub">EXCOMMUNICADO</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom Warning ── */}
        <motion.div
          className="ms5r-bottom-warning"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 2, duration: 0.6 }}
        >
          <span className="ms5r-warn-icon">⚠</span>
          <span className="ms5r-warn-text">THIS FILE IS CLASSIFIED — UNAUTHORIZED ACCESS IS PUNISHABLE BY DEATH</span>
          <span className="ms5r-warn-icon">⚠</span>
        </motion.div>
      </div>
    </div>
  );
}
