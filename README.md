# Oracle Print 🖨️

Your personal fortune printer — a mood-based motivational receipt app.

## Stack
- React 18 + Vite
- CSS Modules
- Google Fonts: Playfair Display, DM Mono, Cormorant Garamond


## Project structure

```
oracle-print/
├── public/
│   └── printer.png          # The lilla printer image
├── src/
│   ├── components/
│   │   ├── Barcode.jsx
│   │   ├── Printer.jsx      # Printer image + screen overlay with mood buttons
│   │   ├── Printer.module.css
│   │   ├── Receipt.jsx      # Animated receipt that prints out
│   │   └── Receipt.module.css
│   ├── App.jsx
│   ├── App.module.css
│   ├── index.css
│   ├── main.jsx
│   └── quotes.js            # All motivational quotes per mood
├── index.html
├── package.json
└── vite.config.js
```

## Moods
- 🚀 **Motivate Me** — push mode
- ☕ **Comfort Me** — soft landing
- 🔮 **Predict Me** — fortune telling
- 🕶️ **Be Honest** — unfiltered truth

## Customisation
- Add/edit quotes in `src/quotes.js`
- Tweak colours in the CSS modules (main lilla: `#C9A8E2`)
- Adjust printer screen overlay in `src/components/Printer.jsx` (the `SCREEN` constant)
