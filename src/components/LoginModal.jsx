import { useState } from "react";
import styles from "./LoginModal.module.css";

export default function LoginModal({ onClose, signInWithPassword, signUpWithPassword, resetPasswordForEmail }) {
  const [authAction, setAuthAction] = useState("login"); // "login" | "signup" | "forgot"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | error | signedUp | resetSent
  const [errorMsg, setErrorMsg] = useState("");

  const resetFeedback = () => {
    setStatus("idle");
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    if (authAction === "forgot") {
      if (!email) return;
      setStatus("sending");
      const { error } = await resetPasswordForEmail(email);
      if (error) {
        setErrorMsg(error.message);
        setStatus("error");
      } else {
        setStatus("resetSent");
      }
      return;
    }

    if (!email || !password) return;
    setStatus("sending");

    if (authAction === "login") {
      const { error } = await signInWithPassword(email, password);
      if (error) {
        setErrorMsg(
          error.message === "Invalid login credentials"
            ? "incorrect email or password"
            : error.message
        );
        setStatus("error");
      }
      // if successful, onAuthStateChange updates the session and App.jsx closes the modal
    } else {
      const { data, error } = await signUpWithPassword(email, password);
      if (error) {
        setErrorMsg(error.message);
        setStatus("error");
      } else if (data?.user && !data.session) {
        setStatus("signedUp");
      }
    }
  };

  const switchTo = (action) => {
    setAuthAction(action);
    resetFeedback();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          ✕
        </button>

        <span className={styles.brand}>Oracle Print</span>

        {status === "signedUp" ? (
          <>
            <p className={styles.title}>check your email</p>
            <p className={styles.sub}>
              we've sent a confirmation link to <strong>{email}</strong>
            </p>
          </>
        ) : status === "resetSent" ? (
          <>
            <p className={styles.title}>check your email</p>
            <p className={styles.sub}>
              we've sent a password reset link to <strong>{email}</strong>
            </p>
          </>
        ) : (
          <>
            <p className={styles.title}>
              {authAction === "login" && "sign in"}
              {authAction === "signup" && "create account"}
              {authAction === "forgot" && "reset password"}
            </p>
            <p className={styles.sub}>
              {authAction === "login" && "sign in to save your favorites"}
              {authAction === "signup" && "sign up to save your receipts"}
              {authAction === "forgot" && "we'll send you a link to reset it"}
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); resetFeedback(); }}
                className={styles.input}
              />

              {authAction !== "forgot" && (
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); resetFeedback(); }}
                  className={styles.input}
                />
              )}

              <button type="submit" className={styles.submitBtn} disabled={status === "sending"}>
                {status === "sending"
                  ? "please wait..."
                  : authAction === "login"
                  ? "sign in"
                  : authAction === "signup"
                  ? "sign up"
                  : "send link"}
              </button>
            </form>

            {status === "error" && (
              <p className={styles.error}>{errorMsg || "something went wrong, please try again"}</p>
            )}

            {authAction === "login" && (
              <button type="button" onClick={() => switchTo("forgot")} className={styles.switchLink}>
                forgot password?
              </button>
            )}

            <button
              type="button"
              onClick={() => switchTo(authAction === "login" ? "signup" : "login")}
              className={styles.switchLink}
            >
              {authAction === "signup"
                ? "already have an account? sign in"
                : authAction === "forgot"
                ? "back to sign in"
                : "don't have an account? sign up"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}