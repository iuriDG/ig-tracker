"use client";

import { useState } from "react";
import { C, inputStyle } from "../styles";
import type { User } from "../types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

type Mode = "signin" | "signup";

export default function LoginScreen({ onLogin }: { onLogin: (u: User) => void }) {
  const [mode, setMode] = useState<Mode>("signin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [igId, setIgId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setUsername("");
    setPassword("");
    setConfirm("");
    setIgId("");
    setError(null);
  }

  function switchMode(m: Mode) {
    setMode(m);
    reset();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    if (mode === "signup" && password !== confirm) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const body: Record<string, string> = { username: username.trim(), password: password.trim() };
      if (mode === "signup" && igId.trim()) body.instagram_user_id = igId.trim();

      const res = await fetch(`${BASE_URL}/${mode === "signin" ? "login" : "signup"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) setError(json.error ?? "Something went wrong");
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
        <h1 style={{ fontSize: 42, fontWeight: 800, color: C.white, letterSpacing: -1, margin: 0 }}>
          adnova
        </h1>
        <p style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 2, marginTop: 4, marginBottom: 40 }}>
          SMARTER INSIGHTS · FASTER GROWTH
        </p>

        {/* Tab toggle */}
        <div
          style={{
            display: "flex",
            background: C.cardDark,
            borderRadius: 12,
            padding: 4,
            marginBottom: 16,
            border: `1px solid ${C.border}`,
          }}
        >
          {(["signin", "signup"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              style={{
                flex: 1,
                padding: "10px 0",
                border: "none",
                borderRadius: 9,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                background: mode === m ? C.card : "transparent",
                color: mode === m ? C.white : C.muted,
                transition: "all 0.15s",
              }}
            >
              {m === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            background: C.cardDark,
            borderRadius: 20,
            padding: 32,
            border: `1px solid ${C.border}`,
          }}
        >
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.white, margin: "0 0 6px" }}>
            {mode === "signin" ? "Welcome back" : "Create account"}
          </h2>
          <p style={{ fontSize: 13, color: C.muted, margin: "0 0 24px" }}>
            {mode === "signin" ? "Enter your credentials to continue" : "Fill in your details to get started"}
          </p>

          <input
            style={inputStyle(!!error)}
            placeholder="username"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(null); }}
            autoCapitalize="none"
            autoCorrect="off"
          />

          {mode === "signup" && (
            <input
              style={inputStyle(false)}
              placeholder="instagram user id (optional)"
              value={igId}
              onChange={(e) => setIgId(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
            />
          )}

          <input
            style={inputStyle(!!error)}
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(null); }}
          />

          {mode === "signup" && (
            <input
              style={inputStyle(!!error)}
              type="password"
              placeholder="confirm password"
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setError(null); }}
            />
          )}

          {error && <p style={{ color: C.red, fontSize: 13, margin: "0 0 12px" }}>{error}</p>}

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
            {loading ? "Please wait…" : mode === "signin" ? "Log In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
