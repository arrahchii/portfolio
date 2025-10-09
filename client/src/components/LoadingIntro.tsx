import React, { useEffect, useState } from 'react';

interface LoadingIntroProps {
  onComplete: () => void;
}

const LoadingIntro: React.FC<LoadingIntroProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationPhase(1), 800);
    const timer2 = setTimeout(() => setAnimationPhase(2), 2000);
    const timer3 = setTimeout(() => setAnimationPhase(3), 3500);
    const timer4 = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  const generateTextPattern = () => {
    const patterns = [
      "AI LANCE AI LANCE AI LANCE AI LANCE",
      "AI LANCEAI LANCEAI LANCEAI LANCE",
      "AI LANCEAI LANCEAI LANCEAI LANCE",
      "AI LANCEAI LANCEAI LANCEAI LANCE",
      "AI LANCEAI LANCEAI LANCEAI LANCE",
      "AI LANCEAI LANCEAI LANCEAI LANCE",
      "AI LANCE AI LANCE AI LANCE AI LANCE",
      "AI LANCE AI LANCE AI LANCE AI LANCE",
      "AI LANCE AI LANCE AI LANCE AI LANCE"
    ];
    
    return patterns.map((pattern, index) => (
      <div
        key={index}
        className={`text-pattern-line ${animationPhase >= 1 ? 'animate-fade-in' : ''}`}
        style={{
          animationDelay: `${index * 0.1}s`,
          opacity: animationPhase >= 1 ? 1 : 0
        }}
      >
        {pattern}
      </div>
    ));
  };

  if (!isVisible) return null;

  return (
    <div className={`loading-intro ${!isVisible ? 'fade-out' : ''}`}>
      <div className="intro-background">
        <div className="text-pattern-container">
          {generateTextPattern()}
        </div>
        
        <div className="center-content">
          <div className={`main-logo ${animationPhase >= 2 ? 'animate-scale-in' : ''}`}>
            <h1 className="logo-text">LANCE</h1>
            <div className={`subtitle ${animationPhase >= 3 ? 'animate-slide-up' : ''}`}>
              AI/ML Engineer & Fullstack Developer
            </div>
          </div>
          
          <div className={`loading-indicator ${animationPhase >= 2 ? 'animate-pulse' : ''}`}>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIntro;