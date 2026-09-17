import { useState } from "react";
import { supabase } from "../supabaseClient.js";
import styles from "./AccountModal.module.css";

export default function AccountModal({ user, onClose, onSignOut }) {
  const [view, setView] = useState("main"); // "main" | "confirmDelete"
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleSignOut = async () => {
    await onSignOut();
    onClose();
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      // Cancella i favorites dell'utente prima (RLS dovrebbe coprirlo,
      // ma lo facciamo esplicito per sicurezza)
      await supabase.from("favorites").delete().eq("user_id", user.id);

      // Chiama la funzione Edge/RPC per l'eliminazione dell'utente
      // (richiede una Supabase Edge Function o admin API lato server)
      // Fallback: sign out + flag — l'admin elimina manualmente
      const { error } = await supabase.rpc("delete_user");
      if (error) throw error;

      await onSignOut();
      onClose();
    } catch (err) {
      // Se non c'è la RPC, segnala all'utente
      setDeleteError(
        err.message?.includes("delete_user")
          ? "account deletion requires server support — contact us to remove your account"
          : err.message || "something went wrong"
      );
      setDeleting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          ✕
        </button>

        <span className={styles.brand}>Oracle Print</span>

        {view === "main" && (
          <>
            <p className={styles.title}>your account</p>

            <div className={styles.emailBadge}>
              <span className={styles.emailLabel}>signed in as</span>
              <span className={styles.emailValue}>{user.email}</span>
            </div>

            <div className={styles.actions}>
              <button className={styles.signOutBtn} onClick={handleSignOut}>
                sign out
              </button>
              <button
                className={styles.deleteLink}
                onClick={() => setView("confirmDelete")}
              >
                delete account
              </button>
            </div>
          </>
        )}

        {view === "confirmDelete" && (
          <>
            <p className={styles.title}>delete account?</p>
            <p className={styles.sub}>
              this will permanently remove your account and all saved favorites.
              there's no going back.
            </p>

            <div className={styles.actions}>
              <button
                className={styles.deleteConfirmBtn}
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? "deleting..." : "yes, delete my account"}
              </button>
              <button
                className={styles.cancelLink}
                onClick={() => { setView("main"); setDeleteError(""); }}
                disabled={deleting}
              >
                cancel
              </button>
            </div>

            {deleteError && (
              <p className={styles.error}>{deleteError}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}