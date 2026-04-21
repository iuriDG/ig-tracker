"use client";

import { C } from "../styles";

type Props = {
  label: string;
  value: number;
  prev?: number;
  accent: string;
};

export default function StatCard({ label, value, prev, accent }: Props) {
  const delta = prev != null ? value - prev : null;
  const pct =
    delta != null && prev != null && prev !== 0
      ? ((delta / prev) * 100).toFixed(1)
      : null;

  return (
    <div
      style={{
        background: C.card,
        borderRadius: 12,
        padding: 16,
        borderTop: `2px solid ${accent}`,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 700, color: accent }}>
        {value.toLocaleString()}
      </div>
      <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{label}</div>
      {pct != null && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            marginTop: 4,
            color: delta! >= 0 ? C.green : C.red,
          }}
        >
          {delta! >= 0 ? "+" : ""}
          {pct}%
        </div>
      )}
    </div>
  );
}
