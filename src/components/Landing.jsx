import { useState } from 'react';
import './Landing.css';

export default function Landing({ onEnter }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleEnter = () => {
    setIsExiting(true);
    // give animation time to complete before calling callback
    setTimeout(onEnter, 600);
  };

  return (
    <div className={`landing ${isExiting ? 'landing-exit' : 'landing-enter'}`}>
      <div className="landing-content">
        <h1 className="landing-title">Riversband</h1>
        <button className="landing-button" onClick={handleEnter}>
          Learn About The Game
        </button>
      </div>
    </div>
  );
}
