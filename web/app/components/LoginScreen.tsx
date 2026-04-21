"use client";

import { useState } from "react";
import { C, inputStyle } from "../styles";
import type { User } from "../types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function LoginScreen({ onLogin }: { onLogin: (u: User) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });
      const json = await res.json();
      if (!res.ok) setError(json.error ?? "Login failed");
      else onLogin(json.user);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <h1
          style={{
            fontSize: 42,
            fontWeight: 800,
            color: C.white,
            letterSpacing: -1,
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
            letterSpacing: 2,
            marginTop: 4,
            marginBottom: 40,
          }}
        >
          SMARTER INSIGHTS · FASTER GROWTH
        </p>

        <form
          onSubmit={handleLogin}
          style={{
            background: C.cardDark,
            borderRadius: 20,
            padding: 32,
            border: `1px solid ${C.border}`,
          }}
        >
          <h2
            style={{ fontSize: 22, fontWeight: 700, color: C.white, margin: "0 0 6px" }}
          >
            Welcome back
          </h2>
          <p style={{ fontSize: 13, color: C.muted, margin: "0 0 24px" }}>
            Enter your credentials to continue
          </p>

          <input
            style={inputStyle(!!error)}
            placeholder="username"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(null); }}
            autoCapitalize="none"
            autoCorrect="off"
          />
          <input
            style={inputStyle(!!error)}
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(null); }}
          />

          {error && (
            <p style={{ color: C.red, fontSize: 13, margin: "0 0 12px" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: C.orange,
              color: C.white,
              border: "none",
              borderRadius: 12,
              padding: "16px 0",
              fontSize: 16,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              marginTop: 4,
            }}
          >
            {loading ? "Logging in…" : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
