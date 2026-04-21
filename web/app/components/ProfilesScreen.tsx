"use client";

import { useState } from "react";
import { C, card, inputStyle } from "../styles";
import type { User } from "../types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function ProfilesScreen({
  user,
  onUpdate,
}: {
  user: User;
  onUpdate: (u: User) => void;
}) {
  const [username, setUsername] = useState(user.username);
  const [igId, setIgId] = useState(user.instagram_user_id ?? "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (password && password !== confirm) { setError("Passwords don't match"); return; }
    setLoading(true);
    setError(null);
    try {
      const body: Record<string, string> = {
        username: username.trim(),
        instagram_user_id: igId.trim(),
      };
      if (password.trim()) body.password = password.trim();

      const res = await fetch(`${BASE_URL}/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Update failed"); return; }
      onUpdate(json.user);
      setPassword("");
      setConfirm("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 60px" }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.white, marginBottom: 24 }}>My Profile</div>

      <div style={card}>
        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%", background: C.card,
            border: `2px solid ${C.blue}`, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 26, fontWeight: 700, color: C.blue, flexShrink: 0,
          }}>
            {user.username[0].toUpperCase()}
          </div>
          <div>
            <div style={{ color: C.white, fontSize: 20, fontWeight: 700 }}>@{user.username}</div>
            {user.instagram_user_id && (
              <div style={{ color: C.muted, fontSize: 13, marginTop: 3 }}>
                Instagram ID: {user.instagram_user_id}
              </div>
            )}
          </div>
        </div>

        {success && (
          <div style={{ background: "#14532d", border: `1px solid ${C.green}`, borderRadius: 10, padding: "10px 14px", marginBottom: 16, color: C.green, fontSize: 13 }}>
            Profile updated successfully.
          </div>
        )}

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: 16, color: C.muted, fontSize: 13, fontWeight: 600, letterSpacing: 0.5 }}>
            ACCOUNT DETAILS
          </div>

          <label style={{ color: C.muted, fontSize: 12, display: "block", marginBottom: 4 }}>Username</label>
          <input
            style={inputStyle(false)}
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(null); }}
            autoCapitalize="none"
            autoCorrect="off"
          />

          <label style={{ color: C.muted, fontSize: 12, display: "block", marginBottom: 4 }}>Instagram User ID</label>
          <input
            style={inputStyle(false)}
            value={igId}
            onChange={(e) => setIgId(e.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
          />

          <div style={{ marginTop: 20, marginBottom: 12, color: C.muted, fontSize: 13, fontWeight: 600, letterSpacing: 0.5 }}>
            CHANGE PASSWORD <span style={{ fontWeight: 400, fontSize: 11 }}>(leave blank to keep current)</span>
          </div>

          <label style={{ color: C.muted, fontSize: 12, display: "block", marginBottom: 4 }}>New Password</label>
          <input
            style={inputStyle(!!error && !!password)}
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(null); }}
          />

          <label style={{ color: C.muted, fontSize: 12, display: "block", marginBottom: 4 }}>Confirm Password</label>
          <input
            style={inputStyle(!!error && !!confirm)}
            type="password"
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setError(null); }}
          />

          {error && <p style={{ color: C.red, fontSize: 13, margin: "0 0 12px" }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: C.orange, color: C.white, border: "none", borderRadius: 10,
              padding: "12px 24px", fontSize: 14, fontWeight: 700, marginTop: 8,
              cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
