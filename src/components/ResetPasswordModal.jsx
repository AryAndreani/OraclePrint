import { useState } from "react";
import styles from "./LoginModal.module.css";

export default function ResetPasswordModal({ onClose, updatePassword }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | error | done
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    if (password.length < 6) {
      setErrorMsg("password must be at least 6 characters");
      setStatus("error");
      return;
    }
    if (password !== confirm) {
      setErrorMsg("passwords don't match");
      setStatus("error");
      return;
    }

    setStatus("sending");
    const { error } = await updatePassword(password);
    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
    } else {
      setStatus("done");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <span className={styles.brand}>Oracle Print</span>

        {status === "done" ? (
          <>
            <p className={styles.title}>password updated</p>
            <p className={styles.sub}>you can now keep using the app</p>
            <button className={styles.submitBtn} onClick={onClose} style={{ marginTop: 16 }}>
              close
            </button>
          </>
        ) : (
          <>
            <p className={styles.title}>set a new password</p>
            <p className={styles.sub}>choose a password for your account</p>

            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="password"
                required
                minLength={6}
                placeholder="new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />
              <input
                type="password"
                required
                minLength={6}
                placeholder="confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={styles.input}
              />
              <button type="submit" className={styles.submitBtn} disabled={status === "sending"}>
                {status === "sending" ? "please wait..." : "save password"}
              </button>
            </form>

            {status === "error" && (
              <p className={styles.error}>{errorMsg}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}