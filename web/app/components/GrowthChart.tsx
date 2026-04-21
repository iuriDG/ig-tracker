"use client";

import { useEffect, useRef, useState } from "react";
import { C } from "../styles";
import type { Snapshot } from "../types";

const CHART_WIDTH = 820;
const CHART_HEIGHT = 160;
const PAD_X = 20;
const PAD_Y = 20;
const DURATION = 1400;

function buildSmoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const curr = pts[i];
    const next = pts[i + 1];
    const cpX = (curr.x + next.x) / 2;
    d += ` C ${cpX} ${curr.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
  }
  return d;
}

export default function GrowthChart({ snapshots }: { snapshots: Snapshot[] }) {
  const [progress, setProgress] = useState(0);
  const animRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    setProgress(0);
    startRef.current = null;
    if (animRef.current) cancelAnimationFrame(animRef.current);

    function tick(ts: number) {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / DURATION, 1);
      setProgress(p);
      if (p < 1) animRef.current = requestAnimationFrame(tick);
    }

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [snapshots]);

  const values = snapshots.map((s) => s.followers_count);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;
  const isSingle = snapshots.length === 1;

  const points = snapshots.map((s, i) => ({
    x: isSingle
      ? CHART_WIDTH / 2
      : PAD_X + (i / (snapshots.length - 1)) * (CHART_WIDTH - PAD_X * 2),
    y: isSingle
      ? CHART_HEIGHT / 2
      : PAD_Y + (1 - (s.followers_count - minVal) / range) * (CHART_HEIGHT - PAD_Y * 2),
  }));

  const smoothPath = buildSmoothPath(points);
  const areaPath =
    points.length > 1
      ? `M ${points[0].x} ${CHART_HEIGHT} ` +
        buildSmoothPath(points).slice(1) +
        ` L ${points[points.length - 1].x} ${CHART_HEIGHT} Z`
      : "";

  const clipWidth = progress * CHART_WIDTH;

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg
        width="100%"
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.blue} stopOpacity="0.25" />
            <stop offset="100%" stopColor={C.blue} stopOpacity="0" />
          </linearGradient>
          <clipPath id="reveal">
            <rect x="0" y="0" width={clipWidth} height={CHART_HEIGHT} />
          </clipPath>
        </defs>

        <g clipPath="url(#reveal)">
          {areaPath && <path d={areaPath} fill="url(#areaGrad)" />}
          {smoothPath && (
            <path
              d={smoothPath}
              fill="none"
              stroke={C.blue}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          )}
          {isSingle && (
            <line
              x1={PAD_X} y1={CHART_HEIGHT / 2}
              x2={CHART_WIDTH - PAD_X} y2={CHART_HEIGHT / 2}
              stroke={C.blue} strokeWidth={1}
              strokeDasharray="4 6" strokeOpacity={0.4}
            />
          )}
          {points.map((p, i) => (
            <circle
              key={i} cx={p.x} cy={p.y}
              r={isSingle ? 7 : 4}
              fill={C.bg} stroke={C.blue} strokeWidth={2.5}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
