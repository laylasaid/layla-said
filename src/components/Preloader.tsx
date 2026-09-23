import { useEffect, useRef, useState } from "react";

interface PreloaderProps {
  label?: string;
  onComplete?: () => void;
}

export function Preloader({ label = "Loading Portfolio", onComplete }: PreloaderProps) {
  const [done, setDone] = useState(false);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let count = 0;
    const timer = setInterval(() => {
      count++;
      if (countRef.current) {
        countRef.current.textContent = String(count).padStart(2, "0");
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${count / 100})`;
      }
      if (count >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          if (wrapRef.current) {
            wrapRef.current.style.transition = "opacity 0.7s ease, transform 0.7s ease";
            wrapRef.current.style.opacity = "0";
            wrapRef.current.style.transform = "translateY(-6px)";
            setTimeout(() => {
              setDone(true);
              onComplete?.();
            }, 750);
          }
        }, 200);
      }
    }, 22);

    return () => clearInterval(timer);
  }, [onComplete]);

  if (done) return null;

  return (
    <div id="preloader" ref={wrapRef}>
      <div className="pre-count">
        <span ref={countRef}>00</span>
      </div>
      <div className="pre-right">
        <div className="pre-bar-wrap">
          <div className="pre-bar" ref={barRef} />
        </div>
        <span className="pre-label">{label}</span>
      </div>
    </div>
  );
}
