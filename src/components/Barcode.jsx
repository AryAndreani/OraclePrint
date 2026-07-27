export default function Barcode() {
  const bars = Array.from({ length: 28 }, (_, i) => i);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "1.5px", height: "24px" }}>
      {bars.map(i => (
        <div
          key={i}
          style={{
            background: "#1a1a1a",
            borderRadius: "0.5px",
            width: i % 3 === 0 ? "3px" : "1.5px",
            height: i % 5 === 0 ? "24px" : "17px",
          }}
        />
      ))}
    </div>
  );
}
