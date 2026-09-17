import { useState, useCallback, useEffect } from "react";
import Receipt from "./components/Receipt.jsx";
import Printer from "./components/Printer.jsx";
import ReceiptFullscreen from "./components/ReceiptFullscreen.jsx";
import FavoritesTab from "./components/Favoritestab.jsx";
import LoginModal from "./components/LoginModal.jsx";
import AccountModal from "./components/AccountModal.jsx";
import { useAuth } from "./hooks/useAuth.js";
import { supabase } from "./supabaseClient.js";
import { QUOTES, MOOD_LABELS } from "./quotes.js";
import styles from "./App.module.css";
import ResetPasswordModal from "./components/ResetPasswordModal.jsx";

function rnd(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function genCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export default function App() {
  const {
    user,
    loading: authLoading,
    signInWithPassword,
    signUpWithPassword,
    signOut,
    resetPasswordForEmail,
    updatePassword,
    isPasswordRecovery,
    cancelPasswordRecovery,
  } = useAuth();
  const [status, setStatus]             = useState("idle");
  const [quote, setQuote]               = useState(null);
  const [mood, setMood]                 = useState(null);
  const [receiptOpen, setReceiptOpen]   = useState(false);
  const [quoteVisible, setQuoteVisible] = useState(false);
  const [printed, setPrinted]           = useState(false);
  const [code, setCode]                 = useState(genCode);
  const [torn, setTorn]                 = useState(false);

  const [tab, setTab]                       = useState("printer");
  const [favorites, setFavorites]           = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [fullscreenItem, setFullscreenItem] = useState(null);
  const [loginOpen, setLoginOpen]           = useState(false);
  const [accountOpen, setAccountOpen]       = useState(false);
  const [pendingAction, setPendingAction]   = useState(null); // "save" | "favorites" | null

  const printing = status === "printing";

  // carica i preferiti da Supabase quando l'utente è loggato
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }
    setFavoritesLoading(true);
    supabase
      .from("favorites")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setFavorites(
            data.map((f) => ({
              id: f.id,
              code: f.code,
              mood: f.mood,
              moodLabel: f.mood_label,
              quote: { m: f.quote_m, s: f.quote_s },
              date: f.date,
              time: f.time,
            }))
          );
        }
        setFavoritesLoading(false);
      });
  }, [user]);

  // se l'utente si è appena loggato mentre voleva salvare/aprire i preferiti, esegui l'azione
  useEffect(() => {
    if (user && loginOpen) {
      setLoginOpen(false);
      if (pendingAction === "favorites") setTab("favorites");
      setPendingAction(null);
    }
  }, [user, loginOpen, pendingAction]);

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

  const addFavorite = useCallback(async (item) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("favorites")
      .insert({
        user_id: user.id,
        code: item.code,
        mood: item.mood,
        mood_label: item.moodLabel,
        quote_m: item.quote.m,
        quote_s: item.quote.s,
        date: item.date,
        time: item.time,
      })
      .select()
      .single();

    if (!error && data) {
      setFavorites((prev) => [
        { id: data.id, code: data.code, mood: data.mood, moodLabel: data.mood_label,
          quote: { m: data.quote_m, s: data.quote_s }, date: data.date, time: data.time },
        ...prev,
      ]);
    }
  }, [user]);

  const removeFavorite = useCallback(async (idToRemove) => {
    await supabase.from("favorites").delete().eq("id", idToRemove);
    setFavorites((prev) => prev.filter((f) => f.id !== idToRemove));
  }, []);

  const openFavorite = useCallback((item) => {
    setFullscreenItem(item);
    setFullscreenOpen(true);
  }, []);

  const closeFullscreen = useCallback(() => setFullscreenOpen(false), []);

  // gestione tab: se clicca "favorites" senza login, apri il login
  const handleTabClick = (id) => {
    if (id === "favorites" && !user) {
      setPendingAction("favorites");
      setLoginOpen(true);
      return;
    }
    setTab(id);
  };

  // gestione save: se clicca "save" senza login, apri il login
  const handleRequireLogin = () => {
    setPendingAction("save");
    setLoginOpen(true);
  };

  const fullscreenAlreadySaved =
    !!fullscreenItem && favorites.some((f) => f.code === fullscreenItem.code);

  return (
    <div className={styles.root}>
      <div className={styles.glow} />

      <p className={styles.tagline}>your personal fortune printer</p>
      <h1 className={styles.title}>Oracle Print</h1>

      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", position: "relative", zIndex: 1 }}>
        {[
          { id: "printer", label: "printer" },
          { id: "favorites", label: `favorites${favorites.length ? ` (${favorites.length})` : ""}` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => handleTabClick(t.id)}
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

        {user && (
          <button
            onClick={() => setAccountOpen(true)}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "8px 14px",
              borderRadius: "100px",
              border: "1px solid rgba(201,168,226,0.2)",
              background: "transparent",
              color: "rgba(201,168,226,0.45)",
              cursor: "pointer",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "rgba(201,168,226,0.5)";
              e.currentTarget.style.color = "rgba(201,168,226,0.75)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "rgba(201,168,226,0.2)";
              e.currentTarget.style.color = "rgba(201,168,226,0.45)";
            }}
          >
            account
          </button>
        )}
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
          loading={favoritesLoading}
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
          isLoggedIn={!!user}
          onRequireLogin={handleRequireLogin}
        />
      )}

      {loginOpen && (
        <LoginModal
          onClose={() => setLoginOpen(false)}
          signInWithPassword={signInWithPassword}
          signUpWithPassword={signUpWithPassword}
          resetPasswordForEmail={resetPasswordForEmail}
        />
      )}

      {accountOpen && user && (
        <AccountModal
          user={user}
          onClose={() => setAccountOpen(false)}
          onSignOut={signOut}
        />
      )}

      {isPasswordRecovery && (
        <ResetPasswordModal
          onClose={cancelPasswordRecovery}
          updatePassword={updatePassword}
        />
      )}

      <footer className={styles.footer}>oracle print © {new Date().getFullYear()}</footer>
    </div>
  );
}