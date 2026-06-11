import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ─── Transition Messages per direction (default scanner) ─────────── */
const MESSAGES_DOWN = [
  'ACCESSING INTELLIGENCE DATABASE...',
  'LOADING CLASSIFIED DOSSIER...',
  'DECRYPTING SECURE FILES...',
  'OPENING MISSION BRIEFING...',
  'RETRIEVING OPERATOR DATA...',
  'ACCESSING ARSENAL INVENTORY...',
];

const MESSAGES_UP = [
  'RETURNING TO PREVIOUS FILE...',
  'REVERSING SECURITY PROTOCOL...',
  'RE-ENCRYPTING CURRENT FILE...',
  'CLOSING ACTIVE DOSSIER...',
  'RESTORING PREVIOUS STATE...',
  'RETURNING TO MAIN TERMINAL...',
];

/* ─── Determine which transition type to play ─────────────────────── */
const getTransitionType = (fromId, toId) => {
  if ((fromId === 'missions' && toId === 'achievements') || (fromId === 'achievements' && toId === 'missions')) {
    return 'arsenal';
  }
  return 'scanner';
};

/* ═══════════════════════════════════════════════════════════════════
   DEFAULT SCANNER TRANSITION RENDERER
   Red scan line + terminal text (for most slide pairs)
   ═══════════════════════════════════════════════════════════════════ */
const ScannerTransition = ({ phase, terminalText }) => (
  <div className={`to-overlay to-overlay--${phase}`}>
    <div className="to-backdrop" />

    <div className={`to-scanner ${phase === 'scan' || phase === 'text' ? 'to-scanner--active' : ''}`}>
      <div className="to-scanner-line" />
      <div className="to-scanner-glow" />
    </div>

    <div className={`to-terminal ${phase === 'text' || phase === 'scan' ? 'to-terminal--visible' : ''}`}>
      <div className="to-terminal-bracket">[</div>
      <div className="to-terminal-text">
        <span className="to-terminal-prefix">&gt; </span>
        {terminalText}
        <span className="to-terminal-cursor">_</span>
      </div>
      <div className="to-terminal-bracket">]</div>
    </div>

    <div className="to-hud to-hud--tl">◢ CLASSIFIED</div>
    <div className="to-hud to-hud--tr">SECURE ◣</div>
    <div className="to-hud to-hud--bl">◥ CONTINENTAL</div>
    <div className="to-hud to-hud--br">HIGH TABLE ◤</div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   ARSENAL SHUTTER TRANSITION RENDERER
   Metallic shutter sweep + vault unlock (Slide 2 ↔ 3 only)
   ═══════════════════════════════════════════════════════════════════ */
const ArsenalTransition = ({ phase, direction, shutterLines }) => (
  <div className={`ar-overlay ar-overlay--${phase} ar-overlay--${direction}`}>
    {/* Metallic shutter panels */}
    <div className="ar-shutter">
      <div className="ar-shutter-panel ar-shutter-panel--top" />
      <div className="ar-shutter-panel ar-shutter-panel--bottom" />
    </div>

    {/* Horizontal sweep bar */}
    <div className={`ar-sweep ${phase === 'sweep' || phase === 'hold' ? 'ar-sweep--active' : ''}`}>
      <div className="ar-sweep-line" />
      <div className="ar-sweep-trail" />
    </div>

    {/* Vault door mechanism graphics */}
    <div className={`ar-vault-hud ${phase === 'sweep' || phase === 'hold' || phase === 'message' ? 'ar-vault-hud--visible' : ''}`}>
      {/* Spinning lock ring */}
      <div className="ar-lock-ring">
        <svg viewBox="0 0 120 120" className="ar-lock-svg">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#FF2E2E" strokeWidth="0.5" opacity="0.3"/>
          <circle cx="60" cy="60" r="42" fill="none" stroke="#FF2E2E" strokeWidth="0.3" opacity="0.2" strokeDasharray="4 6"/>
          <circle cx="60" cy="60" r="35" fill="none" stroke="#FF2E2E" strokeWidth="0.5" opacity="0.4"/>
          {/* Tick marks */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30) * Math.PI / 180;
            const x1 = 60 + 46 * Math.cos(angle);
            const y1 = 60 + 46 * Math.sin(angle);
            const x2 = 60 + 50 * Math.cos(angle);
            const y2 = 60 + 50 * Math.sin(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FF2E2E" strokeWidth="1" opacity="0.5"/>;
          })}
          {/* Center dot */}
          <circle cx="60" cy="60" r="3" fill="#FF2E2E" opacity="0.6"/>
          <circle cx="60" cy="60" r="6" fill="none" stroke="#FF2E2E" strokeWidth="0.5" opacity="0.4"/>
        </svg>
      </div>

      {/* Corner brackets */}
      <div className="ar-bracket ar-bracket--tl" />
      <div className="ar-bracket ar-bracket--tr" />
      <div className="ar-bracket ar-bracket--bl" />
      <div className="ar-bracket ar-bracket--br" />
    </div>

    {/* Terminal message flash — appears after vault opens */}
    <div className={`ar-message ${phase === 'message' ? 'ar-message--visible' : ''}`}>
      <div className="ar-message-line ar-message-line--1">
        <span className="ar-msg-icon">◆</span>
        {shutterLines.line1}
      </div>
      <div className="ar-message-line ar-message-line--2">
        <span className="ar-msg-icon ar-msg-icon--red">●</span>
        {shutterLines.line2}
      </div>
    </div>

    {/* Tactical grid overlay */}
    <div className={`ar-grid ${phase !== 'idle' ? 'ar-grid--visible' : ''}`} />

    {/* Status indicators */}
    <div className={`ar-status ${phase === 'hold' || phase === 'message' ? 'ar-status--visible' : ''}`}>
      <div className="ar-status-item ar-status-item--left">
        <span className="ar-status-dot" /> ARCHIVE ALPHA-7
      </div>
      <div className="ar-status-item ar-status-item--right">
        SEC LEVEL: OMEGA <span className="ar-status-dot ar-status-dot--red" />
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   MAIN TRANSITION OVERLAY COMPONENT
   Routes to correct transition based on slide ID
   ═══════════════════════════════════════════════════════════════════ */
