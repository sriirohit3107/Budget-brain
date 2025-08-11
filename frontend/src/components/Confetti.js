import React, { useEffect } from 'react';

const Confetti = ({ show, onComplete }) => {
  useEffect(() => {
    if (show) {
      const timeout = setTimeout(() => onComplete(), 3000);
      return () => clearTimeout(timeout);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="confetti">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
