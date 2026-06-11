import React, { useState, useRef } from 'react';
import HeroSlide from './components/HeroSlide';
import MissionsSlide from './components/MissionsSlide';
import AchievementsSlide from './components/AchievementsSlide';
import ArsenalSlide from './components/ArsenalSlide';
import LegendSlide from './components/LegendSlide';
import ContactSlide from './components/ContactSlide';
import TransitionOverlay from './components/TransitionOverlay';
import './App.css';

function App() {
  const containerRef = useRef(null);
  const [activeSlideId, setActiveSlideId] = useState('home');
  const [direction, setDirection] = useState('down');

  const handleSlideChange = (toId, dir) => {
    setActiveSlideId(toId);
    setDirection(dir);
  };

  return (
    <>
      {/* Global cinematic transition overlay */}
      <TransitionOverlay 
        containerRef={containerRef} 
        totalSlides={6} 
        onSlideChange={handleSlideChange} 
      />

      <div className="slides-container" ref={containerRef}>
        {/* Slide 1: Hero Section */}
        <HeroSlide active={activeSlideId === 'home'} />

        {/* Slide 2: Missions Chapter Reveal */}
        <MissionsSlide active={activeSlideId === 'missions'} direction={direction} />

        {/* Slide 3: Classified Records / Achievements */}
        <AchievementsSlide active={activeSlideId === 'achievements'} direction={direction} />

        {/* Slide 4: Arsenal — Neon-Noir Capabilities */}
        <ArsenalSlide active={activeSlideId === 'arsenal'} direction={direction} />

        {/* Slide 5: The Making of a Legend */}
        <LegendSlide active={activeSlideId === 'legend'} direction={direction} />

        {/* Slide 6: Contact Information — High Table Terminal */}
        <ContactSlide active={activeSlideId === 'contact'} direction={direction} />
      </div>
    </>
  );
}

export default App;