const TransitionOverlay = ({ containerRef, totalSlides = 6, onSlideChange }) => {
  const [isActive, setIsActive] = useState(false);
  const [direction, setDirection] = useState('down');
  const [terminalText, setTerminalText] = useState('');
  const [phase, setPhase] = useState('idle');
  const [transitionType, setTransitionType] = useState('scanner');
  const [shutterLines, setShutterLines] = useState({
    line1: 'ARSENAL UNLOCKED',
    line2: 'AUTHORIZED ACCESS'
  });
  const activeSlideRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const lastScrollTime = useRef(0);

  /* ── Play the default scanner transition ────────────────────────── */
  const playScannerTransition = useCallback((dir, fromId, toId) => {
    const messages = dir === 'down' ? MESSAGES_DOWN : MESSAGES_UP;
    let msgIndex = 0;
    if (toId === 'missions') msgIndex = 1;
    else if (toId === 'achievements') msgIndex = 2;
    else if (toId === 'arsenal') msgIndex = 3;
    else if (toId === 'legend') msgIndex = 4;
    else if (toId === 'contact') msgIndex = 5;

    const msg = messages[Math.max(0, msgIndex)];

    setTransitionType('scanner');
    setDirection(dir);
    setTerminalText(msg);
    setIsActive(true);

    setPhase('darken');
    setTimeout(() => { 
      setPhase('scan'); 
      if (onSlideChange) onSlideChange(toId, dir);
    }, 150);
    setTimeout(() => { setPhase('text'); }, 350);
    setTimeout(() => { setPhase('reveal'); }, 550);
    setTimeout(() => {
      setPhase('idle');
      setIsActive(false);
      setTerminalText('');
      isTransitioningRef.current = false;
    }, 800);
  }, [onSlideChange]);

  /* ── Play the arsenal shutter transition ────────────────────────── */
  const playArsenalTransition = useCallback((dir, fromId, toId) => {
    setTransitionType('arsenal');
    setDirection(dir);
    setIsActive(true);

    // Dynamic messaging for shutter based on target slide
    if (toId === 'achievements') {
      setShutterLines({
        line1: 'INTELLIGENCE FILES LOADED',
        line2: '3 HIGH VALUE TARGETS FOUND'
      });
    } else {
      setShutterLines({
        line1: 'CLASSIFIED ACCESS SUSPENDED',
        line2: 'RETURNING TO MISSION LOGS'
      });
    }

    // Phase 1: Shutter closes (0-200ms)
    setPhase('close');

    // Phase 2: Sweep bar crosses (200-450ms)
    setTimeout(() => { 
      setPhase('sweep'); 
      if (onSlideChange) onSlideChange(toId, dir);
    }, 200);

    // Phase 3: Hold — vault lock visible (450-600ms)
    setTimeout(() => { setPhase('hold'); }, 450);

    // Phase 4: Shutter opens + message flash (600-900ms)
    setTimeout(() => { setPhase('message'); }, 600);

    // Phase 5: Reveal — everything fades away (900-1400ms)
    setTimeout(() => { setPhase('reveal'); }, 900);

    // Phase 6: Message lingers then cleanup (1400ms)
    setTimeout(() => {
      setPhase('idle');
      setIsActive(false);
      isTransitioningRef.current = false;
    }, 1400);
  }, [onSlideChange]);

  /* ── Master transition dispatcher ───────────────────────────────── */
  const playTransition = useCallback((dir, fromSlide, toSlide) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    const fromId = containerRef.current?.children[fromSlide]?.id || '';
    const toId = containerRef.current?.children[toSlide]?.id || '';

    const type = getTransitionType(fromId, toId);

    if (type === 'arsenal') {
      playArsenalTransition(dir, fromId, toId);
    } else {
      playScannerTransition(dir, fromId, toId);
    }
  }, [playScannerTransition, playArsenalTransition, containerRef]);

  /* ── Scroll detection ───────────────────────────────────────────── */
  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    let scrollTimer = null;

    const detectActiveSlide = () => {
      const slideHeight = container.clientHeight;
      if (slideHeight === 0) return;
      const currentSlide = Math.round(container.scrollTop / slideHeight);
      const clampedSlide = Math.max(0, Math.min(currentSlide, totalSlides - 1));

      if (clampedSlide !== activeSlideRef.current) {
        const now = Date.now();
        if (now - lastScrollTime.current < 900) {
          activeSlideRef.current = clampedSlide;
          return;
        }
        lastScrollTime.current = now;

        const dir = clampedSlide > activeSlideRef.current ? 'down' : 'up';
        const prev = activeSlideRef.current;
        activeSlideRef.current = clampedSlide;
        playTransition(dir, prev, clampedSlide);
      }
    };

    const handleScroll = () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(detectActiveSlide, 80);
    };

    const handleScrollEnd = () => {
      detectActiveSlide();
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('scrollend', handleScrollEnd, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('scrollend', handleScrollEnd);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [containerRef, totalSlides, playTransition]);

  /* ── Render ─────────────────────────────────────────────────────── */
  if (!isActive) return null;

  if (transitionType === 'arsenal') {
    return <ArsenalTransition phase={phase} direction={direction} shutterLines={shutterLines} />;
  }

  return <ScannerTransition phase={phase} terminalText={terminalText} />;
};

export default TransitionOverlay;
