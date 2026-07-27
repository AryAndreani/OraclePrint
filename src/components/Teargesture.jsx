import { useRef, useState, useCallback } from "react";
import styles from "./TearGesture.module.css";

export default function TearGesture({ onTear, disabled }) {
  const lineRef = useRef(null);
  const [dragX, setDragX] = useState(null);
  const [tearing, setTearing] = useState(false);
  const startX = useRef(null);
  const isDragging = useRef(false);

  const getX = (e) => {
    if (e.touches) return e.touches[0].clientX;
    return e.clientX;
  };

  const handleStart = useCallback((e) => {
    if (disabled) return;
    isDragging.current = true;
    startX.current = getX(e);
    setDragX(0);
    setTearing(false);
  }, [disabled]);

  const handleMove = useCallback((e) => {
    if (!isDragging.current || disabled) return;
    e.preventDefault();
    const dx = getX(e) - startX.current;
    const clamped = Math.max(0, Math.min(dx, 280));
    setDragX(clamped);
    if (clamped > 220) setTearing(true);
    else setTearing(false);
  }, [disabled]);

  const handleEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (dragX > 220) {
      onTear();
    }
    setDragX(null);
    setTearing(false);
  }, [dragX, onTear]);

  const progress = dragX !== null ? dragX / 280 : 0;

  return (
    <div
      ref={lineRef}
      className={styles.tearZone}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      style={{ cursor: disabled ? "default" : "grab" }}
      role="button"
      aria-label="Scorri per aprire lo scontrino"
      tabIndex={disabled ? -1 : 0}
    >
      {/* Dashed tear line */}
      <div className={styles.tearLine}>
        <div
          className={styles.tearProgress}
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Scissors icon that follows drag */}
      <div
        className={`${styles.scissors} ${tearing ? styles.scissorsTearing : ""}`}
        style={{
          left: dragX !== null ? `${dragX}px` : "12px",
          transition: dragX !== null ? "none" : "left 0.3s ease",
        }}
      >
        ✂
      </div>

      {/* Hint text */}
      {dragX === null && (
        <span className={styles.hint}>Scroll to rip the receipt</span>
      )}
    </div>
  );
}