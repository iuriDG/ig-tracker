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

export default function DashboardScreen({
  user,
  onLogout,
}: {
  user: User;
  onLogout: () => void;
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 32,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: C.white,
                letterSpacing: -0.5,
                margin: 0,
              }}
            >
              adnova
            </h1>
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: C.muted,
                letterSpacing: 1.5,
                marginTop: 4,
              }}
            >
              SMARTER INSIGHTS · FASTER GROWTH
            </p>
          </div>
          <button
            onClick={onLogout}
            style={{
              background: "none",
              border: "none",
              color: C.muted,
              fontSize: 14,
              cursor: "pointer",
              marginTop: 8,
            }}
          >
            Log out
          </button>
        </div>

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
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: C.white,
                    marginBottom: 16,
                  }}
                >
                  Snapshot History
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                      {["Date", "Followers", "Following", "Posts"].map((h) => (
                        <th
                          key={h}
                          style={{
                            textAlign: "left",
                            color: C.muted,
                            fontSize: 12,
                            fontWeight: 600,
                            paddingBottom: 10,
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...snapshots].reverse().map((s, i) => (
                      <tr
                        key={s.id}
                        style={{
                          borderBottom:
                            i < snapshots.length - 1
                              ? `1px solid ${C.border}`
                              : "none",
                        }}
                      >
                        <td
                          style={{
                            color: C.muted,
                            fontSize: 13,
                            padding: "10px 0",
                          }}
                        >
                          {formatDate(s.taken_at)}
                        </td>
                        <td
                          style={{
                            color: C.blue,
                            fontWeight: 700,
                            fontSize: 14,
                            padding: "10px 0",
                          }}
                        >
                          {s.followers_count.toLocaleString()}
                        </td>
                        <td
                          style={{
                            color: C.purple,
                            fontWeight: 700,
                            fontSize: 14,
                            padding: "10px 0",
                          }}
                        >
                          {s.following_count.toLocaleString()}
                        </td>
                        <td
                          style={{
                            color: C.lavender,
                            fontWeight: 700,
                            fontSize: 14,
                            padding: "10px 0",
                          }}
                        >
                          {s.posts_count.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
