import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import contactBg from '../assets/contact-bg.png';

/* ─── SVG Icons ────────────────────────────────────────────────────── */
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <polyline points="22,4 12,13 2,4"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const HighTableInsignia = () => (
  <svg viewBox="0 0 60 60" className="ct-insignia-svg">
    <circle cx="30" cy="30" r="28" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/>
    <circle cx="30" cy="30" r="22" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
    <polygon points="30,8 34,20 46,20 36,28 40,40 30,32 20,40 24,28 14,20 26,20" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.5"/>
    <text x="30" y="52" textAnchor="middle" fontSize="4" fill="currentColor" opacity="0.4" letterSpacing="1">HIGH TABLE</text>
  </svg>
);

/* ─── Contact Card Data ───────────────────────────────────────────── */
const CONTACT_CARDS = [
  {
    id: 'mail',
    icon: MailIcon,
    label: 'SECURE MAIL',
    sublabel: 'ENCRYPTED CHANNEL',
    placeholder: 'your.email@domain.com',
    color: '#00AEEF',
    delay: 0.2,
  },
  {
    id: 'linkedin',
    icon: LinkedInIcon,
    label: 'AGENCY PROFILE',
    sublabel: 'PROFESSIONAL NETWORK',
    placeholder: 'linkedin.com/in/yourprofile',
    color: '#FF2EC4',
    delay: 0.4,
  },
  {
    id: 'github',
    icon: GithubIcon,
    label: 'WEAPONS CACHE',
    sublabel: 'CODE REPOSITORY',
    placeholder: 'github.com/yourusername',
    color: '#6A00FF',
    delay: 0.6,
  },
  {
    id: 'web',
    icon: GlobeIcon,
    label: 'INTELLIGENCE HUB',
    sublabel: 'PORTFOLIO NETWORK',
    placeholder: 'www.yourwebsite.com',
    color: '#00AEEF',
    delay: 0.8,
  },
];

/* ─── Typing Text Hook ────────────────────────────────────────────── */
const useTypingEffect = (text, speed = 50, startDelay = 0, active = false) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    if (!active) { setDisplayed(''); return; }
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay, active]);
  return displayed;
};

/* ─── Rain Effect Component ───────────────────────────────────────── */
const RainEffect = () => {
  const drops = React.useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 0.5 + Math.random() * 0.5,
      opacity: 0.1 + Math.random() * 0.3,
    }));
  }, []);

  return (
    <div className="ct-rain">
      {drops.map(d => (
        <div
          key={d.id}
          className="ct-raindrop"
          style={{
            left: `${d.left}%`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
            opacity: d.opacity,
          }}
        />
      ))}
    </div>
  );
};

/* ─── Scanning Lines Component ────────────────────────────────────── */
const ScanLines = () => (
  <div className="ct-scanlines" />
);

/* ─── HUD Corner Brackets ─────────────────────────────────────────── */
const HUDCorners = () => (
  <>
    <div className="ct-hud-corner ct-hud-tl" />
    <div className="ct-hud-corner ct-hud-tr" />
    <div className="ct-hud-corner ct-hud-bl" />
    <div className="ct-hud-corner ct-hud-br" />
  </>
);

