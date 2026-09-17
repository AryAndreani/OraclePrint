import { useRef, useState } from "react";
import Barcode from "./Barcode.jsx";
import styles from "./ReceiptFullscreen.module.css";

function fmtDate() {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase();
}
function fmtTime() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function ReceiptFullscreen({
  quote, mood, moodLabel, code, onClose, onSave, alreadySaved, isLoggedIn, onRequireLogin,
}) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(alreadySaved);

  const handleSave = async () => {
    if (saved || saving) return;

    if (!isLoggedIn) {
      onRequireLogin();
      return;
    }

    setSaving(true);
    await onSave({ quote, mood, moodLabel, code, date: fmtDate(), time: fmtTime() });
    setSaved(true);
    setSaving(false);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>

        <div className={styles.receipt}>
          <div className={styles.serratedTop} />
          <span className={styles.brand}>Oracle Print</span>
          <p className={styles.sub}>daily receipt</p>
          <div className={styles.divider} />

          <div className={styles.meta}>
            {[["DATE", fmtDate()], ["TIME", fmtTime()], ["MODE", moodLabel]].map(([k, v]) => (
              <div key={k} className={styles.metaRow}>
                <span>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>

          <div className={styles.dash} />

          <div className={styles.quoteWrap}>
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

          <div className={styles.serratedBottom} />
        </div>

        <button
          className={`${styles.saveBtn} ${saved ? styles.saveBtnSaved : ""}`}
          onClick={handleSave}
          disabled={saved || saving}
        >
          {saving ? (
            <span className={styles.savingDots}>saving...</span>
          ) : saved ? (
            <>♥ saved to favorites</>
          ) : (
            <>♡ save to favorites</>
          )}
        </button>
      </div>
    </div>
  );
}