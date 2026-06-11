import React, { useState } from 'react';
import { motion } from 'framer-motion';

const makeAvatarDataUri = (label, accent) => {
  const initials = label
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" role="img" aria-label="${label}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#111318" />
          <stop offset="100%" stop-color="#050608" />
        </linearGradient>
      </defs>
      <rect width="240" height="240" rx="120" fill="url(#g)" />
      <circle cx="120" cy="96" r="42" fill="none" stroke="${accent}" stroke-width="4" opacity="0.55" />
      <path d="M48 208c10-41 38-62 72-62s62 21 72 62" fill="none" stroke="${accent}" stroke-width="4" opacity="0.35" />
      <circle cx="120" cy="88" r="22" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.16" />
      <text x="120" y="136" text-anchor="middle" font-family="Arial, sans-serif" font-size="54" font-weight="700" letter-spacing="2" fill="#ffffff">${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const TARGETS = [
  {
    id: 1,
    num: '01',
    code: 'T-01-4587',
    alias: 'THE VIPER',
    name: 'ALEXEI FEDOROV',
    location: 'MOSCOW, RU',
    threat: 'HIGH',
    img: makeAvatarDataUri('ALEXEI FEDOROV', '#ff2b2b'),
  },
  {
    id: 2,
    num: '02',
    code: 'T-02-6742',
    alias: 'THE BARON',
    name: 'VITTORIO SANTINI',
    location: 'ROME, IT',
    threat: 'HIGH',
    img: makeAvatarDataUri('VITTORIO SANTINI', '#ff2b2b'),
  },
  {
    id: 3,
    num: '03',
    code: 'T-03-2891',
    alias: 'THE WOLF',
    name: 'MARCUS VOLKOV',
    location: 'BERLIN, DE',
    threat: 'EXTREME',
    img: makeAvatarDataUri('MARCUS VOLKOV', '#ff2b2b'),
  }
];

const TOP_MARQUEE = "ACTIVE TARGET • CLASSIFIED • ELIMINATE • TRACKING • HIGH VALUE • CONTRACT OPEN • CONFIDENTIAL • ";
const BOTTOM_MARQUEE = "BABA YAGA • CONTRACT • EXECUTION • ELITE • DISCIPLINE • NO WITNESSES • FOCUS • PRECISION • LOYALTY • DANGER • ";

const backgroundVariants = {
  hidden: (dir) => ({
    x: dir === 'down' ? -10 : 10,
    opacity: 0
  }),
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: "easeOut" }
  }
};

const hudVariants = {
  hidden: (dir) => ({
    x: dir === 'down' ? '-120%' : '120%',
    opacity: 0,
    filter: 'blur(8px)'
  }),
  visible: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
  }
};

const contentVariants = {
  hidden: (dir) => ({
    x: dir === 'down' ? '-100%' : '100%',
    opacity: 0,
    filter: 'blur(8px)'
  }),
  visible: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
  }
};

const cardVariants = {
  hidden: ({ direction }) => ({
    x: direction === 'down' ? -60 : 60,
    opacity: 0
  }),
  visible: ({ index }) => ({
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.65,
      delay: 0.45 + index * 0.18,
      ease: [0.16, 1, 0.3, 1]
    }
  })
};

const ThreatBars = ({ threat, cardActive, index }) => {
  const count = threat === 'EXTREME' ? 12 : 8;
  return (
    <div className="ms3-threat-bars" style={{ display: 'inline-flex', marginLeft: 8, gap: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={cardActive ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
          transition={{
            duration: 0.12,
            delay: 0.45 + index * 0.18 + 0.35 + i * 0.025, // Fills block-by-block after card enters
            ease: "easeOut"
          }}
          style={{ width: 3, height: 8, background: '#ff2b2b', originY: 1 }}
        />
      ))}
    </div>
  );
};