/* ─── Data Stream Component ───────────────────────────────────────── */
const DataStream = ({ side }) => {
  const chars = '01アイウエオカキクケコ█▓▒░';
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const generateLine = () =>
      Array.from({ length: 20 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

    const interval = setInterval(() => {
      setLines(prev => {
        const next = [...prev, generateLine()];
        return next.length > 12 ? next.slice(-12) : next;
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`ct-data-stream ct-data-stream--${side}`}>
      {lines.map((line, i) => (
        <div key={i} className="ct-data-line" style={{ opacity: 0.1 + (i / 12) * 0.3 }}>
          {line}
        </div>
      ))}
    </div>
  );
};

/* ─── World Map Mini ──────────────────────────────────────────────── */
const WorldMapMini = () => (
  <svg viewBox="0 0 800 300" className="ct-world-map-svg">
    {/* Grid lines */}
    {Array.from({ length: 9 }, (_, i) => (
      <line key={`h${i}`} x1="0" y1={i * 37.5} x2="800" y2={i * 37.5} stroke="#00AEEF" strokeWidth="0.3" opacity="0.1"/>
    ))}
    {Array.from({ length: 17 }, (_, i) => (
      <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="300" stroke="#00AEEF" strokeWidth="0.3" opacity="0.1"/>
    ))}
    {/* Simplified continent outlines */}
    {/* North America */}
    <path d="M100,60 L130,50 L160,55 L180,70 L190,90 L185,110 L170,130 L155,140 L140,135 L120,120 L110,100 L95,80 Z" fill="none" stroke="#00AEEF" strokeWidth="0.6" opacity="0.25"/>
    {/* South America */}
    <path d="M170,155 L185,150 L200,160 L205,180 L200,210 L190,230 L175,240 L165,230 L160,200 L162,175 Z" fill="none" stroke="#00AEEF" strokeWidth="0.6" opacity="0.25"/>
    {/* Europe */}
    <path d="M350,55 L370,50 L390,55 L400,65 L395,80 L380,85 L365,80 L355,70 Z" fill="none" stroke="#00AEEF" strokeWidth="0.6" opacity="0.25"/>
    {/* Africa */}
    <path d="M360,95 L380,90 L400,100 L410,120 L405,150 L395,175 L380,190 L365,185 L355,165 L350,140 L352,115 Z" fill="none" stroke="#00AEEF" strokeWidth="0.6" opacity="0.25"/>
    {/* Asia */}
    <path d="M420,45 L480,40 L540,45 L580,55 L600,70 L610,90 L600,110 L570,120 L540,115 L500,110 L460,100 L430,80 L415,65 Z" fill="none" stroke="#00AEEF" strokeWidth="0.6" opacity="0.25"/>
    {/* Australia */}
    <path d="M580,175 L610,170 L635,175 L645,190 L640,205 L620,215 L600,210 L585,195 Z" fill="none" stroke="#00AEEF" strokeWidth="0.6" opacity="0.25"/>

    {/* Network connection lines */}
    <line x1="150" y1="85" x2="370" y2="65" stroke="#FF2EC4" strokeWidth="0.4" opacity="0.3" strokeDasharray="4 4">
      <animate attributeName="stroke-dashoffset" from="0" to="-8" dur="2s" repeatCount="indefinite"/>
    </line>
    <line x1="370" y1="65" x2="560" y2="70" stroke="#FF2EC4" strokeWidth="0.4" opacity="0.3" strokeDasharray="4 4">
      <animate attributeName="stroke-dashoffset" from="0" to="-8" dur="2s" repeatCount="indefinite"/>
    </line>
    <line x1="370" y1="65" x2="375" y2="130" stroke="#FF2EC4" strokeWidth="0.4" opacity="0.3" strokeDasharray="4 4">
      <animate attributeName="stroke-dashoffset" from="0" to="-8" dur="2s" repeatCount="indefinite"/>
    </line>
    <line x1="560" y1="70" x2="610" y2="185" stroke="#FF2EC4" strokeWidth="0.4" opacity="0.3" strokeDasharray="4 4">
      <animate attributeName="stroke-dashoffset" from="0" to="-8" dur="2s" repeatCount="indefinite"/>
    </line>

    {/* Pulsing location nodes */}
    {[
      { cx: 150, cy: 85, label: 'NYC' },
      { cx: 370, cy: 65, label: 'LON' },
      { cx: 560, cy: 70, label: 'TKO' },
      { cx: 375, cy: 130, label: 'CSB' },
      { cx: 610, cy: 185, label: 'SYD' },
    ].map((loc, i) => (
      <g key={i}>
        <circle cx={loc.cx} cy={loc.cy} r="6" fill="none" stroke="#FF2EC4" strokeWidth="0.5" opacity="0.4">
          <animate attributeName="r" values="4;8;4" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite"/>
        </circle>
        <circle cx={loc.cx} cy={loc.cy} r="2" fill="#FF2EC4" opacity="0.6"/>
        <text x={loc.cx} y={loc.cy - 10} textAnchor="middle" fontSize="7" fill="#00AEEF" opacity="0.5" fontFamily="monospace">{loc.label}</text>
      </g>
    ))}
  </svg>
);

/* ─── Status Ticker ───────────────────────────────────────────────── */
const StatusTicker = () => {
  const items = [
    'SYSTEM STATUS: OPERATIONAL',
    '█',
    'ENCRYPTION: AES-256',
    '█',
    'NETWORK: CONTINENTAL SECURE',
    '█',
    'CLEARANCE: VERIFIED',
    '█',
    'UPLINK: ACTIVE',
    '█',
    'PROTOCOL: OMEGA-7',
  ];

  return (
    <div className="ct-ticker-wrap">
      <div className="ct-ticker-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="ct-ticker-item">{item}</span>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN CONTACT SLIDE COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const ContactSlide = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3, once: false });
  const [currentTime, setCurrentTime] = useState(() => new Date().toLocaleTimeString('en-US', { hour12: false }));
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 10).toUpperCase());

  const titleText = useTypingEffect('CONTACT INFORMATION', 60, 200, isInView);
  const subtitleText = useTypingEffect('SECURE COMMUNICATION CHANNELS', 40, 1500, isInView);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    };
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="contact" className="slide ct-slide" ref={ref}>
      {/* Background Image */}
      <div className="ct-bg-image">
        <img src={contactBg} alt="" />
        <div className="ct-bg-overlay" />
      </div>

      {/* Rain */}
      <RainEffect />

      {/* Scan Lines */}
      <ScanLines />

      {/* HUD Corners */}
      <HUDCorners />

      {/* Data Streams */}
      <DataStream side="left" />
      <DataStream side="right" />

      {/* ─── Top Bar ─────────────────────────────────────────── */}
      <motion.div
        className="ct-topbar"
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="ct-topbar-left">
          <HighTableInsignia />
          <span className="ct-topbar-label">HIGH TABLE INTELLIGENCE DIVISION</span>
        </div>
        <div className="ct-topbar-center">
          <span className="ct-topbar-time">{currentTime}</span>
          <span className="ct-topbar-divider">│</span>
          <span className="ct-topbar-status">
            <span className="ct-status-dot" />
            UPLINK ACTIVE
          </span>
        </div>
        <div className="ct-topbar-right">
          <span className="ct-clearance-label">CLEARANCE LEVEL</span>
          <span className="ct-clearance-value">OMEGA</span>
        </div>
      </motion.div>

      {/* ─── Main Content ────────────────────────────────────── */}
      <div className="ct-content">
        {/* Title Section */}
        <motion.div
          className="ct-title-section"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="ct-title-deco-line" />
          <h2 className="ct-title">{titleText}<span className="ct-cursor">_</span></h2>
          <p className="ct-subtitle">{subtitleText}</p>
          <div className="ct-title-deco-line" />
        </motion.div>

        {/* Two-Column Layout */}
        <div className="ct-main-grid">
          {/* Left Column — Contact Cards */}
          <div className="ct-cards-column">
            {CONTACT_CARDS.map((card, index) => (
              <motion.div
                key={card.id}
                className="ct-contact-card"
                initial={{ opacity: 0, x: -60 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: card.delay }}
                style={{ '--card-color': card.color }}
              >
                <div className="ct-card-icon-wrap">
                  <card.icon />
                  <div className="ct-card-icon-ring" />
                </div>
                <div className="ct-card-info">
                  <div className="ct-card-header">
                    <span className="ct-card-num">0{index + 1}</span>
                    <span className="ct-card-label">{card.label}</span>
                  </div>
                  <span className="ct-card-sublabel">{card.sublabel}</span>
                  <div className="ct-card-placeholder">
                    <span className="ct-card-placeholder-text">{card.placeholder}</span>
                    <span className="ct-card-placeholder-cursor">▌</span>
                  </div>
                </div>
                <div className="ct-card-status">
                  <span className="ct-card-status-dot" />
                  <span className="ct-card-status-text">ACTIVE</span>
                </div>
                {/* Glowing border effect */}
                <div className="ct-card-glow" />
              </motion.div>
            ))}
          </div>

          {/* Right Column — Dossier Panel */}
          <motion.div
            className="ct-dossier-panel"
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="ct-dossier-header">
              <span className="ct-dossier-classification">◆ CLASSIFIED DOSSIER ◆</span>
              <span className="ct-dossier-id">ID: JW-0014</span>
            </div>

            <div className="ct-dossier-body">
              <div className="ct-dossier-field">
                <span className="ct-dossier-key">CODENAME</span>
                <span className="ct-dossier-val ct-glow-text">BABA YAGA</span>
              </div>
              <div className="ct-dossier-divider" />
              <div className="ct-dossier-field">
                <span className="ct-dossier-key">STATUS</span>
                <span className="ct-dossier-val ct-status-active">AVAILABLE FOR CONTRACTS</span>
              </div>
              <div className="ct-dossier-divider" />
              <div className="ct-dossier-field">
                <span className="ct-dossier-key">RESPONSE TIME</span>
                <span className="ct-dossier-val">&lt; 24 HOURS</span>
              </div>
              <div className="ct-dossier-divider" />
              <div className="ct-dossier-field">
                <span className="ct-dossier-key">COMM PROTOCOL</span>
                <span className="ct-dossier-val">OMEGA-ENCRYPTED</span>
              </div>
              <div className="ct-dossier-divider" />
              <div className="ct-dossier-field">
                <span className="ct-dossier-key">JURISDICTION</span>
                <span className="ct-dossier-val">WORLDWIDE</span>
              </div>
            </div>

            <div className="ct-dossier-footer">
              <div className="ct-dossier-insignia">
                <HighTableInsignia />
              </div>
              <div className="ct-dossier-quote">
                <p>"I'M NOT AFRAID OF ANYONE.</p>
                <p>I'VE KILLED EVERYONE."</p>
                <span className="ct-quote-attribution">— JOHN WICK</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── World Map Bottom ────────────────────────────────── */}
      <motion.div
        className="ct-worldmap-strip"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <WorldMapMini />
      </motion.div>

      {/* ─── Bottom Bar ──────────────────────────────────────── */}
      <motion.div
        className="ct-bottombar"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <StatusTicker />
        <div className="ct-bottombar-content">
          <span className="ct-bottombar-left">
            <span className="ct-avail-dot" />
            AVAILABLE FOR NEW CONTRACTS
          </span>
          <span className="ct-bottombar-center">
            © {new Date().getFullYear()} · CONTINENTAL NETWORK · ALL RIGHTS RESERVED
          </span>
          <span className="ct-bottombar-right">
            TERMINAL: OMEGA-7 · SESSION: {sessionId}
          </span>
        </div>
      </motion.div>

      {/* Vignette */}
      <div className="ct-vignette" />
    </section>
  );
};

export default ContactSlide;
