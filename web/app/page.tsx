"use client";

import { useState } from "react";
import type { User } from "./types";
import { C } from "./styles";
import LoginScreen from "./components/LoginScreen";
import DashboardScreen from "./components/DashboardScreen";
import ProfilesScreen from "./components/ProfilesScreen";

type Tab = "dashboard" | "profiles";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<Tab>("dashboard");

  if (!user) return <LoginScreen onLogin={setUser} />;

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      {/* Top nav */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: C.cardDark, borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px",
      }}>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={() => setTab("dashboard")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "16px 16px", fontSize: 14, fontWeight: 600,
              color: tab === "dashboard" ? C.white : C.muted,
              borderBottom: `2px solid ${tab === "dashboard" ? C.blue : "transparent"}`,
              transition: "all 0.15s",
            }}
          >
            Dashboard
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => setUser(null)}
            style={{ background: "none", border: "none", color: C.muted, fontSize: 13, cursor: "pointer" }}
          >
            Log out
          </button>
          {/* Avatar — click to go to profile */}
          <button
            onClick={() => setTab("profiles")}
            style={{
              width: 34, height: 34, borderRadius: "50%", background: C.card,
              border: `2px solid ${tab === "profiles" ? C.blue : C.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: C.blue, cursor: "pointer",
              transition: "border-color 0.15s", flexShrink: 0,
            }}
          >
            {user.username[0].toUpperCase()}
          </button>
        </div>
      </div>

      {tab === "dashboard"
        ? <DashboardScreen user={user} onLogout={() => setUser(null)} hideHeader />
        : <ProfilesScreen user={user} onUpdate={setUser} />
      }
    </div>
  );
}