const TargetCard = ({ target, index, isHovered, setHovered, active, direction }) => {
  const [isHoveringThis, setIsHoveringThis] = useState(false);
  const isDimmed = isHovered && !isHoveringThis;

  return (
    <motion.div
      className={`ms3-card ${isDimmed ? 'ms3-card--dimmed' : ''}`}
      onMouseEnter={() => { setIsHoveringThis(true); setHovered(true); }}
      onMouseLeave={() => { setIsHoveringThis(false); setHovered(false); }}
      custom={{ direction, index }}
      initial="hidden"
      animate={active ? "visible" : "hidden"}
      variants={cardVariants}
      whileHover={{
        y: -15,
        scale: 1.03,
        transition: { duration: 0.4, ease: "easeOut" }
      }}
    >
      {/* Dossier Scan Line */}
      {isHoveringThis && <div className="ms3-scanline" />}

      {/* Card Header */}
      <div className="ms3-card-header">
        <span className="ms3-target-label">
          <span className="ms3-target-marker" /> TARGET {target.num}
        </span>
        <span className="ms3-target-id">ID: {target.code}</span>
      </div>

      {/* Card Image */}
      <div className="ms3-card-img-wrap">
        <div className="ms3-img-borders">
          <div className="ms3-border-tl" />
          <div className="ms3-border-tr" />
          <div className="ms3-border-bl" />
          <div className="ms3-border-br" />
        </div>
        <motion.img 
          src={target.img} 
          alt={target.alias} 
          className="ms3-card-img"
          animate={{ scale: isHoveringThis ? 1.08 : 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ filter: "grayscale(100%) contrast(1.2)" }}
        />
      </div>

      {/* Card Data */}
      <div className="ms3-card-data">
        <div className="ms3-data-row">
          <span className="ms3-data-label">ALIAS:</span>
          <span className="ms3-data-val">{target.alias}</span>
        </div>
        <div className="ms3-data-row">
          <span className="ms3-data-label">REAL NAME:</span>
          <span className="ms3-data-val">{target.name}</span>
        </div>
        <div className="ms3-data-row">
          <span className="ms3-data-label">LOCATION:</span>
          <span className="ms3-data-val">{target.location}</span>
        </div>
        <div className="ms3-data-row">
          <span className="ms3-data-label">THREAT LEVEL:</span>
          <span className="ms3-data-val ms3-data-val--red">
            {/* Padlock icon placeholder */}
            <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10" style={{marginRight: 4, verticalAlign: 'middle'}}>
              <path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7c0-2.757-2.243-5-5-5zm-3 5c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7zm3 11a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
            {target.threat}
            <ThreatBars threat={target.threat} cardActive={active} index={index} />
          </span>
        </div>
      </div>

      {/* Status Bar */}
      <div className="ms3-card-status">
        STATUS: {isHoveringThis ? (
          <span style={{ color: '#ff2b2b' }}>
            <span className="ms3-status-pulse" /> LOCKED ON
          </span>
        ) : 'ACTIVE'}
        <span className="ms3-status-dot-right" />
      </div>

      <div className="ms3-card-footer">
        <span>// FILE {target.code}</span>
      </div>
    </motion.div>
  );
};

export default function AchievementsSlide({ active, direction = 'down' }) {
  const [isHovered, setHovered] = useState(false);
  const johnImageSrc = `${import.meta.env.BASE_URL}slide3-bg.png`;

  return (
    <div className="slide ms3-slide" id="achievements">
      
      {/* Top Marquee */}
      <div className="ms3-marquee ms3-marquee--top">
        <div className="ms3-marquee-mask">
          <motion.div 
            className="ms3-marquee-track"
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          >
            {TOP_MARQUEE.repeat(10)}
          </motion.div>
        </div>
      </div>

      {/* Background FX (detached from composition flow) */}
      <motion.div 
        className="ms3-global-fx"
        custom={direction}
        initial="hidden"
        animate={active ? "visible" : "hidden"}
        variants={backgroundVariants}
      >
        <div className="ms3-bg-breathe-glow" />
        <div className="ms3-particles" />
        <div className="ms3-bg-smoke" />
      </motion.div>

      {/* Main Centered Grid */}
      <div className="ms3-content-grid">
        
        {/* Left Column: John Wick Image & HUD */}
        <motion.div 
          className="ms3-john-panel"
          custom={direction}
          initial="hidden"
          animate={active ? "visible" : "hidden"}
          variants={hudVariants}
        >
          <img src={johnImageSrc} alt="John Wick" className="ms3-john-img" draggable={false} />
          
          <div className="ms3-left-hud">
            <h2 className="ms3-hud-name">JOHN WICK</h2>
            <p className="ms3-hud-alias">BABA YAGA</p>
            <p className="ms3-hud-status">STATUS: <span style={{color: '#ff2b2b'}}>ACTIVE</span></p>
            <div className="ms3-hud-reticle">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                 <circle cx="12" cy="12" r="8" />
                 <line x1="12" y1="2" x2="12" y2="22" />
                 <line x1="2" y1="12" x2="22" y2="12" />
               </svg>
            </div>
            <p className="ms3-hud-code">JW-001</p>
          </div>
        </motion.div>

        {/* Right Column: Title & Cards */}
        <motion.div 
          className="ms3-right-panel"
          custom={direction}
          initial="hidden"
          animate={active ? "visible" : "hidden"}
          variants={contentVariants}
        >
          <div className="ms3-header">
            <h4 className="ms3-header-sup">CLASSIFIED RECORDS</h4>
            <h2 className="ms3-header-main">ACHIEVEMENTS</h2>
          </div>

          <div className="ms3-cards-container">
            {TARGETS.map((target, idx) => (
              <TargetCard 
                key={target.id} 
                target={target} 
                index={idx} 
                isHovered={isHovered} 
                setHovered={setHovered} 
                active={active}
                direction={direction}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Marquee */}
      <div className="ms3-marquee ms3-marquee--bottom">
        <div className="ms3-marquee-mask">
          <motion.div 
            className="ms3-marquee-track"
            animate={{ x: [-1000, 0] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          >
            {BOTTOM_MARQUEE.repeat(10)}
          </motion.div>
        </div>
      </div>

    </div>
  );
}
