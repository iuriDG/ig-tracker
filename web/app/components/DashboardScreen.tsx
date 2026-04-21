"use client";

import { useEffect, useState } from "react";
import { C, card } from "../styles";
import type { Snapshot, User } from "../types";
import GrowthChart from "./GrowthChart";
import StatCard from "./StatCard";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Delta({ value }: { value: number | null }) {
  if (value === null) return <span style={{ color: C.muted, fontSize: 11 }}>—</span>;
  if (value === 0) return <span style={{ color: C.muted, fontSize: 11 }}>±0</span>;
  const color = value > 0 ? C.green : "#f87171";
  return (
    <span style={{ color, fontSize: 11, fontWeight: 600 }}>
      {value > 0 ? "+" : ""}{value.toLocaleString()}
    </span>
  );
}

export default function DashboardScreen({
  user,
  onLogout,
  hideHeader = false,
}: {
  user: User;
  onLogout: () => void;
  hideHeader?: boolean;
}) {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/snapshots`)
      .then((r) => r.json())
      .then((s) =>
        setSnapshots(
          Array.isArray(s)
            ? s
                .filter((snap: Snapshot) => snap.user_id === user.id)
                .sort(
                  (a: Snapshot, b: Snapshot) =>
                    new Date(a.taken_at).getTime() - new Date(b.taken_at).getTime()
                )
            : []
        )
      )
      .finally(() => setLoading(false));
  }, [user.id]);

  const latest = snapshots[snapshots.length - 1];
  const prev = snapshots[snapshots.length - 2];

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 60px" }}>
        {/* Header */}
        {!hideHeader && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 32,
            }}
          >
            <div>
              <h1 style={{ fontSize: 36, fontWeight: 800, color: C.white, letterSpacing: -0.5, margin: 0 }}>
                adnova
              </h1>
              <p style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1.5, marginTop: 4 }}>
                SMARTER INSIGHTS · FASTER GROWTH
              </p>
            </div>
            <button onClick={onLogout} style={{ background: "none", border: "none", color: C.muted, fontSize: 14, cursor: "pointer", marginTop: 8 }}>
              Log out
            </button>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", paddingTop: 80, color: C.muted }}>
            Loading…
          </div>
        ) : (
          <>
            {/* Profile card */}
            <div style={card}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: C.card,
                    border: `2px solid ${C.blue}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    fontWeight: 700,
                    color: C.blue,
                    flexShrink: 0,
                  }}
                >
                  {user.username[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ color: C.white, fontSize: 17, fontWeight: 600 }}>
                    @{user.username}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 4,
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: C.green,
                      }}
                    />
                    <span style={{ color: C.green, fontSize: 11, fontWeight: 500 }}>
                      Live analysis
                    </span>
                  </div>
                </div>
              </div>

              {latest && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 12,
                  }}
                >
                  <StatCard
                    label="Followers"
                    value={latest.followers_count}
                    prev={prev?.followers_count}
                    accent={C.blue}
                  />
                  <StatCard
                    label="Following"
                    value={latest.following_count}
                    prev={prev?.following_count}
                    accent={C.purple}
                  />
                  <StatCard
                    label="Posts"
                    value={latest.posts_count}
                    prev={prev?.posts_count}
                    accent={C.lavender}
                  />
                </div>
              )}
            </div>

            {/* Growth chart */}
            {snapshots.length > 0 && (
              <div style={{ ...card, marginTop: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.white }}>
                  Follower Growth
                </div>
                {latest && (
                  <div
                    style={{
                      fontSize: 11,
                      color: C.muted,
                      marginTop: 3,
                      marginBottom: 16,
                    }}
                  >
                    Latest snapshot · {formatDate(latest.taken_at)}
                  </div>
                )}
                <GrowthChart snapshots={snapshots} />
              </div>
            )}

            {/* Snapshot history */}
            {snapshots.length > 0 && (
              <div style={{ ...card, marginTop: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 4 }}>
                  Snapshot History
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>
                  {snapshots.length} snapshot{snapshots.length !== 1 ? "s" : ""} · most recent first
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                        {[
                          { label: "Date", color: C.muted },
                          { label: "Followers", color: C.blue },
                          { label: "Following", color: C.purple },
                          { label: "Posts", color: C.lavender },
                        ].map(({ label, color }) => (
                          <th
                            key={label}
                            style={{
                              textAlign: "left",
                              color,
                              fontSize: 12,
                              fontWeight: 600,
                              paddingBottom: 10,
                              paddingRight: 16,
                            }}
                          >
                            {label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...snapshots].reverse().map((s, i, arr) => {
                        const older = arr[i + 1];
                        const df = older != null ? s.followers_count - older.followers_count : null;
                        const dfo = older != null ? s.following_count - older.following_count : null;
                        const dp = older != null ? s.posts_count - older.posts_count : null;
                        return (
                          <tr
                            key={s.id}
                            style={{
                              borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none",
                            }}
                          >
                            <td style={{ padding: "12px 16px 12px 0", minWidth: 110 }}>
                              <div style={{ color: C.white, fontSize: 13, fontWeight: 500 }}>
                                {formatDate(s.taken_at)}
                              </div>
                            </td>
                            <td style={{ padding: "12px 16px 12px 0" }}>
                              <div style={{ color: C.blue, fontWeight: 700, fontSize: 15 }}>
                                {s.followers_count.toLocaleString()}
                              </div>
                              <Delta value={df} />
                            </td>
                            <td style={{ padding: "12px 16px 12px 0" }}>
                              <div style={{ color: C.purple, fontWeight: 700, fontSize: 15 }}>
                                {s.following_count.toLocaleString()}
                              </div>
                              <Delta value={dfo} />
                            </td>
                            <td style={{ padding: "12px 0" }}>
                              <div style={{ color: C.lavender, fontWeight: 700, fontSize: 15 }}>
                                {s.posts_count.toLocaleString()}
                              </div>
                              <Delta value={dp} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
