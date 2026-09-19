import styles from "./PrivacyPolicy.module.css";

export default function PrivacyPolicy({ onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Chiudi">✕</button>

        <div className={styles.inner}>
          <p className={styles.eyebrow}>legal</p>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.updated}>Ultimo aggiornamento: settembre 2025</p>

          <div className={styles.rule} />

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Titolare del trattamento</h2>
            <p className={styles.text}>
              Il trattamento dei dati personali raccolti tramite Oracle Print (
              <a className={styles.link} href="https://oracleprint.vercel.app/" target="_blank" rel="noopener">oracleprint.vercel.app</a>)
              è effettuato da <strong>Arianna Andreani</strong>, contattabile all'indirizzo{" "}
              <a className={styles.link} href="mailto:ariannaandreani.hello@gmail.com">ariannaandreani.hello@gmail.com</a>.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Dati che raccogliamo</h2>
            <p className={styles.text}>
              Oracle Print raccoglie esclusivamente i dati necessari al funzionamento dell'account e al salvataggio dei preferiti.
              Non raccogliamo dati di tracciamento, non utilizziamo cookie pubblicitari e non vendiamo informazioni a terze parti.
            </p>
            <div className={styles.receiptBlock}>
              {[
                ["Indirizzo email", "registrazione e accesso all'account"],
                ["Password", "conservata in forma cifrata (hash bcrypt)"],
                ["Citazioni salvate", "testo, mood, data e ora"],
                ["Token di sessione", "localStorage del browser, solo per mantenere il login"],
              ].map(([k, v]) => (
                <div key={k} className={styles.receiptRow}>
                  <span className={styles.receiptLabel}>{k}</span>
                  <span className={styles.receiptValue}>{v}</span>
                </div>
              ))}
            </div>
            <p className={styles.text}>Non raccogliamo nome, numero di telefono, dati di pagamento o qualsiasi altra informazione non elencata sopra.</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Perché trattiamo i tuoi dati</h2>
            <p className={styles.text}>I dati vengono trattati esclusivamente per:</p>
            <div className={styles.receiptBlock}>
              {[
                ["Autenticazione", "permetterti di accedere al tuo account"],
                ["Preferiti", "salvare e recuperare le tue citazioni preferite"],
                ["Sicurezza", "prevenire accessi non autorizzati"],
              ].map(([k, v]) => (
                <div key={k} className={styles.receiptRow}>
                  <span className={styles.receiptLabel}>{k}</span>
                  <span className={styles.receiptValue}>{v}</span>
                </div>
              ))}
            </div>
            <p className={styles.text}>Non utilizziamo i tuoi dati per finalità di marketing, profilazione o analisi comportamentale.</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Servizi di terze parti</h2>
            <p className={styles.text}>
              Oracle Print utilizza <strong>Supabase</strong> (Supabase Inc., USA) come infrastruttura per database e autenticazione.
              Supabase agisce in qualità di responsabile del trattamento ed è conforme al GDPR tramite clausole contrattuali standard (SCC).
              Policy:{" "}
              <a className={styles.link} href="https://supabase.com/privacy" target="_blank" rel="noopener">supabase.com/privacy</a>.
            </p>
            <p className={styles.text}>
              Il sito è ospitato su <strong>Vercel</strong> (Vercel Inc., USA). Vercel può registrare log tecnici minimi per garantire la disponibilità del servizio.
              Policy:{" "}
              <a className={styles.link} href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener">vercel.com/legal/privacy-policy</a>.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Conservazione dei dati</h2>
            <p className={styles.text}>
              I tuoi dati vengono conservati per tutta la durata dell'account. Se richiedi la cancellazione,
              elimineremo tutti i dati associati al tuo profilo entro 30 giorni dalla richiesta.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>I tuoi diritti (GDPR)</h2>
            <p className={styles.text}>In quanto utente residente nell'Unione Europea, hai i seguenti diritti:</p>
            <div className={styles.rights}>
              {[
                ["Accesso", "puoi richiedere una copia dei dati che conserviamo su di te."],
                ["Rettifica", "puoi correggere dati inesatti o incompleti."],
                ["Cancellazione", "puoi richiedere la cancellazione del tuo account e di tutti i dati associati."],
                ["Portabilità", "puoi richiedere i tuoi dati in formato leggibile da macchina."],
                ["Opposizione", "puoi opporti al trattamento dei tuoi dati in qualsiasi momento."],
                ["Reclamo", "hai il diritto di presentare reclamo al Garante per la Protezione dei Dati Personali (garanteprivacy.it)."],
              ].map(([title, desc]) => (
                <div key={title} className={styles.rightItem}>
                  <span className={styles.rightBullet}>✦</span>
                  <span className={styles.rightText}><strong>{title}</strong> — {desc}</span>
                </div>
              ))}
            </div>
            <p className={styles.text} style={{ marginTop: "14px" }}>
              Per esercitare uno di questi diritti, scrivi a{" "}
              <a className={styles.link} href="mailto:ariannaandreani.hello@gmail.com">ariannaandreani.hello@gmail.com</a>.
              Risponderemo entro 30 giorni.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Cookie e archiviazione locale</h2>
            <p className={styles.text}>
              Oracle Print non utilizza cookie di tracciamento o pubblicitari. Il token di sessione generato al login
              viene conservato nel <code className={styles.code}>localStorage</code> del browser esclusivamente per mantenere la sessione attiva.
              Puoi cancellarlo in qualsiasi momento svuotando la cache del browser.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Modifiche a questa policy</h2>
            <p className={styles.text}>
              In caso di modifiche significative, aggiorneremo la data in cima a questa pagina.
              Per modifiche che impattano i tuoi dati, ti contatteremo via email se hai un account attivo.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Contatti</h2>
            <p className={styles.text}>
              Per qualsiasi domanda su questa privacy policy o sul trattamento dei tuoi dati:{" "}
              <a className={styles.link} href="mailto:ariannaandreani.hello@gmail.com">ariannaandreani.hello@gmail.com</a>
            </p>
          </section>

          <div className={styles.rule} />
          <p className={styles.footerNote}>© 2025 Arianna Andreani · Oracle Print</p>
        </div>
      </div>
    </div>
  );
}
