import { useState, useEffect } from 'react';
import './AgeGate.css';

export default function AgeGate() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const passed = sessionStorage.getItem('age-verified');
    if (!passed) setVisible(true);
  }, []);

  function handleYes() {
    sessionStorage.setItem('age-verified', '1');
    setVisible(false);
  }

  function handleNo() {
    window.location.href = 'https://www.google.com';
  }

  if (!visible) return null;

  return (
    <div className="age-gate" role="dialog" aria-modal="true" aria-label="Age verification">
      <div className="age-gate__backdrop" />
      <div className="age-gate__box">
        <div className="age-gate__leaf" aria-hidden="true">🌿</div>
        <div className="age-gate__logo">
          <span className="age-gate__logo-mark">E</span>
          <div>
            <div className="age-gate__logo-name">Eddie's Flowers</div>
            <div className="age-gate__logo-sub">Ashburnham, MA</div>
          </div>
        </div>
        <h2 className="age-gate__title">Welcome</h2>
        <p className="age-gate__body">
          You must be 21 years of age or older to enter this site.<br />
          Are you 21 or older?
        </p>
        <div className="age-gate__actions">
          <button className="btn btn--primary age-gate__btn" onClick={handleYes}>
            Yes, I'm 21 or older
          </button>
          <button className="btn btn--outline-white age-gate__btn" onClick={handleNo}>
            No, take me back
          </button>
        </div>
        <p className="age-gate__disclaimer">
          Cannabis is for adults 21+ only. Keep out of reach of children.
          Please consume responsibly.
        </p>
      </div>
    </div>
  );
}
