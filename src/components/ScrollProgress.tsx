import { useScrollProgress } from '../hooks/useScrollProgress';
import './ScrollProgress.css';

export default function ScrollProgress() {
  const progress = useScrollProgress();
  return (
    <div className="scroll-progress" role="presentation" aria-hidden="true">
      <div
        className="scroll-progress__bar"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
