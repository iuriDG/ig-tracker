import type { CSSProperties } from "react";

export const C = {
  bg: "#07060b",
  card: "#0B1F6A",
  cardDark: "#080f35",
  blue: "#9FB6FF",
  purple: "#8A73D6",
  lavender: "#D86BEA",
  orange: "#F97316",
  white: "#FFFFFF",
  muted: "#7B8AB8",
  border: "#1a2f7a",
  green: "#4ade80",
  red: "#f87171",
} as const;

export const card: CSSProperties = {
  background: C.cardDark,
  borderRadius: 20,
  padding: 24,
  border: `1px solid ${C.border}`,
};

export function inputStyle(hasError: boolean): CSSProperties {
  return {
    width: "100%",
    background: C.card,
    border: `1px solid ${hasError ? C.red : C.border}`,
    borderRadius: 12,
    padding: "14px 16px",
    color: C.white,
    fontSize: 16,
    marginBottom: 12,
    boxSizing: "border-box",
    outline: "none",
  };
}
