import { useState } from "react";
import Barcode from "./Barcode.jsx";
import styles from "./FavoritesTab.module.css";

function MiniReceipt({ item, onClick }) {
  return (
    <button className={styles.card} onClick={() => onClick(item)}>
      <div className={styles.cardTop} />
      <div className={styles.cardInner}>
        <span className={styles.cardBrand}>Oracle Print</span>
        <span className={styles.cardMode}>{item.moodLabel}</span>
        <div className={styles.cardDash} />
        <p className={styles.cardMain}>{item.quote.m}</p>
        <p className={styles.cardSub}>{item.quote.s}</p>
        <div className={styles.cardDash} />
        <div className={styles.cardMeta}>
          <span>{item.date}</span>
          <span>{item.time}</span>
        </div>
        <div className={styles.cardBarcode}>
          <Barcode />
        </div>
        <p className={styles.cardCode}>{item.code}</p>
      </div>
      <div className={styles.cardBottom} />
    </button>
  );
}

export default function FavoritesTab({ favorites, onOpen, onRemove }) {
  if (favorites.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>♡</span>
        <p className={styles.emptyTitle}>nessun preferito ancora</p>
        <p className={styles.emptyNote}>scorri lo scontrino e salvalo qui</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {favorites.map((item, i) => (
        <div key={item.code + i} className={styles.cardWrap}>
          <MiniReceipt item={item} onClick={onOpen} />
          <button
            className={styles.removeBtn}
            onClick={() => onRemove(item.code)}
            aria-label="Rimuovi dai preferiti"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}