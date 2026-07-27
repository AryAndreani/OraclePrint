import { useState, useCallback, useEffect } from "react";
import Receipt from "./components/Receipt.jsx";
import Printer from "./components/Printer.jsx";
import ReceiptFullscreen from "./components/ReceiptFullscreen.jsx";
import FavoritesTab from "./components/FavoritesTab.jsx";
import { QUOTES, MOOD_LABELS } from "./quotes.js";
import styles from "./App.module.css";

function rnd(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function genCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

const FAVORITES_KEY = "oracle-print-favorites";

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [status, setStatus]             = useState("idle");
  const [quote, setQuote]               = useState(null);
  const [mood, setMood]                 = useState(null);
  const [receiptOpen, setReceiptOpen]   = useState(false);
  const [quoteVisible, setQuoteVisible] = useState(false);
  const [printed, setPrinted]           = useState(false);
  const [code, setCode]                 = useState(genCode);
  const [torn, setTorn]                 = useState(false);

  const [tab, setTab]                     = useState("printer"); // "printer" | "favorites"
  const [favorites, setFavorites]         = useState(loadFavorites);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [fullscreenItem, setFullscreenItem] = useState(null);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const printing = status === "printing";

  const selectMood = useCallback((m) => {
    if (printing) return;
    setMood(m);
    setQuote(rnd(QUOTES[m]));
    setStatus("printing");
    setReceiptOpen(true);
    setQuoteVisible(false);
    setPrinted(false);
    setTorn(false);
    setCode(genCode());

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
    setTorn(false);
  }, []);

  const handleTear = useCallback(() => {
    setTorn(true);
    setFullscreenItem({ quote, mood, moodLabel: MOOD_LABELS[mood], code });
    setFullscreenOpen(true);
  }, [quote, mood, code]);

  const addFavorite = useCallback((item) => {
    setFavorites((prev) =>
      prev.some((f) => f.code === item.code) ? prev : [item, ...prev]
    );
  }, []);

  const removeFavorite = useCallback((codeToRemove) => {
    setFavorites((prev) => prev.filter((f) => f.code !== codeToRemove));
  }, []);

  const openFavorite = useCallback((item) => {
    setFullscreenItem(item);
    setFullscreenOpen(true);
  }, []);

  const closeFullscreen = useCallback(() => setFullscreenOpen(false), []);

  const fullscreenAlreadySaved =
    !!fullscreenItem && favorites.some((f) => f.code === fullscreenItem.code);

  return (
    <div className={styles.root}>
      <div className={styles.glow} />

      <p className={styles.tagline}>your personal fortune printer</p>
      <h1 className={styles.title}>Oracle Print</h1>

      {/* tab nav */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", position: "relative", zIndex: 1 }}>
        {[
          { id: "printer", label: "printer" },
          { id: "favorites", label: `favorites${favorites.length ? ` (${favorites.length})` : ""}` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "8px 18px",
              borderRadius: "100px",
              border: `1px solid ${tab === t.id ? "rgba(201,168,226,0.7)" : "rgba(201,168,226,0.25)"}`,
              background: tab === t.id ? "rgba(201,168,226,0.15)" : "transparent",
              color: tab === t.id ? "#c9a8e2" : "rgba(201,168,226,0.5)",
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "printer" ? (
        <>
          <div className={styles.printerSection}>
            <Receipt
              open={receiptOpen}
              quote={quote}
              mood={mood}
              moodLabel={mood ? MOOD_LABELS[mood] : ""}
              code={code}
              quoteVisible={quoteVisible}
              printed={printed}
              torn={torn}
              onTear={handleTear}
            />
            <Printer
              status={status}
              printed={printed}
              onSelect={selectMood}
              printing={printing}
              onReset={reset}
            />
          </div>

          {printed && (
            <div className={styles.afterPrint}>
              <p className={styles.note}>
                {torn ? "torn and ready" : "tear off and keep it with you"}
              </p>
            </div>
          )}
        </>
      ) : (
        <FavoritesTab
          favorites={favorites}
          onOpen={openFavorite}
          onRemove={removeFavorite}
        />
      )}

      {fullscreenOpen && fullscreenItem && (
        <ReceiptFullscreen
          quote={fullscreenItem.quote}
          mood={fullscreenItem.mood}
          moodLabel={fullscreenItem.moodLabel}
          code={fullscreenItem.code}
          onClose={closeFullscreen}
          onSave={addFavorite}
          alreadySaved={fullscreenAlreadySaved}
        />
      )}

      <footer className={styles.footer}>oracle print © {new Date().getFullYear()}</footer>
    </div>
  );
}