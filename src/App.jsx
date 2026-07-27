import { useState, useCallback } from "react";
import Receipt from "./components/Receipt.jsx";
import Printer from "./components/Printer.jsx";
import { QUOTES, MOOD_LABELS } from "./quotes.js";
import styles from "./App.module.css";

function rnd(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function genCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export default function App() {
  const [status, setStatus]             = useState("idle");
  const [quote, setQuote]               = useState(null);
  const [mood, setMood]                 = useState(null);
  const [receiptOpen, setReceiptOpen]   = useState(false);
  const [quoteVisible, setQuoteVisible] = useState(false);
  const [printed, setPrinted]           = useState(false);
  const [code]                          = useState(genCode);

  const printing = status === "printing";

  const selectMood = useCallback((m) => {
    if (printing) return;
    setMood(m);
    setQuote(rnd(QUOTES[m]));
    setStatus("printing");
    setReceiptOpen(true);
    setQuoteVisible(false);
    setPrinted(false);

    setTimeout(() => {
      setQuoteVisible(true);
      setStatus("ready");
      setPrinted(true);
    }, 800);
  }, [printing]);

  const reset = useCallback(() => {
    setReceiptOpen(false);
    setQuoteVisible(false);
    setStatus("idle");
    setMood(null);
    setQuote(null);
    setPrinted(false);
  }, []);

  return (
    <div className={styles.root}>
      {/* ambient glow */}
      <div className={styles.glow} />

      {/* header */}
      <p className={styles.tagline}>your personal fortune printer</p>
      <h1 className={styles.title}>Oracle Print</h1>

      {/* printer + receipt stack */}
      <div className={styles.printerSection}>
        <Receipt
          open={receiptOpen}
          quote={quote}
          mood={mood}
          moodLabel={mood ? MOOD_LABELS[mood] : ""}
          code={code}
          quoteVisible={quoteVisible}
        />
        <Printer
          status={status}
          printed={printed}
          onSelect={selectMood}
          printing={printing}
        />
      </div>

      {/* after-print actions */}
      {printed && (
        <div className={styles.afterPrint}>
          <button className={styles.resetBtn} onClick={reset}>
            print another
          </button>
          <p className={styles.note}>tear off and keep it with you</p>
        </div>
      )}

      <footer className={styles.footer}>oracle print © {new Date().getFullYear()}</footer>
    </div>
  );
}
