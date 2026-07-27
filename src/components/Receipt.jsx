import Barcode from "./Barcode.jsx";
import styles from "./Receipt.module.css";

function fmtDate() {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase();
}
function fmtTime() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function Receipt({ open, quote, mood, moodLabel, code, quoteVisible }) {
  return (
    <div
      className={styles.wrap}
      style={{
        height: open ? "395px" : "0",   /* era 240px */
        opacity: open ? 1 : 0,
        transition: "height 0.8s cubic-bezier(0.22,1,0.36,1), opacity 0.4s",
      }}
    >
      <div className={styles.receipt}>
        {/* serrated bottom edge */}
        <div className={styles.serrated} />

        <span className={styles.brand}>Oracle Print</span>
        <p className={styles.sub}>daily receipt</p>
        <div className={styles.divider} />

        {quote && (
          <div className={styles.meta}>
            {[["DATE", fmtDate()], ["TIME", fmtTime()], ["MODE", moodLabel]].map(([k, v]) => (
              <div key={k} className={styles.metaRow}>
                <span>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        )}

        <div className={styles.dash} />

        <div
          className={styles.quoteWrap}
          style={{
            opacity: quoteVisible ? 1 : 0,
            transform: quoteVisible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.9s ease, transform 0.9s ease",
          }}
        >
          <span className={styles.stars}>✦ ✦ ✦</span>
          <p className={styles.qMain}>{quote?.m}</p>
          <div className={styles.qLine} />
          <p className={styles.qSub}>{quote?.s}</p>
        </div>

        <div className={styles.dash} />

        <div className={styles.footer}>
          <Barcode />
          <p className={styles.code}>{code}</p>
        </div>
      </div>
    </div>
  );
}
