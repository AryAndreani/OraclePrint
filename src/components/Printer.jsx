import printerImg from "/printer.png";
import styles from "./Printer.module.css";
import { MOODS } from "../quotes.js";

const PRINTER_W = 350;
const PRINTER_H = 446;

const SCREEN = {
  left:   54,    
  top:    90,    
  width:  245,   
  height: 270,   
}; 


export default function Printer({ status, printed, onSelect, printing }) {
  return (
    <div style={{ position: "relative", width: `${PRINTER_W}px`, flexShrink: 0 }}>
      <img
        src={printerImg}
        alt="Oracle Printer"
        style={{
          width: `${PRINTER_W}px`,
          height: `${PRINTER_H}px`,
          display: "block",
          objectFit: "contain",
          position: "relative",
          zIndex: 2,
        }}
      />
      <div
        className={styles.screen}
        style={{
          left:   SCREEN.left,
          top:    SCREEN.top,
          width:  SCREEN.width,
          height: SCREEN.height,
        }}
      >
        <p className={`${styles.statusLabel} ${
          status === "printing" ? styles.statusPrinting :
          status === "ready"    ? styles.statusReady    :
                                  styles.statusIdle
        }`}>
          {status === "printing" ? "PRINTING..." :
           status === "ready"    ? "READY  ✓"    :
                                   "CHOOSE YOUR MOOD"}
        </p>

        {!printed && (
          <div className={styles.moodGrid}>
            {MOODS.map((m) => (
              <button
                key={m.id}
                className={styles.moodBtn}
                onClick={() => onSelect(m.id)}
                disabled={printing}
              >
                <span className={styles.emoji}>{m.emoji}</span>
                <span className={styles.label}>{m.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}